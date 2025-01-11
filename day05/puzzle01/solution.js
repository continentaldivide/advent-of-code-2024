/*
parse input
build a hash
  - for each rule
    - go to the first number's position in the hash
      - if nothing there, add an array containing the second number
      - if something there, push the second number onto the array
iterate over set of updates
  - for each update
    - for each number
      - check whether any of the prior numbers in the update matches any of the numbers in the array at that hash position -- i.e, whether a number that is supposed to be *after* it is before it instead
        - if true, update is not in right order; go next update
        - if false, go next number
    - if we reach end of update, get middle number, add to sum
*/
import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  //   split on the input's double line break to get an array containing two strings: rules and updates
  const rulesAndUpdates = data.split(/\r\n\r\n|\r\r|\n\n/);
  const [rules, updates] = rulesAndUpdates;

  let rulesArray = rules.split(/\r\n|\r|\n/);
  rulesArray = rulesArray.map((rule) => {
    let rulePairArray = rule.split("|");
    // these don't really need to be ints instead of strs -- but it feels a little more intuitive
    rulePairArray[0] = parseInt(rulePairArray[0]);
    rulePairArray[1] = parseInt(rulePairArray[1]);
    return rulePairArray;
  });

  let updatesArray = updates.split(/\r\n|\r|\n/);
  updatesArray = updatesArray.map((update) => {
    let updateArray = update.split(",");
    updateArray = updateArray.map((item) => {
      return parseInt(item);
    });
    return updateArray;
  });

  const ruleLookupHash = {};
  rulesArray.forEach((rule) => {
    if (!ruleLookupHash[rule[0]]) {
      ruleLookupHash[rule[0]] = [rule[1]];
    } else {
      ruleLookupHash[rule[0]].push(rule[1]);
    }
  });

  let sum = 0;

  updatesArray.forEach((update) => {
    const middleNum = update[Math.floor(update.length / 2)];
    let correctOrder = true;
    const prevNums = [update[0]];
    for (let i = 1; i < update.length; i++) {
      if (!correctOrder) {
        break;
      }
      const wrongOrder = prevNums.some((element) => {
        return ruleLookupHash[update[i]].includes(element);
      });
      if (wrongOrder) {
        correctOrder = false;
      }
      prevNums.push(update[i]);
    }
    if (correctOrder) {
      sum += middleNum;
    }
  });
  console.log(sum);
};

solution();
