import Tag from './Tag';

export const TypesEnum = Object.freeze({
    Activity: new Tag("Activity", "Activity", "#44BBFF"),
    Trigger:  new Tag("Trigger", "Trigger", "#FF6000")
});

export const GroupsEnum = Object.freeze({
    Reward: new Tag("Reward", "Activity", "#99EE00"),
    Garden: new Tag("Garden", "Activity", "#2F7B00")
});

export const DurationEnum = Object.freeze({
    Second: { name: "Seconds", seconds: 1 },
    Minute: { name: "Minutes", seconds: 60 },
    Hour: { name: "Hours", seconds: 3600 }
});


