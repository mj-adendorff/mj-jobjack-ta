import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { faFileLines as faFile, faFolderClosed as faFolder } from '@fortawesome/free-solid-svg-icons';

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
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  faFile = faFile;
  faFolder = faFolder;
  files: File[] = fileData;
  status = 'offline';
  statusColor = 'red';
  directory = "none";
  test(name: string) {
    console.log(name);
  }
  constructor(private appService: AppService) {
    this.appService.getStatus().subscribe((data: any) => {
      this.status = data.status;
      if (this.status === 'online') {
        this.statusColor = 'lightgreen';
      }
    });
    this.appService.getDirectoryListing('/Users/mjadendorff/Desktop').subscribe((data: any) => {
      this.files = data;
      this.directory = "/Users/mjadendorff/Desktop";
    });
  }

  seek(file: File) {
    if (file.isDirectory) {
      this.changeDirectoryListing(file.fullPath);
    } else {
      alert("file to be opened?");
    }
  }

  getIcon(file: File) {
    if (file.isDirectory) {
      return this.faFolder;
    }
    return this.faFile;
  }

  changeDirectoryListing(directory: string) {
    this.appService.getDirectoryListing(directory).subscribe((data: any) => {
      this.files = data;
      this.directory = directory;
    });
  }
}
