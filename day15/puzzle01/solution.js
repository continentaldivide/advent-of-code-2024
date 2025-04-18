import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let [warehouseMap, directions] = data.split("\n\n");
  let warehouseMapArray = warehouseMap.split("\n").map((line) => {
    return line.split("");
  });

  let robotCoords;
  for (let i = 0; i < warehouseMapArray.length; i++) {
    for (let j = 0; j < warehouseMapArray.length; j++) {
      if (warehouseMapArray[i][j] === "@") {
        robotCoords = [j, i]; // saving as [x coord, y coord]
      }
    }
  }

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
    // if tile is #, return
    if (adjacentTile === "#") {
      return;
    }
    if (adjacentTile === ".") {
      // if tile is ., replace robot with ., update robot coords, replace adj tile with @
      warehouseMapArray[robotCoords[1]][robotCoords[0]] = ".";
      robotCoords = adjacentCoords;
      warehouseMapArray[robotCoords[1]][robotCoords[0]] = "@";
      return;
    }
    let nextOpenTile = warehouseMapArray[y][x];
    // if tile is 0...
    // continue moving in dir until we find either # or .
    while (nextOpenTile === "O") {
      x += deltaX;
      y += deltaY;
      nextOpenTile = warehouseMapArray[y][x];
    }
    // if #, return
    if (nextOpenTile === "#") {
      return;
    }
    // if ., replace robot with ., update robot coords, replace adj tile with @, replace . coord with 0
    if (nextOpenTile === ".") {
      warehouseMapArray[robotCoords[1]][robotCoords[0]] = ".";
      robotCoords = adjacentCoords;
      warehouseMapArray[robotCoords[1]][robotCoords[0]] = "@";
      warehouseMapArray[y][x] = "O";
    }
  };

  for (let i = 0; i < directions.length; i++) {
    if (directions[i] === "\n") {
      continue;
    }
    attemptMove(directions[i]);
  }
  // iterate over warehouseMapArray and for each O do some math and add to sum
  let GPSCoord = 0;
  warehouseMapArray.forEach((line, i) => {
    line.forEach((e, j) => {
      if (e === "O") {
        GPSCoord += 100 * i + j;
      }
    });
  });
  console.log(GPSCoord);
};

solution();
