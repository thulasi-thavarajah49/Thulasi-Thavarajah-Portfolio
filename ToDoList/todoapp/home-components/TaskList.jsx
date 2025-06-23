import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../api";
import { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { PreferencesContext } from "../context/PreferencesContext";

export default function TaskList() {
  //to edit todo
  const [activeTodo, setActiveTodo] = useState(null);

  //to add todo
  const [newTodo, setNewTodo] = useState(null);

  //to autocomplete
  const { autoComplete } = useContext(PreferencesContext);

  //to enable deadline features
  const { deadlines } = useContext(PreferencesContext);

  const queryClient = useQueryClient();

  //fetch todos every 30 seconds
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/api/todos", {
        params: {},
      });
      return res.data;
    },
  });

  //to complete todos
  const toggleTodoMutation = useMutation({
    mutationFn: async (id) => {
      return await api.patch(`/api/todos/${id}/toggle`);
    },
    onSuccess: () => {
      //invalidate queries - triggers refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      toast.error("Failed to toggle task.");
    },
  });

  //add todo
  const addTodoMutation = useMutation({
    mutationFn: async (newTodo) => {
      const res = await api.post(`/api/todos/`, newTodo);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task added!");

      //invalidate queries and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add todo.");
    },
  });

  //update todos
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, updatedTodo }) => {
      const res = await api.put(`/api/todos/${id}`, {
        ...updatedTodo,

        //reset notified, so that toast can be displayed again for the new deadline
        notified: false,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task updated!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update todo.");
    },
  });

  //delete todos
  const deleteTodoMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/api/todos/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task deleted!");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete todo.");
    },
  });

  //group tasks
  function groupTodosByDeadline(todos) {
    const groups = {};

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];

      let groupKey;
      if (todo.deadline) {
        const date = new Date(todo.deadline);
        groupKey = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
      } else {
        groupKey = "No Deadline";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(todo);
    }

    // Convert the groups object into an array of [date, todos] pairs
    const groupedList = [];

    for (let key in groups) {
      groupedList.push([key, groups[key]]);
    }

    // Sort by date, keeping "No Deadline" at the end
    groupedList.sort((a, b) => {
      if (a[0] === "No Deadline") return 1;
      if (b[0] === "No Deadline") return -1;
      return new Date(a[0]) - new Date(b[0]);
    });

    return groupedList;
  }

  //re-render page every 29 seconds

  const [, setTick] = useState(0); // dummy state to trigger re-render

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1); // force re-render
    }, 29000); // 29 seconds

    return () => clearInterval(interval);
  }, []);

  //dates not stored in the same format - so convert to same formatted strings
  function formatLocalAsISOWithZ(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}Z`;
  }

  //convert dates to same format in a string, then compare
  function isOverdue(todo) {
    if (!todo.deadline || todo.completed) return false;

    const deadline = todo.deadline;
    const newDate = new Date();
    const now = formatLocalAsISOWithZ(newDate);

    console.log("Deadline (local):", deadline);
    console.log("Now (local):", now);

    return now > deadline;
  }

  //mark as notified
  const notifiedMutation = useMutation({
    mutationFn: async ({ id, updatedTodo }) => {
      const res = await api.put(`/api/todos/${id}`, {
        ...updatedTodo,
        notified: true,
      });
      console.log("Update response:", res.data);
      return res.data;
    },
    onSuccess: (responseData) => {
      const updatedTodo = responseData.todo;
      toast.error(`Task "${updatedTodo.title}" is overdue!`, {
        icon: (
          <span
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: "18px",
              userSelect: "none",
            }}
          >
            ❗
          </span>
        ),
      });

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      console.error("Update todo error:", err);
      toast.error(err.response?.data?.message || "Failed to update todo.");
    },
  });

  useEffect(() => {
    if (!data?.todos) return;

    data.todos.forEach((todo) => {
      if (
        isOverdue(todo) && // Your existing overdue checker
        !todo.notified && // Only notify if not already notified
        !todo.completed // Only if task is not completed
      ) {
        notifiedMutation.mutate({ id: todo.id, updatedTodo: todo });
      }
    });
  }, [data]);

  if (isLoading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <div class="card card-xl bg-base-100 base-content h-full">
      <div class="card-body h-full p-3">
        <div className="flex flex-row justify-between">
          <h2 class="card-title text-[30px]">Tasks</h2>
          <label
            htmlFor="add_modal"
            className="btn btn-success text-[18px]"
            onClick={() => setNewTodo({ title: "", deadline: "" })}
          >
            + Add Task
          </label>
        </div>
        <ul className="mt-4">
          {deadlines
            ? groupTodosByDeadline(data.todos).map(([date, todos]) => (
                <div key={date} className="mb-4">
                  <h3 className="text-[18px] font-semibold mb-2 ">{date}</h3>
                  <ul className="pl-4">
                    {todos.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center gap-2 mb-1"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-success checkbox-sm"
                          checked={todo.completed}
                          onChange={() => toggleTodoMutation.mutate(todo.id)}
                        />
                        <label
                          htmlFor="edit_modal"
                          className={`btn btn-ghost justify-between flex-1 text-left text-[20px] font-light cursor-pointer
    ${
      todo.completed
        ? "line-through text-gray-500"
        : isOverdue(todo)
        ? "text-red-500 font-semibold"
        : ""
    }
  `}
                          onClick={() => setActiveTodo(todo)}
                        >
                          <div className="flex flex-row w-full justify-between">
                            <div>{todo.title}</div>
                            <div> {todo.deadline?.slice(11, 16)}</div>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            : data.todos.map((todo) => (
                <li key={todo.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success checkbox-sm"
                    checked={todo.completed}
                    onChange={() => toggleTodoMutation.mutate(todo.id)}
                  />
                  <label
                    htmlFor="edit_modal"
                    className={`btn btn-ghost justify-start flex-1 text-left text-[20px] font-light cursor-pointer ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                    onClick={() => setActiveTodo(todo)}
                  >
                    {todo.title}
                  </label>
                </li>
              ))}
        </ul>

        {activeTodo && (
          <>
            <input type="checkbox" id="edit_modal" className="modal-toggle" />
            <div className="modal" role="dialog">
              <div className="modal-box">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box p-4">
                  <h2 className="text-[18px] mb-2">{activeTodo.title}</h2>

                  <label className="label">Title</label>

                  <input
                    type="text"
                    className="input w-full mb-4"
                    value={activeTodo.title}
                    placeholder="Enter task name"
                    onChange={(e) =>
                      setActiveTodo({ ...activeTodo, title: e.target.value })
                    }
                  />

                  <label className="label">Deadline</label>
                  <input
                    type="datetime-local"
                    className="input w-full"
                    value={activeTodo.deadline?.slice(0, 16)} // Format: "YYYY-MM-DDTHH:mm"
                    onChange={(e) =>
                      setActiveTodo({ ...activeTodo, deadline: e.target.value })
                    }
                  />
                </fieldset>
                <div className="flex justify-between">
                  <div className="modal-action">
                    <label
                      htmlFor="edit_modal"
                      className="btn"
                      onClick={() => setActiveTodo(null)}
                    >
                      Cancel
                    </label>
                    <label
                      htmlFor="edit_modal"
                      className="btn"
                      onClick={() => {
                        deleteTodoMutation.mutate({
                          id: activeTodo.id,
                        });
                        setActiveTodo(null);
                      }}
                    >
                      Delete
                    </label>
                  </div>
                  <div className="modal-action">
                    <label
                      htmlFor="edit_modal"
                      className="btn"
                      onClick={() => {
                        const updatedTodo = {
                          ...activeTodo,
                          deadline: activeTodo.deadline || null,
                        };

                        updateTodoMutation.mutate({
                          id: activeTodo.id,
                          updatedTodo,
                        });

                        setActiveTodo(null);
                      }}
                    >
                      Submit
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {newTodo && (
          <>
            <input type="checkbox" id="add_modal" className="modal-toggle" />
            <div className="modal" role="dialog">
              <div className="modal-box">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box p-4">
                  <h2 className="text-[18px] mb-2">New Task</h2>

                  <label className="label">Title</label>
                  <input
                    type="text"
                    className="input w-full mb-4"
                    value={newTodo.title}
                    placeholder="Enter task name"
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                  />

                  <label className="label">Deadline</label>
                  <input
                    type="datetime-local"
                    className="input w-full"
                    value={newTodo.deadline}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, deadline: e.target.value })
                    }
                  />
                </fieldset>

                <div className="modal-action">
                  <label
                    htmlFor="add_modal"
                    className="btn"
                    onClick={() => setNewTodo(null)}
                  >
                    Cancel
                  </label>
                  <label
                    htmlFor="add_modal"
                    className="btn"
                    onClick={() => {
                      const todoToAdd = {
                        ...newTodo,
                        deadline: newTodo.deadline || null,
                        completed: autoComplete,
                      };

                      addTodoMutation.mutate(todoToAdd);

                      setNewTodo(null);
                    }}
                  >
                    Add
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
