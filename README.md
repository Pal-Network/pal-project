# Pal (Pal-Network)

**Connect. Collaborate. Build.**

Pal is a social networking and professional matching platform built specifically for developers and the open-source ecosystem. Think of it as **Bumble for Builders**.

While platforms like LinkedIn focus on jobs and GitHub focuses on code, Pal focuses on the human connections in between: finding mentors, getting portfolio feedback, building with peers, and collaborating on real projects. Pal is designed to reduce the friction of developer networking, especially for junior developers, self-taught builders, and contributors in emerging markets.

---

## The Problem: The Lonely Builder

Many developers build in isolation.

- **Lack of community:** Self-taught developers and students often have no structured feedback loop.
- **Cold outreach friction:** Reaching out to senior developers on social platforms is intimidating and often ineffective.
- **Unreviewed work:** Portfolios and side projects go unseen, slowing growth and confidence.

There is no dedicated platform designed around *intent-based matching* for builders.

---

## The Solution: A Match-First Developer Network

Pal introduces a **match-first networking model** inspired by modern matching platforms, optimized for professional collaboration and growth.

### Core User Flow

1. **Create a Profile**  
   Users connect their GitHub to showcase their tech stack, experience, and activity. They also set an intent such as:
   - Looking for a mentor  
   - Open to reviewing portfolios  
   - Looking for hackathon teammates  
   - Available for short-term gigs or paid sessions  

2. **Discover**  
   Users browse and filter profiles by skills, roles, and interests (e.g. Frontend, Backend, React, Node.js).

3. **Match**  
   A user sends a contextual request (e.g. “Can you review my project?”). The other user accepts or declines.

4. **Engage**  
   Once matched, a chat opens. Sessions can be free or paid depending on the agreement.

5. **Opportunities**  
   Senior developers can post:
   - Mentorship slots  
   - Short-term gigs  
   - Job openings  
   and directly vet candidates through Pal.

---

## Tech Stack

- **Frontend:** Next.js  
- **Backend:** Node.js (Express)  
- **Database:** MongoDB  
- **Payments:** Stellar Network  

---

## Payments & Value Exchange

Pal uses the **Stellar Network** as its native payment layer to support:

- Micropayments for mentorship and portfolio reviews  
- Fast, low-fee cross-border payments  
- Simple settlement for small professional services  

Wallet connection is optional and only required for paid interactions.

---

## Repository Overview

This repository contains the core Pal application.

```

pal-network/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express backend
├── packages/
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configs and constants
├── docs/                 # Architecture and specifications
├── src/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── middlewares/      # Auth, validation, errors
├── .env.example
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── README.md

````

The project follows a **modular, feature-oriented structure** to keep the codebase approachable for contributors.

---

## API & Data Model (High-Level)

### Core Entities

- **User**
  - id
  - name
  - githubUsername
  - techStack
  - intentStatus
  - availability

- **Match**
  - requesterId
  - recipientId
  - status (pending, accepted, declined)

- **Conversation**
  - matchId
  - messages

- **Opportunity**
  - type (mentorship, gig, job)
  - requirements
  - compensation (optional)

APIs follow REST conventions and are versioned for long-term stability.

---

## Getting Started

### Prerequisites

- Node.js (>= 18)
- MongoDB
- Yarn or npm
- Stellar testnet account (for payment features)

### Installation

```bash
git clone https://github.com/Pal-Network/app.git
cd app
npm install
````

### Environment Setup

```bash
cp .env.example .env
```

### Run Locally

```bash
npm run dev
```

---

## Contributing

Pal is an open-source project and welcomes contributors of all experience levels.

### Contribution Workflow

1. Fork the repository
2. Create a branch from `main`
3. Pick an issue or propose one before large changes
4. Keep pull requests focused and well-scoped
5. Add tests or documentation where relevant
6. Open a Pull Request with a clear summary

### Guidelines

* Follow the existing folder structure
* Write clear, descriptive commit messages
* Avoid breaking changes without discussion
* Document new APIs and behaviors

---

## Community & Support

For questions, discussions, and coordination:

👉 **Telegram (Contributors):** ([PalNetwork](https://t.me/+zHoLOF7SrKU3Nzk0))

---

## Maintainer

**Blessing Godwin**

---

## License

This project is open-source and licensed under the **MIT License**.

