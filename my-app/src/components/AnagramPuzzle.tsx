import { useState, useEffect } from "react";
import { generate } from "random-words";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";
import { CustomToggleSwitch } from "./CustomToggleSwitch";
import { CustomDropdown } from "./CustomDropdown";
import { useTimer } from "../utils/useTimer";

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

function generateWords(length: number): { word: string; anagrams: string[] }[] {
  const wordList = generate({ minLength: length, maxLength: length, exactly: 5 });
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

const NO_OF_ANSWERS = 3;


type WordWithAnagrams = {
  word: string;
  anagrams: string[];
};


export const AnagramPuzzle = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const [words, setWords] = useState<WordWithAnagrams[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [anagram, setAnagram] = useState<string>('');
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const { isTimerOn, setIsTimerOn,
    countdownDuration, updateCountdownDuration,
    startTimer, stopTimer } = useTimer();

  // start the timer when the user selects a difficulty
  useEffect(() => {
    console.log(words);
    if (difficulty) startTimer();
  }, [difficulty, startTimer, words]);

  const checkAnswer = (e: any): void => {
    e.preventDefault();
    if (userGuess.toLowerCase() === words[currentWordIndex].word) {
      setCorrectAnswers((total) => total + 1);
      setMessage("Correct! Well done.");
      if (correctAnswers + 1 >= NO_OF_ANSWERS) {
        const elapsedTime = stopTimer();
        console.log(`Elapsed time: ${elapsedTime}ms`);
        navigate("/authenticated", {state: {time: elapsedTime}});
      }

    } else {
      setIncorrectAnswers((total) => total + 1);
      setMessage("Oops! Try again.");
      if (incorrectAnswers+1 >= NO_OF_ANSWERS) {
        navigate("/unauthenticated", {state: {time: "DNF - ran out of attempts"}});
      }
    }
    setUserGuess("");
    const nextIndex: number = (currentWordIndex + 1) % words.length;
    setCurrentWordIndex(nextIndex);
    setAnagram(pickRandomAnagram(words[nextIndex].anagrams));
  };

  const onDifficultySelect = (level: any): void => {
    console.log(level)
    setDifficulty(level);
    
    // Determine the length of the words based on the selected difficulty
    let length = 5; // default length
    if (level === "EASY") {
      length = 4;
    } else if (level === "MEDIUM") {
      length = 6;
    } else if (level === "HARD") {
      length = 8;
    }
  
    console.log(length)
    // Regenerate the words list with the new length
    const newWords = generateWords(length);
    console.log(newWords)
    
    // Update the state with the new words
    setWords(newWords);
    setCurrentWordIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setMessage("");
    setAnagram(pickRandomAnagram(newWords[0].anagrams));
    
    // Reset the timer for the new challenge
    setResetFlag(prevFlag => !prevFlag); // This toggles the reset flag to restart any effects or components that depend on it
  };
  


  return (
    <div className="passwordScreen">
      <CustomDropdown
        onSelect={onDifficultySelect}
      />

      {difficulty ? (
        <>
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
