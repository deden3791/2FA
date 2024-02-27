import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import easyPuzzles from "../data/chess-puzzles-easy.json";
import mediumPuzzles from "../data/chess-puzzles-medium.json";
import hardPuzzles from "../data/chess-puzzles-hard.json";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";

interface puzzle {
  PuzzleId: string;
  FEN: string;
  Moves: string[];
}

type levels = "EASY" | "MEDIUM" | "HARD";

// --------- SET LEVEL HERE

const level: levels = "HARD";

// --------- SET TIMER ON OR OFF HERE

const timer = false;

// ---------

export const ChessPuzzle = () => {
  const navigate = useNavigate();

  const [resetFlag, setResetFlag] = useState<boolean>(false);

  const [puzzle, setPuzzle] = useState<puzzle | null>(null);
  const [game, setGame] = useState(new Chess());
  const [attempts, setAttempts] = useState(0);
  const [colourToMove, setColourToMove] = useState<string>("");

  useEffect(() => {
    if (attempts >= 3) navigate("/unauthenticated");
    getRandomPuzzle(level);
  }, [attempts, navigate]);

  const getRandomPuzzle = (pickedLevel: levels) => {
    const puzzles =
      pickedLevel === "EASY"
        ? easyPuzzles
        : pickedLevel === "MEDIUM"
          ? mediumPuzzles
          : hardPuzzles;

    let chosenPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let puzzleMoves = chosenPuzzle.Moves.split(" ");
    const gameInstance = new Chess(chosenPuzzle.FEN);
    setGame(gameInstance);
    setPuzzle({ ...chosenPuzzle, Moves: puzzleMoves });
    setColourToMove("");
  };

  useEffect(() => {
    if (puzzle) {
      const firstMove = {
        from: puzzle.Moves[0].slice(0, 2),
        to: puzzle.Moves[0].slice(2, 4),
      };
      setTimeout(() => {
        const movedPiece = makeAMove(firstMove);
        movedPiece.color === "b" ? setColourToMove("w") : setColourToMove("b");
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

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
      setResetFlag((prev) => !prev);
      return false;
    }
  };

  return (
    <div className="passwordScreen">
      {colourToMove.length > 0 && colourToMove === "w" ? (
        <label>White to Move</label>
      ) : colourToMove === "b" ? (
        <label>Black to Move</label>
      ) : (
        <label> </label>
      )}
      <div>
        <Chessboard
          boardWidth={600}
          position={game.fen()}
          onPieceDrop={onDrop}
        />
      </div>

      {timer && (
        <Timer
          stopFunction={() => setAttempts((prev) => prev + 1)}
          resetFlag={resetFlag}
        />
      )}
    </div>
  );
};
