class TaskAtHandApp{
    constructor(){
        this.version = 'v1.0';
        this.appStorage = new AppStorage("taskAtHand");
        this.taskList = new TaskList();
        this.timeoutId = 0;
    }


    addTask(){
        let taskName = $("#new-task-name").val();
        if(taskName){
            let task = new Task(taskName);
            this.taskList.addTask(task);
            this.appStorage.setValue("nextTaskId",Task.nextTaskId);
            this.addTaskElement(task);
            $("#new-task-name").val("").focus();
        }
    }

    addTaskElement(task){
        let $task = $("#task-template .task").clone();
        $task.data("task-id",task.id);
        $("span.task-name", $task).text(task.name).data("task_id",task.id);
        $(".details input , .details select",$task).each(function () {
            let $input = $(this);
            let fieldName = $input.data("field");
            $input.val(task[fieldName])
        });
        $(".details input, .details select", $task).change((e)=> {
            this.onChangeTaskDetails(task.id, $(e.target));
        });
        $task.click( (e)=> {
            this.onSelectTask($task);
        });
        $("button.delete", $task).click((e)=> {
            this.removeTask($task);
        });
        $("button.move-up", $task).click((e)=> {
            this.moveTask($task , true);
        });
        $("button.move-down", $task).click((e)=> {
            this.moveTask($task , false);
        });
        $("span.task-name", $task).click((e)=> {
            this.onEditTaskName($(e.target));
        });
        $("input.task-name", $task).change((e)=> {
            this.onChangeTaskName($(e.target));
        })
            .blur((e)=> {
                $(e.target).hide().siblings("span.task-name").show();
            });
        $("button.toggle-details", $task).click((e)=> {
            this.toggleDetails($task);
        });
        $("#task-list").append($task);
        this.saveTaskList();
    }

    onEditTaskName($span){
        $span.hide()
            .siblings("input.task-name")
            .val($span.text())
            .show()
            .focus();
    }

    onChangeTaskName($input){
        $input.hide();
        let $span = $input.siblings("span.task-name");
        let task_id = $span.data("task_id");
        if ($input.val()){
            $span.text($input.val());
            let newTaskName = $span.text();
            this.taskList.changeTaskName(task_id,newTaskName);
        }
        $span.show();
        this.saveTaskList();
    }

    setStatus(message,noFade){
        $("#app>footer").text(message).show();
        if(!noFade){
            $("#app>footer").fadeOut(1000);
        }
    }

    saveTaskList(){
        if(this.timeoutId) clearTimeout();
        this.setStatus("saving changes ...",true);
        this.timeoutId = setTimeout( ()=> {
            this.appStorage.setValue("taskList",this.taskList.getTasks());
            this.timeoutId = 0;
            this.setStatus("changes saved");
        },2000);
    }

    removeTask($task){
        let taskId = $task.data("task-id");
        $task.remove();
        this.taskList.removeTask(taskId);
        this.saveTaskList();
    }

    moveTask($task , moveUp){
        let taskId = $task.data("task-id");
        if(moveUp){
            $task.insertBefore($task.prev());
            this.taskList.moveTask(taskId,true);
        }else{
            $task.insertAfter($task.next());
            this.taskList.moveTask(taskId);
        }
        this.saveTaskList();
    }

    loadTaskList(){
        let tasks = this.appStorage.getValue("taskList");
        this.taskList = new TaskList(tasks);
        this.rebuildTaskList();
    }

    onSelectTask($task){
        if($task){
            $task.siblings(".selected").removeClass("selected");
            $task.addClass("selected");
        }
    }

    onChangeTheme(){
        let theme = $("#theme>option").filter(":selected").val();
        this.setTheme(theme);
        this.appStorage.setValue("theme",theme);
    }

    setTheme(theme){
        $("#theme-style").attr('href','themes/' + theme + '.css');
    }

    loadTheme(){
        let theme = this.appStorage.getValue("theme");
        if(theme){
            this.setTheme(theme);
            $("#theme>option[value=" + theme + "]").attr("selected","selected");
        }
    }

    toggleDetails($task){
        $(".details", $task).slideToggle();
        $("button.toggle-details", $task).toggleClass("expanded");
        if($("button.toggle-details", $task).text() === '+'){
            $("button.toggle-details", $task).text('-');
        }else{
            $("button.toggle-details", $task).text('+');
        }
    }

    onChangeTaskDetails(taskId,$input){
        let task = this.taskList.getTask(taskId);
        if(task){
            let fieldName = $input.data("field");
            task[fieldName] = $input.val();
            this.saveTaskList();
        }
    }

    rebuildTaskList(){
        $("#task-list").empty();
        this.taskList.each( (task)=> {
            this.addTaskElement(task);
        });
    }

    start(){
        this.loadTaskList();
        this.loadTheme();
        $("#theme").change(()=>{
            this.onChangeTheme();
        });
        $("#new-task-name").keypress( (e)=> {
            if(e.which == 13){
                this.addTask();
                return false;
            }
        }).focus();
        $("#app>header").append(this.version);
        this.setStatus('ready');
    }
}

//start the app after the page is ready
$(function(){
    window.app = new TaskAtHandApp();
    window.app.start();
});

