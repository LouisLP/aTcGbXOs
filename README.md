# Autarc Comments App

![Example application screenshot](public/example-screenshot.png)

Full stack commenting system built with React, TypeScript, Express, and SQLite for autarc's take-home challenge. Featuring:

- **Threaded Comments**: Nested replies with visual depth indicators
- **Real-time Persistence**: Comments stored in SQLite database
- **Modern UI**: Dark theme with Tailwind CSS (because my eyes hurt), responsive, and user-friendly
- **TypeScript**: Full type safety across frontend and backend
- **RESTful API**: Basic Express.js backend

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn (I like npm)

### Installation

1. **Clone the repository and install dependencies**

   ```bash
   git clone https://github.com/LouisLP/aTcGbXOs.git
   npm install
   ```

2. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start both:
   - Frontend (React with Vite): `http://localhost:5173`
   - Backend (Express): `http://localhost:3001`

3. **Open it up**

   Go to `http://localhost:5173` to use the app.

## 🏗 Architecture

### Database Schema

Comments are (obviously) at the heart of the application, so knowing the structure of the schema is useful when interacting with it. The `created_at` field gave me some issues when SQLite was using UTC rather than local time, so I made it take in an input.

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  parent_id TEXT,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);
```

## 🌐 API Endpoints

| Method   | Endpoint            | Description                              |
| -------- | ------------------- | ---------------------------------------- |
| `GET`    | `/api/comments`     | Retrieve all comments (nested structure) |
| `POST`   | `/api/comments`     | Create a new comment or reply            |
| `DELETE` | `/api/comments/:id` | Delete a comment and its replies         |

> There's also a health-check endpoint at `/api/health`

## 🧪 Testing

I included some basic Vitest tests to cover the main functionality, which I would consider the utilities on the server side (such as building the comment tree). I'm more familiar with Vue, and I didn't work on component tests yet in React.

```bash
# Run tests in watch mode
npm test
```

## 🪞 Reflections/Extras

1. I'm used to using Vue, so a lot of this was getting back into the React mindset, and asking myself, "what's the best equivalent to what I'd do in Vue?". For example, I'd probably make a [composable](https://vuejs.org/guide/reusability/composables) for `useComments`, but a [custom hook](https://react.dev/learn/reusing-logic-with-custom-hooks) in React serves a similar purpose.
2. With more time, I'd add more tests and varied test types.
3. After clicking "reply", you should keep your scroll position.
4. Upon adding enough replies, the scrollbar appears and pops the content to the side slightly.
5. Mobile could be considered a bit more with dynamic resizing of reply margins, for example.
