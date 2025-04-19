import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "@components/Button";
import ampolla from "@assets/images/ampolla.png";

import ambientSound from "@assets/sounds/splashscreen/horror-lightning-strike-247744.mp3";
import startSound from "@assets/sounds/splashscreen/among-us-sound-157106.mp3";
import bubblesSound from "@assets/sounds/splashscreen/water-bubbles-257594.mp3";

const SplashScreen = ({ title, location }) => {
  const [hasRequestedFullscreen, setHasRequestedFullscreen] = useState(false);

  // Gestione audio
  // Ogni audio della scena fa parte di questo array di oggetti.
  // Ogni oggetto è composto da Nome e Playing(true/false)
  const [playing, setPlaying] = useState({
    "ambient": {
      playing: false,
      player: null
    },
    "start": { 
      playing: false,
      player: null
    },
    "bubbles": { 
      playing: false,
      player: null
    },
  });

  const navigate = useNavigate();
  // reset localstorage
  localStorage.clear();

  useEffect(() => {
    if (hasRequestedFullscreen) return;
    // Reset playing
    setPlaying({
        "ambient": {
          player: new Audio(ambientSound),
          playing: false,
        },
        "start": { 
          player: new Audio(startSound),
          playing: false 
        },
        "bubbles": { 
          player: new Audio(bubblesSound),
          playing: false 
        },
      });

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setHasRequestedFullscreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    // Richiedi permesso per riproduzione audio
    document.addEventListener("click", async () => {
      try {
        await document.body.requestFullscreen();
      } catch (err) {
        console.error(err.name, err.message);
      }
    });

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };


  }, [hasRequestedFullscreen]);
  

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 md:gap-10 h-svh bg-[url(../images/bg-splash.webp)] bg-center bg-clip-border bg-cover bg-origin-border bg-no-repeat gap-auto">
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Bottone per consentire audio */}
      {!playing["ambient"].playing && (
        <div className="absolute bottom-0 right-0 scale-85 lg:scale-100">
          <Button
            onClick={async () => {
              
              if (!playing["ambient"].playing) {
                const ambient = playing["ambient"].player;
                ambient.loop = true;
                // Volume 60
                ambient.volume = 0.5;
                ambient.play();
                setPlaying((prev) => ({
                  ...prev,
                  ambient: { ...prev["ambient"], playing: true }
                }));
              } else {
                const ambient = playing["ambient"].player;
                ambient.pause();
                setPlaying((prev) => ({
                  ...prev,
                  ambient: { ...prev["ambient"], playing: false }
                }));
              }
            }}
          >
            <div className="flex flex-row items-center justify-start ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-16 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 5.25L6.75 9H4.5a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h2.25l4.5 3.75V5.25z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 8.25a6.75 6.75 0 010 9.5m2.25-11.75a9.75 9.75 0 010 13.75"
                />
              </svg>
            </div>
          </Button>
        </div>
      )}

      <h1 className="2xl:w-1/2 md:w-2/3 w-2/3 text-5xl md:text-5xl xl:text-8xl font-bold text-center select-none font-elite text-orange-600 z-1">
        {title}
      </h1>
      <div className="flex items-end justify-center gap-1">
        <h3 className="font-elite text-3xl md:text-3xl xl:text-6xl z-1 text-white select-none">
          {location}
        </h3>
        <img
          onClick={async () => {
            if (!playing["bubbles"].playing) {
              const bubbles = playing["bubbles"].player;
              bubbles.play();
              setPlaying((prev) => ({
                ...prev,
                bubbles: { ...prev["bubbles"], playing: true }
              }));
              setTimeout(() => {
                bubbles.pause();
                setPlaying((prev) => ({
                  ...prev,
                  bubbles: { ...prev["bubbles"], playing: false }
                }));
              }, 3000);
            }
          }}
          src={ampolla}
          alt="ampolla"
          className="select-none h-10 xl:h-16 z-1 transition-transform duration-300 ease-in-out transform hover:scale-120 animate-shake"
        />
      </div>
      <Button
        onClick={async () => {
          // Carica e riproduci il suono di inizio
          if (!playing["start"].playing) {
            const start = playing["start"].player;
            start.play();
            setPlaying((prev) => ({
              ...prev,
              start: { ...prev["start"], playing: true }
            }));
          }
          // Ferma ogni suono
          for (const sound in playing) {
            if (playing[sound].playing) {
              const audio = playing[sound].player;
              audio.pause();
              setPlaying((prev) => ({
                ...prev,
                [sound]: { ...prev[sound], playing: false }
              }));
            }
          }

          if (!hasRequestedFullscreen) {
            try {
              await document.body.requestFullscreen();
            } catch (err) {
              console.error(err.name, err.message);
            }
          }
          navigate("/scena1");
        }}
      >
        INIZIA
      </Button>
    </div>
  );
};

export default SplashScreen;
