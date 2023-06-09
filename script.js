const dom = {
  new: document.getElementById('new'),
  add: document.getElementById('add'),
  save: document.getElementById('save'),
  copy: document.getElementById('copy'),
  noteText: document.getElementById('noteText'),
  list: document.getElementById('list'),
  listcomplete: document.getElementById('list-complete'),
  liststar: document.getElementById('list-star'),
  timer: document.getElementById('timer'),
  settings: document.getElementById('settings'),
  iconLists: document.getElementById('icon-lists'),
  popup: document.getElementById('popup'),
  popupSettings: document.getElementById('popupSettings'),
  popupLists: document.getElementById('popupLists'),
  pNote: document.querySelectorAll('.pNote'),
  close_popup: document.getElementById('close-popup'),
  close_popupSettings: document.getElementById('close-popupSettings'),
  close_popupLists: document.getElementById('close-popupLists'),
  button_back:document.getElementById('button_back'),
  button_next:document.getElementById('button_next'),
  button_play:document.getElementById('button_play'),
  time_next:document.getElementById('time_next'),
  countTime:document.getElementById('countTime'),
  selectHeader:document.querySelectorAll('.select__header'),
  selectCurrent:document.getElementById('select__current'),
  selectBody:document.getElementById('select__body'),
  messageBox:document.getElementById('message-box'),
  boxNotes:document.getElementById('box-notes')
}
let tasks = [] // Массив задач
let completedTasks = [] // Массив выполненных задач, которые выводятся ниже
let starTasks = [] // Избранные заметки
let time = [1500, 300, 1500, 300, 1500, 300, 1500, 300, 1800];
let notes = []; // Массив заметок

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

// Отслеживаем ввод задачи по клику по кнопке добавить
dom.add.onclick = () => {
  const task = dom.new.value;
  if (task) {
    addTask(task, tasks);
    tasksRender(tasks);
    dom.new.value = '';
  }
}
dom.save.onclick = () => {
  let note = noteText.value;
  let current = dom.selectCurrent.innerText;
  if (note){
    // Жмётся пауза, чтобы сохранить значение timeCurrent
    button_play.src = "/icons/icon_play.svg";
    button_play.classList = "todo__pomodoro-icon icon-play";

    clearInterval(intervalID);
    let timeRemaining = progressValue.textContent;
    let numbers = timeRemaining.split(':');
    let minute = numbers[0];
    let seconds = numbers[1];
    console.log(numbers);
    console.log(numbers[0], numbers[1]);
    timeCurrent = Number(minute)*60 + Number(seconds);
    //
    addNote(current, note, notes);
    notesRender(notes);
    dom.noteText.value = "";
  }
}

function addNote(heading, text, array) { 
  timeCurrent = 1500 - timeCurrent;
  if (timeCurrent < 0){
    timeCurrent = 1500 - timeCurrent;
  }
  let timeC = convertSecondsToTime(timeCurrent)
  let note = {
    heading,
    text,
    cntPomador: cntPomador,
    time: timeC,
    // timeCurrent обновляется после паузы
    // time: progressValue.textContent
    Datetime: new Date()
  }
  array.push(note);
}



function notesRender(array){
  let htmlList = ''; 

  const today = new Date();
  const year = today.getFullYear(); 
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  array.forEach((note) => {

    const htmlTask = `## ${note.heading} [${formattedDate}] [${note.time}] [${note.cntPomador}]
    ${note.text}
    `

    // Здесь ублюдский рендер текста так как
    // `213
    // 312`
    // Переносит ${} текст не так как выше, а вот так `213 312`
    
    htmlList = htmlList + htmlTask;

    // Поэтому здесь innerText
    dom.boxNotes.innerText = htmlList;

  })
// Скорее всего не удастся так делать локал сторадж. Сделать сохранение в локал сторадж
}

//Функция добавления задачи
function addTask(text, array, flagStar = 0) {
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
  // flagStar нужен для обработки звёзд избранных задач в список выполненных
  if ((array == starTasks) || (flagStar == 1)){
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
  listRender(tasks, starTasks);
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
    popupLists.className = "popup";
    popup.className = "popup popup-open";

  }
}
dom.close_popup.onclick = (event) =>{
  const target = event.target;
  if (target.classList.contains('popup__close')) {
    popup.className = "popup";

  }
}
// POPUP LISTS
dom.iconLists.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('todo__pomodoro-icon')) {
    if (popupLists.className == "popup popup-open"){
      popupLists.className = "popup";
      return;
    }
    // Список закрывающихся других попапов при открытии этого
    popup.className = "popup";
    popupSettings.className = "popup"
    popupLists.className = "popup popup-open";
  }
}
dom.close_popupLists.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('popup__close')) {
    popupLists.className = "popup";
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
    popupLists.className = "popup";
    popupSettings.className = "popup popup-open";
  }
}
dom.close_popupSettings.onclick= (event) =>{
  const target = event.target;
  if (target.classList.contains('popup__close')) {

    popupSettings.className = "popup";

  }
}

// Считывание событий (добавление в выполненные/удаление) со списка невыполненных задач
dom.list.onclick = (event) => {
  const target = event.target;
  // Добавление невыполненной задачи в выполненнуй задачу в comlpeteTasks и отрисовывание внизу
  if (target.classList.contains('todo__checkbox-label')) {

    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');
    const text = target.parentElement.nextElementSibling.innerHTML; 
    console.log("Вы нажали на кнопку выполнения задачи");

    deleteTask(taskID, tasks);
    addTask(text, completedTasks);

    tasksRender(completedTasks);
    tasksRender(tasks);

  }
  // Удаление невыполненной задачи 
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    console.log("Вы решили удалить невыполненную задачу");
    const taskID = task.getAttribute('id');
    deleteTask(taskID, tasks);
    deleteTask(taskID, completedTasks);
    tasksRender(tasks);
    tasksRender(completedTasks);
  }
  // Добавление невыполненной задачи в список избранного
  if (target.classList.contains('icon-star')){

    const task = target.parentElement.parentElement;

    const taskID = task.getAttribute('id');
    const text = target.parentElement.previousElementSibling.innerHTML; 

    changeTaskStarStatus(taskID, tasks);

    deleteTask(taskID, tasks);
    addTask(text, starTasks);

    tasksRender(tasks);
    tasksRender(starTasks);

  }

}
// Считывание событий (добавление в выполненные/удаление) со списка выполненных задач
dom.listcomplete.onclick = (event) => {
  const target = event.target;
  // Удаление выполненной задачи
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    const taskID = task.getAttribute('id');
    deleteTask(taskID, completedTasks);
    tasksRender(completedTasks);

  }
  // Снятие выполнения задачи и возвращение в список невыполненных
  if (target.classList.contains('todo__checkbox-label')) {

    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');
    const text = target.parentElement.nextElementSibling.innerHTML; 

    // Проверка есть ли у выполненной задачи при снятии галочки "Звёздочка"
    if (target.parentElement.nextElementSibling.nextElementSibling.classList.contains('star-active')){
      deleteTask(taskID, completedTasks);
      addTask(text, starTasks);
  
      tasksRender(completedTasks);
      tasksRender(starTasks);
    }
    else{
      deleteTask(taskID, completedTasks);
      addTask(text, tasks);
  
      tasksRender(completedTasks);
      tasksRender(tasks);
    }
  }
}

// Считывание событий (добавление в выполненные/удаление) со списка избранных задач
dom.liststar.onclick = (event) => {
  const target = event.target;
  // Удаление избранной задачи навсегда
  if (target.classList.contains('todo__task-del')){
    const task = target.parentElement;
    const taskID = task.getAttribute('id');
    deleteTask(taskID, starTasks);
    tasksRender(starTasks);
  }
  // Снятие галочки "Добавить в избранное" и перемещение в невыполненные задачи
  if (target.classList.contains('icon-star')){

    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');
    const text = target.parentElement.previousElementSibling.innerHTML; 

    deleteTask(taskID, starTasks);

    addTask(text, tasks);

    tasksRender(tasks);
    tasksRender(starTasks);


  }
  // Добавление невыполнненое избранной задачи в нижний список выполненных
  if (target.classList.contains('todo__checkbox-label')) {
    const task = target.parentElement.parentElement;
    const taskID = task.getAttribute('id');
    const text = target.parentElement.nextElementSibling.innerHTML; 
    console.log("Вы нажали на кнопку выполнения задачи");
    let flagStar = 1; // Чтобы в списке выполненных задач были выполненные задачи со звёздами

    deleteTask(taskID, starTasks);
    addTask(text, completedTasks, flagStar);

    tasksRender(completedTasks);
    tasksRender(starTasks);

  }
}

function changeTaskStarStatus(id, array){
  array.forEach((task) => {
    console.log(task.id, id);
    if (task.id == id){
      task.isStar = !task.isStar;
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

// Сохранение списка дел в localstorage
function saveToLocalStorage(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('starTasks', JSON.stringify(starTasks));
}


let circularProgress = document.querySelector('.circular-progress');
let progressValue = document.querySelector('.progress-value');

function startPomadoro(value, timeArrayValue){
  let inter;
  let progressStartValue = value;

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
    if ((progressStartValue / 60) < 0){
      progressStartValueMinute = Math.ceil(progressStartValue / 60);
    }
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
let cntPomador = 1; // буду записывать число в note

let timeCurrent = timeArray[cnt];



dom.button_play.onclick = (event) => {
  const target = event.target;
  if (target.classList.contains('icon-play')){

    button_play.src = "/icons/icon_pause.svg";
    button_play.classList = "todo__pomodoro-icon icon-pause";

    intervalID = startPomadoro(timeCurrent, timeArray[cnt]);
    console.log(timeArray[cnt]);

  }
  else if (target.classList.contains('icon-pause')){

    button_play.src = "/icons/icon_play.svg";
    button_play.classList = "todo__pomodoro-icon icon-play";

    clearInterval(intervalID);
    let timeRemaining = progressValue.textContent;
    let numbers = timeRemaining.split(':');
    let minute = numbers[0];
    let seconds = numbers[1];
    console.log(numbers);
    console.log(numbers[0], numbers[1]);
    timeCurrent = Number(minute)*60 + Number(seconds);
  }

}
dom.button_next.onclick = (event) => {
  clearInterval(intervalID);
  const target = event.target;
  if (target.classList.contains('icon-next')){
    if (cnt < 8){
    cnt++;
    if (cnt < 1){
      dom.countTime.textContent = `1/4`;
      cntPomador++;
    } 
    if ((2 <= cnt) && cnt < 3){
      dom.countTime.textContent = `2/4`;
      cntPomador++;
    } 
    if ((4 <= cnt) && cnt < 5){
      dom.countTime.textContent = `3/4`;
      cntPomador++;
    } 
    if ((6 <= cnt) && cnt < 8){
      dom.countTime.textContent = `4/4`;
      cntPomador++;
    }}
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

function listRender(array, array2){
  let htmlList = ''; 


  array.forEach((task) => {
    const htmlTask = `
    <div class="select__item">${task.text}</div>`
    htmlList = htmlTask + htmlList;
  })
  array2.forEach((task) => {
    const htmlTask = `
    <div class="select__item">${task.text}</div>`
    htmlList = htmlTask + htmlList;
  })
  dom.selectBody.innerHTML = htmlList;
}


dom.selectHeader.forEach(element => {
  element.addEventListener('click', function(){
    listRender(tasks, starTasks);
    // listRender(tasks);
    this.parentElement.classList.toggle('is-active');
    // Сохранение заметки при выборе другой задачи
    let note = noteText.value;
    let current = dom.selectCurrent.innerText;
    if (note){
      // Жмётся пауза, чтобы сохранить значение timeCurrent
      button_play.src = "/icons/icon_play.svg";
      button_play.classList = "todo__pomodoro-icon icon-play";

      clearInterval(intervalID);
      let timeRemaining = progressValue.textContent;
      let numbers = timeRemaining.split(':');
      let minute = numbers[0];
      let seconds = numbers[1];
      console.log(numbers);
      console.log(numbers[0], numbers[1]);
      timeCurrent = Number(minute)*60 + Number(seconds);
      //

      addNote(current, note, notes);
      notesRender(notes);
      dom.noteText.value = "";
    }
    dom.messageBox.classList.toggle('none');
  })
});
// selectItem = document.querySelectorAll('.select__item');
dom.selectBody.onclick = (event) => {
  const target = event.target;
  // console.log(target);
  if (target.classList.contains('select__item')){
    let selectSection = target.closest('.select__section');
    let current = selectSection.querySelector('.select__current');
    current.innerText = target.innerText;
    selectSection.classList.remove('is-active'); 
    dom.messageBox.classList.remove('none'); 
    // this.closest('.select__section').
    // .querySelector('.selector__current') = 
    // target.innerText;
  }
  
  // this.closest('.select__section').querySelector('.selector__current') = this.innerText;

}
    
dom.copy.onclick = (event) => {
  navigator.clipboard.writeText(copyNotes(notes));
}
function copyNotes(array){
  let NoteList = ''; 

  notes.forEach((note) => {

    const year = note.Datetime.getFullYear(); 
    const month = String(note.Datetime.getMonth() + 1).padStart(2, '0');
    const day = String(note.Datetime.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    const time = convertSecondsToTime(note.time);
    const htmlTask = `## ${note.heading} [${formattedDate}][${time}][${note.cntPomador}]\n${note.text}\n`
    NoteList = NoteList + htmlTask;
  })
  return NoteList;
}

// Отслеживаем Enter при заполнении задачи

noteText.addEventListener('keypress', (event) => {
  const keyName = event.key;
console.log(event.code, event.keyCode, event.key);
  if (event.shiftKey && event.keyCode === 13) {

    let note = noteText.value;
    let current = dom.selectCurrent.innerText;
    if (note){
      addNote(current, note, notes);
      notesRender(notes);
      dom.noteText.value = "";
    }
  }

});

function convertSecondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - (hours * 3600)) / 60);
  const remainingSeconds = seconds - (hours * 3600) - (minutes * 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  return formattedTime;
}
