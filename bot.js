const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,             
        GatewayIntentBits.GuildMessages,        
        GatewayIntentBits.GuildVoiceStates,     
    ]
});

const TOKEN = 'BOTTOKEN';  // Bot tokenınızı buraya yazın
const VOICE_CHANNEL_ID = 'KANALID';  // Botun katılacağı ses kanalının ID'si

client.once('ready', () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
});


client.on('voiceStateUpdate', (oldState, newState) => {
 
    if (!oldState.channel && newState.channel) {
   
        if (newState.channel.id === VOICE_CHANNEL_ID) {
            console.log(`Kullanıcı ${newState.member.user.tag} ses kanalına katıldı.`);
            
          
            const connection = joinVoiceChannel({
                channelId: newState.channel.id,
                guildId: newState.guild.id,
                adapterCreator: newState.guild.voiceAdapterCreator,
            });

            
            const audioPath = path.join(__dirname, 'ses.mp3'); // Ses dosyasının ismi

            if (fs.existsSync(audioPath)) {
             
                const audioResource = createAudioResource(audioPath);
                const player = createAudioPlayer();

                player.play(audioResource);
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy(); 
                });
            } else {
                console.log('Ses dosyası bulunamadı!');
            }
        }
    }
});

client.login(TOKEN);
