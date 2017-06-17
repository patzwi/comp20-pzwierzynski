// Your JavaScript goes here...
function displayData(jsonData) {
  var messages = document.getElementById("messages");
  var post = "";
  jsonData.map((message) => {
    var current_mess = "<p> (" + message.id + ") " + message.content;
    current_mess += " : " + message.username + "</p>";
    post += current_mess;
  });
  messages.innerHTML = post;
}

function parse() {
  var xml = new XMLHttpRequest();
  xml.open("GET", "data.json", true);
  xml.onreadystatechange = function() {
    if ((xml.readyState == 4) && (xml.status == 200)) {
        //console.log("response received");
        var jsonData = JSON.parse(xml.responseText);
        displayData(jsonData);
    } /* else {
         console.log("waiting for response")
    } */
  };
  xml.send();
}
