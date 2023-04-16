import { Sorter } from "./interfaces";
const fs = require("fs");
export class DefaultSorter implements Sorter {
  timed_sort(array: number[]): { array: number[]; milliseconds: number } {
    let start = Date.now();
    let temp = this.sort(array);
    let end = Date.now();
    return { array: temp, milliseconds: end - start };
  }
  sort(array: number[]): number[] {
    // TODO: complete the default sort
    var sortedArray: number[] = array.sort((n1,n2) => n1 - n2);
    return sortedArray
  }
  shuffle(array: number[]): number[] {
    // https://stackoverflow.com/a/2450976
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}

export class DefaultSorterTimeLogger extends DefaultSorter {
  override timed_sort(array: number[]): {
    array: number[];
    milliseconds: number;
  } {
    let temp = super.timed_sort(array);
    console.log(temp.milliseconds)
    return temp;
  }
}

export class BubbleSorter extends DefaultSorterTimeLogger {
  //https://rajat-m.medium.com/implement-5-sorting-algorithms-using-javascript-63c5a917e811
  sort(array: number[]): number[] {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
          if (array[j + 1] < array[j]) {
              [array[j + 1], array[j]] = [array[j], array[j + 1]];
          }
      }
  }
  return array;
  }
}

export class QuickSorter extends DefaultSorterTimeLogger {
  //https://rajat-m.medium.com/implement-5-sorting-algorithms-using-javascript-63c5a917e811
  sort(array: number[]): number[] {

    function partition(array: number[], start = 0, end = array.length - 1) {
      // Let's choose the pivot to be the arr[start] element
      let pivot = array[start];
      let swapIdx = start;

      for (let i = start + 1; i <= end; i++) {
        if (array[i] < pivot) {
          swapIdx++;
        
          [array[i], array[swapIdx]] = [array[swapIdx], array[i]];
        }
      }

      [array[swapIdx], array[start]] = [array[start], array[swapIdx]];

      return swapIdx;
    }

    function quickSort(array: number[], left = 0, right = array.length - 1) {

      if (left < right) {
        let pivotIndex = partition(array, left, right);

        quickSort(array, left, pivotIndex - 1);

      
        quickSort(array, pivotIndex + 1, right);
      }
      
      return array;
    }
    return quickSort(array)
  }
}


export class QuickSorterTimeFileDumper extends QuickSorter {
  override timed_sort(array: number[]): {
    array: number[];
    milliseconds: number;
  } {
    let temp = super.timed_sort(array);
    // TODO: log the time to a file. use "./log.txt" as filename
    // make sure that you are logging a string and not a number
    // https://nodejs.dev/en/learn/writing-files-with-nodejs/
    try {
      fs.writeFileSync('./log.txt', temp.milliseconds.toString());
    } catch (err) {
      console.error(err);
    }

    return temp;
  }
}
