# 🧘‍♂️ PomoHaven - The Deep Focus Sanctuary

**PomoHaven** is a premium productivity platform designed to anchor your mind into deep focus states. By combining the scientifically-backed Pomodoro technique with high-fidelity atmospheric soundscapes, it transforms your workspace into a digital sanctuary.

## ✨ Core Features

### 🕒 Focus Dashboard
- **Precision Timer**: A sleek, animated Timer Orb that provides immediate visual feedback on your session progress.
- **Dynamic Quickset**: Rapidly adjust your focus times with curated presets or precise custom inputs.
- **Micro-Beeps**: Discreet countdown auditory cues to signal the final 10 seconds without breaking flow.

### 🎵 Audio Sanctuary
- **Infinite Soundscapes**: Integrated YouTube-powered player carrying the best in focus music—from **Lofi Girl** to deep **Ambient Space** and **Mountain Rain**.
- **Musical Library**: A genre-based gallery to explore and select the perfect frequencies for your current task.
- **Metadata Sync**: Real-time extraction of YouTube track metadata (Artist/Title) for a seamless aesthetic experience.

### 🔗 Intelligent Synchronization
- **Flow Engine**: The audio system is intelligently synced with your timer. Music starts with your focus session and pauses automatically during rest periods.
- **Persisted Sanctum**: Your favorite soundtracks and timer settings are preserved across sessions via Pinia and LocalStorage.

### ⛴️ Universal Deployment
- **Docker Ready**: Fully containerized for consistent performance across all environments. Spin up the entire sanctuary in seconds with a single command.

---

## 🛠️ Tech Stack

- **Core**: [Nuxt 4](https://nuxt.com/) (Composition API, Script Setup)
- **State**: [Pinia](https://pinia.vuejs.org/) for multi-module state (Timer & Audio)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom "Deep Focus" Design System
- **Utils**: [@vueuse/nuxt](https://vueuse.org/) for reactive power
- **Icons**: Material Symbols Outlined
- **Runtime**: Node.js 20+

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/quyetcot/web-pomohaven.git
   cd web-pomohaven
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *Your sanctuary is now live at `http://localhost:3000`.*

### Running with Docker
To deploy the application in a consistent container environment:
```bash
docker-compose up --build -d
```

---

## 📁 Project Structure (Nuxt 4)

- `app/`: The root directory for all application source code.
  - `components/`: Modular UI components (Base, Feature, The-).
  - `composables/`: Reusable business logic (useMusicLibrary, etc).
  - `pages/`: Application routing and view logic.
  - `stores/`: Global state management (Timer, Audio).
  - `layouts/`: Shared visual wrappers.
  - `assets/`: Styling, logos, and global design tokens.

---

## 🎨 Design Philosophy: The Deep Focus Sanctuary
PomoHaven is built on the **"Sanctuary"** principle:
- **No distractions**: Minimalist UI that gets out of your way.
- **High fidelity**: Visual and auditory excellence to wow the user.
- **Fluidity**: Transitions and animations that mirror the calm of a focused mind.

---

*Enjoy your sanctuary.*
