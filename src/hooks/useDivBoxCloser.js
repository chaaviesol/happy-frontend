import { useEffect, useRef, useCallback } from "react";

const useDivBoxCloser = (elementRefs, functionsToExecute) => {
  const closeBoxesRef = useRef(null);

  const closeBoxes = useCallback((event) => {
    if (elementRefs.every((ref) => !ref.current?.contains(event.target))) {
      functionsToExecute.forEach((fn) => fn());
    }
  }, [elementRefs, functionsToExecute]);

  useEffect(() => {
    closeBoxesRef.current = closeBoxes;
  }, [closeBoxes]);

  useEffect(() => {
    const handleBodyClick = (event) => closeBoxesRef.current(event);
    
    document.body.addEventListener("click", handleBodyClick, true);

    return () => {
      document.body.removeEventListener("click", handleBodyClick, true);
    };
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup function to remove the event listener when the component unmounts
      document.body.removeEventListener("click", closeBoxesRef.current, true);
    };
  }, []);

  // Additional useEffect for handling changes in elementRefs or functionsToExecute
  useEffect(() => {
    closeBoxesRef.current = closeBoxes;
  }, [elementRefs, functionsToExecute, closeBoxes]);
};

export default useDivBoxCloser;
