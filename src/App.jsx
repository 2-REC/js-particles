import React, { useEffect } from 'react';
import { initSimulation } from './simulation/particles';
import './simulation/particles.css';

/**
 * App Component
 * Bridge between React and JS.
 */
function App() {
    useEffect(() => {
        // example with init values
        //const simulation = initSimulation({ PARTICLE_COUNT: 500 });
        const simulation = initSimulation();

        // example to update params during session
        /*
        const timer = setTimeout(() => {
            simulation.updateParams({
                PARTICLE_COUNT: 100,
                FORCE_RADIUS: 1000
            });
        }, 3000);
        */

        return () => simulation.cleanup();
    }, [ ]);

    return (
        <div id="container">
            <canvas id="particles_canvas"></canvas>
            <div id="particles_counter">00</div>
            <div id="display_fps">00</div>
            <div id="logic_fps">00</div>

            <button id="particles_button">Restart Simulation</button>
            <div id="gui-root"></div>
        </div>
    );
}

export default App;
