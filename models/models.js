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

const WorkspaceMember = sequelize.define('workspaceMember', {
  canAddCandidate: { type: DataTypes.BOOLEAN, defaultValue: false },
  role: { type: DataTypes.STRING, allowNull: false }
})

Workspace.belongsToMany(User, { through: WorkspaceMember })
Workspace.belongsTo(User, { foreignKey: 'owner' })

User.belongsToMany(Workspace, { through: WorkspaceMember })

module.exports = { User, Workspace, WorkspaceMember }