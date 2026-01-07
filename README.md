# 🏥 QueueFlow - Smart Queue Management System

**Live Demo:** [Click Here to View App](https://nextup-frontend-qmkn.onrender.com)

A full-stack Queue Management System designed to eliminate physical lines in hospitals and banks. Features a public self-service Kiosk for issuing tokens and a secure Staff Dashboard for real-time queue management.

![Project Status](https://img.shields.io/badge/Status-Live-success)

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Python (FastAPI), SQLAlchemy
* **Database:** PostgreSQL (Cloud Hosted on Render)
* **DevOps:** Docker, CI/CD Pipeline

## ✨ Key Features
* **Public Kiosk:** Customers select a department (e.g., General Enquiry) and receive a sequenced token (A-001).
* **Staff Dashboard:** Secure interface for officials to view pending tokens, call the next person, and mark services as complete.
* **Cloud Architecture:** Fully deployed microservices architecture connecting React to a remote PostgreSQL database.

## ⚙️ How It Works
1. **User Side:** Customer clicks "General Enquiry" -> System generates unique Token ID -> Saves to Cloud DB.
2. **Admin Side:** Staff logs in -> Fetches live data -> Updates status from "Pending" to "Serving".

## 🚀 Future Improvements
* Add WebSocket support for instant real-time updates without refreshing.
* Add SMS notifications for customers when their turn is near.
