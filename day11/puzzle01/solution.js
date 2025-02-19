/*
for loop 25 iterations
each loop:
    instantiate new empty array
    iterate over data array
        if item is 0, push 1 to new array
        else if item.toString().length % 2 === 0, split item in two, push both
        else push item * 2024
    replace data array with new array
log data array length
*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(" ");

  for (let i = 0; i < 25; i++) {
    let newArray = [];
    dataArray.forEach((item) => {
      if (item == 0) {
        newArray.push("1");
      } else if (item.length % 2 === 0) {
        let half = item.length / 2;
        newArray.push(item.slice(0, half));
        let secondHalf = item.slice(-1 * half);
        // remove leading zeroes
        while (secondHalf[0] === "0" && secondHalf.length > 1) {
          secondHalf = secondHalf.slice(1);
        }
        newArray.push(secondHalf);
      } else {
        newArray.push((parseInt(item) * 2024).toString());
      }
    });
    dataArray = newArray;
  }
  console.log(dataArray.length);
};

solution();
