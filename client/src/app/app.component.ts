/*******************************************************************************
 * APP.COMPONENT.TS
 ******************************************************************************/

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


/*** TYPE DEFINITIONS *********************************************************/

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


/*** COMPONENT CLASS **********************************************************/

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {

  /* Instance variables (interpolation capable) */
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
  homedir: string;

  
  /* Constructor & Functions */

  /**
   * Constructor that initailizes the service, 
   * gets the API status and directory listing
   * @param {AppService} appService - HTTP service
   */
  constructor(private appService: AppService) {
    this.checkStatus(true);
    setInterval(() => {
      this.checkStatus();
    }, 10000);
  }

  /**
   * Checks the api status and sets the related variables accordingly
   */
  checkStatus(initial? : boolean) {
    this.appService.getStatus().subscribe((data: any) => {
      this.status = data.status;
      this.homedir = data.home;
      if (initial != undefined && initial) {
        this.directory = data.home;
        this.doDirectoryIndex();
      }
      if (this.status === "online") {
        this.statusColor = "lightgreen";
      } else {
        this.statusColor = "red";
      }
    });
  }

  /**
   * Updates the backward stack with a new item
   * @param {string} newItem - item to be pushed onto the stack
   */
  updateBackwardStack(newItem: string) {
    if (this.backwardStack[this.backwardStack.length - 1] !== newItem) {
      this.backwardStack.push(newItem);
    }
  }

  /**
   * Updates the forward stack with a new item
   * @param {string} newItem - item to be pushed onto the stack
   */
  updateForwardStack(newItem: string) {
    if (this.forwardStack[this.forwardStack.length - 1] !== newItem) {
      this.forwardStack.push(newItem);
    }
  }

  /**
   * Checks the current directory variable and queries the api for new data
   * Alerts if error is thrown.
   */
  doDirectoryIndex() {
    this.appService
      .getDirectoryListing(this.directory)
      .subscribe({
        next: (data: any) => {
          this.files = data;
          this.tempFiles = data;
          this.directory = this.directory;
        },
        error: (data:any) => {
          alert("Some uknown error occured trying to contact the API.");
        }
      });
  }

  /**
   * Sets the current Home directory and obtains new listing.
   */
  setHome() {
    this.updateBackwardStack(this.directory);
    this.directory = this.homedir;
    this.doDirectoryIndex();
  }

  /**
   * Pops from the backward stack and navigate to the directory,
   * updates the forwards stack.
   */
  goBack() {
    let newDir = this.backwardStack.pop();
    if (newDir != undefined) {
      this.updateForwardStack(this.directory);
      this.directory = newDir ? newDir : "/";
      this.doDirectoryIndex();
    }
  }

  /**
   * Pops from the forward stack and navigate to the directory,
   * updates the backward stack.
   */
  goForward() {
    let newDir = this.forwardStack.pop();
    if (newDir != undefined) {
      this.updateBackwardStack(this.directory);
      this.directory = newDir ? newDir : "/";
      this.doDirectoryIndex();
    }
  }

  /**
   * Move up one directory.
   */
  upDirectory() {
    let reg = /\/[a-zA-Z0-9."\s\\\-\_]+$/g;
    let matches = this.directory.match(reg);
    if (matches && matches[0]) {
      if (matches[0].length != this.directory.length) {
        this.updateBackwardStack(this.directory);
        this.directory = this.directory.replace(reg, "");
        this.doDirectoryIndex();
      } else {
        this.updateBackwardStack(this.directory);
        this.directory = "/";
        this.doDirectoryIndex();
      }
    }
  }

  /**
   * Determine new directory listing if clicked on and navigate to it
   * @param {File} file - the file that was clicked on in the UI
   */
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
      // This gets run if item clicked on is file
      // For possible future use (download/view?)
    }
  }

  /**
   * Queries the API for a specific directory given in the UI.
   * @param {Event} event - the event we use to get the specific data
   */
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

  /**
   * Gets the icon of a file given its type (directory or file)
   * @param {File} file - the file queried
   */
  getIcon(file: File) {
    if (file.isDirectory) {
      return this.faFolder;
    }
    return this.faFile;
  }

  /**
   * Filters the file directory data based on some filter text
   * @param {Event} event - the event used to obtain the filter text.
   */
  filterData(event: Event) {
    this.files = this.tempFiles.filter((file) => {
      return file.fileName.toLowerCase().includes(
        (event.target as HTMLTextAreaElement).value.toLowerCase()
      );
    });
  }
}


/*** EOF **********************************************************************/