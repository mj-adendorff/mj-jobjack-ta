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
import fs from "node:fs";
import cors from "cors";
import express from "express";

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

/***   API ENDPOINTS  *********************************************************/

/***   EOF   ******************************************************************/
