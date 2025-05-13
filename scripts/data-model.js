export const GameStatus = Object.freeze({
  NotStarted: "NotStarted",
  InProgress: "InProgress",
  Success: "Success",
  Fail: "Fail",
});

const { StringField, SetField } = foundry.data.fields;

export class HangmanModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      targetWord: new StringField({
        blank: false,
        required: true,
        label: "Target Word",
        gmOnly: true,
        trim: true,
      }),
      status: new StringField({
        blank: false,
        choices: GameStatus,
        initial: GameStatus.NotStarted,
        required: true,
        label: "Game Status",
      }),
      guessedCharacters: new SetField(
        new StringField({
          blank: false,
          trim: true,
        }),
        {
          required: true,
          initial: new Set(),
          label: "Guessed Characters",
        }
      ),
      guessedWords: new SetField(
        new StringField({
          blank: false,
          trim: true,
        }),
        {
          required: true,
          initial: new Set(),
          label: "Guessed Words",
        }
      ),
    };
  }

  prepareDerivedData() {
    this.wordLength = this.targetWord.length;
    this.guessCount = this.guessedCharacters.size + this.guessedWords.size;
    this.display = this.targetWord
      .split()
      .map((char) => (this.guessedCharacters.has(char) ? char : "_"));
  }
}
