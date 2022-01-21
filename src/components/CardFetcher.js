import React, { useState, useEffect, useReducer, useCallback } from "react";
import { SuitDisplay } from ".";

const sortArr = [
  "ACE",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
];

const cardReducer = (prevState, card) => {
  const newState = { ...prevState };
  const cards = prevState[card.suit] ? [...prevState[card.suit], card] : [card];
  newState[card.suit] = cards.sort(
    (a, b) => sortArr.indexOf(a.value) - sortArr.indexOf(b.value)
  );
  return newState;
};

export const CardFetcher = () => {
  const [deck, setDeck] = useState();
  const [queens, setQueens] = useState(0);
  const [cards, setCards] = useReducer(cardReducer, {});

  const getDeck = async () => {
    try {
      const res = await fetch(
        `http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
      );
      const data = await res.json();
      setDeck(data.deck_id);
    } catch (err) {
      console.error("ERR in request: ", err);
    }
  };

  const drawCards = useCallback(async () => {
    try {
      const res = await fetch(
        `http://deckofcardsapi.com/api/deck/${deck}/draw/?count=2`
      );
      const data = await res.json();

      data?.cards.forEach((card) => {
        card.value === "QUEEN" && setQueens((prev) => prev + 1);
        setCards(card);
      });
    } catch (err) {
      console.error("ERR in request: ", err);
    }
  }, [deck]);

  useEffect(() => {
    getDeck();
  }, []);

  useEffect(() => {
    if (queens === 4) return;

    const interval = setInterval(() => {
      drawCards();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [queens, drawCards]);

  return (
    <div className="container">
      {Object.keys(cards).map((set, i) => (
        <SuitDisplay key={i + set} cards={cards[set]} suit={set} />
      ))}
    </div>
  );
};
