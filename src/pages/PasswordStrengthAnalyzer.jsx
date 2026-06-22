import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, Check, X } from "lucide-react";

function CheckItem({ label, passed }) {
  return (
    <div className="flex items-center gap-3 py-2">
      {passed ? (
        <Check size={18} className="text-green-400" />
      ) : (
        <X size={18} className="text-red-400" />
      )}
      <span className={passed ? "text-gray-300" : "text-gray-500"}>{label}</span>
    </div>
  );
}

export default function PasswordStrengthAnalyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasSequential = (str) => {
    const sequences = [
      "abcdefghijklmnopqrstuvwxyz",
      "qwertyuiop",
      "asdfghjkl",
      "zxcvbnm",
      "0123456789",
    ];
    
    const lower = str.toLowerCase();
    for (const seq of sequences) {
      for (let i = 0; i < seq.length - 2; i++) {
        const pattern = seq.substring(i, i + 3);
        if (lower.includes(pattern) || lower.includes(pattern.split("").reverse().join(""))) {
          return true;
        }
      }
    }
    return false;
  };

  const isCommonPassword = (pwd) => {
    const common = [
      "password", "123456", "12345678", "qwerty", "abc123",
      "monkey", "master", "dragon", "login", "princess",
      "football", "shadow", "sunshine", "trustno1", "iloveyou",
      "batman", "access", "hello", "charlie", "donald",
      "admin", "welcome", "password1", "123456789", "1234567",
    ];
    return common.includes(pwd.toLowerCase());
  };

  const calculateCrackTime = (entropy) => {
    const guessesPerSecond = 10000000000;
    const totalCombinations = Math.pow(2, entropy);
    const seconds = totalCombinations / guessesPerSecond / 2;

    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000 / 1000)}k years`;
    return "Centuries+";
  };

  const analysis = useMemo(() => {
    if (!password) return null;

    const checks = {
      length8: password.length >= 8,
      length12: password.length >= 12,
      length16: password.length >= 16,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSymbols: /[^a-zA-Z0-9]/.test(password),
      noRepeating: !/(.)\1{2,}/.test(password),
      noSequential: !hasSequential(password),
      noCommon: !isCommonPassword(password),
    };

    let charsetSize = 0;
    if (checks.hasLowercase) charsetSize += 26;
    if (checks.hasUppercase) charsetSize += 26;
    if (checks.hasNumbers) charsetSize += 10;
    if (checks.hasSymbols) charsetSize += 32;

    const entropy = Math.floor(password.length * Math.log2(charsetSize || 1));
    const crackTime = calculateCrackTime(entropy);

    let score = 0;
    if (checks.length8) score += 10;
    if (checks.length12) score += 10;
    if (checks.length16) score += 10;
    if (checks.hasLowercase) score += 10;
    if (checks.hasUppercase) score += 10;
    if (checks.hasNumbers) score += 10;
    if (checks.hasSymbols) score += 15;
    if (checks.noRepeating) score += 5;
    if (checks.noSequential) score += 5;
    if (checks.noCommon) score += 5;

    if (password.length > 20) score += 5;
    if (password.length > 30) score += 5;

    score = Math.min(100, score);

    let strength, color, textColor;
    if (score < 20) {
      strength = "Very Weak";
      color = "bg-red-600";
      textColor = "text-red-500";
    } else if (score < 40) {
      strength = "Weak";
      color = "bg-red-500";
      textColor = "text-red-400";
    } else if (score < 60) {
      strength = "Fair";
      color = "bg-yellow-500";
      textColor = "text-yellow-400";
    } else if (score < 80) {
      strength = "Strong";
      color = "bg-blue-500";
      textColor = "text-blue-400";
    } else {
      strength = "Very Strong";
      color = "bg-green-500";
      textColor = "text-green-400";
    }

    return { checks, entropy, crackTime, score, strength, color, textColor };
  }, [password]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Password Strength Analyzer</h1>
          <p className="text-gray-400">
            Check the strength and security of your passwords
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <label className="block text-gray-400 text-sm mb-2">
            Enter Password to Analyze
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a password..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white font-mono text-lg focus:border-blue-500/50 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {analysis && (
          <>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Password Strength</h2>
                <span className={`text-lg font-bold ${analysis.textColor}`}>
                  {analysis.strength}
                </span>
              </div>
              
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full ${analysis.color} transition-all duration-500`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-gray-400 mb-1">Score</div>
                  <div className="text-2xl font-bold">{analysis.score}/100</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-gray-400 mb-1">Entropy</div>
                  <div className="text-2xl font-bold">{analysis.entropy} bits</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4 col-span-2">
                  <div className="text-gray-400 mb-1">Estimated Crack Time</div>
                  <div className="text-xl font-bold text-yellow-400">{analysis.crackTime}</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Security Checks</h2>
              
              <div className="grid md:grid-cols-2 gap-x-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Length Requirements</h3>
                  <CheckItem label="At least 8 characters" passed={analysis.checks.length8} />
                  <CheckItem label="At least 12 characters" passed={analysis.checks.length12} />
                  <CheckItem label="At least 16 characters" passed={analysis.checks.length16} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Character Types</h3>
                  <CheckItem label="Has lowercase letters" passed={analysis.checks.hasLowercase} />
                  <CheckItem label="Has uppercase letters" passed={analysis.checks.hasUppercase} />
                  <CheckItem label="Has numbers" passed={analysis.checks.hasNumbers} />
                  <CheckItem label="Has special symbols" passed={analysis.checks.hasSymbols} />
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-400 mb-2 mt-4">Pattern Checks</h3>
                  <div className="grid md:grid-cols-2 gap-x-8">
                    <CheckItem label="No repeating characters (aaa)" passed={analysis.checks.noRepeating} />
                    <CheckItem label="No sequential patterns (abc, 123)" passed={analysis.checks.noSequential} />
                    <CheckItem label="Not a common password" passed={analysis.checks.noCommon} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Tips for Strong Passwords</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              Use at least 16 characters for important accounts
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              Mix uppercase, lowercase, numbers, and symbols
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              Avoid common words, names, and dates
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              Use a unique password for each account
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              Consider using a password manager
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}