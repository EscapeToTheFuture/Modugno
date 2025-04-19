/* eslint-disable react/prop-types */
import { useState } from "react";

const Tastierino = ({ correctCode, onCorrectCode, onWrongCode }) => {
  const [codeInput, setCodeInput] = useState("");

  const handleConfirm = () => {
    if (codeInput == correctCode) {
      onCorrectCode();
    } else {
        // // Blink "errore" 3 times
        // for (let i = 0; i < 4; i++) {
        //     setTimeout(() => {
        //     setCodeInput((prev) => (prev === "errore" ? "" : "errore"));
        //     }, i * 500);
        // }
        // setTimeout(() => {
        //     setCodeInput("");
        // }, 1500);
        onWrongCode();
        setCodeInput("");
    }
  };
  const handleDelete = () => {
    setCodeInput((prev) => prev.slice(0, -1));
  };

  const handleCodeInput = (area) => {
    if (area === "CANC") {
      handleDelete();
    } else if (area === "OK") {
      handleConfirm();
    } else {
      handleAddDigit(area);
    }
  };

  const handleAddDigit = (digit) => {
    if (codeInput.length < 2) {
      setCodeInput((prev) => prev + digit);
    }
  };

return (
    <div className="flex flex-col items-center justify-center bg-zinc-400 p-4 border-white border-5 rounded-lg shadow-lg">
        <div className="flex flex-row justify-center items-center mb-4">
            <div
                className="text-inknut text-4xl bg-gray-400 text-black font-mono px-4 py-2 rounded-lg border-2 border-gray-500"
                style={{
                    fontFamily: "Digital-7, monospace",
                    width: "8ch",
                    textAlign: "center",
                }}
            >
                {codeInput || "----"}
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CANC", 0, "OK"].map((digit) => (
                <button
                    key={digit}
                    onClick={() => {
                        handleCodeInput(digit);
                    }}
                    className="bg-gray-800 text-white p-4 rounded w-full h-full text-center text-2xl font-bold hover:bg-gray-700 transition duration-200"
                >
                    {digit}
                </button>
            ))}
        </div>
    </div>
);
};

export default Tastierino;
