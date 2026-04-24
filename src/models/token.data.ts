import { TOKEN_SPRITE } from "../resources";
import { TokenData, TokenType } from "./token.model";

export const TOKEN_DATA: Record<TokenType, TokenData> = {
  "fwd": { commands: ["fwd"], graphic: TOKEN_SPRITE["fwd"] },
  "fwd2": { commands: ["fwd", "fwd"], graphic: TOKEN_SPRITE["fwd2"] },
  "fwd3": { commands: ["fwd", "fwd", "fwd"], graphic: TOKEN_SPRITE["fwd3"] },
  "fwd4": {
    commands: ["fwd", "fwd", "fwd", "fwd"],
    graphic: TOKEN_SPRITE["fwd4"],
  },
  "tr": { commands: ["tr"], graphic: TOKEN_SPRITE["tr"] },
  "tl": { commands: ["tl"], graphic: TOKEN_SPRITE["tl"] },
  "pu": { commands: ["pu"], graphic: TOKEN_SPRITE["fwd"] },  // *** Need to update
  "pd": { commands: ["pd"], graphic: TOKEN_SPRITE["fwd"] },  // *** Need to update
  "use": { commands: ["use"], graphic: TOKEN_SPRITE["fwd"] },  // *** Need to update
};
