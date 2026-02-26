/**
 * @file GuiPanel.jsx
 * @description The primary UI shell for the particle simulation controls.
 * @responsibility Manages a draggable, collapsible container that houses all
 * parameter controls and responds to global keyboard shortcuts.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import BottomBar from './BottomBar';
import './GuiPanel.css';

/**
 * GuiPanel Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The ParameterList or other control components.
 * @returns {JSX.Element|null} The panel UI or null if hidden.
 */
const GuiPanel = ({ children }) => {
    const [ isVisible, setIsVisible ] = useState(true);
    const [ position, setPosition ] = useState({ x: 100, y: 100 });
    const [ isDragging, setIsDragging ] = useState(false);

    /**
     * useRef is used for the drag offset to avoid re-renders during calculation.
     * It stores the distance between the mouse and the panel's top-left corner.
     */
    const dragOffset = useRef({ x: 0, y: 0 });

    /**
     * Initiates the dragging sequence.
     * Filters out clicks on buttons or inputs to prevent interaction conflicts.
     */
    const handleMouseDown = (e) => {
        // tag name automatically set by JSX (corresponds to element type in upper case)
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
            return;
        }

        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        setIsDragging(true);
    };

    /**
     * Effect Hook: Manages global window-level listeners for dragging and visibility.
     * Dependencies on [ isDragging ] ensure listeners are attached only when active.
     */
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
                    type="button"
                >
                    ×
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
