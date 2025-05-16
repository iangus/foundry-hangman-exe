export const GameStatus = Object.freeze({
  NotStarted: "NotStarted",
  InProgress: "InProgress",
  Success: "Success",
  Fail: "Fail",
});

export const GameState = Object.freeze([
  `
  +---+
  |   |
      |
      |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|\  |
      |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
=========
`,
  `
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========
`,
]);

const { StringField, SetField, NumberField } = foundry.data.fields;

export class HangmanModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      targetWord: new StringField({
        blank: false,
        required: true,
        label: "Target Word",
        gmOnly: true,
        trim: true,
        initial: "FIXME", // FIXME need some way to configure this before creating the page
      }),
      status: new StringField({
        blank: false,
        choices: GameStatus,
        initial: GameStatus.NotStarted,
        required: true,
        label: "Game Status",
      }),
      incorrectGuesses: new NumberField({
        required: true,
        integer: true,
        initial: 0,
        nullable: false,
      }),
      guessedCharacters: new SetField(
        new StringField({
          blank: false,
          trim: true,
        }),
        {
          required: true,
          initial: [],
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
          initial: [],
          label: "Guessed Words",
        }
      ),
    };
  }

  /**
   * @override
   */
  prepareBaseData() {
    this.guessedCharacters = new Set(this.guessedCharacters);
    this.guessedWords = new Set(this.guessedWords);

    if (this.incorrectGuesses >= GameState.length - 1) {
      this.status = GameStatus.Fail;
    } else if (
      this.guessedWords.has(this.targetWord) ||
      this.targetWord.split().every((char) => this.guessedCharacters.has(char))
    ) {
      this.status = GameStatus.Success;
    }
  }

  /**
   * @override
   */
  prepareDerivedData() {
    this.wordLength = this.targetWord.length;
    this.display = this.targetWord
      .split()
      .map((char) => (this.guessedCharacters.has(char) ? char : "_"));
  }

  async guess(guess) {
    const sanitizedGuess = guess.replaceAll(/\W|_|\d/g, "").toUpperCase();
    let correct = false;
    if (sanitizedGuess.length === 0) {
      return;
    } else if (sanitizedGuess.length === 1) {
      this.guessedCharacters.add(sanitizedGuess);
      correct = this.targetWord.includes(sanitizedGuess);
    } else {
      this.guessedWords.add(sanitizedGuess);
      correct = this.targetWord === sanitizedGuess;
    }

    if (!correct) {
      this.incorrectGuesses += 1;
    }

    // FIXME should we even await this? or return eagerly with the correct result?
    await this.parent.update({
      "system.incorrectGuesses": this.incorrectGuesses,
      "system.guessedCharacters": Array.from(this.guessedCharacters),
      "system.guessedWords": Array.from(this.guessedWords),
    });
    return correct;
  }
}
