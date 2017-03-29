'use strict';

// Initializes Parte2Decisao.
function Parte2Decisao(experimentoChave) {
  this.experimentoChave = experimentoChave;

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.decisao = document.getElementById('decisao');

  this.msgErrada = document.getElementById('msg-errada');
  this.msgCerta = document.getElementById('msg-certa');
  this.error = document.getElementById('error');

  this.buttonVerify = document.getElementById('save');
  this.buttonVerify.addEventListener('click', this.save);

  this.link = document.getElementById('link');

  this.initFirebase();
}

// A loading image URL.
Parte2Decisao.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte2Decisao.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};


Parte2Decisao.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k).once('value').then(function(snapshot) {
    Parte2Decisao.userName.textContent=snapshot.val().id;
    Parte2Decisao.link.setAttribute('href','parte-final.html?k='+QueryString.k+"&e="+QueryString.e);
  });
}

Parte2Decisao.prototype.save = function() {
  Parte2Decisao.msgCerta.setAttribute('hidden','');
  Parte2Decisao.msgErrada.setAttribute('hidden','');
  Parte2Decisao.error.setAttribute('hidden','');
  if(Parte2Decisao.decisao.value=='') {
    Parte2Decisao.msgErrada.removeAttribute('hidden');
  } else {
    this.table = firebase.database().ref('/experiment/'+Parte2Decisao.experimentoChave+'/participant/'+QueryString.k+'/answer/parte2');

    this.table.set(Parte2Decisao.decisao.value).then(function(snapshot) {
      Parte2Decisao.msgCerta.removeAttribute('hidden');
      Parte2Decisao.link.removeAttribute('hidden');
      Parte2Decisao.decisao.setAttribute('disabled','true');
      Parte2Decisao.buttonVerify.setAttribute('hidden','')
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
        Parte2Decisao.error.removeAttribute('hidden');
    });
  }
}

function init() {
  window.Parte2Decisao = new Parte2Decisao(QueryString.e);
};