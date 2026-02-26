/**
 * @file SimulationContext.jsx
 * @description Central React Context for simulation parameter management.
 * @responsibility Stores global parameters, provides an immutable update interface, and manages the Live Update toggle state.
 */

import React, { createContext, useState, useContext } from 'react';

/**
 * Initial parameter values strictly following parameters.txt specifications.
 * @type {Object}
 */
const DEFAULT_PARAMETERS = {
    FPS: 60,
    PARTICLE_COUNT: 3000,
    PARTICLE_RADIUS: 2.0,
    PARTICLE_PHASE: 0.03,
    PARTICLE_MIN_SPEED: 0.1,
    PARTICLE_MAX_SPEED: 100.0,
    MOUSE_FORCE: 100.0,
    FORCE_RADIUS: 100.0,
    FORCE_INCREASE: false,
    CONTACT_RADIUS: 25.0,
    PARTICLE_LIFESPAN: 5,
    PARTICLES_RESPAWN: false,
    MOUSE_PARTICLE: false,
    DRAW_LINES: true,
    LINE_WIDTH: 0.8,
    PARTICLE_COLOR: { r: 207, g: 255, b: 4 },
    DEAD_PARTICLE_COLOR: { r: 255, g: 0, b: 0 },
    BACKGROUND_COLOR: { r: 0, g: 0, b: 0 }
};

const SimulationContext = createContext();

/**
 * SimulationProvider
 * Wraps the application to provide access to simulation state.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element} The context provider.
 */
export const SimulationProvider = ({ children }) => {
    const [parameters, setParameters] = useState(DEFAULT_PARAMETERS);
    const [liveUpdates, setLiveUpdates] = useState(true);

    /**
     * Updates specific parameters in the state using an immutable pattern.
     * @param {Object} newParams - Key-value pairs of parameters to update.
     */
    const updateParameters = (newParams) => {
        setParameters((prev) => ({
            ...prev,
            ...newParams
        }));
    };

    /**
     * Toggles the global Live Update state.
     */
    const toggleLiveUpdates = () => {
        setLiveUpdates((prev) => !prev);
    };

    return (
        <SimulationContext.Provider value={{
            parameters,
            updateParameters,
            liveUpdates,
            toggleLiveUpdates
        }}>
            { children }
        </SimulationContext.Provider>
    );
};

/**
 * Custom hook for accessing simulation parameters and update logic.
 * @throws {Error} If used outside of a SimulationProvider.
 * @returns {Object} The context value.
 */
export const useSimulationParameters = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulationParameters must be used within a SimulationProvider');
    }
    return context;
};
