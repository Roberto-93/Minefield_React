//Grid.tsx

import React from 'react';
import Cell from '../Cell/Cell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

type GridProps = {
  grid: Array<{
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighbouringMines: number;
  }[]>;
  handleClick: (row: number, col: number) => void;
  handleRightClick: (
    event: React.MouseEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => void;
  showAllBombs?: boolean;



};

const Grid: React.FC<GridProps> = ({
  grid,
  handleClick,
  handleRightClick,
  showAllBombs = false, // Imposta showAllBombs come opzionale con valore predefinito false


}) => (
  <div className="grid">
    {grid.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => (
          <Cell
            key={colIndex}
            isRevealed={cell.isRevealed}
            isMine={cell.isMine}
            neighbouringMines={cell.neighbouringMines}
            isFlagged={cell.isFlagged}
            onClick={() => handleClick(cell.row, cell.col)}
            onContextMenu={(event) =>
              handleRightClick(event, cell.row, cell.col)
            }
          >
            {showAllBombs && cell.isMine && <FontAwesomeIcon icon={faBomb} />}

          </Cell>

        ))}
      </div>
    ))}
  </div>
);

export default Grid;
