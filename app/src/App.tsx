import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as dotenv from 'dotenv';
import SimpleGameArea from './components/simple-game-area/SimpleGameArea';
import { GameController } from './GameController';

dotenv.config();

const game = new GameController();

export default () => {
  const [objects, setObjects] = useState([]);
  const [userAccount, setUserAccount] = useState(null)
  const [isCryptomatSelected, setIsCryptomatSelected] = useState(false);
  game.init();

  useEffect(() => {
    game.loadAccount()
      .then((account) => {
        setUserAccount(account);
      });
    
    game.refresh()
      .then((objects) => {
        setObjects(objects);
      });

    game.listen(setObjects);
  }, []);

  useEffect(() => {
    if(userAccount) {
    }
  }, [userAccount])

  useEffect(() => {
    const selectedObj = objects.find(o => o.isSelected);
    if(selectedObj) {
      setIsCryptomatSelected(true);
    } else {
      setIsCryptomatSelected(false);
    }

  }, [objects]);

  const gameAreaProps = {
    gridSize: 10,
    objects,
    onObjectClicked: (event, obj) => {
      let index = objects.indexOf(obj);

      obj.isSelected = !obj.isSelected;

      for(let i=0; i< objects.length; i++) {
        if(i !== index) {
          objects[i].isSelected = false;
        }
      }

      var newObjects = [...objects];

      newObjects[index] = obj;

      setObjects(newObjects);
    },
    onPositionClicked: (event, x, y) => {
      if(!isCryptomatSelected) {
        game.createCryptomatAtPosition(userAccount, "Cryptomat", x, y);
      } else {
        const selectedObj = objects.find(o => o.isSelected);

        game.moveCryptomat(userAccount, selectedObj.cryptomatId, x, y);
      }
    }
  };

  return (
    <div className="">
      
      {userAccount ? 'MetaMask connected' : 'MetaMask not connected'}

      <SimpleGameArea
        {...gameAreaProps}
       >

      </SimpleGameArea>

    </div>
  );
}
