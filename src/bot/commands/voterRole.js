module.exports = {
    command: 'voterrole',
    description: 'Add or delete the voter role. This is the role that grants access to the channel',
    syntax: '{PREFIX}addrole [role name]',
    execute: async (_this, msg, args) => {
        if(!args.join(' ')) return msg.channel.createMessage('No arguments were given');
        if(!msg.channel.guild.roles.filter(r => r.name === args.join(' '))[0]) return msg.channel.createMessage('This role does not exist');
        let targetRole = msg.channel.guild.roles.filter(r => r.name === args.join(" "))[0].id;
        _this.db.set('voterRole.id', targetRole).write();
        msg.channel.createMessage(`Role ${targetRole} has become the voter role`);
    },
};