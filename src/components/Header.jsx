import logo from "../assets/logo-mobile.svg";
import iconUp from "../assets/icon-chevron-up.svg";
import iconDown from "../assets/icon-chevron-down.svg";
import { useState } from "react";
import ellipsis from "../assets/icon-vertical-ellipsis.svg";
import HeaderDropDown from "./HeaderDropDown";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import { useDispatch, useSelector } from "react-redux";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import Menu from "./Menu";
import DeleteModal from "../modals/DeleteModal";
import { deleteBoard, setBoardActive } from "../redux/boardsSlice";

const Header = ({ boardModalOpen, setBoardModalOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [openAddEditTask, setOpenAddEditTask] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);

  const dispatch = useDispatch();
  const boards = useSelector((store) => store.boards);
  const board = boards.find((board) => board.isActive);

  const setOpenEditModal = () => {
    setBoardModalOpen(true);
    setIsMenuOpen(false);
  };
  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsMenuOpen(false);
  };
  const onDeleteBtnClick = () => {
    dispatch(deleteBoard());
    dispatch(setBoardActive({ index: 0 }));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0">
      <header className="flex justify-between dark:text-white items-center">
        {/* Left Side */}

        <div className=" flex items-center space-x-2 md:space-x-4">
          <img src={logo} alt="logo" className="h-6 w-6" />
          <h3 className="hidden md:inline-block font-bold font-sans md:text-4xl">
            Kanban
          </h3>
          <div className="flex items-center">
            <h3 className="truncate max-w-[350px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              {board.name}
            </h3>
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown icon"
              className="w-3 ml-2 md:hidden cursor-pointer"
              onClick={() => {
                setOpenDropdown((state) => !state);
                setBoardType("add");
                setIsMenuOpen(false);
              }}
            />
          </div>
        </div>

        {/* Right Side */}

        <div className="flex space-x-4 items-center md:space-x-6">
          <button
            className=" hidden md:block button"
            onClick={() => setOpenAddEditTask((state) => !state)}
          >
            + Add New Task
          </button>

          <button
            className="button py-1 px-3 md:hidden"
            onClick={() => setOpenAddEditTask((state) => !state)}
          >
            +
          </button>
          <img
            src={ellipsis}
            alt="menu"
            className="cursor-pointer h-6"
            onClick={() => {
              setBoardType("edit");
              setOpenDropdown(false);
              setIsMenuOpen((state) => !state);
            }}
          />
          {isMenuOpen && (
            <Menu
              type="Boards"
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
        </div>
      </header>
      {openDropdown && (
        <HeaderDropDown
          setOpenDropdown={setOpenDropdown}
          setBoardModalOpen={setBoardModalOpen}
        />
      )}
      {boardModalOpen && (
        <AddEditBoardModal
          setBoardType={setBoardType}
          setBoardModalOpen={setBoardModalOpen}
          type={boardType}
        />
      )}
      {openAddEditTask && (
        <AddEditTaskModal
          type="add"
          device="mobile"
          setOpenAddEditTask={setOpenAddEditTask}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          type="board"
          title={board.name}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )}
    </div>
  );
};
export default Header;
