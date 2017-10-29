const Sequelize= require('Sequelize');
let sequelize = new Sequelize(
  'avila', 
  'root', 
  '', 
  {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
  }
)

/*var Persona = sequelize.define('Persona', {
    nombre: {
      type: Sequelize.STRING,
      field: 'nombre'
    },
    edad: {
      type: Sequelize.INTEGER,
      field:'edad'
    }
  }, {
    freezeTableName: true
  });

var p1=Persona.sync({force: true}).then(function () {
    
    return Persona.create({
        nombre: 'Pedro Caicedo',
        edad: 28
    });
 });

var p2=Persona.sync().then(function () {
    
   return Persona.create({
     nombre: 'gema',
     edad: 30
   });
 });

 setTimeout(function() {
     
    Persona.findAll().then(function (personas) {
        
        personas.forEach(function(elemento) {
            
            console.log(elemento.dataValues);
            
        })
    });

 }, 3000); */

var Equipo = sequelize.define('Equipo', {
  nombre: {
    type: Sequelize.STRING,
    field: 'nombre'
  },
  estado: {
    type: Sequelize.ENUM('Activo', 'Inactivo') ,
    field:'estado'
  }
}, {
  freezeTableName: true
});

/*var e1=Equipo.sync({force: true}).then(function () {
  
  return Equipo.create({
      nombre: 'Ávila F.C.',
      estado: 'Activo'
  });

});*/

var Lugar = sequelize.define('Lugar', {
  nombre: {
    type: Sequelize.STRING,
    field: 'nombre'
  },
  direccion: {
    type: Sequelize.TEXT,
    field: 'direccion'
  },
  detalles: {
    type: Sequelize.TEXT,
    field: 'detalles'
  },
  estado: {
    type: Sequelize.ENUM('Activo', 'Inactivo') ,
    field:'estado'
  },
  latitud: {
    type: Sequelize.STRING,
    field:'latitud'
  },
  longitud: {
    type: Sequelize.STRING,
    field:'longitud'
  },
}, {
  freezeTableName: true
});

/*var l1=Lugar.sync({force: true}).then(function () {
  
  return Lugar.create({
      nombre: 'Creativo F.C.',
      direccion: 'Calle 193 # 9-79, Bogotá, Colombia',
      detalles: 'Cancha 7',
      estado: 'Activo',
      latitud: '4.770308',
      longitud: '-74.0404967'
  });

});*/

var Juego = sequelize.define('Juego', {
  equipoRetador: {
    type: Sequelize.STRING,
    field: 'equipoRetador'
  },
  estado: {
    type: Sequelize.ENUM('Programado', 'Jugado', 'Cancelado') ,
    field:'estado'
  },
  fechaHora:{
    type:Sequelize.DATE,
    field: 'fechaHora'
  },
  detalles: {
    type: Sequelize.TEXT,
    field: 'detalles'
  },
  marcador: {
    //type: Sequelize.ARRAY(Sequelize.TEXT),
    field:'marcador',
    type: Sequelize.STRING,
    allowNull: false,
    get: function () {
        return this.getDataValue('marcador').split('-')
    },
    set: function (val) {
       this.setDataValue('marcador', val.join('-'));
    }
  },
}, {
  freezeTableName: true
});
console.log('Juego:', Juego)
Juego.belongsTo(Lugar, {foreignKey: 'idLugar'})
Juego.belongsTo(Equipo, {foreignKey: 'idEquipoCreador'})

/*var j1=Juego.sync({force: true}).then(function () {
  
  return Juego.create({
      equipoRetador: 'Santa Teresa F.C.',
      estado: 'Programado',
      fechaHora: '2017-08-21 10:00:00',
      detalles: 'Vanessa Gamirra también asistirá.',
      marcador: [],
      idLugar: 1,
      idEquipoCreador: 1
  });

});*/