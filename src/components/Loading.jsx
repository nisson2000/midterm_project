import { FadeLoader } from "react-spinners";

function LoadingScreen() {
    return (
        <div className="flex flex-col justify-center items-center text-center">
            <FadeLoader color="black" size={10} />
        </div>
    );
}

export default LoadingScreen;
