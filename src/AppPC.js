class AppPC {

    constructor(token, pkg)
    {
        //Guardamos la información del paquete
        this.pkg = pkg

        //Manejo del lenguaje
        this.lang = function(str)
        {
            //Hace la traducción
            return str
        }

        //Agregamos las configuraciones
        this.conf = this.iniConf() 

        //Inicializamos el bot
        this.bot = this.initBot(token)

        //Manejo de sessiones
        this.session = {}
    }

    //Agregamos las configuraciones
    iniConf()
    {
        let conf = require('./Config')

        return conf
    }

    //Crea e inicializa todo el bot
    initBot(token, type = 'telegram')
    {
        let bot

        switch (type) 
        {
            case 'telegram':
                let TelegramBot = require('node-telegram-bot-api')
                bot = new TelegramBot(token, {polling: true})
                break
        }
        
        this.addCommands(bot)

        return bot
    }

    //Agregamos los comandos
    addCommands(bot)
    {   
        let objAllCmds = {}
        let allCommands = this.conf.bot.commands

        for(let i=0; i<allCommands.length; ++i)
        {
            let command = allCommands[i]

            try 
            {
                let instanceCommand = require(`./Commands/${command}Command`)
                objAllCmds[command] = new instanceCommand(command, bot)

                console.log(this.lang(`El comando "${command}" fue cargado.`))
            } 
            catch (e) 
            {
                if (e.code === 'MODULE_NOT_FOUND') 
                {
                    console.log(this.lang(`El comando "${command}" no pudo cargarse.`))
                }
                else
                {
                    console.log(this.lang(`El comando "${command}" presenta otro error.`), e)
                }
            }
        }

        bot.on(
            'message', 
            function(msg)
            {
                const chatId = msg.chat.id
                //console.log('msg:', msg)
                //Si lo reconoce el api, es decir tiene entities
                if(msg.entities)
                {
                    let entities = msg.entities
                    let entitieCommand = entities.shift()
                    
                    if(entitieCommand.type == 'bot_command')
                    {
                        let command = msg.text.substring(1, entitieCommand.length)

                        if(objAllCmds[command])
                        {
                            /*botstrResp = */ objAllCmds[command].excecute(chatId, msg)    
                        }
                        else
                        {
                            bot.sendMessage(chatId, App.lang('Comando inexistente'))
                        }
                    }
                    else
                    {
                        bot.sendMessage(chatId, App.lang('Comando no encontrado'))
                    }
                }
                else
                {
                    let command = App.session[chatId].command
                    
                    objAllCmds[command].excecute(chatId, msg)

                    //bot.sendMessage(chatId, App.lang('Funcionalidad no soportada'))
                }
            }
        )
    }
}
 
module.exports = AppPC