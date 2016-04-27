$('#loader').hide();
$('#mixName').hide();

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
  if(listItems.length > 0) {
    $('#mixName').show();
    $('#youtubeLinks').hide();
  } else {
    alert("Please input at least one song.");
  }
});

$('#addAnother').click(function() {
  $('#mixName').hide();
  $('#youtubeLinks').show();
});

$('#mixAdd').click(function(){
  var mixInput = document.getElementById("mixInput").value;
  var listItems = songList.getElementsByTagName('li');
  var formList = [];

  if(mixInput.length > 0) {
    if(mixInput.length > 100) {
      alert("Title is too long!");
    } else {
      $('#loader').show();
      for(i=0; i < listItems.length; i++){
        formList.push(listItems[i].firstChild.textContent);
      }
      $.ajax({
        url: '/submitSongs',
        data: {songs: formList, mixName: mixInput},
        type: 'POST',
      }).done (function(data){
        window.location.href = data;
      });
    }
  } else {
    alert("Please name your mix.");
  }
});