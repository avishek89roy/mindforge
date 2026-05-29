import './App.css'

function App() {
  const tools = [
    'IPv4 Subnet Calculator',
    'Encryption / Decryption',
    'Password Generator',
    'Password Strength Analyzer',
    'WiFi QR Generator',
    'Text Diff',
    'Emoji Picker',
  ]

  return (
    <div className="container">
      <header>
        <h1>MindForge</h1>
        <p>Privacy-First Utility Tools for IT Professionals</p>
      </header>

      <main>
        <div className="tool-grid">
          {tools.map((tool) => (
            <div className="tool-card" key={tool}>
              <h3>{tool}</h3>
              <p>Coming Soon</p>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <p>MindForge v0.1</p>
      </footer>
    </div>
  )
}

export default App