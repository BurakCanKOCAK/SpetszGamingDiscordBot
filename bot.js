//Author   : Burak Can KOCAK
//Version  : V1.1
//E-Mail   : burak.c.kocak@gmail.com

//Config file
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.


var Discord = require('discord.js')
var bot = new Discord.Client()

var statusCode=0;

bot.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    //bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
    bot.user.setActivity(`or Not Playing...`);
});

setInterval(setStatus,30000);

function setStatus(){
    switch(statusCode)
    {
        case 0:
        bot.user.setActivity(`or Not Playing...`);
        break;

        case 1:
        bot.user.setActivity(` >help `);
        break;

        case 2:
        bot.user.setActivity(`or Not Playing...`);
        break;

        case 3:
        bot.user.setActivity(`SpetszGaming #1`);
        break;
    }
    statusCode++;
    if(statusCode==4)
    {
        statusCode=0;
    }
    console.log(statusCode);
}

bot.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setActivity(`Serving ${bot.guilds.size} server(s)`);
});

//When bot gets a message
bot.on('message', async message => {

    //console.log(message);
    var input = message.content.toUpperCase();
    var owner = message.author.username;

    //Salutation
    if (input === "HI" ||input === "SA" || input ==="S.A." || input ==="SELAMIN ALEYKUM") {
        message.reply('Aleykum Selam ' + owner + ' Baskan !');
    }

    //If message owner is a Bot then return/do not respond.
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toUpperCase();

    //Invite People.
    if (command === "ALL") {
        message.channel.members.forEach(element => {
            if (element.presence.status === 'online' || 'idle') {
                console.log(element.displayName)
            }
        });
        //message.channel.sendMessage('Aleykum Selam '+owner+' Baskan !');
    }

    //Ask for Ping
    if (command === "PING") {
        message.channel.members.forEach(element => {
            if (element.user.username == owner) {
                message.reply(' PING Degeriniz : ' + element.presence.client.ping + 'ms');
            }
        });
    }

    if (command ===  "SERVERPING") {
        const m = await message.channel.send("Ping?");
        m.reply(`Pong! Gecikme degeri : ${m.createdTimestamp - message.createdTimestamp}ms. Bot gecikmesi ise : ${Math.round(bot.ping)}ms`);
    }


    //Deletes messages 
    if (command ===  "SIL") {
        // This command removes all messages from all users in the channel, up to 100.

        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        // Ooooh nice, combined conditions. <3
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply(" silmek istedigin mesaj sayisini da bi belirtirsen sevinicem (Ornek : >sil 2). Minimum 2 , Maximum 100. ");

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({
            limit: deleteCount
        });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`...Haydaaa! ${error} hatasi yuzunden silemedim hocam, kusura bakma :/`));
    }

    //
    if(command === "SOYLE") {
        // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        // To get the "message" itself we join the `args` back into a string with spaces: 
        const sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o=>{}); 
        // And we get the bot to say the thing: 
        message.channel.send(sayMessage);
      }

    //Command list request
    if(command === "HELP"){

    }
});


//Login using Oauth2
bot.login(config.token);