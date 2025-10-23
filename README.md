# Inkwell - Coder's Handbook Backend

A backend API for Inkwell, a blog platform where developers can share coding tips, tricks, and knowledge through concise articles and code snippets.

## Overview

Inkwell is designed to be a community-driven platform where coders can:

- Share coding tips and tricks in concise 90-word articles
- Post code snippets with explanations
- Learn from other developers' experiences
- Build a knowledge base of practical coding solutions

## Features

- **User Authentication** - Secure registration and login system
- **Article Management** - Create, read, update, and delete coding articles
- **Code Sharing** - Share code snippets with syntax highlighting support
- **Content Validation** - 90-word limit for article descriptions to keep content concise
- **User Profiles** - Manage user information and article history

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment Management**: dotenv

## Project Structure

```
src/
├── controllers/          # Route handlers and business logic
├── middleware/          # Authentication and validation middleware
├── db/                 # Database connection and configuration
├── generated/          # Prisma generated client files
└── prisma/            # Database schema and migrations
```

## Database Schema

### User Model

- User authentication and profile information
- Relationships to posts and articles

### Post Model

- Article content with 90-word description limit
- Code sections for sharing snippets
- Author relationships and engagement metrics

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/ayushkumar320/inkwell-backend.git
cd inkwell-backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Create .env file with:
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server

```bash
npm run dev
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio for database management

### Code Style

- TypeScript for type safety
- ESM modules with `.js` extensions in imports
- Consistent error handling and response formatting
- Async/await for database operations

## Contributing

We welcome contributions! Please feel free to submit pull requests, report bugs, or suggest new features.

## Credits

**Created and Maintained by:**

- **Ayush Kumar** - [@ayushkumar320](https://github.com/ayushkumar320)
- **Mobasshir Khan** - [@mobi2400](https://github.com/mobi2400)

## License

This project is open source and available under the [MIT License](LICENSE).

---

_Inkwell - Where code meets creativity_ ✨
