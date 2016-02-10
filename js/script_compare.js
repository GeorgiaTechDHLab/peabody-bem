$( document ).ready(function() { 


  Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };

/*******************************************INITIALIZE PAGE**********************************************/

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

  /*draw timeline*/
  drawTimeline();

  /*displays the internal data*/
  showData(d);

})

/*******************************************INITIALIZER VARIABLES**********************************************/
  //array of colors for 4 color palettes, with 10 colors per array. 

  //this array holds the current array of colors 
  var arrayColors = ["#720042", "#BA390B", "#6EA2A3", "#336531","#D98634","#A34F93","#9FBCBF","#9BCF7A","#CC7172","#CFB47E"]
  // var arrayColors = ["#723767","#722712","#3F6869","#336531","#D98634","#A34F93","#9FBCBF","#9BCF7A","#CC7172","#CFB47E"];

  var arrayColors1 = ["#720042", "#BA390B", "#6EA2A3", "#336531","#D98634","#A34F93","#9FBCBF","#9BCF7A","#CC7172","#CFB47E"];

  var arrayColors2 = ["#195232", "#468966","#FFF0A5","#FFB03B","#B64926","#8E2800","#D1DBBD","#91AA9D","#3E606F","#193441"];

  var arrayColors3 = ["#F9E4AD","#E6B098","#CC4452","#723147","#31152B","#FF7F00","#FFD933","#CCCC52","#8FB259","#253F4A"];

  var arrayColors4 = ["#BAB293","#A39770","#EFE4BD","#A32500","#643738","#D5FBFF","#9FBCBF","#647678","#2F3738","#59D8E5"];

  //array of country names, if more colors and country added, new country gets next color
  //more countryNames than colors get assigned black
  var countryNames = ["England", "Spain", "France"]; //countries for sample list

  //the number of colors/countries represented
  var numColors = countryNames.length;

   //currColor will be to hold whatever color the user squareState on to use
  var currColor = "#720042";

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


  //this function is used as the short form for: document.createElementNS("http://www.w3.org/2000/svg", "tagname");
  //which is how you make an svg using javascript
  document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  };

/**************************************INITIALIZER FUNCTIONS**********************************************/

  //(10, 60, 715, 0)
var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){

    //whole svg 
    var svg = document.createSvg("svg");
    svg.setAttribute("width", pixelsPerSide + size);
    svg.setAttribute("height", pixelsPerSide + size);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    var maing = document.createSvg("g");
    maing.setAttribute("id", "maing");
    maing.setAttribute("width", pixelsPerSide + size);
    maing.setAttribute("height", pixelsPerSide + size);


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
  
  /*fill in squares on chart given an array of objects w/ year, eventType, color*/
  function fillChart(dataArr){
    dataArr.forEach(function (element, index, array){
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

  function showData(dataArr){
    var oldTriType ='';
    dataArr.forEach(function (element, index, array){
        var typeRect = document.getElementById('type' + element.eventType + 'year' + (+element.year % 100))
        var triType = document.getElementById('tri' + typeRect.getAttribute('id'));
        var color = element.color;
        var country = element.country;
        var id ="";
        if((triType != null) && (triType.getAttribute('id') == oldTriType)){
          //if the triangle event exists AND we know it's actually the triangle, not the underlying rect
          id = "tri"+typeRect.getAttribute("id");
        }
        else
          id = 'type' + element.eventType + 'year' + (+element.year % 100);
        if(triType != null)
          oldTriType = triType.getAttribute('id'); //store the previous triangle event so when it comes around again, we know it's really the second of the two events. The first one should be labeled w/o 'tri'
        
        var dataEntry = country + ', ' +color + ', ' +id;
        var dataList = document.getElementById("dataList").innerHTML;
        document.getElementById('dataList').innerHTML = dataList + '<li>' + dataEntry + '</li>';
    })
  }

/*creates a list of events based on a "text" attribute of objects in an array*/
  function fillEventList(dataArr){
    dataArr.forEach(function (e, i, a){
      var eventList = document.getElementById("sampleList").innerHTML;
      document.getElementById('sampleList').innerHTML = eventList + '<li>' + e.text + '</li>';
    })
  }

  
/**************************************HELPER FUNCTIONS**********************************************/

/*this function pulls events from a chart and returns as an array of objects*/
   function generateEventDataArray(boxesPerSide, yearID){ 
    var timelineDataPts = []; //array of points to be plotted on the timeline
      for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          //document.getElementById("timeline").innerHTML = document.getElementById("timeline").innerHTML + yearID + "<br>"; //label for the year in which the events took place
          for(var numType = 0; numType < 9; numType++){ //check each square for a fill
            var typeSquare = document.getElementById("type" + numType + "year" + yearID);
            var triangle = document.getElementById("tritype" + numType + "year" + yearID); //the triangle occupying the type square. could be null
            //for number of colors
            for(var numClr = 1; numClr <= numColors; numClr++){ //check which color the fill is
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


/*******************************************EVENT LISTENERS**********************************************/

  /*event listener to generate timeline from chart*/
  document.getElementById("timelineGen").addEventListener("click", drawTimeline);
  
  /*function to draw timeline from chart*/
  function drawTimeline() {
    var margin= {top:60, bottom:20, right:25, left:15};

    document.getElementById("timelineViz").innerHTML = ""; //clear out any previous timeline
    
    var dataArr = generateEventDataArray(10,0);

    //object with key as year and value as the number of events during that year
    var yearsMap = {};

    var canvas = d3.select('#timelineViz').append('svg')
              .attr("width",document.getElementById("timelineContainer").offsetWidth); //current width of the timelineContainer div
    
    var timeline = canvas.append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.linear()
                  .domain([0, 99])
                  .range([0,document.getElementById("timelineContainer").offsetWidth - margin.right])

    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(100)
                  .tickFormat(function(d) { //dont display text unless it's an even decade
                    if((d % 10) != 0){ 
                        return ("");
                    }else{ 
                        return (d + 1600); //the 1600 would be user input start century
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

    timeline.selectAll("rect")
      .data(dataArr)
      .enter()
      .append("rect")
      .attr("x",function(d){return (xScale(+d.year)-3)})
      .attr("y", function(d){ //prevent overlapping rectangles by keeping track of how many events occur each year
        if(yearsMap[d.year] == null)
            yearsMap[d.year] = 1;
        else 
            yearsMap[d.year] = +yearsMap[d.year] + 1;
        return (19 - 7*yearsMap[d.year] - yearsMap[d.year])})
      .attr("width", 7)
      .attr("height", 7)
      .attr("fill", function(d){return d.color})
      .on("mouseover",function(d){ //show and hide tooltip of event label
              document.getElementById(d.text + d.year).style.visibility = "visible";
      })
      .on("mouseout", function(d){
        document.getElementById(d.text + d.year).style.visibility ="hidden";
      });

    timeline.selectAll("text") 
      .data(dataArr)
      .enter()
      .append("text")
      .text(function(d){return d.text})
      .attr("x",function(d){return xScale(+d.year)}) //TODO: if year is 68, place text on left side of data point
      .attr("y",5)
      .attr("class","textLabels")
      .attr("id", function(d){return d.text + d.year}) //allows text elements to be accessible by their corresponding rect
      .style("visibility", "hidden");
  };


/**************************************END EVENT LISTENERS**********************************************/


/**************************************ADD YEAR LABELS**********************************************/
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

});
