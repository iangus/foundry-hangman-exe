import { HangmanModel } from "./data-model.js";

Hooks.once("init", async function () {
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "hangman-exe.hangman": HangmanModel,
  });
});

Hooks.once("ready", async function () {});
