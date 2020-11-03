module.exports = {
    command: 'role',
    description: 'Add or delete a role from the role list. `{PREFIX}role blue` will add blue the first time, run it again to remove blue',
    syntax: '{PREFIX}role [role name]',
    execute: async (_this, msg, args) => {
        if(!args.join(' ')) return msg.channel.createMessage('No arguments were given');
        if(!msg.channel.guild.roles.filter(r => r.name === args.join(' '))[0]) return msg.channel.createMessage('This role does not exist');
        let targetRole = msg.channel.guild.roles.filter(r => r.name === args.join(" "))[0].id;
        let exists = _this.db.get('roles').find({id: targetRole}).value();
        if(exists) {
            _this.db.get('roles').remove({id: targetRole}).write();
            msg.channel.createMessage(`Role ${targetRole} has been removed from the role list`);
        } else {
            _this.db.get('roles').push({id: targetRole}).write();
            msg.channel.createMessage(`Role ${targetRole} has been added to the role list`);
        }
    },
};