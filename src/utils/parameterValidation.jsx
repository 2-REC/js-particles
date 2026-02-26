/**
 * @file parameterValidation.js
 * @description Logic for enforcing simulation parameter consistency.
 * @responsibility Intercepts UI updates to ensure dependent parameters (like Min/Max speeds) stay synchronized.
 */

/**
 * Enforces logical constraints between parameters during the update process.
 *
 * @param {string} key - The identifier of the parameter being changed.
 * @param {any} value - The new value intended for the parameter.
 * @param {Object} currentParams - The current state of all parameters.
 * @returns {Object} An update object containing one or more validated parameter changes.
 */
export const applyParameterConstraints = (key, value, currentParams) => {
    let update = { [key]: value };

    switch (key) {
        case 'PARTICLE_MIN_SPEED':
            if ( value > currentParams.PARTICLE_MAX_SPEED ) {
                update.PARTICLE_MAX_SPEED = value;
            }
            break;

        case 'PARTICLE_MAX_SPEED':
            if ( value < currentParams.PARTICLE_MIN_SPEED ) {
                update.PARTICLE_MIN_SPEED = value;
            }
            break;

        // TODO: want?
        /*
        case 'CONTACT_RADIUS':
            if (value > currentParams.FORCE_RADIUS) {
                update.FORCE_RADIUS = value;
            }
            break;
        */

        default:
            break;
    }

    return update;
};
