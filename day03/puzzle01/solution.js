import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let totalSum = 0;
  for (let i = 0; i < data.length; i++) {
    // verify presence of "mul(" and first digit
    const nextFour = data.substring(i, i + 4);
    const fifthNotNum = parseInt(data[i + 4]) === NaN;
    if (nextFour !== "mul(" || fifthNotNum) {
      continue;
    }
    // verify presence of ")" and capture its index
    const chunk = data.substring(i, i + 12);
    let endIndex = 0;
    while (chunk[endIndex] && chunk[endIndex] !== ")") {
      endIndex++;
    }
    if (endIndex === 12) {
      continue;
    }
    // verify no invalid chars between parens
    let invalidChars = false;
    for (let j = 4; j < endIndex; j++) {
      if (!parseInt(chunk[j]) && chunk[j] !== "0" && chunk[j] !== ",") {
        invalidChars = true;
      }
    }
    if (invalidChars) {
      continue;
    }
    // evaluate and sum multiplication operations
    const firstNum = chunk.substring(4, chunk.indexOf(","));
    const secondNum = chunk.substring(chunk.indexOf(",") + 1, endIndex);
    totalSum += firstNum * secondNum;
  }
  console.log(totalSum);
};

solution();
