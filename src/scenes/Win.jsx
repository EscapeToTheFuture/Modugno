import { useNavigate } from "react-router";
import Button from '../components/Button';
import confetti from "canvas-confetti";

import background from "@assets/images/gameover/Il parco comunale - GAME OVER.jpg";

const Win = () => {
    // Coriandoli
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    };
    confetti({
        ...defaults,
        particleCount: 80,
        scalar: 1.2,
        shapes: ["star"],
        decay: 0.92,
        startVelocity: 20,
    });

    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-center bg-clip-border bg-cover bg-origin-border bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
            <div className="backdrop-brightness-20 h-full w-full flex flex-col items-center justify-evenly">
                <h1 className="2xl:w-1/2 md:w-2/3 w-2/3 text-5xl md:text-7xl xl:text-8xl font-bold text-center select-none font-elite text-blue-600 z-1" >
                    Missione conclusa!
                </h1>
                <h2 className="font-elite text-3xl md:text-3xl xl:text-4xl z-1 text-white select-none w-300 text-center">La tua avventura nel parco è terminata</h2>
                <Button
                    onClick={async () => {
                        navigate("/")
                    }}
                >Gioca ancora</Button>
            </div>
        </div>
    );
};

export default Win;