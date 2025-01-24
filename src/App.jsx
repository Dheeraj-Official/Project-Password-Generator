import { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordRef = useRef(null);

  const checkPassword = (password) =>
    [...password].some((char) => char >= "0" && char <= "9");
  const checkSpecialChar = (password) =>
    [...password].some((char) => "@#$_.".includes(char));

  const calculateStrength = useCallback(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (numberAllowed && checkPassword(password)) strength++;
    if (charAllowed && checkSpecialChar(password)) strength++;

    const levels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return levels[strength] || "Very Weak";
  }, [password, numberAllowed, charAllowed]);

  const getStrengthColor = useCallback(() => {
    const strength = calculateStrength();
    const colors = {
      "Very Weak": "border-red-600", // Red for very weak
      Weak: "border-orange-600",     // Orange for weak
      Medium: "border-yellow-600",   // Yellow for medium
      Strong: "border-green-600",    // Green for strong
      "Very Strong": "border-pink-500", // Pink for very strong
    };
    return colors[strength] || "border-gray-400";
  }, [calculateStrength]);

  const getTextColor = useCallback(() => {
    const strength = calculateStrength();
    const colors = {
      "Very Weak": "text-red-600",  // Red for very weak
      Weak: "text-orange-600",      // Orange for weak
      Medium: "text-yellow-600",    // Yellow for medium
      Strong: "text-green-600",     // Green for strong
      "Very Strong": "text-pink-500", // Pink for very strong
    };
    return colors[strength] || "text-gray-400"; // Default to gray if no strength
  }, [calculateStrength]);

  const generatePassword = useCallback(() => {
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numberAllowed) characters += "1234567890";
    if (charAllowed) characters += "@#$_.";

    setPassword(
      Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
      ).join("")
    );
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  // Regenerate password on settings change
  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, charAllowed, generatePassword]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-gray-900 to-black text-white px-4 sm:px-6">
      <div className="max-w-md w-full bg-opacity-90 bg-black rounded-lg shadow-lg p-5 sm:p-6 space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400">
          Password Generator
        </h1>

        <div className="relative flex flex-col items-center space-y-3">
          <input
            ref={passwordRef}
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none shadow-md placeholder:text-gray-400 transition-all duration-300 focus:ring-4 hover:scale-105 ${getStrengthColor()} border-4 ${getTextColor()}`} // Text and border color based on strength
            placeholder="Type or Generate Password"
          />
          <div className="flex space-x-3">
            <button
              onClick={copyPasswordToClipboard}
              disabled={copied}
              className={`bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all ${copied ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={generatePassword}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all"
            >
              Generate
            </button>
          </div>
        </div>

        {copied && (
          <p className="text-center text-green-400 font-semibold">
            Password copied!
          </p>
        )}

        <p className={`text-center font-bold ${getStrengthColor()} text-lg`}>
          Strength: {calculateStrength()}
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Length: {length}</label>
            <input
              type="range"
              min="4"
              max="20"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-3/4 cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed(!numberAllowed)}
              className="cursor-pointer accent-cyan-500"
            />
            <label className="text-sm text-gray-400">Include Numbers</label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed(!charAllowed)}
              className="cursor-pointer accent-pink-500"
            />
            <label className="text-sm text-gray-400">
              Include Special Characters
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
