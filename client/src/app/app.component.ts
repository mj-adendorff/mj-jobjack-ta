import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

type Extension = {
  extension: string;
  commonType: string;
};

type File = {
  fileName: string;
  fullPath: string;
  dateCreated: Date;
  permissions: string;
  fileType: Extension;
  isDirectory: boolean;
  size: number;
};
const fileData: File[] = [
  {
    fileName: 'randomfile.txt',
    fullPath: './randomfile.txt',
    dateCreated: new Date(),
    permissions: '0777',
    fileType: { commonType: 'Text file', extension: '.txt' },
    size: 10,
    isDirectory: false,
  },
  {
    fileName: 'randomfile.txt',
    fullPath: './randomfile.txt',
    dateCreated: new Date(),
    permissions: '0777',
    fileType: { commonType: 'Text file', extension: '.txt' },
    size: 10,
    isDirectory: false,
  },
  {
    fileName: 'randomfile.txt',
    fullPath: './randomfile.txt',
    dateCreated: new Date(),
    permissions: '0777',
    fileType: { commonType: 'Text file', extension: '.txt' },
    size: 10,
    isDirectory: false,
  },
];

function doStuff() {
  alert('clicked');
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'filename',
    'filepath',
    'filedate',
    'filetypeext',
    'filetype',
    'fileperms',
    'filesize',
  ];
  dataSource = new MatTableDataSource<File>(fileData);
  doStuff = doStuff;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
