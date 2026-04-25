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
    botFacing: "Up",
    nextLevel: "Level 2",
    tokenList: ["fwd", "fwd", "fwd3", "tr", "fwd", "fwd2", "fwd", "tl", "fwd4", "fwd",
                "fwd2", "tr", "fwd", "tl", "fwd3", "fwd", "tr", "fwd2", "fwd", "fwd4",
                "tl", "fwd", "fwd3", "tr", "fwd", "fwd2", "tl", "fwd", "fwd4", "tr",
                "fwd", "fwd2", "fwd3", "tl", "fwd", "tr", "fwd4", "fwd2", "fwd", "tl",
                "fwd3", "fwd", "tr", "fwd2", "fwd4", "fwd", "tl", "fwd3", "tr", "fwd2"],
    numTokens: 6,
    instructionText: [
      "             instructions.md",
      "You need to train a Baby Bot named Gippity...",
      "and he needs lots of help to get to the exit!",
      "Guide him by selecting the falling Tokens in",
      "the right order and then select Execute Plan.",
      "This is an early test level so it shouldn't",
      "be too hard.",
    ],
    instructionIcon: TOKEN_SPRITE["fwd"],
    instructionIconText: "Forward Token (# of moves)",
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
