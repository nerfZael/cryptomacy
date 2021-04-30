import React, { useEffect, useState } from 'react';
import './HexagonTestPage.scss';

export default () => {

  const wheel = e => {
    console.log(e);
  };

  return (
    <div className="HexagonTestPage" onWheel = {(e) => wheel(e)}>
      <div className="hex-container">
        <div className="hex-row">
          <div className="hexagon">A</div>
          <div className="hexagon">B</div>
          <div className="hexagon">C</div>
        </div>
        <div className="hex-row">
          <div className="hexagon">A</div>
          <div className="hexagon">B</div>
          <div className="hexagon">C</div>
          <div className="hexagon">D</div>
        </div>
        <div className="hex-row">
          <div className="hexagon">A</div>
          <div className="hexagon">B</div>
          <div className="hexagon">C</div>
          <div className="hexagon">D</div>
          <div className="hexagon">E</div>
        </div>
        <div className="hex-row">
          <div className="hexagon">A</div>
          <div className="hexagon">B</div>
          <div className="hexagon">C</div>
          <div className="hexagon">D</div>
        </div>
        <div className="hex-row">
          <div className="hexagon">A</div>
          <div className="hexagon">B</div>
          <div className="hexagon">C</div>
        </div>
      </div>
    </div>
  );
}
