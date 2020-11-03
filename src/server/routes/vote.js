async function vote(req, res) {
    console.log(req)
    res.statusCode = 200;
    res.end();
}
module.exports = vote;