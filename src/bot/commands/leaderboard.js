const aSort = require('array-sort');

module.exports = {
    command: 'leaderboard',
    description: 'Look at the voter leaderboard',
    syntax: '{PREFIX}leaderboard',
    execute: async (_this, msg, args) => {
        let existingVotes = _this.db.get('voterCount').value();
        let existingVoter = _this.db.get('voterCount').find({id: msg.author.id}).value();
        let sortedVotes = aSort(existingVotes, 'total', {reverse: true});
        let authorTotal = 0;
        let authorPlace = "Never Voted";
        if(existingVoter) {
            authorTotal = existingVoter.total
        }
        console.log(authorTotal)
        console.log(sortedVotes)
        for(let i = 0; i < sortedVotes.length; i++) {
            if(sortedVotes[i].id === msg.author.id) authorPlace = i + 1;
        }
        console.log(sortedVotes.length)
        let topTen = [];
        for(let u = 0; u < 9; u++) {
            let userName = msg.channel.guild.members.get(sortedVotes[u].id).username;
            let discrim = msg.channel.guild.members.get(sortedVotes[u].id).discriminator;
            topTen.push(`#${u + 1} - ${userName}#${discrim} - ${sortedVotes[u].total} votes`);
        }
        console.log(topTen.join(", "))
        msg.channel.createMessage(`**Top Ten Voters**\n\`\`\`\n${topTen.join("\n")}\n\n#${authorPlace} - ${msg.author.username}#${msg.author.discriminator} - ${authorTotal} votes\n\`\`\``)
    },
};
