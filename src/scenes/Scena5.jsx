import ImageMapper from "react-img-mapper";
import blue from "@assets/images/Scena5/lab-blue.png";
import red from "@assets/images/Scena5/lab-red.png";
import green from "@assets/images/Scena5/lab-green.png";
import yellow from "@assets/images/Scena5/lab-yellow.png";
import purple from "@assets/images/Scena5/lab-purple.png";
import orange from "@assets/images/Scena5/lab-orange.png";
import empty from "@assets/images/Scena5/lab-empty.png";
import code from "@assets/images/Scena5/lab-code.png";
import hint from "@assets/images/Scena5/lab-hint.png";
import unlocked from "@assets/images/Scena5/lab-unlocked.png";
import Button from "../components/Button";
import Dialogue from "../components/Dialogue";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useState } from "react";

import water_fill_sound from "@assets/sounds/scena5/trim-filling-glass-of-water-38501.mp3";
import keystroke from "@assets/sounds/generic/trim-keyboard-typing-one-short-1-292590.mp3";
import doorUnlocked from "@assets/sounds/scena4/door-lock-43124.mp3";
import errorSound from "@assets/sounds/scena5/error.mp3";
import correctCodesfx from "@assets/sounds/scena5/correct.mp3";

const Scena5 = () => {
  const navigate = useNavigate();
  const imageRef = useRef(null); // Riferimento all'immagine
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const labImages = [
    { id: 0, src: empty },
    { id: 1, src: yellow },
    { id: 2, src: blue },
    { id: 3, src: green },
    { id: 4, src: red },
    { id: 5, src: orange },
    { id: 6, src: purple },
    { id: 7, src: hint },
    { id: 8, src: code },
    { id: 9, src: unlocked },
  ];
  const [bgValue, setBgValue] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [prevBgValue, setPrevBgValue] = useState(0);
  const [lastClickedId, setLastClickedId] = useState(null);
  const [correctCode, setCorrectCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [isConfirmPressed, setIsConfirmPressed] = useState(false);
  const [isError, setIsError] = useState(false);

  //Dialoghi
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const scene = {
    dialogue: [
      {
        type: "narrator",
        text: "Nel laboratorio, il detective si trova di fronte a un'altra porta chiusa con un codice numerico.",
      },
      {
        type: "narrator",
        text: "Sul tavolo sono presenti quattro pozioni colorate e un contenitore trasparente",
      },
      {
        type: "hint",
        text: "Affisso al muro, c'è un foglio con scritta su una filastrocca",
      },
      {
        type: "narrator",
        text: "Si è aperto il lucchetto che chiudeva il condotto!",
      },
      {
        type: "narrator",
        text: "Sembra che questa combinazione di colori non sia corretta, riprova",
      },
      {
        type: "narrator",
        text: "Wow, adesso si vede un codice!\nForse devo inserirlo nel tastierino!",
      },

    ],
  };

  const [isInactive, setIsInactive] = useState(false);
  
    // Gestione SFX riempimento ampolla
    const [waterFillSound, setWaterFillSound] = useState(new Audio(water_fill_sound));

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (bgValue !== 7 && bgValue !== 8 && bgValue !== 9 && bgValue !== 3) {
        setIsInactive(false);
        clearTimeout(timer);
        timer = setTimeout(() => setIsInactive(true), 8000);
      }
    };

    window.addEventListener("keypress", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    resetTimer();
    // Preload sound if not already playable
    if (waterFillSound.readyState === 0) {
      waterFillSound.volume = 0.3;
      waterFillSound.preload = "auto";
      waterFillSound.muted = false;
      waterFillSound.load();
    }
      

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [bgValue, waterFillSound]);

  useEffect(() => {
  if (bgValue === 3) {
    const correctCodeSound = new Audio(correctCodesfx);
    correctCodeSound.volume = 0.3;
    correctCodeSound.play();
  }
}, [bgValue]);

  const handleMapClick = (area) => {
    if (bgValue === 7 || bgValue === 8) {
      setBgValue(prevBgValue);
    } else {
      if (area.id === "hint" || area.id === "code") {
        setPrevBgValue(bgValue);
        setBgValue(area.value);
      } else if (clickCount < 2 || (clickCount === 2 && area.id === "code")) {
        if (
          lastClickedId !== area.id ||
          !["red", "blue", "yellow"].includes(area.id)
        ) {
          // Restart and limit the duration of the sound
          waterFillSound.currentTime = 0;
          waterFillSound.play();

          // Stop the sound after 1 second
          setTimeout(() => {
            waterFillSound.pause();
            waterFillSound.currentTime = 0;
          }, 900);

          setPrevBgValue(bgValue);
          setBgValue((prevValue) => prevValue + area.value);
          setClickCount((prevCount) => prevCount + 1);
          setLastClickedId(area.id);
        }
      }
    }
  };

  const handleCodeInput = (area) => {
    // Play keystroke sound
    const audio = new Audio(keystroke);
    audio.volume = 0.3;
    audio.play();

    if (area.id === "delete") {
      handleDelete();
    } else if (area.id === "confirm") {
      setIsConfirmPressed(true);
    } else {
      handleAddDigit(area.id);
    }
  };

  const handleDelete = () => {
    setCodeInput((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (codeInput === "5732") {
      setCorrectCode(true);
    } else {
      // Play error sound
      const errorAudio = new Audio(errorSound);
      errorAudio.volume = 0.3;
      errorAudio.play();

      setCodeInput("ERRORE");
      setIsError(true);
      setTimeout(() => {
        setCodeInput("");
        setIsError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (isConfirmPressed) {
      handleConfirm();
      setIsConfirmPressed(false);
    }
  }, [isConfirmPressed, codeInput]);

  useEffect(() => {
    if (correctCode) {
      setBgValue(9);
      const doorUnlockedSound = new Audio(doorUnlocked);
      doorUnlockedSound.volume = 1;
      doorUnlockedSound.play();    
    }
  }, [correctCode]);

  const handleReset = () => {
    setBgValue(0);
    setClickCount(0);
    setPrevBgValue(0);
    setLastClickedId(null);
    setCodeInput("");
    setCorrectCode(false);
  };

  const handleAddDigit = (digit) => {
    setCodeInput((prev) => {
      if (prev === "ERRORE" || prev.length < 4) {
        return prev + digit;
      }
      return prev;
    });
  };

  const handleNavigate = () => {
    navigate("/scena6");
  };

  useEffect(() => {
    // Funzione per aggiornare le dimensioni dell'immagine
    const updateImageDimensions = () => {
      if (imageRef.current) {
        setImageDimensions({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      }
    };

    // Aggiorna le dimensioni iniziali e aggiungi un listener per il resize
    updateImageDimensions();
    window.addEventListener("resize", updateImageDimensions);

    return () => {
      window.removeEventListener("resize", updateImageDimensions);
    };
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      const updateImageDimensions = () => {
        setImageDimensions({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      };

      updateImageDimensions();
      window.addEventListener("resize", updateImageDimensions);

      return () => {
        window.removeEventListener("resize", updateImageDimensions);
      };
    }
  }, []);

  return (
    <section
      className="w-full h-svh flex flex-col items-center justify-center relative"
      style={{ position: "relative" }}
    >
      {scene.dialogue.map(
        (dialogue, index) =>
          index === currentDialogueIndex && (
            <Dialogue
              key={currentDialogueIndex}
              dialogue={dialogue}
              onClose={() => {
                if (currentDialogueIndex < 1) {
                  setCurrentDialogueIndex(currentDialogueIndex + 1);
                } else {
                  console.log("All dialogues are finished");
                }
              }}
            />
          )
      )}

      {isInactive &&
      bgValue != 9 &&
      bgValue != 8 &&
      bgValue != 7 &&
      bgValue != 4 ? (
        <Dialogue
          dialogue={scene.dialogue[2]}
          onClose={() => {
            setCliccable(true);
            setIsInactive(false);
          }}
        />
      ) : null}

      {bgValue === 9 ? (
        <Dialogue
          dialogue={scene.dialogue[3]}
          onClose={() => {
            setCliccable(true);
          }}
        />
      ) : null}

      {(bgValue === 5 || bgValue === 6) && (
        <Dialogue
          dialogue={scene.dialogue[4]}
          onClose={() => {
            setCliccable(true);
          }}
        />
      )}

      {bgValue === 3 && (
        <Dialogue
          dialogue={scene.dialogue[5]}
          onClose={() => {
            setCliccable(true);
          }}
        />
      )}

      {correctCode ? (
        <Button classes="absolute bottom-2 left-2" onClick={handleNavigate}>
          Vai Avanti
        </Button>
      ) : (
        <Button classes="absolute bottom-2 left-2" onClick={handleReset}>
          Reset
        </Button>
      )}
      {bgValue === 8 && imageRef.current && imageRef.current.getBoundingClientRect && (
        <div
          style={{
            position: "absolute",
            top: `${
              imageRef.current.getBoundingClientRect().top +
              (217 / 1080) * imageRef.current.clientHeight +
              ((322 - 217) / 1080) * imageRef.current.clientHeight / 2
            }px`, // Calcola il centro verticale dell'area
            left: `${
              imageRef.current.getBoundingClientRect().left +
              (785 / 1920) * imageRef.current.clientWidth +
              ((1193 - 785) / 1920) * imageRef.current.clientWidth / 2
            }px`, // Calcola il centro orizzontale dell'area
            transform: "translate(-50%, -50%)", // Centra il div rispetto al punto calcolato
            width: `${((1193 - 785) / 1920) * imageRef.current.clientWidth}px`, // Larghezza relativa all'immagine
             // Altezza relativa all'immagine
                  }}
                  className="flex items-center justify-center z-10"
                >
                  <div className="bg-[#E4E7E6] rounded">
                  <p
                    className={`font-quantico text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-7xl ${
                    isError ? "text-red-500" : "text-black"
                    }`}
                  >
                    {codeInput}
                  </p>
                  </div>
                </div>
                )}
                <div ref={imageRef}>
                <ImageMapper
                  src={labImages[bgValue].src}
                  name="lab"
                  width={window.innerWidth > 1920 ? 1920 : window.innerWidth}
                  height={window.innerHeight}
                  parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
                  responsive={true}
                  onClick={(area, _, event) => {
            if (bgValue === 8 && event.target.tagName === "AREA") {
              handleCodeInput(area);
            } else if (area.id === "grid") {
              handleNavigate();
            } else {
              handleMapClick(area);
            }
          }}
          areas={[
            {
              id: "blue",
              shape: "poly",
              coords: [
                416, 398, 416, 326, 471, 327, 471, 387, 527, 524, 522, 541, 506,
                551, 379, 554, 366, 543, 357, 524,
              ],
              fillColor: "rgba(0, 0, 255, 0.5)",
              lineWidth: 0,
              strokeColor: "rgba(0, 0, 255, 0.5)",
              value: 2,
              disabled: bgValue >= 7,
            },
            {
              id: "yellow",
              shape: "poly",
              coords: [
                555, 536, 620, 410, 617, 348, 676, 346, 671, 358, 669, 371, 673,
                409, 730, 532, 730, 548, 723, 563, 717, 571, 705, 575, 581, 575,
                564, 568, 555, 551,
              ],
              fillColor: "rgba(255, 255, 0, 0.5)",
              lineWidth: 0,
              strokeColor: "rgba(255, 255, 0, 0.5)",
              value: 1,
              disabled: bgValue >= 7,
            },
            {
              id: "red",
              shape: "poly",
              coords: [
                761, 507, 822, 383, 818, 327, 876, 319, 873, 349, 873, 375, 871,
                388, 927, 509, 924, 529, 920, 544, 908, 551, 779, 548, 761, 537,
                756, 519,
              ],
              fillColor: "rgba(255, 0, 0, 0.5)",
              lineWidth: 0,
              strokeColor: "rgba(255, 0, 0, 0.5)",
              value: 4,
              disabled: bgValue >= 7,
            },
            {
              id: "code",
              shape: "rect",
              coords: [444, 86, 523, 181],
              fillColor: "rgba(0, 0, 0, 0.5)",
              lineWidth: 0,
              strokeColor: "rgba(0, 0, 0, 0.5)",
              value: 8,
              disabled: bgValue >= 7,
            },
            {
              id: "hint",
              shape: "rect",
              coords: [703, 190, 820, 298],
              fillColor: "rgba(0, 0, 0, 0.5)",
              lineWidth: 0,
              strokeColor: "rgba(0, 0, 0, 0.5)",
              value: 7,
              disabled: bgValue >= 7,
            },
            {
              id: "grid",
              shape: "rect",
              coords: [23, 52, 417, 240],
              fillColor: "rgba(0, 0, 0, 0.5)",
              lineWidth: 0,
              strokeColor: "rgba(0, 0, 0, 0.5)",
              disabled: !correctCode,
            },
            ...(bgValue === 8
              ? [
                  {
                    id: "1",
                    shape: "rect",
                    coords: [741, 381, 837, 476],
                    fillColor: "rgba(0, 255, 0, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 255, 0, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "2",
                    shape: "rect",
                    coords: [913, 381, 1008, 474],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "3",
                    shape: "rect",
                    coords: [1084, 379, 1177, 477],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "4",
                    shape: "rect",
                    coords: [741, 511, 839, 604],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "5",
                    shape: "rect",
                    coords: [912, 510, 1010, 608],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "6",
                    shape: "rect",
                    coords: [1083, 510, 1176, 603],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "7",
                    shape: "rect",
                    coords: [741, 637, 839, 733],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "8",
                    shape: "rect",
                    coords: [912, 640, 1010, 738],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "9",
                    shape: "rect",
                    coords: [1084, 639, 1179, 735],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "0",
                    shape: "rect",
                    coords: [915, 766, 1008, 862],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "confirm",
                    shape: "rect",
                    coords: [1081, 764, 1176, 863],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "delete",
                    shape: "rect",
                    coords: [739, 766, 839, 861],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: isError,
                  },
                  {
                    id: "schermo",
                    shape: "rect",
                    coords: [785,217,1193,322],
                    fillColor: "rgba(0, 0, 255, 0.5)",
                    lineWidth: 0,
                    strokeColor: "rgba(0, 0, 255, 0.5)",
                    disabled: false,
                  }
                ]
              : []),
          ]}
          style={{ cursor: "pointer" }}
        />
      </div>
    </section>
  );
};

export default Scena5;
