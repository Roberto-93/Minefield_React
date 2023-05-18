//Board.tsx

import React, { useState, useEffect, useCallback } from 'react';
import './Board.css';
import Grid from '../Grid/Grid'


const numRows = 10;
const numCols = 10;
const numMines = 20;
const Board = () => {
    const [grid, setGrid] = useState<Array<{ row: number; col: number; isMine: boolean; isRevealed: boolean; isFlagged: boolean; neighbouringMines: number; }[]>>([]);
    const [isGameWon, setIsGameWon] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [moveCount, setMoveCount] = useState(0);
    const [bombCount, setBombCount] = useState(numMines);
    const [showAllBombs, setShowAllBombs] = useState(false);

    


    const initializeGrid = useCallback(() => {
        const newGrid = [];

        for (let row = 0; row < numRows; row++) {
            const rowArr = [];

            for (let col = 0; col < numCols; col++) {
                rowArr.push({
                    row,
                    col,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighbouringMines: 0,
                });
            }

            newGrid.push(rowArr);
        }
        // Posizionamento casuale delle mine
        let minesPlaced = 0;

        while (minesPlaced < numMines) {
            const randomRow = Math.floor(Math.random() * numRows);
            const randomCol = Math.floor(Math.random() * numCols);

            if (!newGrid[randomRow][randomCol].isMine) {
                newGrid[randomRow][randomCol].isMine = true;
                minesPlaced++;
            }
        }

        // Calcolo delle mine vicine
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (!newGrid[row][col].isMine) {
                    let count = 0;

                    // Conta le mine nelle 8 celle circostanti
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const newRow = row + i;
                            const newCol = col + j;

                            if (
                                newRow >= 0 &&
                                newRow < numRows &&
                                newCol >= 0 &&
                                newCol < numCols &&
                                newGrid[newRow][newCol].isMine
                            ) {
                                count++;
                            }
                        }
                    }

                    newGrid[row][col].neighbouringMines = count;
                }
            }
        }


        setGrid(newGrid);
        setMoveCount(0);
        setBombCount(numMines);
        setIsGameWon(false);
    }, []);


    useEffect(() => {
        initializeGrid();
    }, [initializeGrid]);

    const resetGame = () => {
        initializeGrid();
        setIsGameOver(false);
        setShowAllBombs(false);
        // Ripristina altri stati del gioco se necessario
    };



    const handleClick = (row: number, col: number) => {
        if (isGameOver) {
            return;
        }

        const newGrid = [...grid];
        const cell = newGrid[row][col];

        if (cell.isRevealed || cell.isFlagged) {
            return;
        }

        if (cell.isMine) {
            handleGameOver(); // Chiamata alla funzione per terminare il gioco
            setShowAllBombs(true); // Mostra tutte le bombe

            return;
        }

        // Rivelare la cella e incrementare il conteggio delle mosse
        cell.isRevealed = true;
        setGrid(newGrid);
        setMoveCount(moveCount + 1);

        if (cell.neighbouringMines === 0) {
            revealCell(row, col);
        }
    };

    const handleGameOver = () => {
        setIsGameOver(true);
        // Altre azioni da eseguire al termine del gioco
    };



    const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
        event.preventDefault(); // Previeni il menu contestuale del browser

        const newGrid = [...grid];
        const cell = newGrid[row][col];
        if (cell.isRevealed) {
            return;
        }

        // Contrassegna/rimuovi la bandierina
        cell.isFlagged = !cell.isFlagged;

        if (cell.isFlagged) {
            setBombCount(bombCount - 1);
        } else {
            setBombCount(bombCount + 1);
        }

        setGrid(newGrid);
    };



    const revealCell = (row: number, col: number) => {
        // const queue = [];
        const newGrid = [...grid];

        if (newGrid[row][col].isRevealed || newGrid[row][col].isMine) {
            return;
        }

        newGrid[row][col].isRevealed = true;
        setGrid(newGrid);

        if (newGrid[row][col].neighbouringMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;

                    if (
                        newRow >= 0 &&
                        newRow < numRows &&
                        newCol >= 0 &&
                        newCol < numCols
                    ) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    };



    const checkWin = useCallback(() => {
        if (!grid || grid.length === 0) {
            return false;
        }
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = grid[row][col];
                if (!cell.isMine && !cell.isRevealed) {
                    return false; // Non tutte le celle non minate sono state rivelate
                }
            }
        }
        return true; // Tutte le celle non minate sono state rivelate
    }, [grid]);


    useEffect(() => {
        if (checkWin()) {
            setIsGameWon(true);
        }
    }, [grid, checkWin]);


    return (
        <div className="board">
            <div>
                {/* Rendering della griglia e altri elementi del gioco */}
                <button onClick={resetGame}>Riavvia il gioco</button>
                <div>Mosse: {moveCount}</div>
                <div>Bombe: {bombCount}</div>
            </div>
            {isGameOver && <div>Hai perso! Game Over</div>}
            {isGameWon && <div>Hai vinto il gioco!</div>}

            <Grid
                grid={grid}
                handleClick={handleClick}
                handleRightClick={handleRightClick}
                showAllBombs={showAllBombs}
            />
        </div>

    );
};

export default Board;


// import React, { useState, useEffect, useCallback } from 'react';
// import './Board.css';
// import Grid from '../Grid/Grid';

// const Board = () => {
//   const [numRows, setNumRows] = useState(10);
//   const [numCols, setNumCols] = useState(10);
//   const [numMines, setNumMines] = useState(20);
//   const [grid, setGrid] = useState<{ row: number; col: number; isMine: boolean; isRevealed: boolean; isFlagged: boolean; neighbouringMines: number; }[][]>([]);
//   const [isGameWon, setIsGameWon] = useState(false);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [moveCount, setMoveCount] = useState(0);
//   const [bombCount, setBombCount] = useState(numMines);
//   const [showAllBombs, setShowAllBombs] = useState(false);

//   const initializeGrid = useCallback(() => {
//     const newGrid = [];

//     for (let row = 0; row < numRows; row++) {
//       const rowArr = [];

//       for (let col = 0; col < numCols; col++) {
//         rowArr.push({
//           row,
//           col,
//           isMine: false,
//           isRevealed: false,
//           isFlagged: false,
//           neighbouringMines: 0,
//         });
//       }

//       newGrid.push(rowArr);
//     }

//     // Posizionamento casuale delle mine
//     let minesPlaced = 0;

//     while (minesPlaced < numMines) {
//       const randomRow = Math.floor(Math.random() * numRows);
//       const randomCol = Math.floor(Math.random() * numCols);

//       if (!newGrid[randomRow][randomCol].isMine) {
//         newGrid[randomRow][randomCol].isMine = true;
//         minesPlaced++;
//       }
//     }

//     // Calcolo delle mine vicine
//     for (let row = 0; row < numRows; row++) {
//       for (let col = 0; col < numCols; col++) {
//         if (!newGrid[row][col].isMine) {
//           let count = 0;

//           // Conta le mine nelle 8 celle circostanti
//           for (let i = -1; i <= 1; i++) {
//             for (let j = -1; j <= 1; j++) {
//               const newRow = row + i;
//               const newCol = col + j;

//               if (
//                 newRow >= 0 &&
//                 newRow < numRows &&
//                 newCol >= 0 &&
//                 newCol < numCols &&
//                 newGrid[newRow][newCol].isMine
//               ) {
//                 count++;
//               }
//             }
//           }

//           newGrid[row][col].neighbouringMines = count;
//         }
//       }
//     }

//     setGrid(newGrid);
//     setMoveCount(0);
//     setBombCount(numMines);
//     setIsGameWon(false);
//   }, [numRows, numCols, numMines]);

//   useEffect(() => {
//     initializeGrid();
//   }, [initializeGrid]);

//   const resetGame = () => {
//     initializeGrid();
//     setIsGameOver(false);
//     setShowAllBombs(false);
//     // Ripristina altri stati del gioco se necessario
//   };

//   const handleClick = (row:number, col:number) => {
//     if (isGameOver) {
//       return;
//     }

//     const newGrid = [...grid];
//     const cell = newGrid[row][col];

//     if (cell.isRevealed || cell.isFlagged) {
//       return;
//     }

//     if (cell.isMine) {
//       handleGameOver();
//       setShowAllBombs(true);
//       return;
//     }

//     cell.isRevealed = true;
//     setGrid(newGrid);
//     setMoveCount(moveCount + 1);

//     if (cell.neighbouringMines === 0) {
//       revealCell(row, col);
//     }
//   };

//   const handleGameOver = () => {
//     setIsGameOver(true);
//     // Altre azioni da eseguire al termine del gioco
//   };

//   const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
//     event.preventDefault();

//     const newGrid = [...grid];
//     const cell = newGrid[row][col];

//     if (cell.isRevealed) {
//       return;
//     }

//     cell.isFlagged = !cell.isFlagged;

//     if (cell.isFlagged) {
//       setBombCount(bombCount - 1);
//     } else {
//       setBombCount(bombCount + 1);
//     }

//     setGrid(newGrid);
//   };

//   const revealCell = (row:number, col:number) => {
//     const newGrid = [...grid];

//     if (newGrid[row][col].isRevealed || newGrid[row][col].isMine) {
//       return;
//     }

//     newGrid[row][col].isRevealed = true;
//     setGrid(newGrid);

//     if (newGrid[row][col].neighbouringMines === 0) {
//       for (let i = -1; i <= 1; i++) {
//         for (let j = -1; j <= 1; j++) {
//           const newRow = row + i;
//           const newCol = col + j;

//           if (
//             newRow >= 0 &&
//             newRow < numRows &&
//             newCol >= 0 &&
//             newCol < numCols
//           ) {
//             revealCell(newRow, newCol);
//           }
//         }
//       }
//     }
//   };

//   const checkWin = useCallback(() => {
//     if (!grid || grid.length === 0) {
//       return false;
//     }
//     for (let row = 0; row < numRows; row++) {
//       for (let col = 0; col < numCols; col++) {
//         const cell = grid[row][col];
//         if (!cell.isMine && !cell.isRevealed) {
//           return false;
//         }
//       }
//     }
//     return true;
//   }, [grid, numRows, numCols]);

//   useEffect(() => {
//     if (checkWin()) {
//       setIsGameWon(true);
//     }
//   }, [grid, checkWin]);

//   return (
//     <div className="board">
//       <div>
//         <div>
//           <label htmlFor="numRows">Numero di righe: </label>
//           <input
//             type="number"
//             id="numRows"
//             value={numRows}
//             onChange={(e) => setNumRows(parseInt(e.target.value))}
//           />
//         </div>
//         <div>
//           <label htmlFor="numCols">Numero di colonne: </label>
//           <input
//             type="number"
//             id="numCols"
//             value={numCols}
//             onChange={(e) => setNumCols(parseInt(e.target.value))}
//           />
//         </div>
//         <div>
//           <label htmlFor="numMines">Numero di mine: </label>
//           <input
//             type="number"
//             id="numMines"
//             value={numMines}
//             onChange={(e) => setNumMines(parseInt(e.target.value))}
//           />
//         </div>
//         <button onClick={resetGame}>Riavvia il gioco</button>
//         <div>Mosse: {moveCount}</div>
//         <div>Mine: {bombCount}</div>
//       </div>
//       {isGameOver && <div>Hai perso! Game Over</div>}
//       {isGameWon && <div>Hai vinto il gioco!</div>}
//       <Grid
//         grid={grid}
//         handleClick={handleClick}
//         handleRightClick={handleRightClick}
//         showAllBombs={showAllBombs}
//       />
//     </div>
//   );
// };

// export default Board;



