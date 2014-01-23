$(function(){
	var vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
	var cap_vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];
	var long_vowels = ["ā", "ē", "ī", "ō", "ū", "ȳ"];
	var cap_long_vowels = ['Ā', 'Ē', 'Ī', 'Ō', 'Ū', 'Ȳ'];
	var short_vowels  = ['ă', 'ĕ', 'ĭ', 'ŏ', 'ŭ'];
	var cap_short_vowels = ['Ă', 'Ĕ', 'Ĭ', 'Ŏ', 'Ŭ'];
	var dipthongs = ['ae', 'au', 'oe', 'ei', 'eu', 'oi', 'ui'];
	var long_dipthongs = ['āē', 'āū', 'ōē', 'ēī', 'ēū', 'ōī', 'ūī'];


	function getLongVowel(unmarkedVowel){
		var max = vowels.length;
		for(var i = 0; i < max; i++){
			if(vowels[i] == unmarkedVowel){
				return long_vowels[i];
			}
		}
	}
	function getCapLongVowel(unmarkedVowel){
		var max = vowels.length;
		for(var i = 0; i < max; i++){
			if(cap_vowels[i] == unmarkedVowel){
				return cap_long_vowels[i];
			}
		}
	}
	//in dactylic hexameter, the first vowel is always long
	function markFirstVowelLong(sentence){
		var max = sentence.length-1;
		var newSentence = "";
		var letter = "";
		for(var i = 0; i < max; i++){
			letter = sentence.substring(i, i+1);
			for(var k = 0; k < vowels.length; k++){
				if(letter == vowels[k]){
					newSentence += long_vowels[k];
					newSentence += sentence.substring(i+1);
					return newSentence;
				}
			}
			newSentence += letter;
		}
		return newSentence;
	}
	function markDipthongs(sentence){
		var max = dipthongs.length;
		//var newSentence = "";
		//var letter = "";
		var loc = 0;
		for(var i = 0; i < max; i++){
			loc = sentence.indexOf(dipthongs[i]);
			while(loc != -1){ //repeat until no instances of this dipthong are found
				var longDipthongString = "";
				var dipthong = dipthongs[i];
				var dipthongSize = dipthongs[i].length;
				for(var k = 0; k < dipthongSize; k++){
					var letter = dipthong.substring(k, k+1);
					longDipthongString +=  long_vowels[vowels.indexOf(letter)];
				}
				sentence = sentence.substring(0, loc) + longDipthongString + sentence.substring(loc+2);
				//console.log(sentence);
				loc = sentence.indexOf(dipthongs[i]);
			}
			//letter = sentence.substring(i, i+1);
			//newSentence += letter;
		}
		return sentence;
	}
	function markOutQs(sentence){
		sentence = sentence.replace(/qu/g, 'qu̶');
		return sentence;
	}
	function elide(sentence){
		try{
			var matches = sentence.match(/([aeiouy])(m*)\s((h*)[aeiouy])/g); //finds vowel + vowel, vowel-m + vowel, vowel + h-vowel elisions
			var max = matches.length;
			for(var i = 0; i < max; i++){
				//var vowel = matches[i].match(/[aeiouy]{1}/i)[0];
				//var longVowel = getLongVowel(vowel);
				//var loc = sentence.indexOf(matches[i]);
				//sentence = sentence.substring(0, loc) + longVowel + sentence.substring(loc+1);
				sentence = sentence.replace(matches[i], matches[i].replace(' ', '').toUpperCase());
			}
		}catch(e){
			console.log('no elisions found');
		}
		return sentence;
	}
	function markByPosition(sentence){
		var matches = sentence.match(/(?!i\S)(([aeiouy]{1})|([[AEIOY]{2}))(?!ch|ph|th)(?! ([bcdgp][lr]))(([^aāAeēEiīIoōOuūUyȳY ]{2,})|([^aāAeēEiīIoōOuūUyȳY]{3,})|(x))/g); //finds consonants which precede 2 vowels
		//regex explanation
		//(?!i\S) is to prevent words that start with an i from being matched, as it almost always counts as a j
		//(x) matches the letter x instead of two general consonants because x counts as two
		//(?!ch|ph|th) doesn't count h's as consonants because they aren't pronounced
		var max = matches.length;
		for(var i = 0; i < max; i++){
			var vowel = matches[i].match(/([aeiouy]{1})|([[AEIOY]{2})/g)[0];
			if(vowel.length == 1){
				var longVowel = getLongVowel(vowel);
				var loc = sentence.indexOf(matches[i]);
				sentence = sentence.substring(0, loc) + longVowel + sentence.substring(loc+1);
			}else if(vowel.length == 2){
				var vowels = vowel.split('');
				var loc = sentence.indexOf(matches[i])
				for(var k = 0; k < vowels.length; k++){
					var longVowel = getCapLongVowel(vowels[k]);
					loc += k;
					sentence = sentence.substring(0, loc) + longVowel + sentence.substring(loc+1);
				}
			}
		}
		return sentence;
	}
	function prettyify(sentence){
		//color dipthongs
		var max = long_dipthongs.length;
		for(var i = 0; i < max; i++){
			var dipthong = long_dipthongs[i];
			var r = new RegExp(dipthong, "g");
			sentence = sentence.replace(r, "<span class='diphthong'>" + dipthong +"</span>");
		}
		//color long by position
		var matches = sentence.match(/([āēīōūȳ]{1})(([^aāeēiīoōuūyȳ ]{2,})|([^aāeēiīoōuūyȳ]{3,}))/g); //finds consonants which precede 2 vowels
		var max = matches.length;
		for(var i = 0; i < max; i++){
			var vowel = matches[i].match(/[āēīōūȳ]{1}/i)[0];
			var loc = sentence.indexOf(matches[i]);
			sentence = sentence.substring(0, loc) + "<span class='long-by-position'>" + vowel + "</span>" + sentence.substring(loc+1);
		}
		//color elisions
		var matches = sentence.match(/[ĀĒĪŌŪȲ]{2}/g);
		var max = matches.length;
		for(var i = 0; i < max; i++){
			var vowel = matches[i];//.match(/[āēīōūȳ]{1}/i)[0];
			var loc = sentence.indexOf(vowel);
			sentence = sentence.substring(0, loc) + "<span class='elision'>" + vowel.toLowerCase() + "</span>" + sentence.substring(loc+2);
		}
		return sentence;
	}
	function scan(sentence){
		sentence = sentence.toLowerCase();
		sentence = sentence.replace(/[,.;?!']/g, ""); //remove punctuation

		sentence = markOutQs(sentence);
		sentence = markFirstVowelLong(sentence);
		sentence = markDipthongs(sentence);
		sentence = elide(sentence);
		sentence = markByPosition(sentence);

		sentence = prettyify(sentence); //makes the sentence look good after all syntax is taken care of
		return sentence;
	}
	function start_scan(){
		var input = $("#latin-input").val();
		$("#latin-output").html(scan(input));
		$("#key").show();
	}
	start_scan(); //TODO remove (only for dev testing)
	$("#scan-button").click(start_scan);
	$("#latin-input").keydown(function(e){
		if(e.keyCode == 13) /* enter key*/
			start_scan();
	});	
});