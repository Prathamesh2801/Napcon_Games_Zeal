import { FaLungs, FaTableCells } from 'react-icons/fa6'
import LungsGame from './lungs/LungsGame'
import TableGame from './table/TableGame'

export const games = {
  lungs: { Component: LungsGame, Icon: FaLungs },
  table: { Component: TableGame, Icon: FaTableCells },
}
