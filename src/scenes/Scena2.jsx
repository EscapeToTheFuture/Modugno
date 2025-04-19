import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";
import ImageMapper from "react-img-mapper";
import confetti from "canvas-confetti";

import scenesModugno from "@assets/scenesModugno.json";
import ruotaSpenta from "@assets/images/Scena2/ruota panoramica Spenta.jpg";
import ruotaAccesa from "@assets/images/Scena2/ruota panoramica accesa.jpg";
import pannelloControllo from "@assets/images/Scena2/pannello controllo.jpg";
import vistaAltoRuota from "@assets/images/Scena2/VistaAltoRuota.png";

const Scena2 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const scene = scenesModugno[1];

  const [hasClickedHint, setHasClickedHint] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(ruotaSpenta);


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
                // Al dialogo 1, Se non ha letto il suggerimento, non andare avanti
                if (currentDialogueIndex === 1 && !hasClickedHint) {
                  return;
                }
                // Altrimenti, se il dialogo è 2 e non ha risolto l'enigma, non andare avanti
                if (currentDialogueIndex === 2 && currentBackground === ruotaSpenta) {
                  return;
                }

                // Vai avanti con i dialoghi
                if (currentDialogueIndex < scene.dialogue.length - 1) {
                  // Custom actions for each dialogue

                    setCurrentDialogueIndex(currentDialogueIndex + 1);
                }
              }}
            />
          )
      )}

      {/* ImageMapper */}
      <div className="flex flex-col justify-center items-center h-svh">
        <ImageMapper
            src={currentBackground}
            name="Ruota panoramica"
            natural
            imgWidth={1920}
            parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
            responsive={true}
            areas={[
            {
                id: "porta_cucina",
                shape: "rect",
                coords: [206, 256, 580, 950],
                fillColor: "rgba(237, 20, 61, 0.5)",
                lineWidth: 0,
                strokeColor: "rgba(237, 20, 61, 0.5)",
            },
            {
                id: "porta_laboratorio",
                shape: "rect",
                coords: [852, 314, 1080, 793],
                fillColor: "rgba(237, 20, 208, 0.5)",
                lineWidth: 0,
                strokeColor: "rgba(237, 20, 222, 0.5)",
            }
            ]}
            isMulti={false}
        />
    </div>
    </div>
  );
};

export default Scena2;
