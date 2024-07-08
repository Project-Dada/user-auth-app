const sequelize = require('../config/config');
const User = require('./user');
const Organisation = require('./organisation');

User.belongsToMany(Organisation, { through: 'UserOrganisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisations' });

sequelize.sync({ force: false });

module.exports = { User, Organisation };
