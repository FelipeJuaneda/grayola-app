"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

export default function ParticlesBackground() {
  const [loaded, setLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setLoaded(true));
  }, []);

  const options = useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      autoPlay: true,
      background: {
        color: {
          value: isDark ? "#171717" : "#ffffff",
        },
        image: "url('/fondoAuth.jpg')",
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover",
        opacity: 1,
      },
      backgroundMask: {
        composite: "destination-out",
        cover: {
          opacity: 1,
          color: {
            value: isDark ? "#0a0a0a" : "#ffffff",
          },
        },
        enable: true,
      },
      clear: true,
      defaultThemes: {},
      delay: 0,
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
      detectRetina: true,
      duration: 0,
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onDiv: {
            selectors: {},
            enable: false,
            mode: {},
            type: "circle",
          },
          onHover: {
            enable: true,
            mode: "bubble",
            parallax: {
              enable: false,
              force: 2,
              smooth: 10,
            },
          },
          resize: {
            delay: 0.5,
            enable: true,
          },
        },
        modes: {
          trail: { delay: 1, pauseOnStop: false, quantity: 1 },
          attract: {
            distance: 200,
            duration: 0.4,
            easing: "ease-out-quad",
            factor: 1,
            maxSpeed: 50,
            speed: 1,
          },
          bounce: { distance: 200 },
          bubble: {
            distance: 400,
            duration: 2,
            mix: false,
            opacity: 1,
            size: 100,
            divs: {
              distance: 200,
              duration: 0.4,
              mix: false,
              selectors: {},
            },
          },
          connect: {
            distance: 80,
            links: {
              opacity: 0.5,
            },
            radius: 60,
          },
          grab: {
            distance: 100,
            links: {
              blink: false,
              consent: false,
              opacity: 1,
            },
          },
          push: {
            default: true,
            groups: [],
            quantity: 4,
          },
          remove: {
            quantity: 2,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: "ease-out-quad",
            divs: {
              distance: 200,
              duration: 0.4,
              factor: 100,
              speed: 1,
              maxSpeed: 50,
              easing: "ease-out-quad",
              selectors: {},
            },
          },
          slow: {
            factor: 3,
            radius: 200,
          },
          particle: {
            replaceCursor: false,
            pauseOnStop: false,
            stopDelay: 0,
          },
          light: {
            area: {
              gradient: {
                start: { value: "#ffffff" },
                stop: { value: "#000000" },
              },
              radius: 1000,
            },
            shadow: {
              color: { value: "#000000" },
              length: 2000,
            },
          },
        },
      },
      manualParticles: [],
      particles: {
        bounce: {
          horizontal: { value: 1 },
          vertical: { value: 1 },
        },
        collisions: {
          absorb: { speed: 2 },
          bounce: {
            horizontal: { value: 1 },
            vertical: { value: 1 },
          },
          enable: false,
          maxSpeed: 50,
          mode: "bounce",
          overlap: { enable: true, retries: 0 },
        },
        color: {
          value: isDark ? "#ffffff" : "#000000",
          animation: {
            h: { enable: false },
            s: { enable: false },
            l: { enable: false },
          },
        },
        effect: {
          close: true,
          fill: true,
          options: {},
          type: {},
        },
        move: {
          angle: { offset: 0, value: 90 },
          attract: {
            distance: 200,
            enable: false,
            rotate: { x: 3000, y: 3000 },
          },
          center: {
            x: 50,
            y: 50,
            mode: "percent",
            radius: 0,
          },
          decay: 0,
          direction: "none",
          drift: 0,
          enable: true,
          gravity: { enable: false },
          outModes: {
            default: "out",
            bottom: "out",
            left: "out",
            right: "out",
            top: "out",
          },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: { enable: true, width: 1920, height: 1080 },
          value: 80,
        },
        opacity: {
          value: 1,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 30 },
        },
        zIndex: {
          value: 0,
        },
        links: {
          color: isDark ? "#cccccc" : "#333333",
          distance: 150,
          enable: true,
          opacity: isDark ? 0.3 : 0.25,
          width: 1,
        },
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      motion: {
        disable: false,
        reduce: {
          factor: 4,
          value: true,
        },
      },
      zLayers: 100,
    };
  }, [resolvedTheme]);

  if (!loaded) return null;

  return <Particles id="tsparticles" options={options} className="h-full" />;
}
