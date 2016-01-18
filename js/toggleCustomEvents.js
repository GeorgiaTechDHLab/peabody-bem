
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
