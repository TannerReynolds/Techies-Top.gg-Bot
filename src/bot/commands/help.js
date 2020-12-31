module.exports = {
    command: 'help',
    description: 'Get info on commands',
    syntax: '{PREFIX}help',
    execute: async (_this, msg) => {
        const cmds = [];
        _this.commands.map(cmd => {
            cmds.push(`${cmd.command}: ${cmd.syntax.replace('{PREFIX}', _this.c.prefix)} | ${cmd.description.includes('{PREFIX}') ? cmd.description.replace('{PREFIX}', _this.c.prefix) : cmd.description}`);
        });
        msg.channel.createMessage({ embed: {
            title: 'Techies Hideaway',
            field: {
                name: "Available Commands",
                value: cmds.join('\n'),
                inline: false
            },
            color: 0x8A53FC
        }})
    },
};