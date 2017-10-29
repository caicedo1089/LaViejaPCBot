    'use strict';

const Command = require('./Command')
//import Command from './Commands/Command' no soportado por NodeJS

class EquipoCommand extends Command {
    
    constructor(name, bot)
    {
        super(name, bot)

        console.log('Comando ' +  this.name)
        
    }

    excecute(chatId)
    {
        let $this = this
        let model = App.orm.model('Equipo')
        console.log('equipoModel:', model, App.orm.models['Equipo'])
        
        model.findById(1).then(equipo => {
            let strResult = `Nombre: ${equipo.get('nombre')}` 
            $this.bot.sendMessage(chatId, strResult)
        })
    }
}

module.exports = EquipoCommand