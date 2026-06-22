import Navbar from "../components/Navbar";
import ToolCard from "../components/ToolCard";

import {
  Globe,
  Lock,
  KeyRound,
  ShieldCheck,
  Wifi,
  FileDiff,
  Smile,
} from "lucide-react";

export default function Home() {
  const tools = [
    {
      title: "IPv4 Subnet Calculator",
      description: "Calculate CIDR, host ranges and network details.",
      icon: <Globe size={36} />,
      status: "Available",
      path: "/subnet-calculator",
    },
    {
      title: "Password Generator",
      description: "Generate strong passwords instantly.",
      icon: <KeyRound size={36} />,
      status: "Available",
      path: "/password-generator",
    },
    {
      title: "Encryption / Decryption",
      description: "Encrypt messages with a secret key.",
      icon: <Lock size={36} />,
      status: "Available",
      path: "/encryption-decryption",
    },
    {
      title: "WiFi QR Generator",
      description: "Create WiFi QR codes for easy sharing.",
      icon: <Wifi size={36} />,
      status: "Available",
      path: "/wifi-qr-generator",
    },
    {
      title: "Password Strength Analyzer",
      description: "Analyze password entropy and security.",
      icon: <ShieldCheck size={36} />,
      status: "Available",
      path: "/password-strength-analyzer",
    },
    {
      title: "Text Diff",
      description: "Compare two blocks of text.",
      icon: <FileDiff size={36} />,
      status: "Available",
      path: "/text-diff",
    },
    {
      title: "Emoji Picker",
      description: "Find and copy emojis quickly.",
      icon: <Smile size={36} />,
      status: "Available",
      path: "/emoji-picker",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] via-[#091224] to-[#050816] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">

        {/* Main Glow */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-blue-600/20
            via-purple-600/20
            to-cyan-600/20
            blur-3xl
          "
        />

        {/* Vertical Fade */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-transparent
            via-[#0B1020]/20
            to-[#0B1020]
          "
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-10 text-center">

          <h1 className="text-6xl md:text-7xl font-bold">
            MindForge
          </h1>

          <p className="mt-4 text-xl text-gray-300">
            Forge Better Tools. Shape Smarter Solutions.
          </p>

          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Privacy-first networking, security and productivity tools
            built for IT professionals.
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search tools..."
              className="
                w-full
                bg-white/5
                border border-white/10
                rounded-xl
                px-4 py-3
                text-white
                placeholder-gray-500
                outline-none
                focus:border-blue-500/50
                focus:bg-white/10
                transition
              "
            />
          </div>

        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              {...tool}
            />
          ))}

        </div>
      </section>
    </div>
  );
}