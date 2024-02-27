import React, { useEffect, useRef, useState } from "react";
import "../styles/CardCounting.css";
import { useNavigate } from "react-router-dom";

interface Card {
  image: string;
  value: string;
  suit: string;
  code: string;
}

export const CardCountingGame = () => {
  const navigate = useNavigate();
  const deckId = useRef<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [userGuess, setUserGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    getDeckAndDrawCards();
  }, []);

  const getDeckAndDrawCards = async () => {
    // Shuffle a new deck
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
    const data = await response.json();
    deckId.current = data.deck_id;
    // Draw number of cards
    drawCards(10);
  };

  const drawCards = async (count: number) => {
    if (!deckId.current) return;
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=${count}`);
    const data = await response.json();
    setCards(data.cards);
  };

  const calculateCardCount = (cards: Card[]): number => {
    return cards.reduce((count, card) => {
      const value = card.value;
      if (['2', '3', '4', '5', '6'].includes(value)) return count + 1;
      if (['10', 'JACK', 'QUEEN', 'KING', 'ACE'].includes(value)) return count - 1;
      return count;
    }, 0);
  };

  const checkGuess = (e: any) => {
    e.preventDefault();
    const actualCount = calculateCardCount(cards);
    console.log(actualCount);
    if (parseInt(userGuess) === actualCount) {
      setMessage('Correct! Well done.');
      navigate('/authenticated');
    } else {
      setMessage('Oops! Try again.');
    }
    setUserGuess('');
  };

  return (
    <div className="puzzleScreen">
      <div className="cardArea">
        {cards.map((card, index) => (
          <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} className="cardImage" />
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
    </div>
  );
};