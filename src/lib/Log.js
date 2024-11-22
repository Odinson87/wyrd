class Log {
    constructor(text = null, username = null){
        this.createdAt = (new Date()).toISOString();
        this.text = text ? text.replace(/(<([^>]+)>)/gi, "") : null;
        this.username = username;
    }

}

export default Log;