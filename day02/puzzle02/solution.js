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
    let dangerIndex = null;
    const isIncreasing = report[1] - report[0] > 0;
    for (let i = 0; i < report.length - 1; i++) {
      const difference = report[i] - report[i + 1];
      const unsafeDiff = difference === 0 || Math.abs(difference) > 3;
      const unsafeDirection = difference > 0 === isIncreasing;
      if (unsafeDiff || unsafeDirection) {
        isSafe = false;
        dangerIndex = i;
        break;
      }
    }
    const checkReportSafety = (report) => {
      const isIncreasing = report[1] - report[0] > 0;
      for (let i = 0; i < report.length - 1; i++) {
        const difference = report[i] - report[i + 1];
        const unsafeDiff = difference === 0 || Math.abs(difference) > 3;
        const unsafeDirection = difference > 0 === isIncreasing;
        if (unsafeDiff || unsafeDirection) {
          return false;
        }
      }
      return true;
    };
    if (dangerIndex) {
      console.log(report, dangerIndex);
      const firstSubReport = report.toSpliced(dangerIndex, 1);
      const secondSubReport = report.toSpliced(dangerIndex + 1, 1);
      const firstReportSafe = checkReportSafety(firstSubReport);
      const secondReportSafe = checkReportSafety(secondSubReport);
      if (dangerIndex < 2) {
        if (
          checkReportSafety(report.toSpliced(1, 1)) ||
          checkReportSafety(report.toSpliced(1, 1))
        ) {
          isSafe = true;
        }
      }
      if (firstReportSafe || secondReportSafe) {
        isSafe = true;
      }
      // check if safe when removing left of "danger pair"
      // check if safe when removing right of "danger pair"
      // if either case safe, report is safe
    }

    if (isSafe) {
      safeReports++;
    }
  });
  console.log(safeReports);
};

solution();
