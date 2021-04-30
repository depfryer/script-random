// ==UserScript==
// @name        mon-enfant.fr
// @namespace   Violentmonkey Scripts
// @match       https://mon-enfant.fr/trouver-un-mode-d-accueil
// @grant       none
// @version     1.2
// @author      -
// @description 29/04/2021 à 13:50:07
// @grant       GM_addStyle
// @downloadURL https://github.com/depfryer/script-random/raw/main/script_monEnfant.user.js
// @updateURL https://github.com/depfryer/script-random/raw/main/script_monEnfant.user.js
// ==/UserScript==


//-- Function
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'extraire les données</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

var checkExist = setInterval(function() {
   if (document.getElementsByClassName("autocomplete ui-autocomplete-input").item(0) != null) {
      return false
      clearInterval(checkExist);
   }
  return true
}, 500); // check every 100ms


function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    //var zNode       = document.createElement ('p');
    //zNode.innerHTML = 'The button was clicked.';
    //document.getElementById ("myContainer").appendChild (zNode);
  separator = '|'
  
  result = [`Nom ${separator} Adresse ${separator} Code postal ${separator} Ville ${separator} Telephone ${separator} Mail`]
    console.log(dataResult)
  for (let i = 0; i < dataResult.length; i++){
    let data = dataResult[i]
    
    const regex = /(.*) (\d{5}) (.*)/g;
    adresseSplit = regex.exec(data.adresse)
    
    result.push(data.nom + separator + adresseSplit[1] + separator + adresseSplit[2] + separator + adresseSplit[3] + separator + data.telephone + separator + data.mail)
  }
    download("export.csv", result.join('\n'))
    //document.getElementsByClassName('btn-more-results')[0]
}



//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               fixed;
        top:                    30%;
        left:                   80%;
        font-size:              14px;
        background:             orange;
        border:                 5px outset black;
        margin:                 9px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
    #menu{
      z-index: 1110;
}
` );
