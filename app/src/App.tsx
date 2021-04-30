import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HexagonTestPage from './components/hexagon-test-page/HexagonTestPage';
import GamePage from './components/game-page/GamePage';

export default () => {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path='/' render={() => <GamePage />} />
            <Route exact path='/hexagon-test' render={() => <HexagonTestPage />} />
            <Route path="*" component={() => (<div>Not Found </div>)} />
          </Switch>
      </Router>
    </div>
  );
}
