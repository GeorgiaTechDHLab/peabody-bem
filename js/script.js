//TODO: 9 squares, change the way ID's are assigned, split into triangles
//idea: have an object with attributes rect, num clicks,
$( document ).ready(function() { //had to use jquery because my 
	//document.getElementByID was being called before the ID in the document was created
	//but now we can just use jquery syntax instead of doc.getelementbyid
  var myFunction = function(){
    document.getElementById("demo").innerHTML = "Hello World";
  }

	 //currColor will be to hold whatever color the user clicks on to use
	var currColor;

	//clicks is a tracker of the number of times svg is clicked, to rotate through solid color, split color, no color
	var clicks;
	clicks = 0;
	var clicksEP; //same purpose as clicks.
	clicksEP = 0;

	//array of group elements that represent one year bounding box
	var yearBoxes =[];

  //need to be able to access year ID and type ID outside of functions 
  //values 0-99, for 100 years
  var yearID;
  //values 0-8, for 9 types of events 
  var typeID; 

  //array for all 900 rectangles h
  var rect = [];


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

    var makeGrid2 = function(boxesPerSide, size, pixelsPerSide, strokeWidth){

      //whole svg 
      var svg = document.createSvg("svg");
      svg.setAttribute("width", pixelsPerSide);
      svg.setAttribute("height", pixelsPerSide);
      
      //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
      var maing = document.createSvg("g");
      maing.setAttribute("id", "maing");
      maing.setAttribute("width", pixelsPerSide);
      maing.setAttribute("height", pixelsPerSide);
      // maing.setAttribute("transform", ["translate(60,60)"]); //test if objects are grouped together

      //"physical" bg element, this goes on top of "maing", a little redundant but think of it as the physical object in the container
      var bg = document.createSvg("rect");
      var sizeBG = (size * boxesPerSide) + 18;
      bg.setAttribute("id","bg");
      bg.setAttribute("width", sizeBG + 50);
      bg.setAttribute("height", sizeBG + 50);
      bg.setAttribute("fill","black");
      bg.setAttribute("fill-opacity",".1");

      //one year as a test, this will contain 9 types
      //because it is "g" and not "svg" it isn't actually a "physical" object, 
      //but a container/grouping for all the types that make up the year
      //any style or attribute applied to this year will filter to the types that make it up
      var year1 = document.createSvg("g");
      year1.setAttribute("id", "year3");
      year1.setAttribute("width", size);
      year1.setAttribute("height", size);   
      // year3.setAttribute("transform", ["translate(30,30)"]); //test if objects are grouped together, moves year as one unit


      //type1 as a test
      var type1 = document.createSvg("rect");
      type1.setAttribute("id", "type1");
      type1.setAttribute("width", 20);
      type1.setAttribute("height", 20);
      type1.setAttribute("fill", "red");
      type1.setAttribute("transform", ["translate(0,0)"]); //moves individual type square within the year 

      //type2 as a test
      var type2 = document.createSvg("rect");
      type2.setAttribute("id", "type1");
      type2.setAttribute("width", 20);
      type2.setAttribute("height", 20);
      type2.setAttribute("fill", "yellow");
      type2.setAttribute("transform", ["translate(20,0)"]); //moves individual type square within the year 

      //type3 as a test
      var type3 = document.createSvg("rect");
      type3.setAttribute("id", "type1");
      type3.setAttribute("width", 20);
      type3.setAttribute("height", 20);
      type3.setAttribute("fill", "blue");
      type3.setAttribute("transform", ["translate(40,0)"]); //moves individual type square within the year 

      //could code in all 9 types to make up one square...but I think you get it :)

      //append maing to svg
      svg.appendChild(maing);

      //the bg and year belong to the maing
      maing.appendChild(bg);
      maing.appendChild(year1);

      //all the types belong to the year, in a loop year1-25 needs to be created with 9 types each 
      year1.appendChild(type1);
      year1.appendChild(type2);
      year1.appendChild(type3);

      return svg;
    }
    
    var makeGrid = function(boxesPerSide, size, pixelsPerSide, strokeWidth) {
    	//size = width/height of one box
    	//pixelsPerSide = width/height of viewport
        var svg = document.createSvg("svg");
        svg.setAttribute("width", pixelsPerSide);
        svg.setAttribute("height", pixelsPerSide);
        // svg.setAttribute("x", "10");//top&left stroke displayed while bottom&right no longer displayed
        // svg.setAttribute("y", "10");
        
        for(var i = 0; i < boxesPerSide; i++) {
            for(var j = 0; j < boxesPerSide; j++) {
              var g = document.createSvg("g"); //attach svg to html page 
              yearBoxes.push(g); //make 3x3 boxes 
              g.setAttribute("transform", ["translate(", i*size, ",", j*size, ")"].join("")); //+10 to offset origin/first x&y coordinate, but then bug in 9 squares
              var number = boxesPerSide * i + j; //keeps track of which number box we are on so we can give the boxes an id //can add +1 so natural counting starting at 1
              var box = document.createSvg("rect");
              box.setAttribute("width", size);
              box.setAttribute("height", size);
              box.setAttribute("stroke", "black");
              box.setAttribute("stroke-width",strokeWidth); //having issues with the stroke
              box.setAttribute("fill", "white");
              box.setAttribute("id", "b" + number); //"b" + 
              // console.log(number); //prints 0-224 four times, for each quadrant //now prints out 0-8 for each type within year 
              // box.addEventListener("click", function(){console.log(typeID)}); //id ends up always being 224 //now 8 ... which is correct 
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
    
   //EP original 
    var container = document.getElementById("gridContainer");
    container.appendChild(makeGrid(5, 60, 320, 2)); //makes one 5x5 quadrant with boxes 60 px wide inside a 320x320 viewport
    container.appendChild(makeGrid(5, 60, 320, 2));
	  container.appendChild(makeGrid(5, 60, 320, 2));
    container.appendChild(makeGrid(5, 60, 320, 2));
    //100 year boxes 
    // console.log("yearBoxes length: ");
    // console.log(yearBoxes.length);
    $.each(yearBoxes,function(i,obj){
    	obj.appendChild(makeGrid(3,obj.childNodes[0].getAttribute("width")/3,60,0));
    });
    //1000 year boxes 
    // console.log("yearBoxes length: ");
    // console.log(yearBoxes.length);
    //NOTE: now the yearBoxes array has all the year groups, plus all the sets of 9 svg groups after that since makeGrid has yearBoxes.push
    //maybe use this array (or an array) to assign ids?

    var container2 = document.getElementById("gridContainer2");
    container2.appendChild(makeGrid2(5, 60, 320, 2));

    // $("gridContainer2").append(makeGrid2(5, 60, 320, 2));


 });
