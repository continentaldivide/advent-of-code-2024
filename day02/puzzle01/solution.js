import { promises as fs } from "fs";

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
  reports.forEach((report) => {
    let isSafe = true;
    const isIncreasing = report[1] - report[0] > 0;
    for (let i = 0; i < report.length - 1; i++) {
      const difference = report[i] - report[i + 1];
      const unsafeDiff = difference === 0 || Math.abs(difference) > 3;
      const unsafeDirection = difference > 0 === isIncreasing;
      if (unsafeDiff || unsafeDirection) {
        isSafe = false;
        break;
      }
    }
    if (isSafe) {
      safeReports++;
    }
  });
  console.log(safeReports);
};

solution();
