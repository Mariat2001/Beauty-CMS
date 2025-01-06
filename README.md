<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center">Movie App</h1>
</p>


<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/Express.js-404D59.svg?style=flat&logo=express&logoColor=white" alt="Express.js">
        <img src="https://img.shields.io/badge/CSS3-1572B6.svg?style=flat&logo=CSS3&logoColor=white" alt="CSS3">


</p>
<p>This project is a robust and user-friendly Content Management System (CMS) designed specifically for managing beauty and cosmetics e-commerce websites. It features a CRUD system for adding, updating, and deleting products, a dedicated page for statistics and dashboards, and functionality to integrate a map seamlessly .</p>
<hr>

##  Getting start
1. Create the  beauty_ecomm database in phpmyadmin containing these followinf tables:
   
```sh
1-brands -> columns: id/name/category/description/image/updated_at/created_at
2-contact_us -> columns: id/telephone/instagram/email/facebook/linkedin/youtube/address/ updated_at/created_at
3-description -> columns: id/description/updated_at/created_at
4-fragrances -> columns: id/name/brands/description/image/price/category/type/scent/updated_at/created_at
5-hair_care -> columns: id/name/brand/description/image/price/category/type/updated_at/created_at
6-home -> columns: id/nb of slideshow/image/about_description/updated_at/created_at
7-makeup -> columns: id/brand/description/category/type/price/image/name/updated_at/created_at
8-map -> columns: id/Name/latitude/longitude//updated_at/created_at
9-skin_care -> columns: id/name/brand/description/price/image/category/type/updated_at/created_at
10-slideshow -> columns: id/imgnb/image/updated_at/created_at
11-todo -> columns: id/description/created_at
12-tool_brush -> columns: id/name/brand/description/category/type/price/image/updated_at/created_at
13-users -> columns: id/name/email/password/created_at/updated_at
```
ps:id should be auto incremented.

2. Clone the FirebaseUploadImage repository:

```sh
git clone https://github.com/Mariat2001/Beauty-CMS
```
3. Change to the project directory:

```sh
cd Beauty_Ecomm
```
  A-***Frontend Setup***
  
1. In the Movie_App run this the Frontend Folder following these steps:

```sh
1. Navigate to the frontend folder:
   cd Frontend_app
```
```sh
1. Install dependencies:
    npm install
```
```sh
2. Run the development server:
    npm run dev
```

  B-***Backend Setup***
1. In the Movie_App run this the Backend Folder following these steps:

```sh
1. Navigate to the backend folder:
   cd Backend_app
```

```sh
2. Express: For creating the server and handling HTTP requests:
   npm install express
```

```sh
3. MySQL: For connecting to and interacting with a MySQL database:
  npm install mysql
```

```sh
4. CORS: Allows the frontend to communicate with the backend:
   npm install cors
```

```sh
5. Bcrypt: For hashing passwords securely:
    npm install bcrypt
```

```sh
6. dotenv: To manage environment variables securely (JWT secrets):
   npm install dotenv
```

```sh
7. jsonwebtoken: For generating and verifying JSON Web Tokens (JWT) for authentication:
   npm install jsonwebtoken
```

```sh
8. Nodemon: Automatically restarts the server when code changes are detected:
  npm install --save-dev nodemon
```

