import { promises as fs } from "fs";

// not super happy with how this one turned out -- on a real project, I'd want to abstract the "report checker" logic into a function and reuse it between the reports and unsafeIndices loops; the WET code here caused me some mistakes.  but, eager to get to new puzzles and don't want to spend more time on this one.

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  const dataArray = data.split(/\r\n|\r|\n/);
  const reports = dataArray.map((line) => {
    let report = line.split(" ").map((level) => {
      return parseInt(level);
    });
    return report;
  });

  let safeReports = 0;
  let unsafeIndices = [];
  reports.forEach((report, i) => {
    let isSafe = true;
    const isIncreasing = report[1] - report[0] > 0;
    for (let j = 0; j < report.length - 1; j++) {
      const difference = report[j] - report[j + 1];
      const unsafeDiff = difference === 0 || Math.abs(difference) > 3;
      const unsafeDirection = difference > 0 === isIncreasing;
      if (unsafeDiff || unsafeDirection) {
        isSafe = false;
        unsafeIndices.push(i);
        break;
      }
    }
    if (isSafe) {
      safeReports++;
    }
  });

  // go back and doublecheck unsafe reports working through each permutation of removing a level
  unsafeIndices.forEach((index) => {
    let report = reports[index];
    for (let j = 0; j < report.length; j++) {
      let possiblySafeReport = report.toSpliced(j, 1);
      let isSafe = true;
      const isIncreasing = possiblySafeReport[1] - possiblySafeReport[0] > 0;
      for (let k = 0; k < possiblySafeReport.length - 1; k++) {
        const difference = possiblySafeReport[k] - possiblySafeReport[k + 1];
        const unsafeDiff = difference === 0 || Math.abs(difference) > 3;
        const unsafeDirection = difference > 0 === isIncreasing;
        if (unsafeDiff || unsafeDirection) {
          isSafe = false;
        }
      }
      if (isSafe) {
        safeReports++;
        break;
      }
    }
  });
  console.log(safeReports);
};

solution();
