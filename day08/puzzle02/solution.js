/*
parse input
iterate through grid and create a lookup obj for all antenna coords
create lookup obj for all antinodes
iterate over lookup obj
if antenna has only one coord, continue
if multiple coords, check each combination of nodes (nested loops?)
for each combination of nodes:
===
evaluate x difference and y difference
use difference to find "step size"
xStepIsBigger = abs(xdiff) > abs(ydiff)
ystep = abs(ydiff)
xstep = abs(xdiff)
divisible = xStepIsBigger ? xdiff / ydiff % 0 : ydiff / xdiff % 0
bigstep = max([abs(xstep), abs(ystep)])
smallstep = min([abs(xdiff), abs(ydiff)])
if (bigstep / smallstep % 0)
real big  = bigcoord / smallcoord
real small = 1
for each node in combination, move towards other node in steps adding new antinodes until OOB
===
print obj.keys.length
*/

import { promises as fs } from "fs";

const solution = async () => {
  // ======================
  // HELPER FUNCTIONS/TOOLS
  // ======================
  const addAntinodesToMap = (coordOne, coordTwo) => {
    // started working on a solution for the possible edge case of coords that are (for example) 6, 2 apart and need antinodes every 3, 1 instead of just every 6, 2.  logging (useDividedSteps) produced only false outcomes with my input, which suggests to me that the puzzle isn't testing this edge case.
    /*
    let xStep = coordOne[0] - coordTwo[0];
    let yStep = coordOne[1] - coordTwo[1];
    const xStepIsBigger = Math.abs(xStep) > Math.abs(yStep);
    const useDividedSteps = xStepIsBigger
    ? xStep % yStep === 0 && Math.abs(yStep) != 1
    : yStep % xStep === 0 && Math.abs(xStep) != 1;
    console.log(useDividedSteps, coordOne, coordTwo);
    */
    antinodeMap[`${coordOne[0]}.${coordOne[1]}`] = true;
    antinodeMap[`${coordTwo[0]}.${coordTwo[1]}`] = true;
    let xDiff = coordOne[0] - coordTwo[0];
    let yDiff = coordOne[1] - coordTwo[1];
    let xVal = coordOne[0] + xDiff;
    let yVal = coordOne[1] + yDiff;
    let inBounds = [xVal, yVal].every(
      (coord) => coord >= 0 && coord <= edgeSize
    );
    while (inBounds) {
      antinodeMap[`${xVal}.${yVal}`] = true;
      xVal += xDiff;
      yVal += yDiff;
      inBounds = [xVal, yVal].every((coord) => coord >= 0 && coord <= edgeSize);
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
        addAntinodesToMap(coord, coordTwo);
        addAntinodesToMap(coordTwo, coord);
      }
    });
  }
  console.log(Object.keys(antinodeMap).length);
};

solution();
