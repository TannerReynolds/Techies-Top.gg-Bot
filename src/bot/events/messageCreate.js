async function messageCreate(msg) {
    if (msg.content.indexOf(this.c.prefix) !== 0) return;
    const args = msg.content.slice(this.c.prefix.length).trim().split(/ +/g);
    const command = args.shift().toString().toLowerCase();
    if (!this.c.discordAdminIDs.includes(msg.author.id) && command !== 'leaderboard' && command !== 'help' && command !== 'vote') return;
    for (let i = 0; this.commands.length > i; i++) {
        if (this.commands[i].command === command) {
            this.commands[i].execute(this, msg, args);
        }
    }
}
module.exports = messageCreate;
