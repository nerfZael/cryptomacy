import React, { useEffect, useState } from 'react';
import './HexagonTestPage.scss';

export default () => {

  return (
    <div className="HexagonTestPage">
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
