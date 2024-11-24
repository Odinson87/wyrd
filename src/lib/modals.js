import Modal from './Modal.js';
import TagEditor from '../TagEditor.svelte';

export const modalConfig = {
    tageditor: new Modal({
        name: 'tageditor',
        title: 'Tags',
        message: 'Add and remove tags',
        source: null,
        component: TagEditor
    })
}

export function getNewModal(modalName) {
    let modal;
    if (Object.hasOwn(modalConfig, modalName)) {
        modal = modalConfig[modalName];
    } else {
        modal = {};
    }
    return modal;
}

