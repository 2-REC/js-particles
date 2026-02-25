/**
 * Parameter Validation Utility
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
