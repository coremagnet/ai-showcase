import { useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Star, Truck, Shield, Package, Camera, Loader2, X } from 'lucide-react';
import ModelViewer from './components/ModelViewer';
import CameraCapture from './components/CameraCapture';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [arResult, setArResult] = useState<string | null>(null);

  const mediaItems = [
    { type: 'image', src: 'https://v3b.fal.media/files/b/0a868995/Pn8Ozwy_S5U-ajer4pBhp.png', label: 'Original photo' },
    { type: 'image', src: 'https://v3b.fal.media/files/b/0a868b5d/qW3dIoOOgss0u73wde99i.png', label: 'AI generated lifestyle' },
    { type: 'image', src: 'https://v3b.fal.media/files/b/0a89b54f/dxZLQia28hKTgGKBOMkw3.png', label: 'AI generated angle #2' },
    { type: 'image', src: 'https://v3b.fal.media/files/b/0a868b5d/fQYbw1DpdHowF0ywTZjxc.png', label: 'AI generated angle' },
    { type: 'video', src: 'https://v3b.fal.media/files/b/0a89b58b/u_cLgJ-bgm-ZfhVYd6LNz_output.mp4', label: 'AI generated start-to-end frame video' },
    { type: 'video', src: 'https://v3b.fal.media/files/b/0a89b578/r1L9NPGbcqsS8-6M3ddNI_fec08da8e4e84d71bb260d9857674462.mp4', label: 'AI generated video promo' },
    { type: 'video', src: 'https://v3b.fal.media/files/b/0a89b5a6/8ijDP-V0mjEn9DJkQ5RFU_76d5dc8c572d450f99badba8242fb451.mp4', label: 'AI generated video' },
    { type: 'image', src: 'https://v3b.fal.media/files/b/0a868926/KygfKGt7TINXNepxcAMHN.png', label: 'AI generated size guide' },
    { type: 'image', src: 'https://v3b.fal.media/files/b/0a868b83/aGKHfjh3Ep8bH1kqFbaML.png', label: 'AI generated post' },
    { type: 'model', src: 'https://raw.githubusercontent.com/burhan-fp/3d-test/main/sectional%20sofa%203d%20model%20(1).glb', label: 'AI generated 3D model' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleCameraCapture = async (roomImageDataUrl: string) => {
    setShowCamera(false);
    setIsProcessing(true);

    try {
      const sofaImageUrl = 'https://v3b.fal.media/files/b/0a868926/KygfKGt7TINXNepxcAMHN.png';

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/place-in-room`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomImageUrl: roomImageDataUrl,
            sofaImageUrl: sofaImageUrl,
          }),
        }
      );

      const data = await response.json();

      if (data.images && data.images[0]?.url) {
        setArResult(data.images[0].url);
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            LUXE LIVING
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Media Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden group">
              {mediaItems[currentSlide].type === 'image' && (
                <img
                  src={mediaItems[currentSlide].src}
                  alt="Product view"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {mediaItems[currentSlide].type === 'video' && (
                <video
                  src={mediaItems[currentSlide].src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              {mediaItems[currentSlide].type === 'model' && (
                <ModelViewer modelUrl={mediaItems[currentSlide].src} />
              )}

              {/* Label Tag */}
              <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {mediaItems[currentSlide].label}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* View in 3D Button */}
              {currentSlide !== 7 && (
                <button
                  onClick={() => setCurrentSlide(7)}
                  className="absolute top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all hover:shadow-xl flex items-center gap-2 group"
                >
                  <Package className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View in 3D
                </button>
              )}

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mediaItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-16 h-16 ${
                    index === currentSlide
                      ? 'border-gray-800 scale-105 shadow-lg'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img src={item.src} alt="" className="w-full h-full object-cover" />
                  ) : item.type === 'video' ? (
                    <video src={item.src} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(247 reviews)</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Modern Sectional Sofa
              </h2>
              <p className="text-3xl font-bold text-gray-900">$2,499.00</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            <div className="prose prose-gray">
              <p className="text-gray-600 leading-relaxed">
                Transform your living space with our luxurious Modern Sectional Sofa. Expertly crafted
                with premium materials and contemporary design, this piece combines exceptional comfort
                with stunning aesthetics. The modular design allows for versatile configurations to suit
                any space.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Truck className="w-6 h-6 text-gray-700 mb-2" />
                <span className="text-xs text-gray-600 text-center">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-6 h-6 text-gray-700 mb-2" />
                <span className="text-xs text-gray-600 text-center">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Package className="w-6 h-6 text-gray-700 mb-2" />
                <span className="text-xs text-gray-600 text-center">Easy Assembly</span>
              </div>
            </div>

            {/* Color Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div className="flex gap-3">
                {['bg-gray-300', 'bg-stone-400', 'bg-slate-700', 'bg-amber-100'].map((color, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-full ${color} ring-2 ring-offset-2 ${
                      index === 0 ? 'ring-gray-800' : 'ring-transparent'
                    } hover:scale-110 transition-transform`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-800 transition-colors flex items-center justify-center font-semibold"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-800 transition-colors flex items-center justify-center font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="w-full bg-white text-gray-900 py-4 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-800 transition-all transform hover:-translate-y-0.5">
                Buy Now
              </button>
              <button
                onClick={() => setShowCamera(true)}
                className="w-full bg-gradient-to-r from-slate-700 to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-slate-600 hover:to-gray-700 transition-all hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                View in Your Room
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Assembly Guide</h3>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <img
              src="https://v3b.fal.media/files/b/0a86af04/QgsaUM2A7olUUHRqWMKO4.png"
              alt="Assembly Guide"
              className="w-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
              AI generated assembly guide
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Specifications</h4>
              <dl className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Dimensions</dt>
                  <dd className="font-semibold text-gray-900">120" W x 85" D x 32" H</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Material</dt>
                  <dd className="font-semibold text-gray-900">Premium Fabric & Hardwood</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Seating Capacity</dt>
                  <dd className="font-semibold text-gray-900">5-6 People</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600">Weight</dt>
                  <dd className="font-semibold text-gray-900">185 lbs</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-gray-600">Assembly Time</dt>
                  <dd className="font-semibold text-gray-900">30-45 minutes</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">What's Included</h4>
              <ul className="space-y-3">
                {[
                  'Main sectional pieces (3)',
                  'Corner connector piece',
                  'Premium cushion set (6)',
                  'Decorative throw pillows (4)',
                  'Assembly hardware & tools',
                  'Care instructions',
                  'Warranty documentation',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2024 Luxe Living. Premium furniture for modern homes.</p>
        </div>
      </footer>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onClose={() => setShowCamera(false)}
          onCapture={handleCameraCapture}
        />
      )}

      {/* Processing Loader */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <Loader2 className="w-16 h-16 text-gray-900 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Your Room</h3>
            <p className="text-gray-600">
              We're placing the sofa in your space. This may take a moment...
            </p>
          </div>
        </div>
      )}

      {/* AR Result Modal */}
      {arResult && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Sofa in Your Room</h3>
              <button
                onClick={() => setArResult(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={arResult}
                alt="Sofa placed in your room"
                className="w-full rounded-xl"
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setArResult(null)}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
              >
                Try Again
              </button>
              <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-800 transition-all">
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
