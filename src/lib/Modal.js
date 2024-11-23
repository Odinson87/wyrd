
const defaults = {
    name: null,
    title: 'New Page',
    message: '',
    data: {},
    component: null
}

class Modal {
    constructor(obj){
        let options = Object.assign(defaults, obj);
        this.name = options.name;
        this.title = options.title;
        this.message = options.message;
        this.data = options.data;
        this.component = options.component;
    }
}

export default Modal;