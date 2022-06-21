const canAddCandidateMiddleware = async (req, res, next) => {
    try {
        const { canAddCandidate } = req.user
        if (!canAddCandidate) {
            return res.status(403).json({ message: 'У вас нет прав на добавление кандидатов' })
        }
        next()
    } catch (error) {
        return res.status(403).json({ error })
    }
}

module.exports = canAddCandidateMiddleware
