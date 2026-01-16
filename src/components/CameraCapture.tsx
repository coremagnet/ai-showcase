import { useRef, useState, useEffect } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';

interface CameraCaptureProps {
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

function CameraCapture({ onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please make sure you have granted camera permissions.');
        onClose();
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      onCapture(imageDataUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/50 shrink-0">
        <h2 className="text-white text-lg font-semibold">Take a photo of your room</h2>
        <button
          onClick={() => {
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
            onClose();
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-4 shrink-0">
        <button
          onClick={capturePhoto}
          disabled={!isReady}
          className="bg-white p-6 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ring-4 ring-white/20"
        >
          {!isReady ? (
            <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
          ) : (
            <Camera className="w-10 h-10 text-gray-900" />
          )}
        </button>
        <p className="text-white text-sm font-medium">
          {!isReady ? 'Initializing camera...' : 'Tap to capture'}
        </p>
      </div>
    </div>
  );
}

export default CameraCapture;
