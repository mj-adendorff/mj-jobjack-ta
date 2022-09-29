/*******************************************************************************
 * FILES.TS FILE
 * ------------
 * NodeJS module that handles all our logic related to files and directories
 * ------------
 * Author: MJ Adendorff
 * Date: 29 September 2022
 * ------------
 ******************************************************************************/

/***   CONSTANTS AND GLOBALS   ************************************************/

/* Imports */
import fs from "node:fs";
import path from "node:path";
import { commonFileTypes } from "./data.json";

/***   TYPE DEFINITIONS   *****************************************************/

export type Extension = {
	extension: string;
	commonType: string;
};

export type File = {
	fileName: string;
	fullPath: string;
	dateCreated: Date;
	permissions: number;
	fileType: Extension;
	isDirectory: boolean;
	size: number;
};

export type Listing = Array<File>;

/***   FUNCTIONS   ************************************************************/

/**
 * Function that converts bytes to KiloBytes (2 ** 10).
 */
function getKilobytesFromBytes(byteAmount: number): number {
	const bytesInKilobyteAmount = Math.pow(2, 10);
	return Math.ceil(byteAmount / bytesInKilobyteAmount);
}

/**
 * Function to get permissions from the stats.mode number
 * ref: https://github.com/nodejs/node-v0.x-archive/issues/3045
 * TODO finish this function
 */
function getPermissions(mode: number): string {
	//TODO
	return "WIP";
}

/**
 * Retruns the extension of a file if it exits
 * and
 */
function getExtension(fileName: string): Extension {
	let ext: string = path.extname(fileName);
	let commonType: string = commonFileTypes[ext as keyof typeof commonFileTypes];
	let returnable: Extension = {
		extension: ext,
		commonType: commonType ? commonType : "unknown",
	};
	return returnable;
}

/**
 * Function that gets the directory listing of a given directory
 * retuns promise.
 * TODO Add extra attributes and finish
 */
export function getDirectoryListing(directory: string): Promise<Listing> {
	let returnable: Promise<Listing> = new Promise((resolve, reject) => {
		let listing: Listing = [];
		// Read directory contents
		fs.readdir(directory, (error, files) => {
			if (error) {
				reject(listing);
			}
			// Loop through items in directory
			files.forEach((file) => {
				let filePath = `${directory}/${file}`;
				let stats = fs.statSync(filePath);
				let newFile: File = {
					fileName: file,
					fullPath: filePath,
					dateCreated: stats.birthtime,
					permissions: stats.mode,
					isDirectory: stats.isDirectory(),
					fileType: getExtension(file),
					size: getKilobytesFromBytes(stats.size),
				};
				// append file info to listing
				listing.push(newFile);
			});
			resolve(listing);
		});
	});
	return returnable;
}

/***   EOF   ******************************************************************/
