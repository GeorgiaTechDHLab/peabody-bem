//idea: have an object with attributes rect, num clicks,
$( document ).ready(function() { //had to use jquery because my 
  //document.getElementByID was being called before the ID in the document was created
  //but now we can just use jquery syntax instead of doc.getelementbyid
  var myFunction = function(){
    document.getElementById("demo").innerHTML = "Hello World";
  }

   //currColor will be to hold whatever color the user clicks on to use
  var currColor = "yellow";

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



  function changeSquare(element){
    var w = element.getAttribute('width');
    var t = element.getAttribute('transform');
    if(clicksEP == 0){
      clicksEP = 1;
      element.setAttribute("fill","maroon");
    }else if(clicksEP == 1){ //draw triangle using currColor
      clicksEP = 2;
      //create the polygon svg element
      var triangle = document.createSvg("polygon");
      //create a string of the triangle's coordinates
      var pts =  "0,0 " + "0," + w + " " + w + "," + w;
      //specify coordinates
      triangle.setAttribute("points", pts);
      //translate the triangle by the same amount that the typerect has been translated
      triangle.setAttribute("transform", t);
      //change color
      triangle.setAttribute('fill', currColor);
      //set triangle's parent as yearbox
      element.parentNode.appendChild(triangle);
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

    var makeGrid2 = function(boxesPerSide, size, pixelsPerSide, currYearID){

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
                yearBox.setAttribute("id", "year" + currYearID);
                currYearID = currYearID + 1;
                maing.appendChild(yearBox);
                yearBox.addEventListener( //adds event listener to each yearBox
                "click",
                function(e){
                    {
                        changeSquare(e.target); //the target is the individual type box
                    }
                },
                 false);
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
            //any style or attribute applied to a year will filter to the types that make it up
                  yearBox.appendChild(type);
              } //end for loop
              yearBox.setAttribute("transform", ["translate(", j*size + j*8, ",", i*size + i*8, ")"].join("")); //offset to see bkg
              
            }
        }

      return svg;
    }

    

    var container2 = document.getElementById("gridContainer");
    container2.appendChild(makeGrid2(5, 60, 340, 0)); //makes one 5x5 quadrant with boxes 60 px wide inside a 340x340 viewport
    container2.appendChild(makeGrid2(5, 60, 340, 25));
    container2.appendChild(makeGrid2(5, 60, 340, 50));
    container2.appendChild(makeGrid2(5, 60, 340, 75));



 });
