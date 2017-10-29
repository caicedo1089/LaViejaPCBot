module.exports = function(SEQUELIZE)
{
    return {
        model:{
            nombre: {
              type: SEQUELIZE.STRING,
              field: 'nombre'
            },
            estado: {
              type: SEQUELIZE.ENUM('Activo', 'Inactivo') ,
              field:'estado'
            }
        },
        relations:{
           //hasMany: ["World", {}] 
        },
        options:{
            freezeTableName: true
        }
    }
}