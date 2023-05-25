const dom = {
  new: document.getElementById('new'),
  add: document.getElementById('add'),
  list: document.getElementById('list'),
  listcomplete: document.getElementById('list-complete'),
  timer: document.getElementById('timer'),
  popup: document.getElementById('popup'),
  close_popup: document.getElementById('close-popup'),
  button_back:document.getElementById('button_back'),
  button_play:document.getElementById('button_play'),
  button_next:document.getElementById('button_next'),
}
let tasks = [] // Массив задач
let completedTasks = [] // Массив выполненных задач, которые выводятся ниже
let time = [1500, 300, 1500, 300, 1500, 300, 1500, 300, 1800];

// Из локал стораджа достаём списки
if (localStorage.getItem('tasks') || (localStorage.getItem('completedTasks'))){
  tasks = JSON.parse(localStorage.getItem('tasks'));
  completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
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
    isComplete: false
  }
  if (array == completedTasks){
    task.isComplete = true;
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
    
    const htmlTask = `
    <div id="${task.id}" class="${cls}">
      <label class="todo__checkbox">
        <input type="checkbox" ${checked}>
        <div class="todo__checkbox-label"></div>
      </label>
      <div id="text-id" class="todo__task-text"> 
        ${task.text}
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
  else {
    dom.listcomplete.innerHTML = htmlList;
  }
  // Сохранение в локал storage
  saveToLocalStorage();  
  // dom.listcomplete.innerHTML = htmlList;
}

dom.timer.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('todo__pomodoro-icon')) {
    // можно добраться до popup с помощью выхода родителя и некст элемента
    let t = target.parentElement.parentElement.nextElementSibling;
    // можно задать переменную для id
    if (popup.className == "popup popup-open"){
      popup.className = "popup";
      return;
    }
    popup.className = "popup popup-open";
 
    // dom.popup.innerHTML = `<div id="popup" class="popup popup-open">`;
    // console.log(dom.popup);
  }
}
dom.close_popup.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('popup__close')) {

    popup.className = "popup";
    // dom.popup.innerHTML = `<div id="popup" class="popup popup-open">`;
    // console.log(dom.popup);
  }
}
// Считывание ивентов с листа
dom.list.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('todo__checkbox-label')) {
    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');
    // const list = task.parentElement;
    const text = target.parentElement.nextElementSibling.innerHTML; 
    // const textt = text.innerHTML;
    // console.log(text);

    changeTaskStatus(taskID, tasks);
    
    deleteTask(taskID, tasks);
    addTask(text, completedTasks);

    tasksRender(completedTasks);
    // movingCompletedTasks(taskID, tasks);
    tasksRender(tasks);

    // tasksRender(completedTasks);
  }
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    const taskID = task.getAttribute('id');
    deleteTask(taskID, tasks);
    tasksRender(tasks);
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

// Зачеркивание текста
function changeTaskStatus(id, array){
  array.forEach((task) => {
    if (task.id == id){
      task.isComplete = !task.isComplete;

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
}

function startPomadoro(){
  let circularProgress = document.querySelector('.circular-progress');
  let progressValue = document.querySelector('.progress-value');

  let progressStartValue = 1500; //при 8:30 текст каким-то образом корёжит окружность
  // let progressStartValueMinute = 24;
  //     progressStartValueSecond = "59";
  // 100 => 100*3.6deg = 360
  // 1500 => 1500*0.24deg
  // 300
  let progressEndValue = 0;
      speed = 1000; // скорость 1 секунда

  let progress = setInterval(() =>{
    progressStartValue--;
    let progressStartValueMinute = Math.floor(progressStartValue / 60);
    let progressStartValueSecond = progressStartValue % 60;
    progressValue.textContent = `${progressStartValueMinute}:${progressStartValueSecond}`;
    // progressValue = `123`;
    circularProgress.style.background = `conic-gradient(purple ${progressStartValue * 0.24}deg, #ededed 1deg)`;

    // console.log(progressStartValue, progress*2);
  }, speed);
}
dom.button_back.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('icon-reverse')){
    console.log('123');
  }
}
dom.button_play.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('icon-play')){
    // снести icon-play и поставить icon pause
    // изменить адресс svg
    button_play.src = "/icon_pause.svg";
    button_play.classList = "todo__pomodoro-icon icon-pause";
    startPomadoro();
    return;
  }
  if (target.classList.contains('icon-pause')){
    button_play.src = "/icon_play.svg";
    button_play.classList = "todo__pomodoro-icon icon-play";
    return;
  }
}
dom.button_next.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('icon-next')){
    console.log('789');
  }

}