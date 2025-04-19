import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";
import Button from "@components/Button";

import scenesModugno from "@assets/scenesModugno.json";
import vistaAltoRuota from "@assets/images/Scena2/VistaAltoRuota.png";

const Scena3 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [scene, setScene] = useState(scenesModugno[2]);

  const [showChoices, setShowChoices] = useState(false);
  const navigate = useNavigate();
  return (
    <div style={{ backgroundImage: `url(${vistaAltoRuota})` }} className="bg-cover bg-center h-screen">
      <div className="absolute inset-0 bg-black/30 opacity-60"></div>
      {/* Dialogues */}
      {scene.dialogue.map(
        (dialogue, index) =>
          index === currentDialogueIndex && (
            <Dialogue
              key={currentDialogueIndex}
              dialogue={dialogue}
              centered={true}
              onClose={() => {
                // Vai avanti con i dialoghi
                if (currentDialogueIndex < scene.dialogue.length - 1) {
                  setCurrentDialogueIndex(currentDialogueIndex + 1);
                } else {
                  // Se la scena è scenesModugno[2], mostra le scelte
                  if (scene === scenesModugno[2]) {
                    setShowChoices(true);
                  } else if(scene === scenesModugno[3]) {
                    // Altrimenti, se la scena è scenesModugno[3], vai al gameover
                    localStorage.setItem("gameover_reason", "Sei stato chiuso nell'ufficio di Leo.");
                    navigate("/gameover");
                  } else if(scene === scenesModugno[4]) {
                    // Altrimenti, se la scena è scenesModugno[4], vai alla scena 5
                    navigate("/scena4");
                  }
                }
              }}
            />
          )
      )}

      {/* Bottoni di scelta */}
      <div className="flex flex-row justify-evenly items-center h-screen">
        {showChoices && (
          <>
            <Button
              onClick={async () => {
                setScene(scenesModugno[3]);
                setCurrentDialogueIndex(0);
                setShowChoices(false);
              }}
            >
              Parla con Leo
            </Button>
            <Button
              onClick={async () => {
                setScene(scenesModugno[4]);
                setCurrentDialogueIndex(0);
                setShowChoices(false);
              }}
            >
              Scappa
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Scena3;
