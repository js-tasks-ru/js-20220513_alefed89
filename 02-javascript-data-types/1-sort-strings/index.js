/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sorted = JSON.parse(JSON.stringify(arr));
  if (param === 'asc') {
    return sorted.sort((a, b) => a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper'}));
  } else if (param === 'desc') {
    return sorted.sort((a, b) => b.localeCompare(a, ['ru', 'en'], { caseFirst: 'lower'}));
  }
}
