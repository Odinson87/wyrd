import Modal from './Modal.js';
import TagEditor from '../TagEditor.svelte';

export const modals = {
    tageditor: new Modal({
        name: 'tageditor',
        title: 'Tags',
        message: 'Add and remove tags',
        data: {
            tags: ['Tag 1', 'Tag 2']
        },
        component: TagEditor
    })
}

export const modalNames = Object.keys(modals);