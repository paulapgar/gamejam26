import { TOKEN_SPRITE } from "../resources";
import { LevelData } from "./level.model";

export const LEVEL_DATA: Record<string, LevelData> = {
  "Level 1": {
    name: "Level 1",
    levelType: "puzzle",
    charMap: [
      "   www    ",
      "   wxw    ",
      "   w.w    ",
      "   w.w    ",
      "   w.w    ",
      "   w.w    ",
      "   w.w    ",
      "   w.w    ",
      "   wew    ",
      "   www    ",
    ],
    tileGrid: [],
    botFacing: "Up",
    nextLevel: "Level 2",
    tokens: [""],
    numTokens: 6,
    instructionText: [
      "You need to train Gippity the Baby Bot... and he needs lots of help to get to the exit! ",
      "Guide him to the exit by selecting the falling tokens in the right order and then select Execute Plan.",
      "This is an early test level so it shouldn't be hard.",
    ],
    instructionIcon: TOKEN_SPRITE["fwd"],
    instructionIconText: "Forward Token (may have number of moves on it)",
  },
};

// // 10x10 level represented as rows of characters: 'w' = wall, '.' = floor
// export const LEVEL_TEMPLATE_TILES: string[] = [
//   'wwwwwwwwww',
//   'w........w',
//   'w........w',
//   'w........w',
//   'w........w',
//   'w........w',
//   'w........w',
//   'w........w',
//   'w........w',
//   'wwwwwwwwww',
// ];
