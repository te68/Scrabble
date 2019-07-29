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
     resetGame()
     createNewPlayers(names.slice(0,4))
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

function resetGame() {
  const resetGameData = fetch('http://localhost:3000/players/start-new-game')
}

function createNewPlayers(names) {
  nameString = names.join(",")
    const newPlayerData = fetch('http://localhost:3000/players', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({name: nameString})

    })
}


createForm(makeNewGameButton())
listenToNewGameForm()
