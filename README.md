## About
This application will be used to obtain user information and video submissions of CS:GO footage to be analyzed into a data model for AI/ML development. 
The end user should be able to access a web page where they can submit a YouTube URL and Discord user information to the backend API. 

This API should then attempt to download the video from YouTube and process it accordingly to be included in the data model. 
This API should work as the initial video processing pipeline as well as a hub for analysis results.

# Contributing
To help contribute to WALDO, please visit the [WALDO Documentation page.](https://docs.waldo.vision) and make sure to comply with the [Contributor Agreement](https://docs.waldo.vision/docs/contributing).

> We like [SemVer](https://semver.org) and promote using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)!

## Contributor list
> WALDO Footage Collection API only...

<a href="https://github.com/waldo-vision/waldo.footage.collection/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=waldo-vision/waldo.footage.collection" />
</a>

## Installation
### Local Development Environment
1. Clone the repository
2. Install node dependencies `npm i`
3. Start your local MongoDB instance
4. Run the dev server `npm run dev`

## Swagger
There is basic swagger documentation about the endpoints available at `/documentation`

## Project Requirements
- This API should validate CS:GO footage
- This API should create clips on kill shots
- This API should trim and store kill shot clips
- This API should create a connection to download clips from server (individual and/or archive of clips?)

## Anticipated Workflows
### CREATE FOOTAGE:
1. User submits form with YouTube URL & Discord details
2. API is called for the CREATE/POST logic
    - Returns failure if not an acceptable YouTube URL or missing any information
3. API attempts to download & process video for necessary clips
    - Use/modify existing Python logic to create clips of kill shots
    - Crop/trim video resolution to meet analysis requirements
    - Return error response if clips could not be created
4. API stores any clips created and sends valid response to user

### LIST FOOTAGE:
1. Analysis application sends request to GET footage
2. API gathers and responds with a list of the newest footage documents

### LIST CLIPS:
1. Analysis application sends request to GET clips based on footage ID
2. API gathers and responds with a list of clips associated with footage ID

### DOWNLOAD CLIP:
1. Analysis application sends request(s) to download clip/archive from the server
2. API should pipe the video file/archive to the application

## Server & Development Stack
This PoC is currently planned to be hosted/maintained on a single instance with hopeful intentions of moving into a serverless processing format. This includes all parts of the video processing logic, local database management, and video file storage system; Database management will be associated through Mongo Atlas at production level. The current development stack is Express built with TypeScript on NodeJS with access to Python.