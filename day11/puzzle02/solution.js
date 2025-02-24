/*
part 2:

what if instead of building and iterating the entire array, we just do one num at a time and get an output of its eventual produced length?  maybe recursively?

still too slow.  need to use DP to memoize calculated results somehow

iterate through map
for each thing in map
check which condition it meets  
do the calculation to see what it produces
if not output in map
add output key to map with value matching input key value
else
add input key value to output key value (i.e, if we had 12 0s, now we have +12 1s)
recurse with new map

this one REALLY jumbled me up.  I don't think I needed to stick with recursion after my first try failed; this almost certainly could have just been a simple for loop like I used for part 1.  but I really got fixated on using memoization, and once it became clear this was going to work I decided to stick with it rather than pivoting back to a different strategy.
*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(" ");
  let sum = 0;
  let dict = {};
  dataArray.forEach((element) => {
    dict[element] = 1;
  });

  let newFunc = (depth = 0, memo = {}) => {
    let newMemo = {};
    if (depth === 75) {
      return memo;
    }
    for (const key in memo) {
      if (key == 0) {
        newMemo["1"] ? (newMemo["1"] += memo["0"]) : (newMemo["1"] = memo["0"]);
      } else if (key.length % 2 === 0) {
        let half = key.length / 2;
        let firstHalf = key.slice(0, half);
        let secondHalf = key.slice(-1 * half);
        while (secondHalf[0] === "0" && secondHalf.length > 1) {
          secondHalf = secondHalf.slice(1);
        }
        newMemo[firstHalf]
          ? (newMemo[firstHalf] += memo[key])
          : (newMemo[firstHalf] = memo[key]);
        newMemo[secondHalf]
          ? (newMemo[secondHalf] += memo[key])
          : (newMemo[secondHalf] = memo[key]);
      } else {
        let newNum = (parseInt(key) * 2024).toString();
        newMemo[newNum]
          ? (newMemo[newNum] += memo[key])
          : (newMemo[newNum] = memo[key]);
      }
    }
    return newFunc(depth + 1, newMemo);
  };
  dict = newFunc(0, dict);

  for (const key in dict) {
    sum += dict[key];
  }

  console.log(sum);
};

solution();
