import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";

interface ChessPasswordProps {
  problemNo?: number;
}

export const ChessPassword = ( {problemNo }: ChessPasswordProps) => {
  const [game, setGame] = useState(new Chess());
  const [startingPosition, setStartingPosition] = useState<string>(game.fen());
  const [guess, setGuess] = useState<string>("Please check answer");
  console.log(startingPosition, game.fen())

  // useEffect(() => {
  //   switch(problemNo) {
  //     case 0:
  //       setStartingPosition(game.fen());
  //       break;
  //     case 1:
  //       setStartingPosition('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
  //       break;
  //   }
  // }, [problemNo]);

  const checkAnswer = (): void => {
    game.isCheckmate() ? setGuess("Correct") : setGuess("Incorrect");
  }

  const makeAMove = (move: any): Move => {
    const gameCopy: Chess = new Chess(game.fen());
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }


  const onDrop = (sourceSquare: any, targetSquare: any): boolean => {
    try {
      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
      console.log(move)
      return move === null ? false : true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

  return (
    <div className="passwordScreen">
      <label>Your answer is: <i>{guess}</i></label>
      <Chessboard
        customBoardStyle={{padding: 100}}
        boardWidth={600}
        position={game.fen()}
        onPieceDrop={onDrop} 
      />

    <button onClick={checkAnswer}>Check Answer</button>
    </div>
  );
}