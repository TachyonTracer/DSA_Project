
  function createData(length = 15, maxNumber = 200,) {
    
      return Array.from(
      { length },
      () => Math.round(Math.random() * maxNumber),

    );
      
}


  export default createData;
  