import React, { useEffect } from 'react';
import { initSimulation } from './simulation/particles';
import { simulationBridge } from './simulation/simulationBridge';
import { useSimulationParameters } from './context/SimulationContext';
import { applyParameterConstraints } from './utils/parameterValidation';
import GuiPanel from './components/GuiPanel';
import ParameterList from './components/ParameterList';
import './simulation/particles.css';

/**
 * App Component
 * Bridge between React and JS.
 */
function App() {
    const { parameters, updateParameters, liveUpdates } = useSimulationParameters();

    useEffect(() => {
        const simulation = initSimulation(parameters);
        simulationBridge.register(simulation);

        return () => {
            simulationBridge.dispose();
        };
    }, [ ]);

    const handleParamChange = (key, value) => {
        const update = applyParameterConstraints(key, value, parameters);

        updateParameters(update);

        if (liveUpdates) {
            simulationBridge.update(update);
        }
    };

    return (
        <div id="container">
            <canvas id="particles_canvas"></canvas>

            <div id="particles_counter">00</div>
            <div id="display_fps">00</div>
            <div id="logic_fps">00</div>

            <button id="particles_button" style={{ display: 'none' }}>Restart Simulation</button>

            <div id="gui-root">
                <GuiPanel>
                    <ParameterList
                        parameters={ parameters }
                        onParamChange={ handleParamChange }
                    />
                </GuiPanel>
            </div>
        </div>
    );
}

export default App;
