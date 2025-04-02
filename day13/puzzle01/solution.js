import { promises as fs } from "fs";

/*
for each machine
recursive function:
args = aCount, bCount, targetX, targetY, xIncrement, yIncrement

currentX = aCount * a x increment + bCount * b x increment
currentY = aCount * a y increment + bCount * b y increment

base case = currentX >= targetX || currentY >= targetY
if currentX = targetX and same for Y
return acount, bcount
else return null

recurse (plus 1 a count)
recurse (plus 1 b count)

*/

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(/\r\n\r\n|\r\r|\n\n/);
  let machineData = dataArray.map((element) => {
    let keyNums = [];
    for (let i = 0; i < element.length; i++) {
      if (element[i] === "+") {
        keyNums.push(parseInt(element[i + 1] + element[i + 2]));
      } else if (element[i] === "=") {
        let num = element[i + 1];
        let j = i + 2;
        while (element[j] && element[j] !== ",") {
          num += element[j];
          j++;
        }
        keyNums.push(parseInt(num));
      }
    }
    return {
      buttonA: {
        x: keyNums[0],
        y: keyNums[1],
      },
      buttonB: {
        x: keyNums[2],
        y: keyNums[3],
      },
      prize: {
        x: keyNums[4],
        y: keyNums[5],
      },
    };
  });

  const recurse = (
    aCount,
    bCount,
    aButton,
    bButton,
    targetX,
    targetY,
    memo = { solutions: [] }
  ) => {
    let results = [];
    if (memo[`${aCount}.${bCount}`]) {
      return;
    }
    memo[`${aCount}.${bCount}`] = true;
    let currentX = aCount * aButton.x + bCount * bButton.x;
    let currentY = aCount * aButton.y + bCount * bButton.y;
    // base case
    if (currentX >= targetX || currentY >= targetY) {
      if (currentX === targetX && currentY === targetY) {
        memo.solutions.push(aCount, bCount);
        return memo;
      } else {
        return null;
      }
    }
    results.push(
      recurse(aCount + 1, bCount, aButton, bButton, targetX, targetY, memo)
    );
    results.push(
      recurse(aCount, bCount + 1, aButton, bButton, targetX, targetY, memo)
    );
    return memo.solutions;
  };
  let sum = 0;
  machineData.forEach((machine) => {
    let results = recurse(
      0,
      0,
      machine.buttonA,
      machine.buttonB,
      machine.prize.x,
      machine.prize.y
    );
    if (results.length === 2) {
      sum += results[0] * 3;
      sum += results[1];
    }
});
console.log(sum);
};

solution();
