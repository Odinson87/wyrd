import { DurationEnum } from "./enums";

export function ago(isoString) {
    let nowS = (new Date()).getTime()/1000;
    let dS = new Date(isoString).getTime()/1000;
    let diffS = Math.round(nowS - dS);

    return buildSinceString(diffS, 'ago');
}

function parseSince(seconds) {
    let sinceObj = {};
    Object.keys(DurationEnum).forEach((k) => {
        sinceObj[k] = 0;
        while (seconds > DurationEnum[k].seconds) {
            seconds = seconds - DurationEnum[k].seconds
            sinceObj[k]++;
        }
    });

    return sinceObj;
}

function buildSinceString (seconds, suffix = '') {
    let str = '';
    let sinceObj = parseSince(seconds);
    
    let durationKeys = Object.keys(sinceObj);

    // enumerate Duration Keys, largest first
    // only add 2 duration values, dh, hm, ms, s
    for (let i=0; i<durationKeys.length; i++) {
        let key = durationKeys[i];
        let nextKey = i+1 > durationKeys.length ? null : durationKeys[i+1];

        if (sinceObj[key] > 0) {
            str += sinceObj[key] + key;

            if (nextKey && sinceObj[nextKey] > 0) {
                str += ' ' + sinceObj[nextKey] + nextKey;
            }
            break;
        }
    }

    if (str === '') {
        return 'just now';
    } else {
        return suffix !== '' ? str + ' ' + suffix : str;
    }
}