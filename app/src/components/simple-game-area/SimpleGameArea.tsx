import './SimpleGameArea.css'
import { ResizeableDiv } from '../resizeable-div/ResizeableDiv';
import React from 'react'
import { generateRange } from '../../utilities/array-functions';

export default ({ gridSize, objects, onObjectClicked, onPositionClicked }) => {
  const gameAreaStyle = {
    gridTemplate: `repeat(${gridSize}, 1fr) / repeat(${gridSize}, 1fr)`,
  };

  let floors = generateRange((gridSize * gridSize))
  .filter(a => {
    let x = a % 10;
    let y = Math.floor(a / 10);

    return !objects.some(o => o.x === x && o.y === y);
  })
  .map(a => {
      let x = a % 10;
      let y = Math.floor(a / 10);

      const style = {
        gridRow: `${y + 1} / span 1`,
        gridColumn: `${x + 1} / span 1`
      };

      return (
        <div key={a} className="floor" onClick={event => onPositionClicked(event, x, y)} style={style}>
        
        </div>
    );
  });

  return (
    <ResizeableDiv className="game-area" style={gameAreaStyle}>
      {
        objects.map((x, i) => {
          return (
            <div key={i} className={x.containerClassName} style={x.style} onClick={event => onObjectClicked(event, x)}>
              <div className={x.className}>
              </div>
            </div>
          );
        })
      }
      
      {
        floors
      }   
    </ResizeableDiv>
  )
}