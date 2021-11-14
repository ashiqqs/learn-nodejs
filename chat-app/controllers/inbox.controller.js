function getInbox(req, res, next){
    res.json({
        result: "Get inbox"
    })
}

module.exports = {
    getInbox
}