/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }
  if (!size) {
    return string;
  }

  let arrString = string.split('');
  let prev = arrString[0];
  const arr = [prev];
  let count = 1;

  for (let i = 1; i <= arrString.length; i++) {
    if (arrString[i] === prev) {
      if (count < size) {
        arr.push(arrString[i]);
        count++;
      } else {
        continue;
      }
    } else if (arrString[i] !== prev) {
      arr.push(arrString[i]);
      count = 1;
    }
    prev = arrString[i]; 
  }
  return arr.join('');  
}
