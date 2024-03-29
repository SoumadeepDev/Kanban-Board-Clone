import { CiWarning } from "react-icons/ci";
import crossIcon from "../assets/icon-cross.svg";

const DeleteModal = ({
  type,
  title,
  onDeleteBtnClick,
  setIsDeleteModalOpen,
}) => {
  return (
    // Delete Modal Container
    <div
      className="fixed right-0 bottom-0 left-0 top-0 px-2 py-4 
    overflow-scroll scrollbar-hide z-50 justify-center items-center
    flex bg-[#00000080]"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setIsDeleteModalOpen(false);
      }}
    >
      {/* Delete Modal  */}

      <div
        className="scrollbar-hide overflow-y-scroll max-h-[95vh] max-w-md my-auto
       bg-white dark:bg-[#2b2c37] text-black dark:text-white w-full px-8 
       py-8 rounded-xl"
      >
        <h3 className="font text-red-500 text-xl">
          Do you want to delete this {type} ?
        </h3>

        {type === "task" ? (
          <p
            className="text-gray-500 font-semibold tracking-wide text-sm 
            pt-6"
          >
            Are you sure to delete the "{title}" task and its subtasks? Your
            actions cannot be reversed.
          </p>
        ) : (
          <p
            className="text-gray-500 font-semibold tracking-wide text-sm 
            pt-6 dark:text-white"
          >
            Are you sure to delete the (
            <span style={{ fontWeight: 700, color: "red" }}>{title}</span>)
            board and its tasks?
            <br />
            <span className="flex items-center mt-4 text-red-300">
              <CiWarning className="mr-1 text-yellow-500 text-lg" /> Your
              actions cannot be reversed!
            </span>
          </p>
        )}

        <div className="flex w-full mt-4 items-center justify-center space-x-4">
          <button
            className="w-full items-center text-white font-semibold hover:opacity-75
          bg-red-500 py-2 rounded-full"
            onClick={onDeleteBtnClick}
          >
            Delete
          </button>
          <button
            className="w-full items-center text-[#635fc7] font-semibold hover:opacity-75
          bg-[#635fc71a] py-2 rounded-full"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
