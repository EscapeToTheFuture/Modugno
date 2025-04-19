import { HashRouter, Routes, Route } from "react-router";
import RotatePhone from "./components/RotatePhone";
import { useEffect, useState } from "react";

import GameOver from "./scenes/GameOver";
import SplashScreen from "./scenes/SplashScreen";

import Scena1 from "./scenes/Scena1";
import Scena2 from "./scenes/Scena2";
import Scena3 from "./scenes/Scena3";
import Scena4 from "./scenes/Scena4";
import Scena5 from "./scenes/Scena5";
import Scena6 from "./scenes/Scena6";
import Win from "./scenes/Win";

const Modugno = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  // Installa PWA
  useEffect(() => {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Attendere un breve tempo prima di mostrare il prompt
      setTimeout(() => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice
            .then((choiceResult) => {
              if (choiceResult.outcome === "accepted") {
                console.log("Utente ha accettato l'installazione");
              } else {
                console.log("Utente ha rifiutato l'installazione");
              }
              deferredPrompt = null;
            });
        }
      }, 1000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);


  return (
    <>
      {isPortrait ? (
        <RotatePhone />
      ) : (
        <HashRouter>
          <Routes>
            <Route path="/" element={<SplashScreen location={'Dante Alighieri Modugno'} title={'ESCAPE ROOM: IL PARCO'} />} />
            <Route path="/scena1" element={<Scena1/>} />
            <Route path="/scena2" element={<Scena2/>} />
            <Route path="/scena3" element={<Scena3/>} />
            <Route path="/scena4" element={<Scena4/>} />
            <Route path="/scena5" element={<Scena5/>} />
            <Route path="/scena6" element={<Scena6/>} />
            {/* Game over */}
            <Route path="*" element={<GameOver/>} />
            {/* Win */}
            <Route path="/win" element={<Win/>} />
          </Routes>
        </HashRouter>
      )}
    </>
  );
};

export default Modugno;
