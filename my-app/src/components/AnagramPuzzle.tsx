import { useState, useEffect } from 'react';
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";


function generateAnagrams(prefix: string, str: string, anagrams: string[] = []): string[] {
  if (str.length === 1) {
    anagrams.push(prefix + str);
  } else {
    for (let i = 0; i < str.length; i++) {
      let current = str[i];
      let before = str.slice(0, i);
      let after = str.slice(i + 1);
      generateAnagrams(prefix + current, before + after, anagrams);
    }
  }
  return anagrams;
};

function getAllUniqueAnagrams(word: string): string[] {
  const anagramsSet = new Set(generateAnagrams('', word));
  return Array.from(anagramsSet);
};

function generateWords(): {word: string, anagrams: string[]}[] {
  const wordList = generate({minLength: 5, maxLength: 5, exactly: 5 });
  let w = [];
  for (let i = 0; i < wordList.length; i++) {
    let word = wordList[i];
    let anagrams: string[] = getAllUniqueAnagrams(word);
    w.push({word: word, anagrams: anagrams});
  };
  return w;
};

function pickRandomAnagram(anagramList: string[]): string {
  return anagramList[Math.floor(Math.random() * anagramList.length)];
};

const words = generateWords();
const NO_OF_ANSWERS = 3;


export const AnagramPuzzle = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<number>(0);
  const [anagram, setAnagram] = useState<string>(pickRandomAnagram(words[current].anagrams));
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    console.log(words)
  }, []);


  const checkAnswer = (e: any): void => {
    if (userGuess.toLowerCase() === words[current].word) {
      setCorrectAnswers(correctAnswers + 1);
      setMessage('Correct! Well done.');
    } else {
      setMessage('Oops! Try again.');
    }
    setUserGuess('');
    setCurrent((current + 1) % words.length);
    setAnagram(pickRandomAnagram(words[current].anagrams));
  };

  if (correctAnswers >= NO_OF_ANSWERS) {
    navigate('/authenticated');
  }

  return (
    <div className="passwordScreen">
      <h2>Solve the following Anagram:</h2>
      <h3>{anagram}</h3>
      <h6>Correct Answers: {correctAnswers}</h6>
      <h6>How many more to pass: {NO_OF_ANSWERS - correctAnswers}</h6>

      <input
        type="text"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        placeholder="Answer here"
      />
      <button onClick={checkAnswer} type="submit">Check</button>
      <p>{message}</p>

      <Timer stopFunction={() => navigate('/unauthenticated')} />
    </div>
  );
}