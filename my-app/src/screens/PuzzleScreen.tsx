import { useState } from 'react';
import { ChessPuzzle, AnagramPuzzle, BlackjackPuzzle } from '../components';
import Dropdown from 'react-dropdown';


export const PuzzleScreen = () => {
  const puzzles = ["Chess", "Anagram", "Blackjack"];
  const [puzzle, setPuzzle] = useState<string>(puzzles[0]);

  return (
    <div>
      <Dropdown onChange={(p) => setPuzzle(p.value)} options={puzzles} value={puzzle} />
      {puzzle === "Chess" && (
        <ChessPuzzle />
      )}
      {puzzle === "Anagram" && (
        <AnagramPuzzle />
      )}
      {puzzle === "Blackjack" && (
        <BlackjackPuzzle />
      )}
    </div>
  );
}