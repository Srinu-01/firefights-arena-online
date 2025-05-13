
import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

const QRCode = ({ value, size = 200, bgColor = '#FFFFFF', fgColor = '#000000' }: QRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
    }
  }, [value, size, bgColor, fgColor]);

  return (
    <div className="inline-flex bg-white p-2 rounded-lg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCode;
