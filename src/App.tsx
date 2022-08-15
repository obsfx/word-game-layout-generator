import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.scss";
import { EMPTY, generate } from "./layout-generator";

const App: React.FC = () => {
  const wordList = useMemo(() => {
    return ["set", "eat", "seat", "east", "tea"];
  }, []);

  const [currentBoard, setCurrentBoard] = useState<string[][]>([]);
  const [notPlacedWords, setNotPlacedWords] = useState<string[]>([]);

  const generateNewBoard = useCallback(() => {
    const [board, notPlacedWords] = generate(wordList);
    setCurrentBoard(board);
    setNotPlacedWords(notPlacedWords);
  }, [wordList]);

  useEffect(() => {
    generateNewBoard();
  }, [generateNewBoard]);

  return (
    <div className="App">
      <div className="word-list">
        Word List ({wordList.length}): {wordList.join(", ")}
      </div>

      <div className="word-list">
        Couldn't Placed Words ({notPlacedWords.length}):{" "}
        {notPlacedWords.join(", ")}
      </div>

      <button onClick={generateNewBoard}>Generate</button>

      <div className="board-wrapper">
        {currentBoard.map((row, idx) => {
          return (
            <div key={idx} className="board-wrapper__row">
              {row.map((tile, idx) => (
                <div
                  key={idx}
                  className={`board-wrapper__row__tile${
                    tile !== EMPTY ? " filled" : ""
                  }`}
                >
                  {tile !== EMPTY ? tile : ""}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
