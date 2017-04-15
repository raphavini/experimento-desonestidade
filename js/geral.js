'use strict';

// Initializes Geral.
function Geral(experimentoChave) {
  this.experimentoChave = experimentoChave;
  
  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');
  this.buttonLink = document.getElementById('button-link');

  this.initFirebase();
}

// A loading image URL.
Geral.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Geral.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.saveParticipant();
};

// Saves a new message on the Firebase DB.
Geral.prototype.saveParticipant = function() {
  this.table = this.database.ref('/experiment/'+this.experimentoChave+'/participant');
  this.datePush = new Date();
  this.idUser = Math.round(Math.random()*100000);
  this.table.push({
      id: this.idUser,
      start: this.datePush.getTime()
  }).then(function(snapshot) {
      //Geral.userName.textContent=snapshot.child('id').val();
      Geral.userName.textContent=this.idUser;
      Geral.buttonLink.href="questionario.html?k="+snapshot.key+"&e="+Geral.experimentoChave;
      Geral.buttonLink.removeAttribute('disabled');
  }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
  });
};

function init() {
  firebase.database().ref('/experiment/open').once('value', function(snapshot) {
    var experimentoChave = snapshot.val();
    if(experimentoChave) {
      window.Geral = new Geral(experimentoChave);
    } else {
      window.location = "index.html?err=1";
    }
  });
}