module.exports = {
    command: 'voterrole',
    description: 'Add or delete the voter role. This is the role that grants access to the channel',
    syntax: '{PREFIX}addrole [role name]',
    execute: async (_this, msg, args) => {
        if(!args.join(' ')) {
            return msg.channel.createMessage({ embed: {
                description: '❌ No arguments were given',
                color: 0xDD2E44
            }})
        }
        if(!msg.channel.guild.roles.filter(r => r.name === args.join(' '))[0]) {
            return msg.channel.createMessage({ embed: {
                description: '❌ This role does not exist',
                color: 0xDD2E44
            }})
        }
        let targetRole = msg.channel.guild.roles.filter(r => r.name === args.join(" "))[0].id;
        _this.db.set('voterRole.id', targetRole).write();
        msg.channel.createMessage({ embed: {
            description: `<a:Success:585821631495274499> Role \`${targetRole}\` has become the voter role`,
            color: 0x4ACC85
        }})
    },
};