'use strict';

// Initializes Parte2Instrucoes.
function Parte2Instrucoes(experimentoChave) {
  this.experimentoChave = experimentoChave;

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.msgCerta1 = document.getElementById('msg-certa1');
  this.msgErrada1 = document.getElementById('msg-errada1');
  this.msgCerta2 = document.getElementById('msg-certa2');
  this.msgErrada2 = document.getElementById('msg-errada2');

  this.resposta1 = document.getElementById('resposta1');
  this.resposta2 = document.getElementById('resposta2');

  this.link = document.getElementById('link');

  this.buttonVerify = document.getElementById('verificar-resposta');
  this.buttonVerify.addEventListener('click', this.verify);

  this.tipoGrupo = document.getElementById('tipo-grupo');

  this.initFirebase();
}

// A loading image URL.
Parte2Instrucoes.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte2Instrucoes.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};


Parte2Instrucoes.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k).once('value').then(function(snapshot) {
    Parte2Instrucoes.userName.textContent=snapshot.val().id;
    Parte2Instrucoes.link.setAttribute('href','parte2-lancamento.html?k='+QueryString.k+"&e="+QueryString.e);
  });
}


// Saves a new message on the Firebase DB.
Parte2Instrucoes.prototype.verify = function() {
  
  Parte2Instrucoes.msgCerta1.setAttribute('hidden','');
  Parte2Instrucoes.msgErrada1.setAttribute('hidden','');
  Parte2Instrucoes.msgCerta2.setAttribute('hidden','');
  Parte2Instrucoes.msgErrada2.setAttribute('hidden','');  

  var ok = 0;

  // valores para NPC
  var resposta1Certa=4;
  var resposta2Certa=4;

  if(Parte2Instrucoes.tipoGrupo.value=='PC') {
    resposta2Certa=0;
  }

  if(Parte2Instrucoes.resposta1.value==resposta1Certa) {
    Parte2Instrucoes.msgCerta1.removeAttribute('hidden');
    ok++;
  } else {
    Parte2Instrucoes.msgErrada1.removeAttribute('hidden');
  }
  
  if(Parte2Instrucoes.resposta2.value==resposta2Certa) {
    Parte2Instrucoes.msgCerta2.removeAttribute('hidden');
    ok++;
  } else {
    Parte2Instrucoes.msgErrada2.removeAttribute('hidden');
  }

  if(ok==2) {
    Parte2Instrucoes.link.removeAttribute('hidden');
    Parte2Instrucoes.buttonVerify.setAttribute('hidden','');    
  }
};

function init() {
  window.Parte2Instrucoes = new Parte2Instrucoes(QueryString.e);
};