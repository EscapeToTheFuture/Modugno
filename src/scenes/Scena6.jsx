import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";
import confetti from "canvas-confetti";
import Button from "@components/Button";

import scenesModugno from "@assets/scenesModugno.json";

import parco from "@assets/images/Scena6/Il parco comunale.jpg";
import statua from "@assets/images/Scena6/Statua di Leo ed Argo.jpg";

const Scena6 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(parco);

  const [endButton, setEndButton] = useState(false);

  const scene = scenesModugno[8];
  const navigate = useNavigate();
  return (
    <div>
      {/* Background image */}
      <img
        src={backgroundImage}
        alt="Background"
        className="w-full h-screen object-cover z-1"
      />
      {/* Dialogues */}
      <div className="z-20 absolute h-screen inset-0 flex items-center justify-center">
        {scene.dialogue.map(
          (dialogue, index) =>
            index === currentDialogueIndex && (
              <Dialogue
                key={currentDialogueIndex}
                dialogue={dialogue}
                centered={currentDialogueIndex < 3}
                onClose={() => {
                  // Cambia l'immagine al dialogo 2
                  if (currentDialogueIndex === 3) {
                    setBackgroundImage(statua);
                  }
                  // Vai avanti con i dialoghi
                  if (currentDialogueIndex < scene.dialogue.length - 1) {
                    setCurrentDialogueIndex(currentDialogueIndex + 1);
                  } else {
                    // Dialoghi finiti, spara confetti
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                    });
                    // Dopo 5 secondi, setEndButton(true);
                    setTimeout(() => {
                      setEndButton(true);
                    }, 5000);
                  }
                }}
              />
            )
        )}
      </div>

      {/* Bottone fine gioco */}
      {endButton && (
          <div className="fixed bottom-10 right-10 z-20 animate-fade-in">
            <Button
              onClick={() => {
                navigate("/win");
              }}
            >
              Fine
            </Button>
          </div>
          
        )
      }
    </div>
  );
};

export default Scena6;