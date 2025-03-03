"use client"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import "./WordGuessGame.css";
const words = [
    "Amazon", "Archive", "Alaska", "Alchemy", "Almonds", "Anagram", "Android", "Antique", "Average", "Avenues",
    "Banquet", "Bargain", "Battery", "Boulder", "Buffalo", "Bridges", "Bandage", "Balance", "Billard", "Bonfire",
    "Capture", "Canvas", "Cabbage", "Cactus", "Caliber", "Candies", "Capital", "Caramel", "Caution", "Chamber",
    "Dancing", "Dangers", "Dazzled", "Daytime", "Decades", "Defense", "Delight", "Dolphin", "Dynamic", "Diamond",
    "Eclipse", "Elastic", "Emerald", "Erosion", "Example", "Excited", "Explore", "Express", "Element", "Endless",
    "Factory", "Fashion", "Festival", "Fighter", "Fortune", "Furnace", "Flavour", "Failure", "Feature", "Fiction",
    "Gateway", "Garment", "Genesis", "General", "Giraffe", "Glacier", "Gravity", "Grocery", "Garnish", "Grammar",
    "Harvest", "Harmony", "Heading", "Horizon", "Hostage", "Hustler", "Holiday", "Hollow", "Hunters", "Hurdles",
    "Illness", "Imagine", "Initial", "Iceberg", "Indulge", "Impacts", "Insight", "Involve", "Infused", "Install",
    "Jackpot", "January", "Jasmine", "Jealous", "Journey", "Juggler", "Justice", "Junction", "Javelin", "Jumping",
    "Kangaro", "Keeping", "Kindred", "Kingdom", "Kitchen", "Knights", "Knowing", "Keyhole", "Kernels", "Krypton",
    "Ladders", "Lantern", "Landing", "Lawyers", "Library", "Lighter", "Lizards", "Loyalty", "Luggage", "Lullaby",
    "Magical", "Masters", "Maximum", "Melting", "Message", "Migrant", "Minimal", "Mission", "Mobiles", "Mystery",
    "Natural", "Navigate", "Network", "Neutron", "Nostalg", "Nucleus", "Nomadic", "Nurture", "Numbers", "Novices",
    "Oatmeal", "Obscure", "Observe", "Octagon", "Offline", "Operate", "Opinion", "Organic", "Ostrich", "Outlook",
    "Package", "Paladin", "Panther", "Paradox", "Parking", "Passage", "Peacock", "Pioneer", "Plastic", "Popular",
    "Quartz", "Quality", "Quarter", "Quicker", "Quoting", "Quirky", "Quietly", "Quester", "Quested", "Quilted",
    "Rainbow", "Rangers", "Reality", "Recharge", "Reflect", "Regular", "Remove", "Reshape", "Respect", "Rushing",
    "Sailors", "Salvage", "Sandbox", "Scanner", "Scenery", "Scepter", "Seagull", "Serpent", "Shelter", "Shuffle",
    "Tandems", "Tension", "Texture", "Theater", "Thunder", "Tigers", "Tourism", "Trading", "Treason", "Tropics",
    "Umbrella", "Uncover", "Uniform", "Ultimate", "Undying", "Unicorn", "Upwards", "Useful", "Urgency", "Utility",
    "Vacation", "Vagrant", "Venture", "Verdant", "Version", "Vibrant", "Victory", "Village", "Vintage", "Volcano",
    "Waffles", "Wander", "Warrior", "Weather", "Welcome", "Western", "Whisper", "Wishing", "Wonder", "Workout",
    "Xanthan", "Xenogen", "Xenopus", "Xeroxed", "Xenakis", "Xylitol", "Xenopus", "Xylogen", "Xenonym", "Xylonic",
    "Yachts", "Yanking", "Yelling", "Yellow", "Yogurts", "Younger", "Younker", "Yuppies", "Yanking", "Yearned",
    "Zapping", "Zealots", "Zephyrs", "Ziggzag", "Zippers", "Zombies", "Zonally", "Zymotic", "Zestful", "Zillion"
  ];
const WordGuessGame = () => {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateNewWord();
  }, []);

  const generateNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord.toUpperCase());
    setGuesses(Array(6).fill(""));
    setCurrentRow(0);
    setGameOver(false);
    setMessage("");
  };

  const handleInput = (rowIndex, colIndex, event) => {
    if (rowIndex !== currentRow || gameOver) return;

    const value = event.target.value.toUpperCase();
    if (!/^[A-Z]$/.test(value)) return;

    const newGuesses = [...guesses];
    const newGuess = newGuesses[rowIndex].split("");
    newGuess[colIndex] = value;
    newGuesses[rowIndex] = newGuess.join("");
    setGuesses(newGuesses);

    if (colIndex < word.length - 1) {
      event.target.nextElementSibling?.focus();
    }

    if (newGuesses[rowIndex].length === word.length) {
      checkGuess(newGuesses[rowIndex]);
    }
  };

  const checkGuess = (guess) => {
    if (guess === word) {
      setGameOver(true);
      setMessage("Congratulations! You guessed the word!");
      increaseGold();
    } else if (currentRow === 5) {
      setGameOver(true);
      setMessage(`Game over! The word was ${word}`);
    } else {
      setCurrentRow(currentRow + 1);
    }
  };

  const increaseGold = () => {
    fetch("/api/increase-gold", { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log("Gold increased:", data.gold))
      .catch((error) => console.error("Error increasing gold:", error));
  };

  const getLetterClass = (rowIndex, colIndex, letter) => {
    if (!letter || rowIndex > currentRow) return "";
    if (word[colIndex] === letter) return "correct";
    if (word.includes(letter)) return "wrong-position";
    return "incorrect";
  };

  return (
    <div className="word-guess-game">
      <h1>Word Guess Game</h1>
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        Back
      </button>
      <div className="game-board">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="guess-row">
            {Array(word.length)
              .fill()
              .map((_, colIndex) => (
                <input
                  key={colIndex}
                  type="text"
                  maxLength="1"
                  value={guess[colIndex] || ""}
                  onChange={(e) => handleInput(rowIndex, colIndex, e)}
                  className={getLetterClass(rowIndex, colIndex, guess[colIndex])}
                />
              ))}
          </div>
        ))}
      </div>
      <p className="message">{message}</p>
      <button onClick={generateNewWord}>Regenerate</button>
    </div>
  );
};

export default WordGuessGame;