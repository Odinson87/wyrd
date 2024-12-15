import { datetime, RRule } from "rrule";

import { DurationEnum, RecurrenceNthEnums } from "./enums";

export function datetimeFromDate(date) {
    return datetime(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
    );
}

const optionalRRuleProps = ['interval', 'byweekday', 'bymonth', 'bymonthday'];

export function convertToRRule(recurrencePattern) {
    //console.log(recurrencePattern);
    let rule = {
        freq: RRule[recurrencePattern.freq],
        dtstart: datetimeFromDate(new Date(recurrencePattern.dtstart))
    };
    optionalRRuleProps.forEach(n => {
        if (Object.hasOwn(recurrencePattern, n)) {
            
            let type = typeof(recurrencePattern[n]);

            if ( type !== undefined && type !== null ) {
                switch(n) {
                    case 'byweekday' : 
                        if (recurrencePattern[n].length > 0) {
                            if (Object.hasOwn(recurrencePattern,'nth') && recurrencePattern['nth'].length > 0) {
                                rule[n] = [];
                                recurrencePattern['nth'].forEach( nthStr => {
                                    recurrencePattern[n].forEach( d => {
                                        rule[n].push(RRule.FR.nth(RecurrenceNthEnums[nthStr]));
                                    });
                                });
                            } else {
                                // convert weekday to RRule constant
                                rule[n] = recurrencePattern[n].map( d => RRule[d] );
                            }
                        }
                        break;
                    case 'bymonth' :
                    case 'bymonthday' :
                        if (recurrencePattern[n].length > 0) {
                            rule[n] = recurrencePattern[n];
                        }
                        break;
                    default :
                        rule[n] = recurrencePattern[n];
                }
            }
        }
    });
    //console.log(rule);

    return new RRule(rule);
}
//export function dateFromDatetime();

export function rruleText(rrule) {
    let str = rrule.toText();
    return str.charAt(0).toUpperCase() + str.substring(1) ;
}

export function getDateTimeStr(date = null) {
    if (date) {
        return (new Date(date).toISOString().substring(0,19));
    } else {
        return new Date().toISOString().substring(0,19);
    }
}

export function ago(isoString) {
    if (isoString === null || isoString === '') {
        return 'never';
    }
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