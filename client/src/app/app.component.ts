import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from './app.service';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  files = fileData;
  status = 'offline';
  constructor(private appService: AppService) {
    this.appService.getStatus().subscribe((data: any) => {
      this.status = data.status;
    });
    this.appService.getDirectoryListing('.').subscribe((data: any) => {
      this.files = data;
    });
  }
}
