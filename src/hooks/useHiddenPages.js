import { useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../Contexts/Contexts";

function useHiddenPages() {
  const navigate = useNavigate();
  const [ctrlPressed, setCtrlPressed] = useState({
    ctrl: false,
    z: false,
  });
  const {setIsHidden,setDraftData}=useContext(MyContext)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 17) {
        // Ctrl key is pressed
        setCtrlPressed((prevState) => ({
          ...prevState,
          ctrl: true,
        }));
      } else if (e.keyCode === 90) {
        setCtrlPressed((prevState) => ({
          ...prevState,
          z: true,
        }));
      } else if (ctrlPressed.ctrl && ctrlPressed.z && e.keyCode === 77) {
        // Ctrl is pressed, and 'M' key is pressed
        setCtrlPressed({
          ctrl: false,
          z: false,
        });
        setIsHidden(true);
        setDraftData(null)
        navigate("/purchase");
      }
    };

    const handleKeyUp = (e) => {
      if (e.keyCode === 17) {
        // Ctrl key is released
        setCtrlPressed((prevState) => ({
          ...prevState,
          ctrl: false,
        }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [ctrlPressed]);

  return ctrlPressed;
}

export default useHiddenPages;
