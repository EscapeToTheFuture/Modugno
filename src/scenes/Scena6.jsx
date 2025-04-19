import { useEffect, useState } from "react";
import ImageMapper from "react-img-mapper";
import Button from "../components/Button";

import scena6A from "@assets/images/Scena6/enricoSvenuto.png";
import scena6B from "@assets/images/Scena6/magoPdor.png";
import prigione from "@assets/images/Scena6/prigione.png";
import enricoScappato from "@assets/images/Scena6/enricoScappato.png";
import cagnolino from "@assets/images/Scena6/cagnolino.png";
import borsa from "@assets/images/Scena6/borsa.png";

import enrico_russa from "@assets/sounds/scena6/male-snore-1-29322.mp3";
import pdor_woosh from "@assets/sounds/scena6/fantasy-whoosh-intense-fast-228315.mp3";
import cane_rabbioso from "@assets/woof.mp3";
import pdor_busted from "@assets/sounds/scena6/trim-police-siren-sound-effect-317645.mp3";

import chiave_rotta from "@assets/sounds/scena6/broken-bottle-191998.mp3";
import ketchup from "@assets/sounds/scena6/cartoon-splat-6086.mp3";
import pozione from "@assets/sounds/scena6/magical-spell-cast-190272.mp3";
import jail_door from "@assets/sounds/scena6/jaildoorclose-6173.mp3";
import pdor_evil from "@assets/sounds/scena6/evil-laugh-21137.mp3";
import stanza_ansia from "@assets/sounds/scena7/dungeon-sound-effect-240254.mp3";

import Dialogue from "@components/Dialogue";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router";

function itemToDialogue(itemSelected) {
  switch (itemSelected) {
    case "Martello":
      return "Provando a rompere la serratura... scatta un allarme, attirando l'attenzione di Pdor.";
    case "Ketchup":
      return "Il detective versa il ketchup su di sè fingendo una ferita. Pdor lo scopre subito.";
    case "Chiave":
      return "La chiave si spezza nella serratura, rendendo impossibile aprirla.";
    case "Invisibilità":
      return "Il detective indossa il mantello dell'invisibilità e riesce a scappare.";
  }
}

const Scena6 = () => {
  const navigate = useNavigate();
  const [hasDogFood, setHasDogFood] = useState(
    JSON.parse(localStorage.getItem("hasDogFood")) || false
  );
  const [showHint, setShowHint] = useState(false);
  const [dogClicked, setDogClicked] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showBorsa, setShowBorsa] = useState([false, false]);
  const [itemSelected, setItemSelected] = useState(null);
  const [dogAnimation, setDogAnimation] = useState(0);
  // 0: intro slide
  // 1: fine intro (salterino)
  // 2: uscita

  const [scene, setScene] = useState(0);
  // 0: enrico svenuto,
  // 1: enrico parla,
  // 2: mago pdor,
  // 3: prigione,
  // 4: enrico scappa
  // 5: cane si avvicina,
  // 6: oggetti

  const dialogues = [
    {
      speaker: "Detective",
      text: "Enrico svegliati, sono qui per salvarti!",
    },
    {
      speaker: "Enrico",
      text: "Ehm, sì, cosa?",
    },
    {
      speaker: "Mago Pdor",
      text: "Pensavi di portare via Enrico? Questo era tutto un piano… Ora sei mio prigioniero!",
    },
    {
      speaker: "Narratore",
      text: "Per fortuna, Enrico riesce a scappare.",
      delay: 800,
    },
  ];

  //per coriandoli
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  // Gestione sfx enrico russa
  // Enrico deve russare fino alla scena 4
  const [enricoSnore, setPlayEnricoSnore] = useState(new Audio(enrico_russa));
  useEffect(() => {
    if (scene < 4) {
      enricoSnore.play();
      enricoSnore.volume = 0.3;
      enricoSnore.loop = true;
    } else {
      enricoSnore.pause();
      enricoSnore.currentTime = 0;
    }
  }, [scene]);

  // Gestione sfx cane rabbioso
  // Il cane deve ringhiare da quando compare (scena 4) finché non esce di scena o non gli vengono dati i croccantini
  const [dogSound, setPlayDogSound] = useState(new Audio(cane_rabbioso));
  useEffect(() => {
    if (scene === 4 && !dogClicked) {
      dogSound.play();
      dogSound.volume = 0.5;
      dogSound.loop = false;
      dogSound.addEventListener("ended", () => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            dogSound.play();
          }
        }, Math.random() * 4000 + 2000);
      });
    } else if (hasDogFood) {
      dogSound.pause();
      dogSound.currentTime = 0;
    }
  }, [scene, dogAnimation, dogClicked, hasDogFood]);

  //Rimuovi animazione di entrata cagnolino
  useEffect(() => {
    if (scene === 4) {
      setTimeout(() => {
        setDogAnimation(1);
      }, 1500);
    }
  }, [scene]);

  //Gestione hint cagnolino salterino
  useEffect(() => {
    let hintTimeout;

    const startHintTimer = () => {
      hintTimeout = setTimeout(() => {
        setShowHint(true);
      }, 3000);
    };

    const handleUserInteraction = () => {
      clearTimeout(hintTimeout);
      setShowHint(false);
      startHintTimer();
    };

    if (scene === 4) {
      startHintTimer();
      window.addEventListener("click", handleUserInteraction);
      window.addEventListener("keydown", handleUserInteraction);
      window.addEventListener("mousemove", handleUserInteraction);
    }

    return () => {
      clearTimeout(hintTimeout);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("mousemove", handleUserInteraction);
    };
  }, [scene]);

  //Gestione zzz zzz enrico
  useEffect(() => {
    if (scene < 4) {
      const zzzShape = confetti.shapeFromText({
        text: "Z",
        scalar: 3,
        fontFamily: "Arial",
        color: "#0B1F4A",
      });
      if (zzzShape) {
        const interval = setInterval(() => {
          confetti({
            particleCount: 1,
            shapes: [zzzShape],
            scalar: 1.5, // Slightly increased scalar for larger size
            origin: {
              x: 0.2 + Math.random() * 0.1 - 0.05,
              y: 0.7 + Math.random() * 0.1 - 0.05,
            },
            startVelocity: 10,
            ticks: 300,
            gravity: 0.01,
            drift: -0.05,
            colors: ["#0B1F4A"], // Darker blue
          });
        }, 1000);
        return () => clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [scene]);

  //Gestione coriandoli e particelle
  useEffect(() => {
    if (scene == 2 || scene == 4) {
      if (scene == 2) {
        // Play pdor_woosh
        const pdorWoosh = new Audio(pdor_woosh);
        pdorWoosh.volume = 0.5;
        pdorWoosh.play();
        // wait 0.3 seconds then play pdor_evil
        setTimeout(() => {
          const pdorEvil = new Audio(pdor_evil);
          pdorEvil.volume = 0.7;
          pdorEvil.play();
        }, 300);
      }
      confetti({
        ...defaults,
        particleCount: 80,
        scalar: 1.2,
        shapes: ["star"],
        decay: 0.92,
        startVelocity: 20,
      });
      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
        decay: 0.92,
        startVelocity: 15,
      });
    }

    if (scene == 3) {
      // Play jail door sound
      const doorSound = new Audio(jail_door);
      doorSound.volume = 0.7;
      doorSound.play();
      const duration = 500;
      const interval = setInterval(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          scalar: 1.5,
          shapes: ["circle", "square", "star"],
          startVelocity: 50,
          spread: 360,
          colors: ["#0000FF", "#FF0000", "#800080", "#FF4500", "#1E90FF"],
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
      }, duration);
    }
  }, [scene]);

  // pdor busted sound
  const [pdorBusted, setPdorBusted] = useState(new Audio(pdor_busted));

  // Ambient sound (stanzaAnsia)
  const [stanzaAnsia, setStanzaAnsia] = useState(new Audio(stanza_ansia));
  useEffect(() => {
    if (scene === 4) {
      stanzaAnsia.loop = true;
      stanzaAnsia.volume = 0.4;
      stanzaAnsia.play();
    } else {
      stanzaAnsia.pause();
      stanzaAnsia.currentTime = 0;
    }
  }, [scene, stanzaAnsia]);

  return (
    <section className="w-full h-svh flex flex-col items-center justify-center relative">
      {dogAnimation == 2 && (
        <div
          className={`w-full h-full absolute z-30 animate-fade-to-white`}
        ></div>
      )}
      <img
        src={prigione}
        alt="Prigione"
        className={`w-full h-full object-contain absolute animate-slide z-10 ${
          scene < 3 ? " hidden" : ""
        }`}
        onClick={() => scene === 4 && setDogClicked(true)}
      />
      <img
        src={cagnolino}
        alt="Cagnolino"
        className={`w-full h-full object-contain absolute${
          dogAnimation == 0 ? " animate-slide-slow" : ""
        }${dogAnimation == 2 ? " animate-move-right" : ""}${
          scene < 4 ? " hidden" : ""
        }${showHint && !dogClicked ? " animate-slight-bounce" : ""}`}
      />
      <img
        src={scena6A}
        alt="Scena 6-soloEnrico"
        className={`w-full h-full object-contain${
          scene === 0 ? " animate-pulse" : ""
        }${scene >= 2 ? " hidden" : ""}`}
      />
      <img
        src={scena6B}
        alt="Scena 6-Mago"
        className={`w-full h-full object-contain${
          scene < 2 || scene === 4 ? " hidden" : ""
        }`}
      />
      <img
        src={enricoScappato}
        alt="Scena 6-EnricoScappato"
        className={`w-full h-full object-contain${
          scene !== 4 ? " hidden" : ""
        }`}
      />
      <img
        src={borsa}
        alt="Borsa oggetti"
        className="w-full h-full object-contain opacity-0 absolute -z-40"
      />

      {dialogues.map(
        (dialogue, index) =>
          index === scene && (
            <Dialogue
              key={"dialogue-" + scene}
              absolute
              classes="bottom-10"
              dialogue={dialogue}
              onClose={() => {
                setScene((prev) => prev + 1);
              }}
            />
          )
      )}

      {showBorsa[1] && (
        <>
          <Button noAnimation classes="absolute top-10 z-40">
            Scegli l'oggetto
          </Button>
          <div className="absolute z-30">
            <img
              src={borsa}
              alt="Borsa oggetti"
              className="w-full h-full object-contain absolute -z-40"
            />
            <ImageMapper
              src={borsa}
              name="Borsa porta oggetti"
              natural
              imgWidth={1920}
              parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
              responsive={true}
              disabled={!showBorsa}
              areas={[
                {
                  id: "Martello",
                  shape: "poly",
                  coords: [
                    301, 777, 335, 631, 377, 459, 360, 458, 360, 432, 332, 429,
                    316, 436, 277, 426, 299, 322, 342, 332, 349, 346, 366, 346,
                    377, 346, 391, 332, 508, 366, 533, 392, 545, 422, 542, 461,
                    525, 439, 493, 410, 471, 405, 466, 431, 457, 463, 442, 470,
                    362, 802, 347, 800, 303, 785,
                  ],
                  fillColor: "rgba(128, 128, 128, 0.5)",
                },
                {
                  id: "Ketchup",
                  shape: "poly",
                  coords: [
                    708, 773, 706, 702, 679, 668, 662, 619, 666, 565, 681, 539,
                    681, 490, 662, 465, 661, 409, 676, 351, 754, 353, 874, 349,
                    895, 448, 874, 483, 874, 512, 885, 571, 896, 607, 881, 643,
                    859, 675, 847, 700, 847, 729, 846, 770, 823, 778, 740, 778,
                  ],
                  fillColor: "rgba(128, 128, 128, 0.5)",
                },
                {
                  id: "Chiave",
                  shape: "poly",
                  coords: [
                    1105, 793, 1131, 753, 1130, 582, 1150, 580, 1157, 566, 1138,
                    544, 1159, 526, 1182, 493, 1191, 448, 1177, 407, 1140, 373,
                    1084, 356, 1035, 378, 1001, 415, 991, 451, 999, 497, 1023,
                    524, 1048, 548, 1035, 570, 1045, 578, 1062, 578, 1070, 590,
                    1069, 607, 1050, 624, 1065, 634, 1079, 649, 1070, 661, 1057,
                    673, 1057, 688, 1076, 709, 1064, 727, 1061, 748,
                  ],
                  fillColor: "rgba(128, 128, 128, 0.5)",
                },
                {
                  id: "Invisibilità",
                  shape: "poly",
                  coords: [
                    1354, 885, 1536, 885, 1575, 863, 1587, 826, 1585, 688, 1585,
                    592, 1638, 597, 1648, 585, 1634, 578, 1636, 563, 1643, 554,
                    1644, 541, 1660, 529, 1592, 522, 1590, 431, 1580, 393, 1546,
                    368, 1543, 326, 1565, 319, 1580, 280, 1575, 215, 1493, 212,
                    1331, 212, 1326, 224, 1317, 307, 1349, 322, 1353, 356, 1341,
                    380, 1309, 412, 1305, 497, 1268, 500, 1290, 514, 1275, 519,
                    1281, 529, 1268, 534, 1288, 553, 1275, 558, 1268, 571, 1314,
                    576, 1305, 799, 1312, 846, 1332, 871,
                  ],
                  fillColor: "rgba(128, 128, 128, 0.5)",
                },
              ]}
              onChange={(area) => {
                setItemSelected(area.id);
                if (area.id !== "Invisibilità") {
                  const obj_audio = new Audio(chiave_rotta);
                  if (area.id === "Chiave") {
                    // Play chiave rotta sfx
                    // Set obj_audio source to chiave rotta
                    obj_audio.src = chiave_rotta;
                  }
                  if (area.id === "Ketchup") {
                    // Play ketchup sfx
                    obj_audio.src = ketchup;
                  }
                  if (area.id === "Martello") {
                    // Play martello sfx
                    obj_audio.src = chiave_rotta;
                  }
                  obj_audio.volume = 0.7;
                  obj_audio.play();

                  // Wait for 1 second and then play busted sfx
                  setTimeout(() => {
                    // Play busted sfx
                    pdorBusted.volume = 0.7;
                    pdorBusted.play();
                  }, 1000);
                } else {
                  // Play invisibility sfx
                  const obj_audio = new Audio(pozione);
                  obj_audio.volume = 0.7;
                  obj_audio.play();
                }
                setShowBorsa([false, false]);
              }}
              isMulti={false}
            />
          </div>
        </>
      )}
      {showButton && (
        <Button
          classes="absolute bottom-16"
          onClick={() => {
            setShowBorsa([true, false]);
            setShowButton(false);
          }}
        >
          Dai croccantini
        </Button>
      )}
      {showBorsa[0] && (
        <Dialogue
          absolute
          classes="bottom-10"
          dialogue={{
            type: "narrator",
            text: "Il cagnolino ti ringrazia dei croccantini e ti porta una borsa con degli oggetti.",
          }}
          onClose={() => {
            setShowBorsa([true, true]);
          }}
        />
      )}
      {dogClicked && dogAnimation == 1 ? (
        hasDogFood ? (
          <Dialogue
            absolute
            classes="bottom-10"
            dialogue={{
              type: "speaking",
              speaker: "Detective",
              text: "Ciao cagnolino... ti piacciono i croccantini?",
            }}
            onClose={() => {
              setShowButton(true);
            }}
          />
        ) : (
          <Dialogue
            absolute
            classes="bottom-10"
            dialogue={{
              type: "speaking",
              speaker: "Detective",
              text: "Ciao cagnolino... Non ho cibo per te, mi dispiace :(",
            }}
            onClose={() => {
              setDogAnimation(2);
              // stop dogSound
              dogSound.pause();
              dogSound.currentTime = 0;
              setTimeout(() => {
                localStorage.setItem(
                  "gameover_reason",
                  JSON.stringify("Il cagnolino non poteva aiutarti senza cibo.")
                );
                navigate("/gameover");
              }, 2000);
            }}
          />
        )
      ) : null}
      {!showBorsa[1] && itemSelected != null && (
        <Dialogue
          absolute
          classes="bottom-10"
          dialogue={{
            type: "narrator",
            text: itemToDialogue(itemSelected),
          }}
          onClose={() => {
            // Pause ambient sound
            stanzaAnsia.pause();
            stanzaAnsia.currentTime = 0;
            if (itemSelected === "Invisibilità") {
              navigate("/scena7");
            } else {
              pdorBusted.pause();
              pdorBusted.currentTime = 0;
              localStorage.setItem(
                "gameover_reason",
                JSON.stringify(itemToDialogue(itemSelected))
              );
              navigate("/gameover");
            }
          }}
        />
      )}
    </section>
  );
};

export default Scena6;
