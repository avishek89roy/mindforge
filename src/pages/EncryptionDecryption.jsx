import { useState } from "react";
import Navbar from "../components/Navbar";
import { Lock, Unlock, Copy, Check, RefreshCw } from "lucide-react";

export default function EncryptionDecryption() {
  const [mode, setMode] = useState("encrypt"); // 'encrypt' or 'decrypt'
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // XOR-based encryption with key
  const encrypt = (text, key) => {
    if (!key) throw new Error("Secret key is required");
    
    let encrypted = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    // Convert to Base64 for safe display
    return btoa(unescape(encodeURIComponent(encrypted)));
  };

  const decrypt = (encryptedText, key) => {
    if (!key) throw new Error("Secret key is required");
    
    try {
      // Decode from Base64
      const decoded = decodeURIComponent(escape(atob(encryptedText)));
      let decrypted = "";
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch {
      throw new Error("Invalid encrypted text or wrong key");
    }
  };

  const handleProcess = () => {
    setError("");
    setResult("");

    if (!message.trim()) {
      setError("Please enter a message to process");
      return;
    }

    if (!secretKey.trim()) {
      setError("Please enter a secret key");
      return;
    }

    try {
      if (mode === "encrypt") {
        setResult(encrypt(message, secretKey));
      } else {
        setResult(decrypt(message, secretKey));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearAll = () => {
    setMessage("");
    setSecretKey("");
    setResult("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Encryption / Decryption</h1>
          <p className="text-gray-400">
            Securely encrypt and decrypt messages using a secret key
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setMode("encrypt");
              setResult("");
              setError("");
            }}
            className={`flex-1 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              mode === "encrypt"
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <Lock size={20} />
            Encrypt
          </button>
          <button
            onClick={() => {
              setMode("decrypt");
              setResult("");
              setError("");
            }}
            className={`flex-1 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
              mode === "decrypt"
                ? "bg-green-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <Unlock size={20} />
            Decrypt
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-6">
          {/* Secret Key Input */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Secret Key
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-blue-500/50 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">
              This key is used to encrypt/decrypt your message. Keep it safe!
            </p>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              {mode === "encrypt" ? "Message to Encrypt" : "Encrypted Message"}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                mode === "encrypt"
                  ? "Type your secret message here..."
                  : "Paste your encrypted message here..."
              }
              rows={5}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleProcess}
              className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
                mode === "encrypt"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {mode === "encrypt" ? <Lock size={20} /> : <Unlock size={20} />}
              {mode === "encrypt" ? "Encrypt Message" : "Decrypt Message"}
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

        {/* Result Section */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {mode === "encrypt" ? "Encrypted Result" : "Decrypted Message"}
              </h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-black/30 rounded-xl p-4 font-mono text-sm break-all max-h-48 overflow-y-auto">
              {result}
            </div>
            {mode === "encrypt" && (
              <p className="text-xs text-gray-500 mt-4">
                Share this encrypted message along with your secret key to allow the recipient to decrypt it.
              </p>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">How it works</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Your message is encrypted using XOR cipher with your secret key</li>
            <li>• The encrypted output is Base64 encoded for safe sharing</li>
            <li>• Only someone with the exact same secret key can decrypt the message</li>
            <li>• All processing happens locally in your browser - nothing is sent to any server</li>
          </ul>
        </div>
      </div>
    </div>
  );
}