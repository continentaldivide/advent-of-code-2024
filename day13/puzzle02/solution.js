import { promises as fs } from "fs";

/*
part 2: system of equations (was thinking about this for part 1 but couldn't quite get the math untangled in my head)
variables = unknown numbers of presses
{buttonA.x}aPressCount + {buttonB.x}bPressCount = {prize.x}
{buttonA.y}aPressCount + {buttonB.y}bPressCount = {prize.y}

solving for aPressCount:

{buttonB.y} * {buttonA.x} * aPressCount + {buttonB.y} * {buttonB.x} * bPressCount = {buttonB.y} * {prize.x} - 
{buttonB.x} * {buttonA.y} * aPressCount + {buttonB.x} * {buttonB.y} * bPressCount = {buttonB.x} * {prize.y}
{buttonB.y} * {buttonA.x} * aPressCount - {buttonB.x} * {buttonA.y} * aPressCount = {buttonB.y} * {prize.x} - {buttonB.x} * {prize.y}
aPressCount * (({buttonB.y} * {buttonA.x}) - ({buttonB.x} * {buttonA.y})) = {buttonB.y} * {prize.x} - {buttonB.x} * {prize.y}
({buttonB.y} * {prize.x} - {buttonB.x} * {prize.y}) / ({buttonB.y} * {buttonA.x}) - ({buttonB.x} * {buttonA.y}) = aPressCount

now get bPressCount:

buttonA.x * aPressCount + buttonB.x * bPressCount = prize.x
buttonB.x * bPressCount = prize.x - buttonA.x * aPressCount
bPressCount = (prize.x - buttonA.x * aPressCount) / buttonB.x
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
        x: keyNums[4] + 10000000000000,
        y: keyNums[5] + 10000000000000,
      },
    };
  });

  let sum = 0;
  machineData.forEach((machine) => {
    const { buttonA, buttonB, prize } = machine;
    let aPressCount, bPressCount;

    aPressCount =
      (buttonB.y * prize.x - buttonB.x * prize.y) /
      (buttonB.y * buttonA.x - buttonB.x * buttonA.y);
    bPressCount = (prize.x - buttonA.x * aPressCount) / buttonB.x;
    if (Number.isInteger(aPressCount) && Number.isInteger(bPressCount)) {
      sum += aPressCount * 3;
      sum += bPressCount;
    }
  });
  console.log(sum);
};

solution();
