const { WorkspaceMember } = require('../models/models')

const checkWorkspaceMember = async (req, res, next) => {
  try {
    const { workspaceId, id } = req.user
    const user = await WorkspaceMember.findOne({
      where: {
        workspaceId,
        userId: id
      }
    })
    if (!user) {
      return res.status(403).json({ message: 'Отказано в доступе' })
    }
    req.user.role = user.role
    next()
  } catch (error) {
    return res.status(403).json({ error })
  }
}

module.exports = checkWorkspaceMember