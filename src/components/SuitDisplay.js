import React from "react";

export const SuitDisplay = ({ cards, suit }) => (
  <div className="flexRow">
    <p className="suit">{suit}</p>
    {cards?.map((card, i) => (
      <div key={i + card.code} className="card">
        <img
          src={card.image}
          width="50px"
          alt={`playing card ${card.suit} ${card.value}`}
        />
        <p>{card.value}</p>
      </div>
    ))}
  </div>
);
