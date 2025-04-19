import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";
import ImageMapper from "react-img-mapper";
import confetti from "canvas-confetti";

import Button from "@components/Button";
import Tastierino from "@components/Tastierino";
import buttonArrow from "@assets/images/generic/buttonArrow.png";

import scenesModugno from "@assets/scenesModugno.json";

import tunnelChiuso from "@assets/images/Scena5/TUNNEL.jpg";
import tunnelAperto from "@assets/images/Scena5/TUNNEL aperto.jpg";
import foto from "@assets/images/Scena5/trim-Foto incorniciata.png";

import baule_chiuso from "@assets/images/Scena5/Baule.jpg";
import baule_aperto from "@assets/images/Scena5/Baule aperto.jpg";

const Scena5 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [scene, setScene] = useState(scenesModugno[7]);
  const [backgroundImage, setBackgroundImage] = useState(tunnelChiuso);

  const [triedOpenBaule, setTriedOpenBaule] = useState(false);
  const [showOpenBauleUI, setShowOpenBauleUI] = useState(false);
  const [showOpenBaule, setShowOpenBaule] = useState(false);
  const [nextSceneButton, setNextSceneButton] = useState(false);

  const [showCustomDialogue, setShowCustomDialogue] = useState(null);

  const navigate = useNavigate();
  return (
    <div className="h-screen">
      {/* Custom dialogue */}
      {showCustomDialogue && (
        <Dialogue
          key={showCustomDialogue.text}
          dialogue={showCustomDialogue}
          onClose={() => {
            setShowCustomDialogue(null);
          }}
        />
      )}

      {/* Dialogues */}
      {scene.dialogue.map(
        (dialogue, index) =>
          index === currentDialogueIndex && (
            <Dialogue
              key={currentDialogueIndex}
              dialogue={dialogue}
              onClose={() => {
                // On dialogue 2 change background image to baule_chiuso
                if (currentDialogueIndex === 2) {
                  setBackgroundImage(baule_chiuso);
                }
                // Non andare avanti se il dialogo è 3 e il baule è chiuso
                if (
                  (currentDialogueIndex === 3 || currentDialogueIndex == 5) &&
                  backgroundImage === baule_chiuso
                ) {
                  setShowOpenBauleUI(true);
                  return;
                }

                // Se siamo al penultimo dialogo, cambia l'immagine a tunnelAperto
                if (currentDialogueIndex === scene.dialogue.length - 2) {
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                  });
                  setBackgroundImage(tunnelAperto);
                }

                if (currentDialogueIndex < scene.dialogue.length - 1) {
                  // Custom actions for each dialogue
                  setCurrentDialogueIndex(currentDialogueIndex + 1);
                } else {
                  // Mostra bottone per passare alla scena 6
                  setNextSceneButton(true);
                }
              }}
            />
          )
      )}

      {/* UI apertura baule */}
      {
        showOpenBauleUI && (
          <div className="z-2 absolute top-0 left-0 w-full h-full flex flex-row items-center justify-evenly">
            {/* Tastierino a sinistra */}
            <div className="flex flex-col">
              {
                showOpenBaule ? 
                  <Button onClick={() => {
                    setShowOpenBauleUI(false)
                    setBackgroundImage(baule_aperto);
                    setCurrentDialogueIndex(6);
                  }} >Apri il baule</Button>
                    : 
                  <Tastierino correctCode={12} 
                    onCorrectCode={() => {setShowOpenBaule(true)}} 
                    onWrongCode={() => {
                      setShowCustomDialogue(
                        {
                          type: "narrator",
                          text: "La combinazione è errata. Dovrai riflettere di nuovo per aprire la via.",
                        }
                      )
                    }}
                  />
              }
            </div>
            {/* Immagine incorniciata */}
            <div className="flex flex-col w-1/2">
              <img
                src={foto}
                alt="Foto incorniciata"
                className="object-contain"
              />
              <span className="text-center font-inknut text-xl bg-amber-100 text-black p-2 rounded-b-lg">
                Per aprire la via al fuoco: Conta i valorosi, anche i coraggiosi e aggiungi la via di fuga.
              </span>
            </div>
          </div>
        )
      }

      {/* Immagine come bottone per andare alla scena successiva */}
      {nextSceneButton && (
        <button
          onClick={() => navigate("/scena6")}
          className="z-10 absolute bottom-4 right-4 w-16 h-16 sm:bottom-6 sm:right-6 sm:w-20 sm:h-20 md:bottom-8 md:right-8 md:w-24 md:h-24 lg:bottom-10 lg:right-10 lg:w-32 lg:h-32 cursor-pointer transform rotate-90 transition-transform duration-300 hover:scale-110 bg-transparent border-none p-0"
          aria-label="Prossima scena"
        >
          <img
            src={buttonArrow}
            alt=""
            className="w-full h-full"
          />
        </button>
      )}


      {/* ImageMapper */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <div
          className={
            "absolute w-full " +
            (backgroundImage == tunnelAperto || backgroundImage == tunnelChiuso
              ? "bottom-0"
              : "")
          }
        >
          <ImageMapper
            src={backgroundImage}
            name="Tunnel e baule"
            natural
            parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
            height={window.innerHeight}
            responsive={true}
            areas={[
              {
                id: "baule",
                shape: "rect",
                coords: [812, 166, 1113, 612],
                fillColor: "rgba(255, 255, 255, 0.196)",
                lineWidth: 0,
                disabled: backgroundImage !== baule_chiuso
              }
            ]}
            isMulti={false}
            onChange={(area) => {
              if (area.id === "baule") {
                if (!triedOpenBaule) {
                  // Start oldPhoto dialogue
                  setCurrentDialogueIndex(4);
                  setTriedOpenBaule(true);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Scena5;
