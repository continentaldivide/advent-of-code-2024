/*
parse input
find and save starting position and orientation
while (condition) {
  check direction
  check next space in direction
  if out of bounds
    set while condition to false
  else if #
    update direction
    go next loop
  else
    change current coords to X
    update coords to next space
    go next loop
}
*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let mapArray = data.split(/\r\n|\r|\n/);

  // assumes grid will always be a square, which seems to be true for this puzzle
  const edgeSize = mapArray[0].length - 1;
  let [x, y] = [0, 0];
  mapArray.forEach((line, i) => {
    let xCoord = line.search(/[\^v<>]/);
    if (xCoord >= 0) {
      [x, y] = [xCoord, i];
    }
  });
  const directions = {
    "^": "up",
    v: "down",
    ">": "right",
    "<": "left",
  };

  let direction = directions[mapArray[y][x]];

  const getNextSpace = (direction) => {
    switch (direction) {
      case "up":
        return [x, y - 1];
      case "down":
        return [x, y + 1];
      case "left":
        return [x - 1, y];
      case "right":
        return [x + 1, y];
    }
  };

  const addXtoMap = () => {
    let tempArr = mapArray[y].split("");
    tempArr[x] = "X";
    let newStr = tempArr.join("");
    mapArray[y] = newStr;
  };

  let inBounds = true;

  while (inBounds) {
    const [newX, newY] = getNextSpace(direction);
    inBounds = [newX, newY].every((coord) => coord >= 0 && coord <= edgeSize);
    if (!inBounds) {
      addXtoMap();
    } else if (mapArray[newY][newX] === "#") {
      const rotate = {
        up: "right",
        right: "down",
        down: "left",
        left: "up",
      };
      direction = rotate[direction];
      continue;
    } else {
      addXtoMap();
      x = newX;
      y = newY;
    }
  }

  let sum = 0;
  mapArray.forEach((line) => {
    // number of segments the line gets broken into tells us how many Xs there are -- one fewer than the number of segments
    sum += line.split("X").length - 1;
  });
  console.log(sum);
};

solution();
