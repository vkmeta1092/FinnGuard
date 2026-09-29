<div align="center">

# 🐟🛡️ FinGuard.io

### Aquaculture Intelligence for the Next Billion Farmers

FinGuard is an **AI-powered aquaculture monitoring and disease detection platform** built for small-scale fish farmers. Combining computer vision, machine learning, and voice-first technology, it transforms aquaculture from reactive crisis management into proactive, data-driven farming — accessible to every farmer, regardless of literacy.

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-97.8%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AI Accuracy](https://img.shields.io/badge/AI%20Accuracy-98%25-22C55E?style=for-the-badge)](https://github.com/GovindUpadhyay13/FinGuard.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

</div>

---

## 📱 Product Preview

| **Splash Screen** | **Language Selection**  | **Dashboard** |
|:---:|:---:|:---:|
| ![Splash Screen](Product%20Preview/Splash_Screen.png) | ![Language Selection](Product%20Preview/Language_Selection.png) | ![Dashboard](Product%20Preview/User_Dashboard.png) |
| *Aquaculture intelligence, ready at launch.* | *Choose from English, Hindi, Bengali, Marathi & more.* | *Your farm's health and activity at a glance.* |

| **Fish AI Diagnostic** | **Treatment Protocol** | **Government Hub** |
|:---:|:---:|:---:|
 ![Fish AI Diagnostic](Product%20Preview/Fish_ai_diagnostic.png) | ![Treatment Protocol](Product%20Preview/Treatment_Protocol.png) | ![Government Hub](Product%20Preview/Government_Hub.png) | 
| *Upload symptoms for instant 98% accuracy pathology results.* | *Step-by-step treatment and medication guidance.* | *Unlock government subsidies, loans & training schemes.* | 

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Technology Stack](#-technology-stack)
- [🛠️ Getting Started](#️-getting-started)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔍 AI Fish Diagnostic
Capture fish symptoms via camera for instant pathology results powered by computer vision — **98% accuracy**.

</td>
<td width="50%">

### 💊 Treatment Protocols
Actionable isolation steps and evidence-based medication guidance (e.g., Oxytetracycline, Kanamycin, Baytril).

</td>
</tr>
<tr>
<td width="50%">

### 🌍 Multilingual Support
Full support for **English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी)** and more native languages.

</td>
<td width="50%">

### 🏛️ Government Schemes Hub
Browse and filter subsidies, loans & training programs — including **PMMSY** (40–60% financial subsidy).

</td>
</tr>
<tr>
<td width="50%">

### 🗣️ Voice-First Accessibility
Interact through voice commands in native dialects — built specifically for low-literacy users.

</td>
<td width="50%">

### 📊 Farm Analytics & Dashboard
Track your farm's health metrics, activity logs, and trends at a glance with real-time charts.

</td>
</tr>
<tr>
<td width="50%">

### 🛒 Marketplace
Connect with suppliers and buyers directly within the app for inputs, equipment, and produce.

</td>
<td width="50%">

### 🥶 Cold Storage Locator
Find nearby cold storage facilities to reduce post-harvest losses and improve fish quality.

</td>
</tr>
</table>

---

## 🏗️ Project Structure

```
FinGuard.io/
├── screens/               # Full-page screen components
│   ├── SplashScreen.tsx
│   ├── LanguageSelection.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── DiseaseDetection.tsx
│   ├── Analytics.tsx
│   ├── Schemes.tsx
│   ├── Marketplace.tsx
│   ├── ColdStorage.tsx
│   └── Profile.tsx
├── components/            # Reusable UI components
│   ├── AIAssistant.tsx
│   ├── BottomNav.tsx
│   ├── CircularGauge.tsx
│   └── TutorialOverlay.tsx
├── services/              # Business logic & external integrations
│   ├── geminiService.ts       # Google Gemini AI integration
│   ├── aiAssistantService.ts
│   ├── weatherService.ts
│   ├── locationService.ts
│   ├── notificationService.ts
│   ├── smsService.ts
│   └── audioUtils.ts
├── App.tsx                # Root component & navigation
├── types.ts               # Shared TypeScript types
├── constants.tsx          # App-wide constants
└── index.tsx              # Entry point
```

---

## 🚀 Technology Stack

| Layer | Technology |
|:---|:---|
| **UI Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **AI / ML** | Google Gemini API — computer vision & NLP |
| **Accessibility** | Voice-to-Text, Multilingual UI/UX |
| **Platform** | Progressive Web App (PWA) |

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A mobile device or browser with camera access to test AI diagnostic features

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/GovindUpadhyay13/FinGuard.io.git
cd FinGuard.io
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

**4. Build for production**
```bash
npm run build
```

**5. Preview the production build**
```bash
npm run preview
```

**6. Type-check the project**
```bash
npm run lint
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <br/>
  <strong>Developed with ❤️ by <a href="https://github.com/GovindUpadhyay13">Govind Upadhyay</a></strong>
  <br/>
  <em>Transforming aquaculture, one pond at a time. 🐟</em>
  <br/><br/>
  <a href="https://github.com/GovindUpadhyay13/FinGuard.io/stargazers">⭐ Star this repo if you find it useful!</a>
</div>
