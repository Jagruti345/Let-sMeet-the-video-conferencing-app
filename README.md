# 🎥 Let'sMeet - Premium Video Conferencing

Let'sMeet is a modern, high-performance video conferencing application designed for seamless collaboration. Built with a sleek glassmorphic UI, it provides crystal-clear video calls, instant messaging, and robust security.

![Let'sMeet Preview](https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1974&auto=format&fit=crop)

## ✨ Features

- **🚀 Real-time Video Calls**: High-quality video and audio conferencing powered by WebRTC.
- **💬 Instant Chat**: Real-time messaging during meetings with unread message badges.
- **🖥️ Screen Sharing**: Share your screen with participants for presentations or collaborative work.
- **🔐 Secure Authentication**: Robust JWT-based login and registration system.
- **📜 Meeting History**: Keep track of your past meetings and easily rejoin them.
- **🎨 Modern UI/UX**: Premium "Dark-Sleek" aesthetic with glassmorphism and smooth animations.
- **📱 Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Material UI (MUI)** for professional components
- **Socket.io-client** for real-time signaling
- **CSS3** with Glassmorphism and modern gradients

### Backend
- **Node.js & Express**
- **Socket.io** for real-time communication
- **MongoDB** for user data and meeting history
- **JWT** for secure session management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB instance (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jagruti345/Let-sMeet-the-video-conferencing-app.git
   cd Let-sMeet-the-video-conferencing-app
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` folder:
   ```env
   PORT=8000
   MONGO_URL=your_mongodb_connection_string
   ```
   Run the server:
   ```bash
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Run the development server:
   ```bash
   npm run dev
   ```

## 📸 Screenshots

| Landing Page | Dashboard | Meeting Room |
| :---: | :---: | :---: |
| ![Landing](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&fit=crop) | ![Dashboard](https://images.unsplash.com/photo-1614850523296-e8c041de4398?q=80&w=400&fit=crop) | ![Meeting](https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=400&fit=crop) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
