# shopify-summer-2021-challenge

## Purpose
An image repository for the Shopify Summer 2021 Intern Challenge. Currently, the backend is done but a frontend will be added later for demonstration purposes. The idea is that the backend is used to create new users that can add public/private images to their account. The frontend would use the existing endpoints to create a shared "Feed" page for all users to share their public pictures, while also providing users with a more personal "Dashboard" where they can view their own private pictures.

## Endpoints
* GET /users: fetch a list of users
* GET /users/{id}: fetch a specific user with their images (public and private) -> requires the fetched user's token so login must be performed beforehand
* POST /users: create a new user
* PUT /users/{id}: update a user's information -> requires that user's token
* DELETE /users/{id}: delete a user -> requires that user's token
* POST /auth/login: log in as a user to get a JWT token
* GET /images: fetches all public images for the Feed page
* GET /images/{id}: fetches a specific image given that the request came from the appropriate user
* GET /images/{id}/info: fetches a specific image's imformation given that the request came from the appropriate user
* POST /images: creates a new image under a user's profile given that the request came from the appropriate user
* DELETE /images/{id}: deletes an image under a user's profile given that the request came from the appropriate user

## Auth
Currently, authorization is done through middleware wherever needed. User information is stored in a JWT token for the backend to recognize who is currently making a request and allow access accordingly. See `src/middleware/auth.ts`, `src/controllers/auth.ts` as well as the different controllers for more specific authroization logic.

## Image storage
Images are stored on a dedicated harddrive that can be mounted on the machine and given to the api as the environment variable `UPLOAD_DIR`. This method was chosen as it saves on costs for hosting the images down the line. I considered storing images in mongodb in different ways, but all were too expensive to maintain or degraded the images' integrity in the longrun (transofrming image to base64 before storage for example would facilitate transfering the images, but would increase storage size and decrease image integrity).

## Running the backend
1. Make sure that [docker](https://docs.docker.com/get-docker/) and [nodejs](https://nodejs.org/en/download/) (needed for npm) is installed on your machine
2. Go into the server's directory
3. Run the server using:
```
npm install #install dependencies
npm start #start a mongodb container and a dev container for the api
```
4. Make requests on `http://localhost:3000`

## Running the frontend
The frontend wasn't developed due to discovering the application late. However, one will be ready for a demo if needed. It will be equiped with login, signup, dashboard, and feed pages, as well as the ability to search for images based on tags (tags are already implemented in the backend) and bulk addition/deletion of images.