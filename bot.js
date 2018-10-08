//Author   : Burak Can KOCAK
//Version  : V1.1
//E-Mail   : burak.c.kocak@gmail.com

//Config file
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

//Discord lib
var Discord = require('discord.js')
var bot = new Discord.Client()

//Promises
var Promise = require('promise');

//db
const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');

//Data scraping from websites
let Parser = require('rss-parser');
let parser = new Parser();

//WebHooks
const Webhook = require("webhook-discord")
const Hook = new Webhook("https://discordapp.com/api/webhooks/488217879997579265/jPf2yZmcK604PzNg3aubK_LzvkgSGmg2sp4i6wRjx7dHNcT6BFl1kShwt1A408yw6k0a")

var statusCode=0;
var isBotReady=false;

function initDB(){
    db.prepare("CREATE TABLE if not exists UserExperience (ROWID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,flatId INT, info TEXT)").run();
}

bot.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    //bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
    bot.user.setActivity(`or Not Playing...`);
    isBotReady=true;
    var itemCount=0;
    (async () => {
        let feed = await parser.parseURL('https://www.ntv.com.tr/gundem.rss');
        console.log(feed.title);
        var msgList=[];
        const channel = bot.channels.find('name',"news");
        itemCount= feed.items.reverse().length-3;
        feed.items.slice().reverse().forEach(item => {
          console.log(item.title + ':' + item.link)
          const newsMsg=new Discord.RichEmbed()
          newsMsg.setTitle(item.title)
          newsMsg.setURL(item.link)
          newsMsg.setThumbnail(item.content.split('\"')[1])
          newsMsg.setDescription(item.contentSnippet)
          msgList.push(newsMsg);
        });

        for(var i=0;i<5;i++){
                channel.send(msgList[4-i])
        }
      })();
});

setInterval(setStatus,30000);
//setInterval(checkNews,11000);

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

    if(input.indexOf("?ATTACK") > -1 && message.author.username=="lazkopat53"){
        message.reply(" Hop zenci sikerim seni !");
    }
    //else if(input.indexOf("?") > -1){
    //    message.reply("Arkadasim yerli BOT kullanalim lutfen ! ");
    //}



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

    if(command === "HELP"){
        const newsMsg=new Discord.RichEmbed()
        newsMsg.setTitle("Help")
        newsMsg.setAuthor("SpetszGamingBot")
        newsMsg.setDescription("Komut listesi asagidaki gibidir;")
        newsMsg.addField(">ping :", "Ping testi                     ",true)
        newsMsg.addField(">serverping :", "Server ping testi",true)
        newsMsg.addField(">sil x :", "Sondan x tane mesaji siler",true)
        newsMsg.addField(">soyle x :", "Herhangi birseyi soyletebilirsiniz",true)
        newsMsg.setFooter("SpetszGamingBot" + ' | by CRY0SS')
        message.channel.send(newsMsg);
    
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
        if (!deleteCount || deleteCount < 1 || deleteCount > 100)
            return message.reply(" silmek istedigin mesaj sayisini da bi belirtirsen sevinicem (Ornek : >sil 1). Minimum 1 , Maximum 100. ");

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({
            limit: deleteCount+1
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