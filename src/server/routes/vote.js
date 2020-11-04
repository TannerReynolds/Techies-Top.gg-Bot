async function vote(req, res) {
    const givenAuth = req.headers.authorization;
    const givenUser = req.body.user;
    if(givenAuth !== this.c.authToken || !givenUser) return;

    this.db.get('voters').push({id: givenUser, date: currentDate()}).write();
    let g = this.bot.guilds.filter(guild => guild.id === this.c.guildID)[0];
    let voterRole = this.db.get('voterRole').value();
    g.addMemberRole(givenUser, voterRole.id).catch(e => { return });
    let currentVoterCount = this.db.get('voterCount').find({id: givenUser}).value();
    if(currentVoterCount) {
        this.db.get('voterCount').push({id: givenUser, total: currentVoterCount.total + 1})
    } else {
        this.db.get('voterCount').push({id: givenUser, total: 1})
    }
    res.statusCode = 200;
    res.end();
}
function currentDate() {
    const date = new Date();
    const day = date.getDay() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}
module.exports = vote;