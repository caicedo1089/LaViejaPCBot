//http://jeydotc.github.io/blog/2012/10/30/EXPRESS-WITH-SEQUELIZE.html

'use strict';

class SingletonORM {
    constructor()
    {
        this.SEQUELIZE = require("sequelize")
        this.sequelize = null
        this.modelsPath = ""
        this.models = {}
        this.relationships = {}
    }

    setup (path, database, username, password, opts)
    {
        this.modelsPath = path

        switch (arguments.length) 
        {
            case 3:
                this.sequelize = new this.SEQUELIZE(database, username)
                break;
            case 4:
                this.sequelize = new this.SEQUELIZE(database, username, password)
                break;
            case 5:
                this.sequelize = new this.SEQUELIZE(database, username, password, opts)
                break;
        }
      
        this.init()
    }

    model(name)
    {
        return this.models[name]
    }

    SEQUELIZE()
    {
        return this.SEQUELIZE
    }

    init() 
    {
        let filesystem = require('fs')
        let $this = this
        
        filesystem.readdirSync(this.modelsPath).forEach(function(name){
            var object = require($this.modelsPath + "/" + name)($this.SEQUELIZE);
            var options = object.options || {}
            let modelName = name.replace(/\.js$/i, "");
            //console.log('modelName:', modelName)
            //console.log('modelName:', modelName, object)
            $this.models[modelName] = $this.sequelize.define(modelName, object.model, options)

            //console.log('modelName:', $this.models[modelName])
            
            if('relations' in object)
            {
                $this.relationships[modelName] = object.relations;
            }
        })
        //console.log(models)
        for(let modelName in $this.relationships)
        {
            var relation = $this.relationships[modelName];
            for(var relName in relation)
            {
                var related = relation[relName];
                //console.log(modelName, relName, related)
                //$this.models[modelName][relName](related[0], related[1]);
                $this.models[modelName][relName]($this.models[related[0]], related[1]);
            }
        }
    }

    static getInstance()
    {
        if(this.instance === undefined)
        {
            this.instance = new SingletonORM()
        }

        return this.instance;
    }

}

module.exports = SingletonORM.getInstance()