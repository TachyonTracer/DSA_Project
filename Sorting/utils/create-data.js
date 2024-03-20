/**
 *
 *
 * @param {number} 
 * @param {number} 
 * @returns {Array<number>}
 
*/
  function createData(length = 15, maxNumber = 200) {
    
      return Array.from(
      { length },
      () => Math.round(Math.random() * maxNumber),
    );
  
}
createData()
console.log([createData])
  export default createData;
  