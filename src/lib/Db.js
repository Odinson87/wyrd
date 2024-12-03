// initial exploration of a DB helper class

import PouchDB from 'pouchdb-browser';
import { sortBy } from 'lodash';

import Log from './Log.js';
import { addToast } from './stores.js';

export const LogDB = new PouchDB('logs', {revs_limit: 1, auto_compaction: true});

export async function getLogItem(logItemId = null) {
    if (typeof logItemId === 'string' && logItemId !== '') {
        try {
            item = await LogDB.get(logItemId);
            item.logs = sortBy(item.logs, [sortByWhat]).reverse()
        } catch(err) {
            console.log('getLogItem : Failed');
        }
    }

    return item ?? {};
}

export async function SaveLog(logItemId, log = null) {
    let action = { ok: false }

    // fetch db item
    let item = await getLogItem(logItemId);
    
    if (Object.hasOwn(item, 'id') && Object.hasOwn(item, 'logs') && Array.isArray(item.logs)) {
        // append to existing db item
        item.logs.push(log ?? new Log(source.durationType, source.durationIncrement));
        item.logs = sortBy(item.logs, ['occurredAt']).reverse();
        action = await LogDB.put(item);
    } else {
        // create fresh db item
        item = {
            logs: [log ?? new Log(source.durationType, source.durationIncrement)]
        }
        action = await LogDB.post(item);
        if (action.ok && action.id) {
            addToast({
                message: 'Log entry added',
                timeout: 3000
            });
        }
    }
    
    if (action.ok && action.id) {
        await getLogItem(logItemId);
        addToast({
            message: 'Log entry added',
            timeout: 3000
        });
    }
    return item;
}