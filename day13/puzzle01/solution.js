import { promises as fs } from "fs";

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
    console.log(keyNums);
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
  console.log(machineData);
};

solution();
