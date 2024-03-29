/**
 * @param {Array<number>} 
 * @param {import('../drivers/bubble-sort').DriverSettings} 
 * @returns {SVGAElement} 
 */
function createDOMElements(dataList, settings) {
    const { barWidth, barSpacing, textOffset, maxBarHeight } = settings;
    const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
   
    svgContainer.style.width = dataList.length * (barWidth + barSpacing);
    svgContainer.style.height = maxBarHeight + textOffset;

    for (let i = 0; i < dataList.length; i++) {
      const barHeight = dataList[i];
      const coordinateX = i * (barWidth + barSpacing);
      const coordinateY = maxBarHeight - barHeight;
  
      const svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      svgRect.setAttribute('y', coordinateY);
      svgRect.setAttribute('rx', '0.3rem');
      svgRect.setAttribute('width', barWidth);
      svgRect.setAttribute('height', barHeight);
  
      const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      svgText.setAttribute('x', barWidth/2);
      svgText.setAttribute('y', maxBarHeight + textOffset);
      svgText.textContent = `${barHeight}`;
  
      const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      svgGroup.setAttribute('class', 'bar')
      svgGroup.setAttribute('data-index', i)
      svgGroup.setAttribute('transform', `translate(${coordinateX} 0)`);
      svgGroup.appendChild(svgRect)
      svgGroup.appendChild(svgText)
      svgContainer.appendChild(svgGroup);
    }
  
    return svgContainer;
  }
  
  export default createDOMElements;
  