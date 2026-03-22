"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  BookPoemProps,
  BOOK_POEM_DURATION_IN_FRAMES,
  BOOK_POEM_HEIGHT,
  BOOK_POEM_WIDTH,
  CompositionProps,
  defaultBookPoemProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { RenderControls } from "../components/RenderControls";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { BookPoem } from "../remotion/BookPoem/BookPoem";
import { Main } from "../remotion/MyComp/Main";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [mode, setMode] = useState<"mycomp" | "bookpoem">("bookpoem");
  const [bookTitle, setBookTitle] = useState<string>(defaultBookPoemProps.title);
  const [bookText, setBookText] = useState<string>(defaultBookPoemProps.text);
  const [bookPage, setBookPage] = useState<string>(defaultBookPoemProps.page);
  const [bookWatermark, setBookWatermark] = useState<string>(
    defaultBookPoemProps.watermarkText,
  );
  const [bookSepia, setBookSepia] = useState<boolean>(Boolean(defaultBookPoemProps.sepia));
  const [bookOnlyText, setBookOnlyText] = useState<boolean>(
    Boolean(defaultBookPoemProps.onlyText),
  );
  const [bookTextCenter, setBookTextCenter] = useState<boolean>(
    Boolean(defaultBookPoemProps.textCenter),
  );
  const [bookTopShift, setBookTopShift] = useState<boolean>(
    Boolean(defaultBookPoemProps.topShift),
  );
  const [bookHideWatermark, setBookHideWatermark] = useState<boolean>(
    Boolean(defaultBookPoemProps.hideWatermark),
  );
  const [bookTiltDeg, setBookTiltDeg] = useState<number>(defaultBookPoemProps.tiltDeg ?? 0);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
    };
  }, [text]);

  const bookInputProps: z.infer<typeof BookPoemProps> = useMemo(() => {
    return {
      title: bookTitle,
      text: bookText,
      page: bookPage,
      watermarkText: bookWatermark,
      sepia: bookSepia,
      onlyText: bookOnlyText,
      textCenter: bookTextCenter,
      topShift: bookTopShift,
      hideWatermark: bookHideWatermark,
      tiltDeg: bookTiltDeg,
      zoomFrom: defaultBookPoemProps.zoomFrom,
      zoomTo: defaultBookPoemProps.zoomTo,
      zoomOriginX: defaultBookPoemProps.zoomOriginX,
      zoomOriginY: defaultBookPoemProps.zoomOriginY,
    };
  }, [
    bookHideWatermark,
    bookOnlyText,
    bookPage,
    bookSepia,
    bookText,
    bookTextCenter,
    bookTiltDeg,
    bookTitle,
    bookTopShift,
    bookWatermark,
  ]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5 px-4">
        <div className="flex flex-row items-center gap-3 mt-10">
          <button
            type="button"
            className={`px-3 py-2 rounded-geist text-sm ${
              mode === "bookpoem"
                ? "bg-foreground text-background"
                : "bg-muted text-foreground"
            }`}
            onClick={() => setMode("bookpoem")}
          >
            Video poema
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-geist text-sm ${
              mode === "mycomp" ? "bg-foreground text-background" : "bg-muted text-foreground"
            }`}
            onClick={() => setMode("mycomp")}
          >
            Demo template
          </button>
        </div>
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          {mode === "mycomp" ? (
            <Player
              component={Main}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          ) : (
            <Player
              component={BookPoem}
              inputProps={bookInputProps}
              durationInFrames={BOOK_POEM_DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={BOOK_POEM_HEIGHT}
              compositionWidth={BOOK_POEM_WIDTH}
              style={{
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          )}
        </div>
        {mode === "mycomp" ? (
          <RenderControls
            text={text}
            setText={setText}
            inputProps={inputProps}
          ></RenderControls>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-geist">Título</label>
              <input
                className="px-3 py-2 rounded-geist bg-muted text-foreground"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-geist">Poema</label>
              <textarea
                className="px-3 py-2 rounded-geist bg-muted text-foreground min-h-[180px]"
                value={bookText}
                onChange={(e) => setBookText(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-geist">Página</label>
                <input
                  className="px-3 py-2 rounded-geist bg-muted text-foreground"
                  value={bookPage}
                  onChange={(e) => setBookPage(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-sm font-geist">Marca de agua</label>
                <input
                  className="px-3 py-2 rounded-geist bg-muted text-foreground"
                  value={bookWatermark}
                  onChange={(e) => setBookWatermark(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-row items-center gap-2 text-sm font-geist">
                <input
                  type="checkbox"
                  checked={bookSepia}
                  onChange={(e) => setBookSepia(e.target.checked)}
                />
                Sepia
              </label>
              <label className="flex flex-row items-center gap-2 text-sm font-geist">
                <input
                  type="checkbox"
                  checked={bookOnlyText}
                  onChange={(e) => setBookOnlyText(e.target.checked)}
                />
                Solo texto
              </label>
              <label className="flex flex-row items-center gap-2 text-sm font-geist">
                <input
                  type="checkbox"
                  checked={bookTextCenter}
                  onChange={(e) => setBookTextCenter(e.target.checked)}
                />
                Centrar texto
              </label>
              <label className="flex flex-row items-center gap-2 text-sm font-geist">
                <input
                  type="checkbox"
                  checked={bookTopShift}
                  onChange={(e) => setBookTopShift(e.target.checked)}
                />
                Subir texto
              </label>
              <label className="flex flex-row items-center gap-2 text-sm font-geist">
                <input
                  type="checkbox"
                  checked={bookHideWatermark}
                  onChange={(e) => setBookHideWatermark(e.target.checked)}
                />
                Ocultar marca de agua
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-geist">Inclinación (grados)</label>
              <input
                type="number"
                step="0.1"
                className="px-3 py-2 rounded-geist bg-muted text-foreground"
                value={bookTiltDeg}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setBookTiltDeg(Number.isFinite(next) ? next : 0);
                }}
              />
            </div>
            <div className="text-xs text-subtitle font-geist">
              Usa {"{...}"} para resaltar texto.
            </div>
          </div>
        )}
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Tips></Tips>
      </div>
    </div>
  );
};

export default Home;
