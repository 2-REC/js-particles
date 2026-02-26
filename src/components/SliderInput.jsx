/**
 * @file SliderInput.jsx
 * @description A synchronized dual-input control for numeric parameters.
 * @responsibility Manages a range slider and a numeric text input, ensuring both
 * stay in sync and respect min/max boundaries.
 */

import React from 'react';
import './SliderInput.css';

/**
 * SliderInput component for Integer and Float parameters.
 *
 * @param {Object} props
 * @param {string} props.label - Display label for the parameter.
 * @param {number} props.min - Minimum allowable value.
 * @param {number} props.max - Maximum allowable value.
 * @param {number} props.step - Incremental step for the slider.
 * @param {number} props.value - Current value from React state.
 * @param {Function} props.onChange - Callback triggered when the value changes.
 * @param {string} props.type - Numeric type: "int" or "float".
 */
const SliderInput = ({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    type = "int"
}) => {
    /**
     * Handles change events from both the range and number inputs.
     * Parses input strings into appropriate numeric types and clamps to bounds.
     */
    const handleValueChange = (e) => {
        let newValue = e.target.value;

        if (type === "int") {
            newValue = parseInt(newValue, 10);
        } else {
            newValue = parseFloat(newValue);
        }

        if (isNaN(newValue))
            return;

        const clampedValue = Math.min(max, Math.max(min, newValue));

        onChange(clampedValue);
    };

    return (
        <div className="slider-input-group">
            <div className="slider-input-label-row">
                <label className="slider-input-label">{ label }</label>
            </div>
            <div className="slider-input-controls">
                <input
                    type="range"
                    className="slider-input-range"
                    min={ min }
                    max={ max }
                    step={ step }
                    value={ value }
                    onChange={ handleValueChange }
                />
                <input
                    type="number"
                    className="slider-input-number"
                    min={ min }
                    max={ max }
                    step={ step }
                    value={ value }
                    onChange={ handleValueChange }
                />
            </div>
        </div>
    );
};

export default SliderInput;
