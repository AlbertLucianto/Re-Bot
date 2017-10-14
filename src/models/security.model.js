import Sequelize from 'sequelize';

const Security = db => (
  db.define('Security', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notNull: true,
      },
    },
    ticker: Sequelize.STRING(15) ,
    description: Sequelize.STRING(100),
    assettype: Sequelize.STRING(5),
    countrycode: Sequelize.STRING(2),
    morningstarcategory: Sequelize.STRING(51),
    fundfamilyname: Sequelize.STRING(65),
    cusip: Sequelize.STRING(9),
    isin: Sequelize.STRING(12),
    type: Sequelize.STRING(25),
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,
  
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
  
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
    tableName: 'security',
  })
);

export default Security;