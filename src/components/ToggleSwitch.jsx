import React from 'react';
import './ToggleSwitch.css';

/**
 * ToggleSwitch Component
 */
const ToggleSwitch = ({
    label,
    value,
    onChange,
    disabled = false,
    trueLabel = "ON",
    falseLabel = "OFF"
}) => {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!value);
        }
    };

    return (
        <div className="toggle-switch-group">
            <label className="toggle-switch-label">{ label }</label>
            <div className="toggle-switch-controls">
                <div className={ `switch-wrapper ${disabled ? 'disabled' : ''}` }>
                    <input
                        type="checkbox"
                        checked={ value }
                        onChange={ handleToggle }
                        disabled={ disabled }
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
