import { useState } from "react";
import Navbar from "../components/Navbar";
import { Wifi, Download, RefreshCw, Eye, EyeOff } from "lucide-react";

export default function WifiQRGenerator() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA"); // WPA, WEP, or nopass
  const [hidden, setHidden] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Generate WiFi QR code string
  const generateWiFiString = () => {
    if (!ssid) return "";
    
    // WiFi QR format: WIFI:T:<security>;S:<SSID>;P:<password>;H:<hidden>;;
    const escapedSsid = ssid.replace(/([\\;,"])/g, "\\$1");
    const escapedPassword = password.replace(/([\\;,"])/g, "\\$1");
    
    let wifiString = `WIFI:T:${security};S:${escapedSsid};`;
    if (security !== "nopass" && escapedPassword) {
      wifiString += `P:${escapedPassword};`;
    }
    if (hidden) {
      wifiString += "H:true;";
    }
    wifiString += ";";
    
    return wifiString;
  };

  // Simple QR code generation using a canvas-based approach
  const generateQRCode = () => {
    if (!ssid.trim()) {
      alert("Please enter a WiFi network name (SSID)");
      return;
    }

    const wifiString = generateWiFiString();
    if (!wifiString) return;

    // Using a free QR code API for simplicity and reliability
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(wifiString)}&bgcolor=0B1020&color=ffffff`;
    setQrCodeUrl(qrApiUrl);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wifi-qr-${ssid.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download:", err);
    }
  };

  const clearAll = () => {
    setSsid("");
    setPassword("");
    setSecurity("WPA");
    setHidden(false);
    setQrCodeUrl("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">WiFi QR Code Generator</h1>
          <p className="text-gray-400">
            Generate QR codes for easy WiFi sharing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            {/* SSID Input */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Network Name (SSID) *
              </label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Enter WiFi network name"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Security Type */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Security Type
              </label>
              <select
                value={security}
                onChange={(e) => setSecurity(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              >
                <option value="WPA">WPA/WPA2/WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password (Open)</option>
              </select>
            </div>

            {/* Password Input */}
            {security !== "nopass" && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter WiFi password"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Hidden Network Checkbox */}
            <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
              <div>
                <div className="font-medium">Hidden Network</div>
                <div className="text-xs text-gray-500">Enable if SSID is not broadcasted</div>
              </div>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generateQRCode}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Wifi size={20} />
                Generate
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                title="Clear all"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <>
                <div className="bg-white p-4 rounded-2xl mb-4">
                  <img
                    src={qrCodeUrl}
                    alt="WiFi QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
                >
                  <Download size={20} />
                  Download QR Code
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <Wifi size={64} className="mx-auto mb-4 opacity-50" />
                <p>Enter WiFi details and click Generate</p>
                <p className="text-sm mt-2">QR code will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">How to use</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-400">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-white">Enter WiFi Details</p>
                <p>Type your network name (SSID) and password</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-white">Generate QR Code</p>
                <p>Click the generate button to create your QR code</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-white">Share or Print</p>
                <p>Download the QR code and share with others</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <p className="text-sm text-yellow-400">
            <strong>Note:</strong> Users can scan this QR code with their phone's camera or a QR code reader app to automatically connect to your WiFi network.
          </p>
        </div>
      </div>
    </div>
  );
}