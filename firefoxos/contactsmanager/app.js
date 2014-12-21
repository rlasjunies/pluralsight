$(document).ready(function () {
  console.log('doc.ready');
  $('#pickbutton').click(function () {
    console.log('pickbutton.clicked');
    var pick = new MozActivity({
      name: 'pick',
      data: {
        type: [
          'image/png',
          'image/jpg',
          'image/jpeg'
        ]
      }
    });
    pick.onsuccess = function () {
      console.log("pick.onsuccess");
      var currentImageBlob = this.result.blob;
      var img = $('<img />').attr({
        'id': 'contactimage',
        'src': window.URL.createObjectURL(currentImageBlob),
        'width': '100px'
      });
      $('#contactimage').replaceWith(img);
    };

    pick.onerror = function () {
        console.log("pick.onerror");
    };
  });
  
  $("#savebutton").click(function(){
    var person = new mozContact();
    console.log("firstName:" + $("#firstname").val());
    person.givenName = [$("#firstname").val()];
    person.familyName = [$("#lastname").val()];
    //person.photo=[currentImageBlob];
    
    var saving = navigator.mozContacts.save(person);
    
    saving.onsuccess= function(){
      console.log("contacts.saving.onsuccess");
    };
    
    saving.onerror = function(){
      console.log("contacts.saving.onerror");
    }
  });
  
});
/*
[object Object]
*/
