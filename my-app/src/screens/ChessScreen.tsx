import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import puzzles from "../data/chess-puzzles.json";

interface puzzle {
  PuzzleId: string;
  FEN: string;
  Moves: string[];
}

export const ChessSceen = () => {
  const [puzzle, setPuzzle] = useState<puzzle | null>(null);
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    let chosenPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let puzzleMoves = chosenPuzzle.Moves.split(" ");
    const gameInstance = new Chess(chosenPuzzle.FEN);
    gameInstance.move(puzzleMoves[0]);
    setGame(gameInstance);
    setPuzzle({ ...chosenPuzzle, Moves: puzzleMoves });
  }, []);

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
        console.log("This is the last move in the puzzle");
        return true;
      }
    } catch (err) {
      console.log(err);
    } finally {
      return false;
    }
  };

  return (
    <div className="passwordScreen">
      <Chessboard
        customBoardStyle={{ padding: 100 }}
        boardWidth={600}
        position={game.fen()}
        onPieceDrop={onDrop}
      />
    </div>
  );
};
