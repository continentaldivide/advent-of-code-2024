import { promises as fs } from "fs";

const solution = async () => {
  let similarityScore = 0;

  // get sorted lists
  const data = await fs.readFile("./input.txt", "utf8");
  const dataArray = data.split(/\r\n|\r|\n/);
  const [left, right] = [[], []];
  dataArray.forEach((line) => {
    left.push(parseInt(line.slice(0, 5)));
    right.push(parseInt(line.slice(-5)));
  });
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  //   traverse lists
  let rightIndex = 0;
  for (let i = 0; i < left.length; i++) {
    let occurrences = 0;
    while (right[rightIndex] <= left[i]) {
      if (left[i] === right[rightIndex]) {
        occurrences++;
      }
      rightIndex++;
    }
    similarityScore += left[i] * occurrences;
  }

  console.log(similarityScore);
};

solution();
