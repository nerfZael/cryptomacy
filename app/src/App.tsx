import React, { useEffect, useState } from 'react';
import './App.scss';
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as dotenv from 'dotenv';
import HexagonTestPage from './components/hexagon-test-page/HexagonTestPage';
import GameTestPage from './components/game-test-page/GameTestPage';
import GamePage from './components/game-page/GamePage';

dotenv.config();

export default () => {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path='/' render={() => <GamePage />} />
            <Route exact path='/game-test' render={() => <GameTestPage />} />
            <Route exact path='/hexagon-test' render={() => <HexagonTestPage />} />
            <Route path="*" component={() => (<div>Not Found </div>)} />
          </Switch>
      </Router>
    </div>
  );
}
