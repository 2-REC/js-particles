import React, { useEffect } from 'react';
import { initSimulation } from './simulation/particles';
import { simulationBridge } from './simulation/simulationBridge';
import { useSimulationParameters } from './context/SimulationContext';
import GuiPanel from './components/GuiPanel';
import SliderInput from './components/SliderInput';
import ToggleSwitch from './components/ToggleSwitch';
import ColorPicker from './components/ColorPicker';
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

    const handleParamChange = (key, value) => {
        const update = { [key]: value };
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
                    <SliderInput
                        label="Particle Count"
                        min={ 1 }
                        max={ 10000 }
                        step={ 1 }
                        value={ parameters.PARTICLE_COUNT }
                        onChange={ (val) => handleParamChange('PARTICLE_COUNT', val) }
                        type="int"
                    />
                    <SliderInput
                        label="Particle Radius"
                        min={ 1 }
                        max={ 100 }
                        step={ 0.1 }
                        value={ parameters.PARTICLE_RADIUS }
                        onChange={ (val) => handleParamChange('PARTICLE_RADIUS', val) }
                        type="float"
                    />
                    <SliderInput
                        label="Force Radius"
                        min={ 0 }
                        max={ 10000 }
                        step={ 10 }
                        value={ parameters.FORCE_RADIUS }
                        onChange={ (val) => handleParamChange('FORCE_RADIUS', val) }
                        type="float"
                    />
                    <ToggleSwitch
                        label="Draw Lines"
                        value={ parameters.DRAW_LINES }
                        onChange={ (val) => handleParamChange('DRAW_LINES', val) }
                    />
                    <ToggleSwitch
                        label="Respawn Particles"
                        value={ parameters.PARTICLES_RESPAWN }
                        onChange={ (val) => handleParamChange('PARTICLES_RESPAWN', val) }
                        trueLabel="Yes"
                        falseLabel="No"
                    />
                    <ToggleSwitch
                        label="Mouse Force Increase"
                        value={ parameters.FORCE_INCREASE }
                        onChange={ (val) => handleParamChange('FORCE_INCREASE', val) }
                    />
                    <ColorPicker
                        label="Particle Color"
                        value={ parameters.PARTICLE_COLOR }
                        onChange={ (val) => handleParamChange('PARTICLE_COLOR', val) }
                    />
                    <ColorPicker
                        label="Background Color"
                        value={ parameters.BACKGROUND_COLOR }
                        onChange={ (val) => handleParamChange('BACKGROUND_COLOR', val) }
                    />
                </GuiPanel>
            </div>
        </div>
    );
}

export default App;
