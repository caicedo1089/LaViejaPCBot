let config = {
    db: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'avila',
      port: 3306, //no lo utilizo
      debug: true, //no lo utilizo
      //socket: '/var/run/mysqld/mysqld.sock', // For linux... //no lo utilizo
      //socket: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock' //For mac... //no lo utilizo
    },
    bot:{
        name: 'AvilaFCBot',
        commands: [
            'nombre',
            'equipo',
        ]
    },
    /*site: {
      url: 'http://localhost:3000',
      title: 'Codejobs',
      language: 'en',
      html: {
        engine: 'jade',
        minify: false,
        bundle: true
      }
    },
    application: {
      controllers: {
        default: 'blog',
        current: ''
      },
      langs: ['en', 'es', 'fr', 'it', 'pt', 'ge', 'ch', 'jp'],
      languages: 'en|es|fr|it|pt|ge|ch|jp'
    },
    server: {
      environment: 'local',
      files: {
        filter: [
          'favicon.ico', 'img', 'js', 'images', 'stylesheets', 'css', 'themes'
        ]
      },
      debug: true
    }*/
};
   
module.exports = config;