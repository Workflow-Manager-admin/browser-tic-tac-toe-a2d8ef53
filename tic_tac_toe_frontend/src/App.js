import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main App component for Tic Tac Toe.
 * Implements a modern, minimal two-player Tic Tac Toe game with status, turn indicator, 
 * win/lose/draw detection, and a reset button. UI styled with provided palette.
 */
function App() {
  // Initial empty 3x3 grid (9 cells)
  const initialBoard = Array(9).fill(null);

  // State for the board and turn (true: X, false: O)
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null); // 'X', 'O', or 'draw'
  const [status, setStatus] = useState("");
  
  // Calculate winner or draw
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result === "draw" ? null : result);
      setStatus(
        result === "draw"
          ? "It's a draw! 🤝"
          : `Player ${result} wins! 🎉`
      );
    } else {
      setStatus(
        `Next turn: Player ${isXNext ? "X" : "O"}`
      );
    }
  }, [board, isXNext]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner || status.startsWith("It's a draw")) return; // Ignore if already filled or game over

    const newBoard = board.slice();
    newBoard[idx] = isXNext ? "X" : "O";
    setBoard(newBoard);

    if (!calculateWinner(newBoard)) {
      setIsXNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(initialBoard);
    setIsXNext(true);
    setWinner(null);
    setStatus("Next turn: Player X");
  }

  // PUBLIC_INTERFACE
  // Render a single square
  function Square({ value, onClick, isWinning }) {
    return (
      <button
        className={`ttt-square${isWinning ? " ttt-square-winner" : ""}`}
        onClick={onClick}
        disabled={!!winner || status.startsWith("It's a draw") || value}
        aria-label={value ? `Filled: ${value}` : "Empty square"}
      >
        {value}
      </button>
    );
  }

  // Highlight the winning combination if there is a winner
  const winLine = calculateWinLine(board);

  return (
    <div className="ttt-app-bg">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div
          className={`ttt-status${winner ? " ttt-status-winner" : ""}`}
          role="status"
        >
          {status}
        </div>
        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
          {board.map((v, idx) => (
            <Square
              key={idx}
              value={v}
              onClick={() => handleClick(idx)}
              isWinning={winLine && winLine.includes(idx)}
            />
          ))}
        </div>
        <button className="ttt-reset-btn" onClick={handleReset}>
          Reset Game
        </button>
        <div className="ttt-footer">
          <span>
            <span className="ttt-x">X</span> = Player 1 &nbsp;
            <span className="ttt-o">O</span> = Player 2
          </span>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Returns 'X' or 'O' if there's a winner, 'draw' if all filled, or null otherwise.
 * @param {Array} board array of 9 ('X', 'O', null)
 */
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return board.every((x) => x) ? "draw" : null;
}

// PUBLIC_INTERFACE
/**
 * Returns indices of winning line, or null if none.
 */
function calculateWinLine(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;
