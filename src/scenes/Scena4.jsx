import { useState, useEffect} from 'react';
import { useNavigate } from "react-router";
import ImageMapper from "react-img-mapper";
import confetti from "canvas-confetti";

import Dialogue from '../components/Dialogue';
import ImpiccatoButton from '../components/ImpiccatoButton';

import cucina_lock from '@assets/images/Scena4/Cucina_lock.png';
import cucina_unlocked from '@assets/images/Scena4/Cucina_unlock.png';
import cucina_open from '@assets/images/Scena4/Cucina_open.png';
import cucina_no_bistecca from '@assets/images/Scena4/Cucina_NoBistecca.png';

import dispensaImg from '@assets/images/Scena4/Dispensa.jpg';
import tabletImg from '@assets/images/Scena4/Tablet.png';
import speaker_box_img from '@assets/images/generic/bg-button.png';

import ambientSound from '@assets/sounds/scena4/refrigerator-hum-58719.mp3';
import tablet_pop from '@assets/sounds/scena4/trimmed-pop-91931.mp3';
import frigo_locked from '@assets/sounds/scena4/door-lock-43124.mp3';
import frigo_unlock from '@assets/sounds/scena4/trim-chiavi-lucchetto-68025.mp3';
import open_dispensa from '@assets/sounds/scena4/trim-wardrobe-door-94773.mp3';
import impiccato_win from '@assets/sounds/scena4/3-up-2-89189.mp3';
import impiccato_fail from '@assets/sounds/scena4/trim-wrong-47985.mp3';
import keystroke from "@assets/sounds/generic/trim-keyboard-typing-one-short-1-292590.mp3";

import sceneBitritto from '@assets/scenesBitritto.json';

const Scena4 = () => {
    const navigate = useNavigate();
    const [dispensaOpen, setDispensaOpen] = useState(false);
    const [dispensaHint, setDispensaHint] = useState(true);
    const [impiccatoOpen, setImpiccatoOpen] = useState(false);
    // Stato dell'impiccato, può solo aumentare
    const [impiccatoState, setImpiccatoState] = useState(0);
    
    
    const [hasDogFood, setHasDogFood] = useState(localStorage.getItem("hasDogFood") === null ? false : JSON.parse(localStorage.getItem("hasDogFood")));
    const [hasDogBeef, setHasDogBeef] = useState(localStorage.getItem("hasDogBeef") === null ? false : JSON.parse(localStorage.getItem("hasDogBeef")));
    // Scritta dell'impiccato
    const [impiccatoText, setImpiccatoText] = useState(localStorage.getItem("impiccatoText") === null ? ['_', '_', '_', '_', '_', '_'] : JSON.parse(localStorage.getItem("impiccatoText")));
    
    // 0: Locked, 1: Unlocked, 2: Open, 3: Took bistecca
    // const [cucinaState, setCucinaState] = useState(hasDogBeef ? 3 : 0);
    const [cucinaState, setCucinaState] = useState(localStorage.getItem("cucinaState") === null ? (hasDogBeef ? 3 : 0) : JSON.parse(localStorage.getItem("cucinaState")));
    // Animazione del pulsante "Torna da Cujo"
    const [backAnimated, setBackAnimated] = useState(false);

    useEffect(() => {
        localStorage.setItem("impiccatoText", JSON.stringify(impiccatoText));
    }, [impiccatoText]);
    
    localStorage.setItem("hasDogFood", JSON.stringify(hasDogFood));
    localStorage.setItem("hasDogBeef", JSON.stringify(hasDogBeef));

    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [scene, setScene] = useState(hasDogBeef && !hasDogFood ? {
        "dialogue": [
            {
                "type": "speaking",
                "speaker": "Detective",
                "text": "Quella dispensa potrebbe nascondere qualcosa di utile."
            },
        ]
    } : sceneBitritto.scenes[3]);

    const showCustomDialogue = (custom_dialogue) => {
        setCurrentDialogueIndex(0);
        setScene({
            dialogue: custom_dialogue
        });
    }

    // Preload delle risorse
    const [preload, setPreload] = useState({
        "cucina" : {
            "lock": false,
            "unlocked": false,
            "open": false,
            "no_bistecca": false
        },
        "dispensa": false,
        "tablet": false,
        "impiccato": [
            false, false, false, false, false, false, false
        ]
    });

    // Gestione audio
    useEffect(() => {
        const ambientAudio = new Audio(ambientSound);
        ambientAudio.loop = true;
        ambientAudio.volume = 0.3;

        ambientAudio.play();

        return () => {
            ambientAudio.pause();
        };
    }, []);

    return (
        <div>
            {/* Dialogues */}
            {
                scene.dialogue.map((dialogue, index) => (
                    index === currentDialogueIndex && (
                        <Dialogue key={currentDialogueIndex} dialogue={dialogue} onClose={() => {
                            if (currentDialogueIndex <= scene.dialogue.length) {
                                setCurrentDialogueIndex(currentDialogueIndex + 1);
                            } else {
                                console.log('All dialogues are finished');
                            }
                        }} />
                    )
                ))
            }

            {/* ImageMapper sfondo */}
            <div className="z-0 flex flex-col justify-center items-center h-svh">
                {/* Preload */}
                {
                    !preload.cucina.lock &&
                    <img
                        src={cucina_lock}
                        alt="Cucina locked"
                        className={'img-mapper-img ' + (cucinaState !== 0 && 'hidden')}
                        style={
                            {
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '1',
                                userSelect: 'none',
                                width: '100%',
                                height: 'auto',
                            }
                        }
                    />
                }
                {
                    !preload.cucina.unlocked &&
                    <img
                        src={cucina_unlocked}
                        alt="Cucina unlocked"
                        className={'img-mapper-img ' + (cucinaState !== 1 && 'hidden')}
                        style={
                            {
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '1',
                                userSelect: 'none',
                                width: '100%',
                                height: 'auto',
                            }
                        }
                    />
                }
                {
                    !preload.cucina.open &&
                    <img
                        src={cucina_open}
                        alt="Cucina open"
                        className={'img-mapper-img ' + (cucinaState !== 2 && 'hidden')}
                        style={
                            {
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '1',
                                userSelect: 'none',
                                width: '100%',
                                height: 'auto',
                            }
                        }
                    />
                }
                {
                    !preload.cucina.no_bistecca &&
                    <img
                        src={cucina_no_bistecca}
                        alt="Cucina no bistecca"
                        className={'img-mapper-img ' + (cucinaState !== 3 && 'hidden')}
                        style={
                            {
                                position: 'absolute',
                                top: '0px',
                                left: '0px',
                                zIndex: '1',
                                userSelect: 'none',
                                width: '100%',
                                height: 'auto',
                            }
                        }
                    />
                }
                <ImageMapper
                    src={cucinaState == 0 ? cucina_lock : (cucinaState == 1 ? cucina_unlocked : cucinaState == 2 ? cucina_open : cucina_no_bistecca)}
                    name="Cucina"
                    natural
                    // Preload
                    onLoad={() => {
                        if (cucinaState === 0) {
                            setPreload({
                                ...preload,
                                "cucina": {
                                    ...preload.cucina,
                                    "lock": true
                                }
                            });
                        }
                        if (cucinaState === 1) {
                            setPreload({
                                ...preload,
                                "cucina": {
                                    ...preload.cucina,
                                    "unlocked": true
                                }
                            });
                        }
                        if (cucinaState === 2) {
                            setPreload({
                                ...preload,
                                "cucina": {
                                    ...preload.cucina,
                                    "open": true
                                }
                            });
                        }
                        if (cucinaState === 3) {
                            setPreload({
                                ...preload,
                                "cucina": {
                                    ...preload.cucina,
                                    "no_bistecca": true
                                }
                            });
                        }
                    }}
                    imgWidth={1920}
                    parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
                    responsive={true}
                    disabled={hasDogBeef && hasDogFood}
                    areas={[
                    {
                        id: "dispensa",
                        shape: "rect",
                        coords: [640, 72, 900, 290],
                        fillColor: "rgba(237, 20, 61, 0.5)",
                        lineWidth: 0,
                        strokeColor: "rgba(237, 20, 61, 0.5)",
                        active: !hasDogFood
                    },
                    {
                        id: "frigo_con_tablet",
                        shape: "rect",
                        coords: ((cucinaState != 2 ? [1510, 35, 1900, 450] : [1470, 45, 1900, 800])),
                        fillColor: "rgba(237, 20, 61, 0.5)",
                        lineWidth: 0,
                        strokeColor: "rgba(237, 20, 61, 0.5)",
                        disabled: hasDogBeef===true
                    },
                    {
                        id: "tablet",
                        shape: "rect",
                        coords: (cucinaState === 2 ? [1470, 300, 1900, 800] : [1510, 450, 1900, 800]),
                        fillColor: "rgba(42, 20, 237, 0.5)",
                        lineWidth: 0,
                        strokeColor: "rgba(20, 31, 237, 0.5)",
                        disabled: cucinaState === 2
                    }
                    ]}
                    onClick={(area) => {
                        if (area.id === 'dispensa') {
                            if (hasDogFood) {
                                console.log('You already have dog food');
                            } else {
                                setDispensaOpen(true);
                                const audio = new Audio(open_dispensa);
                                audio.volume = 0.5;
                                audio.play();
                            }
                        } else if (area.id === 'tablet') {
                        if (cucinaState === 0) {
                            // Play pop
                            const audio = new Audio(tablet_pop);
                            audio.volume = 0.5;
                            audio.play();

                            // Show custom dialogue
                            showCustomDialogue([
                                {
                                    "type": "speaking",
                                    "speaker": "Detective",
                                    "text": "Devo risolvere questo indovinello per aprire il frigo."
                                },
                            ]);
                            // Apri impiccato
                            setImpiccatoOpen(true);
                            
                            // Hide hints
                            setDispensaHint(false);
                        }
                        } else if (area.id === 'frigo_con_tablet') {
                            if (cucinaState === 1) {
                                // Apri frigo
                                setCucinaState(2);
                                // Imposta l'immagine del frigo aperto nel preload
                                setPreload({
                                    ...preload,
                                    "cucina": {
                                        ...preload.cucina,
                                        "open": true
                                    }
                                });
                                // Set cookie
                                localStorage.setItem("cucinaState", JSON.stringify(2));
                                showCustomDialogue([
                                    {
                                        "type": "speaking",
                                        "speaker": "Detective",
                                        "text": "Una bistecca! Questa mi servirà con Cujo."
                                    },
                                ]);
                                // show hints if player has not picked up dog food
                                if (!hasDogFood) {
                                    setDispensaHint(true);
                                }
                            } else if (cucinaState === 2) {
                                // Set cucina state to 3
                                setCucinaState(3);
                                // Imposta l'immagine del frigo aperto senza bistecca nel preload
                                setPreload({
                                    ...preload,
                                    "cucina": {
                                        ...preload.cucina,
                                        "no_bistecca": true
                                    }
                                });
                                // Get dog beef
                                setHasDogBeef(true);
                                // Set cookie
                                localStorage.setItem("hasDogBeef", JSON.stringify(true));
                                // Make "Torna da Cujo" button animated
                                setBackAnimated(true);
                            } else {
                                // Play locked sound
                                const audio = new Audio(frigo_locked);
                                audio.volume = 0.5;
                                audio.play();
                                showCustomDialogue([
                                    {
                                        "type": "speaking",
                                        "speaker": "Detective",
                                        "text": "Il frigo sembra bloccato... Ma quello è un tablet! Forse posso usarlo per sbloccare il frigo."
                                    },
                                ]);
                            }
                        }
                    }}
                    isMulti={false}
                />
            </div>

            {/* Impiccato */}
            {impiccatoOpen && (
                    <div className="fixed z-2 inset-0 backdrop-brightness-70 flex items-center justify-center" onClick={() => setImpiccatoOpen(false)}>
                        <div className="absolute z-4 flex flex-col items-center justify-evenly h-[65%] md:scale-65 lg:scale-100" onClick={(e) => e.stopPropagation()} >
                            <h1 className='text-[2rem] font-[Special_Elite] w-170 text-center'>Qualcosa che gli investigatori usano ogni giorno per svelare i misteri</h1>
                            <div className="flex flex-row items-center justify-between">
                                <img src={'/EscapeToTheFuture/src/assets/images/Scena4/Impiccato_cucina/' + impiccatoState + '.png'} alt={"stato " + impiccatoState + " dell'impiccato"} className='w-80' />
                                <div className="flex flex-col items-center justify-center grow-1">
                                    <div className="flex flex-row">
                                        {/* Map impiccato text char */}
                                        {impiccatoText.map((char, index) => (
                                            <div key={index} className="flex flex-col items-center justify-center">
                                                <p className='text-[2rem] font-[Special_Elite]'>{char}</p>
                                                <div className="w-10 h-1 bg-transparent"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap flex-row w-80">
                                        {/* Map buttons N E U O Z D I Z */}
                                        {['N', 'E', 'U', 'O', 'K', 'D', 'I', 'Z'].map((keycap, index) => (
                                            <ImpiccatoButton key={index} keycap={keycap} onClick={() => {
                                                // Play keystroke sound
                                                    const audio = new Audio(keystroke);
                                                    audio.volume = 0.3;
                                                    audio.play();
                                                

                                                // Check if the keycap is in the text
                                                let secret_word = "INDIZI";
                                                if( secret_word.includes(keycap) ){
                                                    // Update the impiccatoText state with its localstorage
                                                    // place the pressed key in the right place
                                                    let new_text = impiccatoText.map((char, index) => 
                                                        secret_word[index] === keycap ? keycap : char
                                                    );
                                                    setImpiccatoText(new_text);
                                                    localStorage.setItem("impiccatoText", JSON.stringify(new_text));
                                                    // Check if the word is complete
                                                    if( new_text.join('') === secret_word ){
                                                        // Set cucinaState to 1
                                                        setCucinaState(1);
                                                        // Set the image of the fridge unlocked in the preload
                                                        setPreload({
                                                            ...preload,
                                                            "cucina": {
                                                                ...preload.cucina,
                                                                "unlocked": true
                                                            }
                                                        });
                                                        // Save cucinaState in localstorage
                                                        localStorage.setItem("cucinaState", JSON.stringify(1));
                                                        // Play impiccato win sound
                                                        const audio = new Audio(impiccato_win);
                                                        audio.volume = 0.5;
                                                        audio.play();
                                                        // Wait for the sound to finish, then play the unlock sound
                                                        setTimeout(() => {
                                                            const audio = new Audio(frigo_unlock);
                                                            audio.volume = 0.5;
                                                            audio.play();
                                                        }, 1000);


                                                        // Show confetti
                                                        confetti({
                                                                particleCount: 200,
                                                                spread: 70,
                                                                origin: { y: 1 },
                                                              });

                                                        // Show custom dialogue
                                                        showCustomDialogue([
                                                            {
                                                                "type": "speaking",
                                                                "speaker": "Detective",
                                                                "text": "Il frigo si è sbloccato! Ora posso aprirlo."
                                                            },
                                                        ]);

                                                        // Wait for the dialogue to finish
                                                        setTimeout(() => {
                                                            // Close impiccato
                                                            setImpiccatoOpen(false);
                                                        }, 3000);
                                                    }
                                                } else if (impiccatoState < 6){
                                                    // Play impiccato fail sound
                                                    const audio = new Audio(impiccato_fail);
                                                    audio.volume = 0.5;
                                                    audio.play();
                                                    // Shake the tablet
                                                    
                                                    setImpiccatoState(impiccatoState + 1);
                                                } else {
                                                    // If impiccato reaches 6, go to game over
                                                    localStorage.setItem("gameover_reason", "Hai perso all'impiccato! Il frigo è rimasto chiuso e non riesci a distrarre Cujo. La parola corretta era INDIZI.");
                                                    navigate("/gameover");
                                                }
                                            }} />
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <img src={tabletImg} alt="Tablet del frigo" className='md:scale-65 lg:scale-100' />
                    </div>
                )
            }

            {/* Dispensa */}
            {
                dispensaOpen ? (
                    <div className="fixed inset-0 backdrop-brightness-70 flex items-center justify-center z-2" onClick={() => setDispensaOpen(false)}>
                        {/* Preload */}
                        {!preload.dispensa && 
                        <img
                            src={dispensaImg}
                            alt="Dispensa"
                            className={'img-mapper-img'}
                            style={
                                {
                                    position: 'absolute',
                                    zIndex: '1',
                                    userSelect: 'none',
                                    width: '55%',
                                    height: 'auto',
                                }
                            }
                        />}
                        <ImageMapper
                            src={dispensaImg}
                            name="Dispensa"
                            natural
                            onLoad={
                                () => {
                                    setPreload({
                                        ...preload,
                                        "dispensa": true
                                    });
                                }
                            }
                            imgWidth={1920 * 0.8}
                            parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth * .55}
                            responsive={true}
                            areas={[
                            {
                                id: "dog_food",
                                shape: "rect",
                                coords: [330, 435, 690, 800],
                                fillColor: "rgba(237, 20, 61, 0.5)",
                                lineWidth: 0,
                                strokeColor: "rgba(237, 20, 61, 0.5)",
                            },
                            {
                                id: "other",
                                shape: "poly",
                                coords: [
                                    330, 65, 
                                    330, 435,
                                    690, 435,
                                    690, 800,
                                    1060, 800,
                                    1060, 65, 
                                ],
                                fillColor: "rgba(20, 237, 24, 0.5)",
                                lineWidth: 0,
                                strokeColor: "rgba(42, 237, 20, 0.5)",
                            }
                            ]}
                            onClick={(area, index, e) => {
                                e.stopPropagation()
                                if (area.id === 'dog_food') {
                                    setHasDogFood(true);
                                    // Set cookie
                                    localStorage.setItem("hasDogFood", JSON.stringify(true));
                                    setDispensaOpen(false);
                                    // Dialogo croccantini
                                    showCustomDialogue([
                                        {
                                            "type": "speaking",
                                            "speaker": "Detective",
                                            "text": "Forse questi piaceranno a Cujo."
                                        },
                                    ]);
                                } else if (area.id === 'other') {
                                    showCustomDialogue([
                                        {
                                            "type": "speaking",
                                            "speaker": "Detective",
                                            "text": "Questo non mi serve."
                                        },
                                    ]);
                                }
                            }}
                            isMulti={false}
                        />
                    </div>
                ) : 
                (!hasDogFood && dispensaHint) && <div className="absolute left-[33%] top-[10%] scale-80 xl:left-[37%] xl:top-[13%] lg:top-[18%] lg:left-[35%] pointer-events-none z-2">
                    <svg width="100" height="100">
                        <circle cx="50" cy="50" r="40" fill="#5c5c5c75">
                            <animate
                                attributeName="r"
                                values="40;45;40"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                </div>
            }

            {/* Tablet del frigo */}



            {/* Back button */}
            <button onClick={() => { navigate("/scena3");}}>
                <div className={"absolute bottom-[7%] left-[2%] z-2 cursor-pointer" + (backAnimated && " animate-bounce")}>
                    <div>
                        <img src={ speaker_box_img } alt=''/>
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center">
                        <p className={"text-[1.5rem] font-bold text-black"}>Torna da Cujo</p>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default Scena4;