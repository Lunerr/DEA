const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class ModifyTriviaQuestion extends Command {
  constructor() {
    super({
      names: ['modifytriviaquestion', 'modifyquestion', 'modquestion'],
      groupName: 'owners',
      description: 'Modifies a trivia question.',
      preconditions: ['moderator'],
      args: [
        new Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"Whose cock is microscopic?"',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength']
        }),
        new Argument({
          name: 'new question',
          key: 'newQuestion',
          type: 'string',
          example: 'Who has the tiniest cock in DEA?',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength', 'triviaquestion'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const keys = Object.keys(msg.dbGuild.trivia);
    const key = keys.find(x => x.toLowerCase() === args.question.toLowerCase());

    if (!key) {
      return msg.createErrorReply('this trivia question doesn\'t exist.');
    }

    const question = `trivia.${key}`;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $rename: {
        [question]: `trivia.${args.newQuestion}`
      }
    });

    return msg.createReply(`you have successfully modified the question \
${StringUtil.boldify(key)}.`);
  }
}

module.exports = new ModifyTriviaQuestion();
