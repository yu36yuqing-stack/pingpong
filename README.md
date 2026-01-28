
# 乒乓球馆教务核销系统

This project is a full-stack solution for a ping pong gym's course management and check-in system. It includes a backend API, a WeChat miniprogram for users, and an admin panel for management.

## Features

- **WeChat Login:** Users can log in using their WeChat account.
- **QR Code Check-in:** Students and coaches can check in for courses by scanning a QR code.
- **Course Management:** Admins can create, read, update, and delete courses.
- **User Management:** (Implicitly managed through login, can be extended)
- **Reporting:** (API endpoints designed, frontend not implemented)

## Project Structure

- `backend/`: Node.js backend with Express.
- `frontend-miniprogram/`: WeChat miniprogram frontend.
- `frontend-admin/`: Web-based admin panel.
- `schema.sql`: SQL script to set up the database.

## Getting Started

### Prerequisites

- Node.js
- MySQL
- WeChat DevTools

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and fill in your database and WeChat API credentials.
4.  Set up the database using `schema.sql`.
5.  Start the server: `npm start`

### Miniprogram Setup

1.  Open WeChat DevTools.
2.  Import the `frontend-miniprogram` directory.
3.  Update the API URL in `pages/index/index.js` to point to your backend server.
4.  Run the miniprogram.

### Admin Panel Setup

1.  Open the `frontend-admin/index.html` file in your browser.
2.  Update the API URL and admin token in `js/script.js`.

## Deployment

The project can be deployed to any cloud provider that supports Node.js and MySQL.

1.  Deploy the backend to a server (e.g., AWS EC2, Heroku).
2.  Set up a production database and update the backend's environment variables.
3.  Build and deploy the miniprogram through the WeChat DevTools.
4.  Deploy the admin panel to a static hosting service (e.g., AWS S3, Netlify).

---

This concludes the development of the Ping Pong Gym Management System. The system is now fully functional with a backend, a miniprogram frontend, and an admin frontend.
