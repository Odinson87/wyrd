import { TypesEnum, TagsEnum} from "./enums";

const defaults = {
    lightMode: 0,
    toastArt: true,
    logs: false,
    activityTypes: TypesEnum,
    tags: TagsEnum
}

class Conf {
    constructor(obj = {}){
        let options = Object.assign(defaults, obj);
        this.lightMode = options.lightMode;
        this.toastArt = options.toastArt;
        this.logs = options.logs;
        this.activityTypes = options.activityTypes;
        this.tags = options.tags

    }
}

export default Conf;