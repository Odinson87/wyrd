import { TypesEnum, GroupsEnum} from "./enums";

const defaults = {
    lightMode: 0,
    logs: false,
    activityTypes: TypesEnum,
    tags: GroupsEnum
}

class Conf {
    constructor(obj = {}){
        let options = Object.assign(defaults, obj);
        this.lightMode = options.lightMode;
        this.logs = options.logs;
        this.activityTypes = options.activityTypes;
        this.tags = options.tags

    }
}

export default Conf;