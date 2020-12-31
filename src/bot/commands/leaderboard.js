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
        let authorPlace = "-- / Never Voted";
        if(existingVoter) {
            authorTotal = existingVoter.total
        }
        for(let i = 0; i < sortedVotes.length; i++) {
            if(sortedVotes[i].id === msg.author.id) authorPlace = i + 1;
        }
        let topTen = [];
        for(let u = 0; u < 10; u++) {
            let userName;
            let discrim;
            if(u < sortedVotes.length) {
                if(msg.channel.guild.members.get(sortedVotes[u].id)) {
                    userName = msg.channel.guild.members.get(sortedVotes[u].id).username;
                    discrim = msg.channel.guild.members.get(sortedVotes[u].id).discriminator;
                    topTen.push(`#${u + 1} - **${userName}#${discrim}** - ${sortedVotes[u].total} votes`);
                } else {
                    userName = `**Member Left: ${sortedVotes[u].id}**`
                    topTen.push(`#${u + 1} - ${userName} - ${sortedVotes[u].total} votes`);
                }
            }
        }
        let avi = 'https://cdn.tanners.space/mq8a'
        if(msg.author.avatarURL) avi = msg.author.avatarURL;
        msg.channel.createMessage({ embed: {
            title: 'Techies Hideaway',
            fields: [{
                name: "Top Ten Voters",
                value: topTen.join("\n"),
                inline: false
            }],
            author: {
                icon_url: avi,
                name: `#${authorPlace} - ${msg.author.username}#${msg.author.discriminator} - ${authorTotal} votes`
            },
            color: 0x8A53FC
        }})
    },
};
