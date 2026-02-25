import React, { createContext, useState, useContext } from 'react';

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
 * Manages global state for all simulation parameters.
 */
export const SimulationProvider = ({ children }) => {
    const [parameters, setParameters] = useState(DEFAULT_PARAMETERS);
    const [liveUpdates, setLiveUpdates] = useState(true);

    const updateParameters = (newParams) => {
        setParameters((prev) => ({
            ...prev,
            ...newParams
        }));
    };

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
 * Custom hook for easy access to simulation state
 */
export const useSimulationParameters = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulationParameters must be used within a SimulationProvider');
    }
    return context;
};
