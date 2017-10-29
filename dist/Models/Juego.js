module.exports = function(SEQUELIZE)
{
    return {
        model:{
            equipoRetador: {
              type: SEQUELIZE.STRING,
              field: 'equipoRetador'
            },
            estado: {
              type: SEQUELIZE.ENUM('Programado', 'Jugado', 'Cancelado') ,
              field:'estado'
            },
            fechaHora:{
              type:SEQUELIZE.DATE,
              field: 'fechaHora'
            },
            detalles: {
              type: SEQUELIZE.TEXT,
              field: 'detalles'
            },
            marcador: {
              field:'marcador',
              type: SEQUELIZE.STRING,
              allowNull: false,
              get: function () {
                  return this.getDataValue('marcador').split('-')
              },
              set: function (val) {
                 this.setDataValue('marcador', val.join('-'));
              }
            },
        },
        relations:{
           belongsTo: ['Equipo', {foreignKey: 'idLugar'}],
           belongsTo: ['Lugar', {foreignKey: 'idEquipoCreador'}]
        },
        options:{
            freezeTableName: true
        }
    }
}