# 🚀 NotiFy – Centralized Notice Board System for BNCOE College

NotiFy is a centralized web-based notice board application built for BNCOE college, where all official notices are available at one place.

It eliminates the need for physical notice boards and scattered updates by providing a single, reliable platform for students and faculty.

---

## 📌 Features

- 🧾 All college notices in one place  
- ⚡ Server-Side Rendering (SSR) for fast performance  
- 🧑‍💼 Admin dashboard to post & manage notices  
- 📂 Categorized notices (Exams, Events, Circulars, etc.)  
- 🔍 Easy access and readability  
- 📱 Fully responsive design  
- 🔒 Secure and scalable system  

---

## 🛠 Tech Stack

**Frontend:**
- HTML
- CSS
- EJS (Embedded JavaScript Templates)

**Backend:**
- Node.js
- Express.js

**Database:**
- MySQL

---

## ⚙️ How It Works

- Admin logs in and posts notices via dashboard  
- Notices are stored in MySQL database  
- Server renders pages dynamically using EJS (SSR)  
- Students can view all notices in real-time  

---

## 📁 Project Structure

```
NotiFy/
│── public/            # Static files (CSS, images)
│── views/             # EJS templates
│── routes/            # Route handlers
│── controllers/       # Business logic
│── models/            # Database queries
│── config/            # DB configuration
│── app.js             # Main server file
│── package.json
```

---

## 🚀 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/notify.git
cd notify
```

2. Install dependencies:
```bash
npm install
```

3. Setup MySQL database:
- Create a database
- Import required tables (notices, admin, etc.)

4. Configure environment variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=notify_db
```

5. Start the server:
```bash
npm start
```

6. Open in browser:
```
http://localhost:3000
```

---

## 🎯 Future Improvements

- 🔔 Push notifications / email alerts  
- 📱 Mobile app integration  
- 🔍 Search & filter functionality  
- 👥 Role-based authentication (Admin/Student)  
- ☁️ Cloud deployment  

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the repo and submit a pull request.

---

## 💡 Author

Developed by Atharv Thadve 
