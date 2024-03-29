import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import ElipsisMenu from "../components/Menu";
import Subtask from "../components/Subtask";
import { deleteTask, setTaskStatus } from "../redux/boardsSlice";
import DeleteModal from "../modals/DeleteModal";
import AddEditTaskModal from "../modals/AddEditTaskModal";

const TaskModal = ({ colIndex, taskIndex, setTaskModalOpen }) => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const columns = board.columns;
  const col = columns.find((col, i) => colIndex === i);
  const task = col.tasks.find((task, i) => taskIndex === i);
  const subtasks = task.subtasks;

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });
  const [status, setStatus] = useState(task.status);
  console.log(status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));
  const [elipsisMenuOpen, setElipsisMenuOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setElipsisMenuOpen(false);
  };

  const onClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    dispatch(
      setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      })
    );
    setTaskModalOpen(false);
  };
  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      dispatch(deleteTask({ taskIndex, colIndex }));
      setTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div
      onClick={(e) => onClose(e)}
      className="fixed right-0 left-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 bottom-0 justify-center items-center flex bg-[#00000080]"
    >
      {/* Modal Section  */}
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
        <div className="relative flex justify-between w-full items-center">
          <h1 className="text-lg">{task.title}</h1>
          <img
            src={elipsis}
            className="cursor-pointer h-6"
            onClick={() => setElipsisMenuOpen((state) => !state)}
          />
          {elipsisMenuOpen && (
            <ElipsisMenu
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              type="Task"
            />
          )}
        </div>
        <p className="text-gray-500 font-semibold tracking-wide text-sm pt-6">
          {task.description}
        </p>
        <p className=" pt-6 text-gray-500 tracking-widest text-sm">
          Subtasks ({completed} of {subtasks.length})
        </p>

        {/* subtasks section */}

        <div className=" mt-3 space-y-2">
          {subtasks.map((subtask, index) => {
            return (
              <Subtask
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
              />
            );
          })}
        </div>

        {/* Current Status Section  */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
            value={status}
            onChange={(e) => onChange(e)}
          >
            {columns.map((col, index) => (
              <option
                key={index}
                className="status-options rounded-md
                text-sm bg-transparent focus:border-0 border border-gray-300
               focus:outline-[#635fc7] outline-none dark:bg-[#2b2c37]
                text-black dark:text-white font-bold shadow-md
                 shadow-[#364e7e1a] max-w-md px-4 py-4"
              >
                {col.name}
              </option>
            ))}
          </select>
        </div>
        {/* Button  */}
        <div className="flex w-full mt-4 items-center justify-center space-x-4">
          <button
            className="w-[200px] flex mx-auto mt-4 items-center justify-center text-white font-semibold hover:opacity-75
        bg-green-500 py-2 rounded-full text-center"
            onClick={() => {
              dispatch(
                setTaskStatus({
                  taskIndex,
                  colIndex,
                  newColIndex,
                  status,
                })
              );
              setTaskModalOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="task"
          title={task.title}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setOpenAddEditTask={setIsAddTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
          setIsTaskModalOpen={setTaskModalOpen}
        />
      )}
    </div>
  );
};
export default TaskModal;
