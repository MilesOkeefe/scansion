//load jQuery, scan the inputted string when the button is pressed.
$(function(){
	$("#scan").click(function(){
		$("#result").html(scan($("#sentence").val()));
	});
});
//takes a latin sentence as input, returns the same latin sentence with scansion, marks represented in HTML
function scan(input){
	input = input.toLowerCase();
	var words = input.split(" "); //split sentence into individual words
	var result = "";
	for(var i = 0; i < words.length; i++){
		var word = words[i];

		//var letters = word.match(/a|o|e|i|u/g);

		result += word + " ";
	}
	return result;
}
function markLong(letter){
	if(letter == 'a'){
		return letter.replace('a', '&#257;');
	}else if(letter == 'e'){
		return letter.replace('e', '&#275;');
	}else if(letter == 'i'){
		return letter.replace('i', '&#299;');
	}else if(letter == 'o'){
		return letter.replace('o', '&#333;');
	}else if(letter == 'u'){
		return letter.replace('u', '&#363;');
	}else if(letter == 'y'){
		return letter.replace('y', '&#563;');
	}
}
function markShort(letter){
	if(letter == 'a'){
		return letter.replace('a', '&#259;');
	}else if(letter == 'e'){
		return letter.replace('e', '&#277;');
	}else if(letter == 'i'){
		return letter.replace('i', '&#301;');
	}else if(letter == 'o'){
		return letter.replace('o', '&#335;');
	}else if(letter == 'u'){
		return letter.replace('u', '&#365;');
	}
}