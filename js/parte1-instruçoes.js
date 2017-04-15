'use strict';

// Initializes Parte1Instrucoes.
function Parte1Instrucoes(experimentoChave) {
  this.experimentoChave = experimentoChave;
  
  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.resposta = document.getElementById('resposta');

  this.msgErrada = document.getElementById('msg-errada');
  this.msgCerta = document.getElementById('msg-certa');

  this.buttonVerify = document.getElementById('verificar-resposta');
  this.buttonVerify.addEventListener('click', this.verify);

  this.link = document.getElementById('link');

  this.qtdTentativa = 0; 

  this.initFirebase();
}

// A loading image URL.
Parte1Instrucoes.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte1Instrucoes.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};


Parte1Instrucoes.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k)
  .once('value').then(function(snapshot) {
    Parte1Instrucoes.userName.textContent=snapshot.val().id;
    Parte1Instrucoes.link.setAttribute('href','parte1-lancamento.html?k='+QueryString.k+"&e="+QueryString.e);
  });
}


// Saves a new message on the Firebase DB.
Parte1Instrucoes.prototype.verify = function() {
  Parte1Instrucoes.qtdTentativa = Parte1Instrucoes.qtdTentativa+1;

  Parte1Instrucoes.msgCerta.setAttribute('hidden','');
  Parte1Instrucoes.msgErrada.setAttribute('hidden','');
  if(Parte1Instrucoes.resposta.value==3) {

    firebase.database().ref('/experiment/'+Parte1Instrucoes.experimentoChave+'/participant/'+QueryString.k+'/answer/parte1QtdTentativas')
    .set(Parte1Instrucoes.qtdTentativa).then(function(snapshot) {
      Parte1Instrucoes.msgCerta.removeAttribute('hidden');
      Parte1Instrucoes.link.removeAttribute('hidden');
      Parte1Instrucoes.buttonVerify.setAttribute('hidden','');
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
        Parte1Instrucoes.error.removeAttribute('hidden');
    });
  } else {
    Parte1Instrucoes.msgErrada.removeAttribute('hidden');
  }
};

function init() {
  window.Parte1Instrucoes = new Parte1Instrucoes(QueryString.e);
};