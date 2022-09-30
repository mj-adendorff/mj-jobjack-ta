/*******************************************************************************
 * SERVER.TEST.TS
 * ------------
 * Tests for the Server.ts code.
 * ------------
 * @author: MJ Adendorff
 * @version 1.0.0
 * ------------
 ******************************************************************************/

/***   CONSTANTS AND GLOBALS   ************************************************/

/* Globals */
import { expect, test } from "@jest/globals";
import axios from "axios";

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

type Status = {
	status: string;
};

/***   FUNCTIONS   ************************************************************/

/**
 * Get API status
 * @returns {Promise<Status>} - promise with the API status
 */
function getStatus(): Promise<Status> {
	let returnable = new Promise<Status>((resolve, reject) => {
		axios({
			method: "get",
			url: "http://localhost:4200/status",
		})
			.then((result) => {
				resolve(result.data);
			})
			.catch((_error) => {
				reject({ status: "offline/error" });
			});
	});
	return returnable;
}

/**
 * Gets directory listing from API
 * @param {string} directory - the directory path to query
 * @returns {Promise<Listing} - A pormise with the directory listing
 */
function getDirectoryListing(directory: string): Promise<Listing> {
	let returnable = new Promise<Listing>((resolve, reject) => {
		axios({
			method: "post",
			url: "http://localhost:4200/stream",
			data: {
				path: directory,
			},
		})
			.then((result) => {
				resolve(result.data);
			})
			.catch((_error) => {
				reject([]);
			});
	});
	return returnable;
}

/***   TESTS   ****************************************************************/

test("Test API status", () => {
	getStatus().then((data) => {
		expect(data.status).toBe("online");
	});
});

test("check current directory", () => {
	getDirectoryListing(".").then((data) => {
		let names = ["data.json", "server.test.js", "server.js"];
		data.forEach((name) => {
			expect(names).toContain(name.fileName);
		});
	});
});

/***   EOF   ******************************************************************/
