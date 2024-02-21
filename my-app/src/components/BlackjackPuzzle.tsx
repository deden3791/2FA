import React, { useEffect, useRef, useState } from "react";
import "../styles/BlackjackPuzzle.css";
import { useNavigate } from "react-router-dom";

interface Card {
  image: string;
  value: string;
  suit: string;
  code: string;
}

export const BlackjackPuzzle = () => {
  const navigate = useNavigate();
  const deckId = useRef<string | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [winner, setWinner] = useState<string>('');
  const playerTotal = useRef(0);
  const dealerTotal = useRef(0);

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    dealerTotal.current = calcTotal(dealerCards);
  }, [dealerCards]);

  useEffect(() => {
    playerTotal.current = calcTotal(playerCards);
  }, [playerCards]);


  const getCards = async () => {
    console.log("Getting cards")
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
    const data = await response.json();
    deckId.current = data.deck_id;
  };


  const calcTotal = (cards: Card[]): number => {
    let total = 0;
    let aceCount = 0;
    cards.forEach(card => {
      if (card.value === 'ACE') {
        aceCount += 1;
        total += 11; // Initially consider Ace as 11
      } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
        total += 10;
      } else {
        total += parseInt(card.value, 10);
      }
    });
    // Adjust Ace values from 11 to 1 as necessary to avoid busting
    while (total > 21 && aceCount > 0) {
      total -= 10; // Change one Ace from 11 to 1
      aceCount -= 1;
    }
    return total;
  };
  

  const drawCards = async (count: number, isDealer: boolean): Promise<void> => {
    if (!deckId.current) return;
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=${count}`);
    const data = await response.json();
    isDealer ? setDealerCards(prevCards => [...prevCards, ...data.cards]) : setPlayerCards(prevCards => [...prevCards, ...data.cards]);
  };

  const startGame = (forceDeal = false): void => {
    setDealerCards([]);
    setPlayerCards([]);
    setWinner('');
    if (dealerCards.length === 0 || forceDeal) drawCards(2, true);
    drawCards(2, false);
    setGameStarted(true);
  };

  const handleStick = async (): Promise<void> => {
    while (dealerTotal.current < 17) {
      await drawCards(1, true);
    }
    checkWinner();
  };
  
  const checkWinner = (): void => {
    if (playerTotal.current > 21) {
      setWinner('PLAYER_BUST');
    } else if (dealerTotal.current > 21 && playerTotal.current <= 21) {
      setWinner('PLAYER_WON');
    } else if (playerTotal.current > dealerTotal.current) {
      setWinner('PLAYER_WON');
    } else if (dealerTotal.current === playerTotal.current) {
      dealerCards.length >= playerCards.length ? setWinner('PLAYER_LOST') : setWinner('PLAYER_WON');
    } else {
      setWinner('PLAYER_LOST');
    }
    setGameStarted(false);
  };

  const authenticate = () => {
    navigate("/authenticated");
  };

  return (
    <div className="puzzleScreen">

      <div className="dealerArea">
        {dealerCards.map((card, index) => (
          <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} className="cardImage dealerCard" />
        ))}
      </div>
      
      {gameStarted ? (
        <div className="actionArea">
          <button onClick={() => handleStick()} className="drawButton">Stick</button>
          <button onClick={() => drawCards(1, false)} className="drawButton">Twist</button>
        </div>
      ) : (
        <div className="actionArea endGame">
          {winner !== '' && (
            <label>{winner}</label>
          )}
          {winner==='' ? (
            <button onClick={() => startGame()} className="drawButton">Start Game</button>
          ) : winner!=='PLAYER_WON' ? (
            <button onClick={() => startGame(true)} className="drawButton">Restart Game</button>
          ) : (
            <button onClick={authenticate} className="drawButton">Continue to app</button>
          )}
          
        </div>
      )}

      <div className="playerArea">
        {playerCards.map((card, index) => (
          <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} className="cardImage playerCard" />
        ))}
      </div>

    </div>
  );
};
