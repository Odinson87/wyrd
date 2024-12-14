import Tag from './Tag';

export const TypesEnum = {
    Todo: new Tag("Todo", "Todo", "#B18FDD"),
    Activity: new Tag("Activity", "Activity", "#44BBFF")
}

export const TagsEnum = {
    Reward: new Tag("Reward", "Activity", "#99EE00"),
    Garden: new Tag("Garden", "Activity", "#BBD686"),
    Project: new Tag("Project", "Activity", "#348aa7"),
    Chore: new Tag("Chore", "Activity", "#D999B9"),
    Shopping: new Tag("Shopping", "Activity", "#C57B57"),
    Health: new Tag("Health", "Activity", "#179889"),
    Trigger:  new Tag("Trigger", "Activity", "#EE6000"),
    Distraction: new Tag("Distraction", "Activity", "#EECA3A")
}

export const DurationEnum = Object.freeze({
    d: { key: "d", name: "Days", seconds: 86400 },
    h: { key: "h", name: "Hours", seconds: 3600 },
    m: { key: "m", name: "Minutes", seconds: 60 },
    s: { key: "s", name: "Seconds", seconds: 1 }
});

export const RecurrenceEnums = Object.freeze({
  freq: ['Days', 'Weeks', 'Months', 'Years'],
  byday: ['SU','MO','TU','WE','TH','FR','SA'],
});

export const SentimentEnum = Object.freeze({
    sad: 0,
    worried: 1,
    stressed: 2,
    very_dissatisfied: 3,
    dissatisfied: 4,
    satisfied: 5,
    very_satisfied: 6,
    calm: 7,
    excited: 8,
});
