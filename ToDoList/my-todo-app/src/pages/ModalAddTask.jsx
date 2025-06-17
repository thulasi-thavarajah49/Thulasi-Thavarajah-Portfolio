import { useState } from "react";
import "../index.css";


function ModalAddTask({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (title.trim()) {
      onAdd({ title, deadline });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
      <div className="home-card  p-6 rounded-lg w-full max-w-md">
        <div className="text-[22px] font-bold">Add Task</div>
        <div className="text-transparent">hello</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-stretch">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="text-transparent">hello</div>

          <input
            type="date"
            className="input input-bordered"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="text-transparent">hello</div>

          <div className="flex justify-between gap-40">
            <button type="button" className="btn btn-soft w-20" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-soft w-20">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAddTask;
