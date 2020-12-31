module.exports = {
    command: 'restart',
    description: 'restart the webserver',
    syntax: '{PREFIX}restart',
    execute: async (_this, msg) => {
        msg.channel.createMessage({ embed: {
            description: `<a:Success:585821631495274499> Restarting`,
            color: 0x4ACC85
        }}).then(() => {
            process.exit();
        });
    },
};