import { DurationEnum } from "./enums";

export function since(isoString) {
    let nowS = (new Date()).getTime()/1000;
    let dS = new Date(isoString).getTime()/1000;
    let diffS = Math.round(nowS - dS);
    let str = '';

    Object.keys(DurationEnum).forEach((k) => {
        let t = 0;
        while (diffS > DurationEnum[k].seconds) {
            diffS = diffS - DurationEnum[k].seconds
            t++;
        }
        if (t > 0) {
            if (str !== ''){
                str += ' ';
            }
            str += t+k
        }
    });

    return str === '' ? 'N' : str;
}