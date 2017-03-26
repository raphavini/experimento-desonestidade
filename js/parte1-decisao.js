'use strict';

// Initializes Parte1Decisao.
function Parte1Decisao(experimentoChave) {
  this.experimentoChave = experimentoChave;

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.decisao = document.getElementById('decisao');

  this.link = document.getElementById('link');

  this.buttonSave = document.getElementById('save');
  this.buttonSave.addEventListener('click', this.save);

  this.msgErrada = document.getElementById('msg-errada');
  this.msgCerta = document.getElementById('msg-certa');
  this.error = document.getElementById('error');

  this.initFirebase();
}

// A loading image URL.
Parte1Decisao.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte1Decisao.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};

Parte1Decisao.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k).once('value').then(function(snapshot) {
    Parte1Decisao.userName.textContent=snapshot.val().id;
    var numGroup = snapshot.val().group.number;

    firebase.database().ref('/experiment/'+Parte1Decisao.experimentoChave+'/group/' + numGroup).once('value').then(function(snapGroup) {
      var qtd=0;
      var participants = snapGroup.val();
      for(var p in participants) {
        qtd++;
      }
      if(qtd < 3) {
        Parte1Decisao.link.setAttribute('href','parte-final.html?k='+QueryString.k+"&e="+QueryString.e);
      } else if(snapshot.val().group.tipo=='PC') {
        Parte1Decisao.link.setAttribute('href','parte2-instrucoes-pc.html?k='+QueryString.k+"&e="+QueryString.e);
      } else {
        Parte1Decisao.link.setAttribute('href','parte2-instrucoes-npc.html?k='+QueryString.k+"&e="+QueryString.e);
      }
    });

  });
}

Parte1Decisao.prototype.save = function() {
  Parte1Decisao.msgCerta.setAttribute('hidden','');
  Parte1Decisao.msgErrada.setAttribute('hidden','');
  Parte1Decisao.error.setAttribute('hidden','');
  if(Parte1Decisao.decisao.value=='') {
    Parte1Decisao.msgErrada.removeAttribute('hidden');
  } else {
    this.table = firebase.database().ref('/experiment/'+Parte1Decisao.experimentoChave+'/answer/'+QueryString.k+'/parte1');

    var answer = {
      value: Parte1Decisao.decisao.value,
    };
    this.table.set(answer).then(function(snapshot) {
      Parte1Decisao.msgCerta.removeAttribute('hidden');
      Parte1Decisao.link.removeAttribute('hidden');
      Parte1Decisao.buttonSave.setAttribute('hidden','');
      Parte1Decisao.decisao.setAttribute('disabled','true');
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
        Parte1Decisao.error.removeAttribute('hidden');
    });
  }
}

function init() {
  window.Parte1Decisao = new Parte1Decisao(QueryString.e);
}
