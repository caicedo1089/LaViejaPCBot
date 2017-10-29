module.exports = function(SEQUELIZE)
{
    return {
        model:{
            nombre: {
              type: SEQUELIZE.STRING,
              field: 'nombre'
            },
            direccion: {
              type: SEQUELIZE.TEXT,
              field: 'direccion'
            },
            detalles: {
              type: SEQUELIZE.TEXT,
              field: 'detalles'
            },
            estado: {
              type: SEQUELIZE.ENUM('Activo', 'Inactivo') ,
              field:'estado'
            },
            latitud: {
              type: SEQUELIZE.STRING,
              field:'latitud'
            },
            longitud: {
              type: SEQUELIZE.STRING,
              field:'longitud'
            },
        },
        relations:{},
        options:{
            freezeTableName: true
        }
    }
}