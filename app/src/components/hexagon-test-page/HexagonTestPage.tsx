import React, { useEffect, useState } from 'react';
import './HexagonTestPage.scss';
import { generateRange } from '../../utilities/array-functions';

export default () => {
  const [viewSize, setViewSize] = useState(6);
  const [viewPositionX, setViewPositionX] = useState(0);
  const [viewPositionY, setViewPositionY] = useState(0);

  const wheel = event => {
    event.preventDefault();
    event.stopPropagation();
    
    if(event.altKey == true) {
      setViewPositionX(x => x - Math.floor(event.deltaY / 100));
    } else {
      setViewPositionY(y => y + Math.floor(event.deltaY / 100));
    }
  };

  useEffect(() => {
    
  }, [viewSize]);

  const unsignedCenterY = viewSize / 2;
  const unsignedCenterX = unsignedCenterY - 1;
  const agentX = 2;
  const agentY = 1;

  return (
    <div className="HexagonTestPage" onWheel = {(e) => wheel(e)}>
      <div className="world-size-def">
        <input type="number" onChange={ e => setViewSize(Number(e.target.value))} value={viewSize}/>
      </div>
      <div className="position">
        <input type="number" onChange={ e => setViewPositionX(Number(e.target.value))} value={viewPositionX}/>
        <input type="number" onChange={ e => setViewPositionY(Number(e.target.value))} value={viewPositionY}/>
      </div>

      <div className="view-coords">
        {viewPositionX}, {viewPositionY}  
      </div>

      <div className="hex-container">
        {
          generateRange(viewSize + 1).map(y => {
            return (
              <div className="hex-row">
                {
                  generateRange(y % 2 === 0 ? viewSize : viewSize + 1)
                    .map(x => {
                      let realX =  y % 2 == 0 
                        ? x - unsignedCenterX + viewPositionX
                        : x - 1 - unsignedCenterX + viewPositionX;

                      let realY = y - unsignedCenterY + viewPositionY

                      if(realX === agentX && realY === agentY) {
                        return (
                          <div key={`${realX},${realY}`} className="hexagon agent">
                          </div>
                        );
                      }
                      return (
                        <div key={`${realX},${realY}`} className="hexagon">
                          {realX},{realY}
                        </div>
                      );
                    })
                }
              </div>
            );
          })
        }
      </div>

    </div>
  );
}
