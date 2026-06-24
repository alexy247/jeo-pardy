# Jeo-Pardy 🎬

A modern, interactive Jeopardy-style trivia game platform built with React and TypeScript. Test your knowledge across multiple categories, compete with other players in real-time, and track scores on a dynamic leaderboard.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture & Design](#architecture--design)
- [Key Components](#key-components)
- [Database Integration](#database-integration)

## ✨ Features

### Functional Features
- **Multi-Player Gameplay**: Play Jeopardy-style games with real-time multiplayer support
- **Question Categories**: Organize questions into multiple categories with progressive difficulty
- **Score Management**: Real-time score tracking and updates during gameplay
- **Leaderboard System**: Competitive ranking system to display top players
- **Game Sessions**: Create and manage game sessions with custom question packs
- **Question Types**: Support for various media types (text, images, audio, video)
- **User Authentication**: Secure login and registration system
- **Custom Question Packs**: Create and browse custom question collections
- **Timed Rounds**: Multiple rounds with organized turn-based gameplay

### Technical Features
- **Real-time Updates**: WebSocket integration for live gameplay synchronization
- **Type-Safe Development**: Full TypeScript support with strict type checking
- **Component-Based Architecture**: Modular, reusable React components
- **State Management**: Centralized game state using Zustand and Context API
- **Responsive Design**: Mobile-friendly interface with CSS styling
- **ESLint Integration**: Code quality standards and best practices enforcement

## 🛠 Technology Stack

**Frontend Framework:**
- **React 18.3** - UI library with hooks support
- **TypeScript 5.5** - Type-safe JavaScript
- **Vite 5.4** - Lightning-fast build tool with HMR

**Styling:**
- **CSS** - Custom styling (6.4% of codebase)

**State Management:**
- **Zustand 5.0** - Lightweight state management
- **Context API** - React's built-in state solution
- **React Router 6.26** - Client-side routing

**Backend & Database:**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - User authentication system

**Development Tools:**
- **ESLint 9.9** - Code linting and quality checking
- **TypeScript ESLint** - Type-aware linting rules

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/alexy247/jeo-pardy.git
cd jeo-pardy
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
Create a `.env.local` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build for production (TypeScript compilation + Vite build) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 🏗 Architecture & Design

### Routing Structure
The application uses React Router for client-side routing with nested layouts:

- **Main Layout** - Base layout for public pages
- **Connection Layout** - Layout for authenticated features (packs, registration, game creation)
- **Game Layout** - Specialized layout for active gameplay

### State Management

**GameContext (Context API):**
- User authentication state
- Sign-in/sign-up methods
- User session data

**useGameStore (Zustand):**
- Game-specific state
- Current game data
- Player scores and positions

### Real-time Features
Custom hooks handle real-time game updates from Supabase:
- `useHybridQuestionRealtime` - Monitors current question updates
- `useHybridRoundRealtime` - Tracks round progression and state changes

## 🧩 Key Components

### Layout Components
- **Layout** - Main application wrapper
- **GameLayout** - Game-specific container with score display
- **ConnectionLayout** - Layout for connection-required features

### Game Components
- **Board** - Main game board with question grid
- **Question** - Individual question display with media support
- **Answer** - Answer submission interface
- **Categories** - Category selection screen
- **Leaderboard** - Real-time player rankings
- **Timer** - Round/question countdown timer

### Media Components
- **MediaBlock** - Container for multimedia content
- **ImageBlock** - Image display with responsive sizing
- **AudioBlock** - Audio player
- **VideoBlock** - Video player with controls

### UI Components
- **InputField** - Reusable form input
- **ButtonsContainer** - Flex layout for button groups
- **Table** - Data display with headers and rows
- **UlList** - Unordered list with item components

## 🗄 Database Integration

### Supabase Features Used
- **PostgreSQL Database** - Questions, players, scores, and game sessions
- **Real-time Subscriptions** - Live updates during gameplay
- **Authentication** - User login and registration management
- **Storage** - Media file storage for questions

### Data Converters
Type-safe data transformation layer between API responses and application state:
- Answer response formatting
- Question pack transformation
- Player ranking data
- Round state management

## 🎨 Styling

The project uses custom CSS (6.4% of codebase) for styling. The design follows the color palette:
- Primary Blue: `#11296B`
- Secondary Blue: `#00509D`
- Light Gray: `#EDEDED`
- Gold/Yellow: `#FFDB57`, `#FFCB05`

## 📦 Dependencies

**Core Dependencies:**
- `react` (18.3.1) - UI framework
- `react-dom` (18.3.1) - React DOM rendering
- `react-router-dom` (6.26.2) - Routing solution
- `@supabase/supabase-js` (2.95.3) - Backend services
- `zustand` (5.0.11) - State management
- `classnames` (2.5.1) - Conditional CSS class utility

**Development Dependencies:**
- TypeScript, ESLint, Vite with React plugin

## 🔒 Security & Best Practices

- Type-safe development with TypeScript strict mode
- Environment-based configuration for sensitive data
- ESLint rules for code quality and consistency
- Real-time updates handled securely through Supabase

## 📱 Responsive Design

The application is built with mobile-first principles, ensuring smooth gameplay on:
- Desktop browsers
- Tablets
- Mobile devices

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Happy Jeopardy Playing! 🎮**
