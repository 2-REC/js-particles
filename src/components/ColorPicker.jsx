/**
 * @file ColorPicker.jsx
 * @description A control component for modifying RGB simulation colors.
 * @responsibility Interfaces with the browser's native color picker while maintaining
 * synchronization with the simulation's RGB object state.
 */

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

/**
 * Converts a Hex string to an RGB object.
 * @param {string} hex - Hex color string.
 * @returns {Object|null} { r, g, b } or null if invalid.
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * ColorPicker component.
 *
 * @param {Object} props
 * @param {string} props.label - Parameter label.
 * @param {Object} props.value - Current RGB value { r, g, b }.
 * @param {Function} props.onChange - Callback to handle color updates.
 * @param {boolean} props.disabled - Disables interaction.
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
        <div className="color-picker-group">
            <span className="color-picker-label">{ label }</span>
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
                        aria-label={ label }
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
