import { RecurrenceEnums } from './enums.js';
import { getDateTimeStr } from './time.js';
// iCalendar influenced : https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
// to stop recurrence the recur flag is set to false, rather than using 'count' or 'until'
// dtstart and dtend is used to denote the dates between which the actvity can occur, rather than dtend being used to work out duration. 
// this "simplified" reccurence model should be sufficient
// if freq is yearly, byweekday is set and theres a dtend then for a range, then the matching week day is calcluated rather than 1-31   
class RecurrencePattern {
    constructor(){
        this.dtstart = getDateTimeStr();
        this.dtend = null;
        this.freq = RecurrenceEnums.freq[0];
        this.interval = 1;
        this.byweekday = [];
        this.bymonthday = [];
        this.bymonth = [];
        this.nth = [];
    }
}

export default RecurrencePattern;