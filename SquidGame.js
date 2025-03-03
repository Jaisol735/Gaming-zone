"use client"

import { useState, useEffect } from "react"
import "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/SquidGame/SuidGame.css"
import GameBoard from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/SquidGame/GameBoard.js"
import { generatePath, checkMove } from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/SquidGame/gameLogic.js"

function Squidgame() {
  const [chances, setChances] = useState(5)
  const [currentPosition, setCurrentPosition] = useState(-1) // -1 means at start
  const [correctPath, setCorrectPath] = useState([])
  const [gameState, setGameState] = useState("playing") // playing, won, lost
  const [gold, setGold] = useState(0)

  // Initialize the game
  useEffect(() => {
    startNewGame()
    fetchGold()
  }, [])

  const startNewGame = () => {
    setChances(5)
    setCurrentPosition(-1)
    setCorrectPath(generatePath())
    setGameState("playing")
  }

  const fetchGold = async () => {
    try {
      const response = await fetch("http://localhost:3001/getGold")
      const data = await response.json()
      setGold(data.gold)
    } catch (error) {
      console.error("Error fetching gold:", error)
    }
  }

  const updateGold = async () => {
    try {
      const response = await fetch("http://localhost:3001/increaseGold", {
        method: "POST",
      })
      const data = await response.json()
      setGold(data.gold)
    } catch (error) {
      console.error("Error updating gold:", error)
    }
  }

  const handleDivClick = (rowIndex, colIndex) => {
    // Only allow clicks if we're on the previous row or at start
    if (currentPosition !== rowIndex - 1) return

    const isCorrect = checkMove(rowIndex, colIndex, correctPath)

    if (isCorrect) {
      setCurrentPosition(rowIndex)

      // Check if player reached the end
      if (rowIndex === 9) {
        setGameState("won")
        updateGold() // Update gold in backend when player wins
      }
    } else {
      setCurrentPosition(-1) // Back to start
      setChances((prevChances) => prevChances - 1)

      // Check if player lost all chances
      if (chances <= 1) {
        setGameState("lost")
      }
    }
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Enchanted Forest Bridge</h1>
        <div className="game-stats">
          <div className="chances">Chances: {chances}</div>
          <div className="gold">Gold: {gold}</div>
        </div>
      </div>

      {gameState === "playing" && (
        <GameBoard correctPath={correctPath} currentPosition={currentPosition} onDivClick={handleDivClick} />
      )}

      {gameState === "won" && (
        <div className="game-result">
          <h2>Congratulations!</h2>
          <p>You successfully crossed the enchanted bridge!</p>
          <button onClick={startNewGame}>Play Again</button>
        </div>
      )}

      {gameState === "lost" && (
        <div className="game-result">
          <h2>Game Over</h2>
          <p>The forest spirits have bested you this time.</p>
          <button onClick={startNewGame}>Try Again</button>
        </div>
      )}
    </div>
  )
}

export default Squidgame
