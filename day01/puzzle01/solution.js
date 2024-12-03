import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  const dataArray = data.split(/\r\n|\r|\n/);
  const [left, right] = [[], []];
  dataArray.forEach((line) => {
    left.push(parseInt(line.slice(0, 5)));
    right.push(parseInt(line.slice(-5)));
  });
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);
  const diff = [];
  left.forEach((num, index) => {
    diff.push(Math.abs(right[index] - num));
  });
  const sum = diff.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
};

solution();
