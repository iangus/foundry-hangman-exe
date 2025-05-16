export class HangmanSheet extends JournalTextPageSheet {
  get template() {
    return `modules/hangman-exe/templates/hangman${
      this.isEditable ? "-edit" : ""
    }.hbs`;
  }

  getData(options = {}) {
    const context = super.getData(options);
    context.targetWord = this.object.system.targetWord;

    return context;
  }

  async _updateObject(_, formData) {
    await this.object.update({ "system.targetWord": formData.targetWord });
  }
}
