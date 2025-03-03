/*
create map of visited tiles
iterate over tiles
if tile visited
    continue
else
    recursive function:
    add to visited tile map
    increment area counter variable
    check adjacent tiles
        if same letter, recurse there
        else, increment perimeter counter 
*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input2.txt", "utf8");
  let dataArray = data.split(/\r\n|\r|\n/);
  let visitedTiles = {};
  let totalCost = 0;

  const recurse = (currentPlant, i, j, memo = { area: 0, perimeter: 0 }) => {
    if (currentPlant === "B") {
      console.log(memo.area, i, j);
    }
    visitedTiles[`${i}.${j}`] = true;
    memo.area += 1;
    let left = [i, j - 1];
    let right = [i, j + 1];
    let up = [i - 1, j];
    let down = [i + 1, j];
    let adjacentCoords = [left, right, up, down];
    let validAdjacents = [];
    adjacentCoords.forEach((coords) => {
      if (visitedTiles[`${coords[0]}.${coords[1]}`]) {
        return;
      }
      const inBounds = coords.every(
        (coord) => coord >= 0 && coord < dataArray.length
      );
      if (!inBounds) {
        memo.perimeter += 1;
        return;
      }
      if (dataArray[coords[0]][coords[1]] !== currentPlant) {
        memo.perimeter += 1;
        return;
      }
      validAdjacents.push(coords);
    });
    currentPlant === "B" ? console.log(memo.area, validAdjacents) : null;
    if (validAdjacents.length === 0) {
      return memo;
    }
    validAdjacents.forEach((coords) => {
      recurse(currentPlant, coords[0], coords[1], memo);
    });
    return memo;
  };

  dataArray.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (visitedTiles[`${i}.${j}`]) {
        continue;
      }
      let { area, perimeter } = recurse(line[j], i, j);
      totalCost += area * perimeter;
    }
  });
  console.log(totalCost);
};

solution();
