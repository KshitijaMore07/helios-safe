# 🌞 Helios Safe – Heat Safety Warning System

Helios Safe is a full-stack web application that helps users assess heat-related health risks by analyzing temperature and humidity. It calculates the **"Feels Like" (Heat Index)** temperature, classifies danger levels, stores readings in MongoDB, and provides emergency safety recommendations.

## 🚀 Features

- 🌡️ Analyze temperature and humidity
- 🔥 Calculate Heat Index (Feels Like Temperature)
- ⚠️ Display heat danger levels (Safe to Extreme Danger)
- 🚨 Emergency safety recommendations
- 📊 View recent temperature history
- 💾 Store readings in MongoDB
- 🌐 REST API using Spring Boot

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- CSS

### Backend
- Spring Boot
- Java
- REST API

### Database
- MongoDB

## 📂 Project Structure

```
Helios-Safe/
│
├── frontend/      # React Application
├── backend/       # Spring Boot API
└── README.md
```

## ⚙️ Installation

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 📡 API Endpoints

- POST `/api/analyze-temperature`
- POST `/api/emergency-check`
- GET `/api/recent-readings`
- GET `/api/active-alerts`
- GET `/api/recent-alerts`

## 📈 Future Improvements

- GPS Location Detection
- Weather API Integration
- Push Notifications
- User Authentication
- Mobile Application
- AI-based Heatwave Prediction

## 🎯 Project Objective

To improve public awareness and safety during extreme heat conditions by providing real-time heat risk analysis and emergency guidance.

---

⭐ If you found this project useful, consider giving it a star!
