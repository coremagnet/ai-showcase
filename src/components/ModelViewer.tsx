import { useEffect, useRef } from 'react';

interface ModelProps {
  modelUrl: string;
}

function ModelViewer({ modelUrl }: ModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 relative">
      <model-viewer
        src={modelUrl}
        alt="3D Model of Sectional Sofa"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
      />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

export default ModelViewer;
