const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: null },
  password: { type: DataTypes.STRING, allowNull: null }
})

const Workspace = sequelize.define('workspace', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  owner: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING },
  headerBC: { type: DataTypes.STRING }
})

const WorkspaceUser = sequelize.define('workspaceUser', {})

Workspace.belongsToMany(User, { through: WorkspaceUser })
Workspace.belongsTo(User, { foreignKey: 'owner' })

User.belongsToMany(Workspace, { through: WorkspaceUser })

module.exports = { User, Workspace, WorkspaceUser }