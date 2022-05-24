/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (!arr || !arr.length) {
    return [];
  }
  const uniqArr = [];
  for (const value of new Set(arr)) {
    uniqArr.push(value);
  }
  //   for (const value of arr) {
  //     if (!uniqArr.includes(value)) {
  //       uniqArr.push(value);
  //     }
  //   }
    
  return uniqArr;
}
