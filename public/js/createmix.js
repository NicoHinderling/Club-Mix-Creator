$('#loader').hide();
var songList = document.getElementById("currentList");

$('#addNewLink').click(function() {
  var newItem = document.createElement("li");
  var youtubeLink = document.getElementById("youtubeLinkInput").value;
  if (youtubeLink.substring(0, 12) != 'https://www.') {
    if(youtubeLink.substring(0, 4) != 'www.'){
      youtubeLink = 'https://www.' + youtubeLink;
    } else {
      youtubeLink = 'https://' + youtubeLink;
    }
  }
  if(youtubeLink.indexOf("youtube.com/watch?v=") > -1) {
    var numberListValue = document.createTextNode(youtubeLink);
    document.getElementById("youtubeLinkInput").value = "";
    $('#youtubeLinkInput').value = "";
    newItem.appendChild(numberListValue);
    songList.appendChild(newItem);
  } else {
    alert("not a valid youtube link!");
  }
});

$('#makeMix').click(function() {
  var listItems = songList.getElementsByTagName('li');
  var formList = [];
  if(listItems.length > 0) {
    $('#loader').show();
    for(i=0; i < listItems.length; i++){
      formList.push(listItems[i].firstChild.textContent);
      console.log(listItems[i].firstChild.textContent);
    }
    $.ajax({
      url: 'http://www.localhost:3000/submitSongs',
      data: {songs: formList},
      type: 'POST',
    }).done (function(data){
      console.log("done");
      // console.log(data);
    });
  } else {
    alert("Please input at least one song.");
  }
});