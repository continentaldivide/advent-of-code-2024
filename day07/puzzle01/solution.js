/*
parse input as array of objs
[ { testValue: 190; operands: [10,19] }, ... ]

let totalCalibrationResult = 0

  for each (equation)
    work through operands array.  mult and add first two nums, save both results.  mult and add next num by each result, save all four results.  continue pattern until reaching end of array.  final output = all possible outcomes.

    if outcomes includes equation.testValue, totalCalibrationResult += equation.testValue
*/

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(/\r\n|\r|\n/);
  const equations = dataArray.map((line) => {
    const [testValue, nums] = line.split(": ");
    const numsArray = nums.split(" ");
    const operands = numsArray.map((number) => parseInt(number));
    return { testValue: parseInt(testValue), operands };
  });

  let totalCalibrationResult = 0;

  equations.forEach((equation) => {
    let results = [
      equation.operands[0] * equation.operands[1],
      equation.operands[0] + equation.operands[1],
    ];
    let newResults = [];
    for (let i = 2; i < equation.operands.length; i++) {
      newResults = [];
      results.forEach((result) => {
        newResults.push(result * equation.operands[i]);
        newResults.push(result + equation.operands[i]);
      });
      results = newResults;
    }
    if (results.includes(equation.testValue)) {
      totalCalibrationResult += equation.testValue;
    }
  });
  console.log(totalCalibrationResult);
};

solution();
