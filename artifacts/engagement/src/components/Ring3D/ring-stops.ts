export type RingStop = {
  sectionId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

// Base configurations that we adapt based on viewport size and language direction
export const getRingStops = (isMobile: boolean, isRTL: boolean): RingStop[] => {
  const dirMultiplier = isRTL ? -1 : 1;

  if (isMobile) {
    return [
      {
        sectionId: "hero",
        position: [0, 0, 0],
        rotation: [Math.PI / 8, 0, 0],
        scale: 1,
      },
      {
        sectionId: "couple",
        position: [0, 1, 0],
        rotation: [Math.PI / 4, Math.PI / 4, 0],
        scale: 0.8,
      },
      {
        sectionId: "message",
        position: [0, 0, 0],
        rotation: [Math.PI / 6, Math.PI / 2, 0],
        scale: 0.9,
      },
      {
        sectionId: "countdown",
        position: [0, 1.5, 0],
        rotation: [Math.PI / 2, 0, 0],
        scale: 0.7,
      },
      {
        sectionId: "details",
        position: [0, -1, 0],
        rotation: [0, Math.PI, 0],
        scale: 0.8,
      },
      {
        sectionId: "gallery",
        position: [0, 0, 0],
        rotation: [Math.PI / 4, Math.PI * 1.5, 0],
        scale: 0.8,
      },
      {
        sectionId: "rsvp",
        position: [0, 1.5, 0],
        rotation: [Math.PI / 8, Math.PI / 4, 0],
        scale: 0.9,
      },
      {
        sectionId: "footer",
        position: [0, -0.5, 0],
        rotation: [Math.PI / 4, 0, 0],
        scale: 1.2,
      },
    ];
  }

  // Desktop
  return [
    {
      sectionId: "hero",
      position: [0, 0.5, 0],
      rotation: [Math.PI / 8, 0, 0],
      scale: 1.5,
    },
    {
      sectionId: "couple",
      position: [0, 0, 0],
      rotation: [Math.PI / 4, Math.PI / 4, 0],
      scale: 1,
    },
    {
      sectionId: "message",
      position: [2 * dirMultiplier, -0.5, 0],
      rotation: [Math.PI / 6, Math.PI / 2, 0],
      scale: 1,
    },
    {
      sectionId: "countdown",
      position: [-2 * dirMultiplier, 0, 0],
      rotation: [Math.PI / 2, 0, Math.PI / 4],
      scale: 0.8,
    },
    {
      sectionId: "details",
      position: [0, -1, 0],
      rotation: [0, Math.PI, 0],
      scale: 1,
    },
    {
      sectionId: "gallery",
      position: [1.5 * dirMultiplier, 0, 0],
      rotation: [Math.PI / 4, Math.PI * 1.5, 0],
      scale: 0.9,
    },
    {
      sectionId: "rsvp",
      position: [-2 * dirMultiplier, 1, 0],
      rotation: [Math.PI / 8, Math.PI / 4, 0],
      scale: 1.1,
    },
    {
      sectionId: "footer",
      position: [0, -1, 0],
      rotation: [Math.PI / 6, 0, 0],
      scale: 1.4,
    },
  ];
};
