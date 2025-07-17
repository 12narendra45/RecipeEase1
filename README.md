# 🍲 Recipe Finder App

A cross-platform mobile application that allows users to explore recipes, listen to cooking instructions, and watch videos for step-by-step guidance. Built using **React Native** and **Node.js**, the app provides features like login, registration, search, favorites, and multimedia support.

---

## 🚀 Features

- 🏠 Landing and Home Screens with curated recipes
- 🔐 User Authentication (Login & Registration)
- 🔍 Search functionality for recipes
- ❤️ Add and manage favorite recipes
- 📃 View detailed recipe instructions
- 🔊 Listen to recipes using audio playback
- 📺 Watch cooking videos
- 📱 Cross-platform UI (Android & iOS)

---

## 🛠️ Tech Stack

### **Frontend**
- React Native
- React Navigation
- Axios
- Expo (if applicable)
- Context API

### **Backend**
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- REST API

---

## 🔄 Application Flow

```
Landing ➡️ Login/Register ➡️ Home ➡️ Search ➡️ Recipe Details
           ⬇️                          ⬇️
        Favorites                   (View | Listen | Watch)
```

---

## 🖼️ Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/2528bb90-3df1-45fb-ba80-e859435f25ab" width="200"/>
  <span style="font-size: 30px; margin: 0 10px;">➡️</span>
  <img src="https://github.com/user-attachments/assets/7715a9fa-f79c-467d-88a6-65ffcff79a68" width="200"/>
  <span style="font-size: 30px; margin: 0 10px;">➡️</span>
  <img src="https://github.com/user-attachments/assets/327db3e0-92c9-4bb6-b190-5a157d357c31" width="200"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/cac47a99-11d4-48a3-91c3-fec5ca6e72db" width="200"/>
  <span style="font-size: 30px; margin: 0 10px;">➡️</span>
  <img src="https://github.com/user-attachments/assets/fd9f8f7a-4877-4ae6-9956-2dc039aaed0e" width="200"/>
  <span style="font-size: 30px; margin: 0 10px;">➡️</span>
  <img src="https://github.com/user-attachments/assets/79eda521-db63-49c9-9a04-6cb31c406d46" width="200"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/1d93d8ec-614c-4fe9-867b-06b578711a67" width="200"/>
  <span style="font-size: 30px; margin: 0 10px;">➡️</span>
  <img src="https://github.com/user-attachments/assets/794af839-39dd-4aff-b5a4-c82cd63000a7" width="200"/>
</p>

---

## ⚙️ Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

> Make sure to configure `.env` with MongoDB URI and JWT secret.

### Frontend

```bash
cd mobile-app
npm install
npm start
```

> If you're using Expo: `npx expo start`

---


## 📚 Future Enhancements

- Upload custom recipes
- User profiles & settings
- Push notifications
- Offline recipe access

---
