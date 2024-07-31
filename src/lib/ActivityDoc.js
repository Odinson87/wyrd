class ActivityDoc {
    constructor(name = ''){
        this.name = name;
        this.type = 'Activity';
        this.complete = false;
        this.durationType = 'm';
        this.durationIncrement = 10;
        this.recur = false;
        this.recurrence = null;
        this.occuredAt = null;
        this.occurences= 0;
        this.tags = [];
        this.ignore = true;
        this.suggestedIds = [];
        this.keepHistory = {
            'occuredAt': false
        };
        this.history = {
            ocurredAt: []
        }
    }
}

export default ActivityDoc;