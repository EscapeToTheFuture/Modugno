import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import ImageMapper from "react-img-mapper";
import Dialogue from '../components/Dialogue';
import confetti from "canvas-confetti";

import cujoImg from '@assets/images/Scena3/Cujo.png';
import cujoWoof from "@assets/sounds/scena6/dachshund-play-growling-34014.mp3";
import ingressoCucina from '@assets/images/Scena3/Corridoio_verde.png';

import ambientSound from '@assets/sounds/scena3/Wandering - The City Pt. 2 ｜ Hive City Ambient Music [xSQBtGKsSE8].mp3';

import sceneBitritto from '@assets/scenesBitritto.json';


const Scena3 = () => {
    const [scene, setScene] = useState(sceneBitritto.scenes[2]);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const hasDogBeef = JSON.parse(localStorage.getItem('hasDogBeef'));
    const hasDogFood = JSON.parse(localStorage.getItem('hasDogFood'));

    const [dogDefeated, setDogDefeated] = useState(false);

    // Preload handling

    const [cujoImgLoaded, setCujoImgLoaded] = useState(false);
    const [ingressoCucinaLoaded, setIngressoCucinaLoaded] = useState(false);

    // Gestione suono cujo rabbioso
    const [cujoGrowling, setCujoGrowling] = useState(new Audio(cujoWoof));

    // Gestione audio sottofondo
    useEffect(() => {
        const ambientAudio = new Audio(ambientSound);
        ambientAudio.loop = true;
        ambientAudio.volume = 0.6;

        ambientAudio.play();


        return () => {
            ambientAudio.pause();
        };
    }, [cujoGrowling]);
    
    const navigate = useNavigate();
    return (
        <div>
            {/* Dialogues */}
            {
                scene.dialogue.map((dialogue, index) => (
                    index === currentDialogueIndex && (
                        <Dialogue key={currentDialogueIndex} dialogue={dialogue} onClose={() => {

                            if (hasDogBeef === true) {
                                // Carica il dialogo della bistecca Scena 6
                                setScene(sceneBitritto.scenes[6]);
                            } else if (hasDogFood === true) {
                                // Carica il dialogo dei croccantini Scena 4
                                setScene(sceneBitritto.scenes[4]);
                            }

                            if (currentDialogueIndex < scene.dialogue.length - 1) {
                                setCurrentDialogueIndex(currentDialogueIndex + 1);
                            } else {
                                // All dialogues are finished, show the button to go to the next scene
                                console.log('All dialogues are finished');

                                // If dog has beef, make dog disappear
                                if (hasDogBeef === true) {
                                    setDogDefeated(true);
                                    // stop growling
                                    cujoGrowling.pause();
                                    confetti({
                                        particleCount: 200,
                                        spread: 70,
                                        origin: { y: 1 },
                                    })
                                }
                            }
                        }} />
                    )
                ))
            }

            {/* ImageMapper sfondo */}
            <div className="flex flex-col justify-center items-center h-svh">
                {
                    !ingressoCucinaLoaded &&
                    <img
                        src={ingressoCucina}
                        alt="Ingresso cucina"
                        className='img-mapper-img'
                        style={
                            {
                                position: 'absolute',
                                left: '0px',
                                zIndex: '1',
                                userSelect: 'none',
                                width: window.innerWidth > 1920 ? 1920 : window.innerWidth,
                                height: 'auto',
                            }
                        }
                    />
                }
                <ImageMapper
                    src={ingressoCucina}
                    onLoad={() => {
                        setIngressoCucinaLoaded(true);
                        console.log('ingressoCucina loaded. Time: ', new Date().getTime());
                        
                    }}
                    name="Ingresso cucina"
                    natural
                    imgWidth={1920}
                    parentWidth={window.innerWidth > 1920 ? 1920 : window.innerWidth}
                    disabled={(currentDialogueIndex < scene.dialogue.length - 1)}
                    responsive={true}
                    areas={[
                    {
                        id: "porta_cucina",
                        shape: "rect",
                        coords: [206, 256, 580, 950],
                        fillColor: "rgba(237, 20, 61, 0.5)",
                        lineWidth: 0,
                        strokeColor: "rgba(237, 20, 61, 0.5)",
                        disabled: (hasDogBeef && hasDogFood),
                    },
                    {
                        id: "porta_laboratorio",
                        disabled: !dogDefeated,
                        shape: "rect",
                        coords: [852, 314, 1080, 793],
                        fillColor: "rgba(237, 20, 208, 0.5)",
                        lineWidth: 0,
                        strokeColor: "rgba(237, 20, 222, 0.5)",
                    }
                    ]}
                    onChange={(area) => {
                        if (area.id === 'porta_cucina') {
                            // Stop the growling sound
                            cujoGrowling.pause();
                            navigate('/scena4');
                        } else if (area.id === 'porta_laboratorio') {
                            navigate('/scena5');
                        }
                    }}
                    isMulti={false}
                />
            </div>

            {/* ImageMapper Cujo */}
            <div className={"absolute w-full flex justify-center top-[44svh]" + (dogDefeated ? ' hidden' : '')}>
                {
                    !cujoImgLoaded &&
                    <img
                        src={cujoImg}
                        alt="Cujo"
                        className='img-mapper-img'
                        style={
                            {
                                position: 'absolute',
                                zIndex: '1',
                                userSelect: 'none',
                                height: 'auto',
                                width: window.innerWidth * 0.25,
                            }
                        }
                    />
                }
                <ImageMapper
                    src={cujoImg}
                    name="Cujo"
                    natural
                    onLoad={() => {
                        setCujoImgLoaded(true);
                    }}
                    parentWidth={window.innerWidth * 0.25}
                    disabled={currentDialogueIndex < scene.dialogue.length - 1}
                    responsive={true}
                    areas={[
                        {
                            id: "cane",
                            shape: "rect",
                            coords: [75, 50, 350, 400],
                            fillColor: "rgba(20, 49, 237, 0.5)",
                            lineWidth: 0,
                            strokeColor: "rgba(20, 20, 237, 0.5)",
                        },
                    ]}
                    onChange={() => {
                        // Play the sound of the dog growling if not already playing
                        if (cujoGrowling.paused) {
                            cujoGrowling.currentTime = 0;
                            cujoGrowling.play();
                            cujoGrowling.loop = true;
                        }
                        
                        setCurrentDialogueIndex(0);
                    }}
                    isMulti={false}
                />
            </div>
        </div>
    );
};

export default Scena3;