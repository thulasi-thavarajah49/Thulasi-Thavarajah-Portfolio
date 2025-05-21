import { useContext, useState, useEffect, useRef } from "react";
import ModalAddTask from "./ModalAddTask";
import ModalEditTask from "./ModalEditTask";
import { PreferencesContext } from "../context/PreferencesContext";

function TaskList() {

  //set up variables 
  const [tasks, setTasks] = useState(() => {

    //load tasks from local storage if they are there 
    const saved = localStorage.getItem("tasks");

    //if there are tasks sotred, set tasks as the saved tasks, otherwise, start with an empty array 
    return saved ? JSON.parse(saved) : [];
  });

  //variable to show add task modal - start with false bc button not clicked 
  const [showAddModal, setShowAddModal] = useState(false);

  //variable to edit task  - start with null because no tasks being edited yet 
  const [editTaskInfo, setEditTaskInfo] = useState(null);

  //get boolean deadlines and auto-complete from preferences context 
  const { deadlines, autoComplete } = useContext(PreferencesContext);

  //create a message for the toast notification and function to update it
  const [toastMessage, setToastMessage] = useState(null);

  //get todays date in YYYY-MM-DD format 
  const today = new Date().toISOString().split("T")[0];

  //if tasks array updated, save it to local storage 
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  //toast not yet shown - so false
  const toastShownRef = useRef(false);

  //when tasks array updated, get todays date 
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    //boolean variable - if tasks have date AND is less than today AND task is not completed = there are overdue tasks 
    const hasOverdue = tasks.some(task => task.date && task.date < today && !task.completed);

    //if there are overdue tasks AND the toast notification has not been shown yet - change state of toastMessage and then set it true
    //this way, if the message was shown once, it will not be shown again - for improvement maybe add transition bc toast is sudden
    if (hasOverdue && !toastShownRef.current) {
      setToastMessage("You have overdue tasks!");
      toastShownRef.current = true;
    }
  }, [tasks]);

  //if toast message changed (like above), then show it for 3 seconds and clear timer once done 
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  //functions to add, update, and delete and complete tasks 
  function addTask(task) {
    setTasks(prev => [...prev, { ...task, completed: autoComplete ? true : false }]);
  }

  function updateTask(index, updatedTask) {
    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    setTasks(newTasks);
  }

  function deleteTask(index) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  }

  function toggleCompleted(index) {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  }

  //since there is a toggle for deadlines or no deadlines, the content on the task list will change

  //content to display on the task card 
  let content;

  //if deadlines is toggled 
  if (deadlines) {

    //group tasks by date 
    const grouped = tasks.reduce((acc, task, index) => {
      const key = task.date || "Undated Tasks";
      if (!acc[key]) acc[key] = [];
      acc[key].push({ ...task, originalIndex: index });
      return acc;
    }, {});

    //display content by deadlines 
    content = Object.keys(grouped).sort().map(date => (
      <div key={date} className="mt-4 mb-4">
        <p className="font-semibold text-[22px]">{date}</p>
        <ol className="list-decimal list-inside">
          {grouped[date].map((task, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(task.originalIndex)}
              />
              <span

              //if task span is clicked, then edit task info
                className={`flex-1 cursor-pointer ${task.completed ? "line-through text-gray-500" : ""
                  } ${task.date && task.date < today ? "font-bold overdue-task" : ""
                  } text-left text-[20px]`}
                onClick={() => setEditTaskInfo(task)}
              >
                {task.name}

              </span>
            </li>
          ))}
        </ol>
      </div>
    ));
  } else {

    //if no deadlines, the run through task array and display information
    content = (
      <ol className="list-decimal list-inside">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`flex items-center gap-4 bg-opacity-70 p-4 rounded-lg border border-gray-700
        ${index !== tasks.length - 1 ? "mb-4" : ""}
      `}
          >
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(index)}
            />
            <span

            //if task clicked on, then editable
              className={`flex-1 cursor-pointer ${task.completed ? "line-through text-gray-500" : ""
                } ${task.date && task.date < today ? "font-extrabold overdue-task" : ""
                } text-left text-[20px]`}
              onClick={() => setEditTaskInfo({ ...task, originalIndex: index })}
            >
              {task.name}
            </span>
          </li>
        ))}
      </ol>


    );
  }

  return (
    <div className="tasks-card h-full gap-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="card-title text-xl font-bold">Tasks</h1>
        <button className="add-task-button" onClick={() => setShowAddModal(true)}> + Add Task</button>
      </div>
      <div className="text-transparent text-[20px]">
        hello
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed top-2 right-2 toaster-notif">
          {toastMessage}
        </div>
      )}

      {/* CONTENT TO DISPLAY ON THE CARD */}
      {content}

      {/* If user clicked on add task button, then show ADD MODAL*/}
      {showAddModal && (
        <ModalAddTask

          //once modal is closed, then do not show modal
          onClose={() => setShowAddModal(false)}

          //when task is added in modal, pass info to addTask function that then updated the array 
          onAdd={addTask}
        />
      )}

      {/* If span is clicked on, then setEditTaskInfo is running, which means editTaskInfo is holding a value*/}
      {editTaskInfo && (
        <ModalEditTask
        //set task to new task info
          task={editTaskInfo}

          onClose={() => setEditTaskInfo(null)}
          onSave={updated => {
            updateTask(editTaskInfo.originalIndex, updated);
            setEditTaskInfo(null);
          }}
          onDelete={() => {
            deleteTask(editTaskInfo.originalIndex);
            setEditTaskInfo(null);
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
