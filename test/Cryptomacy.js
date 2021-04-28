const Cryptomacy = artifacts.require("Cryptomacy");
const utils = require("./helpers/utils");

const worldSize = 10;

contract("Cryptomacy", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;

  let cryptomatNames = ["matey", "bobby"];

  function multipleCases(getName, data, callback) {
    for(let item of data) {
      it(getName(item), async () => {
        await callback(item);
      })
    }
  }

  beforeEach(async () => {
      contractInstance = await Cryptomacy.new();
  });

  context("with the creation scenario", async () => {

    it("should be able to create new cryptomat", async () => {
      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], 0, 0, {from: alice});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.name, cryptomatNames[0]);
    })
    it("should be able to create a cryptomat per player", async () => {
      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], 0, 0, {from: alice});
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.name, cryptomatNames[0]);

      const result2 = await contractInstance.createCryptomatAtPosition(cryptomatNames[1], 0, 1, {from: bob});
      assert.equal(result2.receipt.status, true);
      assert.equal(result2.logs[0].args.name, cryptomatNames[1]);
    })
  })

  context("with the specific position creation scenario", async () => {

    it("should be able to create cryptomat at position", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});

      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.name, cryptomatNames[0]);
      assert.equal(result.logs[0].args.positionX, cryptomatPos.x);
      assert.equal(result.logs[0].args.positionY, cryptomatPos.y);
    })
    it("should not be able to create cryptomat outside of bounds", async () => {
      let positions = [
        {
          x: -1,
          y: 0
        },
        {
          x: 0,
          y: -1
        },
        {
          x: worldSize,
          y: 0
        },
        {
          x: 0,
          y: worldSize
        }
      ];

      for(position of positions) {
        const promise = contractInstance.createCryptomatAtPosition(cryptomatNames[0], position.x, position.y, {from: alice});

        await utils.shouldThrow(promise);
      }
    })
    it("should not be able to create two cryptomats of same player at same position", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});

      const secondPromise = contractInstance.createCryptomatAtPosition(cryptomatNames[1], cryptomatPos.x, cryptomatPos.y, {from: alice});

      await utils.shouldThrow(secondPromise);
    })
    it("should not be able to create two cryptomats of different players at same position", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});

      const secondPromise = contractInstance.createCryptomatAtPosition(cryptomatNames[1], cryptomatPos.x, cryptomatPos.y, {from: bob});

      await utils.shouldThrow(secondPromise);
    })
  })

  context("with the movement scenario", async () => {

    multipleCases(x => `should be able to move a cryptomat in four directions(${x.name})`,
    [
      {
        x: 1,
        y: 0,
        name: "up"
      },
      {
        x: 2,
        y: 1,
        name: "right"
      },
      {
        x: 1,
        y: 2,
        name: "down"
      },
      {
        x: 0,
        y: 1,
        name: "left"
      }
    ],
    async targetPosition => {
      const initialPos = {
        x: 1,
        y: 1
      };

      const createResult = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], initialPos.x, initialPos.y, {from: alice});
      let cryptomatId = createResult.logs[0].args.cryptomatId;

      assert.equal(createResult.logs[0].args.positionX, initialPos.x);
      assert.equal(createResult.logs[0].args.positionY, initialPos.y);

      const result = await contractInstance.moveCryptomat(cryptomatId, targetPosition.x, targetPosition.y, {from: alice});

      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.positionX, targetPosition.x);
      assert.equal(result.logs[0].args.positionY, targetPosition.y);
    });

    multipleCases(x => `should not be able to move a cryptomat in other directions(${x.name})`,
    [
      {
        x: 0,
        y: 0,
        name: "up left"
      },
      {
        x: 2,
        y: 0,
        name: "up right"
      },
      {
        x: 0,
        y: 2,
        name: "down left"
      },
      {
        x: 2,
        y: 2,
        name: "down right"
      }
    ],
    async targetPosition => {
      const initialPos = {
        x: 1,
        y: 1
      };

      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], initialPos.x, initialPos.y, {from: alice});
      let cryptomatId = result.logs[0].args.cryptomatId;

      const promise = contractInstance.moveCryptomat(cryptomatId, targetPosition.x, targetPosition.y, {from: alice});

      await utils.shouldThrow(promise);
    });

    multipleCases(x => `should not be able to move a cryptomat more than one block in any direction(${x.name})`,
    [
      {
        x: 2,
        y: 0,
        name: "up"
      },
      {
        x: 4,
        y: 2,
        name: "right"
      },
      {
        x: 2,
        y: 4,
        name: "down"
      },
      {
        x: 0,
        y: 2,
        name: "left"
      }
    ],
    async targetPosition => {
      const initialPos = {
        x: 2,
        y: 2
      };

      const createResult = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], initialPos.x, initialPos.y, {from: alice});
      let cryptomatId = createResult.logs[0].args.cryptomatId;

      assert.equal(createResult.logs[0].args.positionX, initialPos.x);
      assert.equal(createResult.logs[0].args.positionY, initialPos.y);

      const promise = contractInstance.moveCryptomat(cryptomatId, targetPosition.x, targetPosition.y, {from: alice});

      await utils.shouldThrow(promise);
    });

    multipleCases(x => `should not be able to move a cryptomat outside bounds(${x.name})`,
    [
      {
        name: 'left',
        positions: [
            {
              x: 0,
              y: 0
            },
            {
              x: -1,
              y: 0
            }
          ]
      },
      {
        name: 'up',
        positions: [
            {
              x: 0,
              y: 0
            },
            {
              x: 0,
              y: -1
            }
          ]
      },
      {
        name: 'right',
        positions: [
            {
              x: worldSize-1,
              y: 0
            },
            {
              x: worldSize,
              y: 0
            }
          ]
      },
      {
        name: 'down',
        positions: [
            {
              x: 0,
              y: worldSize-1
            },
            {
              x: 0,
              y: worldSize
            }
          ]
      },
    ],
    async data => {
      const [startPos, targetPos] = data.positions;

      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], startPos.x, startPos.y, {from: alice});
      let cryptomatId = result.logs[0].args.cryptomatId;

      const promise = contractInstance.moveCryptomat(cryptomatId, targetPos.x, targetPos.y, {from: alice});

      await utils.shouldThrow(promise);
    });
  });

  context("with the cryptomat ownership movement scenario", async () => {

    it("should be able to move own cryptomat", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      let cryptomatPos2 = {
        x: 1,
        y: 0
      };

      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});
      let cryptomatId = result.logs[0].args.cryptomatId;
      assert.equal(result.logs[0].args.positionX, cryptomatPos.x);
      assert.equal(result.logs[0].args.positionY, cryptomatPos.y);

      const result2 = await contractInstance.moveCryptomat(cryptomatId, cryptomatPos2.x, cryptomatPos2.y, {from: alice});
      assert.equal(result2.receipt.status, true);

      assert.equal(result2.logs[0].args.positionX, cryptomatPos2.x);
      assert.equal(result2.logs[0].args.positionY, cryptomatPos2.y);
    })
    it("should not be able to move another players cryptomat", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      let cryptomatPos2 = {
        x: 1,
        y: 0
      };

      const result = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});
      let cryptomatId = result.logs[0].args.cryptomatId;

      const promise = contractInstance.moveCryptomat(cryptomatId,  cryptomatPos2.x, cryptomatPos2.y, {from: bob});

      await utils.shouldThrow(promise);
    })
  })

  context("with the position occupied scenario", async () => {

    it("should be able to move a cryptomat to a taken position of same player", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      let cryptomatPos2 = {
        x: 1,
        y: 0
      };

      const result1 = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});
      let cryptomatId = result1.logs[0].args.cryptomatId;

      const result2 = await contractInstance.createCryptomatAtPosition(cryptomatNames[1], cryptomatPos2.x, cryptomatPos2.y, {from: alice});
      let cryptomatId2 = result2.logs[0].args.cryptomatId;

      const movementPromise = contractInstance.moveCryptomat(cryptomatId, cryptomatPos2.x, cryptomatPos2.y, {from: alice});

      await utils.shouldThrow(movementPromise);

      const movementPromise2 = contractInstance.moveCryptomat(cryptomatId2, cryptomatPos.x, cryptomatPos.y, {from: alice});

      await utils.shouldThrow(movementPromise2);
    })
    it("should be able to move a cryptomat to a taken position of different player", async () => {
      let cryptomatPos = {
        x: 0,
        y: 0
      };

      let cryptomatPos2 = {
        x: 1,
        y: 0
      };

      const result1 = await contractInstance.createCryptomatAtPosition(cryptomatNames[0], cryptomatPos.x, cryptomatPos.y, {from: alice});
      let cryptomatId = result1.logs[0].args.cryptomatId;

      const result2 = await contractInstance.createCryptomatAtPosition(cryptomatNames[1], cryptomatPos2.x, cryptomatPos2.y, {from: bob});
      let cryptomatId2 = result2.logs[0].args.cryptomatId;

      const movementPromise = contractInstance.moveCryptomat(cryptomatId, cryptomatPos2.x, cryptomatPos2.y, {from: alice});

      await utils.shouldThrow(movementPromise);

      const movementPromise2 = contractInstance.moveCryptomat(cryptomatId2, cryptomatPos2.x, cryptomatPos2.y, {from: bob});

      await utils.shouldThrow(movementPromise2);
    })
  })
})
