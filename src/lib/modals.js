import Modal from './Modal.js';
import TagEditor from '../TagEditor.svelte';

export const modalConfig = {
    tageditor: new Modal({
        name: 'tageditor',
        title: 'Edit Tags',
        message: 'Add tags to help group and organise things',
        source: null,
        component: TagEditor
    })
}


// retrive configured modal by name
// merge/override default data
export function getNewModal(modalName, modalData = {}) {
    let modal;
    if (Object.hasOwn(modalConfig, modalName)) {
        modal = modalConfig[modalName];
        modal.data = Object.assign(modal.data, modalData)
    } else {
        modal = {};
    }
    return modal;
}

