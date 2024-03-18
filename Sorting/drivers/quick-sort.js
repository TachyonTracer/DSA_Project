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

  function quickSort(list, low, high) {
    if (low < high) {
      const pi = partition(list, low, high);
      quickSort(list, low, pi - 1);
      quickSort(list, pi + 1, high);
  
      // Update DOM elements here
      const svgElements = Array.from(getPlayerSvgContainer().children);
      for (let i = low; i <= pi; i++) {
        svgElements[i].classList.add('sorted'); // Mark elements as sorted on the left side of pivot
      }
      for (let i = pi + 1; i <= high; i++) {
        svgElements[i].classList.remove('current'); // Remove current highlighting after partition
      }
    }
  }
  
  function performSwap(leftIndex, rightIndex) {
    const svgElements = Array.from(getPlayerSvgContainer().children);
    const leftElement = svgElements[leftIndex];
    const rightElement = svgElements[rightIndex];
  
    // Swap element positions visually
    const leftTransform = leftElement.getAttribute('transform');
    leftElement.setAttribute('transform', rightElement.getAttribute('transform'));
    rightElement.setAttribute('transform', leftTransform);
  
    // Swap data-index attributes for proper visual representation
    const leftIndexValue = leftElement.getAttribute('data-index');
    leftElement.setAttribute('data-index', rightIndex);
    rightElement.setAttribute('data-index', leftIndexValue);
  }
  
  function partition(list, low, high) {
    let pivot = list[high];
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
      if (list[j] <= pivot) {
        i++;
        performSwap(i, j); // Swap elements visually during partition
      }
    }
    performSwap(i + 1, high); // Move pivot to its final sorted position
    return i + 1;
  }
}
export default driver;