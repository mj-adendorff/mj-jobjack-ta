/*******************************************************************************
 * SERVER.TS
 * ------------
 * NodeJS API which returns directory listing from given path on API's host
 * system.
 * ------------
 * @author: MJ Adendorff
 * @version 1.0.0
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

type Listing = Array<File>;

/***   MAIN LOOP   ************************************************************/

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});

/***   API ENDPOINTS (REST) ***************************************************/

/**
 * * POST request
 * This endpoint streams data
 * Queries the path found in the body (if it exists) on the local filesystem
 * and returns the directory listing if it's a directory.
 */
app.post("/stream", (req, res) => {
	// Get DIRECTORY PATH from POST body
	let DIR: string;
	if (req.body.path) {
		DIR = req.body.path;
	} else {
		DIR = "/";
	}
	// Read directory
	fs.readdir(DIR, (error, files) => {
		if (error) {
			res.status(500).json({ error: "could not read directory/file" });
			return;
		}
		// structure data as JSON array
		res.write("[");
		let count = 0;
		// Loop through items in directory
		files.forEach((file) => {
			if (count != 0) {
				res.write(",");
			}
			count++;
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
		// close the stream and JSON data structure
		res.write("]");
		res.status(200).end();
	});
});

/**
 * * POST request
 * This endpoint doesn't stream data
 * Queries the path found in the body (if it exists) on the local filesystem
 * and returns the directory listing if it's a directory.
 */
app.post("/listing", (req, res) => {
	// Get DIRECTORY PATH from POST body
	let DIR: string;
	if (req.body.path) {
		DIR = req.body.path;
	} else {
		DIR = "/";
	}
	let listing: Listing = [];
	// Read directory contents
	fs.readdir(DIR, (error, files) => {
		if (error) {
			res.status(500).json({ error: "could not read directory/file" });
			return;
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
 * Function that converts Bytes (B) to KiloBytes (KB).
 * @param {number} byteAmount - amount of Bytes
 * @returns {number} - the amount of KB
 */
function getKilobytesFromBytes(byteAmount: number): number {
	const bytesInKilobyteAmount = Math.pow(2, 10);
	return Math.ceil(byteAmount / bytesInKilobyteAmount);
}

/**
 * Function to get permissions from the stats.mode number
 * credit: https://github.com/nodejs/node-v0.x-archive/issues/3045
 * @param {number} mode - the file protections number
 * @returns {string} - UNIX file permissions string
 */
function getPermissions(mode: number): string {
	const permString = "0" + (mode & parseInt("777", 8)).toString(8);
	return permString;
}

/**
 * Retruns the extension of a file if it exits and it's common file type
 * if it's specified in the data.json file.
 * @param {string} fileName - the file name
 * @returns {Extension} - Object representing the extension and type.
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
