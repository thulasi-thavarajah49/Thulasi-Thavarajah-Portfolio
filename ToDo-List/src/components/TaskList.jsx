import { useContext, useState, useEffect } from "react";
import ModalAddTask from "./ModalAddTask";
import ModalEditTask from "./ModalEditTask";
import { PreferencesContext } from "../context/PreferencesContext";

function TaskList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTaskInfo, setEditTaskInfo] = useState(null);

  const { deadlines, autoComplete } = useContext(PreferencesContext);

  const [toastMessage, setToastMessage] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // get yyyy-mm-dd
    // Check if any tasks are overdue and incomplete
    const hasOverdue = tasks.some(task => task.date && task.date < today && !task.completed);

    if (hasOverdue) {
      setToastMessage("You have overdue tasks!");
      // Clear toast after 5 seconds
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [tasks]);

  function addTask(task) {
    setTasks(prev => [...prev, { ...task, completed: autoComplete? true: false }]);
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

  let content;

  if (deadlines) {
    const grouped = tasks.reduce((acc, task, index) => {
      const key = task.date || "No Deadline";
      if (!acc[key]) acc[key] = [];
      acc[key].push({ ...task, originalIndex: index });
      return acc;
    }, {});

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

      {toastMessage && (
        <div className="fixed top-2 right-2 toaster-notif">
          {toastMessage}
        </div>
      )}


      {content}

      {showAddModal && (
        <ModalAddTask
          onClose={() => setShowAddModal(false)}
          onAdd={addTask}
        />
      )}

      {editTaskInfo && (
        <ModalEditTask
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
