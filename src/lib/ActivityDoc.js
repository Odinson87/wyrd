class ActivityDoc {
    constructor(name = ''){
        this.name = name;
        this.type = 'Activity';
        this.complete = false;
        this.durationType = 'm';
        this.durationIncrement = 10;
        this.recur = false;
        this.recurrence = {};
        this.occurredAt = null;
        this.occurrences= 0;
        this.tags = [];
        this.ignore = true;
        this.suggestedIds = [];
        this.logs = [];
    }
}

export default ActivityDoc;