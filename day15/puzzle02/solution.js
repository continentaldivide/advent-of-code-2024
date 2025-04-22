import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input2.txt", "utf8");
  let [warehouseMap, directions] = data.split("\n\n");
  let warehouseMapArray = warehouseMap.split("\n").map((line) => {
    return line.split("");
  });

  // replace input map with double-width version
  let doubleWidth = [];
  warehouseMapArray.forEach((line, i) => {
    doubleWidth.push([]);
    line.forEach((char) => {
      if (char === "#" || char === ".") {
        doubleWidth[i].push(char);
        doubleWidth[i].push(char);
      }
      if (char === "@") {
        doubleWidth[i].push(char);
        doubleWidth[i].push(".");
      }
      if (char === "O") {
        doubleWidth[i].push("[");
        doubleWidth[i].push("]");
      }
    });
  });
  warehouseMapArray = doubleWidth;

  // find robot starting position
  let robotCoords;
  for (let i = 0; i < warehouseMapArray.length; i++) {
    for (let j = 0; j < warehouseMapArray[0].length; j++) {
      if (warehouseMapArray[i][j] === "@") {
        robotCoords = [j, i]; // saving as [x coord, y coord]
      }
    }
  }

  const drawMap = () => {
    warehouseMap = warehouseMapArray.map((line) => {
      return line.join("");
    });
    console.log(warehouseMap);
  };

  const attemptMove = (direction) => {
    const dirMap = {
      "<": [-1, 0],
      ">": [1, 0],
      "^": [0, -1],
      v: [0, 1],
    };
    // check adjacent tile based on direction
    let [deltaX, deltaY] = dirMap[direction];
    let [x, y] = [robotCoords[0] + deltaX, robotCoords[1] + deltaY];
    let adjacentTile = warehouseMapArray[y][x];
    let adjacentCoords = [x, y];
    // if we find a wall, return
    if (adjacentTile === "#") {
      return;
    }
    // if we find an empty space, replace robot with ., update robot coords, replace adj tile with @
    if (adjacentTile === ".") {
      warehouseMapArray[robotCoords[1]][robotCoords[0]] = ".";
      robotCoords = adjacentCoords;
      warehouseMapArray[robotCoords[1]][robotCoords[0]] = "@";
      return;
    }
    // if we reach this point, we found a box
    const horizontalMove = direction === "<" || direction === ">";
    let nextOpenTile = warehouseMapArray[y][x];
    // if dir is left or right
    if (horizontalMove) {
      // continue moving in dir until we find either # or .
      let distance = 0;
      while (nextOpenTile === "[" || nextOpenTile === "]") {
        x += deltaX;
        y += deltaY;
        distance++;
        nextOpenTile = warehouseMapArray[y][x];
      }
      // if #, we can't move boxes, return
      if (nextOpenTile === "#") {
        return;
      }
      // if ., replace robot with ., update robot coords, replace adj tile with @, shift boxes
      if (nextOpenTile === ".") {
        warehouseMapArray[robotCoords[1]][robotCoords[0]] = ".";
        robotCoords = adjacentCoords;
        warehouseMapArray[robotCoords[1]][robotCoords[0]] = "@";
        // replace all box tiles
        for (let i = 1; i <= distance; i++) {
          let newTile;
          if (direction === "<") {
            i % 2 === 0 ? (newTile = "[") : (newTile = "]");
            warehouseMapArray[robotCoords[1]][robotCoords[0] - i] = newTile;
          }
          if (direction === ">") {
            i % 2 === 0 ? (newTile = "]") : (newTile = "[");
            warehouseMapArray[robotCoords[1]][robotCoords[0] + i] = newTile;
          }
        }
      }
    }
    // now handle if dir is up or down
    else {
    }
  };

  // iterate over directions and perform moves
  for (let i = 0; i < directions.length; i++) {
    if (directions[i] === "\n") {
      continue;
    }
    attemptMove(directions[i]);
    drawMap();
  }
  // iterate over warehouseMapArray and for each box do some math and add to sum
  let GPSCoord = 0;
  warehouseMapArray.forEach((line, i) => {
    line.forEach((e, j) => {
      if (e === "[") {
        GPSCoord += 100 * i + j;
      }
    });
  });
  warehouseMapArray = warehouseMapArray.map((line) => {
    return line.join("");
  });
  console.log(GPSCoord);
};

solution();
