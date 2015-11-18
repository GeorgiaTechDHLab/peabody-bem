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


      //because it is "g" and not "svg" it isn't actually a "physical" object, 
      //but a container/grouping for all the types that make up the year


      //append maing to svg
      svg.appendChild(maing);

      //the bg belong to the maing
      maing.appendChild(bg);


      for(var i = 0; i < boxesPerSide; i++) {
            for(var j = 0; j < boxesPerSide; j++) {
              var numYear = boxesPerSide * i + j; //which number year box we're on
              var yearBox = document.createSvg("g");
              yearBox.setAttribute("width", size);
                yearBox.setAttribute("height", size);
                yearBoxes.push(yearBox); //use this array to assign ID 0-99
                maing.appendChild(yearBox);
              for(var numType = 0; numType < 9; numType++){ //for 9 times, create a type square and append to current year box
                var type = document.createSvg("rect");
              type.setAttribute("id", "type" + numType); //each type square has an ID according to its type: 0-8
              type.setAttribute("width", size/3);
              type.setAttribute("height", size/3);
              type.setAttribute("fill", "blue");
              if(numType == 0 || numType == 1 || numType == 2){
                type.setAttribute("transform", ["translate(" + (numType) * size/3,0 + ")"]); //moves individual type square
            }
            else if(numType == 3 || numType == 4 || numType == 5){
                type.setAttribute("transform", ["translate(" + (numType-3) * size/3,size/3 + ")"]);
            }
            else if(numType == 6 || numType == 7 || numType == 8){
                type.setAttribute("transform", ["translate(" + (numType-6) * size/3,2*(size/3) + ")"]);
            }
                  yearBox.appendChild(type);
              }
              yearBox.setAttribute("transform", ["translate(", j*size, ",", i*size, ")"].join("")); //need to offset so you can see bkg and not use stroke
              
            }
        }

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
              g.appendChild(box);
              svg.appendChild(g);
            }  
        }

        svg.addEventListener( //adds event listener to each yearBox
            "click",
            function(e){
                if($.inArray("square", $(event.target)[0].classList) != -1){
                    changeSquare(e.target); //the target is the individual type box
                }
            },
            false);
        return svg;
    };
    

    var container2 = document.getElementById("gridContainer");
    container2.appendChild(makeGrid2(5, 60, 320, 2)); //makes one 5x5 quadrant with boxes 60 px wide inside a 320x320 viewport
    // $("gridContainer").append(makeGrid2(5, 60, 320, 2));

    //any style or attribute applied to a year will filter to the types that make it up
    $.each(yearBoxes,function(i,obj){ //do this after ALL grids are created
      obj.setAttribute("id","year" + i);
    });


 });
