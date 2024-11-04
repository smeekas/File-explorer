export type MyFile = {
  name: string;
  path: string;
  size: number;
  modified: string;
  mime: string | null;
};
export type MyDir = {
  name: string;
  path: string;
  isHidden: boolean;
  size: number;
  modified: string;
};
export type DirectoryInfo = {
  items: {
    file: MyFile | null;
    dir: MyDir | null;
  }[];
  numberOfDirs: number;
  numberOfFiles: number;
};

export type DirectoryProps = {
  path: string;
};

export type FileFolderPathName = {
  name: string;
  path: string;
};
