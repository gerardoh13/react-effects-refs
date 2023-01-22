import React, { useState } from "react";

function Card({ image, alt }) {
  const [angle] = useState(Math.random() * 90);
  return (
    <img
      className="Card"
      src={image}
      alt={alt}
      style={{ transform: `rotate(${angle}deg)` }}
    />
  );
}

export default Card;
