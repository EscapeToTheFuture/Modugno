import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";

import scenesModugno from "@assets/scenesModugno.json";
import parcoSpento from "@assets/images/Scena1/Risvegliotommaso.webp";
import buttonArrow from "@assets/images/generic/buttonArrow.webp";

const Scena1 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const scene = scenesModugno[0];
  const [showBackground, setShowBackground] = useState(false);

  const navigate = useNavigate();
  return (
    <div>
      {/* Dialogues */}
      {scene.dialogue.map(
        (dialogue, index) =>
          index === currentDialogueIndex && (
            <Dialogue
              key={currentDialogueIndex}
              dialogue={dialogue}
              onClose={() => {
                if (currentDialogueIndex < scene.dialogue.length - 1) {
                  // Custom actions for each dialogue

                  // Dopo il primo dialogo, mostra l'immagine di sfondo parcoSpento
                  if (currentDialogueIndex === 0) {
                    setShowBackground(true);
                  }

                  setCurrentDialogueIndex(currentDialogueIndex + 1);
                }
              }}
            />
          )
      )}
      {/* Immagine di sfondo */}
      {showBackground && (
        <img
          src={parcoSpento}
          alt="Parco Spento"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 fade-in"
          onLoad={(e) => e.target.classList.add("opacity-100")}
        />
      )}
      {/* Immagine come bottone per andare alla scena successiva */}
        {currentDialogueIndex === scene.dialogue.length - 1 && (
          <button
            onClick={() => navigate("/scena2")}
            className="absolute bottom-4 right-4 w-16 h-16 sm:bottom-6 sm:right-6 sm:w-20 sm:h-20 md:bottom-8 md:right-8 md:w-24 md:h-24 lg:bottom-10 lg:right-10 lg:w-32 lg:h-32 cursor-pointer transform rotate-90 transition-transform duration-300 hover:scale-110 bg-transparent border-none p-0"
            aria-label="Go to next scene"
          >
            <img
              src={buttonArrow}
              alt=""
              className="w-full h-full"
            />
          </button>
        )}
    </div>
  );
};

export default Scena1;
