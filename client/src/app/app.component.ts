import { Component } from "@angular/core";
import { AppService } from "./app.service";
import {
  faFileLines as faFile,
  faFolderClosed as faFolder,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHouse,
  faUpLong,
  faArrowLeft,
  faArrowRight,
  faMagnifyingGlass,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { HttpErrorResponse } from "@angular/common/http";

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
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  faFile = faFile;
  faFolder = faFolder;
  faHouse = faHouse;
  faUpLong = faUpLong;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faMagnifyingGlass = faMagnifyingGlass;
  faFilter = faFilter;
  forwardStack: string[] = [];
  backwardStack: string[] = [];
  files: File[] = fileData;
  tempFiles: File[];
  status = "offline";
  statusColor = "red";
  directory = "none";

  constructor(private appService: AppService) {
    this.directory = "/Users/mjadendorff";
    this.checkStatus();
    this.doDirectoryIndex();
    setInterval(() => {
      this.checkStatus();
      if (this.files == this.tempFiles) {
        this.doDirectoryIndex();
      }
    }, 10000);
  }

  checkStatus() {
    this.appService.getStatus().subscribe((data: any) => {
      this.status = data.status;
      if (this.status === "online") {
        this.statusColor = "lightgreen";
      } else {
        this.statusColor = "red";
      }
    });
  }

  updateBackwardStack(newItem: string) {
    if (this.backwardStack[this.backwardStack.length - 1] !== newItem) {
      this.backwardStack.push(newItem);
    }
  }

  updateForwardStack(newItem: string) {
    if (this.forwardStack[this.forwardStack.length - 1] !== newItem) {
      this.forwardStack.push(newItem);
    }
  }

  doDirectoryIndex() {
    this.appService
      .getDirectoryListing(this.directory)
      .subscribe((data: any) => {
        this.files = data;
        this.tempFiles = data;
        this.directory = this.directory;
      });
  }

  setHome() {
    this.updateBackwardStack(this.directory);
    this.directory = "/Users/mjadendorff";
    this.doDirectoryIndex();
  }

  goBack() {
    let newDir = this.backwardStack.pop();
    if (newDir != undefined) {
      this.updateForwardStack(this.directory);
      this.directory = newDir ? newDir : "/";
      this.doDirectoryIndex();
    }
  }

  goForward() {
    let newDir = this.forwardStack.pop();
    if (newDir != undefined) {
      this.updateBackwardStack(this.directory);
      this.directory = newDir ? newDir : "/";
      this.doDirectoryIndex();
    }
  }

  upDirectory() {
    let reg = /\/[a-zA-Z0-9."\s\\\-\_]+$/g;
    let matches = this.directory.match(reg);
    if (matches && matches[0]) {
      if (matches[0].length != this.directory.length) {
        this.updateBackwardStack(this.directory);
        this.directory = this.directory.replace(reg, "");
        this.doDirectoryIndex();
      }
    }
  }

  seek(file: File) {
    if (file.isDirectory) {
      this.appService.getDirectoryListing(file.fullPath).subscribe({
        next: (data: any) => {
          this.files = data;
          this.tempFiles = data;
          this.updateBackwardStack(this.directory);
          this.directory = file.fullPath;
        },
        error: (_error: HttpErrorResponse) => {
          alert(
            "ERROR opening that directory. Do you have the correct access permissions?"
          );
        },
      });
    } else {
      // files
    }
  }

  findDirectory(event: Event) {
    let DIR = (event.target as HTMLTextAreaElement).value;
    if (DIR == "") {
      this.setHome();
    } else {
      this.appService.getDirectoryListing(DIR).subscribe({
        next: (data: any) => {
          this.files = data;
          this.tempFiles = data;
          this.updateBackwardStack(this.directory);
          this.directory = DIR;
        },
        error: (_error: HttpErrorResponse) => {
          alert(
            "ERROR opening directory, does it exist and is not restricted?"
          );
          this.directory = this.directory;
        },
      });
    }
  }

  getIcon(file: File) {
    if (file.isDirectory) {
      return this.faFolder;
    }
    return this.faFile;
  }

  filterData(event: Event) {
    this.files = this.tempFiles.filter((file) => {
      return file.fileName.toLowerCase().includes(
        (event.target as HTMLTextAreaElement).value.toLowerCase()
      );
    });
  }
}
