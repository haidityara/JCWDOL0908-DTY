import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Loader = () => {
  const loader = useSelector((state) => state.loader);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (loader.isLoading) {
      setIsLoading(true);
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loader.isLoading]);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75 z-50 flex justify-center items-center flex-col">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Loader;
