import { useState } from "react";
import { v4 as uuid, validate } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import { useDispatch, useSelector } from "react-redux";
import { addBoard, editBoard } from "../redux/boardsSlice";

const AddEditBoardModal = ({ setBoardModalOpen, type }) => {
  console.log(type);
  const dispatch = useDispatch();
  const board = useSelector((store) => store.boards).find(
    (board) => board.isActive
  );
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [newColumns, setNewColumns] = useState([
    {
      name: "Todo",
      tasks: [],
      id: uuid(),
    },
    {
      name: "Doing",
      tasks: [],
      id: uuid(),
    },
  ]);
  if (type === "edit" && isFirstLoad) {
    // console.log(isFirstLoad);
    setNewColumns(
      board.columns.map((col) => {
        return { ...col, id: uuid() };
      })
    );
    setName(board.name);
    setIsFirstLoad(false);
  }

  const onChange = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((item) => item.id !== id));
  };

  const validate = () => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }
    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  const onSubmit = (type) => {
    setBoardModalOpen(false);
    if (type === "add") {
      dispatch(addBoard({ name, newColumns }));
    } else {
      dispatch(editBoard({ name, newColumns }));
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);
      }}
      className="fixed right-0 left-0 top-0 bottom-0 px-2 py-4 z-50 justify-center items-center flex bg-[#00000080] scrollbar-hide"
    >
      {/* Modal Section */}
      <div
        className=" fixed scrollbar-hide max-h-[90vh] overflow-y-scroll
              bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md
              shadow-[#363e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl mt-10"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg">
            {type === "edit" ? "Edit" : "Add New"} Board
          </h3>

          <button
            className="bg-transparent border-none cursor-pointer "
            onClick={() => setBoardModalOpen(false)}
          >
            <img src={crossIcon} alt="Close" className="" />
          </button>
        </div>

        {/* Task Name  */}

        <div className="mt-8 flex flex-col space-y-3">
          <label
            htmlFor="board-name-input"
            className="text-sm dark:text-white text-gray-500"
          >
            Board Name
          </label>
          <input
            type="text"
            className="bg-transparent px-4 py-2 rounded-md text-sm border
             border-gray-600 focus:outline-[#635f37] outline-1 ring-0"
            placeholder="e.g. Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
          />
        </div>

        {/* Board Columns Section  */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500">
            Board Columns
          </label>
          {newColumns.map((column, index) => {
            return (
              <div className="flex items-center w-full" key={index}>
                <input
                  type="text"
                  className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm border
                           border-gray-600 focus:outline-[#735fc7] outline-none"
                  value={column.name}
                  onChange={(e) => {
                    onChange(column.id, e.target.value);
                  }}
                />
                <img
                  src={crossIcon}
                  className="cursor-pointer m-4"
                  onClick={() => {
                    onDelete(column.id);
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* Button Section  */}

        <div>
          <button
            className="w-full items-center hover:opacity-75 dark:text-[#635fc7]
          dark:bg-white text-white bg-[#635fc7] py-2 mt-4 rounded-full"
            onClick={() => {
              setNewColumns((state) => [
                ...state,
                { name: "", tasks: [], id: uuid() },
              ]);
            }}
          >
            +Add New Column
          </button>
          <button
            className="w-full items-center hover:opacity-75 dark:text-white
          dark:bg-[#635fc7] text-white bg-[#635fc7] py-2 mt-8 relative
           rounded-full"
            onClick={() => {
              const isValid = validate();
              if (isValid === true) {
                onSubmit(type);
              }
            }}
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddEditBoardModal;
