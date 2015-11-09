//PROBLEMS!! :P
$( document ).ready( function(){

	//currColor will be to hold whatever color the user clicks on to use
	var currColor;

	//js file is not executing
	console.log("in javascript");

	//attempting to get one of the type squares by ID
	var type = document.getElementByID("yr1type1");

	type.onclick = function(){
		alert("You clicked on a type square");
	}

	//"changeColor is not defined"
	function changeColor(){
		console.log("in changeColor");
		this.style['fill'] = 'green';
	}



}