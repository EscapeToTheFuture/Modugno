import rotateGif from "@assets/images/generic/rotatePhone.GIF";

const RotatePhone = () => {
   return <div className="h-svh flex items-center justify-center flex-col">
    <img src={rotateGif} width={200} alt="Ruota il tuo dispositivo per una migliore esperienza" />
    <strong className="text-white text-center text-xl mx-10 mt-4">Ruota il tuo dispositivo per una migliore esperienza</strong>
   </div>
}

export default RotatePhone;