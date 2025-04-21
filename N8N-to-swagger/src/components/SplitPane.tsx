import React, { useState, useEffect, useCallback, MouseEvent, TouchEvent } from 'react';

interface SplitPaneProps {
  split: 'vertical' | 'horizontal';
  minSize?: number;
  maxSize?: number;
  defaultSize?: string | number;
  children: React.ReactNode[];
  style?: React.CSSProperties;
  paneStyle?: React.CSSProperties;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  split = 'vertical',
  minSize = 50,
  maxSize,
  defaultSize = '50%',
  children,
  style = {},
  paneStyle = {},
}) => {
  const [size, setSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState<number>(0);
  const [splitPaneRef, setSplitPaneRef] = useState<HTMLDivElement | null>(null);

  // Convert defaultSize to pixels
  useEffect(() => {
    if (!splitPaneRef) return;
    
    const containerRect = splitPaneRef.getBoundingClientRect();
    const containerDimension = split === 'vertical' ? containerRect.width : containerRect.height;
    setContainerSize(containerDimension);

    const initialSize = typeof defaultSize === 'string' && defaultSize.endsWith('%')
      ? (parseFloat(defaultSize) / 100) * containerDimension
      : parseFloat(defaultSize as string);

    setSize(Math.min(Math.max(initialSize, minSize), maxSize || containerDimension));
  }, [splitPaneRef, defaultSize, minSize, maxSize, split]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !splitPaneRef) return;

    const containerRect = splitPaneRef.getBoundingClientRect();
    const newSize = split === 'vertical'
      ? e.clientX - containerRect.left
      : e.clientY - containerRect.top;

    setSize(Math.min(Math.max(newSize, minSize), maxSize || containerSize));
  }, [isDragging, split, minSize, maxSize, containerSize]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !splitPaneRef) return;

    const containerRect = splitPaneRef.getBoundingClientRect();
    const touch = e.touches[0];
    const newSize = split === 'vertical'
      ? touch.clientX - containerRect.left
      : touch.clientY - containerRect.top;

    setSize(Math.min(Math.max(newSize, minSize), maxSize || containerSize));
  }, [isDragging, split, minSize, maxSize, containerSize]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove as any);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove as any);
      document.addEventListener('touchend', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: split === 'vertical' ? 'row' : 'column',
    height: '100%',
    position: 'relative',
    ...style,
  };

  const pane1Style: React.CSSProperties = {
    [split === 'vertical' ? 'width' : 'height']: size,
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
    ...paneStyle,
  };

  const pane2Style: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    ...paneStyle,
  };

  const resizerStyle: React.CSSProperties = {
    opacity: 0.2,
    zIndex: 1,
    boxSizing: 'border-box',
    backgroundClip: 'padding-box',
    ...(split === 'vertical'
      ? {
          cursor: 'col-resize',
          width: '11px',
          margin: '0 -5px',
          borderLeft: '5px solid rgba(255, 255, 255, 0)',
          borderRight: '5px solid rgba(255, 255, 255, 0)',
        }
      : {
          cursor: 'row-resize',
          height: '11px',
          margin: '-5px 0',
          borderTop: '5px solid rgba(255, 255, 255, 0)',
          borderBottom: '5px solid rgba(255, 255, 255, 0)',
        }),
    ...(isDragging
      ? {
          background: '#999',
        }
      : {
          ':hover': {
            background: '#999',
          },
        }),
  };

  return (
    <div
      ref={setSplitPaneRef}
      style={containerStyle}
      className="split-pane-container"
    >
      <div style={pane1Style}>
        {children[0]}
      </div>
      <div
        style={resizerStyle}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />
      <div style={pane2Style}>
        {children[1]}
      </div>
    </div>
  );
};

export default SplitPane;