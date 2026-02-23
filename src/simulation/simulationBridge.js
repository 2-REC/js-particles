/**
 * Simulation Bridge
 *
 * Communication layer between React GUI and JavaScript particle simulation engine.
 */

let activeSimulation = null;

export const simulationBridge = {
    register(api) {
        if (api && typeof api.updateParams === 'function') {
            activeSimulation = api;
            console.log("Simulation Bridge: Engine registered successfully.");
        } else {
            console.error("Simulation Bridge: Invalid engine API provided.");
        }
    },

    update(params) {
        if (!activeSimulation) {
            console.warn("Simulation Bridge: No active simulation to update.");
            return;
        }

        const sanitizedParams = { ...params };

        /* TODO: add more checks? */

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

    dispose() {
        if (activeSimulation && typeof activeSimulation.cleanup === 'function') {
            activeSimulation.cleanup();
            activeSimulation = null;
            console.log("Simulation Bridge: Engine disposed.");
        }
    }
};
