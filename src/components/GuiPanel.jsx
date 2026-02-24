import React, { useState, useEffect, useRef } from 'react';
import BottomBar from './BottomBar';
import './GuiPanel.css';

/**
 * GuiPanel
 * Draggable container holding GUI controls.
 */
const GuiPanel = ({ children }) => {
    const [ isVisible, setIsVisible ] = useState(true);
    const [ position, setPosition ] = useState({ x: 100, y: 100 });
    const [ isDragging, setIsDragging ] = useState(false);

    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        // tag name automatically set by JSX (corresponds to element type in upper case)
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT')
            return;

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

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsVisible(false);
            }
            else if (e.key === 'Enter' || e.code === 'Space') {
                setIsVisible(true);
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [ isDragging ]);

    // return null if panel is hidden to unmount GUI content
    if (!isVisible)
        return null;

    return (
        <div
            className="gui-panel-container"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="gui-panel-header" onMouseDown={ handleMouseDown }>
                <span className="gui-panel-title">Parameters</span>
                <button
                    className="gui-panel-close-btn"
                    onClick={ () => setIsVisible(false) }
                    title="Close Panel (ESC)"
                >
                    &times;
                </button>
            </div>
            <div className="gui-panel-content">
                { children }
            </div>
            <BottomBar />
        </div>
    );
};

export default GuiPanel;
