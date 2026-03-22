import { z } from "zod";

export const COMP_NAME = "MyComp";
export const BOOK_POEM_COMP_NAME = "BookPoem";

export const CompositionProps = z.object({
  title: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;

export const BookPoemProps = z.object({
  title: z.string(),
  text: z.string(),
  page: z.string(),
  watermarkText: z.string(),
  hideWatermark: z.boolean().optional(),
  textCenter: z.boolean().optional(),
  topShift: z.boolean().optional(),
  sepia: z.boolean().optional(),
  onlyText: z.boolean().optional(),
  backgroundSrc: z.string().optional(),
  overlaySrc: z.string().optional(),
  tiltDeg: z.number().optional(),
  zoomFrom: z.number().optional(),
  zoomTo: z.number().optional(),
  zoomOriginX: z.number().optional(),
  zoomOriginY: z.number().optional(),
});

export const defaultBookPoemProps: z.infer<typeof BookPoemProps> = {
  title: "Título",
  text: "Esta es una previsualización del poema.\n\nPuedes resaltar usando {llaves}.",
  page: "1",
  watermarkText: "Cristian Prince",
  hideWatermark: false,
  textCenter: false,
  topShift: false,
  sepia: false,
  onlyText: false,
  tiltDeg: 0,
  zoomFrom: 1,
  zoomTo: 1.08,
  zoomOriginX: 0.65,
  zoomOriginY: 0.44,
};

export const BOOK_POEM_DURATION_IN_FRAMES = 180;
export const BOOK_POEM_WIDTH = 1080;
export const BOOK_POEM_HEIGHT = 1080;
