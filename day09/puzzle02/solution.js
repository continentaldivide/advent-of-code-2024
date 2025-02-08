/*
use string to reorganize data: array of objs, each obj has properties isSpace: bool; size: int
iterate backwards over data obj.  for every item:
  - if (isSpace) continue
  - iterate through spaces, up to i
    - if space at j >= file at i
      - move file at i to j (this might fuck up pointers -- update pointers?)
      - update space at j(+1) to reduce its size by size of moved file
editorial note: ran into some issues with obviously incomplete pseudocoded solution, but worked them out on the fly -- didn't bother to come back and make the pseudocode right too
 */

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");

  // ==============================
  // BUILD ARRAY TO REORGANIZE DATA
  // ==============================
  const inputArray = [];
  for (let i = 0; i < data.length; i++) {
    let tempObj = { isSpace: false, size: parseInt(data[i]), fileId: 0 };
    if (i % 2 === 1) {
      tempObj.isSpace = true;
    }
    if (i % 2 === 0) {
      tempObj.fileId = Math.floor(i / 2);
    }
    inputArray.push(tempObj);
  }

  // ==========
  // MOVE FILES
  // ==========
  // work backward from end of array and look at each file
  for (let i = inputArray.length - 1; i >= 0; i--) {
    if (inputArray[i].isSpace) {
      continue;
    }
    // work forward from start of array and look at each space
    for (let j = 0; j < i; j++) {
      if (!inputArray[j].isSpace) {
        continue;
      }
      if (inputArray[j].size >= inputArray[i].size) {
        inputArray[j].size -= inputArray[i].size;
        let [tempFile] = inputArray.splice(i, 1);
        let tempSpace = { isSpace: true, size: tempFile.size, fileId: 0 };
        inputArray.splice(j, 0, tempFile);
        inputArray.splice(i, 0, tempSpace);
        break;
      }
    }
  }

  // =================
  // EVALUATE CHECKSUM
  // =================
  let sum = 0;
  let blockIndex = 0;
  for (let i = 0; i < inputArray.length; i++) {
    for (let j = inputArray[i].size; j > 0; j--) {
      sum += blockIndex * inputArray[i].fileId;
      blockIndex++;
    }
  }
  console.log(sum);
};

solution();
