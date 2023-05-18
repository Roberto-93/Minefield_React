//Cell.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

type CellProps = {
  isRevealed: boolean;
  isMine: boolean;
  neighbouringMines: number;
  isFlagged: boolean;
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode; // Aggiungi la proprietà children come opzionale

};




const Cell: React.FC<CellProps> = ({
    isRevealed,
    isMine,
    neighbouringMines,
    isFlagged,
    onClick,
    onContextMenu,
    children, // Aggiungi children come parametro

}) => (
    <div
      className={`cell ${isRevealed ? 'revealed' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {isRevealed && !isMine ? neighbouringMines : ''}
      {/* {isFlagged ? 'F' : ''} */}
      {isFlagged ? <FontAwesomeIcon icon={faFlag} /> : ''}

      {children} {/* Aggiungi la prop children */}
    </div>
  );
  


    
export default Cell;

