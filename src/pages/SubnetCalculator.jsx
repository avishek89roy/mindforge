import { useState } from "react";
import Navbar from "../components/Navbar";
import { Calculator, Copy, Check } from "lucide-react";

function ResultRow({ label, value, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-white">{value}</span>
        <button
          onClick={() => onCopy(String(value), label)}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title="Copy"
        >
          {copied === label ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const validateIP = (ip) => {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255 && part === String(num);
    });
  };

  const ipToInt = (ip) => {
    return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  const intToIp = (int) => {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join(".");
  };

  const getIpClass = (ipInt) => {
    const firstOctet = (ipInt >>> 24) & 255;
    if (firstOctet < 128) return "A";
    if (firstOctet < 192) return "B";
    if (firstOctet < 224) return "C";
    if (firstOctet < 240) return "D (Multicast)";
    return "E (Reserved)";
  };

  const calculate = () => {
    setError("");
    
    if (!validateIP(ipAddress)) {
      setError("Please enter a valid IP address (e.g., 192.168.1.0)");
      setResults(null);
      return;
    }

    if (cidr < 0 || cidr > 32) {
      setError("CIDR must be between 0 and 32");
      setResults(null);
      return;
    }

    const ipInt = ipToInt(ipAddress);
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcard = ~mask >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
    const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
    const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
    const totalAddresses = Math.pow(2, 32 - cidr);

    setResults({
      networkAddress: intToIp(network),
      broadcastAddress: intToIp(broadcast),
      firstHost: intToIp(firstHost),
      lastHost: intToIp(lastHost),
      subnetMask: intToIp(mask),
      wildcardMask: intToIp(wildcard),
      totalHosts: totalHosts > 0 ? totalHosts : 0,
      totalAddresses,
      cidrNotation: `${intToIp(network)}/${cidr}`,
      ipClass: getIpClass(ipInt),
      binarySubnetMask: mask.toString(2).padStart(32, "0").match(/.{1,8}/g).join("."),
    });
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">IPv4 Subnet Calculator</h1>
          <p className="text-gray-400">
            Calculate network details, host ranges, and subnet information
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.0"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">CIDR (/)</label>
              <input
                type="number"
                min="0"
                max="32"
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value) || 0)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Quick CIDR Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[8, 16, 24, 25, 26, 27, 28, 29, 30].map((c) => (
              <button
                key={c}
                onClick={() => setCidr(c)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  cidr === c
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                /{c}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={calculate}
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Calculate
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-400">Network Results</span>
            </h2>

            <div className="divide-y divide-white/5">
              <ResultRow label="CIDR Notation" value={results.cidrNotation} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Network Address" value={results.networkAddress} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Broadcast Address" value={results.broadcastAddress} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="First Usable Host" value={results.firstHost} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Last Usable Host" value={results.lastHost} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Subnet Mask" value={results.subnetMask} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Wildcard Mask" value={results.wildcardMask} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Binary Subnet Mask" value={results.binarySubnetMask} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Total Usable Hosts" value={results.totalHosts.toLocaleString()} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="Total Addresses" value={results.totalAddresses.toLocaleString()} copied={copied} onCopy={copyToClipboard} />
              <ResultRow label="IP Class" value={results.ipClass} copied={copied} onCopy={copyToClipboard} />
            </div>

            {/* Host Range Display */}
            <div className="mt-6 p-4 bg-black/20 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Host Range</div>
              <div className="font-mono text-green-400">
                {results.firstHost} → {results.lastHost}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}