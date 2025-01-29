/*
parse input
iterate through grid and create a lookup obj for all antenna coords
create lookup obj for all antinodes
iterate over lookup obj
if antenna has only one coord, continue
if multiple coords, check each combination of nodes (nested loops?)
for each combination of nodes, check for in-bounds antinode
for any in-bounds anti-node, add to antinode lookup obj
print obj.keys.length
*/

import { promises as fs } from "fs";

const solution = async () => {
  // ======================
  // HELPER FUNCTIONS/TOOLS
  // ======================
  const addAntinodeToMap = (coordOne, coordTwo) => {
    let xVal = coordOne[0] + (coordOne[0] - coordTwo[0]);
    let yVal = coordOne[1] + (coordOne[1] - coordTwo[1]);
    let inBounds = [xVal, yVal].every(
      (coord) => coord >= 0 && coord <= edgeSize
    );
    if (inBounds) {
      antinodeMap[`${xVal}.${yVal}`] = true;
    }
  };

  // =====================================
  // PARSE INPUT AND RECORD ANTENNA COORDS
  // =====================================
  const data = await fs.readFile("./input.txt", "utf8");
  let mapArray = data.split(/\r\n|\r|\n/);
  // assumes grid will always be a square, which seems to be true for this puzzle
  const edgeSize = mapArray[0].length - 1;
  let antennaMap = {};
  let antinodeMap = {};
  mapArray.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      let char = line[x];
      if (char === ".") {
        continue;
      }
      if (antennaMap[char]) {
        antennaMap[char] = [...antennaMap[char], [x, y]];
      } else {
        antennaMap[char] = [[x, y]];
      }
    }
  });

  // ==============================
  // CALCULATE ANTINODE COORDINATES
  // ==============================
  for (const property in antennaMap) {
    let antennaCoords = antennaMap[property];
    antennaCoords.forEach((coord, i) => {
      for (let j = i + 1; j < antennaCoords.length; j++) {
        let coordTwo = antennaCoords[j];
        addAntinodeToMap(coord, coordTwo);
        addAntinodeToMap(coordTwo, coord);
      }
    });
  }
  console.log(Object.keys(antinodeMap).length);
};

solution();
