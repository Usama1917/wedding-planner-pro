export type RingStop = {
  sectionId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

// Very small scale for the ring so it resembles real jewelry cap-height size
const BASE_SCALE = 0.25;
const MOBILE_SCALE = 0.18;

export const getRingStops = (isMobile: boolean, isRTL: boolean): RingStop[] => {
  const dirMultiplier = isRTL ? -1 : 1;
  const scale = isMobile ? MOBILE_SCALE : BASE_SCALE;

  if (isMobile) {
    return [
      {
        sectionId: "hero",
        position: [0, 0.8, 0],
        rotation: [Math.PI / 6, 0, 0],
        scale: scale * 1.1,
      },
      {
        sectionId: "couple",
        position: [0, 1.2, 0],
        rotation: [Math.PI / 4, Math.PI / 6, 0],
        scale: scale,
      },
      {
        sectionId: "message",
        position: [0, 0.5, 0],
        rotation: [Math.PI / 6, Math.PI / 3, 0],
        scale: scale * 0.9,
      },
      {
        sectionId: "countdown",
        position: [0, 1.4, 0],
        rotation: [Math.PI / 3, 0, 0],
        scale: scale,
      },
      {
        sectionId: "details",
        position: [0, -1.2, 0],
        rotation: [0, Math.PI / 4, 0],
        scale: scale * 0.9,
      },
      {
        sectionId: "gallery",
        position: [0, 0, 0],
        rotation: [Math.PI / 4, Math.PI, 0],
        scale: scale,
      },
      {
        sectionId: "rsvp",
        position: [0, 1.5, 0],
        rotation: [Math.PI / 6, Math.PI / 4, 0],
        scale: scale,
      },
      {
        sectionId: "footer",
        position: [0, -0.2, 0],
        rotation: [Math.PI / 4, 0, 0],
        scale: scale * 1.1,
      },
    ];
  }

  // Desktop
  return [
    {
      sectionId: "hero",
      position: [0, 0.5, 0],
      rotation: [Math.PI / 6, 0, 0],
      scale: scale * 1.1,
    },
    {
      sectionId: "couple",
      position: [0, 0, 0],
      rotation: [Math.PI / 4, Math.PI / 6, 0],
      scale: scale,
    },
    {
      sectionId: "message",
      position: [2.5 * dirMultiplier, -0.2, 0],
      rotation: [Math.PI / 6, Math.PI / 3, 0],
      scale: scale,
    },
    {
      sectionId: "countdown",
      position: [-2.5 * dirMultiplier, 0.2, 0],
      rotation: [Math.PI / 3, 0, Math.PI / 6],
      scale: scale * 0.9,
    },
    {
      sectionId: "details",
      position: [0, -1.5, 0],
      rotation: [0, Math.PI / 4, 0],
      scale: scale,
    },
    {
      sectionId: "gallery",
      position: [2 * dirMultiplier, 0, 0],
      rotation: [Math.PI / 4, Math.PI, 0],
      scale: scale * 0.9,
    },
    {
      sectionId: "rsvp",
      position: [-2.5 * dirMultiplier, 1.2, 0],
      rotation: [Math.PI / 6, Math.PI / 4, 0],
      scale: scale,
    },
    {
      sectionId: "footer",
      position: [0, -0.5, 0],
      rotation: [Math.PI / 6, 0, 0],
      scale: scale * 1.1,
    },
  ];
};
