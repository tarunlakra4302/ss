'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type HTMLMotionProps,
  type SpringOptions,
  type MotionValue,
} from 'motion/react';

import { cn } from '@/lib/utils';

type CursorContextType = {
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  cursorPos: { x: number; y: number };
  isActive: boolean;
  isMouseDown: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  cursorRef: React.RefObject<HTMLDivElement | null>;
};

const CursorContext = React.createContext<CursorContextType | undefined>(
  undefined,
);

const useCursor = (): CursorContextType => {
  const context = React.useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

type CursorProviderProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
};

function CursorProvider({ ref, children, ...props }: CursorProviderProps) {
  const [isActive, setIsActive] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const isActiveRef = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const cursorPos = React.useMemo(
    () => ({
      get x() {
        return cursorX.get();
      },
      get y() {
        return cursorY.get();
      },
    }),
    [cursorX, cursorY],
  );

  React.useEffect(() => {
    // Check if device is a touch-only screen without a fine pointer
    if (typeof window !== 'undefined') {
      const isTouchOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
      if (isTouchOnly) return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Direct MotionValue updates bypass React re-renders for 0ms lag
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isActiveRef.current) {
        isActiveRef.current = true;
        setIsActive(true);
      }
    };

    const handleMouseLeave = () => {
      isActiveRef.current = false;
      setIsActive(false);
      setIsMouseDown(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      isActiveRef.current = true;
      setIsActive(true);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <CursorContext.Provider
      value={{ cursorX, cursorY, cursorPos, isActive, isMouseDown, containerRef, cursorRef }}
    >
      <div ref={containerRef} data-slot="cursor-provider" {...props}>
        {children}
      </div>
    </CursorContext.Provider>
  );
}

type CursorProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  /**
   * If true, centers the cursor on the mouse point (for circular dots).
   * Defaults to false so arrow cursors have their tip exactly at (clientX, clientY).
   */
  center?: boolean;
};

function Cursor({
  ref,
  children,
  className,
  style,
  center = false,
  ...props
}: CursorProps) {
  const { cursorX, cursorY, isActive, isMouseDown, cursorRef } = useCursor();
  React.useImperativeHandle(ref, () => cursorRef.current as HTMLDivElement);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={cursorRef}
          data-slot="cursor"
          className={cn(
            'pointer-events-none fixed top-0 left-0 z-[999999] select-none will-change-transform origin-top-left',
            center && '-translate-x-1/2 -translate-y-1/2 origin-center',
            className,
          )}
          style={{ x: cursorX, y: cursorY, ...style }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isMouseDown ? 0.85 : 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            scale: { duration: 0.08, ease: 'easeOut' },
            opacity: { duration: 0.12, ease: 'easeOut' },
          }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Align =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right'
  | 'center';

type CursorFollowProps = HTMLMotionProps<'div'> & {
  sideOffset?: number;
  align?: Align;
  transition?: SpringOptions;
  children: React.ReactNode;
};

function CursorFollow({
  ref,
  sideOffset = 15,
  align = 'bottom-right',
  children,
  className,
  style,
  transition = { stiffness: 500, damping: 50, bounce: 0 },
  ...props
}: CursorFollowProps) {
  const { cursorX, cursorY, isActive, cursorRef } = useCursor();
  const cursorFollowRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(
    ref,
    () => cursorFollowRef.current as HTMLDivElement,
  );

  const followTargetX = useMotionValue(cursorX.get());
  const followTargetY = useMotionValue(cursorY.get());

  const springX = useSpring(followTargetX, transition);
  const springY = useSpring(followTargetY, transition);

  const calculateOffset = React.useCallback(() => {
    const rect = cursorFollowRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;

    let newOffset;

    switch (align) {
      case 'center':
        newOffset = { x: width / 2, y: height / 2 };
        break;
      case 'top':
        newOffset = { x: width / 2, y: height + sideOffset };
        break;
      case 'top-left':
        newOffset = { x: width + sideOffset, y: height + sideOffset };
        break;
      case 'top-right':
        newOffset = { x: -sideOffset, y: height + sideOffset };
        break;
      case 'bottom':
        newOffset = { x: width / 2, y: -sideOffset };
        break;
      case 'bottom-left':
        newOffset = { x: width + sideOffset, y: -sideOffset };
        break;
      case 'bottom-right':
        newOffset = { x: -sideOffset, y: -sideOffset };
        break;
      case 'left':
        newOffset = { x: width + sideOffset, y: height / 2 };
        break;
      case 'right':
        newOffset = { x: -sideOffset, y: height / 2 };
        break;
      default:
        newOffset = { x: 0, y: 0 };
    }

    return newOffset;
  }, [align, sideOffset]);

  const cachedMetricsRef = React.useRef({ offsetX: 0, offsetY: 0, cursorHalfW: 10, cursorHalfH: 10 });

  const refreshMetrics = React.useCallback(() => {
    const offset = calculateOffset();
    const cursorRect = cursorRef.current?.getBoundingClientRect();
    cachedMetricsRef.current = {
      offsetX: offset.x,
      offsetY: offset.y,
      cursorHalfW: (cursorRect?.width ?? 20) / 2,
      cursorHalfH: (cursorRect?.height ?? 20) / 2,
    };
  }, [calculateOffset, cursorRef]);

  React.useEffect(() => {
    refreshMetrics();
    window.addEventListener('resize', refreshMetrics, { passive: true });
    return () => window.removeEventListener('resize', refreshMetrics);
  }, [refreshMetrics]);

  React.useEffect(() => {
    const updatePosition = () => {
      const { offsetX, offsetY, cursorHalfW, cursorHalfH } = cachedMetricsRef.current;
      followTargetX.set(cursorX.get() - offsetX + cursorHalfW);
      followTargetY.set(cursorY.get() - offsetY + cursorHalfH);
    };

    updatePosition();
    const unsubX = cursorX.on('change', updatePosition);
    const unsubY = cursorY.on('change', updatePosition);

    return () => {
      unsubX();
      unsubY();
    };
  }, [cursorX, cursorY, followTargetX, followTargetY]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={cursorFollowRef}
          data-slot="cursor-follow"
          className={cn(
            'pointer-events-none fixed top-0 left-0 z-[999998] select-none -translate-x-1/2 -translate-y-1/2 will-change-transform',
            className,
          )}
          style={{ x: springX, y: springY, ...style }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export {
  CursorProvider,
  Cursor,
  CursorFollow,
  useCursor,
  type CursorContextType,
  type CursorProviderProps,
  type CursorProps,
  type CursorFollowProps,
};
