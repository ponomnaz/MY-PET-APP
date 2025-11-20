import { useState, useEffect, useRef, useCallback } from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker = ({ currentColor, onColorChange }: ColorPickerProps) => {
  const circleRef = useRef<HTMLCanvasElement>(null);
  const squareRef = useRef<HTMLCanvasElement>(null);
  const circleContainerRef = useRef<HTMLDivElement>(null);
  const squareContainerRef = useRef<HTMLDivElement>(null);
  
  const isDraggingCircle = useRef(false);
  const isDraggingSquare = useRef(false);
  const isInternalUpdate = useRef(false);
  const initialRender = useRef(true);

  // Convert hex to HSB
  const hexToHsb = (hex: string): { h: number; s: number; b: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta) % 6;
      } else if (max === g) {
        h = (b - r) / delta + 2;
      } else {
        h = (r - g) / delta + 4;
      }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const s = max === 0 ? 0 : Math.round((delta / max) * 100);
    const b_val = Math.round(max * 100);
    
    return { h, s, b: b_val };
  };

  // Convert HSB to hex
  const hsbToHex = (h: number, s: number, b: number): string => {
    s = s / 100;
    b = b / 100;
    
    const c = b * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = b - c;
    
    let r = 0, g = 0, blue = 0;
    
    if (h >= 0 && h < 60) {
      r = c; g = x; blue = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; blue = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; blue = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; blue = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; blue = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; blue = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    blue = Math.round((blue + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
  };

  // Initialize HSB from currentColor using function initializer
  const getInitialHSB = () => {
    if (/^#[0-9A-F]{6}$/i.test(currentColor)) {
      return hexToHsb(currentColor);
    }
    return { h: 0, s: 100, b: 100 };
  };

  const initialHSB = getInitialHSB();
  const [hexValue, setHexValue] = useState(currentColor);
  const [isValidHex, setIsValidHex] = useState(true);
  const [hue, setHue] = useState(initialHSB.h);
  const [saturation, setSaturation] = useState(initialHSB.s);
  const [brightness, setBrightness] = useState(initialHSB.b);

  // Draw circular hue wheel
  const drawCircle = useCallback(() => {
    const canvas = circleRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw hue circle
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;
        
        const index = (y * size + x) * 4;
        
        if (distance <= radius && distance >= radius - 30) {
          const h = angle;
          const hex = hsbToHex(h, 100, 100);
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = 255;
        } else {
          data[index + 3] = 0;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Draw center circle (white)
    ctx.beginPath();
    ctx.arc(center, center, radius - 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Draw indicator
    // Match the wheel's angle system: atan2 returns angle where 0°=right, 90°=bottom, 180°=left, 270°=top
    // The wheel is drawn with: angle = atan2(dy, dx) * 180/π + 180
    // So hue 0° should be at left (180° in atan2 = π radians)
    // We need: if hue=0°, angle should be π, so: angle = (hue * π / 180) - π = (hue - 180) * π / 180
    // But actually, since the wheel uses +180 offset, we need to reverse it: angle = (hue - 180) * π / 180
    const angleRad = ((hue - 180) * Math.PI) / 180;
    const indicatorRadius = radius - 15;
    const indicatorX = center + Math.cos(angleRad) * indicatorRadius;
    const indicatorY = center + Math.sin(angleRad) * indicatorRadius;
    
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [hue]);

  // Draw square saturation/brightness picker
  const drawSquare = useCallback(() => {
    const canvas = squareRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = canvas.width;
    
    // Draw saturation gradient (left to right)
    for (let x = 0; x < size; x++) {
      const s = (x / size) * 100;
      const gradient = ctx.createLinearGradient(0, 0, 0, size);
      gradient.addColorStop(0, hsbToHex(hue, s, 100));
      gradient.addColorStop(1, hsbToHex(hue, s, 0));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 1, size);
    }
    
    // Draw indicator
    const indicatorX = (saturation / 100) * size;
    const indicatorY = size - (brightness / 100) * size;
    
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [hue, saturation, brightness]);

  // Calculate hex from current HSB values
  const calculatedHex = hsbToHex(hue, saturation, brightness);

  // Track previous currentColor to detect external changes
  const prevCurrentColorRef = useRef(currentColor);

  // Handle external color changes - sync state when currentColor changes externally
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      prevCurrentColorRef.current = currentColor;
      return;
    }

    // Only update if currentColor actually changed from outside
    if (prevCurrentColorRef.current !== currentColor && /^#[0-9A-F]{6}$/i.test(currentColor)) {
      const hsb = hexToHsb(currentColor);
      prevCurrentColorRef.current = currentColor;
      
      // Defer state updates to avoid synchronous setState in effect
      // This is necessary to sync props to internal state
      const timer = setTimeout(() => {
        setHue(hsb.h);
        setSaturation(hsb.s);
        setBrightness(hsb.b);
        setHexValue(currentColor);
      }, 0);
      return () => clearTimeout(timer);
    } else if (prevCurrentColorRef.current !== currentColor) {
      prevCurrentColorRef.current = currentColor;
    }
  }, [currentColor]);

  // Initial canvas drawing
  useEffect(() => {
    drawCircle();
    drawSquare();
  }, [drawCircle, drawSquare]);

  // Update hex value and redraw when HSB changes
  useEffect(() => {
    if (initialRender.current) {
      return;
    }
    
    const newHex = hsbToHex(hue, saturation, brightness);
    if (newHex.toUpperCase() !== hexValue.toUpperCase()) {
      // Defer hex value update using microtask
      queueMicrotask(() => {
        setHexValue(newHex);
      });
    }
    drawCircle();
    drawSquare();
  }, [hue, saturation, brightness, hexValue, drawCircle, drawSquare]);

  // Update parent when calculated hex changes (but not on initial render)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    // Only update if hex actually changed to prevent infinite loops
    if (calculatedHex.toUpperCase() !== currentColor.toUpperCase()) {
      isInternalUpdate.current = true;
      onColorChange(calculatedHex);
    }
  }, [calculatedHex, currentColor, onColorChange]);

  // Handle circle click/drag
  const handleCircleInteraction = useCallback((clientX: number, clientY: number) => {
    const container = circleContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    // Calculate angle matching the wheel drawing logic
    // atan2 returns -180 to 180, adding 180 gives 0-360 where:
    // 0° = right, 90° = bottom, 180° = left, 270° = top
    // This matches how the wheel is drawn (line 119)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;
    angle = angle % 360;
    if (angle < 0) angle += 360;
    
    setHue(angle);
  }, []);

  // Handle square click/drag
  const handleSquareInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = squareRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const size = canvas.width;
    
    const s = Math.max(0, Math.min(100, (x / size) * 100));
    const b = Math.max(0, Math.min(100, 100 - (y / size) * 100));
    
    setSaturation(s);
    setBrightness(b);
  }, []);

  // Mouse events for circle
  const handleCircleMouseDown = (e: React.MouseEvent) => {
    isDraggingCircle.current = true;
    handleCircleInteraction(e.clientX, e.clientY);
  };

  const handleCircleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCircle.current) {
      handleCircleInteraction(e.clientX, e.clientY);
    }
  };

  const handleCircleMouseUp = () => {
    isDraggingCircle.current = false;
  };

  // Mouse events for square
  const handleSquareMouseDown = (e: React.MouseEvent) => {
    isDraggingSquare.current = true;
    handleSquareInteraction(e.clientX, e.clientY);
  };

  const handleSquareMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSquare.current) {
      handleSquareInteraction(e.clientX, e.clientY);
    }
  };

  const handleSquareMouseUp = () => {
    isDraggingSquare.current = false;
  };

  // Global mouse up
  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingCircle.current = false;
      isDraggingSquare.current = false;
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleHexChange = (value: string) => {
    setHexValue(value);
    const trimmedValue = value.trim();
    const withHash = trimmedValue.startsWith('#') ? trimmedValue : `#${trimmedValue}`;
    
    if (/^#[0-9A-F]{6}$/i.test(withHash)) {
      setIsValidHex(true);
      const hsb = hexToHsb(withHash);
      isInternalUpdate.current = true;
      setHue(hsb.h);
      setSaturation(hsb.s);
      setBrightness(hsb.b);
      onColorChange(withHash.toUpperCase());
    } else if (/^#?[0-9A-F]{0,6}$/i.test(trimmedValue)) {
      setIsValidHex(true);
    } else {
      setIsValidHex(false);
    }
  };

  return (
    <div className="mt-2 ml-4 p-3 bg-gray-700 rounded">
      <label className="block text-sm mb-3 font-semibold">Выберите цвет:</label>
      
      <div className="flex gap-4 mb-3 flex-wrap">
        {/* Circular Hue Picker */}
        <div 
          ref={circleContainerRef}
          className="relative cursor-pointer inline-block border-2 border-gray-600 rounded-full overflow-hidden"
          style={{ width: '200px', height: '200px' }}
          onMouseDown={handleCircleMouseDown}
          onMouseMove={handleCircleMouseMove}
          onMouseUp={handleCircleMouseUp}
          onMouseLeave={handleCircleMouseUp}
        >
          <canvas
            ref={circleRef}
            width={200}
            height={200}
            className="block w-full h-full"
            style={{ display: 'block' }}
          />
        </div>

        {/* Square Saturation/Brightness Picker */}
        <div
          ref={squareContainerRef}
          className="relative cursor-pointer inline-block border-2 border-gray-600 rounded overflow-hidden"
          style={{ width: '200px', height: '200px' }}
          onMouseDown={handleSquareMouseDown}
          onMouseMove={handleSquareMouseMove}
          onMouseUp={handleSquareMouseUp}
          onMouseLeave={handleSquareMouseUp}
        >
          <canvas
            ref={squareRef}
            width={200}
            height={200}
            className="block w-full h-full"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* Hex Input */}
      <div className="mt-3">
        <label className="block text-sm mb-1">Hex код:</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={hexValue}
              onChange={(e) => handleHexChange(e.target.value)}
              className={`
                w-full px-3 py-2 bg-gray-600 text-white rounded text-sm
                border-2 transition-colors
                ${isValidHex 
                  ? 'border-gray-500 focus:border-blue-400' 
                  : 'border-red-500 focus:border-red-400'
                }
              `}
              placeholder="#ffffff"
              maxLength={7}
            />
            {!isValidHex && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 text-xs">
                Invalid
              </span>
            )}
          </div>
          <div
            className="w-12 h-10 rounded border-2 border-gray-500 flex-shrink-0"
            style={{ backgroundColor: hexValue }}
          />
          <button
            onClick={() => {
              setHue(0);
              setSaturation(0);
              setBrightness(100);
            }}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
            title="Сбросить на белый"
          >
            ↺
          </button>
        </div>
        {isValidHex && /^#[0-9A-F]{6}$/i.test(hexValue) && (
          <p className="text-xs text-gray-400 mt-1">Текущий цвет: {hexValue}</p>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
