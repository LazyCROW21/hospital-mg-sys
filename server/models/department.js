const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Department = sequelize.define('Department', {
  name: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  parentDepartmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

Department.hasMany(Department, { foreignKey: 'parentDepartmentId' });
Department.belongsTo(Department, { as: 'parentDepartment' });

module.exports = Department;