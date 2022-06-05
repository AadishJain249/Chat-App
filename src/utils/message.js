const GenerateMsg = (text) => {
    return {
        text,
        CreatedAt: new Date().getTime()
    }
}
const Generateloc = () => {
    return {
        CreatedAt1: new Date().getTime()
    }
}
module.exports = {
    GenerateMsg,
    Generateloc
}