/**
 * 平铺数组
 * 1.n为正数则平铺n次
 * 2.不传n则全部平铺
 * 3.其他情况则不平铺
 * @param {Array} array 
 * @param {number} n
 */
function flat(array, n) {
  if (n > 0 || isNaN(n)) {
    return array.reduce((result, item) => {
      return result.concat(Array.isArray(item) ? flat(item, n - 1) : item)
    }, [])
  }
  
  return array
}
