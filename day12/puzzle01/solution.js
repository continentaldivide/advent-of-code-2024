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
  console.log(dataArray);

  dataArray.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      if (visitedTiles[`${i}.${j}`]) {
        continue;
      }
      // do something
    }
  });
};

solution();
