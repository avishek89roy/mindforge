export default function Navbar() {
  return (
    <nav className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-xl font-bold text-white">
          MindForge
        </h1>

        <div className="flex gap-6 text-gray-300">
          <a href="/" className="hover:text-white">
            Tools
          </a>

          <a
            href="https://github.com/avishek89roy/mindforge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            GitHub
          </a>
        </div>

      </div>
    </nav>
  );
}