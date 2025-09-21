import { useLocation } from "react-router-dom";
import Bear from "./bear";
import bear1 from './cute_bear.png';
import bear2 from './nurse_bear.png';
import bear3 from './surgeon_bear.png';

const bearWidth = 125;
const windowWidth = window.innerWidth;

const getRandomX = (occupied = []) => {
  let x;
  const minDistance = 150; // minimum distance between bears
  do {
    x = Math.random() * (windowWidth - bearWidth);
  } while (occupied.some(pos => Math.abs(pos - x) < minDistance));
  occupied.push(x);
  return x;
};

export default function BearManager() {
  const location = useLocation();
  const bearRoutes = ["/", "/basics", "/symptoms","/moresymptoms", "/thanks"]; // only show bears on these routes

  if (!bearRoutes.includes(location.pathname)) return null;

  const occupiedPositions = [];
  const startPositions = [
    getRandomX(occupiedPositions),
    getRandomX(occupiedPositions),
    getRandomX(occupiedPositions),
  ];

  return (
    <>
      <Bear imgSrc={bear1} size={125} speed={45} startX={startPositions[0]} />
      <Bear imgSrc={bear2} size={125} speed={45} startX={startPositions[1]} />  
      <Bear imgSrc={bear3} size={125} speed={45} startX={startPositions[2]} />
    </>
  );
}