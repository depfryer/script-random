// ==UserScript==
// @name        iadfrance.fr
// @namespace   Violentmonkey Scripts
// @match       https://www.iadfrance.fr/trouver-un-conseiller/*
// @grant       GM_addStyle
// @version    1.3
// @downloadURL https://github.com/depfryer/script-random/raw/main/script_iadfrance.user.js
// @updateURL https://github.com/depfryer/script-random/raw/main/script_iadfrance.user.js
// ==/UserScript==

const syncWait = ms => {
    const end = Date.now() + ms
    while (Date.now() < end) continue
}
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


function getNombreClient(){
  titre = document.getElementsByClassName('text-h3')[0].textContent
  titre_nombre = parseInt(titre)
  if ((titre_nombre === NaN) | (titre_nombre ===0)) return 0
  return parseInt(titre_nombre)+50
}


function clickonelemet(nbclick) {
  return new Promise(resolve => {
    i = 0
      let itr = setInterval(() => {
        old_lenght = 0
        r = document.getElementById('js--results').childElementCount
        if (old_lenght != r){
          old_lenght = r
          i++
          a  = document.getElementsByClassName('show--more')
          try {
            a[0].click()
          }
          catch (err) {
            console.log(err)
            clearInterval(itr)
            resolve()
          }
          if (i>nbclick) {
            clearInterval(itr)
            resolve()
          }
        }
      }, 500);
        return 1
  });
}




function getInfoPeople(people) {
  whitespace = /\s{2,}/ig;
  nom = people.getElementsByClassName('agent_name')[0].textContent.replaceAll(whitespace, ' ')

  ville = people.getElementsByClassName('agent_card_location')[0].textContent.replaceAll(whitespace, ' ')
  try {
    note = people.getElementsByClassName('immodvisor-rating')[0].children[1].textContent.replaceAll(whitespace, ' ')
    note = parseFloat(note.replaceAll(',', '.'))
    nbavis = people.getElementsByClassName('immodvisor-comments')[0].textContent.replaceAll(whitespace, ' ')
    nbavis = parseInt(nbavis.replaceAll('(', ''))
  }
  catch(error){
    note = 0.0
    nbavis = 0
  }
  try{
    telephone = people.getElementsByClassName('desktop-hide i-btn i-btn--primary')[0].getAttribute('data-phone').replaceAll(whitespace, ' ')
  }
  catch(error){
    telephone = ''
  }
    console.log({'nom':nom, 'ville':ville, 'note':note, "nbavis":nbavis, 'telephone':telephone})
    return {'nom':nom, 'ville':ville, 'note':note, "nbavis":nbavis, 'telephone':telephone}
}

async function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    //var zNode       = document.createElement ('p');
    //zNode.innerHTML = 'The button was clicked.';
    //document.getElementById ("myContainer").appendChild (zNode);
  let nbclick = Math.ceil(getNombreClient()/6)
  console.log(nbclick)
  a = clickonelemet(nbclick)
  console.log(a)
  a.then(resp =>{

    setTimeout(() =>{
    console.log('BBBB')
    r = document.getElementById('js--results')
    res = []
    elements = []
    for (let j = 0; j < r.childElementCount; j++) {
      child1 = r.children[j]

      for(let k = 0; k < child1.childElementCount; k++){
        child2 = child1.children[k]
        res.push(getInfoPeople(child2))
      }
    }
    separator = '|'

    result = [`Nom ${separator} Ville (CP)${separator} Note ${separator} Nombre Avis ${separator} Telephone ${separator} Mail`]
              // Nom| Prénom| Ville CP| Note| Nbre avis| Téléphone| mail|
  //     console.log(dataResult)
    for (let i = 0; i < res.length; i++){
      let data = res[i]

      result.push(data['nom'] + separator +
                  data['ville'] + separator +
                  data['note'] + separator +
                  data['nbavis'] + separator +
                  data['telephone'])
    }
      download("export.csv", result.join('\n'))
      //document.getElementsByClassName('btn-more-results')[0]
    }, 1000)
  })
  a.catch(err=>{
    console.log(err)
  })

}



//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               fixed;
        top:                    20%;
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
