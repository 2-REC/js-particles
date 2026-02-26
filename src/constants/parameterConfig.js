/**
 * @file parameterConfig.js
 * @description Metadata configuration for simulation parameters.
 * @responsibility Defines the UI representation (labels, ranges, types) for every parameter in the system.
 */

/**
 * Registry of simulation parameters.
 * Used by ParameterList to dynamically render Slider, Toggle, or ColorPicker components.
 *
 * Values and ranges are derived from the project's parameters.txt.
 * @type {Array<Object>}
 */
export const PARAMETER_CONFIG = [
    { key: "FPS", label: "FPS", type: "int", min: 1, max: 120, step: 1 },
    { key: "PARTICLE_COUNT", label: "Particle Count", type: "int", min: 1, max: 10000, step: 1 },
    { key: "PARTICLE_RADIUS", label: "Particle Radius", type: "float", min: 0.5, max: 1000, step: 0.5 },
    { key: "PARTICLE_PHASE", label: "Particle Phase", type: "float", min: 0.0, max: 3.14, step: 0.01 },
    { key: "PARTICLE_MIN_SPEED", label: "Min Speed", type: "float", min: 0.1, max: 1000, step: 0.1 },
    { key: "PARTICLE_MAX_SPEED", label: "Max Speed", type: "float", min: 0.1, max: 1000, step: 0.1 },
    { key: "MOUSE_FORCE", label: "Mouse Force", type: "float", min: -5000, max: 5000, step: 1 },
    { key: "FORCE_RADIUS", label: "Force Radius", type: "float", min: 0, max: 10000, step: 1 },
    { key: "FORCE_INCREASE", label: "Force Increase", type: "boolean" },
    { key: "CONTACT_RADIUS", label: "Contact Radius", type: "float", min: 0, max: 10000, step: 1 },
    { key: "PARTICLE_LIFESPAN", label: "Particle Lifespan", type: "int", min: 0, max: 1000, step: 1 },
    { key: "PARTICLES_RESPAWN", label: "Respawn Particles", type: "boolean", trueLabel: "Yes", falseLabel: "No" },
    { key: "MOUSE_PARTICLE", label: "Mouse Particle", type: "boolean" },
    { key: "DRAW_LINES", label: "Draw Lines", type: "boolean" },
    { key: "LINE_WIDTH", label: "Line Width", type: "float", min: 0.1, max: 100, step: 0.1 },
    { key: "PARTICLE_COLOR", label: "Particle Color", type: "color" },
    { key: "DEAD_PARTICLE_COLOR", label: "Dead Particle Color", type: "color" },
    { key: "BACKGROUND_COLOR", label: "Background Color", type: "color" }
];
