// models/rental.js
module.exports = (sequelize, DataTypes) => {
  const Rental = sequelize.define('Rental', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id'
      }
    },
    renter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    rent_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    return_date: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'rentals',
    timestamps: false
  });

  Rental.associate = models => {
    Rental.belongsTo(models.Book, { foreignKey: 'book_id' });
    Rental.belongsTo(models.User, { foreignKey: 'renter_id' });
  };

  return Rental;
};
