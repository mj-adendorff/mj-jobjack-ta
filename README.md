# Technical Assesment (mj-jobjack-ta)

My technical assesment for JobJack. The date of the assesment ran between 29/30 September to the 3/4th October.

#### Summarized Problem Statement

1. Develop a Node.JS API (REST/GraphQL) that accepts a directory path (on the API's host system), use this path to obtain a full directory listing that includes the following:

   - filename
   - full file path
   - file size (KB)
   - extension
   - file type
   - created date
   - file permissions/attributes
   - is? file/directory

   Make sure a directory is selectable? and return new/updated results.

2. Build an Angular 8+ client that
   - calls the API
   - displays the results
   - make it responsive
   - use frameworks such as Bootstrap

## Notice

Since this is a technical assesment, both the API and Client has to be running on the same system.
This can be changed, however it is not required.

## Repo Directory Structure

```
.
├── api                    # NodeJS API
│ ├── src
│ │ ├── data.json
│ │ ├── server.test.ts
│ │ └── server.ts
│ └── ...
├── client                 # Angular 8+ Client
│ ├── src
│ │ ├── app
│ │ │ ├── app.component.ts
│ │ │ ├── app.component.less
│ │ │ ├── app.component.html
│ │ │ ├── app.service.ts
│ │ │ └── ...
│ │ └── ...
│ └── ...
└── README.md
```

There are three ways to run this project;
1. Build and run the API and Client locally.
   - This however has the restriction of only working on UNIX systems
2. Run the Client or API through seperate containers or one as container and the other locally.
3. Run the entire application as docker container (recommended)

## To Run the Entire Project as a Container

You can either pull the image from Dockerhub (easiest), or build the image and run it locally.
Also the project was done on an M1 macbook and tested on an Raspberry PI, 
it's possible that some things might not work or have performance issues when running on x86 platform.

#### From Dockerhub
```bash
docker pull mjadendorff/mj-jobjack-ta
docker run -d -p 5200:5200 -p 4200:4200 mjadendorff/mj-jobjack-ta
```
#### Build and run image locally
```bash
docker build . -t mj-jobjack-ta
docker run -d -p 5200:5200 -p 4200:4200 mj-jobjack-ta
```

## NodeJS API

The NodeJS API requires a UNIX system to function properly,
it can be run seperately as a docker container or locally on its own.

#### Building and running locally
```bash
cd api
npm install && npm install typescript -g
tsc
node build/server.js
```

#### Building and running the docker image/container
```bash
cd api
docker build . -t mj-jobjacj-ta-api
docker run -d -p 5200:5200 mj-jobjack-ta-api
```

#### Pulling the image from dockerhub
```bash
docker pull mjadendorff/mj-jobjack-ta-api
docker run -d -p 5200:5200 mjadendorff/mj-jobjack-ta-api
```

###

## Angular Client

The Angular client can also be run as a seperate container or locally.
Because this is a technical assesment, it will run in developer mode.

#### Running the client locally
```bash
cd client
npm install && npm install typescript -g && npm install @angular/cli -g
ng serve --host 0.0.0.0
```

#### Building and running the docker image/container
```bash
cd client
docker build . -t mj-jobjacj-ta-client
docker run -d -p 4200:4200 mj-jobjack-ta-client
```

#### Pulling the image from dockerhub
```bash
docker pull mjadendorff/mj-jobjack-ta-client
docker run -d -p 4200:4200 mjadendorff/mj-jobjack-ta-client
```