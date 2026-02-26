/**
 * @file BottomBar.jsx
 * @description Footer component for the GUI panel.
 * @responsibility Provides global controls for synchronization behavior (Live vs. Manual)
 * and handles batch parameter updates to the simulation engine.
 */

import React from 'react';
import { useSimulationParameters } from '../context/SimulationContext';
import { simulationBridge } from '../simulation/simulationBridge';

const BottomBar = () => {
    const { parameters, liveUpdates, toggleLiveUpdates } = useSimulationParameters();

    /**
     * Manually pushes the current React state parameters to the simulation engine.
     * Only used when Live Updates is disabled.
     */
    const handleManualUpdate = () => {
        simulationBridge.update(parameters);
    };

    return (
        <div className="gui-panel-footer">
            <div className="toggle-container">
                <span className="toggle-label">Live Updates</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={ liveUpdates }
                        onChange={ toggleLiveUpdates }
                        aria-label="Toggle Live Updates"
                    />
                    <span className="slider"></span>
                </label>
                <span className="toggle-status" style={{ color: liveUpdates ? '#4CAF50' : '#aaa' }}>
                    { liveUpdates ? 'ON' : 'OFF' }
                </span>
            </div>
            { !liveUpdates && (
                <button
                    className="btn-update"
                    onClick={ handleManualUpdate }
                    type="button"
                >
                    Update
                </button>
            ) }
        </div>
    );
};

export default BottomBar;
