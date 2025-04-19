import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { useState, useEffect } from "react";

import gameover_sound from "@assets/sounds/gameover/videogame-death-sound-43894.mp3";

const GameOver = () => {
  const navigate = useNavigate();
  // Play the game over sound
  const audio = new Audio(gameover_sound);
  audio.volume = 0.5;
  audio.play();

  const [reason, setReason] = useState("Hai perso!");
  useEffect(() => {
    setReason(localStorage.getItem("gameover_reason") != null ? localStorage.getItem("gameover_reason") : "Hai perso!");
  }, [localStorage.getItem("gameover_reason")]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url(../images/bg-splash.webp)] bg-center bg-clip-border bg-cover bg-origin-border bg-no-repeat">
      <div className="backdrop-brightness-50 h-full w-full flex flex-col items-center justify-center">
        <h1 className="2xl:w-1/2 md:w-2/3 w-2/3 text-5xl md:text-7xl xl:text-8xl font-bold text-center select-none font-elite text-orange-600 z-1">
          Game over!
        </h1>
        <h2 className="font-elite text-3xl md:text-3xl xl:text-4xl z-1 text-white select-none w-300 text-center">
          {reason}
        </h2>
        <Button
          onClick={async () => {
            // Stop all playing sounds
            const audios = document.querySelectorAll("audio");
            audios.forEach((audio) => {
              audio.pause();
              audio.currentTime = 0;
            });

            navigate("/");
          }}
        >
          RIPROVA
        </Button>
      </div>
    </div>
  );
};
GameOver.propTypes = {
  reason: PropTypes.string.isRequired,
  backgroundImg: PropTypes.string,
};

export default GameOver;
