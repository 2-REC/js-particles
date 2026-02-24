import React, { useEffect } from 'react';
import { initSimulation } from './simulation/particles';
import { simulationBridge } from './simulation/simulationBridge';
import { useSimulationParameters } from './context/SimulationContext';
import GuiPanel from './components/GuiPanel';
import './simulation/particles.css';

/**
 * App Component
 * Bridge between React and JS.
 */
function App() {
    const { parameters } = useSimulationParameters();

    useEffect(() => {
        const simulation = initSimulation(parameters);
        simulationBridge.register(simulation);

        // example to update params during session
        /*
        const timer = setTimeout(() => {
            simulationBridge.update({
                PARTICLE_COUNT: 100,
                FORCE_RADIUS: 1000
            });
        }, 3000);
        */

        return () => {
            simulationBridge.dispose();
        }
    }, [ ]);

    return (
        <div id="container">
            <canvas id="particles_canvas"></canvas>

            <div id="particles_counter">00</div>
            <div id="display_fps">00</div>
            <div id="logic_fps">00</div>

            <button id="particles_button" style={{ display: 'none' }}>Restart Simulation</button>
            <div id="gui-root">
                <GuiPanel>
                    <p style={{ fontSize: '0.8em', opacity: 0.7 }}>
                        GUI Panel initialized. Drag the header to move.
                    </p>
                </GuiPanel>
            </div>
        </div>
    );
}

export default App;
