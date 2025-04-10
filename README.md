# Cat Physics Playground 🐱🎉

A fun, interactive physics sandbox built with React, Vite, Matter.js, and Tailwind CSS.

Made by **Whiskers** & **Mittens** 🐾

---

## Tech Stack & Concepts

### Packages Used

- **React + Vite:** Fast, modern UI framework and build tool.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **ShadCN UI:** Prebuilt, customizable React components styled with Tailwind.
- **Matter.js:** 2D physics engine for realistic motion, collisions, and forces.
- **canvas-confetti:** Fun confetti animations.
- **TypeScript:** Safer, typed JavaScript.

### What We're Testing & Demonstrating

- **Physics simulation in the browser** using Matter.js.
- **Gravity:** Normal, zero-G, and reverse gravity modes.
- **Elasticity (Restitution):** How bouncy objects are, adjustable live.
- **Friction:** How objects slow down when sliding (fixed for now).
- **Forces:** Applying random forces to make cats "dance."
- **Collision detection:** Cats flash different emojis when they collide.
- **Drag & Drop:** Grab and fling cats with the mouse.
- **Sound integration:** Play meows on events.
- **Fun UI:** Kid-friendly, colorful, emoji-filled interface.

This project is a playful way to learn about **physics engines, event handling, and interactive graphics** in the browser.

---

## Features

- 🐱 Spawn unlimited bouncing cats
- 🎉 Make cats dance with confetti and meows
- 🌎 Toggle gravity: normal, zero-G, reverse
- 🐾 Drag and fling cats around the park
- 🎵 Mute/unmute sound effects
- 🏞️ Cute park background with emojis
- 🌈 Colorful, kid-friendly UI
- ⚡ Adjust cat bounciness live
- 😹 Cats flash different emojis on collision
- 🔄 Restart button to clear the chaos

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/cat-physics-playground.git
cd cat-physics-playground
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment (Vercel)

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Import your repo
5. Click **Deploy**

You'll get a live URL to share!

---

## Customizing

- Replace the **meow sound** by putting your own `.wav` file in `public/` and updating the filename in `src/PhysicsCanvas.tsx`.
- Change emojis or add images for cats.
- Tweak physics parameters in `src/PhysicsCanvas.tsx`.
- Style the UI with Tailwind classes in `src/App.tsx` and `src/index.css`.

---

## Credits

Built with ❤️ by **Whiskers** & **Mittens** (our secret cat coders!)

---

## License

MIT
