class Task{
    constructor(name){
        this.name = name;
        this.id = Task.nextTaskId++;
        this.created = new Date();
        this.priority = Task.priorities.normal;
        this.status = Task.statuses.notStarted;
        this.pctComplete = 0;
        this.startDate = null;
        this.dueDate = null;
    }
}

Task.nextTaskId = 1;
Task.priorities = {
    none: 0,
    low: 1,
    normal: 2,
    high: 3
};
Task.statuses = {
    none: 0,
    notStarted: 1,
    started: 2,
    completed: 3
};

class TaskList{
    constructor(tasks){
        this.tasks = tasks || [];
    }

    getTasks(){
        return this.tasks;
    }

    getTask(taskId){
        let index = this.getTaskIndex(taskId);
        return (index >= 0 ? this.tasks[index] : null);
    }

    addTask(task){
        this.tasks.push(task);
        return this;
    }

    changeTaskName(taskId,newName){
        let i = this.getTaskIndex(taskId);
        if(i >= 0){
            this.tasks[i].name = newName;
            return this.tasks[i];
        }
        return null;
    }

    moveTask(taskId,moveUp){
        let i = this.getTaskIndex(taskId);
        if(i >= 0){
            let task = this.tasks[i];
            if(!moveUp){
                this.tasks.splice(i,1);
                this.tasks.splice((i+1),0,task);
            }else{
                this.tasks.splice(i,1);
                this.tasks.splice((i-1),0,task);
            }
            return task;
        }
        return null;
    }

    removeTask(taskId){
        let i = this.getTaskIndex(taskId);
        if(i >= 0){
            let task = this.tasks[i];
            this.tasks.splice(i,1);
            return task;
        }
        return null;
    }

    each(callback){
        for(let i in this.tasks){
            callback(this.tasks[i]);
        }
    }

    getTaskIndex(taskId){
        for(let i in this.tasks){
            if(this.tasks[i].id == taskId){
                return parseInt(i);
            }
        }
        return -1;
    }
}




