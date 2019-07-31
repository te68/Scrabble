 PLAYERS_URL = "http://localhost:3000/players"
 let playerIds
 let gameOver = false


 function makeNewGameButton() {
    const newGameButton = document.createElement('button')
    newGameButton.innerText = "Start New Game"
    newGameButton.id = "new-game-button"
    return newGameButton
 }

 function createForm(newGameButton) {
   newGameFormLocation = document.querySelector('.new-game-form')
   newGameForm = document.createElement('form')
   newGameForm.id = "new-game-form"
   newGameFormLocation.appendChild(newGameForm)
   for (let i = 0; i < 4; i++) {
     newInputField = document.createElement("input")
     newInputField.setAttribute("placeholder", `Player ${i + 1} Name`)
     newGameForm.appendChild(newInputField)
   }
   newGameForm.appendChild(newGameButton)
 }

 function listenToNewGameForm() {
   const newGameForm = document.querySelector('#new-game-form')
   newGameForm.addEventListener('submit', function(event){
     event.preventDefault()
     let names = Array.from(newGameForm.children).map(function(box){
       return box.value
     })
     clearBoard()
     resetGame(names)
     Array.from(newGameForm.children).slice(0,4).forEach( child => {
        child.value = ''
     })
   })

 }

function clearBoard() {
  const board = Array.from(document.querySelector('#board').children[0].children)
  board.forEach(function(row){
    const iterableRow = (Array.from(row.children))
    iterableRow.forEach(function(tile){
      if (tile.className != "double-letter" && tile.id != "center-star-cell") {
        tile.innerHTML = ""
      }
    })
  })
}

function resetGame(names) {
  nameString = names.join(",")
  fetch('http://localhost:3000/players/start-new-game', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({name: nameString})
  })
  //reset the letter holder
  let playerNameInHeading = document.querySelector("#player-name")
  playerNameInHeading.innerText = ""
  let playerTiles = document.querySelector("#player-tiles").children[0].children[0].children //[<td>, <td>]
  for (let i = 0; i < playerTiles.length; i++) {
    playerTiles[i].innerHTML = ""
  }
  //collect the new player ids
  playerIds = getAllPlayerIds()
}



function fetchAPlayer(id) {
  allThePlayersData = fetch(`http://localhost:3000/players/${id}`)
  allThePlayersData.then(res => res.json())
  .then(playerJSON => {
    fillPlayerTiles(playerJSON)
  })
}


function listenToNextTurnButton() {
  let index = 0
  document.querySelector("#next-turn").addEventListener("click", function() {
    if (index === playerIds.length) {
      index = 0
    }
      fetchAPlayer(playerIds[index] + (playerIds.length))
      index += 1
  })
}

function fillPlayerTiles(playerJSON){
  let playerLetters = playerJSON.letters
  let playerNameInHeading = document.querySelector("#player-name")
  playerNameInHeading.innerText = `${playerJSON.name}'s Tiles`
  let playerTiles = document.querySelector("#player-tiles").children[0].children[0].children //[<td>, <td>]
  for (let i = 0; i < playerLetters.length; i++) {
    playerTiles[i].innerHTML = `<span class="letter-on-tile">${playerLetters[i].name}</span><span class="tiny-space"> </span><sub class="score-on-tile">${playerLetters[i].value}</sub>`
    playerTiles[i].setAttribute("letter", playerLetters[i].name)
    playerTiles[i].setAttribute("value", playerLetters[i].value)
    playerTiles[i].id = playerLetters[i].id
  }
  const player1 = fetch(`http://localhost:3000/players/1`)
  player1
  .then(res => res.json())
  .then(body => {
    if (!gameOver && body.letters.length === 0) {
      alert('Bag is empty')
      gameOver = true
    }
  })
}

function listenToLetterTiles() {
  let playerTileRow = document.getElementById('player-tile-row')
  playerTileRow.addEventListener("click",(event) => {
    if (event.target.className != "letter-tile" && !event.target.classList.contains("active-tile")) {
        event.target.parentElement.classList.add("active-tile")
    }
    else if (!event.target.parentElement.classList.contains("active-tile")) {
        event.target.classList.add("active-tile")
    }
  })
}

function listenToBoardTiles(letter, value, id) {
  //select ALL tds from board table
  //genenral structure <table> <tr> 15<td>s </tr> x15 </table>
  let board = document.querySelector("#board")
  board.addEventListener("click", (event) => {
    const tile = document.querySelectorAll('.active-tile')[document.querySelectorAll('.active-tile').length - 1]
    letter = tile.getAttribute("letter")
    value = tile.getAttribute("value")
    id = tile.id
    tile.classList.remove('active-tile')
    if (event.target.tagName === "TD") {
      if (event.target.className === "double-letter") {
          //event.target.classList.add("double-letter-picked")
          event.target.style = "background: #AADDEE;"
      }
      event.target.classList.add("board-letter-tile")
      event.target.innerHTML = `<span class="letter-on-tile">${letter}</span><span class="tiny-space"> </span><sub class="score-on-tile">${value}</sub>`
      tile.innerHTML = ""
    }
    else if (event.target.tagName === "IMG") {
      event.target.parentElement.classList.add("board-letter-tile")
      event.target.parentElement.innerHTML = `<span class="letter-on-tile">${letter}</span><span class="tiny-space"> </span><sub class="score-on-tile">${value}</sub>`
      tile.innerHTML = ""
    }
    fetch(`http://localhost:3000/letters/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
  })
}


function getAllPlayerIds() {
  allPlayerIds = fetch(PLAYERS_URL).then(res => res.json()).then(allPlayerObjs => allPlayerObjs.filter(playerObj => {return playerObj.id!= 1}).map(playerObj => {return playerObj.id}))
  .then(actualPlayers => actualPlayers.forEach(player => playerIds.push(player)))
  var playerIds = []
    return playerIds
}

function listenToFinishWordButton() {
  let index = 0
  const finishWord = document.querySelector('#draw-new-letters')
  finishWord.addEventListener('click', function(event) {
      if (index === playerIds.length) {
        index = 0
      }
      grabNewTiles(playerIds[index]+ (playerIds.length))
      index += 1
  })
}

function grabNewTiles(id) {
  fetch('http://localhost:3000/players/draw_replacements', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({id: id})
  })
}



createForm(makeNewGameButton())
listenToNewGameForm()
listenToNextTurnButton()
listenToLetterTiles()
listenToBoardTiles()
listenToFinishWordButton()
