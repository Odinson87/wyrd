import { SentimentEnum } from './enums.js';
import { getDateTimeStr } from './time.js'

class Log {
    constructor(
        durationType,
        durationIncrement,
        occurredAt = null,
        text = null,
        sentiment = null,
        username = null
    ){
        this.schema = 'log';
        this.createdAt = (new Date()).toISOString();
        this.occurredAt = getDateTimeStr(occurredAt); 
        this.text = text ? text.replace(/(<([^>]+)>)/gi, "") : null;
        this.durationType = durationType;
        this.durationIncrement = durationIncrement;
        this.sentiment = sentiment ? SentimentEnum[sentiment] : SentimentEnum.satisfied; 
        this.username = username;
    }

}

export default Log;