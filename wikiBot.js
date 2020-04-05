'use strict';

/**
 * Wiki bot, à chaque fois que vous envoyez "!wiki <mots>", il renvoie une définition du mot tirée de Wikipedia.
 */

const Discord = require('discord.js');
const axios = require('axios').default;
const cheerio = require('cheerio');

const bot = new Discord.Client();

bot.on('message', message => {
    if(/^!wiki/.test(message.content)){
        const search = message.content.replace("!wiki", "");
        let params = {
            origin: "*",
            action :"parse",
            page: search,
            format: "json"
        }
        let url = "https://fr.wikipedia.org/w/api.php?";
        Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
        axios.get(url)
            .then((response) => {
                if(response.status === 200){
                    let data = response.data["parse"];
                    let $ = cheerio.load(data.text["*"]);
                    message.channel.send("**" + data.title + "**");
                    message.channel.send($(".mw-parser-output > p:nth-child(4)").text());  
                }
            }, () => {
                message.channel.send("Je n'ai pas trouvé d'article wikipedia pour votre mot ! :cry:");
            })
        
    }
});

bot.login('tokens');