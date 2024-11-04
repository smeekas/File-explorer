import { DataTableColumns } from "../../enums/dataTable";
import { GridDataRow } from "../../types/dataTable.types";
import { DirectoryInfo } from "../../types/directories";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { DataTableStyled } from "./DataTable.styled";
import { useSearchContext } from "../../context/SearchContext";
import { useMenuContext } from "../../context/MenuContext";
import useSelection from "../../hooks/useSelection";
import { MouseEventHandler, useMemo } from "react";
import { getFileSize } from "../../utils/getFileSize";
import TableNameColumn from "../TableNameColumn/TableNameColumn";

type DataTableProps = {
  data: DirectoryInfo | null;
};
const columnHelper = createColumnHelper<GridDataRow>();
const columns = [
  columnHelper.accessor((row) => row.name, {
    id: DataTableColumns.Name,
    cell: (data) => <TableNameColumn row={data.row.original} />,
    header: (data) => data.column.id,
  }),
  columnHelper.accessor((row) => row.modified, {
    id: DataTableColumns.Modified,
    cell: (data) => <p data-path={data.row.original.path}>{data.getValue()}</p>,
    header: (data) => data.column.id,
  }),
  columnHelper.accessor((row) => row.size, {
    id: DataTableColumns.Size,
    cell: (data) => (
      <p data-path={data.row.original.path}>
        {data.row.original.isFile
          ? getFileSize(data.getValue())
          : `${data.getValue()} items`}
      </p>
    ),
    header: (data) => data.column.id,
  }),
];
function DataTable({ data }: DataTableProps) {
  const { search } = useSearchContext();
  const { hiddenFiles } = useMenuContext();
  const { addToSelection, selected } = useSelection();
  const gridData: GridDataRow[] = useMemo(
    () =>
      (data?.items
        .map((item) => {
          if (item.dir) {
            return {
              [DataTableColumns.Name]: item.dir.name,
              [DataTableColumns.Id]: item.dir.path,
              [DataTableColumns.Modified]: item.dir.modified,
              [DataTableColumns.Size]: item.dir.size,
              [DataTableColumns.Path]: item.dir.path,
              isFile: false,
            };
          } else if (item.file) {
            return {
              [DataTableColumns.Name]: item.file.name,
              [DataTableColumns.Id]: item.file.path,
              [DataTableColumns.Modified]: item.file.modified,
              [DataTableColumns.Size]: item.file.size,
              [DataTableColumns.Path]: item.file.path,
              isFile: true,
            };
          }
          return null;
        })
        .filter(Boolean)
        .filter((item) =>
          item?.[DataTableColumns.Name]
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
        .filter((item) =>
          hiddenFiles ? !item?.[DataTableColumns.Name].startsWith(".") : true
        ) ?? []) as GridDataRow[],
    [data?.items, hiddenFiles, search]
  );

  const table = useReactTable({
    data: gridData,
    getCoreRowModel: getCoreRowModel(),
    columns,
  });
  const navigate = useNavigate();
  const onRowDbClick = (isFile: boolean, path: string) => {
    if (!isFile) {
      navigate(path);
    } else {
      window.ipcRenderer.send("open", path);
    }
  };
  if (gridData.length == 0) {
    return (
      <div>
        <p>Folder is Empty</p>
      </div>
    );
  }
  const onRowClick: MouseEventHandler<HTMLElement> = (e) => {
    const { target } = e;
    if (target instanceof HTMLElement && target.dataset.path) {
      addToSelection(target.dataset.path);
    }
  };
  return (
    <DataTableStyled>
      <table>
        <thead>
          {table.getHeaderGroups().map((header) => {
            return (
              <tr key={header.id}>
                {header.headers.map((headerItem) => {
                  return (
                    <th key={headerItem.id}>
                      {flexRender(
                        headerItem.column.columnDef.header,
                        headerItem.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody onClick={onRowClick}>
          {table.getRowModel().rows.map((row) => (
            <tr
              className={selected.has(row.original.path) ? "selected" : ""}
              key={row.id}
              data-path={row.original.path}
              onDoubleClick={() =>
                onRowDbClick(row.original.isFile, row.original.path)
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} data-path={row.original.path}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableStyled>
  );
}

export default DataTable;
