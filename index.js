const Discord = require('discord.js');
const Rcon = require('modern-rcon');

const client = new Discord.Client();
const config = require('./config.json');

const rcon = new Rcon(config.ip, config.port, config.password, 5000);

client.on('message', (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith(`${config.prefix}${config.keyWord} list`)) {
    rcon.connect().then(() => {
      return rcon.send('whitelist list');
    }).then(res => {
      return msg.channel.send(res);
    }).then(() => {
      return rcon.disconnect;
    });
  }
  if (msg.content.startsWith(`${config.prefix}${config.keyWord} add `)) {
    const name = getName(msg.content);
    rcon.connect().then(() => {
      return rcon.send(`whitelist add ${name}`);
    }).then(res => {
      const channel = msg.guild.channels.cache.find(channel => channel.name === config.channel);
      msg.channel.send(res);
      return channel.send(`${msg.author} added ${name} to the whitelist!`);
    }).then(() => {
      return rcon.disconnect;
    });
  }
});

function getName(content) {
  return content.substring(9, content.length)
}

client.once('ready', () => {
  console.log('Bot ready!')
});

client.login(config.token).catch(console.error);
