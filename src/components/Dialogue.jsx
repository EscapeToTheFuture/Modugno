import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Speaker from "./Speaker";

const Dialogue = ({ dialogue, absolute=false, classes, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (dialogue.delay) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, dialogue.delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [dialogue.delay]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  return (
    <div className={"absolute w-full h-full pb-[10svh] flex justify-center items-end " + (isVisible && "z-20")} onClick={handleClick}>
      <div
        className={`${absolute ? "absolute" : "relative"} ${classes} flex justify-center items-center mx-auto sm:mb-8 min-h-[23%] md:mb-0 lg:w-100 w-3/8 transition-transform transform ${
          isVisible ? "scale-100" : "scale-0"
        } animate-bounce-in font-inknut z-20`}
      >
        <div className="scale-100 lg:scale-200 sm:scale-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 563 145"
            width="100%"
            height="100%"
            fill="none"
          >
            <path
              fill="#D2A684"
              d="M531.198 51.587c0 28.49-116.803 51.586-260.888 51.586-144.084 0-260.888-23.096-260.888-51.587C9.422 23.097 126.226 0 270.31 0c144.085 0 260.888 23.096 260.888 51.587Z"
            />
            <path
              fill="#D2A684"
              d="M563 92.743c0 28.49-126.032 51.586-281.5 51.586C126.032 144.329 0 121.233 0 92.743s126.032-51.587 281.5-51.587c155.468 0 281.5 23.096 281.5 51.587Z"
            />
            <path
              fill="#F2CCAE"
              d="M513.514 53.689c0 26.469-108.517 47.926-242.38 47.926S28.754 80.158 28.754 53.689c0-26.47 108.517-47.927 242.38-47.927s242.38 21.457 242.38 47.927Z"
            />
            <path
              fill="#F2CCAE"
              d="M543.059 91.925c0 26.47-117.09 47.927-261.529 47.927S20 118.395 20 91.925C20 65.456 137.091 44 281.53 44c144.439 0 261.529 21.457 261.529 47.926Z"
            />
          </svg>
          <div className="animate-bounce absolute bottom-0 right-10 scale-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-800"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 16l-6-6h12l-6 6z"
            />
          </svg>
        </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center w-full">
          {dialogue.speaker && (
            <div className="absolute -top-4 left-4 lg:top-10 lg:-left-24 sm:-top-5 sm:-left-28">
              <Speaker speaker={dialogue.speaker} type={dialogue.type} />
            </div>
          )}
          <p
            className={`w-75 text-gray-800 text-center text-base text-md ${
              dialogue.text.includes("\n") ? "whitespace-pre" : ""
            }`}
          >
            {dialogue.text}
          </p>
        </div>
      </div>
    </div>
  );
};


Dialogue.propTypes = {
  dialogue: PropTypes.shape({
    speaker: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string.isRequired,
    delay: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func,
};

export default Dialogue;
