$.ajax({
    url: '/userMixes',
    type: 'GET',
}).done(function(response){
  console.log(response);
  var list = document.getElementById('profileUserMixes');
  for(i=0; i < response.length; i++){
    var a = document.createElement("a");
    var li = document.createElement('li');
    // a.textContent = document.createTextNode(response[i].title);
    console.log(response[i]);
    console.log(typeof(response[i].mix_id));
    var url = '/mix/' + response[i].mix_id;
    a.textContent = response[i].title;
    a.setAttribute('href', url);
    li.appendChild(a);
    list.appendChild(li);
  }
});