/**
 * Parameter Configuration Metadata
 */

export const PARAMETER_CONFIG = [
    { key: "FPS", label: "FPS", type: "int", min: 1, max: 120, step: 1 },
    { key: "PARTICLE_COUNT", label: "Particle Count", type: "int", min: 1, max: 10000, step: 1 },
    { key: "PARTICLE_RADIUS", label: "Particle Radius", type: "float", min: 1, max: 100, step: 0.1 },
    { key: "PARTICLE_PHASE", label: "Particle Phase", type: "float", min: 0.01, max: 6.28, step: 0.01 },
    { key: "PARTICLE_MIN_SPEED", label: "Min Speed", type: "float", min: 0.1, max: 1000, step: 0.1 },
    { key: "PARTICLE_MAX_SPEED", label: "Max Speed", type: "float", min: 0.1, max: 1000, step: 1 },
    { key: "MOUSE_FORCE", label: "Mouse Force", type: "float", min: -10000, max: 10000, step: 10 },
    { key: "FORCE_RADIUS", label: "Force Radius", type: "float", min: 0, max: 10000, step: 10 },
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
