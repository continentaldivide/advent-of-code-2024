import { promises as fs } from "fs";

const solution = async () => {
  // ======================
  // HELPER FUNCTIONS/TOOLS
  // ======================
  const directions = {
    "^": "up",
    v: "down",
    ">": "right",
    "<": "left",
  };

  const getNextSpace = (direction, x, y) => {
    const nextSpaceLookup = {
      up: [x, y - 1],
      down: [x, y + 1],
      left: [x - 1, y],
      right: [x + 1, y],
    };
    return nextSpaceLookup[direction];
  };

  const addCharToMap = (x, y, char) => {
    let tempArr = mapArray[y].split("");
    tempArr[x] = char;
    let newStr = tempArr.join("");
    mapArray[y] = newStr;
  };

  // =======================================
  // PARSE INPUT AND ESTABLISH INITIAL STATE
  // =======================================
  const data = await fs.readFile("./input.txt", "utf8");
  let mapArray = data.split(/\r\n|\r|\n/);

  // assumes grid will always be a square, which seems to be true for this puzzle
  const edgeSize = mapArray[0].length - 1;
  let [initialX, initialY] = [0, 0];
  mapArray.forEach((line, i) => {
    let xCoord = line.search(/[\^v<>]/);
    if (xCoord >= 0) {
      [initialX, initialY] = [xCoord, i];
    }
  });
  let direction = directions[mapArray[initialY][initialX]];
  let inBounds = true;
  let stuckCount = 0;
  let bumpMap = {};

  // ===========================
  // STEP THROUGH GUARD MOVEMENT
  // ===========================

  // iterate over every map space and test whether adding an obstacle makes guard get stuck.  test criterion = does guard bump into same obstacle from same direction more than one time?  if so, she's looped
  for (let i = 0; i <= edgeSize; i++) {
    for (let j = 0; j <= edgeSize; j++) {
      // reset relevant variables
      let [x, y] = [initialX, initialY];
      direction = directions[mapArray[initialY][initialX]];
      inBounds = true;
      bumpMap = {};
      // check if empty space here -- if not, proceed to next grid space
      if (mapArray[i][j] !== ".") {
        continue;
      }
      // if so, add obstruction here
      addCharToMap(j, i, "#");
      // test guard movement with new obstacle
      while (inBounds) {
        const [newX, newY] = getNextSpace(direction, x, y);
        inBounds = [newX, newY].every(
          (coord) => coord >= 0 && coord <= edgeSize
        );
        if (!inBounds) {
          break;
        } else if (mapArray[newY][newX] === "#") {
          // check if this 'bump' is in bumpMap
          // if so, break while loop, increment 'stuck' count
          // if not, add this 'bump' to bumpMap
          if (bumpMap[x.toString() + "." + y.toString() + direction] === true) {
            stuckCount++;
            break;
          } else {
            bumpMap[x.toString() + "." + y.toString() + direction] = true;
            const rotate = {
              up: "right",
              right: "down",
              down: "left",
              left: "up",
            };
            direction = rotate[direction];
            continue;
          }
        } else {
          x = newX;
          y = newY;
        }
      }
      // remove obstruction
      addCharToMap(j, i, ".");
    }
  }
  console.log(stuckCount);
};

solution();
