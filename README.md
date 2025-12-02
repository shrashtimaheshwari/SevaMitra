# **SevaMitra – Crowdsourced Civic Issue Reporting & Resolution Platform**

### *Developed during MediVerse Hackathon 2025 (Medicaps University)*

SevaMitra is a platform that bridges the gap between **citizens**, **NGOs**, and **authorities** by providing a unified system for reporting and resolving civic issues.
Users submit reports with **photos + location**, and authorities manage them through a dedicated dashboard.

---

## 🚀 **Features**

### **User Portal**

* Submit reports with description, photo, and auto-captured GPS location
* Clean UI with responsive design
* Simple phonebook directory for important civic contacts
* Smooth UX with success confirmation and report routing

### **Authority Dashboard**

* Secure login (JWT)
* View all incoming civic reports
* Access report details with location modal
* Resolve or delete reports directly
* Fetches reports from shared MongoDB Atlas

---

## 🛠 **Tech Stack**

### **Frontend**

* React.js
* Tailwind CSS
* React Router
* Axios

### **Backend**

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

---

## 📐 **Architecture**

```
User Frontend → User Backend → MongoDB Atlas ← Authority Backend ← Authority Frontend
```

* User backend handles report creation & image storage
* Authority backend fetches the same DB records for processing
* Images stored as base64/binary or file paths depending on config
* Browser geolocation API used to capture location

---

## ⚙️ **Installation**

### **1. Clone Repositories**

```
git clone <user-backend>
git clone <authority-backend>
git clone <user-frontend>
git clone <authority-frontend>
```

### **2. Backend Setup**

```
npm install
```

Create `.env` for each backend:

```
MONGO_URI=<atlas-uri>
JWT_SECRET=<your-secret>
PORT=<4000 or 5000>
```

Run:

```
npm run dev
```

### **3. Frontend Setup**

```
npm install
npm run dev
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:4000/api        # user frontend
REACT_APP_API_BASE=http://localhost:5000/api   # authority frontend
```

---

## 📡 **Key API Endpoints**

### **User Backend**

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/reports`
* `GET /api/reports/:id/image`
* `GET /api/phonebook`

### **Authority Backend**

* `POST /api/auth/login`
* `GET /api/reports`
* `PATCH /api/reports/:id/resolve`
* `DELETE /api/reports/:id`

---

## 🎯 **Problem Solved**

* NGOs and authorities lack a unified system to track civic issues
* Citizens often don’t know where or how to report problems
* No centralized, structured civic data for real-time decision-making

**SevaMitra creates a direct, fast, tech-driven bridge between people and problem-solvers.**

---

## 👥 **Team**

* **Shlok Naidu**
* **Shrey Shubham Pandey**
* **Shrashti Maheshwari**
* **Vedant Singh Kushwah**

---

## 🔍 **Summary**

SevaMitra demonstrates:

* Full-stack MERN workflow
* Real-time geolocation + image handling
* Multi-backend architecture with shared DB
* Production-style API communication

