/**
 * @file simulationBridge.js
 * @description Communication layer between React state management and the vanilla JS simulation engine.
 * @responsibility Sanitizes UI inputs and manages the lifecycle of the simulation registration.
 */

/** @type {Object|null} Internal reference to the registered simulation API */
let activeSimulation = null;

/**
 * Singleton bridge object facilitating data flow from React to the Canvas engine.
 */
export const simulationBridge = {

    /**
     * Registers a simulation instance to the bridge.
     * @param {Object} api - The engine's exposed API (must contain updateParams and cleanup).
     */
    register(api) {
        if (api && typeof api.updateParams === 'function') {
            activeSimulation = api;
            console.log("Simulation Bridge: Engine registered successfully.");
        } else {
            console.error("Simulation Bridge: Invalid engine API provided.");
        }
    },

    /**
     * Sanitizes and pushes parameter updates to the active simulation.
     * @param {Object} params - The updated parameter set from React state.
     */
    update(params) {
        if (!activeSimulation) {
            console.warn("Simulation Bridge: No active simulation to update.");
            return;
        }

        const sanitizedParams = { ...params };

        const colorKeys = ["PARTICLE_COLOR", "DEAD_PARTICLE_COLOR", "BACKGROUND_COLOR"];
        colorKeys.forEach(key => {
            if (sanitizedParams[key]) {
                const color = sanitizedParams[key];
                sanitizedParams[key] = {
                    r: Math.max(0, Math.min(255, color.r)),
                    g: Math.max(0, Math.min(255, color.g)),
                    b: Math.max(0, Math.min(255, color.b))
                };
            }
        } );

        activeSimulation.updateParams(sanitizedParams);
    },

    /**
     * Cleans up simulation resources and removes the active reference.
     */
    dispose() {
        if (activeSimulation && typeof activeSimulation.cleanup === 'function') {
            activeSimulation.cleanup();
            activeSimulation = null;
            console.log("Simulation Bridge: Engine disposed.");
        }
    }
};
