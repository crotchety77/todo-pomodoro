const dom = {
  new: document.getElementById('new'),
  add: document.getElementById('add'),
  list: document.getElementById('list'),
  listcomplete: document.getElementById('list-complete'),
  liststar: document.getElementById('list-star'),
  timer: document.getElementById('timer'),
  settings: document.getElementById('settings'),
  popup: document.getElementById('popup'),
  popupSettings: document.getElementById('popupSettings'),
  close_popup: document.getElementById('close-popup'),
  close_popupSettings: document.getElementById('close-popupSettings'),
  button_back:document.getElementById('button_back'),
  button_next:document.getElementById('button_next'),
  button_play:document.getElementById('button_play'),
  time_next:document.getElementById('time_next'),
  countTime:document.getElementById('countTime')
}
let tasks = [] // Массив задач
let completedTasks = [] // Массив выполненных задач, которые выводятся ниже
let starTasks = [] // Избранные заметки
let time = [1500, 300, 1500, 300, 1500, 300, 1500, 300, 1800];

// Из локал стораджа достаём списки
if (localStorage.getItem('tasks') || (localStorage.getItem('completedTasks'))){

  starTasks = JSON.parse(localStorage.getItem('starTasks'));
  tasks = JSON.parse(localStorage.getItem('tasks'));
  completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

  tasksRender(starTasks);
  tasksRender(tasks);
  tasksRender(completedTasks);

}

// Отслеживаем Enter при заполнении задачи
function enter(text){
  if(event.key === 'Enter'){
    const task = dom.new.value;
    if (task) {
      addTask(task, tasks);
      tasksRender(tasks);
      dom.new.value = '';
    }
  }
}

// Отслеживаем клик по кнопке добавить
dom.add.onclick = () => {
  const task = dom.new.value;
  if (task) {
    addTask(task, tasks);
    tasksRender(tasks);
    dom.new.value = '';
  }
}

//Функция добавления задачи
function addTask(text, array) {
  // Создание уникального ID
  const timestamp = Date.now();
  let task = {
    id: timestamp,
    text,
    isComplete: false,
    isStar: false
  }
  if (array == completedTasks){
    task.isComplete = true;
  }
  if (array == starTasks){
    task.isStar = true;
  }
  //Добавление задачи в массив
  array.push(task);

}

// Отрисовывание задач из массива задач
function tasksRender(array){
  let htmlList = ''; 

  array.forEach((task) => {
    const cls = task.isComplete 
      ? 'todo__task todo__task-completed' 
      : 'todo__task';
    const checked = task.isComplete ? 'checked' : '';
    const starChecked = task.isStar ? 'star-active' : '';
    // if (array == starTasks){
    //   let activeStar = "123";
    // }
    const htmlTask = `
    <div id="${task.id}" class="${cls}">
      <label class="todo__checkbox">
        <input type="checkbox" ${checked}>
        <div class="todo__checkbox-label"></div>
      </label>
      <div id="text-id" class="todo__task-text"> 
        ${task.text}
      </div>
      
      <div class="todo__task-star ${starChecked}">
        <img src="/icons/icon_star1.svg" alt="#" class="todo__pomodoro-icon icon-star">
      </div>

      <div class="todo__task-del">
        x
      </div>



    </div>
    `
    htmlList = htmlTask + htmlList;
  })
  if (array == tasks){
    dom.list.innerHTML = htmlList;
  }
  if (array == starTasks){
    dom.liststar.innerHTML = htmlList;
  }
  if (array == completedTasks) {
    dom.listcomplete.innerHTML = htmlList;
  }

  saveToLocalStorage();  
}

// POPUP POMADORO TIMER
dom.timer.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('todo__pomodoro-icon')) {

    if (popup.className == "popup popup-open"){
      popup.className = "popup";
      return;
    }
    // Список закрывающихся других попапов при открытии этого
    popupSettings.className = "popup";
    //
    popup.className = "popup popup-open";

  }
}
dom.close_popup.onclick = (event) =>{
  const target = event.target;
  if (target.classList.contains('popup__close')) {

    popup.className = "popup";

  }
}
// POPUP SETTINGS
dom.settings.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('todo__pomodoro-icon')) {
    if (popupSettings.className == "popup popup-open"){
      popupSettings.className = "popup";
      return;
    }
    // Список закрывающихся других попапов при открытии этого
    popup.className = "popup";
    popupSettings.className = "popup popup-open";
  }
}
dom.close_popupSettings.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('popup__close')) {

    popupSettings.className = "popup";

  }
}
// Считывание ивентов с листа
dom.list.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('todo__checkbox-label')) {
    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');

    const text = target.parentElement.nextElementSibling.innerHTML; 

    // changeTaskStatus(taskID, tasks);
    
    deleteTask(taskID, tasks);
    addTask(text, completedTasks);

    tasksRender(completedTasks);
    tasksRender(tasks);

  }
  // Добавление избранных задач в первый список
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    console.log(task);
    const taskID = task.getAttribute('id');
    console.log(taskID);
    deleteTask(taskID, tasks);
    tasksRender(tasks);
    // tasksRender(completedTasks);
    // console.log(length(tasks));
  }
  if (target.classList.contains('icon-star')){
    // console.log('123');
    const task = target.parentElement.parentElement;
    console.log(task);
    const taskID = task.getAttribute('id');
    const text = target.parentElement.previousElementSibling.innerHTML; 

    changeTaskStarStatus(taskID, tasks);
    // console.log(text);
    deleteTask(taskID, tasks);
    console.log(taskID);
    console.log(123);
    addTask(text, starTasks);

    tasksRender(tasks);
    tasksRender(starTasks);

    // tasksRender(completedTasks);
    // console.log(length(tasks));
  }
  // два раза надо подняться, чтобы получить id таска, который зачеркнём

  // console.log(target);
}

dom.listcomplete.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    const taskID = task.getAttribute('id');
    deleteTask(taskID, completedTasks);
    tasksRender(completedTasks);
    // tasksRender(completedTasks);
    // console.log(length(tasks));
  }
  // два раза надо подняться, чтобы получить id таска, который зачеркнём

  // console.log(target);
}
dom.liststar.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    const taskID = task.getAttribute('id');
    deleteTask(taskID, starTasks);
    tasksRender(starTasks);
    // tasksRender(completedTasks);
    // console.log(length(tasks));
  }
  // два раза надо подняться, чтобы получить id таска, который зачеркнём

  // console.log(target);
  if (target.classList.contains('icon-star')){
    // console.log('123');
    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');
    const text = target.parentElement.previousElementSibling.innerHTML; 

    // console.log(text);
    deleteTask(taskID, starTasks);

    addTask(text, tasks);

    tasksRender(tasks);
    tasksRender(starTasks);

    // tasksRender(completedTasks);
    // console.log(length(tasks));
  }
}


// Зачеркивание текста
// function changeTaskStatus(id, array){
//   array.forEach((task) => {
//     if (task.id == id){
//       // task.isComplete = !task.isComplete;

//       // task.isComplete = status;
//     }
//   });
// }

function changeTaskStarStatus(id, array){
  array.forEach((task) => {
    console.log(task.id, id);
    if (task.id == id){
      task.isStar = !task.isStar;

      // task.isComplete = status;
    }
  });
}

// Удаление задачи
function deleteTask(id, array){
  array.forEach((task, indexArray) => {
    if (task.id == id){
      array.splice(indexArray, 1);
      // delete array[indexArray];
    }    
  });
}

// function movingCompletedTasks(id, array){
//   array.forEach((task, indexArray) => {
//     if ((task.id == id) && (task.isComplete == true)){
//       let last = 0;
//       let saveID = task.id;
//       let saveText = task.text;
//       let saveChecked = task.isComplete;
//       // console.log(saveID, saveText, saveChecked);
//       // let reversed = array.reverse();
//       console.log(indexArray, array[0].id, array[0].text, array[0].isComplete);
//       // reversed = array.reverse();
//       task.id = array[last].id;
//       task.text = array[last].text;
//       task.isComplete = array[last].isComplete;
//       array[last].id = saveID;
//       array[last].text = saveText;
//       array[last].isComplete = saveChecked;
//       last = indexArray+1;
//       // delete array[indexArray];
//     } 
//   });
// }

// Сохранение списка дел в localstorage
function saveToLocalStorage(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('starTasks', JSON.stringify(starTasks));
}
//

// let circularProgress = document.querySelector('.circular-progress');
// let progressValue = document.querySelector('.progress-value');
// let interval;

// let timeoutID = null;

// function start(){
//   if (timeoutID){
//     return;
//   }
//   const mtime = 1500;
//   const run = () =>{
//     const time = -mtime
//   }
// }

// dom.button_play.addEventListener('click', () =>{

//   // let progressStartValueMinute = Math.floor(progressStartValue / 60);
//   // let progressStartValueSecond = progressStartValue % 60;

//   let progressStartValue = 1500;
//   clearInterval(interval);
//   setInterval(start, 1000, progressStartValue);
//   console.log(111);
// });

// function start(progressStartValue){
//   // let progressStartValue = 1500;
//   console.log(progressStartValue);
//   if (progressStartValue > 0) {
//     progressStartValue--;
//     console.log(progressStartValue);
//   }


  // let progressStartValueMinute = Math.floor(progressStartValue / 60);
  // let progressStartValueSecond = progressStartValue % 60;
  // progressValue.textContent = `${progressStartValueMinute}:${progressStartValueSecond}`;
  // circularProgress.style.background = `conic-gradient(purple ${progressStartValue * 0.24}deg, #ededed 1deg)`;
//

let circularProgress = document.querySelector('.circular-progress');
let progressValue = document.querySelector('.progress-value');

function startPomadoro(value, timeArrayValue){
  let inter;
  let progressStartValue = value;
  // let progressStartValueMinute = 24;
  //     progressStartValueSecond = "59";
  // 100 => 100*3.6deg = 360
  // 1500 => 1500*0.24deg
  // 300
  let progressEndValue = 0;
  let speed = 1000; // скорость 1 секунда
  let deg; // градусы отклонения для радиального таймера
  let color;
  if (timeArrayValue == 1500){
    deg = 0.24;
    color = 'red';
  }
  if (timeArrayValue == 300){
    deg = 1.2;
    color = 'green';
  }
  if (timeArrayValue == 1800){
    deg = 0.2;
    color = 'blue';
  }
  let deg25;
  let deg5;
  let deg30;

  inter = setInterval(() =>{
    progressStartValue--;
    let progressStartValueMinute = Math.floor(progressStartValue / 60);
    let progressStartValueSecond = progressStartValue % 60;
    progressValue.textContent = `${progressStartValueMinute}:${progressStartValueSecond}`;
    // progressValue = `123`;
    circularProgress.style.background = `conic-gradient(${color} ${progressStartValue * deg}deg, #ededed 1deg)`;

    // console.log(progressStartValue, progress*2);
    // console.log(progress);
  }, speed);
  return inter;
}
let intervalID;
let timeArray = [1500, 300, 1500, 300, 1500, 300, 1500, 300, 1800];
let cnt = 0; // проходить будем по массиву

let timeCurrent = timeArray[cnt];



dom.button_play.onclick = (event) => {
  const target = event.target;
  // console.log(target);
  if (target.classList.contains('icon-play')){
    // console.log(target);
    // снести icon-play и поставить icon pause
    // изменить адресс svg
    button_play.src = "/icons/icon_pause.svg";
    button_play.classList = "todo__pomodoro-icon icon-pause";
    // if ()
    intervalID = startPomadoro(timeCurrent, timeArray[cnt]);
    console.log(timeArray[cnt]);
    // console.log(123); 
    // (target.classList.contains('icon-pause'))
  }
  else if (target.classList.contains('icon-pause')){
    // console.log('хочу запаузить', intervalID);
    button_play.src = "/icons/icon_play.svg";
    button_play.classList = "todo__pomodoro-icon icon-play";
    // console.log(intervalID);
    clearInterval(intervalID);
    let timeRemaining = progressValue.textContent;
    let numbers = timeRemaining.split(':');
    let minute = numbers[0];
    let seconds = numbers[1];
    console.log(numbers);
    console.log(numbers[0], numbers[1]);
    timeCurrent = Number(minute)*60 + Number(seconds);
  }
  // console.log(intervalID);
}
dom.button_next.onclick = (event) => {
  clearInterval(intervalID);
  const target = event.target;
  if (target.classList.contains('icon-next')){
    if (cnt < 8){
    cnt++;
    if (cnt < 1) dom.countTime.textContent = `1/4`;
    if ((2 <= cnt) && cnt < 3) dom.countTime.textContent = `2/4`;
    if ((4 <= cnt) && cnt < 5) dom.countTime.textContent = `3/4`;    
    if ((6 <= cnt) && cnt < 8) dom.countTime.textContent = `4/4`;
    }
    else{
      cnt = 0;
      dom.countTime.textContent = `1/4`;
    }
    console.log(cnt);
    timeCurrent = timeArray[cnt];

    button_play.src = "/icons/icon_play.svg";
    button_play.classList = "todo__pomodoro-icon icon-play";
    // console.log(intervalID);
    clearInterval(intervalID);
    if (timeCurrent == 1500){
      circularProgress.style.background = `conic-gradient(red 360deg, #ededed 1deg)`;
      time_next.textContent= "25:00";
    }
    if (timeCurrent == 300){
      circularProgress.style.background = `conic-gradient(green 360deg, #ededed 1deg)`;
      time_next.textContent= "5:00";
    }    
    if (timeCurrent == 1800){
      circularProgress.style.background = `conic-gradient(blue 360deg, #ededed 1deg)`;
      time_next.textContent = "30:00";
    }

    console.log(timeCurrent);
  }


}
dom.button_back.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('icon-reverse')){
    
    timeCurrent = timeArray[cnt];

    button_play.src = "/icons/icon_play.svg";
    button_play.classList = "todo__pomodoro-icon icon-play";
    // console.log(intervalID);
    clearInterval(intervalID);

    if (timeCurrent == 1500){
      circularProgress.style.background = `conic-gradient(red 360deg, #ededed 1deg)`;
      time_next.textContent= "25:00";
    }
    if (timeCurrent == 300){
      circularProgress.style.background = `conic-gradient(green 360deg, #ededed 1deg)`;
      time_next.textContent= "5:00";
    }    
    if (timeCurrent == 1800){
      circularProgress.style.background = `conic-gradient(blue 360deg, #ededed 1deg)`;
      time_next.textContent = "30:00";
    }
  }
  // надо нажать паузу
}