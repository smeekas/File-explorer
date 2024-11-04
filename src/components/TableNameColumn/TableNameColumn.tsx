import { GridDataRow } from "../../types/dataTable.types";
import { getIcon } from "../../utils/getIcon";
import { TableNameColumnStyled } from "./TableNameColumn.style";

type TableNameColumnProps = {
  row: GridDataRow;
};
function TableNameColumn({ row }: TableNameColumnProps) {
  return (
    <TableNameColumnStyled data-path={row.path}>
      {getIcon(row.path, row.isFile)}
      <p data-path={row.path}>{row.name}</p>
    </TableNameColumnStyled>
  );
}

export default TableNameColumn;
