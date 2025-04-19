import ReactFlipCard from "reactjs-flip-card";
import front from "../assets/images/Scena1/Card1.png";
import back from "../assets/images/Scena1/Card2.png";

const Card = () => {
  return (
    <ReactFlipCard
    flipTrigger="onClick"
    containerStyle={{ width: "100%", height: "100%" }}
      frontComponent={<img src={back} alt="Alberi" />}
      backComponent={<img src={front} alt="Alberi" />}
    />
  );
};

export default Card;
