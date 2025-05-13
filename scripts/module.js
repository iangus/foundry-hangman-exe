import { HangmanModel } from "./data-model.js";
import { HangmanSheet } from "./sheet.js";

Hooks.once("init", async function () {
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "hangman-exe.hangman": HangmanModel,
  });

  DocumentSheetConfig.registerSheet(
    JournalEntryPage,
    "hangman-exe",
    HangmanSheet,
    {
      types: ["hangman-exe.hangman"],
      makeDefault: true,
    }
  );
});

Hooks.once("ready", async function () {});
