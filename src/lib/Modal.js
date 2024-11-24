
const defaults = {
    id: null,
    name: null,
    title: '',
    message: '',
    component: null,
    data: {}
}

class Modal {
    constructor(obj){
        let options = Object.assign(defaults, obj);
        this.id = options.id;
        this.title = options.title;
        this.message = options.message;
        this.component = options.component;
        this.data = options.data;
        this.source = null;
    }
}

export default Modal;