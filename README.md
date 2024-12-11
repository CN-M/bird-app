# 🐦 Bird App

Bird App is a social media platform that allows users to share thoughts, ideas, and updates in a tweet-like format. Users can follow each other, like posts, comment on them, and bookmark their favorite content. The app also features premium plans for enhanced functionalities.

---

## ✨ Features

### 🔐 User Authentication
- Register and login functionality.
- Login as a guest.
- Logout options for both registered and guest users.

### 📝 Posts & Comments
- View general and personalized feeds.
- Create, delete, and like posts.
- Comment on posts and reply to comments.
- Bookmark posts for later viewing.

### 👤 User Profiles
- Edit user profiles, including username, profile name, and profile picture.
- Follow and unfollow other users.
- View posts from specific users.

### 💎 Premium Features (Coming Soon)
- Edit tweets.
- Write long tweets.
- Bookmark tweets.
- Additional premium functionalities.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React
- 🟦 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS

### Backend
- 🟢 Node.js
- 📦 Express
- 📋 Prisma (for database management)
- 🚀 Redis (for caching)
- 🔑 JWT (for authentication)

---

## 🚀 Installation

### Prerequisites
- 🖥️ [Node.js](https://nodejs.org)
- 📦 npm or yarn
- 🗄️ PostgreSQL (or any other database supported by Prisma)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/CN-M/bird-app.git
cd bird-app
```

### 2️⃣ Setup Backend
Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory and configure your environment variables (e.g., database URL, JWT secrets).

Run the database migrations:
```bash
npx prisma migrate dev
```

Seed the database with initial data:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
Navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the frontend application:
```bash
npm run dev
```

---

## 🎉 Usage

1. Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to access Bird App.
2. Register or log in to start using the app.
3. Explore the features, create posts, and interact with other users.

---

## 📄 License

This project is licensed under the **MIT License**. Goodluck navigating my sphagetti code.

---

## 💖 Acknowledgments
- Special thanks to the creators of the libraries and frameworks used in this project.
```