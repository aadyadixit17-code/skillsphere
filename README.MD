SkillSphere – Intelligent Hyperlocal Freelance Ecosystem
SkillSphere is a full-stack MERN platform connecting clients with local freelancers through AI-powered job matching, secure milestone payments, real-time collaboration, and comprehensive admin analytics.  
PDF

📸 Application Previews
<p align="center">
  <img src="login.png" alt="Login Screen" width="75%">
</p>

<p align="center">
  <img src="dashboard.png" alt="Signup Screen" width="75%">
</p>
<p align="center">
  <img src="marketplace.png" alt="Signup Screen" width="75%">
</p>

📂 Project Structure
'''
skillsphere/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets and index.html
│   └── src/                     # React components, pages, and styles
└── server/                      # Backend Node.js/Express application
    ├── config/                  # Database and passport configurations
    ├── controllers/             # Business logic (auth, gig, match, profile, etc.)
    ├── middleware/              # Security, authentication, and upload middleware
    ├── models/                  # Database schemas (Gig, Job, Profile, User, etc.)
    ├── routes/                  # API routing endpoints
    ├── services/                # External/Internal services (AI matching service)
    └── utils/                   # Utility helpers (email sender, etc.)
    '''
🚀 Core Features
 🔐 Multi-Role Authentication: Role-based access (Client, Freelancer, Admin) with JWT, Google OAuth, email verification, and 2FA.  


 🤖 AI-Powered Matching: Huggingface AI-driven gig recommendations, skill similarity scoring, and trending skills detection.  


 👤 Professional Profiles: Portfolios, resume uploads, skill proficiency, availability calendars, and verification badges.  


 💼 Gig Marketplace & Bidding: Budget-based project creation, milestones, proposal submissions, and direct negotiations[cite: 1].

 💬 Real-Time Collaboration: Socket.IO instant messaging, file sharing, typing indicators, read receipts, and video integration[cite: 1].

 💳 Secure Escrow Payments: Razorpay/Stripe integration for milestone payouts, refunds, and transaction tracking[cite: 1].

 🛡️ Reputation & Admin Control: Weighted reviews, fraud detection, user moderation, and comprehensive revenue analytics[cite: 1].

🛠️ Installation & Getting Started
1. Clone the Repository
Bash
git clone https://github.com/yourusername/skillsphere.git
cd skillsphere
2. Configure Environment Variables
Set up your .env configuration file inside the server/ directory with your database credentials and API keys.

3. Run the Application
Backend:

Bash
cd server
npm install
npm start
Frontend:

Bash
cd ../client
npm install
npm run dev