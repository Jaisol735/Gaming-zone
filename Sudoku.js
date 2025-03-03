"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/Sudoku/game.css"; // Ensure this is the correct path
import { style } from "framer-motion/client";

// Function to generate a Sudoku board
function generateSudoku(difficulty) {
  const board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  }

  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solveSudoku(board);

  let cellsToRemove;
  switch (difficulty) {
    case "easy":
      cellsToRemove = 30;
      break;
    case "medium":
      cellsToRemove = 40;
      break;
    case "hard":
      cellsToRemove = 50;
      break;
    default:
      cellsToRemove = 30;
  }

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      cellsToRemove--;
    }
  }

  return board;
}

function Game({ onWin }) {
  const navigate = useNavigate();
       const [difficulty, setDifficulty] = useState("easy");
       const [board, setBoard] = useState(generateSudoku("easy"));
       const [initialBoard, setInitialBoard] = useState([]);
     
       useEffect(() => {
         const newBoard = generateSudoku(difficulty);
         setBoard(newBoard);
         setInitialBoard(newBoard.map((row) => [...row]));
       }, [difficulty]);
     
       const handleDifficultyChange = (newDifficulty) => {
         setDifficulty(newDifficulty);
       };
     
       const handleCellChange = (row, col, value) => {
         const newBoard = [...board];
         newBoard[row] = [...newBoard[row]];
         newBoard[row][col] = value === "" ? 0 : Number.parseInt(value, 10);
         setBoard(newBoard);
       };
     
       const isBoardComplete = (board) => {
         return board.every((row) => row.every((cell) => cell !== 0));
       };
     
       const isBoardCorrect = (board) => {
         for (let i = 0; i < 9; i++) {
           if (new Set(board[i]).size !== 9) return false;
           if (new Set(board.map((row) => row[i])).size !== 9) return false;
         }
         return true;
       };
     
       const checkSolution = async () => {
         if (isBoardComplete(board) && isBoardCorrect(board)) {
           alert("Congratulations! You won!");
           updateScore();
         } else {
           alert("Wrong answer! Try again.");
         }
       };
       const updateScore = async () => {
        try {
          await axios.post("http://localhost:3001/update-score", { difficulty });
          console.log("Score updated successfully!");
        } catch (error) {
          console.error("Error updating score:", error);
        }
      };

  return (
    <div className="game-container">
      <button className="back-button" onClick={() => navigate("/")} style={{width:"80px",height: "40px",background:" #1a1a1a",
      color: "#fff",fontSize: "16px",borderRadius: "40px", display: "flex", justifyContent: "center", textAlign: "center"}}>
        Back
      </button>
      <h2>Sudoku Game</h2>
      <div className="difficulty-buttons">
        <button onClick={() => handleDifficultyChange("easy")}>Easy</button>
        <button onClick={() => handleDifficultyChange("medium")}>Medium</button>
        <button onClick={() => handleDifficultyChange("hard")}>Hard</button>
      </div>
      {board && board.length === 9 && board.every(row => row.length === 9) ? (
        <div className="sudoku-board">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="sudoku-cell">
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={cell || ""}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  readOnly={initialBoard?.[rowIndex]?.[colIndex] !== 0}
                />
              </div>
            ))
          )}
        </div>
        
      ) : (
        <p>Loading board...</p>
      )}
      <button className="check-button" onClick={checkSolution} style={{ marginTop: "20px", padding: "10px 20px", background:" #1a1a1a",
      color: "#fff", borderRadius: "5px", fontSize: "16px", cursor: "pointer" }}>
            Check
      </button>
    </div>
  );
}

export default Game;
