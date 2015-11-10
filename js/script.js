// $( document ).ready(function() {

	 //currColor will be to hold whatever color the user clicks on to use
	var currColor;

	//clicks is a tracker of the number of times svg is clicked, to rotate through solid color, split color, no color
	var clicks;
	clicks = 0;


	//function to change the content of the square, to either new color, split color, or no color
	function changeSquare(){
		if(clicks == 0){
			clicks = 1;
			document.getElementById("yr1type3").setAttribute("class","turquoise");
		}else if(clicks == 1){
			clicks = 2;
			//this should really be the square split into triangles, need to figure out how to do that 
			document.getElementById("yr1type3").setAttribute("class","maroon");
		//clicks == 2
		}else{
			clicks = 0;
			document.getElementById("yr1type3").setAttribute("class","white");
		}
	}



// });
