import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// import "./bear.css";

const Bear = ({ imgSrc, size = 125, speed = 30 }) => {
  const bearWidth = size;

  // Use starting X position as a seed for tilt
  const seed = Math.random() * 10000; // or any number
  const randomFromSeed = (x) => {
    return Math.sin(x) * 10000 - Math.floor(Math.sin(x) * 10000);
  };

  const stateRef = useRef({
    pos: randomFromSeed(seed) * (window.innerWidth - bearWidth),
    dir: Math.random() < 0.5 ? 1 : -1,
    tilt: randomFromSeed(seed + 1) * 10 - 5, // tilt between -5 and 5
    tiltVel: 0.2, // tilt speed
    bounce: 0,
    bounceVel: 0.5, // bounce speed
  });

  const [, setTick] = useState(0);
  const requestRef = useRef();

  const animate = () => {
    const s = stateRef.current;
    let nextPos = s.pos + s.dir * (speed / 20);
    const width = window.innerWidth;

    // Mirror reflection at edges
    if (nextPos > width - bearWidth) {
      nextPos = 2 * (width - bearWidth) - nextPos;
      s.dir = -1;
    }
    if (nextPos < 0) {
      nextPos = -nextPos;
      s.dir = 1;
    }
    s.pos = nextPos;

    // Tilt
    s.tilt += s.tiltVel;
    if (s.tilt > 5 || s.tilt < -5) s.tiltVel *= -1;

    // Bounce
    s.bounce += s.bounceVel;
    if (s.bounce > 5 || s.bounce < -5) s.bounceVel *= -1;

    setTick(t => t + 1); // force re-render
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const s = stateRef.current;

  return createPortal(
    <img
      src={imgSrc}
      alt="walking bear"
      className="bear"
      style={{
        left: s.pos,
        bottom: s.bounce,
        width: size,
        transform: `scaleX(${s.dir === 1 ? -1 : 1}) rotateZ(${s.tilt}deg)`,
      }}
    />,
    document.body
  );
};

export default Bear;