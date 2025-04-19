import { useCallback, useEffect, useState } from "react";
import buttonArrow from "@assets/images/generic/buttonArrow.png";
import foresta from "@assets/images/Scena2/foresta.png";
import alberoMagico from "@assets/images/Scena2/alberoMagico.jpg";

import ambientSound from "@assets/sounds/scena2/forest-ambience-296528.mp3";
import doorOpen from "@assets/sounds/scena2/squeaky-door-open-317165.mp3";
import successSound from "@assets/sounds/scena4/3-up-2-89189.mp3";

import Button from "@components/Button";
import Dialogue from "../components/Dialogue";
import ImageMapper from "react-img-mapper";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router";

const Scena2 = () => {
  const [showHint, setShowHint] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [load, setLoad] = useState([false, false]);
  const [cliccable, setCliccable] = useState(false);
  const navigate = useNavigate();
  
  // Gestione audio
  const [playing, setPlaying] = useState({
    ambient: {
      playing: false,
    },
  });

  useEffect(() => {
    // Initialize audio players
    const ambientAudio = new Audio(ambientSound);
    setPlaying({
      ambient: {
        player: ambientAudio,
        playing: false,
      },
    });

    ambientAudio.loop = true;
    ambientAudio.volume = 0.6;
    ambientAudio.play();

    const resetTimer = () => {
      if (!showHint && !isWin && !isError) {
        setShowHint(false);
        clearTimeout(timer);
        timer = setTimeout(() => {
          !isError && !isWin && setShowHint(true);
        }, 7000);
      }
    };

    let timer = setTimeout(() => {
      !isError && !isWin && setShowHint(true);
    }, 7000);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      ambientAudio.pause();
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [showHint, isWin, isError]);

  const handleAreaClick = useCallback(
    (area) => {
      if (area.id === "albero1") {
        setIsError(true);
      } else if (area.id === "albero2") {
        setIsWin(true);
      } else if (area.id === "albero3") {
        setIsError(true);
      }
    },
    [showHint]
  );

  useEffect(() => {
    if (isWin) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 1 },
      });
      const successAudio = new Audio(successSound);
      successAudio.play();
    }
  }, [isWin]);

  return (
    <section className="w-full h-svh flex flex-col items-center justify-center relative">
      <Button classes="absolute top-2" noAnimation stretch>
        Trova il laboratorio
      </Button>
      <img
        src={alberoMagico}
        alt="Albero magico"
        className="absolute aspect-video hidden"
      />
      {!showHint && isWin && (
        <>
          {window.innerWidth <= 900 && <svg
            width="100"
            height="100"
            className="absolute z-20 top-64"
            onClick={() => {
              if (cliccable) {
                const doorAudio = new Audio(doorOpen);
                doorAudio.play();

                setTimeout(() => navigate("/scena3"), 1500);
              }
            }}
          >
            <circle cx="50" cy="50" r="30" fill="#ed143d80">
              <animate
                attributeName="r"
                values="20;25;20"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>}
          <ImageMapper
            src={alberoMagico}
            name="Albero magico"
            natural
            imgWidth={1920}
            parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
            responsive={true}
            disabled={!cliccable}
            areas={[
              {
                id: "albero",
                shape: "circle",
                coords: [992, 852, 73],
                fillColor: "rgba(237, 20, 61, 0.5)",
                lineWidth: 0,
                strokeColor: "rgba(237, 20, 61, 0.5)",
              },
            ]}
            imgProps={{ className: "sm:-translate-y-22" }}
            canvasProps={{ className: "sm:-translate-y-22" }}
            onChange={() => {
              if (cliccable) {
                const doorAudio = new Audio(doorOpen);
                doorAudio.play();

                setTimeout(() => navigate("/scena3"), 1500);
              }
            }}
            isMulti={false}
            onLoad={() => setLoad([true, true])}
          />
          {!load[1] && (
            <img
              src={alberoMagico}
              alt="Albero magico"
              className={"select-none "}
            />
          )}
        </>
      )}
      {!isWin && (
        <ImageMapper
          src={foresta}
          name="La foresta"
          width={window.innerWidth > 1920 ? 1920 : window.innerWidth}
          height={window.innerHeight}
          parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
          responsive={true}
          areaProps={{ className: "animate-pulse" }}
          disabled={showHint}
          areas={[
            {
              id: "albero1",
              shape: "poly",
              coords: [
                253, 802, 254, 529, 212, 460, 83, 429, 7, 365, 14, 221, 95, 151,
                173, 104, 268, 36, 410, 7, 538, 73, 546, 134, 529, 231, 488,
                319, 463, 398, 417, 504, 407, 787, 363, 795,
              ],
              fillColor: "rgba(255, 255, 255, 0.2)",
              lineWidth: 0,
              strokeColor: "rgba(255, 255, 255, 0)",
            },
            {
              id: "albero2",
              shape: "poly",
              coords: [
                855, 741, 823, 517, 709, 476, 497, 393, 488, 334, 527, 258, 544,
                154, 575, 0, 1372, 0, 1423, 244, 1355, 393, 1158, 498, 1091,
                571, 1055, 702, 941, 744,
              ],
              fillColor: "rgba(255, 255, 255, 0.2)",
              lineWidth: 0,
              strokeColor: "rgba(255, 255, 255, 0)",
            },
            {
              id: "albero3",
              shape: "poly",
              coords: [
                1491, 763, 1503, 426, 1487, 324, 1416, 302, 1428, 251, 1382, 3,
                1844, 0, 1895, 210, 1852, 341, 1655, 405, 1632, 621, 1684, 768,
              ],
              fillColor: "rgba(255, 255, 255, 0.2)",
              lineWidth: 0,
              strokeColor: "rgba(255, 255, 255, 0)",
            },
          ]}
          onChange={handleAreaClick}
          onLoad={() => setLoad([true, false])}
          isMulti={false}
        />
      )}

      {!load[0] && (
        <img
          src={foresta}
          alt="La foresta"
          className={"select-none " + (isWin ? "hidden" : "")}
        />
      )}

      {!showHint ? (
        <>
          {!isError && !isWin && (
            <div className="z-10">
              <img
                src={buttonArrow}
                alt="Scegli questo albero"
                className="absolute w-14 select-none left-24 lg:left-48 xl:left-72 lg:w-20 bottom-8 hover:scale-120 transition-all duration-300 animate-bounce hover:animate-shake"
                onClick={() => !showHint && setIsError(true)}
              />
              <img
                src={buttonArrow}
                alt="Scegli questo albero"
                className="absolute w-14 lg:w-20 select-none bottom-8 hover:scale-120 transition-all duration-300 animate-bounce hover:animate-shake"
                onClick={() => !showHint && setIsWin(true)}
              />
              <img
                src={buttonArrow}
                alt="Scegli questo albero"
                className="absolute w-14 right-24 select-none xl:right-72 lg:right-48 lg:w-20 bottom-8 hover:scale-120 transition-all duration-300 animate-bounce hover:animate-shake"
                onClick={() => !showHint && setIsError(true)}
              />
            </div>
          )}
        </>
      ) : (
        <Dialogue
          absolute
          classes="bottom-10"
          dialogue={{
            speaker: "Suggerimento",
            text: "Trova l'albero che tende a brillare,\nquando il sole inizia a calare.",
          }}
          onClose={() => setShowHint(false)}
        />
      )}

      {isError && (
        <Dialogue
          absolute
          classes="bottom-10"
          dialogue={{
            speaker: "Detective",
            text: "Oh no! Questo albero non sembra nascondere niente di interessante.",
          }}
          onClose={() => {
            setShowHint(false);
            setIsError(false);
          }}
        />
      )}
      {isWin && (
        <Dialogue
          absolute
          classes="bottom-10"
          dialogue={{
            speaker: "Detective",
            text: "Ecco! Questo sembra essere l'ingresso al laboratorio.",
          }}
          onClose={() => {
            setCliccable(true);
          }}
        />
      )}
    </section>
  );
};

export default Scena2;
