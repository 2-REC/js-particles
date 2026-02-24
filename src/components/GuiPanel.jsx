import React, { useState, useEffect, useRef } from 'react';
import './GuiPanel.css';

/**
 * GuiPanel
 * Draggable container holding GUI controls.
 */
const GuiPanel = ({ children }) => {
    const [ position, setPosition ] = useState({ x: 100, y: 100 });
    const [ isDragging, setIsDragging ] = useState(false);

    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging)
                return;

            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [ isDragging ]);

    return (
        <div
            className="gui-panel-container"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="gui-panel-header" onMouseDown={ handleMouseDown }>
                <span style={{ fontWeight: 'bold' }}>Simulation Controls</span>
            </div>
            <div className="gui-panel-content">
                { children }
            </div>
            <div className="gui-panel-footer">
            </div>
        </div>
    );
};

export default GuiPanel;
