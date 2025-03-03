import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gameBoardImage from "./game.png";  // Game board background
// Navbar Component
import "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/SnakeAndLadder/SnakeAndLadder.css"
const Navbar = () => {
  const navigate = useNavigate();
  const [gold, setGold] = useState(0);

  useEffect(() => {
    fetch("/api/gold")
      .then((res) => res.json())
      .then((data) => setGold(data.gold))
      .catch((err) => console.error("Error fetching gold:", err));
  }, []);

  return (
    <nav style={{ borderBottom: "2px solid black", padding: "10px", display: "flex", justifyContent: "space-between" }}>
      <button className="back-button" onClick={() => navigate("/")} style={{width:"80px",height: "40px",background:"#DC143C",
      color: "#fff",fontSize: "16px",borderRadius: "40px", display: "flex", justifyContent: "center", textAlign: "center"}}>
        Back
      </button>
      <h2 style={{color:"#DC143C",fontSize: "3rem",boxShadow: "10px"}}>Snake & Ladder</h2>
      <div style={{ color: "gold", fontWeight: "bold", fontSize: "1.5rem",boxShadow: "10px",marginTop: "25px"}}>Gold: {gold}</div>
    </nav>
  );
};

// Game Board Component (Fixed Layout & Movement)
const GameBoard = ({ playerPosition, computerPosition }) => {
  const generateBoard = () => {
    const boxes = [];
    let number = 100;

    for (let row = 0; row < 10; row++) {
      let rowBoxes = [];
      for (let col = 0; col < 10; col++) {
        rowBoxes.push(
          <div key={number} style={{ 
            width: "40px", height: "40px", textAlign: "center", position: "relative",color: "transparent"}}>
            {number}
            {playerPosition === number && <div style={{ width: "15px", height: "15px", backgroundColor: "red", borderRadius: "50%", position: "absolute", top: "5px", left: "5px" }} />}
            {computerPosition === number && <div style={{ width: "15px", height: "15px", backgroundColor: "blue", borderRadius: "50%", position: "absolute", bottom: "5px", right: "5px" }} />}
          </div>
        );
        number--;
      }
      if (row % 2 === 1) rowBoxes.reverse(); // Zigzag pattern
      boxes.push(...rowBoxes);
    }
    return boxes;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3 style={{ color: "#DC143C", fontSize: "3rem",boxShadow: "10px"}}>Game Board</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 50px)", // Increase size
          gridTemplateRows: "repeat(10, 50px)", // Increase size
          gap: 0,
          maxWidth: "500px", // Increase max width
          maxHeight: "500px", // Increase max height
          margin: "0 auto",
          backgroundImage: `url(${gameBoardImage})`,
          backgroundSize: "100% 100%", // Adjust size
          backgroundPosition: "center",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {generateBoard()}
      </div>
    </div>
  );
};
const SnakeAndLadder = ({ playerPosition, setPlayerPosition, computerPosition, setComputerPosition }) => {

  const [currentTurn, setCurrentTurn] = useState("player");
  const [gameOver, setGameOver] = useState(false);

  const snakes = {32: 10, 36: 6, 48: 26, 62: 18, 88: 24, 95: 56,97: 78 };
  const ladders = { 1: 38, 4: 14, 8: 30, 21: 42, 28: 76, 50: 67, 71: 92, 80: 99 };

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const movePlayer = (position, diceRoll) => {
    let newPosition = position + diceRoll;
    if (newPosition > 100) newPosition = 100 - (newPosition - 100);
    return snakes[newPosition] || ladders[newPosition] || newPosition;
  };
  const handleGameEnd = (winner) => {
    setTimeout(() => {
      alert(winner === "player" ? "You Win!" : "You Lose!");
      resetGame();
    }, 500); // Short delay before resetting the game
  };
  
  const playerTurn = () => {
    if (gameOver) return;
    const diceRoll = rollDice();
    const newPosition = movePlayer(playerPosition, diceRoll);
    setPlayerPosition(newPosition);
  
    if (newPosition === 100) {
      setGameOver(true);
      updateGold(1); // Add 10 gold if player wins
      handleGameEnd("player");
    } else {
      setCurrentTurn("computer");
      setTimeout(computerTurn, 1000);
    }
  };
  
  const computerTurn = () => {
    if (gameOver) return;
    const diceRoll = rollDice();
    const newPosition = movePlayer(computerPosition, diceRoll);
    setComputerPosition(newPosition);
  
    if (newPosition === 100) {
      setGameOver(true);
      handleGameEnd("computer");
    } else {
      setCurrentTurn("player");
    }
  };

  const updateGold = (amount) => {
    fetch("/api/gold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Gold updated:", data))
      .catch((err) => console.error("Error updating gold:", err));
  };

  const resetGame = () => {
    setPlayerPosition(0);
    setComputerPosition(0);
    setCurrentTurn("player");
    setGameOver(false);
  };

  return (
    <div style={{ backgroundSize: "cover", padding: "20px", textAlign: "center",fontSize:"1.5rem",color:"#DC143C", fontWeight:"bold",fontSize: "2rem",boxShadow: "10px" }}>
      <h3>Snake & Ladder Game</h3>
      <p style={{color:"black"}}>Player Position: {playerPosition} 🔴</p>
      <p style={{color:"black"}}>Computer Position: {computerPosition} 🔵</p>
      <p style={{color:"black"}}>Current Turn: {currentTurn}</p>
      {gameOver ? (
        <div>
          <p>{playerPosition === 100 ? "Player Wins! 🎉" : "Computer Wins! 😢"}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <button
          onClick={playerTurn}
          disabled={currentTurn !== "player"}
          className={`roll-dice-btn ${currentTurn === "player" ? "bounce" : ""}`}
        >
          Roll Dice 🎲
        </button>
      )}
      
    </div>
  );
};

// Main App Component
const App = () => {
  const [playerPosition, setPlayerPosition] = useState(0);
  const [computerPosition, setComputerPosition] = useState(0);

  return (
    <div>
      <Navbar />
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: "20px", 
        padding: "20px", 
        minHeight: "100vh"
      }}>
        {/* Game Board */}
        <GameBoard playerPosition={playerPosition} computerPosition={computerPosition} />

        {/* Player Panel (Centered) */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <SnakeAndLadder
            playerPosition={playerPosition} setPlayerPosition={setPlayerPosition}
            computerPosition={computerPosition} setComputerPosition={setComputerPosition}
          />
        </div>
      </div>
    </div>
  );
};


export default App;
