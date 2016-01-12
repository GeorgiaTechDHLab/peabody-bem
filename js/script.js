$( document ).ready(function() { //had to use jquery because my 
  //document.getElementByID was being called before the ID in the document was created
  //but now we can just use jquery syntax instead of doc.getelementbyid
  var myFunction = function(){
    document.getElementById("demo").innerHTML = "Hello World";
  }

  //the number of colors/countries represented
  var numColors = 6;

   //currColor will be to hold whatever color the user squareState on to use
  var currColor = "#722712";

  //prevColor will hold whatever the previous color of the square was
  var prevColor = "";

  //squareState keeps track of the current state of the square (whether it is empty, solid, split)
  var squareState;
  squareState = 0;

  //array of group elements that represent one year bounding box
  var yearBoxes =[];

  //need to be able to access year ID and type ID outside of functions 
  //values 0-99, for 100 years
  var yearID;
  //values 0-8, for 9 types of events 
  var typeID; 

  //array for all 900 rectangles h
  var rect = [];

  /*TODO: update chart title based on which event list is active (sample or custom titled)*/
  function updateChartTitle(element){

    //need title variable from event list

    //#chartTitle is id for title above chart

  }

  /*if we want to use right-click functionality instead: http://www.sitepoint.com/building-custom-right-click-context-menu-javascript/ */

  /*function changes type square based on current square state and color. currently states are identified by number, could have 
  better-named string variables but doesn't matter*/
  function changeSquare(element){
    var w = element.getAttribute('width');
    var t = element.getAttribute('transform');

    //create the polygon svg elements for the triangle overlay 
    var triangle = document.createSvg("polygon");  //triangle order 1
    var triangle2 = document.createSvg("polygon"); //triangle order 2




    /*case 1: square is empty, fill it with current color*/
    if(element.getAttribute("squareState") == "0"){
      console.log("squareState == 1");

      element.setAttribute("fill", currColor); //fill square with currColor

      prevColor = element.getAttribute("fill"); //store previous color

      element.setAttribute("squareState","1"); //change squareState, 1=filled with color

    /*case 1.5: if the square is already filled with a color and the currColor is the same, make it blank*/
    }else if(element.getAttribute("squareState") == "1" && element.getAttribute("fill") == currColor){
      console.log("squareState == 0");

      console.log(element.getAttribute("fill")); 
      console.log(currColor);

      element.setAttribute("fill", "white");
      element.setAttribute("squareState","0");
    
    /*case 2: square is already filled with color, split it with current color*/
    }else if(element.getAttribute("squareState") == "1"){
      console.log("squareState == 1");

      
      var pts =  "0,0 " + "0," + w + " " + w + "," + w; //create a string of the triangle's coordinates

      triangle.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
      triangle.setAttribute("points", pts); //specify coordinates
      triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
      triangle.setAttribute('fill', currColor); //change color
      triangle.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on 
     
      element.parentNode.appendChild(triangle); //set triangle's parent as yearbox
     
      element.setAttribute("squareState","2");

    /*case 3: square is already split with color one way, split it the other way*/
    //Lauren didn't request this but I think it is necessary for some of the chart possibilites 
    }else if(element.getAttribute("squareState") == "2"){   
      console.log("squareState == 2");

      //remove triangle to add 
      var triRemoved = document.getElementById("tri"+element.getAttribute("id"));
      element.parentNode.removeChild(triRemoved);

      /*set up second triangle to be opposite of previous triangle*/
      var pts =  "0,0 " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates
      triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
      triangle2.setAttribute("points", pts); //specify coordinates
      triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
      triangle2.setAttribute('fill', currColor); //change color
      triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on 

      element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

      element.setAttribute("fill", prevColor); //change type square color

      element.setAttribute("squareState","3"); 
    }

    //case 4: square is split with color the second way, fill it with current color
    else if(element.getAttribute("squareState") == "3"){   
      console.log("squareState == 3");
      element.setAttribute("fill", currColor);


      /*remove triangle so it can be a solid square again*/
      var triRemoved2 = document.getElementById("tri"+element.getAttribute("id"));
      element.parentNode.removeChild(triRemoved2);

      element.setAttribute("squareState","4");
    }

    //case 0: square is filled with current color, make it blank  
    else if(element.getAttribute("squareState") == "4"){   
      console.log("squareState == 4");
      
      element.setAttribute("fill","white");

      element.setAttribute("squareState","0");
    }

    //if it's not 0,1,2,3,4, we have a problem...it's usually been null 
    else{
      console.log("Houston we have a problem");
      console.log("squareState is " + element.getAttribute("squareState"));
    }
  }


  //this function is used as the short form for: document.createElementNS("http://www.w3.org/2000/svg", "tagname");
  //which is how you make an svg using javascript
  document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  };


  /*TODO: attach label to each color square*/


  /*TODO: allow user to customize each label for each color square */
  var customizeLabel = function(countryLabel){

  }

  //array of colors, eventually needs to be manipulable by user
  var arrayColors = ["#722712","#456544","#3F6869","#D98634","#cd2904","#58705f"];
  //array of country names, eventually needs to be manipulable by user
  var countryNames = ["Spain", "Portugal", "France", "Germany", "Morocco", "Italy"];

  /*TODO: allow user to change color for each square */
  var changeSquareColor = function(){

  }

  /*TODO: allow user add a color square*/
  var addColorSquare = function(colorSquare){

    arrayColors.push("New Country");
    makeColorPalette(arrayColors.length);

  }

  /*TODO: allow user to remove color square*/
  var removeColorSquare = function(colorSquare){

  }

  /*update the current color based on what user clicks*/
  var updateCurrColor = function(e){

        //returns the svg element of the color square, <rect>
        if(e.target !== e.currentTarget){
          var clickedItemID = e.target.id; //id= #colorBox[i]
          currColor = document.getElementById(clickedItemID).getAttribute("fill"); 

          //remove all selection css
          for (var i=0; i<numColors;i++){
            document.getElementById("colorBox"+i).removeAttribute("class","selectedColor");
          }
          //add new selection css
          e.target.setAttribute("class","selectedColor");
        }
        e.stopPropagation();
  }

  /**dynamic color palette to size according to number of colors*/
  var makeColorPalette = function(numColors){
    var svg = document.createSvg("svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", numColors*60);


    for(var i=0; i<numColors;i++){

      //group for country color square and its label
      var colorGroup = document.createSvg("g");

      var colorBox = document.createSvg("rect");
      colorBox.setAttribute("width", "50px");
      colorBox.setAttribute("height", "50px");
      colorBox.setAttribute("transform", ["translate("  + 5, (60*i)  + ")"]); 
      colorBox.setAttribute("id", "colorBox" + i); //colorbox1, colorbox2, etc
      colorBox.setAttribute("fill", arrayColors[i]);
      console.log(colorBox.getAttribute("id"));

      /*tutorial: http://www.kirupa.com/html5/handling_events_for_many_elements.htm*/
      var colorPalette = document.querySelector("#colorPalette");
      colorPalette.addEventListener("click", updateCurrColor, false);

      // var colorLabelTB = document.createElement("input");
      // colorLabelTB.setAttribute("type", "text");
      // colorLabelTB.setAttribute("value", "");
      // colorLabelTB.setAttribute("name", "Test Name");
      // colorLabelTB.setAttribute("style", "width:200px");

      /*label for color in palette*/
      var colorLabel = document.createSvg("text");
      colorLabel.textContent = countryNames[i];
      colorLabel.setAttribute("x","55");
      colorLabel.setAttribute("y","30");
      colorLabel.setAttribute("font-family", "Verdana");
      colorLabel.setAttribute("font-size", "20");
      colorLabel.setAttribute("transform", ["translate("  + 5, (60*i)  + ")"]);
      colorLabel.setAttribute("textAlign","center");


      colorGroup.setAttribute("id", "colorGroup" + i);
      colorGroup.setAttribute("width", "250px");

      // var removeButton = document.createElementNS("button","-");
      // colorGroup.appendChild(removeButton);

      colorGroup.appendChild(colorBox);
      colorGroup.appendChild(colorLabel);
            // colorGroup.appendChild(colorLabelTB);

      svg.appendChild(colorGroup);
    }

          // <textarea name = "country1" cols="20" rows = "1"></textarea>
    return svg;
  }

  // //array of colors, eventually needs to be manipulable by user
  // var arrayColors = ["#722712","#456544","#3F6869","#D98634","#cd2904","#58705f"];
  // //array of country names, eventually needs to be manipulable by user
  // var countryNames = ["Spain", "Portugal", "France", "Germany", "Morocco", "Italy"];

  function editColorPalette(){
    // countryNames = document.getElementById("listOfCountries").value;


  }



  /*TODO: "show me the chart indication for the example event", function needs to know: country, year, type of event; 
  would to pass "element" variable with state set to changeSquare() method*/


  var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){

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
            //any style or attribute applied to a year will filter to the types that make it up
            yearBox.appendChild(type);

            type.setAttribute("class","typeSquare"); //class for all type squares 
            type.setAttribute("id", "type" + numType + type.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
            type.setAttribute("width", size/3);
            type.setAttribute("height", size/3);
            type.setAttribute("fill", "white");
            type.setAttribute("squareState","0");

            //0,1,2 are type boxes on row 1
            if(numType == 0 || numType == 1 || numType == 2){
                                                              //+1 to create margins on the left, 20 and +20 to move squares down
              type.setAttribute("transform", ["translate(" + (numType + 1) * size/3,20 + ")"]); //moves individual type square
            }
            else if(numType == 3 || numType == 4 || numType == 5){
                type.setAttribute("transform", ["translate(" + (numType-3 + 1) * size/3,size/3 + 20 + ")"]);
            }
            else if(numType == 6 || numType == 7 || numType == 8){
                type.setAttribute("transform", ["translate(" + (numType-6 + 1) * size/3,2*(size/3) + 20 +")"]);
            }

          } //end for loop
          
        yearBox.setAttribute("transform", ["translate(", j*size + j*8, ",", i*size + i*8, ")"].join("")); //offset to see bkg  
        }//close inner for loop
    }//close outer for loop

    return svg;
  }

    //currently only accounts for complete squares (not triangles)
   function generateTimeline(boxesPerSide, startYearID){
    //TODO: account for triangles, include the year
      for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          for(var numType = 0; numType < 9; numType++){
            var typeSquare = document.getElementById("type" + numType + "year" + startYearID);
            //for number of colors
            for(var numClr = 1; numClr <= numColors; numClr++){
              if(typeSquare.getAttribute("fill") == document.getElementById("color" + numClr).getAttribute("fill"))
                {
                  var country = countries[typeSquare.getAttribute("fill")];
                  //9 if else statements for type of event. to avoid: would be nice to have an added attribute during makeGrid that is eventName
                   if(numType == 0){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Beginning of war <br>"; //using the color as a key, gets the corresponding country value from countries
                   }
                   if(numType == 1){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Conquest, annexation, or union <br>"; 
                   }
                   if(numType == 2){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Loss or disaster <br>";
                   }
                   if(numType == 3){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Fall of state <br>";
                   }
                   if(numType == 4){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Foundation or revolution <br>";
                   }
                   if(numType == 5){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Treaty or sundry <br>";
                   }
                   if(numType == 6){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Birth of remarkable individual <br>";
                   }
                   if(numType == 7){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Deed <br>"; 
                   }
                   if(numType == 8){
                    document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Death of remarkable individual <br>";
                   }
                }
            } //end for numClr
          } //end for numType
          startYearID = startYearID + 1;
        }
      }
  };
  


  var container = document.getElementById("gridContainer");
  container.appendChild(makeGrid(5, 60, 368, 0)); //makes one 5x5 quadrant with boxes 60 px wide inside a 368x368 viewport //was 340 & then 350 
  container.appendChild(makeGrid(5, 60, 368, 25));
  container.appendChild(makeGrid(5, 60, 368, 50));
  container.appendChild(makeGrid(5, 60, 368, 75));

  var cpContainer = document.getElementById("colorPalette");
  cpContainer.appendChild(makeColorPalette(6)); //make dynamic color palette with 6 colors

  document.getElementById("timelineGen").addEventListener("click", function(){
    document.getElementById("timeline").innerHTML = ""; //clear out any previous timeline
    generateTimeline(5,0);
    generateTimeline(5,25);
    generateTimeline(5,50);
    generateTimeline(5,75);
});


 });
