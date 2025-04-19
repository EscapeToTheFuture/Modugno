import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "@components/Button";
import letteraC from "@assets/images/Scena1/Lettera_C.webp";
import letteraO from "@assets/images/Scena1/Lettera_O.webp";
import Card from "@components/Card";

import letteraGiraSound from "@assets/sounds/scena1/crunchy_paper-33625.mp3";
import fotoGirataSound from "@assets/sounds/scena1/walkman-button-272973.mp3";
import ambientSound from "@assets/sounds/scena1/Detective tune Sound SFX - Sound effect [qgEx3LqfIHM].mp3";

const Scena1 = () => {
  const [buttonVisible, setButtonVisible] = useState(true);
  const [divVisible, setDivVisible] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [shake, setShake] = useState(false);
  const [examined, setExamined] = useState(false);
  const navigate = useNavigate();

  // Gestione audio
  const [playing, setPlaying] = useState({
    "ambient": {
      playing: false,
    },
    "letter": { 
      playing: false 
    },
    "photo": { 
      playing: false 
    },
  });

  useEffect(() => {
    // Initialize audio players
    const ambientAudio = new Audio(ambientSound);
    const letterAudio = new Audio(letteraGiraSound);
    const photoAudio = new Audio(fotoGirataSound);

    setPlaying({
      "ambient": {
        player: ambientAudio,
        playing: false,
      },
      "letter": { 
        player: letterAudio,
        playing: false 
      },
      "photo": { 
        player: photoAudio,
        playing: false 
      },
    });

    ambientAudio.loop = true;
    ambientAudio.volume = 0.6;
    ambientAudio.play();

    return () => {
      ambientAudio.pause();
    };
  }, []);

  const openLetter = (open) => {
    
    playing.letter.player.play();
    setPlaying((prev) => ({
      ...prev,
      "letter": { ...prev["letter"], playing: true }
    }));        
    setButtonVisible(!open);
    setDivVisible(open);
  };

  const handleImageLoad = (e) => {
    e.target.style.transform = "scale(1) rotate(360deg)";
    setTimeout(() => {
      setAnimationFinished(true);
    }, 2000); // Duration of the animation
  };

  const handleShake = () => {
    
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 1000); // Duration of the shake animation
  };

  const goToForest = () => {
    navigate("/Scena2");
  };

  const giraFoto = () => {
    setExamined(true);
    // Riproduci foto girata
    playing.photo.player.play();
    setPlaying((prev) => ({
      ...prev,
      "photo": { ...prev["photo"], playing: true }
    }));
  };

  return (
    <section className="w-screen h-svh bg-black flex flex-col items-center justify-center bg-[url(../images/Scena1/Legno.webp)] bg-center bg-cover bg-no-repeat bg-opacity-50 gap-14">

      {buttonVisible && (
        <Button
          onClick={() => animationFinished && openLetter(true)}
          className={`${
            !animationFinished ? "pointer-events-none opacity-50" : ""
          }`}
        >Apri la lettera</Button>
      )}

      <div className="w-5/11 relative">
        <img
          src={letteraC}
          alt="Lettera"
          className={`w-full transform transition-transform duration-2000 ease-in-out ${
            divVisible ? "hidden" : "block"
          }`}
          style={{ transform: "scale(0) rotate(0deg)" }}
          onLoad={handleImageLoad}
          onClick={() => animationFinished && openLetter(true)}
        />
        <img
          src={letteraO}
          alt="Lettera Aperta"
          className={`w-full transform transition-transform duration-2000 ease-in-out ${
            divVisible ? "block" : "hidden"
          }`}
          style={{ transform: "scale(0) rotate(0deg)" }}
          onLoad={handleImageLoad}
          onClick={() => animationFinished && openLetter(false)}
        />

        {divVisible && (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className={`select-none absolute bg-gray-200 font-julee flex flex-col items-center justify-center px-6 py-18 gap-2 w-3/4 rounded-sm transition-opacity duration-1000 ease-in-out ${
                  divVisible ? "opacity-100" : "opacity-0"
                } `}
                style={{ zIndex: 10 }}
              >
                <h3 className="xl:text-2xl text-sm font-bold text-black text-center">
                  Ciao, ti scrivo di nascosto questa lettera per aiutarmi a
                  liberare Enrico.
                </h3>
                <p className="xl:text-xl text-xs font-semibold text-blue-800 text-center">
                  Troverai tutte le indicazioni necessarie per trovare il
                  laboratorio dove è prigioniero.
                </p>
                <div
                  className={`absolute w-full left-60 bottom-10 hover:cursor-pointer xl:left-120 xl:bottom-20 ${
                    shake ? "normal-shake" : ""
                  }`}
                  onClick={() => {
                    giraFoto();
                  }}
                >
                  <Card />
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 flex justify-center items-center">
              <Button onClick={() => openLetter(false)}>Chiudi lettera</Button>
              <Button onClick={examined ? goToForest : handleShake}>
                {examined ? "Vai alla foresta" : "Esamina meglio"}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Scena1;
