enum DIRECTION {
  VERTICAL,
  HORIZONTAL,
}

export const EMPTY = "EMPTY";

const isVerticalBoardSectionAvailable = (
  board: string[][],
  row: number,
  col: number,
  offset: number,
  length: number
) => {
  const start = row + offset;
  const end = start + length - 1;

  for (let i = start; i <= end; i++) {
    if (i === end && board[i + 1] && board[i + 1][col] !== EMPTY) {
      return false;
    }

    if (i === start && board[i - 1] && board[i - 1][col] !== EMPTY) {
      return false;
    }

    if (i === row) {
      continue;
    }

    if (board[i][col - 1] !== EMPTY || board[i][col + 1] !== EMPTY) {
      return false;
    }
  }

  return true;
};

const inserVerticalWordSection = (
  board: string[][],
  row: number,
  col: number,
  offset: number,
  length: number,
  word: string
) => {
  const start = row + offset;
  const end = start + length - 1;
  const charQueue = word.split("");

  for (let i = start; i <= end; i++) {
    board[i][col] = charQueue.shift() || "";
  }
};

const isHorizontalBoardSectionAvailable = (
  board: string[][],
  row: number,
  col: number,
  offset: number,
  length: number
) => {
  const start = col + offset;
  const end = start + length - 1;

  for (let i = start; i <= end; i++) {
    if (i === end && board[row][i + 1] !== EMPTY) {
      return false;
    }

    if (i === start && board[row][i - 1] !== EMPTY) {
      return false;
    }

    if (i === col) {
      continue;
    }

    if (
      (row > 0 && board[row - 1][i] !== EMPTY) ||
      (row < board.length - 1 && board[row + 1][i] !== EMPTY)
    ) {
      return false;
    }
  }

  return true;
};

const inserHorizontalWordSection = (
  board: string[][],
  row: number,
  col: number,
  offset: number,
  length: number,
  word: string
) => {
  const start = col + offset;
  const end = start + length - 1;
  const charQueue = word.split("");

  for (let i = start; i <= end; i++) {
    board[row][i] = charQueue.shift() || "";
  }
};

const createBoard = (size: number) => {
  return [...new Array(size)].map(() => [...new Array(size)].fill(EMPTY));
};

export const generate = (words: string[]): [string[][], string[]] => {
  const possibleMaxBoardSize = words.reduce(
    (prev, current) => prev + current.length,
    0
  );
  const board: string[][] = createBoard(possibleMaxBoardSize);

  const queue = [...words];
  const placed: {
    word: string;
    row: number;
    col: number;
    direction: DIRECTION;
  }[] = [];

  const randomIndex = Math.floor(Math.random() * queue.length);
  const initialPickedWord = queue.splice(randomIndex, 1)[0];

  if (placed.length === 0) {
    const initialDirection =
      Math.random() * 2 < 1 ? DIRECTION.VERTICAL : DIRECTION.HORIZONTAL;

    const pivotRow = Math.floor(possibleMaxBoardSize / 2);
    const pivotCol = Math.floor(possibleMaxBoardSize / 2);

    if (initialDirection === DIRECTION.VERTICAL) {
      inserVerticalWordSection(
        board,
        pivotRow,
        pivotCol + initialPickedWord.length,
        0,
        initialPickedWord.length,
        initialPickedWord
      );

      placed.push({
        word: initialPickedWord,
        row: pivotRow,
        col: pivotCol + initialPickedWord.length,
        direction: initialDirection,
      });
    } else {
      inserHorizontalWordSection(
        board,
        pivotRow + initialPickedWord.length,
        pivotCol,
        0,
        initialPickedWord.length,
        initialPickedWord
      );

      placed.push({
        word: initialPickedWord,
        row: pivotRow + initialPickedWord.length,
        col: pivotCol,
        direction: initialDirection,
      });
    }
  }

  for (let i = 0; i < placed.length; i++) {
    const { word, row, col, direction } = placed[i];

    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const matchedWordWithChar = queue.find(
        (queueWord) => queueWord.indexOf(char) > -1
      );

      if (!matchedWordWithChar) {
        continue;
      }

      const matchedIndex = matchedWordWithChar.indexOf(char);
      const currentDirection =
        direction === DIRECTION.HORIZONTAL
          ? DIRECTION.VERTICAL
          : DIRECTION.HORIZONTAL;

      if (currentDirection === DIRECTION.VERTICAL) {
        if (
          isVerticalBoardSectionAvailable(
            board,
            row,
            col + j,
            -matchedIndex,
            matchedWordWithChar.length
          )
        ) {
          inserVerticalWordSection(
            board,
            row,
            col + j,
            -matchedIndex,
            matchedWordWithChar.length,
            matchedWordWithChar
          );
          placed.push({
            word: matchedWordWithChar,
            row: row - matchedIndex,
            col: col + j,
            direction: currentDirection,
          });
          queue.splice(queue.indexOf(matchedWordWithChar), 1);
        }
      } else {
        if (
          isHorizontalBoardSectionAvailable(
            board,
            row + j,
            col,
            -matchedIndex,
            matchedWordWithChar.length
          )
        ) {
          inserHorizontalWordSection(
            board,
            row + j,
            col,
            -matchedIndex,
            matchedWordWithChar.length,
            matchedWordWithChar
          );
          placed.push({
            word: matchedWordWithChar,
            row: row + j,
            col: col - matchedIndex,
            direction: currentDirection,
          });
          queue.splice(queue.indexOf(matchedWordWithChar), 1);
        }
      }
    }
  }
  return [board, queue];
};
