import React, { useEffect, useState } from 'react';
import './GameTestPage.scss';
import { generateRange } from '../../utilities/array-functions';
import useContractEvents from '../shared/useContractEvents';
import cryptomacyContract from '../../services/cryptomacyContract';
import useEthAccount from '../shared/useEthAccount';
import cryptomacyContractService from '../../services/cryptomacyContractService';

type Cryptomat = {
  id: number;
  x: number;
  y: number;
};

export default () => {
  const [viewSize, setViewSize] = useState(6);
  const [viewPositionX, setViewPositionX] = useState(0);
  const [viewPositionY, setViewPositionY] = useState(0);
  const [cryptomats, setCryptomats] = useState<Cryptomat[]>([]);
  const [selectedCryptomatId, setSelectedCryptomatId] = useState<number | null>(null);

  const userAddress = useEthAccount();

  const moveCryptomatEvents = useContractEvents(cryptomacyContract, 'CryptomatMovesToPosition', e => {
    setCryptomats(cryptomats => {
      let newCryptomats = [...cryptomats];
      let existingCryptomat = cryptomats.find(x => x.id === Number(e.returnValues.cryptomatId));

      if(!existingCryptomat) {
        newCryptomats.push({
          id: Number(e.returnValues.cryptomatId),
          x: Number(e.returnValues.positionX),
          y: Number(e.returnValues.positionY)
        } as Cryptomat);
      } else {
        existingCryptomat.x = Number(e.returnValues.positionX);
        existingCryptomat.y = Number(e.returnValues.positionY);
      }

      return newCryptomats;
    });
  });

  useEffect(() => {
    if(moveCryptomatEvents != null) {
      const _cryptomats: Cryptomat[] = [];
    
      for(let event of moveCryptomatEvents) {
        let existingCryptomat = _cryptomats.find(x => x.id === Number(event.returnValues.cryptomatId));
  
        if(!existingCryptomat) {
          _cryptomats.push({
            id: Number(event.returnValues.cryptomatId),
            x: Number(event.returnValues.positionX),
            y: Number(event.returnValues.positionY)
          } as Cryptomat);
        } else {
          existingCryptomat.x = Number(event.returnValues.positionX);
          existingCryptomat.y = Number(event.returnValues.positionY);
        }
      }

      setCryptomats(_cryptomats);
    }
    
  }, [moveCryptomatEvents]);

  const wheel = event => {
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

  const onEmptyHexClicked = (x, y) => {
    if(selectedCryptomatId) {
      let cryptomat = cryptomats.find(cryptomat => cryptomat.id === selectedCryptomatId);
      cryptomacyContractService.moveCryptomat(userAddress, cryptomat.id.toString(), x, y)
    } else {
      cryptomacyContractService.createCryptomatAtPosition(userAddress, 'Test', x.toString(), y.toString());
    }
  };
  
  const onCryptomatClicked = (cryptomat) => {
    if(selectedCryptomatId && selectedCryptomatId === cryptomat.id) {
      setSelectedCryptomatId(null);
    } else {
      setSelectedCryptomatId(cryptomat.id);
    }
  };

  return (
    <div className="GameTestPage" onWheel = {(e) => wheel(e)}>
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
                  generateRange(y % 2 === Math.abs(viewPositionY % 2)  ? viewSize : viewSize + 1)
                    .map(x => {
                      let realX: number;
                      let realY: number;

                      if(Math.abs(viewPositionY % 2) === 0) {
                        realX =  y % 2 == 0 
                          ? x - unsignedCenterX + viewPositionX
                          : x - 1 - unsignedCenterX + viewPositionX;

                        realY = y - unsignedCenterY + viewPositionY

                      } else {
                        realX =  y % 2 == 0 
                          ? x - unsignedCenterX + viewPositionX - 1
                          : x - 1 - unsignedCenterX + viewPositionX + 1;
                      
                          realY = y - unsignedCenterY + viewPositionY
                      }
                    


                      let cryptomat = cryptomats.find(cryptomat => cryptomat.x === realX && cryptomat.y === realY);

                      if(cryptomat) {
                        let isSelected = selectedCryptomatId && selectedCryptomatId === cryptomat.id;

                        return (
                          <div key={`${realX},${realY}`} className={`hexagon agent ${isSelected ? 'selected' : ''}`} onClick={e => onCryptomatClicked(cryptomat)}>
                          </div>
                        );
                      } else {
                        return (
                          <div key={`${realX},${realY}`} className="hexagon" onClick={e => onEmptyHexClicked(realX, realY)}>
                            {realX},{realY}
                          </div>
                        );
                      }
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
