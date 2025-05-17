import { useState } from "react";

//function to add a task item, and mark if it is done
function TaskItem(task) {

  //set initial state of task completion to false
  const [isDone, setIsDone] = useState(false);

  return (
    //create a division with the task name and a button that can mark the task as complete 
    <div>
      <p>
        {task.title}
        <button
          onClick={() => setIsDone(true)}
        >Complete
        </button>
      </p>
    </div>
  );
}