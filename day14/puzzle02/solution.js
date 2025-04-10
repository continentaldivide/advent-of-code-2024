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

  // produce robot coords at provided second after initialization
  const generateOutput = (step) => {
    const output = input.map((robot) => {
      let x = step * robot.v[0] + robot.p[0];
      let y = step * robot.v[1] + robot.p[1];
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
    return output;
  };

  let symmetricalFrames = [];

  // iterate over all possible frames; evaluate num of robots in each quad; evaluate diff of left-side count/right-side count; produce an image of any frame where diff = 0
  for (let i = 0; i < width * height; i++) {
    let output = generateOutput(i);

    let [bottomRightCount, bottomLeftCount, topRightCount, topLeftCount] = [
      0, 0, 0, 0,
    ];
    output.forEach((robot) => {
      const [x, y] = robot;
      let midCol = Math.floor(width / 2);
      let midRow = Math.floor(height / 2);
      if (x === midCol || y === midRow) {
        return;
      }
      if (x > midCol && y > midRow) {
        bottomRightCount++;
      }
      if (x < midCol && y > midRow) {
        bottomLeftCount++;
      }
      if (x > midCol && y < midRow) {
        topRightCount++;
      }
      if (x < midCol && y < midRow) {
        topLeftCount++;
      }
    });
    let diff = Math.abs(
      topLeftCount + bottomLeftCount - (topRightCount + bottomRightCount)
    );
    // either I have a bug, or diff === 0 is too strict
    if (diff === 0) {
      symmetricalFrames.push(i);

      const grid = Array.from({ length: height }, () => {
        const line = new Array(width).fill(".");
        line.push("\n");
        return line;
      });
      output.forEach((robot) => {
        const [x, y] = robot;
        grid[y][x] = "*";
      });
      let stringGrid = grid.map((i) => i.join("")).join("");

      await fs
        .access("./frames")
        .then()
        .catch(() => fs.mkdir("./frames"));

      fs.writeFile(`./frames/${i}.txt`, stringGrid, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
  console.log(symmetricalFrames.length);
};

solution();
