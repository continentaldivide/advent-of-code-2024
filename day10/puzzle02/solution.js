/*
iterate through grid and find trailheads, save coords?  or maybe just pause at each trailhead and run function
for each trailhead
use recursion to follow all paths and find reachable 9 height positions

parameter: number 0-9, memo obj, coords
base case: if number is 9, return 1?

check numbers up/down/left/right for number one greater than parameter num
for any hits, call func with that found number and its coords 

count unique reachable ends and add to sum

PART 2: remove memoization...done

*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(/\r\n|\r|\n/);
  let edgeSize = dataArray.length - 1;
  let sumOfScores = 0;

  const helperFunction = (num, coords) => {
    let score = 0;
    if (num === 9) {
      return 1;
    }
    let left = [coords[0] - 1, coords[1]];
    let right = [coords[0] + 1, coords[1]];
    let up = [coords[0], coords[1] - 1];
    let down = [coords[0], coords[1] + 1];
    let adjacentCoords = [left, right, up, down];
    adjacentCoords.forEach((newCoords) => {
      const inBounds = newCoords.every(
        (coord) => coord >= 0 && coord <= edgeSize
      );
      if (!inBounds) {
        return;
      }
      // has to be not strictly equal because comparison is between num and string -- fix this later
      const oneHigher = dataArray[newCoords[1]][newCoords[0]] == num + 1;
      if (oneHigher) {
        score += helperFunction(num + 1, newCoords);
      }
    });
    return score;
  };

  dataArray.forEach((line, y) => {
    line = line.split("");
    line = line.map((num) => parseInt(num));
    for (let x = 0; x < line.length; x++) {
      if (line[x] === 0) {
        let score = helperFunction(line[x], [x, y]);
        sumOfScores += score;
      }
    }
  });
  console.log(sumOfScores);
};
solution();
