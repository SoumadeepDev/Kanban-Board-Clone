import { useState } from "react";
import { v4 as uuid } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import { useSelector, useDispatch } from "react-redux";
import { addTask, editTask } from "../redux/boardsSlice";

const AddEditTaskModal = ({
  type,
  device,
  setOpenAddEditTask,
  setIsTaskModalOpen,
  prevColIndex = 0,
  taskIndex,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([
    {
      title: "",
      isComplete: false,
      id: uuid(),
    },
  ]);
  const [isValid, setIsValid] = useState(true);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const dispatch = useDispatch();

  const board = useSelector((store) => store.boards).find(
    (board) => board.isActive
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);

  const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];

  const [status, setStatus] = useState(columns[prevColIndex].name);

  const onChange = (id, value) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = value;
      return newState;
    });
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onDelete = (id) => {
    setSubtasks((prevTask) => prevTask.filter((task) => task.id !== id));
  };

  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }
    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  const onSubmit = (type) => {
    if (type === "add") {
      dispatch(addTask({ title, description, subtasks, status, newColIndex }));
    } else {
      dispatch(
        editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
  };

  if (type === "edit" && isFirstLoad) {
    setSubtasks(
      task.subtasks.map((subtask) => {
        return { ...subtask, id: uuid() };
      })
    );
    setTitle(task.title);
    setDescription(task.description);
    setIsFirstLoad(false);
  }

  return (
    <div
      className="px-6 py-6 pb-40 absolute scrollbar-hide overflow-y-scroll left-0 flex right-0 bottom-[-100vh] top-0 bg-[#00000080]"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
    >
      {/* Modal Section  */}
      <div
        className="scrollbar-hide overflow-y-scroll max-h-[95vh] mt-14 my-auto bg-white
        dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a]
        max-w-md mx-auto w-full px-8 py-8 rounded-xl z-50"

        // className="overflow-y-scroll scrollbar-hide
        //  bg-white dark:bg-[#2b2c37] text-black dark:text-white my-auto
        //  font-bold shadow-md shadow-[#363e7e1a] max-w-md mx-auto w-full
        //  px-8 py-8 rounded-xl mt-14 z-50 max-h-[95vh] mb-2"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">
            {type === "edit" ? "Edit" : "Add New"} Task
          </h3>
          {/* Cross Button */}
          <button
            className="bg-transparent border-none cursor-pointer"
            onClick={() => setOpenAddEditTask(false)}
          >
            <img src={crossIcon} alt="Close" className="" />
          </button>
        </div>

        {/* Task Name  */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md
            text-sm border border-gray-600 focus:outline-[#635fc7] ring-0"
            placeholder="e.g. Take a break"
          />
        </div>
        {/* Description  */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Task Description
          </label>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-transparent px-4 py-2 outline-none focus:border-0 min-h-[100px] 
            rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] ring-0"
            placeholder="e.g. It's always good to take break.This 15 minute break will refresh the mind for more work."
          />
        </div>
        {/* Subtask Section  */}
        <div className="mt-8 flex flex-col space-y-2">
          <label className="text-sm dark:text-white text-gray-500">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => {
            return (
              <div key={index} className="flex items-center w-full">
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => {
                    onChange(subtask.id, e.target.value);
                  }}
                  className="bg-transparent outline-none focus:border-0  border flex-grow
                px-4 py-2 rounded-md text-sm border-gray-600 focus:outline-[#635fc7]"
                  placeholder="e.g. Take a coffee break"
                />
                <img
                  src={crossIcon}
                  className="m-4 cursor-pointer"
                  onClick={() => onDelete(subtask.id)}
                />
              </div>
            );
          })}

          {/* button area  */}

          <button
            className="w-full items-center dark:text-[#635fc7]
           dark:bg-white text-white bg-[#635fc7] py-2
           rounded-full scrollbar-hide overflow-auto"
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuid() },
              ]);
            }}
          >
            + Add New Subtask
          </button>
        </div>
        {/* Current Status Section  */}
        <div className="mt-8 flex flex-col space-y-4">
          <label className="text-sm dark:text-white text-gray-600">
            Current Status
          </label>
          <select
            value={status}
            onChange={(e) => onChangeStatus(e)}
            className="select-status flex flex-grow px-4 py-2 rounded-md 
          text-sm bg-transparent focus:border-0 border border-gray-300
          focus:outline-[#635fc7] outline-none"
          >
            {columns.map((column, index) => (
              <option
                value={column.name}
                key={index}
                className=" rounded-md
                text-sm bg-transparent focus:border-0 border border-gray-300
               focus:outline-[#635fc7] outline-none dark:bg-[#2b2c37]
                text-black dark:text-white font-bold shadow-md
                 shadow-[#364e7e1a] max-w-md px-4 py-4"
              >
                {column.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setOpenAddEditTask(false);
                type === "edit" && setIsTaskModalOpen(false);
              }
            }}
            className="w-full items-center text-white bg-[#635fc7] py-2 rounded-full"
          >
            {type === "edit" ? "Save Edit" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddEditTaskModal;
