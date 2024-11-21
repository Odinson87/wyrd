import Tag from './Tag';

export const TypesEnum = Object.freeze({
    Todo: new Tag("Todo", "Todo", "#B18FDD"),
    Activity: new Tag("Activity", "Activity", "#44BBFF"),
    Trigger:  new Tag("Trigger", "Trigger", "#FF6000")
});

export const GroupsEnum = Object.freeze({
    Reward: new Tag("Reward", "Activity", "#99EE00"),
    Garden: new Tag("Garden", "Activity", "#BBD686"),
    Project: new Tag("Project", "Activity", "#348aa7"),
    Chore: new Tag("Chore", "Activity", "#D999B9"),
    Shopping: new Tag("Shopping", "Activity", "#C57B57"),
    Health: new Tag("Health", "Activity", "#179889"),
    Distraction: new Tag("Distraction", "Activity", "#FFCA3A")
});

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
