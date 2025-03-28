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

pt 2:
in recursive function, add a map lookup for sides
each newly visted tile, check for sides
any found sides, check for in the lookup to see if same side already identified
if already in lookup, ignore; if not in lookup, add
what is a side? it's a coordinate (x or y) and a direction (left or right, up or down), AND have to consider whether adjacent plant is in different region (can be multiple sides with same coord + direction)
*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(/\r\n|\r|\n/);
  let visitedTiles = {};
  let totalCost = 0;

  const recurse = (currentPlant, i, j, sideMap = {}) => {
    let totalArea = 0;
    // first, mark the current tile as having been visited:
    visitedTiles[`${i}.${j}`] = true;
    // next, compute coords for adjacent tiles and determine whether any of them need to be traversed:
    let left = [i, j - 1];
    let right = [i, j + 1];
    let up = [i - 1, j];
    let down = [i + 1, j];
    let adjacentCoords = [left, right, up, down];
    let validAdjacents = [];
    let dirMap = {
      0: "left",
      1: "right",
      2: "up",
      3: "down",
    };
    adjacentCoords.forEach((coords, k) => {
      const inBounds = coords.every(
        (coord) => coord >= 0 && coord < dataArray.length
      );
      if (!sideMap[`${j}.${dirMap[k]}`]) {
        sideMap[`${j}.${dirMap[k]}`] = [];
      }
      if (!sideMap[`${i}.${dirMap[k]}`]) {
        sideMap[`${i}.${dirMap[k]}`] = [];
      }
      if (!inBounds) {
        // add a side to sidemap
        k === 0 || k === 1
          ? (sideMap[`${j}.${dirMap[k]}`] = [
              ...sideMap[`${j}.${dirMap[k]}`],
              i,
            ])
          : (sideMap[`${i}.${dirMap[k]}`] = [
              ...sideMap[`${i}.${dirMap[k]}`],
              j,
            ]);
        return;
      }
      if (dataArray[coords[0]][coords[1]] !== currentPlant) {
        // add a side to sidemap
        k === 0 || k === 1
          ? (sideMap[`${j}.${dirMap[k]}`] = [
              ...sideMap[`${j}.${dirMap[k]}`],
              i,
            ])
          : (sideMap[`${i}.${dirMap[k]}`] = [
              ...sideMap[`${i}.${dirMap[k]}`],
              j,
            ]);
        return;
      }
      validAdjacents.push(coords);
    });

    totalArea += 1;
    validAdjacents.forEach((coords) => {
      // skip this coord if we've been there already
      if (visitedTiles[`${coords[0]}.${coords[1]}`]) {
        return;
      }
      let { area } = recurse(currentPlant, coords[0], coords[1], sideMap);
      totalArea += area;
    });

    for (const key in sideMap) {
      if (sideMap[key].length === 0) {
        delete sideMap[key];
        continue;
      }
    }

    const sides = Object.keys(sideMap).length;
    return { area: totalArea, sides, sideMap };
  };

  dataArray.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (visitedTiles[`${i}.${j}`]) {
        continue;
      }
      let { area, sides, sideMap } = recurse(line[j], i, j);
      for (const key in sideMap) {
        sideMap[key].sort();
        sideMap[key].forEach((element, i) => {
          if (element - sideMap[key][i - 1] > 1) {
            sides++;
          }
        });
      }
      console.log(area, sides, sideMap);
      totalCost += area * sides;
    }
  });
  console.log(totalCost);
};

solution();
