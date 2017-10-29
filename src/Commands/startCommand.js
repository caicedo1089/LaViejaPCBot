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

        if(!App.session[chatId])
        {
            App.session[chatId] = {
                command: this.name,
                funtionExcecute: 'displayMenu',
                strBoard: this.global.board.default,
                turn: 'user1',
                attempts: this.global.board.attempts
            }

            misArguments.push(
                App.lang('Hola ') + msg.from.first_name + '\n'
            )
        }
    
        misArguments = this[App.session[chatId].funtionExcecute].apply(this, [msg].concat(misArguments))

        misArguments = [chatId].concat(misArguments)

        $this.bot.sendMessage.apply($this.bot, misArguments)
    }

    displayMenu(msg, chatId, strResult, objResultParseMode)
    {
        strResult = strResult || ''
        objResultParseMode = objResultParseMode || {}
        
        strResult += App.lang('Por favor seleccione una opción:')

        objResultParseMode['reply_markup'] = {
            "keyboard": [
                ["Jugar"],   
                ["Acerca de"]
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

                App.session[chatId].strBoard = strBoard.substr(0, index) + playValue + strBoard.substr(index + playValue.length);
                
                App.session[chatId].turn  = App.session[chatId].turn  == 'user1'? 'user2' : 'user1'
                
                App.session[chatId].attempts--
            }
        }

        strResult += App.lang('Mostrar tablero:')
        strResult += this.viewBoard(App.session[chatId].strBoard)
        
        objResultParseMode['reply_markup'] = {
            "keyboard": this.viewOptions(App.session[chatId].strBoard)
        }
        
        //Delego la nueva función
        //App.session[chatId].funtionExcecute = 'excecuteMenu'

        if(App.session[chatId].attempts < 1)
        {
            strResult += App.lang('\n\nJuego Terminado')
            App.session[chatId].funtionExcecute = 'displayMenu'

            //Reset de los valores
            App.session[chatId].strBoard = this.global.board.default,
            App.session[chatId].turn = 'user1',
            App.session[chatId].attempts = this.global.board.attempts
        }

        return [strResult, objResultParseMode]
    }

    viewBoard(strBoard)
    {
        let arrResult = []

        for(let i=0; i<this.global.board.rows; ++i)
        {
            let row = []
            
            for(let j=0; j<this.global.board.columns; ++j)
            {
                row.push(strBoard[i*this.global.board.rows+j])
            }

            arrResult.push(
                row.join('|') + '\n'
            )
        }
        return ('\n' + arrResult.join('___\n'))
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