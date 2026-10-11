# 🌿 EcoGuardian AI

> **AI-powered environmental issue reporting platform built with Next.js and AWS AI.**

EcoGuardian AI helps citizens report environmental and civic issues such as **waste dumping, water leakage, air pollution, fire hazards, and heat-related issues** using a simple photo upload. The platform uses **AWS AI services** to classify the issue, determine its severity, and automatically route it to the correct department. Authorities can monitor reports through a live dashboard while citizens track their complaints in real time.

---

# 🚀 Live Demo

🔗 Live Website:https://eco-guardian-ai-eta.vercel.app/

💻 GitHub Repository: https://github.com/Tashu-Pal/Eco-guardian-AI

---

# ✨ Features

### 👤 Citizen Portal
- 📷 Upload environmental issue with photo
- 📍 Automatic GPS location detection
- 📝 Add optional description and landmark
- 🎫 Unique tracking ID for every complaint
- 🔍 Track complaint status in real time

### 🤖 AI-Powered Analysis
- Amazon Bedrock for issue classification
- Amazon Rekognition for image understanding
- Automatic severity prediction
- Smart department routing

### 🏛 Authority Dashboard
- Live issue monitoring
- Interactive issue map
- Priority-based report management
- Status updates
- Citizen confirmation tracking

---

# 🛠 Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS

### AWS Services
- Amazon Bedrock
- Amazon Rekognition
- Amazon S3
- Amazon SNS
- AWS CloudFormation

---

# 📂 Project Structure

```
app/
components/
lib/
infra/
```

---

# ⚙️ Run Locally

Clone the repository

```bash
git clone https://github.com/Tashu-Pal/Eco-guardian-AI.git
```

Go to project folder

```bash
cd Eco-guardian-AI
```

Install dependencies

```bash
npm install
```

Create environment file

```bash
cp .env.example .env.local
```

Run the project

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 🌍 Problem Statement

Environmental issues are often reported through different platforms, causing delays and confusion.

EcoGuardian AI provides a **single unified platform** where citizens can report issues with a photo. AI automatically analyzes the report, assigns severity, and routes it to the appropriate department while authorities monitor everything from one dashboard.

---

# 💡 Future Scope

- Real-time notifications
- Mobile application
- Multi-language support
- Predictive environmental analytics
- Integration with municipal authorities
- AI-powered recommendations

---

# 👨‍💻 Team

- **Tashu Pal**
- **Akshat**
- **Sheersh**
- **Ketan**

---

# 📜 License

This project was developed for the **AWS Build Hackathon 2026**.
