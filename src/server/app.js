/* eslint-disable consistent-return */
const express = require('express');
const fs = require('fs-extra');

const app = express();
const bodyParser = require('body-parser');
const Eris = require('eris');
const path = require('path');

const utils = require(`${__dirname}/../util`);
const routes = require(`${__dirname}/routes`);

const events = require(`${__dirname}/../bot/events`);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const helmet = require('helmet');

const scheduler = require('node-schedule');

/** Express Webserver Class */
class TechiesBot {
    /**
   * Starting server and bot, handling routing, and middleware
   * @param {object} c - configuration json file
   */
    constructor(c) {
        this.db = db;
        /** Setting LowDB Defaults */
        db.defaults({
            voters: [],
            bans: [],
            roles: [],
            voterRole: {},
            voterCount: []
        })
            .write();
        /** Defintions */
        this.utils = utils;
        this.log = utils.log;
        this.auth = utils.auth;
        this.randomToken = utils.randomToken;
        this.mimeType = utils.mimeType;
        this.c = c;
        this.c.discordToken && this.c.discordToken !== undefined && this.c.discrdToken !== null
            ? this.runDiscordBot()
            : this.log.verbose('No Discord Token provided...\nContinuing without Discord connection...');
        this.app = app;
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '/views'));
        this.app.use(helmet());
        this.app.use(bodyParser.text());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));

        // routing
        this.app.post('/vote', routes.vote.bind(this));
        this.app.post('*', routes.e404.bind(this));
        this.app.get('*', routes.e404.bind(this));

        // Begin server
        this.startServer();

        scheduler.scheduleJob('removeVoter', '0 0 * * *', () => {
            let currentVoters = this.db.get('voters').value();
            for (let i = 0; i < currentVoters.length; i++) {
                let currentDate = new Date(this.currentDate());
                let voterDate = new Date(currentVoters[i].date);
                let timeDifference = Math.abs(currentDate.getTime() - voterDate.getTime());
                let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
                if(differentDays > 3) {
                    this.db.get('voters').remove({id: currentVoters[i].id}).write();
                    let g = this.bot.guilds.filter(guild => guild.id === this.c.guildID)[0];
                    let voterRole = this.db.get('voterRole').value();
                    let allRoles = this.db.get('roles').value();
                    g.removeMemberRole(currentVoters[i].id, voterRole.id).catch(e => { return });
                    for (let u = 0; u < allRoles.length; u++) {
                        g.removeMemberRole(currentVoters[i].id, allRoles[i].id).catch(e => { return })
                    }
                }
            }
        })
    }

    /** Booting up the Discord Bot
   * @returns {void}
   */
    async runDiscordBot() {
        this.bot = new Eris(this.c.discordToken, {
            maxShards: 'auto',
        });
        this.log.verbose('Connecting to Discord...');
        this.commands = [];
        this.loadCommands();
        this.bot
            .on('messageCreate', events.messageCreate.bind(this))
            .on('ready', events.ready.bind(this));
        this.bot.connect();
    }

    /** Loads the commands for the discord bot to use in /bot/commands
   * into an array defined before the calling of this function
   * @returns {void}
   */
    async loadCommands() {
        fs.readdir(`${__dirname}/../bot/commands`, (err, files) => {
        /** Commands are pushed to an array */
            files.forEach(file => {
                if (file.toString().includes('.js')) {
                    // eslint-disable-next-line global-require
                    this.commands.push(require(`${__dirname}/../bot/commands/${file.toString()}`));
                    this.log.verbose(`Loaded Command: ${file.toString()}`);
                }
            });
        });
    }

    /** Start's the Express server
   * @returns {void}
   */
    async startServer() {
        this.app.listen(this.c.port, '0.0.0.0', () => {
            this.log.success(`Server listening on port ${this.c.port}`);
        });
    }

    async currentDate() {
        const date = new Date();
        const day = date.getDay() + 1;
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }
}

module.exports = TechiesBot;