import './style/main.css'
import { createBubbleSortDriver,createQuickSortDriver  } from './drivers';

    
const playButtonElement = document.getElementById('play-button');
const pauseButtonElement = document.getElementById('pause-button');
const stopButtonElement = document.getElementById('stop-button');
const listLengthInputElement = document.getElementById('list-length');
const animationSpeedInputElement = document.getElementById('animation-speed');
const ele=document.getElementById('elements').value
const dataList = ele.split(',').map(Number);



const driver = createBubbleSortDriver();

driver.onSortCompleted(() => {
  pauseButtonElement.disabled = true;
})

playButtonElement.addEventListener('click', (e) => {
  e.currentTarget.disabled = true;
  pauseButtonElement.disabled = false;
  stopButtonElement.disabled = false;

  driver.play({
    listLength: parseInt(listLengthInputElement.value),
    animationSpeed: parseInt(animationSpeedInputElement.value)
  });
});

stopButtonElement.addEventListener('click', (e) => {
  e.currentTarget.disabled = true;
  playButtonElement.disabled = false;
  pauseButtonElement.disabled = true;

  driver.stop();
});

pauseButtonElement.addEventListener('click', (e) => {
  e.currentTarget.disabled = true;
  playButtonElement.disabled = false;
  stopButtonElement.disabled = false;

  driver.pause();
});
