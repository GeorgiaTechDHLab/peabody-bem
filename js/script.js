$( document ).ready(function() { //had to use jquery because my 
	//document.getElementByID was being called before the ID in the document was created
	//but now we can just use jquery syntax instead of doc.getelementbyid

	 //currColor will be to hold whatever color the user clicks on to use
	var currColor;

	//clicks is a tracker of the number of times svg is clicked, to rotate through solid color, split color, no color
	var clicks;
	clicks = 0;
	var clicksEP; //same purpose as clicks.
	clicksEP = 0;


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

	function changeSquare(element){
		if(clicksEP == 0){
			clicksEP = 1;
			element.setAttribute("fill","blue");
		}else if(clicksEP == 1){
			clicksEP = 2;
			//this should really be the square split into triangles, need to figure out how to do that 
			element.setAttribute("fill","maroon");
		}else{ //if clicks == 2
			clicksEP = 0;
			element.setAttribute("fill","white");
		}
	}


	//this function is used as the short form for: document.createElementNS("http://www.w3.org/2000/svg", "tagname");
	//which is how you make an svg using javascript
	 document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
    };
    
    var makeGrid = function(boxesPerSide, size, pixelsPerSide, parent) {
    	//size = width/height of one box
    	//pixelsPerSide = width/height of viewport
        var svg = document.createSvg("svg");//creates svg inside of parent html element
        svg.setAttribute("width", pixelsPerSide);
        svg.setAttribute("height", pixelsPerSide);
        
        for(var i = 0; i < boxesPerSide; i++) {
            for(var j = 0; j < boxesPerSide; j++) {
              var g = document.createSvg("g");
              g.setAttribute("transform", ["translate(", i*size, ",", j*size, ")"].join(""));
              var number = boxesPerSide * i + j; //keeps track of which number box we are on so we can give the boxes an id
              var box = document.createSvg("rect");
              box.setAttribute("width", size);
              box.setAttribute("height", size);
              box.setAttribute("stroke", "black");
              box.setAttribute("fill", "white");
              box.setAttribute("id", "b" + number); 
              box.classList.add("square"); 
              //is it possible to add custom attributes of a rectangle? like country or historical event...
              g.appendChild(box);
              svg.appendChild(g);
            }  
        }

        svg.addEventListener(
            "click",
            function(e){
                if($.inArray("square", $(event.target)[0].classList) != -1){
                    changeSquare(e.target);
                }
            },
            false);
        return svg;
    };
    
    var container = document.getElementById("gridContainer");
    container.appendChild(makeGrid(5, 50, 315)); //makes one 5x5 quadrant with boxes 50 px wide inside a 315x315 viewport
    container.appendChild(makeGrid(5, 50, 315));
	container.appendChild(makeGrid(5, 50, 315));
    container.appendChild(makeGrid(5, 50, 315));
    

 });
