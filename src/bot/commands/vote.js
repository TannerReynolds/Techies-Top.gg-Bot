module.exports = {
    command: 'vote',
    description: 'Get the link to vote for Techies Hideaway',
    syntax: '{PREFIX}vote',
    execute: async (_this, msg) => {
        msg.channel.createMessage({ embed: {
            description: 'https://top.gg/servers/286834982494666752/vote',
            color: 0x8A53FC
        }})
    },
};