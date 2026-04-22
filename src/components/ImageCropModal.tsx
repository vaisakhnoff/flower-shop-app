import { useState, useRef, useEffect, useCallback } from 'react';

interface CropModalProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const ASPECT_RATIOS = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: 'Free', value: 0 },
];

export default function ImageCropModal({ imageSrc, onCropComplete, onCancel }: CropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Pan & zoom state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState(1); // default 1:1
  const [isFreeAspect, setIsFreeAspect] = useState(false);

  // Drag state (stored in refs to avoid re-render in event handlers)
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastOffset = useRef({ x: 0, y: 0 });

  // Pinch state
  const lastPinchDist = useRef<number | null>(null);

  const CANVAS_W = 480;
  const CANVAS_H_FREE = 360;

  const canvasHeight = isFreeAspect ? CANVAS_H_FREE : Math.round(CANVAS_W / aspectRatio);

  // ─── Draw ────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cW = canvas.width;
    const cH = canvas.height;

    ctx.clearRect(0, 0, cW, cH);

    // Dark overlay background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, cW, cH);

    // Draw image
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const x = (cW - drawW) / 2 + offset.x;
    const y = (cH - drawH) / 2 + offset.y;

    ctx.drawImage(img, x, y, drawW, drawH);

    // Crop box (centered, slightly smaller than canvas)
    const margin = 20;
    const cropW = cW - margin * 2;
    const cropH = isFreeAspect ? cH - margin * 2 : cropW / aspectRatio;
    const cropX = margin;
    const cropY = (cH - cropH) / 2;

    // Darken outside crop box
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, cW, cropY);                             // top
    ctx.fillRect(0, cropY + cropH, cW, cH - cropY - cropH);   // bottom
    ctx.fillRect(0, cropY, cropX, cropH);                      // left
    ctx.fillRect(cropX + cropW, cropY, cW - cropX - cropW, cropH); // right

    // Crop border
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // Rule-of-thirds grid lines
    ctx.strokeStyle = 'rgba(94,234,212,0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(cropX + (cropW / 3) * i, cropY);
      ctx.lineTo(cropX + (cropW / 3) * i, cropY + cropH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cropX, cropY + (cropH / 3) * i);
      ctx.lineTo(cropX + cropW, cropY + (cropH / 3) * i);
      ctx.stroke();
    }

    // Corner handles
    const hSize = 12;
    ctx.fillStyle = '#5eead4';
    const corners = [
      [cropX, cropY],
      [cropX + cropW - hSize, cropY],
      [cropX, cropY + cropH - hSize],
      [cropX + cropW - hSize, cropY + cropH - hSize],
    ];
    corners.forEach(([cx, cy]) => ctx.fillRect(cx, cy, hSize, hSize));
  }, [scale, offset, aspectRatio, isFreeAspect]);

  // ─── Load image ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;

      // Fit image into canvas initially
      const canvas = canvasRef.current;
      if (!canvas) return;
      const fitScale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      setScale(fitScale);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-draw whenever state changes
  useEffect(() => {
    draw();
  }, [draw, canvasHeight]);

  // ─── Mouse drag ──────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastOffset.current = { ...offset };
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
  }, []);

  const onMouseUp = () => { isDragging.current = false; };

  // ─── Scroll zoom ─────────────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setScale(s => Math.min(Math.max(s + delta, 0.2), 8));
  };

  // ─── Touch (pinch zoom + drag) ───────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastOffset.current = { ...offset };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
    } else if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const delta = (newDist - lastPinchDist.current) * 0.005;
      setScale(s => Math.min(Math.max(s + delta, 0.2), 8));
      lastPinchDist.current = newDist;
    }
  }, []);

  const onTouchEnd = () => {
    isDragging.current = false;
    lastPinchDist.current = null;
  };

  // ─── Aspect ratio change ──────────────────────────────────────────────────────
  const changeAspect = (ratio: number) => {
    if (ratio === 0) {
      setIsFreeAspect(true);
    } else {
      setIsFreeAspect(false);
      setAspectRatio(ratio);
    }
    setOffset({ x: 0, y: 0 });
  };

  // ─── Crop & export ────────────────────────────────────────────────────────────
  const handleCrop = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const margin = 20;
    const cropW = cW - margin * 2;
    const cropH = isFreeAspect ? cH - margin * 2 : cropW / aspectRatio;
    const cropX = margin;
    const cropY = (cH - cropH) / 2;

    // Map canvas crop box → image coordinates
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const imgX = (cW - drawW) / 2 + offset.x;
    const imgY = (cH - drawH) / 2 + offset.y;

    const srcX = (cropX - imgX) / scale;
    const srcY = (cropY - imgY) / scale;
    const srcW = cropW / scale;
    const srcH = cropH / scale;

    const outputCanvas = document.createElement('canvas');
    const outW = Math.round(srcW);
    const outH = Math.round(srcH);
    outputCanvas.width = outW;
    outputCanvas.height = outH;

    const outCtx = outputCanvas.getContext('2d');
    if (!outCtx) return;

    outCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

    outputCanvas.toBlob(blob => {
      if (blob) onCropComplete(blob);
    }, 'image/jpeg', 0.92);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Crop Image</h3>
            <p className="text-xs text-gray-400 mt-0.5">Drag to pan · Scroll to zoom</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center bg-gray-900 overflow-hidden"
          style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={canvasHeight}
            style={{ maxWidth: '100%', display: 'block', touchAction: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-3 border-t border-gray-100 space-y-3">

          {/* Aspect ratio buttons */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Aspect Ratio</p>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map(r => (
                <button
                  key={r.label}
                  onClick={() => changeAspect(r.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    (r.value === 0 && isFreeAspect) || (r.value !== 0 && !isFreeAspect && Math.abs(aspectRatio - r.value) < 0.01)
                      ? 'bg-teal-600 border-teal-600 text-white shadow'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-teal-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom slider */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Zoom — {Math.round(scale * 100)}%</p>
            <input
              type="range"
              min={20}
              max={800}
              value={Math.round(scale * 100)}
              onChange={e => setScale(Number(e.target.value) / 100)}
              className="w-full accent-teal-600 h-1.5"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="flex-1 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
