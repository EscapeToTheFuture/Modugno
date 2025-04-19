import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";
import ImageMapper from "react-img-mapper";
import confetti from "canvas-confetti";

import scenesModugno from "@assets/scenesModugno.json";
import buttonArrow from "@assets/images/generic/buttonArrow.png";
import ruotaSpenta from "@assets/images/Scena2/ruota panoramica Spenta.jpg";
import ruotaAccesa from "@assets/images/Scena2/ruota panoramica accesa.jpg";
import pannelloControllo from "@assets/images/Scena2/pannello controllo.png";
import vistaAltoRuota from "@assets/images/Scena2/VistaAltoRuota.png";

const Scena2 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const scene = scenesModugno[1];

  const [hasClickedHint, setHasClickedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(ruotaSpenta);
  
  // Enigma di tipo sequenza: Il giocatore deve cliccare in ordine Giallo, Rosso, Blu.
  // Quindi sono 3 click in totale. Al primo tentativo sbagliato setShowHintDialogue(true)
  // Ad ogni tentativo la sequenza inserita viene confrontata con la sequenza corretta, se non è valida va svuotato il tentativo

  const [attempt, setAttempt] = useState([]);
  const correctSequence = ["circleY", "circleR", "circleB"];
  const [showHintDialogue, setShowHintDialogue] = useState(false);
  
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
                  setCurrentBackground(pannelloControllo);
                  return;
                }
                // Altrimenti, se il dialogo è 2 e non ha risolto l'enigma, non andare avanti
                if (currentDialogueIndex === 2 && currentBackground === ruotaSpenta) {
                  return;
                }

                // Vai avanti con i dialoghi
                if (currentDialogueIndex < scene.dialogue.length - 1) {
                  // Custom actions for each dialogue
                  if (currentDialogueIndex === 3) {
                    setCurrentBackground(vistaAltoRuota);
                  }

                  setCurrentDialogueIndex(currentDialogueIndex + 1);
                }
              }}
            />
          )
      )}

      {/* Hint */}
      {
        showHint && (
          <Dialogue
            key={currentDialogueIndex}
            dialogue={{
                "type": "hint",
                "speaker": "Suggerimento",
                "text": "Per far sì che la ruota giri, pensa al giro del giorno..."
            }}
            onClose={() => {
              setShowHint(false)
            }}
          />
        )
      }

      {/* Hint dialogue */}
      {
        showHintDialogue && (
          <Dialogue
            key={currentDialogueIndex}
            dialogue={{
                "type": "speaking",
                "speaker": "Tommaso",
                "text": "Mattina, tramonto, notte… forse è un ciclo, come il giro del sole."
            }}
            onClose={() => {
              setShowHintDialogue(false)
            }}
          />
        )
      }


      {/* ImageMapper */}
      <div className="flex flex-col justify-center items-center h-svh">
        <ImageMapper
          disabled={currentBackground !== pannelloControllo}
          src={currentBackground}
          name="Ruota panoramica"
          natural
          imgWidth={1920}
          parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
          responsive={true}
          areas={[
            {
              id: "circleY",
              shape: "circle",
              coords: [743, 688, 65],
              fillColor: "rgba(50, 50, 50, 0.449)",
              lineWidth: 1,
              strokeColor: "rgba(50, 50, 50, 0.887)"
            },
            {
              id: "circleB",
              shape: "circle",
              coords: [945, 688, 67],
              fillColor: "rgba(50, 50, 50, 0.449)",
              lineWidth: 1,
              strokeColor: "rgba(50, 50, 50, 0.887)"
            },
            {
              id: "circleR",
              shape: "circle",
              coords: [1147, 687, 66],
              fillColor: "rgba(50, 50, 50, 0.449)",
              lineWidth: 1,
              strokeColor: "rgba(50, 50, 50, 0.887)"
            },
            {
              id: "hint",
              shape: "poly",
              coords: [1376, 654, 1448, 926, 1718, 851, 1683, 693, 1532, 612],
              fillColor: "rgba(50, 50, 50, 0.449)",
              lineWidth: 1,
              strokeColor: "rgba(50, 50, 50, 0.887)"
            }
          ]}
          isMulti={false}
          onChange={(area) =>{
            if (area.id === "hint"){
              setHasClickedHint(true);
              setShowHint(true);
            } else {
              // Aggiorna la sequenza inserita
              // Se la sequenza è lunga 3, controlla se è corretta
              setAttempt((prevAttempt) => {
                const updatedAttempt = [...prevAttempt, area.id];
                if (updatedAttempt.length === 3) {
                  if (JSON.stringify(updatedAttempt) === JSON.stringify(correctSequence)) {
                    // Se è corretta, mostra il messaggio di successo e cambia lo sfondo
                    setCurrentBackground(ruotaAccesa);
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ["#ff0000", "#00ff00", "#0000ff"]
                    });
                    // Fai ripartire i dialoghi
                    setCurrentDialogueIndex(3);
                  } else {
                    // la Sequenza è sbagliata, mostra il messaggio di errore
                    setShowHintDialogue(true);
                  }
                  return []; // svuota il tentativo
                }
                return updatedAttempt;
              });
            }
          }}
        />
      </div>
      {/* Immagine come bottone per andare alla scena successiva */}
      {currentDialogueIndex === scene.dialogue.length-1 && (
        <button
          onClick={() => navigate("/scena3")}
          className="z-10 absolute bottom-4 right-4 w-16 h-16 sm:bottom-6 sm:right-6 sm:w-20 sm:h-20 md:bottom-8 md:right-8 md:w-24 md:h-24 lg:bottom-10 lg:right-10 lg:w-32 lg:h-32 cursor-pointer transform rotate-90 transition-transform duration-300 hover:scale-110 bg-transparent border-none p-0"
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

export default Scena2;
