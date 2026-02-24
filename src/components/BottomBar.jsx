import React from 'react';
import { useSimulationParameters } from '../context/SimulationContext';
import { simulationBridge } from '../simulation/simulationBridge';

/**
 * BottomBar
*/
const BottomBar = () => {
    const { parameters, liveUpdates, toggleLiveUpdates } = useSimulationParameters();

    const handleManualUpdate = () => {
        simulationBridge.update(parameters);
    };

    return (
        <div className="gui-panel-footer">
            <div className="toggle-container">
                <span>Live Updates</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={ liveUpdates }
                        onChange={ toggleLiveUpdates }
                    />
                    <span className="slider"></span>
                </label>
                <span style={{ color: liveUpdates ? '#4CAF50' : '#aaa', width: '25px' }}>
                    { liveUpdates ? 'ON' : 'OFF' }
                </span>
            </div>
            { !liveUpdates && (
                <button
                    className="btn-update"
                    onClick={ handleManualUpdate }
                >
                    Update
                </button>
            ) }
        </div>
    );
};

export default BottomBar;
