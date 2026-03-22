import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { BookPoemProps } from "../../../types/constants";

const bookFontFamily =
  "'Book Antiqua', Palatino, 'Palatino Linotype', 'Palatino LT STD', Georgia, serif";

const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = useMemo(() => {
    const nodes: Array<{ type: "plain" | "highlight"; value: string }> = [];
    let current = "";
    let isHighlight = false;

    const flush = () => {
      if (current.length === 0) return;
      nodes.push({ type: isHighlight ? "highlight" : "plain", value: current });
      current = "";
    };

    for (const char of text) {
      if (char === "{") {
        flush();
        isHighlight = true;
        continue;
      }

      if (char === "}") {
        flush();
        isHighlight = false;
        continue;
      }

      current += char;
    }

    flush();
    return nodes;
  }, [text]);

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === "plain") {
          return <React.Fragment key={i}>{p.value}</React.Fragment>;
        }

        return (
          <span
            key={i}
            style={{
              backgroundColor: "rgba(245, 248, 62, 0.4)",
              color: "black",
              fontWeight: 100,
            }}
          >
            {p.value}
          </span>
        );
      })}
    </>
  );
};

export const BookPoem: React.FC<z.infer<typeof BookPoemProps>> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoomFrom = props.zoomFrom ?? 1;
  const zoomTo = props.zoomTo ?? 1.08;
  const tiltDeg = props.tiltDeg ?? 0;

  const zoom = interpolate(frame, [0, durationInFrames - 1], [zoomFrom, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoomOriginX = props.zoomOriginX ?? 0.65;
  const zoomOriginY = props.zoomOriginY ?? 0.44;

  const backgroundSrc = props.backgroundSrc ?? staticFile("book-assets/fondo.png");
  const overlaySrc = props.overlaySrc ?? staticFile("book-assets/overlay.png");

  const imageFilter = props.sepia ? "sepia(1) saturate(1)" : "none";
  const showImages = !props.onlyText;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#272c3a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: bookFontFamily,
        WebkitFontSmoothing: "antialiased",
        textRendering: "geometricPrecision",
      }}
    >
      <div
        style={{
          width: 1080,
          height: 1080,
          transform: `translate3d(0, 0, 0) scale3d(${zoom}, ${zoom}, 1)`,
          transformOrigin: `${zoomOriginX * 100}% ${zoomOriginY * 100}%`,
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1080,
            height: 1080,
            overflow: "hidden",
          }}
        >
          {showImages ? (
            <>
              <Img
                src={backgroundSrc}
                style={{
                  width: 1080,
                  height: 1080,
                  position: "absolute",
                  filter: imageFilter,
                }}
              />
              <Img
                src={overlaySrc}
                style={{
                  height: 1080,
                  position: "absolute",
                  zIndex: 1,
                  filter: imageFilter,
                }}
              />
            </>
          ) : null}

          <div
            style={{
              position: "absolute",
              textAlign: "left",
              width: 500,
              transform: `translate3d(215px, 126px, 0) rotate(${tiltDeg}deg)`,
              height: 840,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
              zIndex: 2,
              top: props.topShift ? "-30%" : "0%",
            }}
          >
            <p
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                maxWidth: 490,
                whiteSpace: "pre-wrap",
                fontSize: 15,
                color: "black",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              {props.title}
            </p>
            <p
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                maxWidth: 490,
                whiteSpace: "pre-wrap",
                fontSize: 20,
                color: "black",
                textAlign: props.textCenter ? "center" : "left",
              }}
            >
              <HighlightedText text={props.text} />
            </p>
            <div style={{ height: 40 }} />
            {!props.hideWatermark ? (
              <h4
                style={{
                  color: "rgba(0, 0, 0, 0.25)",
                  fontStyle: "italic",
                  fontSize: 18,
                  marginTop: 40,
                }}
              >
                {props.watermarkText}
              </h4>
            ) : null}
            <h5
              style={{
                color: "rgba(7, 7, 7, 0.48)",
                fontSize: 14,
                position: "absolute",
                bottom: 12,
              }}
            >
              {props.page}
            </h5>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
