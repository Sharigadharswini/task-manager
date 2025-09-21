const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

let currentFilter = 'all';

// Create Task Item
function createTaskItem(text, time=null, status="active"){
  const li = document.createElement("li");
  li.dataset.status = status;

  const span = document.createElement("span");
  const now = time || new Date().toLocaleString();
  span.innerHTML = `<strong>${text}</strong> <small>(${now})</small>`;

  if(status==="completed") li.classList.add("completed");

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.innerHTML = `<i class="fas fa-check"></i>`;
  completeBtn.addEventListener("click", () => { toggleComplete(li); saveTasks(); });

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = `<i class="fas fa-pen"></i>`;
  editBtn.addEventListener("click", () => { editTask(span); saveTasks(); });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.addEventListener("click", () => { li.remove(); updateCounters(); updateProgress(); saveTasks(); });

  actions.append(completeBtn, editBtn, deleteBtn);
  li.append(span, actions);
  return li;
}

// Add Task
addBtn.addEventListener("click", () => {
  const value = taskInput.value.trim();
  if(!value) return;
  const li = createTaskItem(value);
  taskList.appendChild(li);
  taskInput.value = "";
  filterTasks(currentFilter);
  updateCounters();
  updateProgress();
  saveTasks();
});

// Toggle Complete
function toggleComplete(li){
  if(li.dataset.status==="active"){
    li.dataset.status = "completed";
    li.classList.add("completed");
  } else {
    li.dataset.status = "active";
    li.classList.remove("completed");
  }
  filterTasks(currentFilter);
  updateCounters();
  updateProgress();
}

// Edit Task
function editTask(span){
  const text = span.querySelector("strong").textContent;
  const newText = prompt("Edit task:", text);
  if(newText && newText.trim()!==""){
    span.querySelector("strong").textContent = newText;
  }
}

// Filters
allBtn.addEventListener("click", () => filterTasks('all'));
activeBtn.addEventListener("click", () => filterTasks('active'));
completedBtn.addEventListener("click", () => filterTasks('completed'));

function filterTasks(filter){
  currentFilter = filter;
  [...taskList.children].forEach(li=>{
    if(filter==="all") li.style.display="flex";
    else if(filter==="active" && li.dataset.status==="active") li.style.display="flex";
    else if(filter==="completed" && li.dataset.status==="completed") li.style.display="flex";
    else li.style.display="none";
  });
  [allBtn, activeBtn, completedBtn].forEach(btn=>btn.classList.remove("active-filter"));
  if(filter==="all") allBtn.classList.add("active-filter");
  if(filter==="active") activeBtn.classList.add("active-filter");
  if(filter==="completed") completedBtn.classList.add("active-filter");
}

// Counters
function updateCounters(){
  const lis = taskList.children;
  let all=lis.length, active=0, completed=0;
  for(let li of lis){
    if(li.dataset.status==="active") active++;
    else if(li.dataset.status==="completed") completed++;
  }
  allBtn.textContent = `All(${all})`;
  activeBtn.textContent = `Active(${active})`;
  completedBtn.textContent = `Completed(${completed})`;
}

// Progress Bar
function updateProgress(){
  const lis = taskList.children;
  if(lis.length===0) document.querySelector(".progress-bar").style.width="0%";
  else{
    const completed = [...lis].filter(li=>li.dataset.status==="completed").length;
    const percent = Math.round((completed/lis.length)*100);
    document.querySelector(".progress-bar").style.width = percent+"%";
  }
}

// Clear All
clearAllBtn.addEventListener("click", ()=>{
  if(confirm("Are you sure you want to delete all tasks?")){
    taskList.innerHTML="";
    updateCounters();
    updateProgress();
    localStorage.removeItem("tasks");
  }
});

// Save to Local Storage
function saveTasks(){
  const tasks = [];
  [...taskList.children].forEach(li=>{
    const span = li.querySelector("span");
    const text = span.querySelector("strong").textContent;
    const time = span.querySelector("small").textContent;
    tasks.push({text,time,status:li.dataset.status});
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from Local Storage
window.addEventListener("load", ()=>{
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task=>{
    const li = createTaskItem(task.text, task.time, task.status);
    taskList.appendChild(li);
  });
  filterTasks(currentFilter);
  updateCounters();
  updateProgress();
});

// Scroll animation for sections
const scrollSections = document.querySelectorAll(".info-box, .hero-left, .hero-right");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

scrollSections.forEach(section => {
  section.classList.add("scroll-reveal");
  observer.observe(section);
});

// Nav click highlight
function highlightBox(id){
  const box = document.getElementById(id);
  box.classList.remove("animate-highlight");
  void box.offsetWidth; // reset animation
  box.classList.add("animate-highlight");
}
