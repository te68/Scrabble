 PLAYERS_URL = "http://localhost:3000/players"
 let playerIds = []
 let gameOver = false


 function makeNewGameButton() {
   //create button for a new game
    const newGameButton = document.createElement('button')
    newGameButton.innerText = "Start New Game"
    newGameButton.id = "new-game-button"
    return newGameButton
 }

 function createForm(newGameButton) {
   //create the form for new players
   newGameFormLocation = document.querySelector('.new-game-form')
   newGameForm = document.createElement('form')
   newGameForm.id = "new-game-form"
   newGameFormLocation.appendChild(newGameForm)
   //create 4 inputs for player names
   for (let i = 0; i < 4; i++) {
     newInputField = document.createElement("input")
     newInputField.className="player-input"
     newInputField.setAttribute("placeholder", `Player ${i + 1} Name`)
     newGameForm.appendChild(newInputField)
   }
   newGameForm.appendChild(newGameButton)
 }

 function listenToNewGameForm() {
   const newGameForm = document.querySelector('#new-game-form')
   newGameForm.addEventListener('submit', function(event){
     event.preventDefault()
     //collect names of players
     let names = Array.from(newGameForm.children).map(function(box){
       return box.value
     })
     //remove all tiles from the board
     clearBoard()
     //reset the database
     resetGame(names)
     //empty form
     Array.from(newGameForm.children).slice(0,4).forEach( child => {
        child.value = ''
     })
   })
 }

function clearBoard() {
  const board = Array.from(document.querySelector('#board').children[0].children)
  board.forEach(function(row){
    const iterableRow = (Array.from(row.children))
    //iterate through entire board
    iterableRow.forEach(function(tile){
      //remove the active tile class and remake all special tiles
      if (tile.className.includes("double-letter")) {
        tile.classList.remove("board-letter-tile")
        tile.innerHTML = "DOUBLE LETTER SCORE"
      }
      else if (tile.className.includes("triple-word")) {
        tile.classList.remove("board-letter-tile")
        tile.innerHTML = "TRIPLE WORD SCORE"
      }
      else if (tile.className.includes("double-word")) {
        tile.classList.remove("board-letter-tile")
        tile.innerHTML = "DOUBLE WORD SCORE"
      }
      else if (tile.className.includes("triple-letter")) {
        tile.classList.remove("board-letter-tile")
        tile.innerHTML = "TRIPLE LETTER SCORE"
      }
      else if (tile.id === "center-star-cell") {
        //put the picture back
        tile.innerHTML = `<img src="./stylesheets/center-star.png" id="center-star-picture">`
      }
      else {
        //clear all regular tiles
        tile.innerHTML = ""
      }
    })
  })
}

async function resetGame(names) {
  //fetch custom controller action: start-new-game
  //deletes all of the tiles and builds starting set of tiles
  nameString = names.join(",")
  let resetGameData = fetch('http://localhost:3000/players/start-new-game', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({name: nameString})
  })
  let waitForReset = await resetGameData
  //reset the letter holder
  let playerNameInHeading = document.querySelector("#player-name")
  playerNameInHeading.innerText = ""
  let playerTiles = document.querySelector("#player-tiles").children[0].children[0].children //[<td>, <td>]
  for (let i = 0; i < playerTiles.length; i++) {
    playerTiles[i].innerHTML = ""
  }
  //remove old scoreboard
  if (document.querySelector('#scoreboard') != null) {
    document.querySelector('#scoreboard').remove()
  }
  //collect the new player ids
  getAllPlayerIds()
  //add scoreboard
  createScoreboard()
}


//fetch data for a single player
function fetchAPlayer(id) {
  allThePlayersData = fetch(`http://localhost:3000/players/${id}`)
  allThePlayersData.then(res => res.json())
  .then(playerJSON => {
    fillPlayerTiles(playerJSON)
  })
}


function listenToNextTurnButton() {
  let index = 0
  //index of player whose turn it is
  document.querySelector("#next-turn").addEventListener("click", function() {
    if (index === playerIds.length) {
      index = 0
    }
      grabNewTiles(playerIds[index])
      index += 1
  })
}

function fillPlayerTiles(playerJSON){
  //grab the letters from the current player
  let playerLetters = playerJSON.letters
  let playerNameInHeading = document.querySelector("#player-name")
  //add heading to the player's tile table
  playerNameInHeading.innerText = `${playerJSON.name}'s Tiles`
  let playerTiles = document.querySelector("#player-tiles").children[0].children[0].children //[<td>, <td>]
  //loop through the table object and player's tiles at the same time
  //placing each letter in each tile
  for (let i = 0; i < playerLetters.length; i++) {
    playerTiles[i].innerHTML = `<span class="letter-on-tile">${playerLetters[i].name}</span><span class="tiny-space"> </span><sub class="score-on-tile">${playerLetters[i].value}</sub>`
    playerTiles[i].setAttribute("letter", playerLetters[i].name)
    playerTiles[i].setAttribute("value", playerLetters[i].value)
    playerTiles[i].id = playerLetters[i].id
  }
  //fetch the api for the current player whose tiles are displayed
  //check if the bag is empty or not
  const player1 = fetch(`http://localhost:3000/players/1`)
  player1
  .then(res => res.json())
  .then(body => {
    if (!gameOver && body.letters.length === 0) {
      //alert players there is no letters left
      alert('Bag of letters is empty')
      gameOver = true
    }
  })
}

function listenToLetterTiles() {
  //select row of players tile and listen to them
  let playerTileRow = document.getElementById('player-tile-row')
  playerTileRow.addEventListener("click",(event) => {
    //clear all tiles of active-tile class
    let allActiveTiles = document.querySelectorAll('.active-tile')
    Array.from(allActiveTiles).forEach(function(tile){
      tile.classList.remove('active-tile')
    })
    //mark new tile as active
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
    //get attributes from tile selected
    const tile = document.querySelector('.active-tile')
    letter = tile.getAttribute("letter")
    value = tile.getAttribute("value")
    id = tile.id
    //fill the board with attributes
    if (event.target.tagName === "TD") {
      //account for all special tiles by setting their background color
      if (event.target.className === "double-letter") {
          event.target.style = "background: #AADDEE;"
      }
      else if (event.target.className === "triple-word") {
          event.target.style = "background: #FE4222;"
      }
      else if (event.target.className === "triple-letter") {
          event.target.style = "background: #4499FF;"
      }
      else if (event.target.className === "double-word") {
          event.target.style = "background: #FFAAAA;"
      }
      //change class no board tile and put letter on the board tile
      event.target.classList.add("board-letter-tile")
      event.target.innerHTML = `<span class="letter-on-tile">${letter}</span><span class="tiny-space"> </span><sub class="score-on-tile">${value}</sub>`
      //clear the tile on the player's tiles
      tile.innerHTML = ""
    }
    //account for the centern tie with the star
    else if (event.target.tagName === "IMG") {
      event.target.parentElement.classList.add("board-letter-tile")
      event.target.parentElement.innerHTML = `<span class="letter-on-tile">${letter}</span><span class="tiny-space"> </span><sub class="score-on-tile">${value}</sub>`
      tile.innerHTML = ""
    }
    //delete the letter or board from database
    fetch(`http://localhost:3000/letters/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
  })
}


async function getAllPlayerIds() {
  //fetch all the players
  allPlayerIds = fetch(PLAYERS_URL)
  waitForAllPlayerIds = await allPlayerIds
  allPlayerIds
  .then(res => res.json())
  .then(allPlayerObjs => {
    allPlayerObjs.filter(playerObj => {
      return playerObj.id != 1
    }).forEach(playerObj => {
      //add ids to the id array
      playerIds.push(playerObj.id)
      //console.log(`${playerObj.id} is in`)
    })
  })
}

async function grabNewTiles(id) {
  //fetch custom route draw replacements
  //refills the players tiles after their turn
  const grabbingTiles = fetch('http://localhost:3000/players/draw_replacements', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({id: id})
  })
  let tileChanges = await grabbingTiles
  //display the new tiles
  fetchAPlayer(id)
}

function createScoreboard() {
  //creaete table for addNameHeadersToScoreboard
  let scoreboard = document.createElement("table")
  scoreboard.id = "scoreboard"
  const scoreboardContainer = document.querySelector('.scoreboard-container')
  let captionThatSaysScoreboard = document.createElement("caption")
  captionThatSaysScoreboard.innerText="Scoreboard"
  captionThatSaysScoreboard.className ="scoreboard-heading"
  scoreboard.appendChild(captionThatSaysScoreboard)
  scoreboardContainer.appendChild(scoreboard)
  //fetch player info
  const players = fetch('http://localhost:3000/players')
  players
  .then(res => res.json())
  .then(body => {
    //grab the ids
     const ids = body.map(function(player){
      return player.id
    }).slice(1)
    //grab the names
    const names = body.map(function(player){
      return player.name
    }).slice(1)
    const scores = body.map(function(player){
      return player.score
    }).slice(1)
    addNameHeadersToScoreboard(names)
    addScoreInputFormForEachPlayer(ids)
    addTotalScoreRow(ids, scores)
  })
}

function addNameHeadersToScoreboard(names) {
    //create a row for the names
    let newRow =  document.createElement("tr")
    newRow.className = "scoreboard-name-header"
    names.forEach(function(name) {
      let playerNameHeader = document.createElement("th")
      playerNameHeader.style.width = '4em'
      playerNameHeader.className = "player-name-header"
      playerNameHeader.innerText = name
      newRow.appendChild(playerNameHeader)
    })
    const scoreboard = document.querySelector('#scoreboard')
    scoreboard.appendChild(newRow)
}

function addScoreInputFormForEachPlayer(ids) {
//first row already established at this point
    let newRow2 = document.createElement("tr")
    ids.forEach( id => {
        let newTDThatHoldsInput = document.createElement("td")
        newTDThatHoldsInput.className ="player-name-header"
        let newScoreInputForm = document.createElement("form")
        newScoreInputForm.id = id
        newScoreInputForm.innerHTML = `<input type="text" size = "12" placeholder="Enter Score" id="score-input-for-player-id-${id}" class="score-input"> </input>
        <input type="submit" value="Submit" class="score-submit-button"></input>`
        newTDThatHoldsInput.appendChild(newScoreInputForm)
        newRow2.appendChild(newTDThatHoldsInput)
        newScoreInputForm.addEventListener("submit", refineScore)
      })
    const scoreboard = document.querySelector('#scoreboard')
    scoreboard.appendChild(newRow2)
}

function refineScore() {
  event.preventDefault()
  let id = event.target.id
  const inputField = document.querySelector(`#score-input-for-player-id-${id}`)
  const updateScore = fetch(`http://localhost:3000/players/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({score: inputField.value})
  })
  updateScore
  .then(res => res.json())
  .then(body => {
    const playerScore = document.querySelector(`#new-score-display-for-player-id-${id}`)
    playerScore.innerText = body.score
  })
  inputField.value = ""
}

function addTotalScoreRow(ids, scores) {
    const scoreboard = document.querySelector('#scoreboard')
    let newScoreRow = document.createElement("tr")
    for (let i = 0;i < ids.length; i ++) {
      let newScoreDisplay = document.createElement("td")
      newScoreDisplay.innerText = scores[i]
      newScoreDisplay.className = "player-name-header"
      newScoreDisplay.id = `new-score-display-for-player-id-${ids[i]}`
      newScoreRow.appendChild(newScoreDisplay)
    }
    scoreboard.appendChild(newScoreRow)
}



createForm(makeNewGameButton())
listenToNewGameForm()
listenToNextTurnButton()
listenToLetterTiles()
listenToBoardTiles()
