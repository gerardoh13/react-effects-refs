import React, { useEffect, useState, useRef, useCallback } from "react";
import Card from "./Card";
import axios from "axios";

const BASE_API = "http://deckofcardsapi.com/api/deck";

function Deck() {
  const [deckId, setDeckId] = useState("");
  const [cards, setCards] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const [remaining, setRemaining] = useState(true);
  const timerRef = useRef(null);

  const getCard = useCallback(async () => {
    if (!remaining){
        alert("Error: no cards remaining!");
        return
    }
    const cardRes = await axios.get(`${BASE_API}/${deckId}/draw/`);
    const card = cardRes.data.cards[0];
    setCards((prev) => [
        ...prev,
        {
          image: card.image,
          id: card.code,
          alt: `${card.value} OF ${card.suit}`,
        },
      ]);
    if (cardRes.data.remaining === 0) {
      setAutoDraw(false);
      setRemaining(false);
      alert("Error: no cards remaining!");
    }
  }, [deckId, remaining]);

  useEffect(() => {
    const getDeckId = async () => {
      const idRes = await axios.get(`${BASE_API}/new/shuffle`);
      setDeckId(idRes.data.deck_id);
    };
    getDeckId();
  }, [setDeckId]);

  useEffect(() => {
    if (autoDraw && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
      return () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
      };
    }
  }, [getCard, autoDraw]);

  const toggleAutoDraw = () => {
    setAutoDraw((prev) => !prev);
  };

  const shuffleDeck = async () => {
    await axios.get(`${BASE_API}/${deckId}/shuffle/`);
    setRemaining(true);
    setCards([]);
  };
  const cardComponents = cards.map((c) => (
    <Card key={c.id} image={c.image} alt={c.alt} />
  ));
  return (
    <div>
      {cardComponents}
      {deckId ? (
        <>
          <button
            className="btn btn-warning mt-5"
            onClick={getCard}
            disabled={autoDraw || !remaining}
          >
            Draw
          </button>
          <button
            className="btn btn-warning mt-5 mx-2"
            onClick={toggleAutoDraw}
            disabled={!remaining}
          >
            {autoDraw ? "Stop" : "Start"} drawing
          </button>
          <button
            className="btn btn-warning mt-5"
            onClick={shuffleDeck}
            disabled={autoDraw}
          >
            Shuffle Deck
          </button>
        </>
      ) : null}
    </div>
  );
}

export default Deck;
