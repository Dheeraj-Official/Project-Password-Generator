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
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (numberAllowed && checkPassword(password)) strength++;
    if (charAllowed && checkSpecialChar(password)) strength++;

    const levels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return levels[strength] || "Very Weak";
  }, [length, numberAllowed, charAllowed, password]);

  const getStrengthColor = useCallback(() => {
    const strength = calculateStrength();
    const colors = {
      "Very Weak": "text-red-400",
      Weak: "text-orange-400",
      Medium: "text-yellow-400",
      Strong: "text-green-400",
      "Very Strong": "text-cyan-400",
    };
    return colors[strength] || "text-gray-400";
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

  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, charAllowed, generatePassword]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-gray-900 to-black text-white px-6 sm:px-8">
      <div className="max-w-lg w-full bg-opacity-80 bg-black rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-cyan-400 animate-pulse">
          Password Generator
        </h1>

        {/* Password Display */}
        <div className="relative flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
          <input
            ref={passwordRef}
            type="text"
            value={password}
            readOnly
            className="flex-grow px-4 py-3 text-gray-900 bg-gray-200 rounded-lg focus:outline-none shadow-md placeholder:text-gray-400"
            placeholder="Generated Password"
          />
          <button
            onClick={copyPasswordToClipboard}
            disabled={copied}
            className={`sm:absolute sm:right-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg active:scale-95 transition-all w-full sm:w-auto ${
              copied ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Copy Confirmation */}
        {copied && (
          <p className="text-center text-green-400 font-semibold animate-fadeIn">
            Copied!
          </p>
        )}

        {/* Password Strength */}
        <p
          className={`text-center font-bold ${getStrengthColor()} text-lg`}
        >
          Strength: {calculateStrength()}
        </p>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Length:</span>
              <span className="text-cyan-400 font-semibold">{length}</span>
            </label>
            <input
              type="range"
              min="4"
              max="20"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="cursor-pointer w-full mt-2 md:mt-0 md:w-1/2"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed(!numberAllowed)}
                className="cursor-pointer accent-cyan-500"
              />
              <span className="text-gray-400">Include Numbers</span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed(!charAllowed)}
                className="cursor-pointer accent-pink-500"
              />
              <span className="text-gray-400">Include Special Characters</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
