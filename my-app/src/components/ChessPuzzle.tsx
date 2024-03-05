import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import easyPuzzles from "../data/chess-puzzles-easy.json";
import mediumPuzzles from "../data/chess-puzzles-medium.json";
import hardPuzzles from "../data/chess-puzzles-hard.json";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";
import Dropdown from 'react-dropdown';
import { CustomToggleSwitch } from "./CustomToggleSwitch";
import { useTimer } from "../utils/useTimer";

interface puzzle {
  PuzzleId: string;
  FEN: string;
  Moves: string[];
};

type levels = "EASY" | "MEDIUM" | "HARD";

const NO_OF_ATTEMPTS = 3;


export const ChessPuzzle = () => {
  const navigate = useNavigate();
  const { isTimerOn, setIsTimerOn,
    countdownDuration, updateCountdownDuration } = useTimer();

  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const [puzzle, setPuzzle] = useState<puzzle | null>(null);
  const [game, setGame] = useState(new Chess());
  const [attempts, setAttempts] = useState(0);
  const [colourToMove, setColourToMove] = useState<string>("");
  const [difficulty, setDifficulty] = useState<levels | null>(null);

  useEffect(() => {
    if (attempts >= 3) navigate("/unauthenticated");
  }, [attempts, navigate]);

  const getRandomPuzzle = () => {
    const puzzles =
    difficulty === "EASY"
        ? easyPuzzles
        : difficulty === "MEDIUM"
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
    console.log("Correct Answer is: ", puzzle?.Moves[1])
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
      getRandomPuzzle();
      return false;
    }
  };

  const onDifficultySelect = (level: any): void => {
    setDifficulty(level);
    setResetFlag(!resetFlag);
    getRandomPuzzle();
  };

  return (
    <div className="passwordScreen">
      <Dropdown
        options={["EASY", "MEDIUM", "HARD"]}
        onChange={(value) => onDifficultySelect(value)}
        placeholder={"Select a difficulty"}
        className={"dropdown"}
        arrowClosed={<span className="arrow-closed" />}
        arrowOpen={<span className="arrow-open" />}
      />
      {difficulty ? (
        <>
        <h2>Get checkmate in 1 move</h2>
        <h5>{NO_OF_ATTEMPTS - attempts} attempts left</h5>
        {colourToMove.length > 0 && colourToMove === "w" ? (
            <h5>White to Move</h5>
          ) : colourToMove === "b" ? (
            <h5>Black to Move</h5>
          ) : (
            <h5> </h5>
          )}
          <div>
            <Chessboard
              boardWidth={450}
              position={game.fen()}
              onPieceDrop={onDrop}
            />
          </div>

          {isTimerOn && (
            <Timer
              resetFlag={resetFlag}
              duration={countdownDuration}
            />
          )}
        </>
      ) : (
        <CustomToggleSwitch
          isTimerOn={isTimerOn}
          onToggle={setIsTimerOn}
          containerStyle={"toggleContainer"}
          onInput={updateCountdownDuration}
        />
      )}
    </div>
  );
};
