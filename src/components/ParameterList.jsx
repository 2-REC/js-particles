import React from 'react';
import SliderInput from './SliderInput';
import ToggleSwitch from './ToggleSwitch';
import ColorPicker from './ColorPicker';
import { PARAMETER_CONFIG } from '../constants/parameterConfig';

/**
 * ParameterList
 *
 * Dynamically renders the appropriate control component for each parameter
 * based on the configuration metadata.
 */
const ParameterList = ({ parameters, onParamChange }) => {
    return (
        <div className="parameter-list">
            { PARAMETER_CONFIG.map((config) => {
                const { key, type, label } = config;
                const currentValue = parameters[key];

                if (type === "int" || type === "float") {
                    return (
                        <SliderInput
                            key={ key }
                            label={ label }
                            min={ config.min }
                            max={ config.max }
                            step={ config.step }
                            type={ type }
                            value={ currentValue }
                            onChange={ (val) => onParamChange(key, val) }
                        />
                    );
                }

                if (type === "boolean") {
                    return (
                        <ToggleSwitch
                            key={ key }
                            label={ label }
                            value={ currentValue }
                            trueLabel={ config.trueLabel }
                            falseLabel={ config.falseLabel }
                            onChange={ (val) => onParamChange(key, val) }
                        />
                    );
                }

                if ( type === "color" ) {
                    return (
                        <ColorPicker
                            key={ key }
                            label={ label }
                            value={ currentValue }
                            onChange={ (val) => onParamChange(key, val) }
                        />
                    );
                }

                return null;
            } ) }
        </div>
    );
};

export default ParameterList;
