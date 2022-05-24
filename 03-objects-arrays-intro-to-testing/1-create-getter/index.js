/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split('.');
  return function getter(obj) {
    if (obj.hasOwnProperty(arr[0])) {
      if (obj[arr[0]] !== Object(obj[arr[0]])) {
        return obj[arr[0]];
      } else {
        const prop = arr.splice(0, 1);
        return getter(obj[prop]);
      }
    } else {
      return;
    }
  };
}
