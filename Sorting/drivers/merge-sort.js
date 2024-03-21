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
  /** @type {DriverSettings}  */
  let settings = {
    maxBarHeight: 200,
    barWidth: 30,
    barSpacing: 5,
    textOffset: 20,
    animationSpeed: 300,
    listLength: 10,
  }
  
  /** @type {DriverState}  */
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
      playerState.playerElement.classList.remove('scroll-x')
    } else {
      playerState.playerElement.classList.add('scroll-x')
    }
  }

  /**
   * @param {SVGElement} 
   */
  function getBubbleSortElements(svgElements) {
    const { loopIndex } = playerState;

    const leftElement = svgElements.find(
      element => Number(element.getAttribute('data-index')) === loopIndex
    );
    const rightElement = svgElements.find(
      element => Number(element.getAttribute('data-index')) === loopIndex + 1
    );
    return [leftElement, rightElement];
  }

  /**
   * @param {SVGGElement}  
   * @param {SVGGElement} 
   * @returns {boolean} 
   */
  function performSwapIfNeeded(leftElement, rightElement) {
    const { list, loopIndex } = playerState;

    if (list[loopIndex] <= list[loopIndex + 1]) {
      return false;
    }

    [list[loopIndex], list[loopIndex + 1]] = [list[loopIndex + 1], list[loopIndex]];

    leftElement.setAttribute('transform', `translate(${(loopIndex + 1) * (settings.barWidth + settings.barSpacing)} 0)`);
    rightElement.setAttribute('transform', `translate(${loopIndex * (settings.barWidth + settings.barSpacing)} 0)`);

    leftElement.setAttribute('data-index', loopIndex + 1);
    rightElement.setAttribute('data-index', loopIndex);

    return true;
  }

  function bubbleSort() {
    const { loopIndex, remainingRepetitions } = playerState;
    const svgContainer = getPlayerSvgContainer();
    adjustHorizontalScroll(svgContainer);

    /** @type {Array<SVGElement>} */
    const elementsToSort = Array.from(svgContainer.children);

    
    if (loopIndex >= remainingRepetitions) {
      playerState.onSortCompletedSubscribers.forEach(callback => callback());
      elementsToSort.forEach(element => element.classList.add('swapped'));
      return;
    }

    const [leftElement, rightElement] = getBubbleSortElements(elementsToSort);

    
    leftElement.classList.add('current');
    rightElement.classList.add('current');

   
    if (playerState.pause) {
      return;
    }

    const didSwap = performSwapIfNeeded(leftElement, rightElement);

    
    playerState.timerId = setTimeout(() => {
      playerState.loopIndex++;

      if (playerState.loopIndex >= playerState.remainingRepetitions) {
       
        if (didSwap) {
          leftElement.setAttribute('class', 'bar swapped');
          rightElement.classList.remove('current');
        } else {
          leftElement.classList.remove('current');
          rightElement.setAttribute('class', 'bar swapped');
        }

        playerState.remainingRepetitions--;
        playerState.loopIndex = 0;
      } else {
        
        leftElement.classList.remove('current');
        rightElement.classList.remove('current');
      }

      bubbleSort();
    }, settings.animationSpeed);
  }

  return {
    play(options = {}) {
      if (playerState.pause) {
        playerState.pause = false;
      } else {
        settings = { ...settings, ...options };
    
        const userInputString = document.getElementById('elements').value;
        const dataList = userInputString.split(',').map(Number);
    
        // Decide on data source based on user input presence
        const useUserInput = dataList.length > 0;
        const listLength = useUserInput ? dataList.length : options.listLength;
    
        playerState = {
          ...playerState,
          list: useUserInput ? dataList : createData(listLength, settings.maxBarHeight),
          pause: false,
          loopIndex: 0,
          remainingRepetitions: listLength - 1,
        };
      }
    
      bubbleSort();
    },
    stop() {
      
      clearTimeout(playerState.timerId);
      playerState.pause = false;
      playerState.playerElement.classList.remove('scroll-x');
      playerState.playerElement.innerHTML = '<p>Press "Play" button to start</p>';
    },
    pause() {
      
      playerState.pause = true;
    },
    onSortCompleted(callback) {
      playerState.onSortCompletedSubscribers.push(callback);
    }
  }
}

export default driver;
