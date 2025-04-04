import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let dataArray = data.split(/\r\n|\r|\n/);
  const input = dataArray.map((line) => {
    const [p, v] = line.split(" ").map((element) =>
      element
        .slice(2)
        .split(",")
        .map((num) => parseInt(num))
    );
    return { p, v };
  });
  const [width, height] = [101, 103];
  const output = input.map((robot) => {
    let x = 100 * robot.v[0] + robot.p[0];
    let y = 100 * robot.v[1] + robot.p[1];
    let fixNum = (num, dimension) => {
      num = num % dimension;
      if (num === 0) {
        return 0;
      }
      if (num <= 0) {
        return num + dimension;
      }
      return num;
    };
    x = fixNum(x, width);
    y = fixNum(y, height);
    return [x, y];
  });
  let [q1, q2, q3, q4] = [0, 0, 0, 0];
  output.forEach((robot) => {
    const [x, y] = robot;
    let midCol = Math.floor(width / 2);
    let midRow = Math.floor(height / 2);
    if (x === midCol || y === midRow) {
      return;
    }
    if (x > midCol && y > midRow) {
      q1++;
    }
    if (x < midCol && y > midRow) {
      q2++;
    }
    if (x > midCol && y < midRow) {
      q3++;
    }
    if (x < midCol && y < midRow) {
      q4++;
    }
  });
  console.log(q1 * q2 * q3 * q4);
};

solution();
