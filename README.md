# AI-Based Smart Complaint Management System

A MERN Stack application with AI-powered complaint classification, automated responses, and department recommendations.

## 🚀 Tech Stack
- **Frontend**: React.js (Vite)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Claude API (Anthropic)
- **Auth**: JWT + bcrypt
- **Deployment**: Render

## 📁 Project Structure
```
smart-complaint-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── complaintController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Complaint.js
│   │   └── User.js
│   ├── routes/
│   │   ├── complaintRoutes.js
│   │   ├── aiRoutes.js
│   │   └── authRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ComplaintForm.jsx
    │   │   ├── ComplaintList.jsx
    │   │   ├── ComplaintStatus.jsx
    │   │   └── AIAnalysis.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## ⚙️ Setup Instructions

### 1. Clone / Create Project
```bash
mkdir smart-complaint-system
cd smart-complaint-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

## 🔑 Getting API Keys

### MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your DB password

### Anthropic API Key (AI Features)
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Go to "API Keys" → Create new key
4. Copy and paste into `.env` as `ANTHROPIC_API_KEY`

## 🚀 Deploying on Render

### Backend Deployment
1. Push code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add Environment Variables (from .env)
6. Deploy

### Frontend Deployment
1. Go to Render → New → Static Site
2. Connect same GitHub repo
3. Set:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = your backend Render URL
5. Deploy

## 📬 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/complaints | Add complaint |
| GET | /api/complaints | Get all complaints |
| PUT | /api/complaints/:id | Update complaint status |
| GET | /api/complaints/search?location= | Search by location |
| POST | /api/ai/analyze | AI analysis |
