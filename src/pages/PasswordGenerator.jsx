import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { Copy, RefreshCw, Check } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" });

  const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/\\'\"`,;.<>";

  const calculateStrength = (pwd) => {
    let score = 0;

    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (pwd.length >= 24) score += 1;

    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    // Penalty for repetitive characters
    const uniqueChars = new Set(pwd).size;
    if (uniqueChars < pwd.length * 0.5) score -= 1;

    // Normalize score to 0-5 range
    score = Math.max(0, Math.min(5, score));

    const strengthLevels = [
      { score: 0, label: "Very Weak", color: "bg-red-600" },
      { score: 1, label: "Weak", color: "bg-red-500" },
      { score: 2, label: "Fair", color: "bg-yellow-500" },
      { score: 3, label: "Good", color: "bg-blue-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
      { score: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return strengthLevels[score];
  };

  const generatePassword = useCallback(() => {
    let chars = "";
    if (includeUppercase) chars += charSets.uppercase;
    if (includeLowercase) chars += charSets.lowercase;
    if (includeNumbers) chars += charSets.numbers;
    if (includeSymbols) chars += charSets.symbols;

    if (excludeSimilar) {
      chars = chars
        .split("")
        .filter((c) => !similarChars.includes(c))
        .join("");
    }

    if (excludeAmbiguous) {
      chars = chars
        .split("")
        .filter((c) => !ambiguousChars.includes(c))
        .join("");
    }

    if (chars.length === 0) {
      setPassword("");
      setStrength({ score: 0, label: "No characters selected", color: "bg-gray-500" });
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
    setStrength(calculateStrength(result));
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Generate initial password on mount
  useState(() => {
    generatePassword();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Password Generator</h1>
          <p className="text-gray-400">
            Generate strong, secure passwords with customizable options
          </p>
        </div>

        {/* Password Display */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-black/30 rounded-xl px-4 py-4 font-mono text-lg break-all min-h-[60px] flex items-center">
              {password || <span className="text-gray-500">Select at least one option</span>}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <button
              onClick={generatePassword}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Generate new password"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Password Strength</span>
                <span className={strength.color.replace("bg-", "text-")}>{strength.label}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${(strength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          {/* Length Slider */}
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-gray-300">Password Length</label>
              <span className="text-blue-400 font-mono text-lg">{length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
              <div>
                <div className="font-medium">Uppercase (A-Z)</div>
                <div className="text-xs text-gray-500">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
              <div>
                <div className="font-medium">Lowercase (a-z)</div>
                <div className="text-xs text-gray-500">abcdefghijklmnopqrstuvwxyz</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
              <div>
                <div className="font-medium">Numbers (0-9)</div>
                <div className="text-xs text-gray-500">0123456789</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 rounded accent-blue-500"
              />
              <div>
                <div className="font-medium">Symbols (!@#$)</div>
                <div className="text-xs text-gray-500">!@#$%^&*()_+-=[]{}</div>
              </div>
            </label>
          </div>

          {/* Exclusion Options */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Exclusions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <div>
                  <div className="font-medium">Exclude Similar</div>
                  <div className="text-xs text-gray-500">il1Lo0O</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <div>
                  <div className="font-medium">Exclude Ambiguous</div>
                  <div className="text-xs text-gray-500">{"{}[]()/\\'\"`,;.<>"}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-colors"
        >
          Generate New Password
        </button>
      </div>
    </div>
  );
}