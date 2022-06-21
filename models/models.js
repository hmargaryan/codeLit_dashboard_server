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
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
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

const Template = sequelize.define('template', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  data: { type: DataTypes.JSONB, allowNull: false }
})

const Candidate = sequelize.define('candidate', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false }
})

const Interview = sequelize.define('interview', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  comments: { type: DataTypes.TEXT },
  result: { type: DataTypes.JSONB }
})

Workspace.belongsToMany(User, { through: WorkspaceMember })
Workspace.belongsTo(User, { foreignKey: 'owner' })
Workspace.hasMany(Task)
Workspace.hasMany(Template)
Workspace.hasMany(Candidate)
Workspace.hasMany(Interview)

WorkspaceMember.hasMany(Interview)
WorkspaceMember.belongsTo(User)

User.belongsToMany(Workspace, { through: WorkspaceMember })

Task.belongsTo(Workspace)

Template.belongsTo(Workspace)
Template.hasMany(Interview)

Candidate.belongsTo(Workspace)
Candidate.hasMany(Interview)

Interview.belongsTo(Workspace)
Interview.belongsTo(Candidate)
Interview.belongsTo(WorkspaceMember)
Interview.belongsTo(Template)

module.exports = { User, Workspace, WorkspaceMember, Task, Template, Candidate, Interview }
