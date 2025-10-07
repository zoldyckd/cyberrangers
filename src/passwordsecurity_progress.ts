/// <reference types="@workadventure/iframe-api-typings" />

/** Progress config for the CLASSROOM (Password Security) room */
export const PASSWORDSECURITY_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
  }
> = {
  classroom: {
    tasks: [
      { key: "passwordsecurity_instructions",      label: "Slides",            area: "passwordsecurity_instructions" },
      { key: "passwordsecurity_lmsaccount",        label: "LMS Account",       area: "passwordsecurity_lmsaccount" },
      { key: "passwordsecurity_lmspasswordexpired",label: "Password Expired",  area: "passwordsecurity_lmspasswordexpired" },
      { key: "passwordsecurity_unlockedpc",        label: "Unlocked PC",       area: "passwordsecurity_unlockedpc" },
    ],
    exitGate: {
      area: "to-hall",                              // area name in Tiled (stairs/door)
      nextRoom: "hall.tmj#from-classroom",          // destination when ALL tasks done
      warnAnchorId: "passwordsecurity_gate_popup",    // anchor rectangle near exit
    },
  },
};
