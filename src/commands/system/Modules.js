const { Command, Argument, Context } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

class Modules extends Command {
  constructor() {
    super({
      names: ['modules', 'module', 'groups', 'group'],
      groupName: 'system',
      description: 'View all modules or a modules information.',
      usableContexts: [Context.DM, Context.Guild],
      args: [
        new Argument({
          name: 'module',
          key: 'module',
          type: 'string',
          defaultValue: '',
          example: 'administrator'
        })
      ]
    });
  }

  async run(msg, args) {
    if (StringUtil.isNullOrWhiteSpace(args.module)) {
      const { client: { registry: { groups } } } = msg;
      let message = '';

      for (let i = 0; i < groups.length; i++) {
        message += StringUtil.upperFirstChar(groups[i].name);

        if (groups.length - 1 !== i) {
          message += ', ';
        }
      }

      return msg.channel.createMessage(message, { title: 'These are the current modules in DEA:' });
    }

    const lowerInput = args.module.toLowerCase();
    const group = msg.client.registry.groups.find(x => x.name === lowerInput);

    if (!group) {
      return msg.createErrorReply('this module does not exist.');
    }

    let message = `**Description**: ${group.description}\n**Commands:** `;
    const { commands } = group;

    for (let i = 0; i < commands.length; i++) {
      message += StringUtil.upperFirstChar(commands[i].names[0]);

      if (commands.length - 1 !== i) {
        message += ', ';
      }
    }

    return msg.channel.createMessage(message, { title: StringUtil.upperFirstChar(group.name) });
  }
}

module.exports = new Modules();
