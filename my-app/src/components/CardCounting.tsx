import { useEffect, useRef, useState } from "react";
import "../styles/CardCounting.css";
import { useNavigate } from "react-router-dom";
import { CustomToggleSwitch } from "./CustomToggleSwitch";
import { CustomDropdown } from "./CustomDropdown";
import { useTimer } from "../utils/useTimer";
import Timer from "./Timer";

interface Card {
  image: string;
  value: string;
  suit: string;
  code: string;
}

const NO_OF_ATTEMPTS = 3;

export const CardCountingGame = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const { isTimerOn, setIsTimerOn,
    countdownDuration, updateCountdownDuration,
    startTimer, stopTimer } = useTimer();

  const deckId = useRef<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [userGuess, setUserGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);


  const drawCards = async (count: number) => {
    if (!deckId.current) return;
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=${count}`,
    );
    const data = await response.json();
    setCards(data.cards);
  };

  const calculateCardCount = (cards: Card[]): number => {
    return cards.reduce((count, card) => {
      const value = card.value;
      if (["2", "3", "4", "5", "6"].includes(value)) return count + 1;
      if (["10", "JACK", "QUEEN", "KING", "ACE"].includes(value))
        return count - 1;
      return count;
    }, 0);
  };

  const checkGuess = (e: any) => {
    e.preventDefault();
    const actualCount = calculateCardCount(cards);
    console.log(actualCount);

    if (parseInt(userGuess) === actualCount) {
      setMessage("Correct! Well done.");
      const elapsedTime = stopTimer();
      console.log(`Elapsed time: ${elapsedTime}ms`);
      navigate("/authenticated", {state: {time: elapsedTime}});

    } else {
      setMessage("Oops! Try again.");
      if (attempts + 1 >= NO_OF_ATTEMPTS) {
        navigate("/unauthenticated", {state: {time: "DNF - ran out of attempts"}});
      }
    }
    setUserGuess("");
    setAttempts((prev) => prev+1);
  };

  const onDifficultySelect = (level: string): void => {
    setDifficulty(level);
    setResetFlag(!resetFlag);
    // Determine the number of cards to draw based on the selected difficulty
    let numberOfCards = 10;
    switch(level) {
      case 'EASY':
        numberOfCards = 6;
        break;
      case 'MEDIUM':
        numberOfCards = 9;
        break;
      case 'HARD':
        numberOfCards = 12;
        break;
      default:
        console.log("Unknown difficulty level:", level);
    }
    getDeckAndDrawCards(numberOfCards);
  };
  

  const getDeckAndDrawCards = async (numberOfCards: number) => {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/",
    );
    const data = await response.json();
    deckId.current = data.deck_id;
    drawCards(numberOfCards);
  };
  

  useEffect(() => {
    if (difficulty) startTimer();
  }, [difficulty, startTimer]);


  return (
    <div className="passwordScreen">
      <CustomDropdown
        onSelect={onDifficultySelect}
      />
      
      {difficulty ? (
        <div className="puzzleScreen">
          <div className="description">
            <h3>Count the value of the cards using the following rules:</h3>
            <h6>cards with values 2, 3, 4, 5, and 6 are worth 1.</h6>
            <h6>cards with values 7, 8, 9 are worth 0.</h6>
            <h6>cards with values 10, Jack, Queen, King, and Ace are worth -1.</h6>
            <h5>{NO_OF_ATTEMPTS - attempts} attempts left</h5>
          </div>
          <div className="cardArea">
            {cards.map((card, index) => (
              <img
                key={index}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                className="cardImage"
              />
            ))}
          </div>
          <div className="playerArea">
            <form onSubmit={checkGuess}>
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Enter your count guess"
              />
              <button>Submit Guess</button>
            </form>
          </div>
          {message && <p>{message}</p>}

          {isTimerOn && (
            <Timer
              resetFlag={resetFlag}
              duration={countdownDuration}
            />
          )}
        </div>
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
