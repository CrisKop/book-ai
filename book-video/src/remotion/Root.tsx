import { Composition } from "remotion";
import {
  BOOK_POEM_COMP_NAME,
  BOOK_POEM_DURATION_IN_FRAMES,
  BOOK_POEM_HEIGHT,
  BOOK_POEM_WIDTH,
  COMP_NAME,
  defaultBookPoemProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { BookPoem } from "./BookPoem/BookPoem";
import { Main } from "./MyComp/Main";
import { NextLogo } from "./MyComp/NextLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id={BOOK_POEM_COMP_NAME}
        component={BookPoem}
        durationInFrames={BOOK_POEM_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={BOOK_POEM_WIDTH}
        height={BOOK_POEM_HEIGHT}
        defaultProps={defaultBookPoemProps}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};
