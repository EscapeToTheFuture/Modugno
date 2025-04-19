import { useState } from "react";
import { useNavigate } from "react-router";
import Dialogue from "@components/Dialogue";
import ImageMapper from "react-img-mapper";
import confetti from "canvas-confetti";

import Button from "@components/Button";

import scenesModugno from "@assets/scenesModugno.json";

import statuaPiena from "@assets/images/Scena4/FONTANA chiusa.jpg";
import statuaVuota from "@assets/images/Scena4/FONTANA con moneta.jpg";
import statuaAperta from "@assets/images/Scena4/FONTANA aperta.jpg";
import diario from "@assets/images/Scena4/Diario.jpg";

const Scena4 = () => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [scene, setScene] = useState(scenesModugno[5]);
  const [backgroundImage, setBackgroundImage] = useState(statuaPiena);

  const [showDiary, setShowDiary] = useState(false);
  const [showTunnelButton, setShowTunnelButton] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="h-screen">
      {/* Dialogues */}
      {scene.dialogue.map(
        (dialogue, index) =>
          index === currentDialogueIndex && (
            <Dialogue
              key={currentDialogueIndex}
              dialogue={dialogue}
              onClose={() => {
                // Se siamo a scenesModugno[6], allora controlla che la moneta sia stata inserita (backgroundImage === statuaAperta) prima di continuare i dialoghi
                if (
                  scene === scenesModugno[6] &&
                  currentDialogueIndex == 1 &&
                  backgroundImage !== statuaAperta
                ) {
                  return;
                }
                if (currentDialogueIndex < scene.dialogue.length - 1) {
                  // Custom actions for each dialogue
                  setCurrentDialogueIndex(currentDialogueIndex + 1);
                }
              }}
            />
          )
      )}

      {/* Diario antico */}
      {showDiary ? (
        <div className="fixed inset-0 backdrop-brightness-70 flex items-center justify-center z-2">
          <img
            src={diario}
            alt="Diario antico"
            className="w-full h-auto"
          />
        </div>
        ) : <img src={diario} alt="Diario antico" className="hidden" />
      }

      {/* Bottone vai al tunnel */}
      {showTunnelButton && (
        <div className="fixed bottom-10 right-10 z-10 animate-fade-in">
          <Button
            onClick={() => {
              navigate("/scena5");
            }}
          >
            Vai al tunnel
          </Button>
        </div>
        
      )}

      {/* ImageMapper */}
      <div className="relative h-full">
        <div className="absolute bottom-0 w-full">
          <ImageMapper
            src={backgroundImage}
            name="Fontana"
            natural
            parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
            height={window.innerHeight}
            responsive={true}
            areas={[
              {
                id: "valvola",
                shape: "circle",
                coords: [944, 997, 95],
                fillColor: "rgba(255, 255, 255, 0.196)",
                lineWidth: 0,
                disabled: backgroundImage !== statuaPiena
              },
              {
                id: "coin",
                shape: "circle",
                coords: [751, 816, 40],
                fillColor: "rgba(255, 255, 255, 0.196)",
                lineWidth: 0,
                disabled: backgroundImage !== statuaVuota
              },
              {
                id: "diario",
                shape: "poly",
                coords: [
                  876, 785, 956, 792, 1002, 761, 1049, 849, 981, 894, 901, 885
                ],
                fillColor: "rgba(255, 255, 255, 0.196)",
                lineWidth: 0,
                disabled: backgroundImage !== statuaAperta
              }
            ]}
            isMulti={false}
            onChange={(area) => {
              if (area.id === "valvola") {
                setBackgroundImage(statuaVuota);
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
                // Reimposta dialoghi alla scena successiva
                setCurrentDialogueIndex(0);
                setScene(scenesModugno[6]);
              } else if (area.id === "coin") {
                setBackgroundImage(statuaAperta);
                // fai ripartire i dialoghi
                setCurrentDialogueIndex(2);
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              } else if (area.id === "diario") {
                setShowDiary(true);
                // setShwoTunnelButton(true) dopo 5 secondi
                setTimeout(() => {
                  setShowTunnelButton(true);
                }, 5000);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Scena4;
