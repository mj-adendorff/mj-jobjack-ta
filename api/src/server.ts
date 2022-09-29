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
import * as files from "./files";

/* API services */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/***   TYPE DEFINITIONS   *****************************************************/

interface File {
	fileName: string;
	fullPath: string;
	dateCreated: string;
	permissions: number;
	group: string;
	user: string;
	isDirectory: boolean;
	fileType: string;
	size: number;
}

/***   MAIN LOOP   ************************************************************/

app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST}:${PORT}`);
});

/***   API ENDPOINTS  *********************************************************/

app.get("/", (_req, res) => {
	files.getDirectoryListing("/etc").then((dirStruct) => {
		res.status(200).json(dirStruct);
	});
});

/***   EOF   ******************************************************************/
