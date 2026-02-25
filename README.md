# js-particles

**js-particles** is an experimental particle simulation playground project written in JavaScript, and controlled through a React GUI.

It was originally built as a learning project to explore hybrid architectures combining a standalone rendering engine with a modular React interface.
While bascially useless, it serves as a flexible sandbox for experimenting with particle behaviors and UI-driven simulation control.

[Try it here!](https://2-rec.github.io/js-particles/)


## Overview

The project separates concerns cleanly between:

* A **pure JavaScript particle simulation engine**
* A **React GUI layer** for real-time parameter control
* A **bridge layer** connecting UI state to the simulation without tightly coupling them

This architecture makes the simulation easy to extend, control, and refactor.


## Features

### Simulation Engine

* High-performance particle engine
* Mouse interaction with configurable force, radius, and behavior
* Particle lifecycle management (spawn, death, respawn)
* Configurable visual properties

### React GUI

* Draggable floating control panel
* Real-time parameter editing
* Automatic controls generation from configuration (color pickers, sliders and toggles)

### Data Flow Architecture

* Clean separation between engine and UI
* Bridge-based synchronization layer
* Two update modes:
    * Live Updates: real-time individual changes
    * Manual Updates: on demand batch changes


## Usage

### Panel Interaction

* **Open Panel:** Press `ENTER` or `SPACE`.
* **Close Panel:** Press `ESC` or click the "×" button in the top bar.
* **Move Panel:** Grab and drag the top bar (header) to reposition the GUI anywhere on the screen.

### Update Logic

* **Live Updates (ON):** Every change to a control parameter is pushed immediately to the simulation.
* **Live Updates (OFF):** Changes remain local to the GUI, allowing to stage multiple adjustments. Clicking the "Update" button apply all changes simultaneously.


## Control Parameters

The simulation is controlled by a series of parameters:

* **FPS**: Target frame rate.
* **Particle Count**: Total number of particles.
* **Particle Radius**: Size of particles.
* **Particle Phase**: Transparency oscillation speed. Controls how quickly particles fade in and out.
* **Min Speed / Max Speed**: Movement speed range.
* **Particle Lifespan**: Duration of dead particles. Defines how many updates a particle remains visible before being removed from the simulation.
* **Respawn Particles**: Enable/disable respawning. Determines if particles are recreated when they "die" or when they exit the canvas boundaries.
* **Mouse Force**: Determines the strength of the force the mouse exerts on nearby particles. A positive values attract particles, negative values repel them.
* **Force Radius**: Distance of mouse influence.
* **Force Increase**: Determines force behavior. If enabled, particles move faster the closer they are to the mouse, and if disabled, they move faster when further away.
* **Contact Radius**: Collision detection distance, triggering particle's "death" and transition to the dead state.
* **Mouse Particle**: A toggle to render a visual indicator (a particle) at the mouse cursor's current position.
* **Draw Lines**: Toggles the visibility of connection lines drawn between the mouse cursor and particles within the force radius.
* **Line Width**: Connection line thickness.
* **Particle Color**: RGB color of particles.
* **Dead Particle Color**: RGB color of particles that have been killed and are in their fading lifespan phase.
* **Background Color**: RGB color of the background.


## Technologies Used

* JavaScript (ES6+)
* React
* HTML5 Canvas
* CSS3
* Vite (development environment)

No external simulation libraries are used.


## Run Locally

```bash
git clone https://github.com/2-rec/js-particles.git
cd js-particles
npm install
npm run dev
```


## Future Improvements

Potential enhancements include:

* Preset management (save/load configurations)
* Mobile support
* Performance optimizations
* Additional particle behaviors
