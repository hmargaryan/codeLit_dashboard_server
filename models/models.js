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

const Task = sequelize.define('task', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  time: { type: DataTypes.INTEGER },
  difficulty: { type: DataTypes.STRING },
  template: { type: DataTypes.TEXT },
  additionalInfo: { type: DataTypes.TEXT }
})

Workspace.belongsToMany(User, { through: WorkspaceMember })
Workspace.belongsTo(User, { foreignKey: 'owner' })
Workspace.hasMany(Task)

User.belongsToMany(Workspace, { through: WorkspaceMember })

Task.belongsTo(Workspace)


module.exports = { User, Workspace, WorkspaceMember, Task }
