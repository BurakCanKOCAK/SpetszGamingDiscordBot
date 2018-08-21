//Author   : Burak Can KOCAK
//Version  : V1.0
//E-Mail   : burak.c.kocak@gmail.com

var Discord = require('discord.js')
var bot = new Discord.Client()

//Prefix is used for command.
var prefix = ">";


//When bot gets a message
bot.on('message', message => {

    //console.log(message);
    var input = message.content.toUpperCase();
    var owner = message.author.username;

    //Salutation
    if (input === prefix + 'HI' || input === "SA" || input === 'S.A.' || input.trim() === "SELAMIN ALEYKUM") {
        message.channel.sendMessage('Aleykum Selam ' + owner + ' Baskan !');
    }

    //Invite People.
    if (input === prefix + 'ALL') {
        message.channel.members.forEach(element => {
            if (element.presence.status === 'online' || 'idle') {
                console.log(element.displayName)
            }
        });
        //message.channel.sendMessage('Aleykum Selam '+owner+' Baskan !');
    }
});


//Login using Oauth2
bot.login('NDgxNTY2Mjk4NzI4NTYyNjg4.Dl4eJw.92q0l0e3Jr8W5TVCoWYZNynGawQ');