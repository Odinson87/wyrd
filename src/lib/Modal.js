
const defaults = {
    id: null,
    title: 'New Page',
    message: '',
    component: null
}

class Modal {
    constructor(obj){
        let options = Object.assign(defaults, obj);
        this.id = options.id;
        this.title = options.title;
        this.message = options.message;
        this.source = null;
        this.component = options.component;
    }
}

export default Modal;