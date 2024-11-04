import { DataTableColumns } from "../enums/dataTable";

export type GridDataRow = {
  [DataTableColumns.Name]: string;
  [DataTableColumns.Id]: string;
  [DataTableColumns.Modified]: string;
  [DataTableColumns.Size]: number;
  [DataTableColumns.Path]: string;
  isFile: boolean;
};
