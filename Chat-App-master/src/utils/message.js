const GenerateMsg = (username, text) => {
    return {
        username,
        text,
        CreatedAt: new Date().getTime()
    }
}
const Generateloc = (username, url) => {
    return {
        username,
        url,
        CreatedAt: new Date().getTime()
    }
}
module.exports = {
    GenerateMsg,
    Generateloc
}