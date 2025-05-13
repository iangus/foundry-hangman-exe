export class HangmanSheet extends JournalTextPageSheet {
  get template() {
    return `modules/hangman-exe/templates/test${
      this.isEditable ? "-edit" : ""
    }.html`;
  }
}
