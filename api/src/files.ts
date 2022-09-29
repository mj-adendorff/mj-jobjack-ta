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

/***   TYPE DEFINITIONS   *****************************************************/

export interface File {
	fileName: string;
	fullPath: string;
	dateCreated: Date;
	permissions: number;
	group: number;
	user: number;
	isDirectory: boolean;
	fileType: string;
	size: number;
}

export type Listing = Array<File>;

/***   FUNCTIONS   ************************************************************/

/**
 * Function that converts bytes to KiloBytes (2 ** 10).
 */
function getKiloBytesFromBytes(byteAmount: number): number {
	const bytesInKB = Math.pow(2, 10);
	return Math.ceil(byteAmount / bytesInKB);
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
				console.log("error reading files");
				reject(listing);
			}
			// Loop through files in directory
			files.forEach((file) => {
				let stats = fs.statSync(`${directory}/${file}`);
				let newFile: File = {
					fileName: file,
					fullPath: `${directory}/${file}`,
					dateCreated: stats.birthtime,
					permissions: stats.mode,
					group: stats.gid,
					user: stats.uid,
					isDirectory: stats.isDirectory(),
					fileType: "none",
					size: getKiloBytesFromBytes(stats.size),
				};
				listing.push(newFile);
			});
			resolve(listing);
		});
	});
	return returnable;
}

/***   TEST FUNCTION   ********************************************************/

// getDirectoryListing("/etc").then((value) => {
// 	console.table(value);
// });

/***   EOF   ******************************************************************/
