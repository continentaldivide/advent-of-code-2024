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

  let correctedSum = 0;

  /*
  for each update
  for each number (starting at [1])
  check if numbers before are in the hash for current number (supposed to be after)
  if true, while loop:
  j is index of last prev number found to be in hash, starting with i - 2
  check numbers before i one at a time going backwards
  while checked in hash for current number, continue loop, decrement j
  not in hash, end while loop
  move update[i] to update[j] (mutate update)
  continue inner for loop (index should still be right because same number of stuff is in update)
  after inner for loop, if update was incorrectly ordered, get middle number and add to sum
  advance foreach
  */

  updatesArray.forEach((update) => {
    let updateAlreadyOrdered = true;
    const prevNums = [update[0]];
    for (let i = 1; i < update.length; i++) {
      const wrongOrder = prevNums.some((element) => {
        if (ruleLookupHash[update[i]]) {
          return ruleLookupHash[update[i]].includes(element);
        }
      });
      prevNums.push(update[i]);
      if (wrongOrder) {
        updateAlreadyOrdered = false;
        let stillWrongOrder = true;
        let j = i - 2;
        while (stillWrongOrder) {
          if (ruleLookupHash[update[i]].includes(update[j])) {
            j--;
          } else {
            stillWrongOrder = false;
          }
        }
        let [tempItem] = update.splice(i, 1);
        update.splice(j + 1, 0, tempItem);
      }
    }
    if (!updateAlreadyOrdered) {
      const middleNum = update[Math.floor(update.length / 2)];
      correctedSum += middleNum;
    }
  });
  console.log(correctedSum);
};

solution();
