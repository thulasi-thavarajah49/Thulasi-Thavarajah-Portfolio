import { useState } from "react";

function ModalAddTask({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name, date });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-card p-6 rounded-lg w-full max-w-md">
        <h2 className="card-title">Add Task</h2>
        <div className="text-transparent">hello</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-stretch">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Task name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="text-transparent">hello</div>
          <input
            type="date"
            className="input input-bordered"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <div className="text-transparent">hello</div>
          <div className="flex justify-between gap-40">
            <button type="button" className="add-task-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-task-button">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAddTask;
