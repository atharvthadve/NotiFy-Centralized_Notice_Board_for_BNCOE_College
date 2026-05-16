# NotiFy

NotiFy is a centralized notice board web application for BNCOE College. It helps admins publish official notices in one place, while students can easily view the latest updates through a clean dashboard.

## Features

- Student notice dashboard
- Admin login and dashboard
- Create, edit, and delete notices
- File upload support using Cloudinary
- MySQL database integration
- Server-side rendering with EJS
- Responsive UI

## Tech Stack

- Node.js
- Express.js
- EJS
- MySQL
- Cloudinary
- Multer
- CSS

## Setup

Clone the project and install dependencies:

```bash
git clone <repository-url>
cd "NotiFy-Backend Project"
npm install
```

Create a MySQL database:

```sql
CREATE DATABASE notify_db;
```

Add a `.env` file in the root folder:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=notify_db

USER_ID=admin_username
USER_PASSWORD=admin_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the server:

```bash
npm start
```

Open the app at:

```text
http://localhost:3000
```

## Author

Developed by Atharv Thadve.
