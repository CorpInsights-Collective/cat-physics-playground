import { useEffect, useRef } from 'react'
import Matter, { Mouse, MouseConstraint, Render } from 'matter-js' // Import necessary modules
import confetti from 'canvas-confetti'

/**
 * PhysicsCanvas
 * 
 * A React component that sets up a Matter.js physics engine
 * and renders a simple "cat" rectangle + ground.
 * 
 * This is the MVP physics playground.
 */
export default function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load sounds
    const meowSound = new Audio('/668817__mbpl__cat-meow-1.wav') // Use the correct filename
    meowSound.volume = 0.5

    let muted = false
    let currentBounciness = 0.8 // Default

    // Listen for bounciness changes
    window.addEventListener('setBounciness', (e) => {
      currentBounciness = (e as CustomEvent<number>).detail
    })

    // Create engine and world
    // Create engine and world
    const engine = Matter.Engine.create()
    const world = engine.world

    // Create a renderer (needed for mouse constraint, can be invisible)
    const render = Render.create({
      element: canvas.parentElement || document.body, // Attach to parent or body
      canvas: canvas,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false, // Don't show wireframes
        background: 'transparent' // Make renderer background transparent
      }
    });

    // Create ground (invisible, acts as floor)
    const ground = Matter.Bodies.rectangle(400, 610, 810, 60, { // Make it thicker and slightly below canvas
      isStatic: true,
      render: { visible: false } // Make the physics body invisible
    })

    // Create visible grass rectangle (static visual element)
    const grassHeight = 40
    const grass = Matter.Bodies.rectangle(400, 600 - grassHeight / 2, 800, grassHeight, {
      isStatic: true,
      render: { fillStyle: '#86efac' } // Tailwind green-300
    })

    // Create a "cat" rectangle
    const cat = Matter.Bodies.rectangle(400, 200, 80, 80, {
      restitution: 0.8, // bouncy
      friction: 0.5,
      render: { fillStyle: '#ff69b4' } // pink cat (will be replaced by emoji)
    })

    Matter.World.add(world, [ground, grass, cat])

    // Track hit state for bodies
    const hitBodies = new Map<Matter.Body, number>() // body -> timestamp

    // Add mouse control
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false // Don't draw the constraint line
        }
      }
    });

    Matter.World.add(world, mouseConstraint);

    // Keep track of mouse events for dragging
    render.mouse = mouse;

    // Resize canvas (handled by Render options now)
    // canvas.width = 800
    // canvas.height = 600

    // Animation loop (use Matter's runner or manual loop)
    // Matter.Runner.run(engine); // Use Matter's runner for simplicity
    // Render.run(render); // Run the renderer (even if invisible for mouse)

    // Manual render loop if preferred over Render.run
    const renderLoop = () => {
      Matter.Engine.update(engine, 1000 / 60);

      // Clear canvas (make it transparent to show body background)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw only non-static bodies as emojis + the grass
      for (const body of Matter.Composite.allBodies(world)) {
        if (body === grass) {
          // Draw the grass rectangle
          ctx.fillStyle = body.render.fillStyle || '#86efac';
          ctx.beginPath();
          const vertices = body.vertices;
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let j = 1; j < vertices.length; j++) {
            ctx.lineTo(vertices[j].x, vertices[j].y);
          }
          ctx.closePath();
          ctx.fill();
        } else if (!body.isStatic) {
          const { x, y } = body.position
          ctx.font = '48px serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const now = Date.now()
          const lastHit = hitBodies.get(body) ?? 0
          if (now - lastHit < 200) {
            ctx.fillText('😹', x, y) // Flash different emoji on recent hit
          } else {
            ctx.fillText('🐱', x, y)
          }
        }
      }

      requestAnimationFrame(renderLoop)
    }

    renderLoop()

    // Listen for collisions
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const now = Date.now()
      for (const pair of event.pairs) {
        hitBodies.set(pair.bodyA, now)
        hitBodies.set(pair.bodyB, now)
      }
    })

    // Add click to spawn more cats
    const handleClick = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newCat = Matter.Bodies.rectangle(x, y, 80, 80, {
        restitution: currentBounciness,
        friction: 0.5
      })
      Matter.World.add(world, newCat)
      // Play meow sound
      if (!muted) {
        meowSound.currentTime = 0
        meowSound.play().catch(() => {})
      }
    }

    canvas.addEventListener('click', handleClick)

    // Listener for the 'makeCatsDance' event from App.tsx
    window.addEventListener('makeCatsDance', () => {
      // More complex dance: apply small random forces repeatedly
      const danceDuration = 1000 // ms
      const interval = 100 // ms
      const danceInterval = setInterval(() => {
        for (const body of Matter.Composite.allBodies(world)) {
          if (!body.isStatic) {
            const forceMagnitude = 0.01 * body.mass
            Matter.Body.applyForce(body, body.position, {
              x: (Math.random() - 0.5) * forceMagnitude,
              y: (Math.random() - 0.5) * forceMagnitude,
            })
          }
        }
        // Play meow sound
        if (!muted) {
          meowSound.currentTime = 0
          meowSound.play().catch(() => {})
        }
      }, interval)

      setTimeout(() => clearInterval(danceInterval), danceDuration)

      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    })

    // Listen for gravity mode changes
    const gravityHandler = (e: Event) => {
      const mode = (e as CustomEvent<number>).detail
      if (mode === 0) {
        engine.gravity.y = 1 // normal
      } else if (mode === 1) {
        engine.gravity.y = 0 // zero gravity
      } else if (mode === 2) {
        engine.gravity.y = -1 // reverse gravity
      }
    }

    window.addEventListener('setGravity', gravityHandler)

    // Listen for mute toggle
    const muteHandler = (e: Event) => {
      muted = (e as CustomEvent<boolean>).detail
    }
    window.addEventListener('setMuted', muteHandler)

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('setGravity', gravityHandler)
      window.removeEventListener('setMuted', muteHandler)
      // Stop the renderer and engine on cleanup
      Render.stop(render);
      // Runner.stop(runner); // If using Matter.Runner
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      // Remove the canvas if it was created by Render
      // render.canvas.remove(); // Be careful with this if canvas is managed by React ref
    }
  }, [])

  // Remove border, add rounded corners and shadow to match UI panel
  return <canvas ref={canvasRef} className="rounded-xl shadow-lg" />
}
