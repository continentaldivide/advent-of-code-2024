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

  // iterate over all possible frames; in each frame count number of robots in a diagonal line; produce an image of any frame where at least 100 robots in a diagonal
  for (let i = 0; i < width * height; i++) {
    let output = generateOutput(i);
    let inDiagonal = 0;
    let outputMap = {};
    output.forEach((e) => {
      outputMap[`${e[0]}.${e[1]}`] = true;
    });
    for (let j = 0; j < output.length; j++) {
      const [x, y] = output[j];

      const downRightRobotExists = outputMap[`${x + 1}.${y + 1}`];
      const upLeftRobotExists = outputMap[`${x - 1}.${y - 1}`];
      if (downRightRobotExists && upLeftRobotExists) {
        inDiagonal++;
      }
    }
    if (inDiagonal > 100) {
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
