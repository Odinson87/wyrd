class ActivityDoc {
    constructor(name = ''){
        this.name = name;
        this.type = 'Activity';
        this.durationType = 'm';
        this.durationIncrement = 10;
        this.recur = false;
        this.recurrence = null;
        this.occuredAt = null;
        this.tags = [];
        this.suggestedIds = [];
        this.history = {
            ocurredAt: []
        }
    }
}

export default ActivityDoc;