import { useState } from "react";

//takes in two props - closing and adding functions 
function ModalAddTask({ onClose, onAdd }) {

  //initialize task variables 
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  //submit form functions
  function handleSubmit(e) {
    e.preventDefault();

    //only add task if task name has characters that are not spaces 
    if (name.trim()) {

      //calls onAdd and onClose from TaskList
      onAdd({ name, date });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-card p-6 rounded-lg w-full max-w-md">
        <h2 className="card-title">Add Task</h2>
        <div className="text-transparent">hello</div>

        {/* call form submission */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-stretch">

          {/* take in inputs  */}
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Task name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <div className="text-transparent">hello</div> {/* fix to make proper transparent dividers */}

          {/* take in inputs  */}
          <input
            type="date"
            className="input input-bordered"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          
          <div className="text-transparent">hello</div>

          {/* buttons to add/close  */}
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
