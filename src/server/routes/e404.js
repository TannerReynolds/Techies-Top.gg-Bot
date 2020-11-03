async function e404(req, res) {
    res.statusCode = 404;
    res.end();
}
module.exports = e404;