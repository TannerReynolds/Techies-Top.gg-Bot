async function vote(req, res) {
    const givenAuth = req.headers.authorization;
    const givenUser = req.body.user;
    if(givenAuth !== this.c.authToken || !givenUser) return;

    let currentVoter = this.db.get('voters').find({id: givenUser}).value();
    if(currentVoter) {
        this.db.get('voters').remove({id: givenUser}).write();
        this.db.get('voters').push({id: givenUser, date: currentDate()}).write();
    } else {
        this.db.get('voters').push({id: givenUser, date: currentDate()}).write();
    }
    let g = this.bot.guilds.filter(guild => guild.id === this.c.guildID)[0];
    let voterRole = this.db.get('voterRole').value();
    g.addMemberRole(givenUser, voterRole.id).catch(e => { return });
    let currentVoterCount = this.db.get('voterCount').find({id: givenUser}).value();
    if(currentVoterCount) {
        this.db.get('voterCount').remove({id: givenUser}).write();
        this.db.get('voterCount').push({id: givenUser, total: currentVoterCount.total + 1}).write();
    } else {
        this.db.get('voterCount').push({id: givenUser, total: 1}).write();
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