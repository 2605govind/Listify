// define some tags
const inputAddTask = document.querySelector('#add-new-task')
const taskContainer = document.querySelector('#task-container')
const search = document.querySelector('#search')
const taskTimer = document.querySelector('#taskTimer')

// globle variable
let currentTaskArray = []
let isTimer = true

// one time executiong
if(localStorage.getItem('localstorage_task_array') === "") {
    localStorage.setItem('localstorage_task_array', [])
}else{
    currentTaskArray = localStorage.getItem('localstorage_task_array').split(',')
}


// functions
function addNewTaskInContainer(task) {
    const list = document.createElement('li');
    // for some key taskdate, tasktime, tasktimer
    const taskDate = localStorage.getItem(`${task}date`)
    const taskTime = localStorage.getItem(`${task}time`)
    const taskTimer = localStorage.getItem(`${task}timer`)
    list.innerHTML = ` 
                    <div class="task-box">
                        <div class="title-box">
                            <p class="task-title">${task}</p>
                            <span><i class="fa-solid fa-trash"></i></span>
                        </div>
                        <div class="data-box">
                            <p class="taskTime">Time: ${taskTime}</p>
                            <p id="taskTimer${task.replaceAll(' ', '_')}">${taskTimer}</p>
                            <p class="taskDate">Date: ${taskDate}</p>
                        </div>

                    </div>
                    `
    // console.log(taskTime,taskDate, taskTimer)
    taskContainer.appendChild(list)                    
}

// Timer
function Timer() {
    const intervalId = setInterval(()=>{
            currentTaskArray.forEach(task =>{
                let sec = localStorage.getItem(`${task}timer`)
                sec++;
                // reset time
                if(sec === 3600) sec = 0;

                localStorage.setItem(`${task}timer`,sec)
                document.querySelector(`#taskTimer${task.replaceAll(' ', '_')}`).textContent = `${sec/60 <= 0 ? '' : Math.floor(sec/60) + ' :'} ${sec%60}`        
            })
            if(currentTaskArray.length === 0 || currentTaskArray[0] === " ") {
                clearInterval(intervalId);
                isTimer = false
            }
        
    }, 1000)
}

function showLocalStorageList() {
    const list = localStorage.getItem('localstorage_task_array').split(',')
    list.forEach((task) =>{
        if(task !== "")
        addNewTaskInContainer(task)
        
    })
}

// for searching task 
function filterTask(term) {
    term = term.toLocaleLowerCase()
    Array.from(taskContainer.children)
    .filter( task => {
        return !task.textContent.toLocaleLowerCase().includes(term)
    })
    .forEach( task => {
        task.classList.add('hide');
    })

    Array.from(taskContainer.children)
    .filter( task => {
        return task.textContent.toLocaleLowerCase().includes(term)
    })
    .forEach( task => {
        task.classList.remove('hide');
    })
}



// main
showLocalStorageList()


// if(currentTaskArray.length > 0)
Timer()


// Add new taskconst
document.querySelector('#click-task').addEventListener('click', () => {
    if(inputAddTask.value.length !== 0) {
        const task = inputAddTask.value.trim();
        
        if(!currentTaskArray.includes(task)) {

            if(!isTimer){
                Timer()
                isTimer = true
            }
            
            
            // reset input tag
            inputAddTask.value = "";
    
            // for some key taskdate, tasktime, tasktimer
            localStorage.setItem(`${task}date`, new Date().toLocaleTimeString())
            localStorage.setItem(`${task}time`, new Date().toLocaleDateString())
            localStorage.setItem(`${task}timer`, 0)
    
            // add new task
            addNewTaskInContainer(task)
      
            // push in tasks array
            currentTaskArray.push(task)
    
            // updating in localdatabase
            localStorage.setItem("localstorage_task_array", currentTaskArray)
        }else {
            console.log("task alredy present")
        }
    } 
});

// delete task
taskContainer.addEventListener('click', (event)=>{

    if(event.target.className === 'fa-solid fa-trash') {

        // storing task title
        const removeTask = event.target.parentElement.parentElement.firstElementChild.innerText;
    
        // remove html form task container
        event.target.parentElement.parentElement.parentElement.remove()
        
        // remove from array and localstorage
        const index = currentTaskArray.indexOf(removeTask);

        localStorage.removeItem(`${currentTaskArray[index]}date`)
        localStorage.removeItem(`${currentTaskArray[index]}time`)
        localStorage.removeItem(`${currentTaskArray[index]}timer`)

        currentTaskArray.splice(index, 1);
    
    
        localStorage.setItem('localstorage_task_array', currentTaskArray)

        
    }
})


// search
search.addEventListener('keyup', event => {
    const term = search.value.trim();

    filterTask(term)
})


document.querySelector('#reset-search').addEventListener('click', () => {
    search.value = "";

    Array.from(taskContainer.children).forEach( task => {
        task.classList.remove('hide')
    })
})




