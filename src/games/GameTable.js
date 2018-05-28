import React from 'react';
import { Table } from 'semantic-ui-react';
import GameTableElement from './GameTableElement';

const GameTable = ({games}) => (
  <Table selectable textAlign="center">
    <Table.Body>
      {games.map(game => 
        <GameTableElement key={game.match.id} game={game} />
      )}
    </Table.Body>
  </Table>
);

export default GameTable;