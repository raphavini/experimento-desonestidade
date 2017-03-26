'use strict';

// Initializes Parte1Lancamento.
function Parte1Lancamento(experimentoChave) {
  this.experimentoChave = experimentoChave;
  
  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.link = document.getElementById('link');

  this.initFirebase();
}

// A loading image URL.
Parte1Lancamento.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte1Lancamento.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};


Parte1Lancamento.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k)
  .once('value').then(function(snapshot) {
    Parte1Lancamento.userName.textContent=snapshot.val().id;
    Parte1Lancamento.link.setAttribute('href','parte1-decisao.html?k='+QueryString.k+"&e="+QueryString.e);
  });
}

function init() {
  window.Parte1Lancamento = new Parte1Lancamento(QueryString.e);
};