//TODO: make list into timeline
$( document ).ready(function() { //had to use jquery because my 
  //document.getElementByID was being called before the ID in the document was created
  //but now we can just use jquery syntax instead of doc.getelementbyid
  Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };

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

    var squares2Fill = ["England_type5year0", "Spain_type7year11", "England_type7year16", "Spain_type7year19", "France_type7year22", "Spain_type7year24", 
                      "Spain_type7year25", "France_type7year33", "Spain_type7year36", "France_type7year39", "Spain_type8year41", "France_type7year61", 
                      "special", "England_type7year75", "England_type7year77", "England_type7year78", "England_type7year83", "England_type7year84"];


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

      
      var pts = "0," + w + " " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //4

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
      var pts =  "0,0 " + "0," + w + " " + w + ",0"; //create a string of the triangle's coordinates //3

      triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
      triangle2.setAttribute("points", pts); //specify coordinates
      triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
      triangle2.setAttribute('fill', currColor); //change color
      triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on 

      element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

      element.setAttribute("fill", prevColor); //change type square color

      element.setAttribute("squareState","3"); 
    }

    //new case, case 4: fill opposite direction 
    else if(element.getAttribute("squareState") == "3"){   
      console.log("squareState == 3");

      //remove triangle to add 
      var triRemoved = document.getElementById("tri"+element.getAttribute("id"));
      element.parentNode.removeChild(triRemoved);

      /*set up second triangle to be opposite of previous triangle*/
      var pts =  "0,0 " + "0," + w + " " + w + "," + w; //create a string of the triangle's coordinates //1
      console.log(pts);
      triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
      triangle2.setAttribute("points", pts); //specify coordinates
      triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
      triangle2.setAttribute('fill', currColor); //change color
      triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on 

      element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

      element.setAttribute("fill", prevColor); //change type square color

      element.setAttribute("squareState","4"); 
    }

    //new case, case 5: fill opposite opposite direction 
    else if(element.getAttribute("squareState") == "4"){   
      console.log("squareState == 4");

      //remove triangle to add 
      var triRemoved = document.getElementById("tri"+element.getAttribute("id"));
      element.parentNode.removeChild(triRemoved);

      /*set up second triangle to be opposite of previous triangle*/
      var pts =  "0,0 " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //2
      triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
      triangle2.setAttribute("points", pts); //specify coordinates
      triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
      triangle2.setAttribute('fill', currColor); //change color
      triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on 

      element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

      element.setAttribute("fill", prevColor); //change type square color

      element.setAttribute("squareState","5"); 
    }

    //case 6: square is split with color the second way, fill it with current color
    else if(element.getAttribute("squareState") == "5"){   
      console.log("squareState == 5");
      element.setAttribute("fill", currColor);


      /*remove triangle so it can be a solid square again*/
      var triRemoved2 = document.getElementById("tri"+element.getAttribute("id"));
      element.parentNode.removeChild(triRemoved2);

      element.setAttribute("squareState","6");
    }

    //case 0: square is filled with current color, make it blank  
    else if(element.getAttribute("squareState") == "6"){   
      console.log("squareState == 0");
      
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
      colorBox.setAttribute("transform", ["translate("  + 5, (60*i)  + ")"]); 
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
      colorLabel.setAttribute("font-family", "Verdana");
      colorLabel.setAttribute("font-size", "20");
      colorLabel.setAttribute("transform", ["translate("  + 5, (60*i)  + ")"]);
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
            yearBox.addEventListener( //adds event listener to each yearBox
            "click",
            function(e){
                {
                    changeSquare(e.target); //e.target is the rect object, where id="type#year#" and class="typeSquare"
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

  /*draw the 100x100 grid*/
  var container = document.getElementById("gridContainer");
  container.appendChild(makeGrid(10, 60, 715, 0)); //makes one 5x5 quadrant with boxes 60 px wide inside a 715x715 viewport //was 368 when doing 4 quadrants

  /*add year labels*/
  var years2Label = ["5","9","40","49","50","90","99"];
  addExYearLabels(years2Label);

  /*add the color palette to the page*/
  var cpContainer = document.getElementById("colorPalette");
  cpContainer.appendChild(makeColorPalette(numColors)); //make dynamic color palette with 6 colors

  fillSquares();




/*******************************************EVENT LISTENERS**********************************************/


  function drawExample(){
    
    var buttons = document.getElementsByClassName("showme"); //get all of the buttons

    var countries = [];
    var typeSquareIDs = [];
    var squares = [];
    var temp; 

    //loops through buttons to extract the country and typeSquareID from each ID tag, then sets the attributes
    for(var i=0; i < buttons.length; i++){
      temp = buttons[i].id.split('_');
      countries.push(temp[0]);
      typeSquareIDs.push(temp[1]);

      if(document.getElementById(temp[1])){ //null check for "special" case 
        document.getElementById(temp[1]).setAttribute("fill", arrayColors[countryNames.indexOf(temp[0])]);
      }
    }

    //still need to set the triangle square, probably a better way to avoid this dulicate code
    document.getElementById("type0year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);
    document.getElementById("type1year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);
    document.getElementById("type2year64").setAttribute("fill", arrayColors[countryNames.indexOf("France")]);
    document.getElementById("type4year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);
    document.getElementById("type7year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);

    document.getElementById("type1year64").setAttribute("squareState","1");
    currColor = arrayColors[countryNames.indexOf("France")];
    changeSquare(document.getElementById("type1year64"));


    // addExYearLabels2();
    // var years2Label = ["1506","1510","1541","1550","1551","1591","1600"];
    var years2Label = ["5","9","40","49","50","90","99"];
    addExYearLabels(years2Label);

  }



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
      yearBox.appendChild(text);
    }
  }


  // show years for example...better logic so not two for statements? 
  function addExYearLabels2(){
    for(var i=0; i<100; i+=30){
      var yearBox = document.getElementById("year"+i);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('id', 'yearLabel'+i);
      text.setAttribute('x', '35');
      text.setAttribute('y', '55');
      var temp = i+1;
      //text.textContent = i+1; //shows the id number plus one, generic template
      if(temp<10){ //add a 0 
        text.textContent = '160'+temp; //specific for example
      }else if(temp == 100){ //make it next century
        text.textContent = '1700'; //specific for example
      }else{
        text.textContent = '16'+temp; //specific for example
      }
      yearBox.appendChild(text);
    }

    for(var i=9; i<100; i+=30){
      var yearBox = document.getElementById("year"+i);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('id', 'yearLabel'+i);
      text.setAttribute('x', '35');
      text.setAttribute('y', '55');
      var temp = i+1;
      //text.textContent = i+1; //shows the id number plus one, generic template
      if(temp<10){ //add a 0 
        text.textContent = '160'+temp; //specific for example
      }else if(temp == 100){ //make it next century
        text.textContent = '1700'; //specific for example
      }else{
        text.textContent = '16'+temp; //specific for example
      }
      yearBox.appendChild(text);
    }
  }

  //shows all years
  function addAllYearLabels(){
    for(var i=0; i<100; i++){
      var yearBox = document.getElementById("year"+i);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('id', 'yearLabel'+i);
      text.setAttribute('x', '35');
      text.setAttribute('y', '55');
      var temp = i+1;
      //text.textContent = i+1; //shows the id number plus one, generic template
      if(temp<10){ //add a 0 
        text.textContent = '160'+temp; //specific for example
      }else if(temp == 100){ //make it next century
        text.textContent = '1700'; //specific for example
      }else{
        text.textContent = '16'+temp; //specific for example
      }
      yearBox.appendChild(text);
    }
  }

  function fillSquares(){

    var fillSquareParam;
    var countries = [];
    var typeSquareIDs = [];
    var temp;

    for(var i=0; i < squares2Fill.length; i++){
      temp = squares2Fill[i].split('_');
      countries.push(temp[0]);
      typeSquareIDs.push(temp[1]);

      if(document.getElementById(temp[1])){ //null check for "special" case 
        document.getElementById(temp[1]).setAttribute("fill", arrayColors[countryNames.indexOf(temp[0])]);
      }

      //still need to set the triangle square, probably a better way to avoid this dulicate code
      document.getElementById("type0year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);
      document.getElementById("type1year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);
      document.getElementById("type2year64").setAttribute("fill", arrayColors[countryNames.indexOf("France")]);
      document.getElementById("type4year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);
      document.getElementById("type7year64").setAttribute("fill", arrayColors[countryNames.indexOf("Spain")]);

      document.getElementById("type1year64").setAttribute("squareState","1");
      currColor = arrayColors[countryNames.indexOf("France")];
      changeSquare(document.getElementById("type1year64"));
    }

  }


/**************************************END EVENT LISTENERS**********************************************/


});
