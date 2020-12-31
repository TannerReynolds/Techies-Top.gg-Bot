module.exports = {
    command: 'punish',
    description: 'Ban or unban user from accessing voter roles',
    syntax: '{PREFIX}punish [user]',
    execute: async (_this, msg, args) => {
        if(!args.join(' ')) {
            return msg.channel.createMessage({ embed: {
                description: '❌ No arguments were given',
                color: 0xDD2E44
            }})
        }
        if(!msg.mentions && !msg.content.match(/[0-9]{16,18}/)) return msg.channel.createMessage('No User Input. Please supply a user mention or a user ID');
        let uid;
        if(msg.mentions.length > 0) {
            uid = msg.mentions.filter(u => u.id !== _this.bot.user.id)[0];
        }
        if(msg.content.match(/[0-9]{16,18}/)) {
            uid = msg.content.match(/[0-9]{16,18}/)[0];
        }
        let exists = _this.db.get('bans').find({id: uid}).value();
        if(exists) {
            _this.db.get('bans').remove({id: uid}).write();
            msg.channel.createMessage({ embed: {
                description: `<a:Success:585821631495274499> User \`${uid}\` has been unbanned from using the color roles`,
                color: 0x4ACC85
            }})
        } else {
            _this.db.get('bans').push({id: uid}).write();
            msg.channel.createMessage({ embed: {
                description: `<a:Success:585821631495274499> User \`${uid}\` has been banned from using the color roles`,
                color: 0x4ACC85
            }})
            let roles = _this.db.get('roles').value();
                let interval = 750;
                let promise = Promise.resolve();
                roles.forEach(r => {
                    promise = promise.then(() => {
                        msg.channel.guild.removeMemberRole(uid, r.id).catch(e => {
                            return
                        });
                        msg.channel.guild.removeMemberRole(uid, _this.c.boosterRole).catch(e => {
                            return
                        });
                        return new Promise(resolve => {
                            setTimeout(resolve, interval);
                        });
                    })
                })
        }
    },
};