import React from "react";

const Button = ({ children, onClick, stretch, classes, noAnimation=false }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{backgroundSize: stretch ? "100% 82px" : "100% auto"}}
      className={`z-10 bg-[url(../images/generic/bg-button.png)] font-elite w-fit flex bg-center bg-no-repeat select-none text-black font-bold text-2xl xl:text-4xl py-6 xl:py-10 px-12 xl:px-20 ${!noAnimation && "hover:cursor-pointer hover:-rotate-5 hover:scale-110 duration-600 hover:transition-transform"} ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${classes} duration-1000`}
    >
      {children}
    </button>
  );
};

export default Button;
