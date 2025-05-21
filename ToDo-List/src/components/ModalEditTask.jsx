import { useState } from "react";

function ModalEditTask({ task, onClose, onSave, onDelete }) {
  const [name, setName] = useState(task.name);
  const [date, setDate] = useState(task.date || "");

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      onSave({ ...task, name, date });
    }
  }

  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
      <div className="modal-card p-6 rounded-lg w-full max-w-md">
        <h2 className="card-title">Edit Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-stretch">
          <div className="text-transparent">hello</div>
          <input
            type="text"
            className="input input-bordered"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        
          <input
            type="date"
            className="input input-bordered"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <div className="text-transparent">hello</div>
          <div className="flex justify-between mt-4">
            <button type="button" className="add-task-button" onClick={onDelete}>Delete</button>
            <div className="flex gap-2">
              <button type="button" className="add-task-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="add-task-button">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditTask;
