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
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(/\r\n|\r|\n/);
  let visitedTiles = {};
  let totalCost = 0;

  const recurse = (currentPlant, i, j) => {
    let totalArea = 0;
    let totalPerimeter = 0;
    // first, mark the current tile as having been visited:
    visitedTiles[`${i}.${j}`] = true;
    // next, compute coords for adjacent tiles and determine whether any of them need to be traversed:
    let left = [i, j - 1];
    let right = [i, j + 1];
    let up = [i - 1, j];
    let down = [i + 1, j];
    let adjacentCoords = [left, right, up, down];
    let validAdjacents = [];
    adjacentCoords.forEach((coords) => {
      const inBounds = coords.every(
        (coord) => coord >= 0 && coord < dataArray.length
      );
      if (!inBounds) {
        totalPerimeter += 1;
        return;
      }
      if (dataArray[coords[0]][coords[1]] !== currentPlant) {
        totalPerimeter += 1;
        return;
      }
      validAdjacents.push(coords);
    });

    // base case
    if (validAdjacents.length === 0) {
      return { area: 1, perimeter: totalPerimeter };
    }
    // if not base case
    totalArea += 1;
    validAdjacents.forEach((coords) => {
      // skip this coord if we've been there already
      if (visitedTiles[`${coords[0]}.${coords[1]}`]) {
        return;
      }
      let { area, perimeter } = recurse(currentPlant, coords[0], coords[1]);
      totalArea += area;
      totalPerimeter += perimeter;
    });
    return { area: totalArea, perimeter: totalPerimeter };
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
