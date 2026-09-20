import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const MotionContext = createContext({
  paused: false,
  reduced: false,
  running: true,
  toggle: () => {},
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem("pixel-motion-paused") === "true";
    } catch {
      return false;
    }
  });
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [visible, setVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const toggle = () =>
    setPaused(value => {
      try {
        localStorage.setItem("pixel-motion-paused", String(!value));
      } catch {
        /* Storage is optional. */
      }
      return !value;
    });

  return (
    <MotionContext.Provider
      value={{
        paused,
        reduced,
        running: !paused && !reduced && visible,
        toggle,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export const useMotionPreference = () => useContext(MotionContext);
