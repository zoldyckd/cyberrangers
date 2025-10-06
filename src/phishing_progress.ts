/// <reference types="@workadventure/iframe-api-typings" />

/** Progress config for the LIBRARY (Phishing) room */
export const PHISHING_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
  }
> = {
  library: {
    tasks: [
      { key: "phishing_SMSphishing",  label: "SMS",         area: "phishing_SMSphishing" },
      { key: "phishing_MurdochEmail", label: "MurdochEmail", area: "phishing_MurdochEmail" },
      { key: "phishing_QRcode",       label: "QRcode",      area: "phishing_QRcode" },
      { key: "phishing_instructions", label: "PPT Slides",  area: "phishing_instructions" },
    ],
    exitGate: {
      area: "to-canteen",
      nextRoom: "canteen.tmj#from-library",
      warnAnchorId: "phishing_gate_popup",
    },
  },
};
