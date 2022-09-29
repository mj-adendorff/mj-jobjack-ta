/*******************************************************************************
 * SERVER.TS FILE
 * ------------
 * NodeJS API which returns directory listing from given path on API's host
 * system.
 * ------------
 * Author: MJ Adendorff
 * Date: 29 September 2022
 * ------------
 ******************************************************************************/

/***   CONSTANTS AND GLOBALS   ************************************************/

/* Constants */
const PORT: number = 4200;
const HOST: string = "localhost";

/* Globals */
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { commonFileTypes } from "./data.json";

/* API services */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/***   TYPE DEFINITIONS   *****************************************************/

export type Extension = {
	extension: string;
	commonType: string;
};

export type File = {
	fileName: string;
	fullPath: string;
	dateCreated: Date;
	permissions: string;
	fileType: Extension;
	isDirectory: boolean;
	size: number;
};

export type Listing = Array<File>;

/***   MAIN LOOP   ************************************************************/

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});

/***   API ENDPOINTS  *********************************************************/

// Test
app.get("/stream", (req, res) => {
	// Get directory listing and send it
	//let dataStream = getDirectoryListingStream("/etc");
	let DIR = "/etc";
	fs.readdir(DIR, (error, files) => {
		if (error) {
			res.status(500).json({ error: "could not read directory/file" });
		}
		// Loop through items in directory
		files.forEach((file) => {
			let filePath = `${DIR}/${file}`;
			let stats = fs.statSync(filePath);
			let newFile: File = {
				fileName: file,
				fullPath: filePath,
				dateCreated: stats.birthtime,
				permissions: getPermissions(stats.mode),
				isDirectory: stats.isDirectory(),
				fileType: getExtension(file),
				size: getKilobytesFromBytes(stats.size),
			};
			// append file info to listing
			res.status(200).write(JSON.stringify(newFile));
		});
		res.status(200).end();
	});
});

// Full listing
app.post("/listing", (req, res) => {
	// Get DIRECTORY PATH from POST body
	let DIR: string;
	if (req.body.path) {
		DIR = req.body.path;
	} else {
		DIR = "/etc";
	}
	let listing: Listing = [];
	// Read directory contents
	fs.readdir(DIR, (error, files) => {
		if (error) {
			res.status(500).json({ error: "could not read directory/file" });
		}
		// Loop through items in directory
		files.forEach((file) => {
			let filePath = `${DIR}/${file}`;
			let stats = fs.statSync(filePath);
			let newFile: File = {
				fileName: file,
				fullPath: filePath,
				dateCreated: stats.birthtime,
				permissions: getPermissions(stats.mode),
				isDirectory: stats.isDirectory(),
				fileType: getExtension(file),
				size: getKilobytesFromBytes(stats.size),
			};
			// append file info to listing
			listing.push(newFile);
		});
		res.status(200).json(listing);
	});
});

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
	const permString = "0" + (mode & parseInt("777", 8)).toString(8);
	return permString;
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

/***   EOF   ******************************************************************/
