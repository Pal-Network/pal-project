# Pal (Pal-Network) 

**Connect. Collaborate. Build.**

Pal is a match-first social networking and professional platform built specifically for developers and the open-source ecosystem. Think of it as **Bumble for Builders**.

While platforms like LinkedIn focus on jobs and GitHub focuses on code, Pal focuses on the human connections in between. We are reducing the friction of developer networking—especially for junior developers, self-taught builders, and contributors in emerging markets—making it easier to find mentors, get portfolio feedback, and collaborate on real projects.

##  The Problem: The Lonely Builder

Many developers build in isolation. Current platforms lack a dedicated, intent-based matching system for builders, leading to:

* **Lack of community:** Self-taught developers and students often have no structured feedback loop.
* **Cold outreach friction:** Reaching out to senior developers on traditional social platforms is intimidating and often ineffective.
* **Unreviewed work:** Portfolios and side projects go unseen, slowing growth and confidence.

## 💡 The Solution: A Match-First Network

Pal introduces an intent-based matching model optimized for professional collaboration.

### Core User Flow

1. **Profile & Intent:** Users connect their GitHub to showcase their stack and set an active intent (e.g., *Looking for a mentor*, *Reviewing portfolios*, *Hackathon teaming*).
2. **Discover:** Browse and filter profiles by skills, roles, and interests.
3. **Match:** Send a contextual request (e.g., “Can you review my React project?”). The recipient accepts or declines.
4. **Engage:** A private chat opens upon a successful match.
5. **Opportunities:** Senior developers can post mentorship slots, short-term gigs, or job openings, vetting candidates directly through Pal.

## 🛠 Tech Stack & Value Exchange

* **Frontend:** Next.js
* **Backend:** Node.js (Express)
* **Database:** MongoDB
* **Payments:** Stellar Network

Pal uses the **Stellar Network** as its native payment layer to support micropayments for mentorship, fast cross-border settlements for gigs, and low-fee professional services. *(Note: Wallet connection is entirely optional and only required for paid interactions).*

## 📂 Repository Structure

This project is structured as a monorepo to separate the frontend client and backend API while sharing UI components and configurations.

```text
pal-network/
├── apps/
│   ├── web/              # Next.js frontend application
│   └── api/              # Express backend application
│       ├── src/
│       │   ├── models/       # MongoDB schemas
│       │   ├── controllers/  # Request handlers
│       │   ├── routes/       # API routes
│       │   ├── services/     # Business logic
│       │   └── middlewares/  # Auth, validation, errors
├── packages/
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configs and constants
├── docs/                 # Architecture and specifications
├── .env.example
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md

```

## 🗄️ API & Data Model (High-Level)

APIs follow standard REST conventions and are versioned for long-term stability.

| Entity | Core Fields | Description |
| --- | --- | --- |
| **User** | `id`, `name`, `githubUsername`, `techStack`, `intentStatus`, `availability` | Represents a builder on the platform and their current networking goal. |
| **Match** | `requesterId`, `recipientId`, `status` *(pending, accepted, declined)* | The connection request and its current state. |
| **Conversation** | `matchId`, `messages` | The private chat ledger unlocked after a successful match. |
| **Opportunity** | `type` *(mentorship, gig, job)*, `requirements`, `compensation` | Specific, actionable postings created by users. |

## 🚀 Getting Started

### Prerequisites

* Node.js (>= 18)
* MongoDB (Local or Atlas)
* Yarn or npm
* Stellar testnet account *(for testing payment features)*

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Pal-Network/app.git
cd app

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Setup:**
```bash
cp .env.example .env

```


*Update the `.env` file with your local MongoDB URI and Stellar testnet credentials.*
4. **Run the development servers:**
```bash
npm run dev

```



##  Contributing

Pal is an open-source project and we enthusiastically welcome contributors of all experience levels!

1. Fork the repository and create a branch from `main`.
2. Pick an open issue or propose a new one before making large changes.
3. Keep pull requests focused, well-scoped, and include clear commit messages.
4. Add tests or documentation where relevant.
5. Open a Pull Request with a clear summary of your changes.

Please review our [CONTRIBUTING.md](https://www.google.com/search?q=./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](https://www.google.com/search?q=./CODE_OF_CONDUCT.md) for detailed guidelines.

## 💬 Community & Support

Building Pal is a collaborative effort. Join us to discuss architecture, pick up issues, or just hang out with fellow builders:

 **Telegram (Contributors):** [Join the PalNetwork Chat](https://t.me/+zHoLOF7SrKU3Nzk0)

## 👤 Maintainer

**Blessing Godwin**

## 📄 License

This project is open-source and licensed under the **[MIT License](https://www.google.com/search?q=./LICENSE)**.

---

Would you like me to help draft the `CONTRIBUTING.md` file next to establish clear guidelines for developers who want to jump into the frontend or backend?
