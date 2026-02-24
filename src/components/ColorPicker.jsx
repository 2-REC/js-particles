import React from 'react';
import './ColorPicker.css';

/* Converts RGB object to Hex string */
const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/* Converts Hex string to RGB object */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * ColorPicker Component
 */
const ColorPicker = ({ label, value, onChange, disabled = false }) => {
    const currentHex = rgbToHex(value.r, value.g, value.b);

    const handleColorChange = (e) => {
        if (disabled)
            return;

        const newRgb = hexToRgb(e.target.value);
        if (newRgb) {
            onChange(newRgb);
        }
    };

    return (
        <div className={ `color-picker-group ${disabled ? 'disabled' : ''}` }>
            <label className="color-picker-label">{ label }</label>
            <div className="color-picker-controls">
                <span className="color-hex-readout">{ currentHex }</span>
                <div
                    className="color-swatch-container"
                    style={{ backgroundColor: currentHex }}
                >
                    <input
                        type="color"
                        className="color-native-input"
                        value={ currentHex }
                        onChange={ handleColorChange }
                        disabled={ disabled }
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
