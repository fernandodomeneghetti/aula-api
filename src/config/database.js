const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'aula.sqlite',
    logging: false
});

sequelize.authenticate() 
    .then(() => {
        console.log('Conexão com banco estabelecida.');
        return sequelize.sync();
    })
    .catch(err => {
        console.error('Erro na conexão:', err);
    });

module.exports = sequelize;