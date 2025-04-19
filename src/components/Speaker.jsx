import speaker_box_img from "@assets/images/generic/bg-button.png";
import PropTypes from "prop-types";

const Speaker = ({ speaker, type }) => {
  return (
    <div
      className={
        "" +
        (type == "hint"
          ? "relative right-20 bottom-3"
          : "relative -left-20 -top-3 scale-90 md:-left-0 md:-top-10 md:scale-110")
      }
    >
      {type == "hint" ? (
        <div>
          <img src={speaker_box_img} alt="" className="-rotate-10 w-3/2" />
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="172"
          height="64"
          fill="none"
        >
          <path
            fill="#0D193F"
            stroke="#02062A"
            strokeWidth="5"
            d="M168.927 17.168c.664 2.752-.322 6.075-3.614 9.892-3.267 3.789-8.528 7.72-15.515 11.52-13.947 7.587-34.268 14.384-57.647 18.506C68.77 61.21 46.963 61.84 30.64 59.59c-8.176-1.126-14.828-2.956-19.582-5.33-4.792-2.393-7.236-5.11-7.9-7.863-.665-2.752.321-6.075 3.613-9.892 3.267-3.789 8.529-7.72 15.515-11.52C36.233 17.398 56.554 10.601 79.933 6.48c23.38-4.122 45.189-4.754 61.511-2.504 8.176 1.126 14.828 2.956 19.582 5.33 4.792 2.393 7.236 5.11 7.901 7.863Z"
          />
        </svg>
      )}
      <div className="absolute inset-0 flex justify-center items-center transform -rotate-9">
        <p
          className={
            "text-sm md:text-base lg:text-lg font-bold " +
            (type == "hint" ? "text-black" : "text-white")
          }
        >
          {speaker}
        </p>
      </div>
    </div>
  );
};
Speaker.propTypes = {
  speaker: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Speaker;
