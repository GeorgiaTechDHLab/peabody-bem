//TODO: make list into timeline
$( document ).ready(function() { //had to use jquery because my 
  //document.getElementByID was being called before the ID in the document was created
  //but now we can just use jquery syntax instead of doc.getelementbyid
  var myFunction = function(){
    document.getElementById("demo").innerHTML = "Hello World";
  }


  //array of colors for 4 color palettes, with 10 colors per array. 

  //this array holds the current array of colors 
  var arrayColors = ["#722712","#336531","#3F6869","#D98634","#723767","#A34F93","#9FBCBF","#9BCF7A","#CC7172","#CFB47E"];

  var arrayColors1 = ["#722712","#336531","#3F6869","#D98634","#723767","#A34F93","#9FBCBF","#9BCF7A","#CC7172","#CFB47E"];

  var arrayColors2 = ["#195232", "#468966","#FFF0A5","#FFB03B","#B64926","#8E2800","#D1DBBD","#91AA9D","#3E606F","#193441"];

  var arrayColors3 = ["#F9E4AD","#E6B098","#CC4452","#723147","#31152B","#FF7F00","#FFD933","#CCCC52","#8FB259","#253F4A"];

  var arrayColors4 = ["#BAB293","#A39770","#EFE4BD","#A32500","#643738","#D5FBFF","#9FBCBF","#647678","#2F3738","#59D8E5"];

  //array of country names, if more colors and country added, new country gets next color
  //more countryNames than colors get assigned black
  var countryNames = ["Spain", "Portugal", "France", "Germany", "Morocco", "Italy"];

  //10 country names
  // var countryNames = ["Spain", "Portugal", "France", "Germany", "Morocco", "Italy", "Mordor", "Rivendel", "Shire", "Hogsmeade"];

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


  /*TODO: allow user to change color for each square */
  var changeSquareColor = function(){

  }

  /*update the current color based on what user clicks*/
  var updateCurrColor = function(e){

        //returns the svg element of the color square, <rect>
        if(e.target !== e.currentTarget && document.getElementById("colorPaletteSVG")){ //second check is for when color palette isn't there because of updating
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
    console.log(numColors);
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
      colorPalette.addEventListener("click", updateCurrColor, false);

      //form labels don't work because they can't be appended to an svg...

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

   function generateTimeline(boxesPerSide, yearID){
    var timelineDataPts = []; //array of points to be plotted on the timeline
      for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          //TODO: map yearID to an actual year
          //document.getElementById("timeline").innerHTML = document.getElementById("timeline").innerHTML + yearID + "<br>"; //label for the year in which the events took place
          for(var numType = 0; numType < 9; numType++){ //check each square for a fill
            var typeSquare = document.getElementById("type" + numType + "year" + yearID);
            var triangle = document.getElementById("tritype" + numType + "year" + yearID); //the triangle occupying the type square. could be null
            //for number of colors
            for(var numClr = 1; numClr <= numColors; numClr++){ //check which color the fill is TODO: first check if fill exists
              if(triangle != null){
                if(triangle.getAttribute("fill") == arrayColors[numClr-1])
                {
                  var country = countryNames[numClr-1];
                  //9 if else statements for type of event. to avoid: would be nice to have an added attribute during makeGrid that is eventName
                   if(numType == 0){
                    //add data point object: year, color, text
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Beginning of war"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Beginning of war <br>"; //using the color as a key, gets the corresponding country value from countries
                   }
                   else if(numType == 1){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Conquest, annexation, or union"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Conquest, annexation, or union <br>"; 
                   }
                   else if(numType == 2){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Loss or disaster"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Loss or disaster <br>";
                   }
                   else if(numType == 3){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Fall of state"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Fall of state <br>";
                   }
                   else if(numType == 4){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Foundation or revolution"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Foundation or revolution <br>";
                   }
                   else if(numType == 5){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Treaty or sundry"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Treaty or sundry <br>";
                   }
                   else if(numType == 6){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Birth of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Birth of remarkable individual <br>";
                   }
                   else if(numType == 7){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Deed"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Deed <br>"; 
                   }
                   else if(numType == 8){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Death of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Death of remarkable individual <br>";
                   }
                } //end if triangle.getAttr
              } //end if triangle != null
              if(typeSquare.getAttribute("fill") == arrayColors[numClr-1])
                {
                  var country = countryNames[numClr-1];
                  //9 if else statements for type of event. to avoid: would be nice to have an added attribute during makeGrid that is eventName
                   if(numType == 0){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Beginning of war"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Beginning of war <br>"; //using the color as a key, gets the corresponding country value from countries
                   }
                   if(numType == 1){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Conquest, annexation, or union"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Conquest, annexation, or union <br>"; 
                   }
                   if(numType == 2){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Loss or disaster"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Loss or disaster <br>";
                   }
                   if(numType == 3){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Fall of state"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Fall of state <br>";
                   }
                   if(numType == 4){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Foundation or revolution"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Foundation or revolution <br>";
                   }
                   if(numType == 5){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Treaty or sundry"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Treaty or sundry <br>";
                   }
                   if(numType == 6){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Birth of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Birth of remarkable individual <br>";
                   }
                   if(numType == 7){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Deed"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Deed <br>"; 
                   }
                   if(numType == 8){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Death of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Death of remarkable individual <br>";
                   }
                } //end if typeSquare
            } //end for numClr
          } //end for numType
          yearID = yearID + 1;
        }
      }
      return timelineDataPts;
  };
  
/*******************************************INITIALIZE PAGE**********************************************/

  /*draw the 100x100 grid*/
  var container = document.getElementById("gridContainer");
  container.appendChild(makeGrid(5, 60, 368, 0)); //makes one 5x5 quadrant with boxes 60 px wide inside a 368x368 viewport //was 340 & then 350 
  container.appendChild(makeGrid(5, 60, 368, 25));
  container.appendChild(makeGrid(5, 60, 368, 50));
  container.appendChild(makeGrid(5, 60, 368, 75));

  /*add the color palette to the page*/
  var cpContainer = document.getElementById("colorPalette");
  cpContainer.appendChild(makeColorPalette(numColors)); //make dynamic color palette with 6 colors


/*******************************************EVENT LISTENERS**********************************************/

  /*aevent listener to generate timeline from chart*/
  document.getElementById("timelineGen").addEventListener("click", function(){
    var margin= {top:20, bottom:20, right:50, left:10};

    document.getElementById("timelineViz").innerHTML = ""; //clear out any previous timeline
    //dataArr is the combined array of all the arrays returned from calling generateTimeline on all 4 quadrants
    var dataArr = generateTimeline(5,0).concat(generateTimeline(5,25).concat(generateTimeline(5,50).concat(generateTimeline(5,75))));

    var canvas = d3.select('#timelineViz').append('svg')
              .attr("width",document.getElementById("timelineContainer").offsetWidth); //current width of the timelineContainer div
    
    var timeline = canvas.append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.linear()
                  .domain([0, 100]) //this would need to be user input
                  .range([0,document.getElementById("timelineContainer").offsetWidth - margin.right])

    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(100)
                  .tickFormat(function(d) { //dont display text unless it's an even decade
                    if((d % 10) != 0){ 
                        return ("");
                    }else{ 
                        return (d);
                    }});

    var xGuide = canvas.append('g')
                  .attr("transform", "translate(" + margin.left + "," + (margin.top + margin.bottom) + ")")
                  .attr("class","axis")
                  .style("stroke-width",2)
                  .call(xAxis);

    d3.selectAll("g.axis g.tick") //g.tick is the value of the tick
      .style("stroke-width", function(d,i){
        if(i%10 === 0)
          return 2;
        else
          return 1;
      });

      d3.selectAll("g.axis g.tick line") //g.tick line is the actual tick mark
      .attr("y2", function(d,i){
        if(i%10 === 0)
          return 10;
        else
          return 5;
      });

    timeline.selectAll("circle")
      .data(dataArr)
      .enter()
      .append("circle")
      .attr("cx",function(d){return xScale(+d.year)})
      .attr("cy", 12)
      .attr("r", 5)
      .attr("fill", function(d){return d.color});

    timeline.selectAll("text") //TODO: rotate position to handle overlaps
      .data(dataArr)
      .enter()
      .append("text")
      .text(function(d){return d.text})
      .attr("x",function(d){return xScale(+d.year)})
      .attr("y",5);

  });

  /*event listener to allow user to add country*/
  document.getElementById("addCountryButton").addEventListener("click", function(){
    //numColors cannot go above 10, because of number of colors in each color palette
    if(numColors < 10){
      document.getElementById("colorPaletteSVG").remove(); //this removes the whole svg
      countryNames.push(document.getElementById("newCountry").value);
      arrayColors.push("blue");
      numColors++; //increase numColors by 1
      cpContainer.appendChild(makeColorPalette(numColors)); 
      document.getElementById("newCountry").value = ""; //reset input box
    }else{
      alert("You can't add more than 10 countries.");
    }

  });

  /*event listener to allow user to remove country*/
  document.getElementById("removeCountryButton").addEventListener("click", function(){
    // document.getElementById("colorPaletteSVG").removeChild(colorGroup); //this line removes the last colorGroup (square and country label)
      var country = document.getElementById("removeCountry").value;
      if(countryNames.indexOf(country) >= 0){ //check if the country is actually in the array 
        document.getElementById("colorPaletteSVG").remove(); //this removes the whole svg

        countryNames.splice(countryNames.indexOf(country),1);
        console.log(countryNames);
        arrayColors.splice(countryNames.indexOf(country),1);
        numColors--; //decrease numColors by 1
        cpContainer.appendChild(makeColorPalette(numColors)); 
        document.getElementById("removeCountry").value = ""; //reset input box
      }else{
        document.getElementById("removeCountry").value = ""; //reset input box
        console.log("no country to remove");
        alert("There is no country by this name to remove.");
      }
  });

  /*event listener to allow user to remove all countries at once*/
  document.getElementById("removeAllCountriesButton").addEventListener("click", function(){
    document.getElementById("colorPaletteSVG").remove(); //this removes the whole svg

    console.log("in");
    countryNames.length = 0; //empty array 
    numColors = 0; 
    cpContainer.appendChild(makeColorPalette(0)); 
  });


  /*event listener to listen to changing color scheme*/
  document.getElementById("editForm").addEventListener("click", function(){
    console.log("changing color schemes");
    document.getElementById("colorPaletteSVG").remove(); //this removes the whole svg

    var cpNum = getRadioVal();

    if(cpNum == 1){
      arrayColors = arrayColors1;
    }else if(cpNum == 2){
      arrayColors = arrayColors2;
    }else if(cpNum == 3){
      arrayColors = arrayColors3;
    }else if(cpNum == 4){
      arrayColors = arrayColors4;
    }
    cpContainer.appendChild(makeColorPalette(numColors));


  })

  //for switching color palettes
  function getRadioVal() {
    var val;
    // get list of radio buttons with specified name
    // var radios = form.elements[name];
    var radios = [];

    //8 is num colors
    for (var i=1; i<5; i++){
          radios.push(document.getElementById("g"+i));

    }
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    console.log(val);
    return val; // return value of checked radio or undefined if none checked
  }

  var userEvents; //holds user input events 
  var eventsList; //where the user input text gets appended
  var userTitle; //holds user input title 
  var editButton; //new button to trigger switch from view to form 

  /*event listener to add custom events, switches from form to view*/
  document.getElementById("addEvents").addEventListener("click", function(){

    /*create custom events list from user input*/
    userEvents = document.getElementById("userEventsInput").value;
    userTitle = document.getElementById("userTitleInput").value;

    /*add user input to html page*/
    eventsList = document.createElement("text");
    eventsList.type = "text";
    eventsList.value = userEvents;
    eventsList.id = "userEvents";

    /*create the edit button so user can edit*/
    editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "edit";
    editButton.id = "editEvents";
    /*add event listener to the edit button, switches from view to form*/
    editButton.addEventListener("click", function(){
      document.getElementById("editEvents").remove(); //remove the edit button 

      //create the text area and set text to the user input
      var userEventsInput = document.createElement("textarea");
      userEventsInput.type = "textarea";
      userEventsInput.value = userEvents;
      userEventsInput.id = "userEventsInput";

      /*create the title box again for editing*/
      var eventsTitleBox = document.createElement("input");
      eventsTitleBox.type = "text";
      eventsTitleBox.value = userTitle;
      eventsTitleBox.id = "userTitleInput";

      var paragraph = document.createElement("p");
      var t = document.createTextNode("Give your events a title:");
      paragraph.appendChild(t);
      paragraph.id = "giveTitle";


      /*recreate form for user*/
      document.getElementById("instructionsOrTitle").innerHTML = "Type or paste your own list of events.";
      document.getElementById("customEventsContainer").appendChild(userEventsInput); //re-add textarea with user input
      document.getElementById("titleInstruct").appendChild(paragraph); //add instructions to give title
      document.getElementById("titleInstruct").appendChild(eventsTitleBox); //add textbox to change title
      document.getElementById("eventsList").innerHTML = ""; //clear the list of events
      
      document.getElementById("buttonContainer").appendChild(testButton); //replace the button
    })

    /*remove the form elements*/
    document.getElementById("userEventsInput").remove(); //text area for the user input of events 
    var testButton = document.getElementById("addEvents");
    document.getElementById("addEvents").remove(); //button to add events 
    if(document.getElementById("giveTitle")){
      document.getElementById("giveTitle").remove(); //div to hold text "Give your events a title:"
    }
    document.getElementById("userTitleInput").remove(); //input box for user to add title

    /*add new elements*/
    document.getElementById("instructionsOrTitle").innerHTML = userTitle; //replace instructions with user given title
    document.getElementById("eventsList").innerHTML = userEvents; //make list of events part of page, non-editable
    document.getElementById("buttonContainer").appendChild(editButton); //add an edit button so user can make changes 

  })

  /*event listener to edit custom events, switches from view to form*/
  // document.getElementById("editEvents").addEventListener("click", function(){



  // })




/**************************************END EVENT LISTENERS**********************************************/


});
