/* Error With response Code */
class ErrorWCode extends Error{
    constructor(code, msg) {
        super(msg);
        this.code = code
    }
}

module.exports = {ErrorWCode}
