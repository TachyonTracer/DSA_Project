import { createData, createDOMElements } from '../utils';

/**
 * @typedef {object} DriverSettings 
 * @prop {number} 
 * @prop {number} 
 * @prop {number} 
 * @prop {number} 
 * @prop {number} 
 * @prop {number} 
 */

/**
 * @typedef {object} DriverState -
 * @prop {HTMLDivElement}
 * @prop {any} 
 * @prop {Array<number>} 
 * @prop {boolean} 
 * @prop {number} 
 * @prop {number} 
 * @prop {Array<function>}
 */
function driver() {
  /** @type {DriverSettings} */
  let settings = {
    maxBarHeight: 200,
    barWidth: 30,
    barSpacing: 5,
    textOffset: 20,
    animationSpeed: 300,
    listLength: 10,
  };

  /** @type {DriverState} **/
  let playerState = {
    playerElement: document.getElementById('player-wrapper'),
    timerId: null,
    onSortCompletedSubscribers: [],
  };

  playerState.playerElement.style.height = `${settings.maxBarHeight + 150}px`;
  playerState.playerElement.innerHTML = '<p>Press "Play" button to start</p>';

  /**
   * @returns {SVGAElement} 
   */
  function getPlayerSvgContainer() {
    let svgContainer = playerState.playerElement.querySelector('svg');
    if (svgContainer === null) {
      svgContainer = createDOMElements(playerState.list, settings);
      playerState.playerElement.innerHTML = '';
      playerState.playerElement.append(svgContainer);
    }
    return svgContainer;
  }

  /**
   * @param {SVGElement} 
   */
  function adjustHorizontalScroll(svgContainer) {
    const playerWrapperWidth = playerState.playerElement.clientWidth;
    const svgContainerWidth = svgContainer.clientWidth;

    if (playerWrapperWidth > svgContainerWidth) {
      playerState.playerElement.classList.remove('scroll-x');
    } else {
      playerState.playerElement.classList.add('scroll-x');
    }
  }
/**
 * @param {Array<SVGElement>} svgElements
 * @param {number} start
 * @param {number} end
 * @returns {number}
 */
function partition(svgElements, start, end) {
  const { list } = playerState;
  const pivotValue = list[end];
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (list[i] < pivotValue) {
      [list[i], list[pivotIndex]] = [list[pivotIndex], list[i]];
      swapElements(svgElements[i], svgElements[pivotIndex]);
      pivotIndex++;
    }
  }
  [list[pivotIndex], list[end]] = [list[end], list[pivotIndex]];
  swapElements(svgElements[pivotIndex], svgElements[end]);
  return pivotIndex;
}

/**
 * Swaps two SVG elements by updating their attributes.
 * @param {SVGElement} a
 * @param {SVGElement} b
 */
function swapElements(a, b) {
  const aIndex = Number(a.getAttribute('data-index'));
  const bIndex = Number(b.getAttribute('data-index'));
  const temp = a.getAttribute('transform');
  a.setAttribute('transform', b.getAttribute('transform'));
  b.setAttribute('transform', temp);
  a.setAttribute('data-index', bIndex);
  b.setAttribute('data-index', aIndex);
}

/**
 * The main function that implements QuickSort.
 * @param {Array<SVGElement>} svgElements
 * @param {number} start
 * @param {number} end
 */
function quickSort(svgElements, start, end) {
  if (start >= end) {
    return;
  }
  const index = partition(svgElements, start, end);
  quickSort(svgElements, start, index - 1);
  quickSort(svgElements, index + 1, end);
}

// Visualization functions
function startQuickSort() {
  const svgContainer = getPlayerSvgContainer();
  /** @type {Array<SVGElement>} */
  const elementsToSort = Array.from(svgContainer.children);
  quickSort(elementsToSort, 0, elementsToSort.length - 1);
}

// Add this to your player object
return {
  // ... other methods
  quickSortPlay() {
    startQuickSort();
  }
};

}
export default driver;