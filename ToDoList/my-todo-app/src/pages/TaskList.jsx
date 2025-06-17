import { useContext, useState, useEffect, useRef } from "react";
import ModalAddTask from "./ModalAddTask";
import ModalEditTask from "./ModalEditTask";
import toast from "react-hot-toast";
import api from "../api";
import { PreferencesContext } from "../context/PreferencesContext";
import "../index.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const {deadlines, autoComplete} = useContext(PreferencesContext)

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTaskInfo, setEditTaskInfo] = useState(null);

  const toastShownRef = useRef(false);
  const today = new Date().toISOString().split("T")[0];

  // Fetch all todos on mount
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const res = await api.get("/api/todos", { params: { limit: 100 } });
        setTasks(res.data.todos || res.data); // adapt to your API response shape
      } catch (err) {
        toast.error("Failed to load tasks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  // Show toast if there are overdue tasks, only once
  useEffect(() => {
  if (!loading) {
    const hasOverdue = tasks.some((task) => {
  const d = task.deadline || task.date;
  return d && d < today && !task.completed;
});

    console.log("Overdue tasks detected?", hasOverdue);
    if (hasOverdue && !toastShownRef.current) {
      toastShownRef.current = true;
      toast("You have overdue tasks!",
        {
          icon: '❗',
          style: {
            border: '1px solid #f87171', // Tailwind's red-400
      padding: '12px',
      color: '#b91c1c', // Tailwind's red-700
          },
        }
      );
    }
  }
}, [tasks, loading, today]);


  // ADD TASK - create on server then update state
  async function addTask(task) {
    try {
      const res = await api.post("/api/todos", {
        ...task,
        completed: autoComplete ? true : false,
      });
      setTasks((prev) => [...prev, res.data.todo || res.data]);
      toast.success("Task added");
    } catch (err) {
      toast.error("Failed to add task");
      console.error(err);
    }
  }

  // UPDATE TASK - update on server then update state
  async function updateTask(id, updatedTask) {
    try {
      await api.put(`/api/todos/${id}`, updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
      );
      toast.success("Task updated");
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    }
  }

  // DELETE TASK - delete on server then update state
  async function deleteTask(id) {
    try {
      await api.delete(`/api/todos/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error(err);
    }
  }

  // TOGGLE COMPLETED - toggle on server then update state
  async function toggleCompleted(id) {
    try {
      await api.patch(`/api/todos/${id}/toggle`);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      toast.error("Failed to toggle task completion");
      console.error(err);
    }
  }

  // Group tasks by date if deadlines enabled
  let content;

  if (loading) {
    content = <p>Loading tasks...</p>;
  } else if (deadlines) {
    const grouped = tasks.reduce((acc, task) => {
      const key = task.deadline 
      ? new Date(task.deadline).toISOString().split("T")[0] : "Undated Tasks";
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});

    content = Object.keys(grouped)
      .sort()
      .map((date) => (
        <div key={date} className="mt-6 mb-6">
          <p className="font-semibold text-center text-[22px]">{date}</p>
          <ol className="list-decimal list-inside">
            {grouped[date].map((task) => (
              <li key={task.id} className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id)}
                />
                {(() => {
  const taskDate = (task.deadline || task.date || "").split("T")[0];
  const isOverdue = taskDate < today && !task.completed;
  return (
    <span
      onClick={() => setEditTaskInfo(task)}
      className={`flex-1 cursor-pointer ${
        task.completed ? "line-through text-gray-500" : ""
      } ${isOverdue ? "overdue-tasks font-bold" : ""} text-left text-[20px]`}
    >
      {task.title}
    </span>
  );
})()}
              </li>
            ))}
          </ol>
        </div>
      ));
  } else {
    content = (
      <ol className="list-decimal list-inside">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center gap-4 bg-opacity-70 p-4 rounded-lg border border-gray-700 ${
              task !== tasks[tasks.length - 1] ? "mb-4" : ""
            }`}
          >
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task.id)}
            />
            <span
              onClick={() => setEditTaskInfo(task)}
              className={`flex-1 cursor-pointer ${
                task.completed ? "line-through text-gray-500" : ""
              } ${
                task.date && task.date < today ? "font-extrabold overdue-tasks" : ""
              } text-left text-[20px]`}
            >
              {task.title}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="home-card  h-full rounded-3xl p-4 gap-7">
      <div className="flex justify-between items-center mb-8 ">
        <div className=" text-[40px] font-bold">Tasks</div>
        <button
          className="btn btn-soft w-40 text-right"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          + Add Task
        </button>
      </div>

      {content}

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <ModalAddTask
          onClose={() => setShowAddModal(false)}
          onAdd={(task) => {
            addTask(task);
            setShowAddModal(false);
          }}
        />
      )}

      {/* EDIT TASK MODAL */}
      {editTaskInfo && (
        <ModalEditTask
          task={editTaskInfo}
          onClose={() => setEditTaskInfo(null)}
          onSave={(updated) => {
            updateTask(editTaskInfo.id, updated);
            setEditTaskInfo(null);
          }}
          onDelete={() => {
            deleteTask(editTaskInfo.id);
            setEditTaskInfo(null);
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
