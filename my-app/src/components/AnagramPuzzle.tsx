import { useState, useEffect, useCallback } from "react";
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../utils/useTimer";
import Timer from "./Timer";

function generateAnagrams(
  prefix: string,
  str: string,
  anagrams: string[] = [],
): string[] {
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
}

function getAllUniqueAnagrams(word: string): string[] {
  const anagramsSet = new Set(generateAnagrams("", word));
  return Array.from(anagramsSet);
}

function generateWords(): { word: string; anagrams: string[] }[] {
  const wordList = generate({ minLength: 5, maxLength: 5, exactly: 5 });
  let w = [];
  for (let i = 0; i < wordList.length; i++) {
    let word = wordList[i];
    let anagrams: string[] = getAllUniqueAnagrams(word);
    w.push({ word: word, anagrams: anagrams });
  }
  return w;
}

function pickRandomAnagram(anagramList: string[]): string {
  return anagramList[Math.floor(Math.random() * anagramList.length)];
}

const words = generateWords();
const NO_OF_ANSWERS = 3;

export const AnagramPuzzle = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [anagram, setAnagram] = useState<string>(
    pickRandomAnagram(words[currentWordIndex].anagrams),
  );
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { startTimer, stopTimer } = useTimer();

  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer, navigate]);

  const stopFunction = useCallback(() => {
    navigate("/unauthenticated");
  }, [navigate]);

  useEffect(() => {
    console.log(words);
  }, []);

  const checkAnswer = (e: any): void => {
    e.preventDefault();
    if (userGuess.toLowerCase() === words[currentWordIndex].word) {
      setCorrectAnswers((total) => total + 1);
      setMessage("Correct! Well done.");
    } else {
      setIncorrectAnswers((total) => total + 1);
      setMessage("Oops! Try again.");
    }
    setUserGuess("");
    const nextIndex: number = (currentWordIndex + 1) % words.length;
    setCurrentWordIndex(nextIndex);
    setAnagram(pickRandomAnagram(words[nextIndex].anagrams));
  };

  if (correctAnswers >= NO_OF_ANSWERS) {
    navigate("/authenticated");
  } else if (incorrectAnswers >= NO_OF_ANSWERS) {
    navigate("/unauthenticated");
  }

  return (
    <div className="passwordScreen">
      <h2>Solve the following Anagram:</h2>
      <h3>{anagram}</h3>
      <h5>
        Get {NO_OF_ANSWERS} correct to pass. Get {NO_OF_ANSWERS} incorrect to be
        locked out.
      </h5>
      <h6>Correct: {correctAnswers}</h6>
      <h6>Incorrect: {incorrectAnswers}</h6>

      <form onSubmit={checkAnswer}>
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Answer here"
        />
        <button type="submit">Check</button>
      </form>

      <p>{message}</p>

      <Timer stopFunction={stopFunction} />
    </div>
  );
};
