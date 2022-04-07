const validation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body)
    next()
  } catch (error) {
    return res.status(404).json({ error })
  }
}

module.exports = validation