import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import puzzles from "../data/chess-puzzles.json";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";

interface puzzle {
  PuzzleId: string;
  FEN: string;
  Moves: string[];
}

export const ChessPuzzle = () => {
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState<puzzle | null>(null);
  const [game, setGame] = useState(new Chess());
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts > 3) navigate("/unauthenticated");
    getRandomPuzzle();
  }, [attempts, navigate]);

  const getRandomPuzzle = () => {
    let chosenPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let puzzleMoves = chosenPuzzle.Moves.split(" ");
    const gameInstance = new Chess(chosenPuzzle.FEN);
    gameInstance.move(puzzleMoves[0]);
    setGame(gameInstance);
    setPuzzle({ ...chosenPuzzle, Moves: puzzleMoves });
  };

  const makeAMove = (move: any): Move => {
    const gameCopy: Chess = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  };

  const onDrop = (sourceSquare: any, targetSquare: any): boolean => {
    try {
      const moveMade = sourceSquare + targetSquare;
      const move = makeAMove({ from: sourceSquare, to: targetSquare });
      if (!move) return false;

      if (moveMade === puzzle?.Moves[1]) {
        navigate("/authenticated");
        return true;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAttempts((prev) => prev + 1);
      return false;
    }
  };

  return (
    <div className="passwordScreen">
      {/* CSS on chessboard is not working, it is not centering */}
      <div>
        <Chessboard
          boardWidth={600}
          position={game.fen()}
          onPieceDrop={onDrop}
        />
      </div>
      <Timer stopFunction={() => setAttempts((prev) => prev + 1)} />
    </div>
  );
};