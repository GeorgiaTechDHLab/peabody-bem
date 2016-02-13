//TODO: make list into timeline
$( document ).ready(function() { //had to use jquery because my 
  //document.getElementByID was being called before the ID in the document was created
  //but now we can just use jquery syntax instead of doc.getelementbyid
  Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };

  d3.csv('peabodyData.csv', function(d){

    /*draw the 100x100 grid*/
    var container = document.getElementById("gridContainer");
    container.appendChild(makeGrid(10, 60, 715, 0)); //makes one 5x5 quadrant with boxes 60 px wide inside a 715x715 viewport //was 368 when doing 4 quadrants

    /*add year labels*/
    var years2Label = ["5","9","40","49","50","90","99"];
    addExYearLabels(years2Label);

    /*populate chart*/
    fillChart(d);

    /*populate event list*/
    fillEventList(d);
  })

  //array of colors for sample list
  var arrayColors = ["#720042", "#BA390B", "#6EA2A3", "#336531","#D98634","#A34F93","#9FBCBF","#9BCF7A","#CC7172","#CFB47E"]

  //array of country names for sample list
  var countryNames = ["England", "Spain", "France"]; 

  //the number of colors/countries represented
  var numColors = countryNames.length;

   //currColor will be to hold whatever color the user squareState on to use
  var currColor = "#722712";

  //prevColor will hold whatever the previous color of the square was
  var prevColor = "";

 //variable that holds the color square and the country label together
 var colorGroup;

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


  //event types to show in key 
  var eventTypes = ["Battles, Sieges, Beginning of War", "Conquests, Annexations, Unions", "Losses and Disasters", "Falls of States", 
                    "Foundations of States and Revolutions", "Treaties and Sundies", "Births", "Deeds", "Deaths, of remarkable individuals"];

  /*if we want to use right-click functionality instead: http://www.sitepoint.com/building-custom-right-click-context-menu-javascript/ */

  //this function is used as the short form for: document.createElementNS("http://www.w3.org/2000/svg", "tagname");
  //which is how you make an svg using javascript
  document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  };

  
  /*fill in squares on chart given an array of objects w/ year, eventType, color*/
  function fillChart(dataArr){
    dataArr.forEach(function (element, index, array){
      // console.log("element: "+ element.year, element.color, element.country, element.eventType, element.text);
      // console.log("index: " + index);
      // console.log("array: " + array);
        var typeRect = document.getElementById('type' + element.eventType + 'year' + (+element.year % 100))
        if(typeRect.getAttribute('fill') != 'white'){
          //if a rectangle is present, draw a triangle over it
          var w = typeRect.getAttribute('width');
          var t = typeRect.getAttribute('transform');
          var pts = "0," + w + " " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //4

          var triangle = document.createSvg("polygon");

          triangle.setAttribute("id", "tri"+typeRect.getAttribute("id")); //give id, format is "tritype#year#"
          triangle.setAttribute("points", pts); //specify coordinates
          triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
          triangle.setAttribute('fill', element.color); //change color
         
          typeRect.parentNode.appendChild(triangle);
        }
        else
            typeRect.setAttribute('fill', element.color);
    })
  }

/*creates a list of events based on a "text" attribute of objects in an array*/
  function fillEventList(dataArr){
    dataArr.forEach(function (e, i, a){
      var eventList = document.getElementById("sampleList").innerHTML;
      document.getElementById('sampleList').innerHTML = eventList + '<li>' + e.text + '</li>';
    })
  }

  /**dynamic color palette to size according to number of colors*/
  var makeColorPalette = function(numColors){
    // var svg = document.createSvg("svg"); //no difference between this line 
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg"); //and this line, they both work 
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", numColors*60);
    svg.setAttribute("id","colorPaletteSVG");


    for(var i=0; i<numColors;i++){

      //group for country color square and its label
      colorGroup = document.createSvg("g");

      var colorBox = document.createSvg("rect");
      colorBox.setAttribute("width", "50px");
      colorBox.setAttribute("height", "50px");
      colorBox.setAttribute("transform", ["translate("  + (160*i), 5  + ")"]); //5, (60*i) for vertical stacking of color blocks
      colorBox.setAttribute("id", "colorBox" + i); //colorbox1, colorbox2, etc
      colorBox.setAttribute("fill", arrayColors[i]);
      console.log(colorBox.getAttribute("id"));

      /*tutorial: http://www.kirupa.com/html5/handling_events_for_many_elements.htm*/
      var colorPalette = document.querySelector("#colorPalette");

      /*label for color in palette*/
      var colorLabel = document.createSvg("text");
      colorLabel.textContent = countryNames[i];
      colorLabel.setAttribute("x","55");
      colorLabel.setAttribute("y","30");
      colorLabel.setAttribute("font-family", "Alegreya");
      colorLabel.setAttribute("font-size", "20");
      colorLabel.setAttribute("transform", ["translate("  + (160*i), 5 + ")"]);
      colorLabel.setAttribute("textAlign","center");


      colorGroup.setAttribute("id", "colorGroup" + i);
      colorGroup.setAttribute("width", "250px");

      colorGroup.appendChild(colorBox);
      colorGroup.appendChild(colorLabel);

      svg.appendChild(colorGroup);
    }
    return svg;
  }


  //(10, 60, 715, 0)
  var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){

    //whole svg 
    var svg = document.createSvg("svg");
    svg.setAttribute("width", pixelsPerSide + size/3);
    svg.setAttribute("height", pixelsPerSide + size/3);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    var maing = document.createSvg("g");
    maing.setAttribute("id", "maing");
    maing.setAttribute("width", pixelsPerSide + size/3);
    maing.setAttribute("height", pixelsPerSide + size/3);


    // maing.setAttribute("transform", ["translate(60,60)"]); //test if objects are grouped together

    //"physical" bg element, this goes on top of "maing", a little redundant but think of it as the physical object in the container
    var bg = document.createSvg("rect");
    var sizeBG = (pixelsPerSide);
    bg.setAttribute("id","bg");
    bg.setAttribute("width", sizeBG + size/3);
    bg.setAttribute("height", sizeBG + size/3);
    bg.setAttribute("fill","black"); //TODO: do this in css file?
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

            //0,1,2 are type boxes on the first row
            if(numType == 0 || numType == 1 || numType == 2){
                                                              
              type.setAttribute("transform", ["translate(" + ((numType + 1) * size/3 + numType),20 + ")"]); //moves individual type square
            }
            else if(numType == 3 || numType == 4 || numType == 5){
                type.setAttribute("transform", ["translate(" + ((numType-3 + 1) * size/3 + (numType-3)),size/3 + 21 + ")"]); //extra 1 for a 1 pixel space between row above
            }
            else if(numType == 6 || numType == 7 || numType == 8){
                type.setAttribute("transform", ["translate(" + ((numType-6 + 1) * (size/3) + (numType-6)),2*(size/3) + 22 +")"]);
            }

          } //end for loop
        if(numYear.between(0,50)){  //upper half of grid
            yearBox.setAttribute("transform", ["translate(", j*size + j*8, ",", i*size + i*8, ")"].join("")); //offset to see bkg. j is x, i is y
            if(numYear.between(5,10) || numYear.between(15,20) || numYear.between(25,30) || numYear.between(35,40) || numYear.between(45,50)) // right quadrant
              yearBox.setAttribute("transform", ["translate(", j*size + j*8 + size/3, ",", i*size + i*8, ")"].join(""));
          }
        if(numYear.between(50,100)){ //lower half of grid
            yearBox.setAttribute("transform", ["translate(", j*size + j*8, ",", i*size + i*8 + size/3, ")"].join("")); 
            if(numYear.between(55,60) || numYear.between(65,70) || numYear.between(75,80) || numYear.between(85,90) || numYear.between(95,100)) // right quadrant
              yearBox.setAttribute("transform", ["translate(", j*size + j*8 + size/3, ",", i*size + i*8 + size/3, ")"].join(""));
          }
        }//close inner for loop
    }//close outer for loop

    return svg;
  }

/*******************************************INITIALIZE PAGE**********************************************/

  //add sample year square to bottom of event column
  document.getElementById("eventList").appendChild(makeGrid(1,60,80,100));

  /*add year labels*/
  var years2Label = ["5","9","40","49","50","90","99"];
  addExYearLabels(years2Label);

  /*add the color palette to the page*/
  var cpContainer = document.getElementById("colorPalette");
  cpContainer.appendChild(makeColorPalette(numColors)); //make dynamic color palette with 6 colors

  showTypeKey();



  function addExYearLabels(years2Label){
    for(var i=0; i<years2Label.length; i++){
      var yearBox = document.getElementById("year"+years2Label[i]);
      var year2Label = years2Label[i];
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('id', 'yearLabel'+i);
      text.setAttribute('x', '35');
      text.setAttribute('y', '55');
      var temp = parseInt(year2Label) + 1;
      if(temp<10){ //add a 0 
        text.textContent = '160'+temp; //specific for example
      }else if(temp == 100){ //make it next century
        text.textContent = '1700'; //specific for example
      }else{
        text.textContent = '16'+temp; //specific for example
      }
      if(yearBox){
        yearBox.appendChild(text);
      }
      
    }
  }



  function showTypeKey(){
    //hold year ID of key
    var keyID = 100;

    //loop through ID to show related text 
    for(var i=0; i<9; i++){
      console.log(eventTypes[i]);
      // document.getElementById("type" + i +"year" + keyID).addEventListener( //adds event listener to each yearBox
      //       "hover",
      //       function(e){
      //           {
      //             console.log(eventTypes[i]);
      //           }
      //       },
      //        false);
    }
  }


});
