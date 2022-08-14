import { useEffect, useMemo } from "react";
import "./App.scss";
import { generate } from "./layout-generator";

const App: React.FC = () => {
  const wordList = ["set", "eat", "seat", "east", "tea"];
  const b = generate(wordList);

  return (
    <div className="App">
      <header className="App-header">
        <pre>{b.map((a) => `${a.map((a) => a).join(",")}\n`)}</pre>
      </header>
    </div>
  );
};

export default App;
