import { BrowserRouter as Router, Route, Link, Routes, useLocation } from "react-router-dom";
import SnakeAndLadder from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/SnakeAndLadder/SnakeAndLadder.js"
import Sudoku from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/Sudoku/Sudoku.js"
import Wordguess from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/Wordguess/WordGuessGame.js"
import Squidgame from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/components/SquidGame/SquidGame.js"
import "./App.css"
import SLImage from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/SL.png"
import SUImage from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/SU.png"
import WUImage from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/WU.png"
import SQImage from "C:/Users/jaina/OneDrive/Desktop/Jainam/programs/Project/Games/sudoku-game/src/SQ.png"
function GameMenu() {
  const location = useLocation();
  
  // Hide menu if a game is selected
  const isGameSelected = ["/snake-and-ladder", "/sudoku", "/wordguess","/squidgame"].includes(location.pathname);

  if (isGameSelected) return null; // Do not render the game menu

  return (
    <nav className="main-content">
      <Link to="/snake-and-ladder" className="card animate-in">
        <div className="game-card">
          <img src={SLImage} alt="Snake and Ladder" className="game-image" />
          <h1 style={{color: "black", fontSize1:"2rem"}}>Snake and Ladder</h1>
        </div>
      </Link>

      <Link to="/sudoku" className="card animate-in">
        <div className="game-card">
          <img src={SUImage} alt="Sudoku" className="game-image" />
          <h1 style={{color: "black", fontSize1:"2rem"}}>Sudoku</h1>
        </div>
      </Link>

      <Link to="/wordguess" className="card animate-in">
        <div className="game-card">
          <img src={WUImage} alt="Wordguess" className="game-image" />
          <h1 style={{color: "black", fontSize1:"2rem"}}>Word Guess</h1>
        </div>
      </Link>

      <Link to="/squidgame" className="card animate-in">
        <div className="game-card">
          <img src={SQImage} alt="SquidGame" className="game-image" />
          <h1 style={{color: "black", fontSize1:"2rem"}}>Squid Game</h1>
        </div>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-wrapper">
          <header className="header animate-in">
            <h1 style={{color:"black"}}>Game Center</h1>
          </header>
          <GameMenu />
          <Routes>
            <Route path="/snake-and-ladder" element={<SnakeAndLadder />} />
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/wordguess" element={<Wordguess />} />
            <Route path="/squidgame" element={<Squidgame />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
