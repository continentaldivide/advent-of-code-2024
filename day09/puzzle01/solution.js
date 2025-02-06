/*
count chars and identify if last char is file or space
set up two pointers: next free space and last data
while left pointer is left of right pointer
- if left pointer on data, concat data to new string
- if left pointer on free space
- while num at left pointer > 0
- - concat data from right pointer to new string
- - decrement num at left pointer, decrement num of data at right pointer
 */

import { promises as fs } from "fs";

const solution = async () => {
  const data = await fs.readFile("./input.txt", "utf8");
  let checksumArray = [];
  let leftIndex = 0;
  let lastFileIndex = data.length - 1;
  let fileBlocksCount = data[lastFileIndex];

  // ========================================================
  // CONDENSE FILE BLOCKS / BUILD ARRAY TO EVALUATE CHECKSUM
  // ========================================================
  while (leftIndex < lastFileIndex) {
    // if left index pointing to a file, "unpack" its blocks by ID into new array
    if (leftIndex % 2 === 0) {
      let fileId = leftIndex / 2;
      for (let i = 0; i < data[leftIndex]; i++) {
        checksumArray.push(fileId);
      }
    }
    // if left index pointing to a space, fill each space block with data from right side
    if (leftIndex % 2 === 1) {
      let availableSpace = parseInt(data[leftIndex]);
      while (availableSpace > 0) {
        let fileId = Math.floor(lastFileIndex / 2);
        checksumArray.push(fileId);
        fileBlocksCount--;
        availableSpace--;
        if (fileBlocksCount === 0) {
          lastFileIndex -= 2;
          // below conditional avoids the case where indices were already directly adjacent, then LFI jumps under LI, "restocks" fileBlocksCount, and incorrectly adds a bunch of extra blocks in the final while condition
          if (lastFileIndex > leftIndex) {
            fileBlocksCount = data[lastFileIndex];
          }
        }
      }
    }
    leftIndex++;
  }

  // add remaining blocks to array if indices meet while final file still > 0 blocks
  while (fileBlocksCount > 0) {
    // have to recheck the fileId here.  this really tripped me up for a bit -- initially I was assuming that there was a not-fully-unpacked file at the right pointer, so I was just checking the value of the last thing in the checksum array and pushing more of that.  but, it can be the case that in the final move of the pointers, the right pointer reaches a fresh file that has to be unpacked onto the end of the array, in which case you'll need a different fileId.
    let fileId = Math.floor(lastFileIndex / 2);
    checksumArray.push(fileId);
    fileBlocksCount--;
  }
  // =================
  // EVALUATE CHECKSUM
  // =================
  let sum = 0;
  for (let i = 0; i < checksumArray.length; i++) {
    sum += i * checksumArray[i];
  }
  console.log(sum);
};

solution();
