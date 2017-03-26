var config = {
    apiKey: "AIzaSyDifaAFl8i0PhAD2rKC7Tad1pWMV_55ZPk",
    authDomain: "experimento-c10ad.firebaseapp.com",
    databaseURL: "https://experimento-c10ad.firebaseio.com",
    storageBucket: "experimento-c10ad.appspot.com",
    messagingSenderId: "533864296923"
};

window.onload = function() {
  if(QueryString.err) {
    showError(QueryString.err);
  } else {
    firebase.initializeApp(config);
    checkSetup();
    init();
  }

};

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

function showError(err) {
  if(err==1) {
    var msgErr = document.getElementById('msg-err');
    msgErr.append('Não existe um experimento aberto :(');
    msgErr.removeAttribute("hidden");
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};
