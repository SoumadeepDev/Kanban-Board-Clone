import { useState } from "react";
import "./App.css";
import Center from "./components/Center";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { setBoardActive } from "./redux/boardsSlice";
import EmptyBoard from "./components/EmptyBoard";

function App() {
  const [boardModalOpen, setBoardModalOpen] = useState(false);

  const dispatch = useDispatch();
  const boards = useSelector((store) => store.boards);
  const activeBoard = boards.find((board) => board.isActive);

  if (!activeBoard && boards.length > 0) {
    dispatch(setBoardActive({ index: 0 }));
  }

  return (
    <div className="overflow-hidden overflow-x-scroll scrollbar-hide">
      <>
        {boards.length > 0 ? (
          <>
            {/* Header Section  */}
            <Header
              boardModalOpen={boardModalOpen}
              setBoardModalOpen={setBoardModalOpen}
            />
            {/* Center Section  */}
            <Center
              boardModalOpen={boardModalOpen}
              setBoardModalOpen={setBoardModalOpen}
            />
          </>
        ) : (
          <>
            <EmptyBoard type="add" />
          </>
        )}
      </>
    </div>
  );
}
export default App;
