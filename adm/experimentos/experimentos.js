'use strict';

// Initializes Experimento.
function Experimento() {
  
  this.seq = 1;

  // Shortcuts to DOM Elements.
  this.buttonStart = document.getElementById('button-start');
  this.buttonStart.addEventListener('click', this.startExperiment);

  this.experimentList = document.getElementById('experiment-list');

  this.loadTable();
}

// A loading image URL.
Experimento.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Experimento.prototype.loadTable = function() {
  var setExperiment = function(data) {
    var val = data.val();

    var row = Experimento.experimentList.insertRow();
    if(val.id) {
      Experimento.seq=val.id+1;
      var cell0 = row.insertCell();
      cell0.append(val.id);
    }
    if(val.start) {
      var cell1 = row.insertCell();
      var cell2 = row.insertCell();

      var dt = new Date(val.start);
      var dtFormat = dt.getDate()+"/"+dt.getMonth()+"/"+dt.getYear()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();

      cell1.append(dtFormat);
      cell2.innerHTML = '<a id="'+data.key+'stop" name="'+data.key+'" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" hidden="">Parar</a><a id="'+data.key+'start" name="'+data.key+'" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Reiniciar</a>';

      this.buttonStart = document.getElementById(data.key+'start');
      this.buttonStart.addEventListener('click', Experimento.startAgainExperiment);
      this.buttonStop = document.getElementById(data.key+'stop');
      this.buttonStop.addEventListener('click', Experimento.stopExperiment);

      if(Experimento.opened) {
        Experimento.showButtonStop(data.key);  
      }
    } else {
      Experimento.showButtonStop(val);
    }
  }.bind(this);
  firebase.database().ref('/experiment/').on('child_added',setExperiment);
  //firebase.database().ref('/experiment/').on('child_changed',setExperiment);
};

Experimento.prototype.showButtonStop = function(idExperimento) {
  if(Experimento.opened) {
    var stopButtonClose = document.getElementById(Experimento.opened+'stop');
    stopButtonClose.setAttribute('hidden','');
    var startButtonClose = document.getElementById(Experimento.opened+'start');
    startButtonClose.removeAttribute('hidden');
  }

  var stopButtonOpen = document.getElementById(idExperimento+'stop');
  stopButtonOpen.removeAttribute('hidden');
  var startButtonOpen = document.getElementById(idExperimento+'start');
  startButtonOpen.setAttribute('hidden','');

  Experimento.opened = idExperimento;
}

Experimento.prototype.showButtonStart = function(idExperimento) {
  var stopButtonOpen = document.getElementById(idExperimento+'stop');
  stopButtonOpen.setAttribute('hidden','');
  var startButtonOpen = document.getElementById(idExperimento+'start');
  startButtonOpen.removeAttribute('hidden');

  Experimento.opened = null;
}

Experimento.prototype.initFirebase = function() {
  this.database = firebase.database();
};

// Saves a new message on the Firebase DB.
Experimento.prototype.startExperiment = function() {
  var hoje = new Date();

  firebase.database().ref('/experiment/').push({id:Experimento.seq++, start: hoje.getTime()}).then(function(snapshot) {
    console.log('Experimento cadastrado');
    firebase.database().ref('/experiment/open').set(snapshot.key).then(function(snapshot) {
      console.log('Novo experimento aberto');  
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });  
  }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
  });
};

Experimento.prototype.stopExperiment = function(data) {
  //if(data.target.name == Experimento.opened) {
  //  var stopButtonClose = document.getElementById(data.target.name+'stop');
  //  stopButtonClose.setAttribute('hidden','');
  //  var startButtonClose = document.getElementById(data.target.name+'start');
  //  startButtonClose.removeAttribute('hidden');
  //  Experimento.opened = null;
    Experimento.showButtonStart(data.target.name);
    firebase.database().ref('/experiment/open').set(null).then(function(snapshot) {
      console.log('Experimento fechado');
    });
  //}
};
Experimento.prototype.startAgainExperiment = function(data) {
  Experimento.showButtonStop(data.target.name);
  firebase.database().ref('/experiment/open').set(data.target.name).then(function(snapshot) {
      console.log('Experimento aberto novamente');  
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
  }); 
};
function init() {
  window.Experimento = new Experimento();
};