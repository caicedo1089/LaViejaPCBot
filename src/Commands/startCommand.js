    'use strict';

const Command = require('./Command')
//import Command from './Commands/Command' no soportado por NodeJS

class StartCommand extends Command {
    
    constructor(name, bot)
    {
        super(name, bot)

        this.global = {
            board:{
                rows: 3,
                columns: 3,
                chars: {default: ' ', user1: 'O', user2: 'X'},
                default: '',
                valid: function(strBoard)
                {
                    return true
                }
            }
        }
        
        this.global.board.attempts = this.global.board.rows*this.global.board.columns
        
        //Valor por defecto
        for(let i=0; i<(this.global.board.attempts); ++i)
        {
            this.global.board.default += this.global.board.chars.default
        }
    }

    excecute(chatId, msg)
    {
        let $this = this
        let misArguments = [chatId]

        //En caso que se inicie el chat
        if(!App.session[chatId])
        {
            let username = msg.chat.username || `${msg.chat.first_name}_${msg.chat.last_name}`

            App.session[chatId] = {
                command: this.name,
                funtionExcecute: 'displayMenu',
                strBoard: this.global.board.default,
                turn: Math.floor((Math.random() * 2) + 1) == 1? 'user1' : 'user2',
                attempts: this.global.board.attempts,
                user1: username,
                user2: username
            }

            misArguments.push(`${App.lang('Hola')} <b>${msg.from.first_name}</b>\n\n`)
        }
        
        //Se ejecuta la función de acuerdo al último estado
        misArguments = this[App.session[chatId].funtionExcecute].apply(this, [msg].concat(misArguments))

        //Se arma la respuesta
        misArguments = [chatId].concat(misArguments)
        
        //Se envía el mensaje
        $this.bot.sendMessage.apply($this.bot, misArguments)
    }

    displayMenu(msg, chatId, strResult, objResultParseMode)
    {
        strResult = strResult || ''
        objResultParseMode = objResultParseMode || {}
        
        strResult += App.lang('Por favor seleccione una opción:')

        objResultParseMode['parse_mode'] = 'HTML'
        objResultParseMode['reply_markup'] = {
            "keyboard": [
                ["Jugar"],   
                //["Acerca de"]
            ]
        }

        //Delego la nueva función
        App.session[chatId].funtionExcecute = 'excecuteMenu'

        return [strResult, objResultParseMode]
    }

    excecuteMenu(msg, chatId, strResult, objResultParseMode)
    {
        strResult = strResult || ''
        objResultParseMode = objResultParseMode || {}
        
        if(msg.text != 'Jugar')
        {
            if(msg.text==this.global.board.chars.user1 || msg.text==this.global.board.chars.user2)
            {
                strResult += App.lang('Esa opción ya fué seleccionada\n\n')
            }
            else
            {
                let index = parseInt(msg.text) - 1
                let strBoard = App.session[chatId].strBoard
                let playValue = this.global.board.chars[App.session[chatId].turn]

                //En el caso que envíe varias veces la misma opción
                if( App.session[chatId].strBoard[index] == this.global.board.chars.user1 || 
                    App.session[chatId].strBoard[index] == this.global.board.chars.user2 )
                {
                    strResult += App.lang('Esa opción ya fué seleccionada\n\n')
                }
                else
                {
                    App.session[chatId].strBoard = strBoard.substr(0, index) + playValue + strBoard.substr(index + playValue.length);
                    
                    App.session[chatId].turn  = App.session[chatId].turn  == 'user1'? 'user2' : 'user1'
                    
                    App.session[chatId].attempts--
                }
            }
        }
        else
        {
            //Se debe sortiar el turno 
        }
        
        strResult += `<b>${'Tú'} (${this.global.board.chars.user1}) vs ${App.session[chatId].user2} (${this.global.board.chars.user2})</b>\n\n` 
        strResult += `<i>${App.session[chatId][App.session[chatId].turn]}</i> es su turno.\n\n`
        strResult += `<pre>${this.viewBoard(App.session[chatId].strBoard, 6)}</pre>`
       
       
        objResultParseMode['parse_mode'] = 'HTML'
        
        objResultParseMode['reply_markup'] = {
            "keyboard": this.viewOptions(App.session[chatId].strBoard)
        }
        
        //Delego la nueva función
        //App.session[chatId].funtionExcecute = 'excecuteMenu'

        if(App.session[chatId].attempts < 1)
        {
            strResult += App.lang('\n\nJuego Terminado!!!\n')
            //App.session[chatId].funtionExcecute = 'displayMenu'

            //Reset de los valores
            App.session[chatId].strBoard = this.global.board.default,
            App.session[chatId].turn = 'user1',
            App.session[chatId].attempts = this.global.board.attempts

            objResultParseMode['reply_markup'] = {
                "keyboard": [
                    ["Jugar"],   
                    //["Acerca de"]
                ]
            }
        }

        return [strResult, objResultParseMode]
    }

    viewBoard(strBoard, maxLength, intRows, intColumms)
    {
        intRows = intRows || this.global.board.rows
        intColumms = intColumms || this.global.board.columns
        maxLength = maxLength || 28

        let arrResult = []
        let intCenter = 0
        
        for(let i=0; i<intRows; ++i)
        {
            let row = []
            for(let j=0; j<intColumms; ++j)
            {
                row.push(strBoard[i*intRows+j])
            }
            
            
            row = row.join('|')
            
            //Centramos
            intCenter = (maxLength - row.length)/2 - 1
            for(let k=0; k<intCenter; ++k)
            {
                row = ' ' + row
            }
            
            arrResult.push(
                row + '\n'
            )
        }
        
        //Se parador
        let separador = '-----\n' //Este separador debe ser dinámico
        for(let k=0; k<intCenter; ++k)
        {
            separador = ' ' + separador
        }
        
        return (arrResult.join(separador))
    }

    
    viewOptions(strBoard)
    {
        let arrResult = []

        for(let i=0; i<this.global.board.rows; ++i)
        {
            let row = []
            
            for(let j=0; j<this.global.board.columns; ++j)
            {
                let index = i*this.global.board.rows+j, val = strBoard[index]
                row.push(
                    val == ' '? `${(index) + 1}` : val
                )
            }

            arrResult.push(row)
        }

        return arrResult
    }
}

module.exports = StartCommand