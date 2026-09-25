# 🎫 Ticket Management System

A full-stack **Ticket Management System** developed using **Django REST Framework** and **React.js**.

This application allows users to create, view, filter, and manage support tickets through a simple and user-friendly interface.

## 🚀 Features

* Create support tickets
* View ticket details
* Update and manage tickets
* Filter tickets
* Client management
* Department management
* User/account management
* REST API integration
* Responsive React frontend
* Django admin panel

## 🛠️ Technologies Used

### Backend

* Python
* Django
* Django REST Framework
* SQLite
* Django ORM

### Frontend

* React.js
* Vite
* JavaScript
* CSS

## 📁 Project Structure

```text
ticket-management-system/
│
├── backend/
│   ├── accounts/
│   ├── clients/
│   ├── departments/
│   ├── tickets/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Backend Installation

Go to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser:

```bash
python manage.py createsuperuser
```

Start the Django server:

```bash
python manage.py runserver
```

Backend will run on:

```text
http://127.0.0.1:8000/
```

## 🎨 Frontend Installation

Open a new terminal and go to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173/
```

## 🔌 API Integration

The React frontend communicates with the Django REST API.

API-related functionality is organized inside:

```text
frontend/src/api/
```

Ticket state and API operations are handled using React hooks.

## 🔄 Application Flow

```text
User
 ↓
React Frontend
 ↓
REST API
 ↓
Django REST Framework
 ↓
Django Views / Serializers
 ↓
Django Models
 ↓
Database
```

## 🧩 Main Modules

| Module      | Description                    |
| ----------- | ------------------------------ |
| Accounts    | User/account management        |
| Clients     | Client management              |
| Departments | Department management          |
| Tickets     | Ticket creation and management |

## 🧪 Testing

Run backend tests using:

```bash
python manage.py test
```

## 🔮 Future Enhancements

* JWT authentication
* Role-based access control
* Ticket priority management
* Email notifications
* Ticket search
* Pagination
* File attachments
* Dashboard analytics
* PostgreSQL database
* Docker deployment

## 👨‍💻 Author

**Yashwant Chandra**

Python Full Stack Developer

## 📄 License

This project is developed for learning, development, and demonstration purposes.
