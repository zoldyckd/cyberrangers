/// <reference types="@workadventure/iframe-api-typings" />

/** Progress config for the HALL (Safe Internet Practices) */
export const SAFEINTERNETPRACTICES_PROGRESS: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
  }
> = {
  hall: {
    tasks: [
      { key: "safeinternetpractices_instructions",     label: "Slides",             area: "safeinternetpractices_instructions" },
      { key: "safeinternetpractices_freewifi",          label: "Free Wi-Fi",         area: "safeinternetpractices_freewifi" },
      { key: "safeinternetpractices_fileuploads",       label: "File Uploads",       area: "safeinternetpractices_fileuploads" },
      { key: "safeinternetpractices_outdatedsoftware",  label: "Outdated Software",  area: "safeinternetpractices_outdatedsoftware" },
    ],
    exitGate: {
      area: "to-computerlab",                            // door/exit area in Tiled
      nextRoom: "computerlab.tmj#from-hall",             // next room once all tasks are done
      warnAnchorId: "safeinternetpractices_gate_popup",  // anchor rectangle near the exit
    },
  },
};
