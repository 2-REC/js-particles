/**
 * @file ToggleSwitch.jsx
 * @description A boolean control component for the GUI.
 * @responsibility Provides a visual switch to toggle boolean parameters like 'Draw Lines' or 'Respawn'.
 */

import React from 'react';
import './ToggleSwitch.css';

/**
 * ToggleSwitch component.
 *
 * @param {Object} props
 * @param {string} props.label - Display label for the parameter.
 * @param {boolean} props.value - Current boolean value.
 * @param {Function} props.onChange - Callback to handle state changes.
 * @param {boolean} props.disabled - Whether the control is interactive.
 * @param {string} props.trueLabel - Text displayed when state is true (default "ON").
 * @param {string} props.falseLabel - Text displayed when state is false (default "OFF").
 */
const ToggleSwitch = ({
    label,
    value,
    onChange,
    disabled = false,
    trueLabel = "ON",
    falseLabel = "OFF"
}) => {
    /**
     * Toggles the boolean state and notifies parent.
     */
    const handleToggle = () => {
        if (!disabled) {
            onChange(!value);
        }
    };

    return (
        <div className="toggle-switch-group">
            <span className="toggle-switch-label">{ label }</span>

            <div className="toggle-switch-controls">
                <div className={ `switch-wrapper ${disabled ? 'disabled' : ''}` }>
                    <input
                        type="checkbox"
                        checked={ value }
                        onChange={ handleToggle }
                        disabled={ disabled }
                        aria-label={ label }
                    />
                    <span
                        className="switch-slider"
                        onClick={ handleToggle }
                    ></span>
                </div>
                <span
                    className="toggle-state-text"
                    style={{ color: value ? '#4CAF50' : '#aaa' }}
                >
                    { value ? trueLabel : falseLabel }
                </span>
            </div>
        </div>
    );
};

export default ToggleSwitch;
