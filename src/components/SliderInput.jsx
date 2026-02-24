import React from 'react';
import './SliderInput.css';

/**
 * SliderInput
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
