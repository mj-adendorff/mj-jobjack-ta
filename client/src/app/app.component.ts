import { AfterViewInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { faFileLines as faFile, faFolderClosed as faFolder } from '@fortawesome/free-solid-svg-icons';
import { faHouse, faUpLong, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
const fileData: File[] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {

  faFile = faFile;
  faFolder = faFolder;
  faHouse = faHouse;
  faUpLong = faUpLong;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  forwardStack : string[] = [];
  backwardStack : string[] = [];
  files: File[] = fileData;
  status = 'offline';
  statusColor = 'red';
  directory = "none";

  constructor(private appService: AppService) {
    this.directory = "/Users/mjadendorff/Desktop";
    this.checkStatus();
    this.doDirectoryIndex();
    setInterval(() => {
      this.checkStatus();
      this.doDirectoryIndex();
    }, 10000)
  }

  checkStatus() {
    this.appService.getStatus().subscribe((data: any) => {
      this.status = data.status;
      if (this.status === 'online') {
        this.statusColor = 'lightgreen';
      } else {
        this.statusColor = 'red';
      }
    });
  }

  doDirectoryIndex() {
    this.appService.getDirectoryListing(this.directory).subscribe((data: any) => {
      this.files = data;
      this.directory = this.directory;
    });
  }

  setHome() {
    this.directory = "/Users/mjadendorff";
    this.backwardStack.push(this.directory);
    this.doDirectoryIndex();
  }

  goBack() {
    let newDir = this.backwardStack.pop();
    if (newDir != undefined) {
      this.forwardStack.push(this.directory);
      this.directory = newDir ? newDir : "/";
      this.doDirectoryIndex();
    }
  }

  goForward() { 
    let newDir = this.forwardStack.pop();
    if (newDir != undefined) {
      this.backwardStack.push(this.directory);
      this.directory = newDir ? newDir : "/";
      this.doDirectoryIndex();
    }
  }

  upDirectory() {
    let reg = /\/[a-zA-Z0-9."\s\\\-\_]+$/g
    let matches = this.directory.match(reg);
    if (matches && matches[0]) {
      if (matches[0].length != this.directory.length) {
        this.backwardStack.push(this.directory);
        this.directory = this.directory.replace(reg, "");
        this.doDirectoryIndex(); 
      }
    }
  }

  seek(file: File) {
    if (file.isDirectory) {
      this.backwardStack.push(this.directory);
      this.directory = file.fullPath;
      this.doDirectoryIndex();
    } else {
      // files
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
      this.backwardStack.push(this.directory);
      this.directory = directory;
    });
  }
}
