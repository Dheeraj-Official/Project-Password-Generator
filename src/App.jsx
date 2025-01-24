import { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // State variables
  const [length, setLength] = useState(8); // Password length
  const [numberAllowed, setNumberAllowed] = useState(false); // Include numbers?
  const [charAllowed, setCharAllowed] = useState(false); // Include special characters?
  const [password, setPassword] = useState(""); // Generated password
  const [copied, setCopied] = useState(false); // Clipboard copy status

  const passwordRef = useRef(null); // Reference to the password input

  // Check if password contains numbers
  const checkPassword = (password) => [...password].some((char) => char >= "0" && char <= "9");
  
  // Check if password contains special characters
  const checkSpecialChar = (password) => [...password].some((char) => "@#$_.".includes(char));

  // Calculate password strength
  const calculateStrength = useCallback(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (numberAllowed && checkPassword(password)) strength++;
    if (charAllowed && checkSpecialChar(password)) strength++;

    const levels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return levels[strength] || "Very Weak";
  }, [password, numberAllowed, charAllowed]);

  // Get strength color for the border
  const getStrengthColor = useCallback(() => {
    const strength = calculateStrength();
    const colors = {
      "Very Weak": "border-red-600",
      Weak: "border-orange-600",
      Medium: "border-yellow-600",
      Strong: "border-green-600",
      "Very Strong": "border-pink-500",
    };
    return colors[strength] || "border-gray-400";
  }, [calculateStrength]);

  // Get text color based on strength
  const getTextColor = useCallback(() => {
    const strength = calculateStrength();
    const colors = {
      "Very Weak": "text-red-600",
      Weak: "text-orange-600",
      Medium: "text-yellow-600",
      Strong: "text-green-600",
      "Very Strong": "text-pink-500",
    };
    return colors[strength] || "text-gray-400";
  }, [calculateStrength]);

  // Generate random password based on settings
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

  // Copy password to clipboard
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
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
            className={`w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none shadow-md placeholder:text-gray-400 transition-all duration-300 focus:ring-4 hover:scale-105 ${getStrengthColor()} border-4 ${getTextColor()}`} // Dynamic border & text color
            placeholder="Type or Generate Password"
          />
          <div className="flex space-x-3">
            <button
              onClick={copyPasswordToClipboard}
              disabled={copied}
              className={`bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all ${copied ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {copied ? "Copied!" : "Copy"} {/* Copy button */}
            </button>
            <button
              onClick={generatePassword}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none hover:opacity-90"
            >
              Generate {/* Generate button */}
            </button>
          </div>
        </div>

        {copied && (
          <p className="text-center text-green-400 font-semibold">
            Password copied! {/* Show "Password copied!" message */}
          </p>
        )}

        <p className={`text-center font-bold ${getStrengthColor()} text-lg`}>
          Strength: {calculateStrength()} {/* Display password strength */}
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
            /> {/* Slider for password length */}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed(!numberAllowed)}
              className="cursor-pointer accent-cyan-500"
            />
            <label className="text-sm text-gray-400">Include Numbers</label> {/* Checkbox for numbers */}
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
            </label> {/* Checkbox for special characters */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
