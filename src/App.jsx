import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SubnetCalculator from "./pages/SubnetCalculator";
import PasswordGenerator from "./pages/PasswordGenerator";
import EncryptionDecryption from "./pages/EncryptionDecryption";
import WifiQRGenerator from "./pages/WifiQRGenerator";
import PasswordStrengthAnalyzer from "./pages/PasswordStrengthAnalyzer";
import TextDiff from "./pages/TextDiff";
import EmojiPicker from "./pages/EmojiPicker";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/subnet-calculator"
          element={<SubnetCalculator />}
        />
        <Route
          path="/password-generator"
          element={<PasswordGenerator />}
        />
        <Route
          path="/encryption-decryption"
          element={<EncryptionDecryption />}
        />
        <Route
          path="/wifi-qr-generator"
          element={<WifiQRGenerator />}
        />
        <Route
          path="/password-strength-analyzer"
          element={<PasswordStrengthAnalyzer />}
        />
        <Route
          path="/text-diff"
          element={<TextDiff />}
        />
        <Route
          path="/emoji-picker"
          element={<EmojiPicker />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
