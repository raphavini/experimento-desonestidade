'use strict';

// Initializes Parte2InstrucoesChat.
function Parte2InstrucoesChat(experimentoChave) {
  this.experimentoChave = experimentoChave;
  
  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.link = document.getElementById('link');

  this.initFirebase();

  //setTimeout(startCountdown,1000);
}

// A loading image URL.
Parte2InstrucoesChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Parte2InstrucoesChat.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
};


Parte2InstrucoesChat.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/' + QueryString.k).once('value').then(function(snapshot) {
    Parte2InstrucoesChat.userName.textContent=snapshot.val().id;
    Parte2InstrucoesChat.link.setAttribute('href','parte2-chat.html?k='+QueryString.k+"&e="+QueryString.e);
  });
}

var minuto = 0;
var segundo = 20;
var contagemRegressiva;
var zeroSegundo = "";

function startCountdown(){
  if(segundo==0) {
    segundo=60;
    minuto--;
  }
  if(minuto<0) {
    Parte2InstrucoesChat.link.removeAttribute('hidden');
  } else {
    segundo--;
    if(segundo<10) {
      zeroSegundo="0";
    } else {
      zeroSegundo="";
    }
    numberCountdown.innerText = '0' + minuto + ':' + zeroSegundo + segundo;
    setTimeout(startCountdown,1000);
  }
}

function init() {
  window.Parte2InstrucoesChat = new Parte2InstrucoesChat(QueryString.e);
};