import { TOKEN_SPRITE } from "../resources";
import { TokenData, TokenType } from "./token.model";

export const TOKEN_DATA: Record<TokenType, TokenData> = {
  "": { commands: [""], graphic: TOKEN_SPRITE["unknown"] },
  "fwd": { commands: ["fwd"], graphic: TOKEN_SPRITE["fwd"] },
  "fwd2": { commands: ["fwd", "fwd"], graphic: TOKEN_SPRITE["fwd2"] },
  "fwd3": { commands: ["fwd", "fwd", "fwd"], graphic: TOKEN_SPRITE["fwd3"] },
  "fwd4": {
    commands: ["fwd", "fwd", "fwd", "fwd"],
    graphic: TOKEN_SPRITE["fwd4"],
  },
  "bck": { commands: ["bck"], graphic: TOKEN_SPRITE["bck"] },
  "bck2": { commands: ["bck", "bck"], graphic: TOKEN_SPRITE["bck2"] },
  "bck3": { commands: ["bck", "bck", "bck"], graphic: TOKEN_SPRITE["bck3"] },
  "bck4": {
    commands: ["bck", "bck", "bck", "bck"],
    graphic: TOKEN_SPRITE["bck4"],
  },
  "tr": { commands: ["tr"], graphic: TOKEN_SPRITE["tr"] },
  "tl": { commands: ["tl"], graphic: TOKEN_SPRITE["tl"] },
  "pu": { commands: ["pu"], graphic: TOKEN_SPRITE["pu"] },
  "pd": { commands: ["pd"], graphic: TOKEN_SPRITE["pd"] },
  "use": { commands: ["use"], graphic: TOKEN_SPRITE["use"] },
};
