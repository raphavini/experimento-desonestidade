'use strict';

// Initializes Parte2Lancamento.
function Parte2Lancamento(experimentoChave) {
  this.experimentoChave = experimentoChave;

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.link = document.getElementById('link');

  this.initFirebase();
}

// A loading image URL.
Parte2Lancamento.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte2Lancamento.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};


Parte2Lancamento.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k)
    .once('value').then(function(snapshot) {
      Parte2Lancamento.userName.textContent=snapshot.val().id;
      Parte2Lancamento.link.setAttribute('href','parte2-instrucoes-chat.html?k='+QueryString.k+"&e="+QueryString.e);
  });
}

function init() {
  window.Parte2Lancamento = new Parte2Lancamento(QueryString.e);
};