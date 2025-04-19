/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "@components/Button";

import backgroundImage from "@assets/images/Scena5/Il parco comunale.jpg";

const SplashScreen = ({ title, location }) => {
  const [hasRequestedFullscreen, setHasRequestedFullscreen] = useState(false);


  const navigate = useNavigate();
  // reset localstorage
  localStorage.clear();

  useEffect(() => {
    if (hasRequestedFullscreen) return;

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setHasRequestedFullscreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };


  }, [hasRequestedFullscreen]);
  

  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-2 md:gap-10 h-svh bg-center bg-clip-border bg-cover bg-origin-border bg-no-repeat gap-auto"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <h1 className="2xl:w-1/2 md:w-2/3 w-2/3 text-5xl md:text-5xl xl:text-8xl font-bold text-center select-none font-elite text-cyan-400 z-1">
        {title}
      </h1>
      <div className="flex items-end justify-center gap-1">
        <h3 className="font-elite text-3xl md:text-3xl xl:text-6xl z-1 text-white select-none">
          {location}
        </h3>
      </div>
      <Button
        onClick={async () => {
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
