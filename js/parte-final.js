'use strict';

// Initializes Geral.
function ParteFinal(experimentoChave) {
  this.experimentoChave = experimentoChave;

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');
  this.pontos = document.getElementById('pontos');
  this.valorReceber = document.getElementById('valor-receber');
  this.buttonLink = document.getElementById('button-link');

  this.initFirebase();
}

// A loading image URL.
ParteFinal.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
ParteFinal.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
  this.getPontos();
};

ParteFinal.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k).once('value').then(function(snapshot) {
    ParteFinal.userName.textContent=snapshot.val().id;
  });
}
ParteFinal.prototype.getPontos = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/answer/' + QueryString.k).once('value').then(function(snapshot) {
    var pontosParte1 = 0;
    if(snapshot.val().parte1) {
      pontosParte1 = parseInt(snapshot.val().parte1.value);
    }
    var pontosParte2 = 0;
    if(snapshot.val().parte2) {
      pontosParte2 = parseInt(snapshot.val().parte2.value);
    }    
    var pontos = pontosParte1+pontosParte2;
    ParteFinal.pontos.textContent=pontos;
    ParteFinal.valorReceber.textContent=pontos;
  });
}

function init() {
  window.ParteFinal = new ParteFinal(QueryString.e);
}