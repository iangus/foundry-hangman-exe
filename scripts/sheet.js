export class HangmanSheet extends JournalTextPageSheet {
  get template() {
    return `modules/hangman-exe/templates/hangman${
      this.isEditable ? "-edit" : ""
    }.hbs`;
  }

  async getData(options = {}) {
    const context = await super.getData(options);
    context.targetWord = this.object.system.targetWord;

    return context;
  }

  async _updateObject(_, formData) {
    await this.object.update({
      "system.targetWord": formData.targetWord.replaceAll(/\W|_|\d/g, ""),
    });
  }
}
