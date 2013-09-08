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
		if(word.match('e')){
			word = word.replace('e', '&#275;');
		}
		//var letters = word.match(/a|o|e|i|u/g);

		result += word + " ";
	}
	return result;
}