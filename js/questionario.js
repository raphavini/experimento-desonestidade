'use strict';

// Initializes Questionario.
function Questionario(experimentoChave) {
  this.experimentoChave = experimentoChave; 

  // Shortcuts to DOM Elements.
  this.userName = document.getElementById('user-name');

  this.idade = document.getElementById('input-idade');
  this.instituicaoEnsino = document.getElementById('input-instituicao-ensino');
  this.curso = document.getElementById('input-curso');
  this.renda1 = document.getElementById('input-renda1');
  this.renda2 = document.getElementById('input-renda2');
  this.renda3 = document.getElementById('input-renda3');
  this.renda4 = document.getElementById('input-renda4');
  this.renda5 = document.getElementById('input-renda5');
  this.numeroPessoas = document.getElementById('input-numero-pessoas');     
  this.genero1 = document.getElementById('input-genero1');
  this.genero2 = document.getElementById('input-genero2');
  this.genero3 = document.getElementById('input-genero3');

  this.msg1 = document.getElementById('msg1');
  this.msg2 = document.getElementById('msg2');
  this.msg3 = document.getElementById('msg3');
  this.msg4 = document.getElementById('msg4');
  this.msg5 = document.getElementById('msg5');
  this.msg6 = document.getElementById('msg6');

  this.buttonSend = document.getElementById('button-send');
  this.buttonSend.addEventListener('click', this.send);

  this.initFirebase();
}

// A loading image URL.
Questionario.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Sets up shortcuts to Firebase features and initiate firebase auth.
Questionario.prototype.initFirebase = function() {
  this.database = firebase.database();
  this.getID();
  this.setGroup();
};


Questionario.prototype.getID = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/'+QueryString.k).once('value').then(function(snapshot) {
    Questionario.userName.textContent=snapshot.val().id;
    console.log(snapshot.val().id);
  });
}

Questionario.prototype.setGroup = function() {
  firebase.database().ref('/experiment/'+this.experimentoChave+'/participant/').once('value', function(snapshot) {
    
    var participants = snapshot.val();
    var qtd=1;
    var numeroGrupo=1;
    
    for(var p in participants) {
      console.log("P: "+p);
      if(p == QueryString.k) {

        if(participants[p].group) {
          console.log('Participante já possuí grupo');
          return;
        }
        console.log("Qtd: "+qtd);
        console.log("Participante: "+p);
        console.log("Numero Grupo: "+numeroGrupo);
        break;
      }
      qtd++;
      if(qtd>3) {
        qtd=1;
        numeroGrupo++;
      }
    }
    
    var table = firebase.database().ref('/experiment/'+Questionario.experimentoChave+'/participant/'+QueryString.k+'/group');

    var tipoGrupo = (numeroGrupo%2)==0 ? 'PC' : 'NPC';

    var grupo = {
      number: numeroGrupo,
      tipo: tipoGrupo
    };
    table.set(grupo).then(function(snapshot) {
      console.log('Grupo criado');
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
    });

    var tableGrupo = firebase.database().ref('/experiment/'+Questionario.experimentoChave+'/group/'+numeroGrupo);
    tableGrupo.push(QueryString.k).then(function(snapshot) {
      console.log('Grupo gravado');
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
    });

    var tableCtrlChat = firebase.database().ref('/experiment/'+Questionario.experimentoChave+'/ctrlChat/'+numeroGrupo);
    tableCtrlChat.set(0).then(function(snapshot) {
      console.log('Ctrl grupo criado');
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
    });

  });
}

// Saves a new message on the Firebase DB.
Questionario.prototype.send = function() {
  var qtdError=0;

  if(!(Questionario.idade.value>0)) {
    Questionario.msg1.removeAttribute('hidden');
    qtdError++;
  } else {
    Questionario.msg1.setAttribute('hidden','');
  }
  if(Questionario.instituicaoEnsino.value=='') {
    Questionario.msg2.removeAttribute('hidden');
    qtdError++;
  } else {
    Questionario.msg2.setAttribute('hidden','');
  }
  if(Questionario.curso.value=='') {
    Questionario.msg3.removeAttribute('hidden');
    qtdError++;
  } else {
    Questionario.msg3.setAttribute('hidden','');
  }

  var rendaEscolhida = '';
  if(Questionario.renda1.checked) {
    rendaEscolhida = '0-1000';
    Questionario.msg4.setAttribute('hidden','');
  } else if(Questionario.renda2.checked) {
    rendaEscolhida = '1000-3000';
    Questionario.msg4.setAttribute('hidden','');
  } else if(Questionario.renda3.checked) {
    rendaEscolhida = '3000-5000';
    Questionario.msg4.setAttribute('hidden','');
  } else if(Questionario.renda4.checked) {
    rendaEscolhida = '5000-7000';
    Questionario.msg4.setAttribute('hidden','');
  } else if(Questionario.renda5.checked) {
    rendaEscolhida = '7000+';
    Questionario.msg4.setAttribute('hidden','');
  } else {
    Questionario.msg4.removeAttribute('hidden');
    qtdError++;
  } 

  if(!(Questionario.numeroPessoas.value>0)) {
    Questionario.msg5.removeAttribute('hidden');
    qtdError++;
  } else {
    Questionario.msg5.setAttribute('hidden','');
  }

  var generoEscolhido = '';
  if(Questionario.genero1.checked) {
    generoEscolhido = 'M';
    Questionario.msg6.setAttribute('hidden','');
  } else if(Questionario.genero2.checked) {
    generoEscolhido = 'F';
    Questionario.msg6.setAttribute('hidden','');
  } else if(Questionario.genero3.checked) {
    generoEscolhido = 'Outro';
    Questionario.msg6.setAttribute('hidden','');
  } else {
    Questionario.msg6.removeAttribute('hidden');
    qtdError++;
  }

  if(qtdError==0) {
    
    this.table = firebase.database().ref('/experiment/'+Questionario.experimentoChave+'/quiz/'+QueryString.k);

    var answer = {
      idade: Questionario.idade.value,
      instituicaoEnsino: Questionario.instituicaoEnsino.value, 
      curso: Questionario.curso.value,
      renda: rendaEscolhida,
      numeroPessoas: Questionario.numeroPessoas.value,
      genero: generoEscolhido,
    };

    this.table.push(answer).then(function(snapshot) {
      window.location.href="parte1-instruçoes.html?k="+QueryString.k+"&e="+QueryString.e;
    }).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
    });
  }
};

function init() {
  window.Questionario = new Questionario(QueryString.e);
};