/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 114:
/***/ (() => {

// extracted by mini-css-extract-plugin


/***/ }),

/***/ 229:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// UNUSED EXPORTS: default

// EXTERNAL MODULE: ./node_modules/svelte/src/runtime/internal/index.js + 18 modules
var internal = __webpack_require__(481);
// EXTERNAL MODULE: ./node_modules/svelte/src/runtime/internal/disclose-version/index.js + 1 modules
var disclose_version = __webpack_require__(531);
// EXTERNAL MODULE: ./node_modules/svelte/src/runtime/index.js
var runtime = __webpack_require__(949);
// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(543);
// EXTERNAL MODULE: ./node_modules/svelte/src/runtime/store/index.js
var store = __webpack_require__(603);
// EXTERNAL MODULE: ./node_modules/uuid/dist/esm-browser/v4.js + 3 modules
var v4 = __webpack_require__(829);
;// ./src/lib/Tag.js
class Tag {
    constructor(name, type, hex){
        this.name = name;
        this.type = type;
        this.hex = hex;
    }
}

/* harmony default export */ const lib_Tag = (Tag);
;// ./src/lib/enums.js


const TypesEnum = {
    Todo: new lib_Tag("Todo", "Todo", "#B18FDD"),
    Activity: new lib_Tag("Activity", "Activity", "#44BBFF"),
    Trigger:  new lib_Tag("Trigger", "Trigger", "#FF6000")
}

const TagsEnum = {
    Reward: new lib_Tag("Reward", "Activity", "#99EE00"),
    Garden: new lib_Tag("Garden", "Activity", "#BBD686"),
    Project: new lib_Tag("Project", "Activity", "#348aa7"),
    Chore: new lib_Tag("Chore", "Activity", "#D999B9"),
    Shopping: new lib_Tag("Shopping", "Activity", "#C57B57"),
    Health: new lib_Tag("Health", "Activity", "#179889"),
    Distraction: new lib_Tag("Distraction", "Activity", "#FFCA3A")
}

const DurationEnum = Object.freeze({
    d: { key: "d", name: "Days", seconds: 86400 },
    h: { key: "h", name: "Hours", seconds: 3600 },
    m: { key: "m", name: "Minutes", seconds: 60 },
    s: { key: "s", name: "Seconds", seconds: 1 }
});

const RecurrenceEnums = Object.freeze({
  freq: ['Days', 'Weeks', 'Months', 'Years'],
  byday: ['SU','MO','TU','WE','TH','FR','SA'],
});

const SentimentEnum = Object.freeze({
    sad: 0,
    worried: 1,
    stressed: 2,
    very_dissatisfied: 3,
    dissatisfied: 4,
    satisfied: 5,
    very_satisfied: 6,
    calm: 7,
    excited: 8,
});

;// ./src/lib/Conf.js


const defaults = {
    lightMode: 0,
    toastArt: true,
    logs: false,
    activityTypes: TypesEnum,
    tags: TagsEnum
}

class Conf {
    constructor(obj = {}){
        let options = Object.assign(defaults, obj);
        this.lightMode = options.lightMode;
        this.toastArt = options.toastArt;
        this.logs = options.logs;
        this.activityTypes = options.activityTypes;
        this.tags = options.tags

    }
}

/* harmony default export */ const lib_Conf = (Conf);
;// ./src/lib/stores.js




// Settings Store in Local Storage
// Get the value out of storage on load
// Update & set defaults using Conf
const stored = new lib_Conf(JSON.parse(localStorage.getItem('settings') ?? '{}'));

// Set the stored value
const settings = (0,store/* writable */.T5)(stored)

// Anytime the store changes, update the local storage value.
settings.subscribe((value) => localStorage.settings = JSON.stringify(value))


//  Modals Store
const modals = (0,store/* writable */.T5)([]); 

const addModal = (modal) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  modal.id = (0,v4/* default */.A)();
    
  // Push the modal to the top of the list of modala
  modals.update((all) => [{ ...modal }, ...all]);

  return modal;
};

const dismissModal = (id) => {
  modals.update((all) => all.filter((t) => t.id !== id));
};


// Toasts Store
const toasts = (0,store/* writable */.T5)([]);

const addToast = (toast) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = (0,v4/* default */.A)();

  if ((0,store/* get */.Jt)(settings).toastArt) {
    toast.timeout = null;
  }

  // Setup some sensible defaults for a toast.
  const defaults = {
    id,
    type: "info",
    dismissible: true,
    timeout: 3000,
  };

  // Push the toast to the top of the list of toasts
  toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

const dismissToast = (id) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
;// ./src/lib/filters.js
class Filters {
    constructor(completedStatus, activityTypes, tags){
        this.completedStatus = completedStatus;
        this.activityTypes = activityTypes;
        this.tags = tags;
    }
    
    hasActiveFilters() {
        let completedStatusActive = this.completedStatus !== '';
        let activityTypeActive = false;
        let selectedTagsActive = false;
        
        if (this.activityTypes.length > 0) {
            activityTypeActive = true;
        }

        if (this.tags.length > 0) {
            selectedTagsActive = true;
        }

        return completedStatusActive || activityTypeActive || selectedTagsActive;
    }

    matches(obj) {

        let matchesCompleteStatus = false
        let isActivityType = false;
        let hasTags = false;

        // match completed status
        if (this.completedStatus !== '') {
            let completedVal = this.completedStatus === 'complete';
            matchesCompleteStatus = obj.complete === completedVal;
        } else {
            matchesCompleteStatus = true;
        }

        // match a single type
        if(this.activityTypes.length > 0) {
            this.activityTypes.forEach((t) => {
                isActivityType = !(t !== (obj.type))
            })
        } else {
          isActivityType = true;
        }

        // match all tags
        if(this.tags.length > 0) {
            this.tags.forEach((t) => {
                if (obj.tags.indexOf(t) > -1) {
                    hasTags = true;
                }
            })
        } else {
            hasTags = true;
        }

        return matchesCompleteStatus && isActivityType && hasTags;
    }
    
}

/* harmony default export */ const lib_filters = (Filters);
// EXTERNAL MODULE: ./node_modules/pouchdb-browser/lib/index.es.js + 5 modules
var index_es = __webpack_require__(295);
;// ./src/lib/ActivityDoc.js
class ActivityDoc {
    constructor(name = ''){
        this.name = name;
        this.type = 'Todo';
        this.complete = false;
        this.durationType = 'm';
        this.durationIncrement = 10;
        this.recur = false;
        this.recurrence = {};
        this.occurredAt = null;
        this.occurrences= 0;
        this.tags = [];
        this.ignore = true;
        this.suggestedIds = [];
        this.logItemId;
    }
}

/* harmony default export */ const lib_ActivityDoc = (ActivityDoc);
// EXTERNAL MODULE: ./node_modules/svelte/src/runtime/transition/index.js + 1 modules
var transition = __webpack_require__(942);
;// ./src/lib/time.js


function getDateTimeStr(date = null) {
    if (date) {
        return (new Date(date).toISOString().substring(0,19));
    } else {
        return new Date().toISOString().substring(0,19);
    }
}

function ago(isoString) {
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
;// ./src/lib/icons/save.svelte
/* src/lib/icons/save.svelte generated by Svelte v4.2.19 */




function create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "class", "fill");
			(0,internal/* attr */.CFu)(path, "d", "M3 5.75C3 4.23122 4.23122 3 5.75 3H15.7145C16.5764 3 17.4031 3.34241 18.0126 3.9519L20.0481 5.98744C20.6576 6.59693 21 7.42358 21 8.28553V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM5.75 4.5C5.05964 4.5 4.5 5.05964 4.5 5.75V18.25C4.5 18.9404 5.05964 19.5 5.75 19.5H6V14.25C6 13.0074 7.00736 12 8.25 12H15.75C16.9926 12 18 13.0074 18 14.25V19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V8.28553C19.5 7.8214 19.3156 7.37629 18.9874 7.0481L16.9519 5.01256C16.6918 4.75246 16.3582 4.58269 16 4.52344V7.25C16 8.49264 14.9926 9.5 13.75 9.5H9.25C8.00736 9.5 7 8.49264 7 7.25V4.5H5.75ZM16.5 19.5V14.25C16.5 13.8358 16.1642 13.5 15.75 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25V19.5H16.5ZM8.5 4.5V7.25C8.5 7.66421 8.83579 8 9.25 8H13.75C14.1642 8 14.5 7.66421 14.5 7.25V4.5H8.5Z");
			(0,internal/* attr */.CFu)(path, "fill", "#333");
			(0,internal/* attr */.CFu)(svg, "width", "26px");
			(0,internal/* attr */.CFu)(svg, "height", "26px");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Save extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const save_svelte = (Save);
;// ./src/lib/icons/bin.svelte
/* src/lib/icons/bin.svelte generated by Svelte v4.2.19 */




function bin_svelte_create_fragment(ctx) {
	let svg;
	let g;
	let path0;
	let path1;
	let path2;
	let path3;
	let path4;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			g = (0,internal/* svg_element */.QQy)("g");
			path0 = (0,internal/* svg_element */.QQy)("path");
			path1 = (0,internal/* svg_element */.QQy)("path");
			path2 = (0,internal/* svg_element */.QQy)("path");
			path3 = (0,internal/* svg_element */.QQy)("path");
			path4 = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path0, "d", "M376.515,610.716H361.231a2.361,2.361,0,0,1-2.358-2.359V584.1a1,1,0,0,1,2,0v24.255a.36.36,0,0,0,.358.359h15.284a.36.36,0,0,0,.358-.359V584.1a1,1,0,0,1,2,0v24.255A2.361,2.361,0,0,1,376.515,610.716Z");
			(0,internal/* attr */.CFu)(path1, "d", "M365.457,604.917a1,1,0,0,1-1-1v-14a1,1,0,0,1,2,0v14A1,1,0,0,1,365.457,604.917Z");
			(0,internal/* attr */.CFu)(path2, "d", "M372.29,604.917a1,1,0,0,1-1-1v-14a1,1,0,0,1,2,0v14A1,1,0,0,1,372.29,604.917Z");
			(0,internal/* attr */.CFu)(path3, "d", "M380.79,585.1H356.957a1,1,0,0,1,0-2H380.79a1,1,0,0,1,0,2Z");
			(0,internal/* attr */.CFu)(path4, "d", "M372.79,581h-7.917a1,1,0,1,1,0-2h7.917a1,1,0,0,1,0,2Z");
			(0,internal/* attr */.CFu)(g, "transform", "translate(-355.957 -579)");
			(0,internal/* attr */.CFu)(svg, "fill", "#000000");
			(0,internal/* attr */.CFu)(svg, "width", "26px");
			(0,internal/* attr */.CFu)(svg, "height", "26px");
			(0,internal/* attr */.CFu)(svg, "viewBox", "-2.94 0 31.716 31.716");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, g);
			(0,internal/* append */.BCw)(g, path0);
			(0,internal/* append */.BCw)(g, path1);
			(0,internal/* append */.BCw)(g, path2);
			(0,internal/* append */.BCw)(g, path3);
			(0,internal/* append */.BCw)(g, path4);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Bin extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, bin_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const bin_svelte = (Bin);
;// ./src/lib/icons/target.svelte
/* src/lib/icons/target.svelte generated by Svelte v4.2.19 */




function target_svelte_create_fragment(ctx) {
	let svg;
	let g;
	let circle0;
	let circle1;
	let circle2;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			g = (0,internal/* svg_element */.QQy)("g");
			circle0 = (0,internal/* svg_element */.QQy)("circle");
			circle1 = (0,internal/* svg_element */.QQy)("circle");
			circle2 = (0,internal/* svg_element */.QQy)("circle");
			(0,internal/* attr */.CFu)(circle0, "class", "stroke");
			(0,internal/* attr */.CFu)(circle0, "stroke", "#333");
			(0,internal/* attr */.CFu)(circle0, "stroke-width", "1.4");
			(0,internal/* attr */.CFu)(circle0, "fill", "none");
			(0,internal/* attr */.CFu)(circle0, "r", "11");
			(0,internal/* attr */.CFu)(circle0, "cx", "12");
			(0,internal/* attr */.CFu)(circle0, "cy", "12");
			(0,internal/* attr */.CFu)(circle1, "class", "stroke");
			(0,internal/* attr */.CFu)(circle1, "stroke", "#333");
			(0,internal/* attr */.CFu)(circle1, "stroke-width", "1.4");
			(0,internal/* attr */.CFu)(circle1, "fill", "none");
			(0,internal/* attr */.CFu)(circle1, "r", "7");
			(0,internal/* attr */.CFu)(circle1, "cx", "12");
			(0,internal/* attr */.CFu)(circle1, "cy", "12");
			(0,internal/* attr */.CFu)(circle2, "class", "stroke");
			(0,internal/* attr */.CFu)(circle2, "stroke", "#333");
			(0,internal/* attr */.CFu)(circle2, "stroke-width", "1.4");
			(0,internal/* attr */.CFu)(circle2, "fill", "none");
			(0,internal/* attr */.CFu)(circle2, "r", "3");
			(0,internal/* attr */.CFu)(circle2, "cx", "12");
			(0,internal/* attr */.CFu)(circle2, "cy", "12");
			(0,internal/* attr */.CFu)(svg, "height", "34px");
			(0,internal/* attr */.CFu)(svg, "width", "34px");
			(0,internal/* attr */.CFu)(svg, "version", "1.1");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "xml:space", "preserve");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, g);
			(0,internal/* append */.BCw)(g, circle0);
			(0,internal/* append */.BCw)(g, circle1);
			(0,internal/* append */.BCw)(g, circle2);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Target extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, target_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const target_svelte = (Target);
;// ./src/lib/icons/tagIcon.svelte
/* src/lib/icons/tagIcon.svelte generated by Svelte v4.2.19 */




function tagIcon_svelte_create_fragment(ctx) {
	let svg;
	let path0;
	let path1;
	let path2;
	let path3;
	let svg_width_value;
	let svg_height_value;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path0 = (0,internal/* svg_element */.QQy)("path");
			path1 = (0,internal/* svg_element */.QQy)("path");
			path2 = (0,internal/* svg_element */.QQy)("path");
			path3 = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path0, "class", "fill");
			(0,internal/* attr */.CFu)(path0, "d", "M8.49999 10C9.32842 10 9.99999 9.32844 9.99999 8.50001C9.99999 7.67159 9.32842 7.00001 8.49999 7.00001C7.67156 7.00001 6.99999 7.67159 6.99999 8.50001C6.99999 9.32844 7.67156 10 8.49999 10Z");
			(0,internal/* attr */.CFu)(path0, "fill", "#000000");
			(0,internal/* attr */.CFu)(path0, "id", "tag1");
			(0,internal/* attr */.CFu)(path1, "class", "fill");
			(0,internal/* attr */.CFu)(path1, "fill-rule", "evenodd");
			(0,internal/* attr */.CFu)(path1, "clip-rule", "evenodd");
			(0,internal/* attr */.CFu)(path1, "d", "M4.4497 1.94984C3.06898 1.94985 1.94969 3.06915 1.94971 4.44987L1.94978 12.0209C1.94979 12.8166 2.26586 13.5796 2.82846 14.1422L10.728 22.0417C12.2901 23.6038 14.8227 23.6038 16.3848 22.0417L22.0417 16.3849C23.6038 14.8228 23.6038 12.2901 22.0417 10.728L14.1422 2.82851C13.5796 2.2659 12.8165 1.94983 12.0209 1.94983L4.4497 1.94984ZM3.94971 4.44985C3.9497 4.17371 4.17356 3.94985 4.44971 3.94984L12.0209 3.94983C12.2861 3.94983 12.5404 4.05518 12.728 4.24272L20.6275 12.1422C21.4085 12.9233 21.4085 14.1896 20.6275 14.9706L14.9706 20.6275C14.1896 21.4085 12.9232 21.4085 12.1422 20.6275L4.24268 12.728C4.05514 12.5405 3.94979 12.2861 3.94978 12.0209L3.94971 4.44985Z");
			(0,internal/* attr */.CFu)(path1, "fill", "#000000");
			(0,internal/* attr */.CFu)(path1, "id", "tag2");
			(0,internal/* attr */.CFu)(path2, "class", "stroke");
			(0,internal/* attr */.CFu)(path2, "fill", "none");
			(0,internal/* attr */.CFu)(path2, "stroke", "#000000");
			(0,internal/* attr */.CFu)(path2, "stroke-width", "1.6");
			(0,internal/* attr */.CFu)(path2, "stroke-linecap", "round");
			(0,internal/* attr */.CFu)(path2, "stroke-linejoin", "miter");
			(0,internal/* attr */.CFu)(path2, "stroke-miterlimit", "4");
			(0,internal/* attr */.CFu)(path2, "stroke-dasharray", "none");
			(0,internal/* attr */.CFu)(path2, "stroke-opacity", "1");
			(0,internal/* attr */.CFu)(path2, "d", "m 13.820368,17.17504 -0.02491,-7.158811");
			(0,internal/* attr */.CFu)(path2, "id", "plus1");
			(0,internal/* attr */.CFu)(path3, "class", "stroke");
			(0,internal/* attr */.CFu)(path3, "fill", "none");
			(0,internal/* attr */.CFu)(path3, "stroke", "#000000");
			(0,internal/* attr */.CFu)(path3, "stroke-width", "1.6");
			(0,internal/* attr */.CFu)(path3, "stroke-linecap", "round");
			(0,internal/* attr */.CFu)(path3, "stroke-linejoin", "miter");
			(0,internal/* attr */.CFu)(path3, "stroke-miterlimit", "4");
			(0,internal/* attr */.CFu)(path3, "stroke-dasharray", "none");
			(0,internal/* attr */.CFu)(path3, "stroke-opacity", "1");
			(0,internal/* attr */.CFu)(path3, "d", "m 10.228507,13.60809 7.158811,-0.02491");
			(0,internal/* attr */.CFu)(path3, "id", "plus2");
			(0,internal/* attr */.CFu)(svg, "width", svg_width_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "height", svg_height_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "version", "1.1");
			(0,internal/* attr */.CFu)(svg, "id", "svg29");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "xmlns:svg", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path0);
			(0,internal/* append */.BCw)(svg, path1);
			(0,internal/* append */.BCw)(svg, path2);
			(0,internal/* append */.BCw)(svg, path3);
		},
		p(ctx, [dirty]) {
			if (dirty & /*size*/ 1 && svg_width_value !== (svg_width_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "width", svg_width_value);
			}

			if (dirty & /*size*/ 1 && svg_height_value !== (svg_height_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "height", svg_height_value);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { size = 24 } = $$props;

	$$self.$$set = $$props => {
		if ('size' in $$props) $$invalidate(0, size = $$props.size);
	};

	return [size];
}

class TagIcon extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, instance, tagIcon_svelte_create_fragment, internal/* safe_not_equal */.jXN, { size: 0 });
	}
}

/* harmony default export */ const tagIcon_svelte = (TagIcon);
;// ./src/lib/icons/timeForward.svelte
/* src/lib/icons/timeForward.svelte generated by Svelte v4.2.19 */




function timeForward_svelte_create_fragment(ctx) {
	let svg;
	let path;
	let svg_width_value;
	let svg_height_value;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "d", "M23,11a1,1,0,0,0-1,1,10.034,10.034,0,1,1-2.9-7.021A.862.862,0,0,1,19,5H16a1,1,0,0,0,0,2h3a3,3,0,0,0,3-3V1a1,1,0,0,0-2,0V3.065A11.994,11.994,0,1,0,24,12,1,1,0,0,0,23,11Z\r\nM12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z");
			(0,internal/* attr */.CFu)(svg, "fill", "#000000");
			(0,internal/* attr */.CFu)(svg, "width", svg_width_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "height", svg_height_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "id", "Layer_1");
			(0,internal/* attr */.CFu)(svg, "data-name", "Layer 1");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*size*/ 1 && svg_width_value !== (svg_width_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "width", svg_width_value);
			}

			if (dirty & /*size*/ 1 && svg_height_value !== (svg_height_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "height", svg_height_value);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function timeForward_svelte_instance($$self, $$props, $$invalidate) {
	let { size = 24 } = $$props;

	$$self.$$set = $$props => {
		if ('size' in $$props) $$invalidate(0, size = $$props.size);
	};

	return [size];
}

class TimeForward extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, timeForward_svelte_instance, timeForward_svelte_create_fragment, internal/* safe_not_equal */.jXN, { size: 0 });
	}
}

/* harmony default export */ const timeForward_svelte = (TimeForward);
;// ./src/lib/icons/notes.svelte
/* src/lib/icons/notes.svelte generated by Svelte v4.2.19 */




function notes_svelte_create_fragment(ctx) {
	let svg;
	let g;
	let path0;
	let defs;
	let clipPath;
	let path1;
	let svg_width_value;
	let svg_height_value;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			g = (0,internal/* svg_element */.QQy)("g");
			path0 = (0,internal/* svg_element */.QQy)("path");
			defs = (0,internal/* svg_element */.QQy)("defs");
			clipPath = (0,internal/* svg_element */.QQy)("clipPath");
			path1 = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path0, "d", "M55 139.591 61.173 171l26.432-17.816L136 35.594 103.394 22 55 139.591ZM22 42h72m40 0h36M22 78h57m41 0h50M22 114h41m41 0h66M22 150h34m34 0h32");
			(0,internal/* attr */.CFu)(g, "class", "stroke");
			(0,internal/* attr */.CFu)(g, "stroke", "#000000");
			(0,internal/* attr */.CFu)(g, "stroke-linecap", "round");
			(0,internal/* attr */.CFu)(g, "stroke-linejoin", "round");
			(0,internal/* attr */.CFu)(g, "stroke-width", "12");
			(0,internal/* attr */.CFu)(g, "clip-path", "url(#a)");
			(0,internal/* attr */.CFu)(path1, "fill", "#ffffff");
			(0,internal/* attr */.CFu)(path1, "d", "M0 0h192v192H0z");
			(0,internal/* attr */.CFu)(clipPath, "id", "a");
			(0,internal/* attr */.CFu)(svg, "width", svg_width_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "height", svg_height_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 192 192");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "fill", "none");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, g);
			(0,internal/* append */.BCw)(g, path0);
			(0,internal/* append */.BCw)(svg, defs);
			(0,internal/* append */.BCw)(defs, clipPath);
			(0,internal/* append */.BCw)(clipPath, path1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*size*/ 1 && svg_width_value !== (svg_width_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "width", svg_width_value);
			}

			if (dirty & /*size*/ 1 && svg_height_value !== (svg_height_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "height", svg_height_value);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function notes_svelte_instance($$self, $$props, $$invalidate) {
	let { size = 24 } = $$props;

	$$self.$$set = $$props => {
		if ('size' in $$props) $$invalidate(0, size = $$props.size);
	};

	return [size];
}

class Notes extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, notes_svelte_instance, notes_svelte_create_fragment, internal/* safe_not_equal */.jXN, { size: 0 });
	}
}

/* harmony default export */ const notes_svelte = (Notes);
;// ./src/lib/input/Number.svelte
/* src/lib/input/Number.svelte generated by Svelte v4.2.19 */




function create_if_block(ctx) {
	let label_1;
	let t0;
	let t1;

	return {
		c() {
			label_1 = (0,internal/* element */.ND4)("label");
			t0 = (0,internal/* text */.Qq7)(/*label*/ ctx[3]);
			t1 = (0,internal/* text */.Qq7)(":");
			(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[2]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label_1, anchor);
			(0,internal/* append */.BCw)(label_1, t0);
			(0,internal/* append */.BCw)(label_1, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 8) (0,internal/* set_data */.iQh)(t0, /*label*/ ctx[3]);

			if (dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[2]);
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(label_1);
			}
		}
	};
}

function Number_svelte_create_fragment(ctx) {
	let t0;
	let button0;
	let t2;
	let input;
	let t3;
	let button1;
	let mounted;
	let dispose;
	let if_block = typeof /*label*/ ctx[3] !== "undefined" && create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			t0 = (0,internal/* space */.xem)();
			button0 = (0,internal/* element */.ND4)("button");
			button0.textContent = "-";
			t2 = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			t3 = (0,internal/* space */.xem)();
			button1 = (0,internal/* element */.ND4)("button");
			button1.textContent = "+";
			(0,internal/* attr */.CFu)(button0, "class", "leftArrow svelte-1d1omz1");
			input.disabled = /*disabled*/ ctx[4];
			(0,internal/* attr */.CFu)(input, "min", /*min*/ ctx[1]);
			(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[2]);
			(0,internal/* attr */.CFu)(input, "type", "number");
			(0,internal/* attr */.CFu)(input, "class", "svelte-1d1omz1");
			(0,internal/* attr */.CFu)(button1, "class", "rightArrow svelte-1d1omz1");
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, t0, anchor);
			(0,internal/* insert */.Yry)(target, button0, anchor);
			(0,internal/* insert */.Yry)(target, t2, anchor);
			(0,internal/* insert */.Yry)(target, input, anchor);
			(0,internal/* set_input_value */.Gvd)(input, /*val*/ ctx[0]);
			(0,internal/* insert */.Yry)(target, t3, anchor);
			(0,internal/* insert */.Yry)(target, button1, anchor);

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(button0, "click", /*click_handler*/ ctx[8]),
					(0,internal/* listen */.KTR)(input, "input", /*input_input_handler*/ ctx[9]),
					(0,internal/* listen */.KTR)(button1, "click", /*click_handler_1*/ ctx[10])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (typeof /*label*/ ctx[3] !== "undefined") {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(t0.parentNode, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*disabled*/ 16) {
				input.disabled = /*disabled*/ ctx[4];
			}

			if (dirty & /*min*/ 2) {
				(0,internal/* attr */.CFu)(input, "min", /*min*/ ctx[1]);
			}

			if (dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[2]);
			}

			if (dirty & /*val*/ 1 && (0,internal/* to_number */.WMT)(input.value) !== /*val*/ ctx[0]) {
				(0,internal/* set_input_value */.Gvd)(input, /*val*/ ctx[0]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t0);
				(0,internal/* detach */.YoD)(button0);
				(0,internal/* detach */.YoD)(t2);
				(0,internal/* detach */.YoD)(input);
				(0,internal/* detach */.YoD)(t3);
				(0,internal/* detach */.YoD)(button1);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			(0,internal/* run_all */.oOW)(dispose);
		}
	};
}

function Number_svelte_instance($$self, $$props, $$invalidate) {
	let { min = 0 } = $$props;
	let { max } = $$props;
	let { val } = $$props;
	let { name } = $$props;
	let { label } = $$props;
	let { disabled = false } = $$props;

	function increment() {
		if (!val) {
			$$invalidate(0, val = min);
		} else {
			if (max) {
				if (val < max) {
					$$invalidate(0, val++, val);
				}
			} else {
				$$invalidate(0, val++, val);
			}
		}
	}

	function decrement() {
		if (!val) {
			$$invalidate(0, val = min);
		} else {
			if (val > min) {
				$$invalidate(0, val--, val);
			}
		}
	}

	const click_handler = () => decrement();

	function input_input_handler() {
		val = (0,internal/* to_number */.WMT)(this.value);
		$$invalidate(0, val);
	}

	const click_handler_1 = () => increment();

	$$self.$$set = $$props => {
		if ('min' in $$props) $$invalidate(1, min = $$props.min);
		if ('max' in $$props) $$invalidate(7, max = $$props.max);
		if ('val' in $$props) $$invalidate(0, val = $$props.val);
		if ('name' in $$props) $$invalidate(2, name = $$props.name);
		if ('label' in $$props) $$invalidate(3, label = $$props.label);
		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
	};

	return [
		val,
		min,
		name,
		label,
		disabled,
		increment,
		decrement,
		max,
		click_handler,
		input_input_handler,
		click_handler_1
	];
}

class Number_svelte_Number extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, Number_svelte_instance, Number_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			min: 1,
			max: 7,
			val: 0,
			name: 2,
			label: 3,
			disabled: 4
		});
	}
}

/* harmony default export */ const Number_svelte = (Number_svelte_Number);

;// ./src/lib/RecurrencePattern.js

// iCalendar influenced : https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
// to stop recurrence the recur flag is set to false, rather than using 'count' or 'until'
// dtstart and dtend is used to denote the dates between which the actvity can occur, rather than dtend being used to work out duration. 
// this "simplified" reccurence model should be sufficient
// if freq is yearly, bydays is set and theres a dtend then for a range, then the matching week day is calcluated rather than 1-31   
class RecurrencePattern {
    constructor(){
        this.dtstart = (new Date()).toISOString();
        this.dtend = null;
        this.freq = RecurrenceEnums.freq[0];
        this.interval;
        this.byday = [];
    }
}

/* harmony default export */ const lib_RecurrencePattern = (RecurrencePattern);
;// ./src/lib/input/Checkbox.svelte
/* src/lib/input/Checkbox.svelte generated by Svelte v4.2.19 */




function create_else_block(ctx) {
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			input = (0,internal/* element */.ND4)("input");
			(0,internal/* attr */.CFu)(input, "type", "checkbox");
			(0,internal/* attr */.CFu)(input, "class", "svelte-1v334q7");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, input, anchor);
			input.checked = /*val*/ ctx[0];

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(input, "change", /*input_change_handler_1*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*val*/ 1) {
				input.checked = /*val*/ ctx[0];
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(input);
			}

			mounted = false;
			dispose();
		}
	};
}

// (61:4) {#if typeof(group) !== "undefined" }
function Checkbox_svelte_create_if_block(ctx) {
	let input;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = (0,internal/* init_binding_group */.bVF)(/*$$binding_groups*/ ctx[5][0]);

	return {
		c() {
			input = (0,internal/* element */.ND4)("input");
			(0,internal/* attr */.CFu)(input, "type", "checkbox");
			(0,internal/* attr */.CFu)(input, "class", "svelte-1v334q7");
			binding_group.p(input);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, input, anchor);
			input.checked = ~(/*selected*/ ctx[3] || []).indexOf(input.__value);
			input.checked = /*val*/ ctx[0];

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(input, "change", /*input_change_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*selected*/ 8) {
				input.checked = ~(/*selected*/ ctx[3] || []).indexOf(input.__value);
			}

			if (dirty & /*val*/ 1) {
				input.checked = /*val*/ ctx[0];
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(input);
			}

			binding_group.r();
			mounted = false;
			dispose();
		}
	};
}

function Checkbox_svelte_create_fragment(ctx) {
	let label_1;
	let t0;
	let t1;
	let t2;
	let span;

	function select_block_type(ctx, dirty) {
		if (typeof /*group*/ ctx[2] !== "undefined") return Checkbox_svelte_create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx, -1);
	let if_block = current_block_type(ctx);

	return {
		c() {
			label_1 = (0,internal/* element */.ND4)("label");
			t0 = (0,internal/* text */.Qq7)(/*label*/ ctx[1]);
			t1 = (0,internal/* space */.xem)();
			if_block.c();
			t2 = (0,internal/* space */.xem)();
			span = (0,internal/* element */.ND4)("span");
			(0,internal/* attr */.CFu)(span, "class", "checkmark svelte-1v334q7");
			(0,internal/* attr */.CFu)(label_1, "class", "svelte-1v334q7");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label_1, anchor);
			(0,internal/* append */.BCw)(label_1, t0);
			(0,internal/* append */.BCw)(label_1, t1);
			if_block.m(label_1, null);
			(0,internal/* append */.BCw)(label_1, t2);
			(0,internal/* append */.BCw)(label_1, span);
		},
		p(ctx, [dirty]) {
			if (dirty & /*label*/ 2) (0,internal/* set_data */.iQh)(t0, /*label*/ ctx[1]);

			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(label_1, t2);
				}
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(label_1);
			}

			if_block.d();
		}
	};
}

function Checkbox_svelte_instance($$self, $$props, $$invalidate) {
	let { val = false } = $$props;
	let { label } = $$props;
	let { group } = $$props;
	let selected = [];
	const $$binding_groups = [[]];

	function input_change_handler() {
		selected = (0,internal/* get_binding_group_value */.jUA)($$binding_groups[0], this.__value, this.checked);
		val = this.checked;
		$$invalidate(3, selected);
		$$invalidate(0, val);
	}

	function input_change_handler_1() {
		val = this.checked;
		$$invalidate(0, val);
	}

	$$self.$$set = $$props => {
		if ('val' in $$props) $$invalidate(0, val = $$props.val);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('group' in $$props) $$invalidate(2, group = $$props.group);
	};

	return [
		val,
		label,
		group,
		selected,
		input_change_handler,
		$$binding_groups,
		input_change_handler_1
	];
}

class Checkbox extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Checkbox_svelte_instance, Checkbox_svelte_create_fragment, internal/* safe_not_equal */.jXN, { val: 0, label: 1, group: 2 });
	}
}

/* harmony default export */ const Checkbox_svelte = (Checkbox);

;// ./src/lib/input/DayCheckbox.svelte
/* src/lib/input/DayCheckbox.svelte generated by Svelte v4.2.19 */




function DayCheckbox_svelte_create_fragment(ctx) {
	let label_1;
	let input;
	let t0;
	let span;
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			label_1 = (0,internal/* element */.ND4)("label");
			input = (0,internal/* element */.ND4)("input");
			t0 = (0,internal/* space */.xem)();
			span = (0,internal/* element */.ND4)("span");
			t1 = (0,internal/* text */.Qq7)(/*label*/ ctx[2]);
			(0,internal/* attr */.CFu)(input, "type", "checkbox");
			(0,internal/* attr */.CFu)(input, "class", "svelte-1nqufop");
			(0,internal/* attr */.CFu)(span, "class", "checkmark svelte-1nqufop");
			(0,internal/* attr */.CFu)(label_1, "class", "svelte-1nqufop");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label_1, anchor);
			(0,internal/* append */.BCw)(label_1, input);
			input.checked = /*checked*/ ctx[0];
			(0,internal/* set_input_value */.Gvd)(input, /*val*/ ctx[1]);
			(0,internal/* append */.BCw)(label_1, t0);
			(0,internal/* append */.BCw)(label_1, span);
			(0,internal/* append */.BCw)(span, t1);

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(input, "change", /*input_change_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*checked*/ 1) {
				input.checked = /*checked*/ ctx[0];
			}

			if (dirty & /*val*/ 2) {
				(0,internal/* set_input_value */.Gvd)(input, /*val*/ ctx[1]);
			}

			if (dirty & /*label*/ 4) (0,internal/* set_data */.iQh)(t1, /*label*/ ctx[2]);
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(label_1);
			}

			mounted = false;
			dispose();
		}
	};
}

function DayCheckbox_svelte_instance($$self, $$props, $$invalidate) {
	let { val } = $$props;
	let { label } = $$props;
	let { checked } = $$props;
	let { group } = $$props;

	function updateCheckbox(group) {
		$$invalidate(0, checked = group.indexOf(val) >= 0);
	}

	function updateGroup(checked) {
		const index = group.indexOf(val);

		if (checked) {
			if (index < 0) {
				group.push(val);
				$$invalidate(3, group);
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1);
				$$invalidate(3, group);
			}
		}
	}

	function input_change_handler() {
		checked = this.checked;
		val = this.value;
		$$invalidate(0, checked);
		$$invalidate(1, val);
	}

	$$self.$$set = $$props => {
		if ('val' in $$props) $$invalidate(1, val = $$props.val);
		if ('label' in $$props) $$invalidate(2, label = $$props.label);
		if ('checked' in $$props) $$invalidate(0, checked = $$props.checked);
		if ('group' in $$props) $$invalidate(3, group = $$props.group);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*group*/ 8) {
			$: updateCheckbox(group);
		}

		if ($$self.$$.dirty & /*checked*/ 1) {
			$: updateGroup(checked);
		}
	};

	return [checked, val, label, group, input_change_handler];
}

class DayCheckbox extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, DayCheckbox_svelte_instance, DayCheckbox_svelte_create_fragment, internal/* safe_not_equal */.jXN, { val: 1, label: 2, checked: 0, group: 3 });
	}
}

/* harmony default export */ const DayCheckbox_svelte = (DayCheckbox);

;// ./src/lib/input/Recurrence.svelte
/* src/lib/input/Recurrence.svelte generated by Svelte v4.2.19 */










function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

// (29:4) {#if doc.recur == true}
function Recurrence_svelte_create_if_block(ctx) {
	let numberinput;
	let updating_val;
	let t0;
	let select;
	let t1;
	let if_block_anchor;
	let current;
	let mounted;
	let dispose;

	function numberinput_val_binding(value) {
		/*numberinput_val_binding*/ ctx[2](value);
	}

	let numberinput_props = {
		min: "1",
		name: "activity-recurrence-interval",
		label: "Every"
	};

	if (/*doc*/ ctx[0].recurrence.interval !== void 0) {
		numberinput_props.val = /*doc*/ ctx[0].recurrence.interval;
	}

	numberinput = new Number_svelte({ props: numberinput_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(numberinput, 'val', numberinput_val_binding));
	let each_value_1 = (0,internal/* ensure_array_like */.rv_)(RecurrenceEnums.freq);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let if_block = /*doc*/ ctx[0].recurrence.freq == RecurrenceEnums.freq[1] && create_if_block_1(ctx);

	return {
		c() {
			(0,internal/* create_component */.N0i)(numberinput.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			select = (0,internal/* element */.ND4)("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = (0,internal/* space */.xem)();
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
			(0,internal/* attr */.CFu)(select, "name", "activity-recurrence-freq");
			if (/*doc*/ ctx[0].recurrence.freq === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select_change_handler*/ ctx[3].call(select));
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(numberinput, target, anchor);
			(0,internal/* insert */.Yry)(target, t0, anchor);
			(0,internal/* insert */.Yry)(target, select, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			(0,internal/* select_option */.fs8)(select, /*doc*/ ctx[0].recurrence.freq, true);
			(0,internal/* insert */.Yry)(target, t1, anchor);
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(select, "change", /*select_change_handler*/ ctx[3]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			const numberinput_changes = {};

			if (!updating_val && dirty & /*doc*/ 1) {
				updating_val = true;
				numberinput_changes.val = /*doc*/ ctx[0].recurrence.interval;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_val = false);
			}

			numberinput.$set(numberinput_changes);

			if (dirty & /*doc*/ 1) {
				(0,internal/* select_option */.fs8)(select, /*doc*/ ctx[0].recurrence.freq);
			}

			if (/*doc*/ ctx[0].recurrence.freq == RecurrenceEnums.freq[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*doc*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block, 1);
					}
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					(0,internal/* transition_in */.c7F)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(numberinput.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(numberinput.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t0);
				(0,internal/* detach */.YoD)(select);
				(0,internal/* detach */.YoD)(t1);
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			(0,internal/* destroy_component */.Hbl)(numberinput, detaching);
			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
			if (if_block) if_block.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

// (32:12) {#each RecurrenceEnums.freq as fStr, i}
function create_each_block_1(ctx) {
	let option;
	let option_value_value;

	return {
		c() {
			option = (0,internal/* element */.ND4)("option");
			option.textContent = `${/*fStr*/ ctx[9]}`;
			option.__value = option_value_value = /*fStr*/ ctx[9];
			(0,internal/* set_input_value */.Gvd)(option, option.__value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, option, anchor);
		},
		p: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(option);
			}
		}
	};
}

// (37:8) {#if doc.recurrence.freq == RecurrenceEnums.freq[1]}
function create_if_block_1(ctx) {
	let div;
	let current;
	let each_value = (0,internal/* ensure_array_like */.rv_)(RecurrenceEnums.byday);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => (0,internal/* transition_out */.Tn8)(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = (0,internal/* element */.ND4)("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(div, "class", "weekdays");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*doc*/ 1) {
				each_value = (0,internal/* ensure_array_like */.rv_)(RecurrenceEnums.byday);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				(0,internal/* group_outros */.V44)();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
		}
	};
}

// (39:16) {#each RecurrenceEnums.byday as DayStr2Chr, i}
function create_each_block(ctx) {
	let daycheckboxinput;
	let updating_group;
	let current;

	function daycheckboxinput_group_binding(value) {
		/*daycheckboxinput_group_binding*/ ctx[4](value);
	}

	let daycheckboxinput_props = {
		val: /*DayStr2Chr*/ ctx[6],
		name: "activity-recurrence-byday",
		label: /*DayStr2Chr*/ ctx[6].substring(0, 1)
	};

	if (/*doc*/ ctx[0].recurrence.byday !== void 0) {
		daycheckboxinput_props.group = /*doc*/ ctx[0].recurrence.byday;
	}

	daycheckboxinput = new DayCheckbox_svelte({ props: daycheckboxinput_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(daycheckboxinput, 'group', daycheckboxinput_group_binding));

	return {
		c() {
			(0,internal/* create_component */.N0i)(daycheckboxinput.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(daycheckboxinput, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const daycheckboxinput_changes = {};

			if (!updating_group && dirty & /*doc*/ 1) {
				updating_group = true;
				daycheckboxinput_changes.group = /*doc*/ ctx[0].recurrence.byday;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_group = false);
			}

			daycheckboxinput.$set(daycheckboxinput_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(daycheckboxinput.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(daycheckboxinput.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(daycheckboxinput, detaching);
		}
	};
}

function Recurrence_svelte_create_fragment(ctx) {
	let div;
	let checkboxinput;
	let updating_val;
	let t;
	let current;

	function checkboxinput_val_binding(value) {
		/*checkboxinput_val_binding*/ ctx[1](value);
	}

	let checkboxinput_props = { label: "recur" };

	if (/*doc*/ ctx[0].recur !== void 0) {
		checkboxinput_props.val = /*doc*/ ctx[0].recur;
	}

	checkboxinput = new Checkbox_svelte({ props: checkboxinput_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(checkboxinput, 'val', checkboxinput_val_binding));
	let if_block = /*doc*/ ctx[0].recur == true && Recurrence_svelte_create_if_block(ctx);

	return {
		c() {
			div = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(checkboxinput.$$.fragment);
			t = (0,internal/* space */.xem)();
			if (if_block) if_block.c();
			(0,internal/* attr */.CFu)(div, "class", "input-group");
			(0,internal/* attr */.CFu)(div, "data-group", "recurrence");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);
			(0,internal/* mount_component */.wSR)(checkboxinput, div, null);
			(0,internal/* append */.BCw)(div, t);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const checkboxinput_changes = {};

			if (!updating_val && dirty & /*doc*/ 1) {
				updating_val = true;
				checkboxinput_changes.val = /*doc*/ ctx[0].recur;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_val = false);
			}

			checkboxinput.$set(checkboxinput_changes);

			if (/*doc*/ ctx[0].recur == true) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*doc*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block, 1);
					}
				} else {
					if_block = Recurrence_svelte_create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.c7F)(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(checkboxinput.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(checkboxinput.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_component */.Hbl)(checkboxinput);
			if (if_block) if_block.d();
		}
	};
}

function Recurrence_svelte_instance($$self, $$props, $$invalidate) {
	let { doc } = $$props;

	function updateRecurrence(recur) {
		if (!recur) {
			// remove recurrence data
			$$invalidate(0, doc.recurrence = {}, doc);
		} else if (!Object.hasOwn(doc.recurrence, 'byday')) {
			// add new oject when existing pattern doesn't exist
			$$invalidate(0, doc.recurrence = new lib_RecurrencePattern(), doc);
		}
	}

	function checkboxinput_val_binding(value) {
		if ($$self.$$.not_equal(doc.recur, value)) {
			doc.recur = value;
			$$invalidate(0, doc);
		}
	}

	function numberinput_val_binding(value) {
		if ($$self.$$.not_equal(doc.recurrence.interval, value)) {
			doc.recurrence.interval = value;
			$$invalidate(0, doc);
		}
	}

	function select_change_handler() {
		doc.recurrence.freq = (0,internal/* select_value */.Hw5)(this);
		$$invalidate(0, doc);
	}

	function daycheckboxinput_group_binding(value) {
		if ($$self.$$.not_equal(doc.recurrence.byday, value)) {
			doc.recurrence.byday = value;
			$$invalidate(0, doc);
		}
	}

	$$self.$$set = $$props => {
		if ('doc' in $$props) $$invalidate(0, doc = $$props.doc);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*doc*/ 1) {
			$: {
				updateRecurrence(doc.recur);
			}
		}
	};

	return [
		doc,
		checkboxinput_val_binding,
		numberinput_val_binding,
		select_change_handler,
		daycheckboxinput_group_binding
	];
}

class Recurrence extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Recurrence_svelte_instance, Recurrence_svelte_create_fragment, internal/* safe_not_equal */.jXN, { doc: 0 });
	}
}

/* harmony default export */ const Recurrence_svelte = (Recurrence);
;// ./src/lib/Modal.js

const Modal_defaults = {
    id: null,
    name: null,
    title: '',
    message: '',
    component: null,
    data: {}
}

class Modal {
    constructor(obj){
        let options = Object.assign(Modal_defaults, obj);
        this.id = options.id;
        this.title = options.title;
        this.message = options.message;
        this.component = options.component;
        this.data = options.data;
        this.source = null;
    }
}

/* harmony default export */ const lib_Modal = (Modal);
;// ./src/lib/input/TagCheckbox.svelte
/* src/lib/input/TagCheckbox.svelte generated by Svelte v4.2.19 */






function TagCheckbox_svelte_create_fragment(ctx) {
	let label;
	let input;
	let t0;
	let span;
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			label = (0,internal/* element */.ND4)("label");
			input = (0,internal/* element */.ND4)("input");
			t0 = (0,internal/* space */.xem)();
			span = (0,internal/* element */.ND4)("span");
			t1 = (0,internal/* text */.Qq7)(/*tagName*/ ctx[0]);
			(0,internal/* attr */.CFu)(input, "name", /*tagName*/ ctx[0]);
			(0,internal/* attr */.CFu)(input, "type", "checkbox");
			input.disabled = /*disabled*/ ctx[2];
			(0,internal/* attr */.CFu)(input, "class", "svelte-yr11cf");
			(0,internal/* attr */.CFu)(label, "class", "tag svelte-yr11cf");
			(0,internal/* attr */.CFu)(label, "data-checked", /*checked*/ ctx[1]);
			(0,internal/* set_style */.hgi)(label, "background-color", /*tag*/ ctx[3] ? /*tag*/ ctx[3].hex : 'transparent');
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label, anchor);
			(0,internal/* append */.BCw)(label, input);
			input.checked = /*checked*/ ctx[1];
			(0,internal/* set_input_value */.Gvd)(input, /*tagName*/ ctx[0]);
			(0,internal/* append */.BCw)(label, t0);
			(0,internal/* append */.BCw)(label, span);
			(0,internal/* append */.BCw)(span, t1);

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(input, "change", /*input_change_handler*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*tagName*/ 1) {
				(0,internal/* attr */.CFu)(input, "name", /*tagName*/ ctx[0]);
			}

			if (dirty & /*disabled*/ 4) {
				input.disabled = /*disabled*/ ctx[2];
			}

			if (dirty & /*checked*/ 2) {
				input.checked = /*checked*/ ctx[1];
			}

			if (dirty & /*tagName*/ 1) {
				(0,internal/* set_input_value */.Gvd)(input, /*tagName*/ ctx[0]);
			}

			if (dirty & /*tagName*/ 1) (0,internal/* set_data */.iQh)(t1, /*tagName*/ ctx[0]);

			if (dirty & /*checked*/ 2) {
				(0,internal/* attr */.CFu)(label, "data-checked", /*checked*/ ctx[1]);
			}

			if (dirty & /*tag*/ 8) {
				(0,internal/* set_style */.hgi)(label, "background-color", /*tag*/ ctx[3] ? /*tag*/ ctx[3].hex : 'transparent');
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(label);
			}

			mounted = false;
			dispose();
		}
	};
}

function TagCheckbox_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(8, $settings = $$value));
	let tag;
	let { tagName } = $$props;
	let { checked } = $$props;
	let { group } = $$props;
	let { disabled = false } = $$props;
	let { selectMax = 0 } = $$props;
	let { selectedVal } = $$props;

	// get tag object if available
	function setTag(name) {
		if (name) {
			if (Object.hasOwn($settings.tags, name)) {
				$$invalidate(3, tag = $settings.tags[name]);
			}

			if (Object.hasOwn($settings.activityTypes, name)) {
				$$invalidate(3, tag = $settings.activityTypes[name]);
			}
		}
	}

	function updateCheckbox(group) {
		$$invalidate(1, checked = group.indexOf(tagName) >= 0);
	}

	function updateGroup(checked) {
		const intSelectMax = parseInt(selectMax);
		const index = group.indexOf(tagName);

		if (checked) {
			if (index < 0) {
				if (intSelectMax > 0) {
					if (intSelectMax === 1) {
						$$invalidate(4, group = [tagName]);
						$$invalidate(5, selectedVal = tagName);
					} else if (group.length <= intSelectMax) {
						group.push(tagName);
					}
				} else {
					group.push(tagName);
				}

				$$invalidate(4, group);
			}
		} else {
			if (index >= 0) {
				group.splice(index, 1);
				$$invalidate(4, group);
			}
		}
	} //        console.log(group);

	function input_change_handler() {
		checked = this.checked;
		tagName = this.value;
		$$invalidate(1, checked);
		$$invalidate(0, tagName);
	}

	$$self.$$set = $$props => {
		if ('tagName' in $$props) $$invalidate(0, tagName = $$props.tagName);
		if ('checked' in $$props) $$invalidate(1, checked = $$props.checked);
		if ('group' in $$props) $$invalidate(4, group = $$props.group);
		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
		if ('selectMax' in $$props) $$invalidate(6, selectMax = $$props.selectMax);
		if ('selectedVal' in $$props) $$invalidate(5, selectedVal = $$props.selectedVal);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*tagName*/ 1) {
			$: setTag(tagName);
		}

		if ($$self.$$.dirty & /*group*/ 16) {
			$: updateCheckbox(group);
		}

		if ($$self.$$.dirty & /*checked*/ 2) {
			$: updateGroup(checked);
		}
	};

	return [
		tagName,
		checked,
		disabled,
		tag,
		group,
		selectedVal,
		selectMax,
		input_change_handler
	];
}

class TagCheckbox extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, TagCheckbox_svelte_instance, TagCheckbox_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			tagName: 0,
			checked: 1,
			group: 4,
			disabled: 2,
			selectMax: 6,
			selectedVal: 5
		});
	}
}

/* harmony default export */ const TagCheckbox_svelte = (TagCheckbox);

;// ./src/lib/input/TagCheckboxBar.svelte
/* src/lib/input/TagCheckboxBar.svelte generated by Svelte v4.2.19 */





function TagCheckboxBar_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (17:4) {#each tags as tag}
function TagCheckboxBar_svelte_create_each_block(ctx) {
	let tagcheckbox;
	let updating_selectedVal;
	let updating_group;
	let current;

	function tagcheckbox_selectedVal_binding(value) {
		/*tagcheckbox_selectedVal_binding*/ ctx[7](value);
	}

	function tagcheckbox_group_binding(value) {
		/*tagcheckbox_group_binding*/ ctx[8](value);
	}

	let tagcheckbox_props = {
		tagName: /*tag*/ ctx[9],
		selectMax: /*selectMax*/ ctx[6],
		disabled: /*disabled*/ ctx[5]
	};

	if (/*value*/ ctx[1] !== void 0) {
		tagcheckbox_props.selectedVal = /*value*/ ctx[1];
	}

	if (/*selected*/ ctx[0] !== void 0) {
		tagcheckbox_props.group = /*selected*/ ctx[0];
	}

	tagcheckbox = new TagCheckbox_svelte({ props: tagcheckbox_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckbox, 'selectedVal', tagcheckbox_selectedVal_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckbox, 'group', tagcheckbox_group_binding));

	return {
		c() {
			(0,internal/* create_component */.N0i)(tagcheckbox.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(tagcheckbox, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const tagcheckbox_changes = {};
			if (dirty & /*tags*/ 16) tagcheckbox_changes.tagName = /*tag*/ ctx[9];
			if (dirty & /*selectMax*/ 64) tagcheckbox_changes.selectMax = /*selectMax*/ ctx[6];
			if (dirty & /*disabled*/ 32) tagcheckbox_changes.disabled = /*disabled*/ ctx[5];

			if (!updating_selectedVal && dirty & /*value*/ 2) {
				updating_selectedVal = true;
				tagcheckbox_changes.selectedVal = /*value*/ ctx[1];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_selectedVal = false);
			}

			if (!updating_group && dirty & /*selected*/ 1) {
				updating_group = true;
				tagcheckbox_changes.group = /*selected*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_group = false);
			}

			tagcheckbox.$set(tagcheckbox_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(tagcheckbox.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(tagcheckbox.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(tagcheckbox, detaching);
		}
	};
}

function TagCheckboxBar_svelte_create_fragment(ctx) {
	let section;
	let section_class_value;
	let current;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*tags*/ ctx[4]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = TagCheckboxBar_svelte_create_each_block(TagCheckboxBar_svelte_get_each_context(ctx, each_value, i));
	}

	const out = i => (0,internal/* transition_out */.Tn8)(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(section, "class", section_class_value = ['tags'].concat(/*classes*/ ctx[3]).join(' '));
			(0,internal/* attr */.CFu)(section, "name", /*name*/ ctx[2]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(section, null);
				}
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*tags, selectMax, disabled, value, selected*/ 115) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*tags*/ ctx[4]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = TagCheckboxBar_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
					} else {
						each_blocks[i] = TagCheckboxBar_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
						each_blocks[i].m(section, null);
					}
				}

				(0,internal/* group_outros */.V44)();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				(0,internal/* check_outros */.GYV)();
			}

			if (!current || dirty & /*classes*/ 8 && section_class_value !== (section_class_value = ['tags'].concat(/*classes*/ ctx[3]).join(' '))) {
				(0,internal/* attr */.CFu)(section, "class", section_class_value);
			}

			if (!current || dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(section, "name", /*name*/ ctx[2]);
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
		}
	};
}

function TagCheckboxBar_svelte_instance($$self, $$props, $$invalidate) {
	let { name } = $$props;
	let { classes = [] } = $$props;
	let { tags } = $$props;
	let { selected = [] } = $$props;
	let { value } = $$props;
	let { disabled = false } = $$props;
	let { selectMax = 0 } = $$props;

	function tagcheckbox_selectedVal_binding(value$1) {
		value = value$1;
		$$invalidate(1, value);
	}

	function tagcheckbox_group_binding(value) {
		selected = value;
		$$invalidate(0, selected);
	}

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(2, name = $$props.name);
		if ('classes' in $$props) $$invalidate(3, classes = $$props.classes);
		if ('tags' in $$props) $$invalidate(4, tags = $$props.tags);
		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
		if ('value' in $$props) $$invalidate(1, value = $$props.value);
		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
		if ('selectMax' in $$props) $$invalidate(6, selectMax = $$props.selectMax);
	};

	return [
		selected,
		value,
		name,
		classes,
		tags,
		disabled,
		selectMax,
		tagcheckbox_selectedVal_binding,
		tagcheckbox_group_binding
	];
}

class TagCheckboxBar extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, TagCheckboxBar_svelte_instance, TagCheckboxBar_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			name: 2,
			classes: 3,
			tags: 4,
			selected: 0,
			value: 1,
			disabled: 5,
			selectMax: 6
		});
	}
}

/* harmony default export */ const TagCheckboxBar_svelte = (TagCheckboxBar);
;// ./src/TagEditor.svelte
/* src/TagEditor.svelte generated by Svelte v4.2.19 */






function TagEditor_svelte_create_else_block(ctx) {
	let p;

	return {
		c() {
			p = (0,internal/* element */.ND4)("p");
			p.textContent = "This provided source has no tags";
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, p, anchor);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(p);
			}
		}
	};
}

// (18:0) {#if sourceHasTags}
function TagEditor_svelte_create_if_block(ctx) {
	let h30;
	let t1;
	let tagcheckboxbar0;
	let t2;
	let h31;
	let t4;
	let tagcheckboxbar1;
	let updating_selected;
	let current;

	tagcheckboxbar0 = new TagCheckboxBar_svelte({
			props: {
				tags: /*source*/ ctx[0].tags,
				disabled: true
			}
		});

	function tagcheckboxbar1_selected_binding(value) {
		/*tagcheckboxbar1_selected_binding*/ ctx[3](value);
	}

	let tagcheckboxbar1_props = {
		name: "edit-tags",
		tags: /*availableTags*/ ctx[2]
	};

	if (/*source*/ ctx[0].tags !== void 0) {
		tagcheckboxbar1_props.selected = /*source*/ ctx[0].tags;
	}

	tagcheckboxbar1 = new TagCheckboxBar_svelte({ props: tagcheckboxbar1_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar1, 'selected', tagcheckboxbar1_selected_binding));

	return {
		c() {
			h30 = (0,internal/* element */.ND4)("h3");
			h30.textContent = "Selected";
			t1 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(tagcheckboxbar0.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			h31 = (0,internal/* element */.ND4)("h3");
			h31.textContent = "Choose Tags";
			t4 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(tagcheckboxbar1.$$.fragment);
			(0,internal/* attr */.CFu)(h30, "class", "svelte-164mia4");
			(0,internal/* attr */.CFu)(h31, "class", "svelte-164mia4");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h30, anchor);
			(0,internal/* insert */.Yry)(target, t1, anchor);
			(0,internal/* mount_component */.wSR)(tagcheckboxbar0, target, anchor);
			(0,internal/* insert */.Yry)(target, t2, anchor);
			(0,internal/* insert */.Yry)(target, h31, anchor);
			(0,internal/* insert */.Yry)(target, t4, anchor);
			(0,internal/* mount_component */.wSR)(tagcheckboxbar1, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const tagcheckboxbar0_changes = {};
			if (dirty & /*source*/ 1) tagcheckboxbar0_changes.tags = /*source*/ ctx[0].tags;
			tagcheckboxbar0.$set(tagcheckboxbar0_changes);
			const tagcheckboxbar1_changes = {};

			if (!updating_selected && dirty & /*source*/ 1) {
				updating_selected = true;
				tagcheckboxbar1_changes.selected = /*source*/ ctx[0].tags;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_selected = false);
			}

			tagcheckboxbar1.$set(tagcheckboxbar1_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(tagcheckboxbar0.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(tagcheckboxbar1.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(tagcheckboxbar0.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(tagcheckboxbar1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h30);
				(0,internal/* detach */.YoD)(t1);
				(0,internal/* detach */.YoD)(t2);
				(0,internal/* detach */.YoD)(h31);
				(0,internal/* detach */.YoD)(t4);
			}

			(0,internal/* destroy_component */.Hbl)(tagcheckboxbar0, detaching);
			(0,internal/* destroy_component */.Hbl)(tagcheckboxbar1, detaching);
		}
	};
}

function TagEditor_svelte_create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [TagEditor_svelte_create_if_block, TagEditor_svelte_create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*sourceHasTags*/ ctx[1]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,internal/* check_outros */.GYV)();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				(0,internal/* transition_in */.c7F)(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			if_blocks[current_block_type_index].d(detaching);
		}
	};
}

function TagEditor_svelte_instance($$self, $$props, $$invalidate) {
	let sourceHasTags;
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(4, $settings = $$value));
	let availableTags = Object.keys($settings.tags);
	let { source = {} } = $$props;

	function tagcheckboxbar1_selected_binding(value) {
		if ($$self.$$.not_equal(source.tags, value)) {
			source.tags = value;
			$$invalidate(0, source);
		}
	}

	$$self.$$set = $$props => {
		if ('source' in $$props) $$invalidate(0, source = $$props.source);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*source*/ 1) {
			$: $$invalidate(1, sourceHasTags = Object.hasOwn(source, 'tags'));
		}
	};

	return [source, sourceHasTags, availableTags, tagcheckboxbar1_selected_binding];
}

class TagEditor extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, TagEditor_svelte_instance, TagEditor_svelte_create_fragment, internal/* safe_not_equal */.jXN, { source: 0 });
	}
}

/* harmony default export */ const TagEditor_svelte = (TagEditor);

;// ./src/lib/Log.js



class Log {
    constructor(
        durationType,
        durationIncrement,
        occurredAt = null,
        text = null,
        sentiment = null,
        username = null
    ){
        this.createdAt = (new Date()).toISOString();
        this.occurredAt = getDateTimeStr(occurredAt); 
        this.text = text ? text.replace(/(<([^>]+)>)/gi, "") : null;
        this.durationType = durationType;
        this.durationIncrement = durationIncrement;
        this.sentiment = sentiment ? SentimentEnum[sentiment] : SentimentEnum.satisfied; 
        this.username = username;
    }

}

/* harmony default export */ const lib_Log = (Log);
;// ./src/lib/icons/plus.svelte
/* src/lib/icons/plus.svelte generated by Svelte v4.2.19 */




function plus_svelte_create_fragment(ctx) {
	let svg;
	let g;
	let path;
	let svg_width_value;
	let svg_height_value;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			g = (0,internal/* svg_element */.QQy)("g");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "d", "M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579\r\n\t\tc-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079\r\n\t\th123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067\r\n\t\tC344.97,132.147,349.03,136.213,349.03,141.226z");
			(0,internal/* attr */.CFu)(svg, "fill", "#000000");
			(0,internal/* attr */.CFu)(svg, "version", "1.1");
			(0,internal/* attr */.CFu)(svg, "id", "Capa_1");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			(0,internal/* attr */.CFu)(svg, "width", svg_width_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "height", svg_height_value = "" + (/*size*/ ctx[0] + "px"));
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 349.03 349.031");
			(0,internal/* attr */.CFu)(svg, "xml:space", "preserve");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, g);
			(0,internal/* append */.BCw)(g, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*size*/ 1 && svg_width_value !== (svg_width_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "width", svg_width_value);
			}

			if (dirty & /*size*/ 1 && svg_height_value !== (svg_height_value = "" + (/*size*/ ctx[0] + "px"))) {
				(0,internal/* attr */.CFu)(svg, "height", svg_height_value);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function plus_svelte_instance($$self, $$props, $$invalidate) {
	let { size = 26 } = $$props;

	$$self.$$set = $$props => {
		if ('size' in $$props) $$invalidate(0, size = $$props.size);
	};

	return [size];
}

class Plus extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, plus_svelte_instance, plus_svelte_create_fragment, internal/* safe_not_equal */.jXN, { size: 0 });
	}
}

/* harmony default export */ const plus_svelte = (Plus);
;// ./src/lib/input/Duration.svelte
/* src/lib/input/Duration.svelte generated by Svelte v4.2.19 */






function Duration_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i][0];
	child_ctx[9] = list[i][1];
	return child_ctx;
}

// (14:0) {#if label && name}
function Duration_svelte_create_if_block_1(ctx) {
	let label_1;
	let t0;
	let t1;

	return {
		c() {
			label_1 = (0,internal/* element */.ND4)("label");
			t0 = (0,internal/* text */.Qq7)(/*label*/ ctx[2]);
			t1 = (0,internal/* text */.Qq7)(":");
			(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[3]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label_1, anchor);
			(0,internal/* append */.BCw)(label_1, t0);
			(0,internal/* append */.BCw)(label_1, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 4) (0,internal/* set_data */.iQh)(t0, /*label*/ ctx[2]);

			if (dirty & /*name*/ 8) {
				(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[3]);
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(label_1);
			}
		}
	};
}

// (17:0) {#if name }
function Duration_svelte_create_if_block(ctx) {
	let select;
	let t;
	let numberinput;
	let updating_val;
	let current;
	let mounted;
	let dispose;
	let each_value = (0,internal/* ensure_array_like */.rv_)(Object.entries(DurationEnum));
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = Duration_svelte_create_each_block(Duration_svelte_get_each_context(ctx, each_value, i));
	}

	function numberinput_val_binding(value) {
		/*numberinput_val_binding*/ ctx[7](value);
	}

	let numberinput_props = {
		disabled: /*disabled*/ ctx[4],
		name: "" + (/*name*/ ctx[3] + "-inc")
	};

	if (/*durationIncrement*/ ctx[1] !== void 0) {
		numberinput_props.val = /*durationIncrement*/ ctx[1];
	}

	numberinput = new Number_svelte({ props: numberinput_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(numberinput, 'val', numberinput_val_binding));

	return {
		c() {
			select = (0,internal/* element */.ND4)("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(numberinput.$$.fragment);
			select.disabled = /*disabled*/ ctx[4];
			(0,internal/* attr */.CFu)(select, "name", /*name*/ ctx[3]);
			if (/*durationType*/ ctx[0] === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select_change_handler*/ ctx[6].call(select));
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, select, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			(0,internal/* select_option */.fs8)(select, /*durationType*/ ctx[0], true);
			(0,internal/* insert */.Yry)(target, t, anchor);
			(0,internal/* mount_component */.wSR)(numberinput, target, anchor);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(select, "change", /*select_change_handler*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*Object*/ 0) {
				each_value = (0,internal/* ensure_array_like */.rv_)(Object.entries(DurationEnum));
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = Duration_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = Duration_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*disabled*/ 16) {
				select.disabled = /*disabled*/ ctx[4];
			}

			if (!current || dirty & /*name*/ 8) {
				(0,internal/* attr */.CFu)(select, "name", /*name*/ ctx[3]);
			}

			if (dirty & /*durationType, Object*/ 1) {
				(0,internal/* select_option */.fs8)(select, /*durationType*/ ctx[0]);
			}

			const numberinput_changes = {};
			if (dirty & /*disabled*/ 16) numberinput_changes.disabled = /*disabled*/ ctx[4];
			if (dirty & /*name*/ 8) numberinput_changes.name = "" + (/*name*/ ctx[3] + "-inc");

			if (!updating_val && dirty & /*durationIncrement*/ 2) {
				updating_val = true;
				numberinput_changes.val = /*durationIncrement*/ ctx[1];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_val = false);
			}

			numberinput.$set(numberinput_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(numberinput.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(numberinput.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(select);
				(0,internal/* detach */.YoD)(t);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
			(0,internal/* destroy_component */.Hbl)(numberinput, detaching);
			mounted = false;
			dispose();
		}
	};
}

// (19:8) {#each Object.entries(DurationEnum) as [_, duration]}
function Duration_svelte_create_each_block(ctx) {
	let option;
	let t_value = /*duration*/ ctx[9].name + "";
	let t;
	let option_value_value;

	return {
		c() {
			option = (0,internal/* element */.ND4)("option");
			t = (0,internal/* text */.Qq7)(t_value);
			option.__value = option_value_value = /*duration*/ ctx[9].key;
			(0,internal/* set_input_value */.Gvd)(option, option.__value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, option, anchor);
			(0,internal/* append */.BCw)(option, t);
		},
		p: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(option);
			}
		}
	};
}

function Duration_svelte_create_fragment(ctx) {
	let t;
	let if_block1_anchor;
	let current;
	let if_block0 = /*label*/ ctx[2] && /*name*/ ctx[3] && Duration_svelte_create_if_block_1(ctx);
	let if_block1 = /*name*/ ctx[3] && Duration_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			if_block1_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			(0,internal/* insert */.Yry)(target, t, anchor);
			if (if_block1) if_block1.m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*label*/ ctx[2] && /*name*/ ctx[3]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = Duration_svelte_create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(t.parentNode, t);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*name*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*name*/ 8) {
						(0,internal/* transition_in */.c7F)(if_block1, 1);
					}
				} else {
					if_block1 = Duration_svelte_create_if_block(ctx);
					if_block1.c();
					(0,internal/* transition_in */.c7F)(if_block1, 1);
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block1);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t);
				(0,internal/* detach */.YoD)(if_block1_anchor);
			}

			if (if_block0) if_block0.d(detaching);
			if (if_block1) if_block1.d(detaching);
		}
	};
}

function Duration_svelte_instance($$self, $$props, $$invalidate) {
	let { label } = $$props;
	let { name } = $$props;
	let { durationType } = $$props;
	let { durationIncrement } = $$props;
	let { value } = $$props;
	let { disabled = false } = $$props;

	function select_change_handler() {
		durationType = (0,internal/* select_value */.Hw5)(this);
		$$invalidate(0, durationType);
	}

	function numberinput_val_binding(value) {
		durationIncrement = value;
		$$invalidate(1, durationIncrement);
	}

	$$self.$$set = $$props => {
		if ('label' in $$props) $$invalidate(2, label = $$props.label);
		if ('name' in $$props) $$invalidate(3, name = $$props.name);
		if ('durationType' in $$props) $$invalidate(0, durationType = $$props.durationType);
		if ('durationIncrement' in $$props) $$invalidate(1, durationIncrement = $$props.durationIncrement);
		if ('value' in $$props) $$invalidate(5, value = $$props.value);
		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*durationIncrement, durationType*/ 3) {
			$: $$invalidate(5, value = durationIncrement + durationType);
		}
	};

	return [
		durationType,
		durationIncrement,
		label,
		name,
		disabled,
		value,
		select_change_handler,
		numberinput_val_binding
	];
}

class Duration extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, Duration_svelte_instance, Duration_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			label: 2,
			name: 3,
			durationType: 0,
			durationIncrement: 1,
			value: 5,
			disabled: 4
		});
	}
}

/* harmony default export */ const Duration_svelte = (Duration);
;// ./src/lib/input/OccurredAt.svelte
/* src/lib/input/OccurredAt.svelte generated by Svelte v4.2.19 */





function OccurredAt_svelte_create_fragment(ctx) {
	let div0;
	let label0;
	let t0;
	let t1;
	let p;
	let t2;
	let t3;
	let div1;
	let label1;
	let t4;
	let t5;
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			div0 = (0,internal/* element */.ND4)("div");
			label0 = (0,internal/* element */.ND4)("label");
			t0 = (0,internal/* text */.Qq7)("Occurred :");
			t1 = (0,internal/* space */.xem)();
			p = (0,internal/* element */.ND4)("p");
			t2 = (0,internal/* text */.Qq7)(/*agoStr*/ ctx[1]);
			t3 = (0,internal/* space */.xem)();
			div1 = (0,internal/* element */.ND4)("div");
			label1 = (0,internal/* element */.ND4)("label");
			t4 = (0,internal/* text */.Qq7)("At :");
			t5 = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			(0,internal/* attr */.CFu)(label0, "for", /*name*/ ctx[2]);
			(0,internal/* attr */.CFu)(label1, "for", /*name*/ ctx[2]);
			(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[2]);
			input.disabled = /*disabled*/ ctx[3];
			(0,internal/* attr */.CFu)(input, "type", "datetime-local");
			(0,internal/* attr */.CFu)(input, "class", "svelte-1af5rfj");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div0, anchor);
			(0,internal/* append */.BCw)(div0, label0);
			(0,internal/* append */.BCw)(label0, t0);
			(0,internal/* append */.BCw)(div0, t1);
			(0,internal/* append */.BCw)(div0, p);
			(0,internal/* append */.BCw)(p, t2);
			(0,internal/* insert */.Yry)(target, t3, anchor);
			(0,internal/* insert */.Yry)(target, div1, anchor);
			(0,internal/* append */.BCw)(div1, label1);
			(0,internal/* append */.BCw)(label1, t4);
			(0,internal/* append */.BCw)(div1, t5);
			(0,internal/* append */.BCw)(div1, input);
			(0,internal/* set_input_value */.Gvd)(input, /*occurredAt*/ ctx[0]);

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(input, "input", /*input_input_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(label0, "for", /*name*/ ctx[2]);
			}

			if (dirty & /*agoStr*/ 2) (0,internal/* set_data */.iQh)(t2, /*agoStr*/ ctx[1]);

			if (dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(label1, "for", /*name*/ ctx[2]);
			}

			if (dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[2]);
			}

			if (dirty & /*disabled*/ 8) {
				input.disabled = /*disabled*/ ctx[3];
			}

			if (dirty & /*occurredAt*/ 1) {
				(0,internal/* set_input_value */.Gvd)(input, /*occurredAt*/ ctx[0]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div0);
				(0,internal/* detach */.YoD)(t3);
				(0,internal/* detach */.YoD)(div1);
			}

			mounted = false;
			dispose();
		}
	};
}

function OccurredAt_svelte_instance($$self, $$props, $$invalidate) {
	let { name } = $$props;
	let { occurredAt } = $$props;
	let { agoStr } = $$props;
	let { disabled = false } = $$props;

	function setOccurred(isoString = null) {
		if (isoString === null || isoString !== '') {
			$$invalidate(0, occurredAt = isoString);
		}
	}

	function input_input_handler() {
		occurredAt = this.value;
		$$invalidate(0, occurredAt);
	}

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(2, name = $$props.name);
		if ('occurredAt' in $$props) $$invalidate(0, occurredAt = $$props.occurredAt);
		if ('agoStr' in $$props) $$invalidate(1, agoStr = $$props.agoStr);
		if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*occurredAt*/ 1) {
			$: $$invalidate(1, agoStr = ago(occurredAt));
		}

		if ($$self.$$.dirty & /*occurredAt*/ 1) {
			$: setOccurred(occurredAt);
		}
	};

	return [occurredAt, agoStr, name, disabled, input_input_handler];
}

class OccurredAt extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, OccurredAt_svelte_instance, OccurredAt_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			name: 2,
			occurredAt: 0,
			agoStr: 1,
			disabled: 3
		});
	}
}

/* harmony default export */ const OccurredAt_svelte = (OccurredAt);

;// ./src/LogEntry.svelte
/* src/LogEntry.svelte generated by Svelte v4.2.19 */









function LogEntry_svelte_create_if_block(ctx) {
	let article;
	let header;
	let button0;
	let saveicon;
	let t0;
	let button1;
	let deleteicon;
	let t1;
	let occurredat;
	let updating_occurredAt;
	let t2;
	let duration;
	let updating_durationType;
	let updating_durationIncrement;
	let t3;
	let label;
	let t5;
	let textarea;
	let current;
	let mounted;
	let dispose;
	saveicon = new save_svelte({});
	deleteicon = new bin_svelte({});

	function occurredat_occurredAt_binding(value) {
		/*occurredat_occurredAt_binding*/ ctx[5](value);
	}

	let occurredat_props = { disabled: /*disabled*/ ctx[1] };

	if (/*log*/ ctx[0].occurredAt !== void 0) {
		occurredat_props.occurredAt = /*log*/ ctx[0].occurredAt;
	}

	occurredat = new OccurredAt_svelte({ props: occurredat_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(occurredat, 'occurredAt', occurredat_occurredAt_binding));

	function duration_durationType_binding(value) {
		/*duration_durationType_binding*/ ctx[6](value);
	}

	function duration_durationIncrement_binding(value) {
		/*duration_durationIncrement_binding*/ ctx[7](value);
	}

	let duration_props = {
		label: "duration",
		name: "log-entry-duration",
		disabled: /*disabled*/ ctx[1]
	};

	if (/*log*/ ctx[0].durationType !== void 0) {
		duration_props.durationType = /*log*/ ctx[0].durationType;
	}

	if (/*log*/ ctx[0].durationIncrement !== void 0) {
		duration_props.durationIncrement = /*log*/ ctx[0].durationIncrement;
	}

	duration = new Duration_svelte({ props: duration_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(duration, 'durationType', duration_durationType_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(duration, 'durationIncrement', duration_durationIncrement_binding));

	return {
		c() {
			article = (0,internal/* element */.ND4)("article");
			header = (0,internal/* element */.ND4)("header");
			button0 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(saveicon.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			button1 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(deleteicon.$$.fragment);
			t1 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(occurredat.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(duration.$$.fragment);
			t3 = (0,internal/* space */.xem)();
			label = (0,internal/* element */.ND4)("label");
			label.textContent = "Note:";
			t5 = (0,internal/* space */.xem)();
			textarea = (0,internal/* element */.ND4)("textarea");
			(0,internal/* attr */.CFu)(button0, "class", "icon");
			(0,internal/* attr */.CFu)(button1, "class", "icon");
			(0,internal/* attr */.CFu)(label, "for", "log-entry-text");
			(0,internal/* attr */.CFu)(textarea, "name", "log-entry-text");
			(0,internal/* attr */.CFu)(textarea, "type", "textarea");
			(0,internal/* attr */.CFu)(textarea, "rows", "2");
			(0,internal/* attr */.CFu)(textarea, "class", "svelte-wek6yg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, article, anchor);
			(0,internal/* append */.BCw)(article, header);
			(0,internal/* append */.BCw)(header, button0);
			(0,internal/* mount_component */.wSR)(saveicon, button0, null);
			(0,internal/* append */.BCw)(header, t0);
			(0,internal/* append */.BCw)(header, button1);
			(0,internal/* mount_component */.wSR)(deleteicon, button1, null);
			(0,internal/* append */.BCw)(article, t1);
			(0,internal/* mount_component */.wSR)(occurredat, article, null);
			(0,internal/* append */.BCw)(article, t2);
			(0,internal/* mount_component */.wSR)(duration, article, null);
			(0,internal/* append */.BCw)(article, t3);
			(0,internal/* append */.BCw)(article, label);
			(0,internal/* append */.BCw)(article, t5);
			(0,internal/* append */.BCw)(article, textarea);
			(0,internal/* set_input_value */.Gvd)(textarea, /*log*/ ctx[0].text);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(button0, "click", /*click_handler*/ ctx[3]),
					(0,internal/* listen */.KTR)(button1, "click", /*click_handler_1*/ ctx[4]),
					(0,internal/* listen */.KTR)(textarea, "input", /*textarea_input_handler*/ ctx[8])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			const occurredat_changes = {};
			if (dirty & /*disabled*/ 2) occurredat_changes.disabled = /*disabled*/ ctx[1];

			if (!updating_occurredAt && dirty & /*log*/ 1) {
				updating_occurredAt = true;
				occurredat_changes.occurredAt = /*log*/ ctx[0].occurredAt;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_occurredAt = false);
			}

			occurredat.$set(occurredat_changes);
			const duration_changes = {};
			if (dirty & /*disabled*/ 2) duration_changes.disabled = /*disabled*/ ctx[1];

			if (!updating_durationType && dirty & /*log*/ 1) {
				updating_durationType = true;
				duration_changes.durationType = /*log*/ ctx[0].durationType;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_durationType = false);
			}

			if (!updating_durationIncrement && dirty & /*log*/ 1) {
				updating_durationIncrement = true;
				duration_changes.durationIncrement = /*log*/ ctx[0].durationIncrement;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_durationIncrement = false);
			}

			duration.$set(duration_changes);

			if (dirty & /*log*/ 1) {
				(0,internal/* set_input_value */.Gvd)(textarea, /*log*/ ctx[0].text);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(saveicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(deleteicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(occurredat.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(duration.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(saveicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(deleteicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(occurredat.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(duration.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(article);
			}

			(0,internal/* destroy_component */.Hbl)(saveicon);
			(0,internal/* destroy_component */.Hbl)(deleteicon);
			(0,internal/* destroy_component */.Hbl)(occurredat);
			(0,internal/* destroy_component */.Hbl)(duration);
			mounted = false;
			(0,internal/* run_all */.oOW)(dispose);
		}
	};
}

function LogEntry_svelte_create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*log*/ ctx[0] && LogEntry_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*log*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*log*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block, 1);
					}
				} else {
					if_block = LogEntry_svelte_create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.c7F)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

function LogEntry_svelte_instance($$self, $$props, $$invalidate) {
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	let { log } = $$props;
	let { disabled = false } = $$props;
	const click_handler = () => dispatch('save');
	const click_handler_1 = () => dispatch('remove', { log });

	function occurredat_occurredAt_binding(value) {
		if ($$self.$$.not_equal(log.occurredAt, value)) {
			log.occurredAt = value;
			$$invalidate(0, log);
		}
	}

	function duration_durationType_binding(value) {
		if ($$self.$$.not_equal(log.durationType, value)) {
			log.durationType = value;
			$$invalidate(0, log);
		}
	}

	function duration_durationIncrement_binding(value) {
		if ($$self.$$.not_equal(log.durationIncrement, value)) {
			log.durationIncrement = value;
			$$invalidate(0, log);
		}
	}

	function textarea_input_handler() {
		log.text = this.value;
		$$invalidate(0, log);
	}

	$$self.$$set = $$props => {
		if ('log' in $$props) $$invalidate(0, log = $$props.log);
		if ('disabled' in $$props) $$invalidate(1, disabled = $$props.disabled);
	};

	return [
		log,
		disabled,
		dispatch,
		click_handler,
		click_handler_1,
		occurredat_occurredAt_binding,
		duration_durationType_binding,
		duration_durationIncrement_binding,
		textarea_input_handler
	];
}

class LogEntry extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, LogEntry_svelte_instance, LogEntry_svelte_create_fragment, internal/* safe_not_equal */.jXN, { log: 0, disabled: 1 });
	}
}

/* harmony default export */ const LogEntry_svelte = (LogEntry);

;// ./src/LogManager.svelte
/* src/LogManager.svelte generated by Svelte v4.2.19 */






//import { settings } from './lib/stores'
//import Filters from './lib/filters'







function LogManager_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[10] = list;
	child_ctx[11] = i;
	return child_ctx;
}

// (103:0) {:else}
function LogManager_svelte_create_else_block(ctx) {
	let p;

	return {
		c() {
			p = (0,internal/* element */.ND4)("p");
			p.textContent = "There aren't any logs, add some";
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, p, anchor);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(p);
			}
		}
	};
}

// (99:0) {#if sortedLogs.length > 0}
function LogManager_svelte_create_if_block(ctx) {
	let each_1_anchor;
	let current;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*sortedLogs*/ ctx[0]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = LogManager_svelte_create_each_block(LogManager_svelte_get_each_context(ctx, each_value, i));
	}

	const out = i => (0,internal/* transition_out */.Tn8)(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			(0,internal/* insert */.Yry)(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*sortedLogs, updateLog, removeLog*/ 13) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*sortedLogs*/ ctx[0]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = LogManager_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
					} else {
						each_blocks[i] = LogManager_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				(0,internal/* group_outros */.V44)();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(each_1_anchor);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
		}
	};
}

// (100:4) {#each sortedLogs as itemLog}
function LogManager_svelte_create_each_block(ctx) {
	let logentry;
	let updating_log;
	let current;

	function logentry_log_binding(value) {
		/*logentry_log_binding*/ ctx[5](value, /*itemLog*/ ctx[9], /*each_value*/ ctx[10], /*itemLog_index*/ ctx[11]);
	}

	let logentry_props = {};

	if (/*itemLog*/ ctx[9] !== void 0) {
		logentry_props.log = /*itemLog*/ ctx[9];
	}

	logentry = new LogEntry_svelte({ props: logentry_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(logentry, 'log', logentry_log_binding));
	logentry.$on("save", /*updateLog*/ ctx[2]);
	logentry.$on("remove", /*removeLog*/ ctx[3]);

	return {
		c() {
			(0,internal/* create_component */.N0i)(logentry.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(logentry, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const logentry_changes = {};

			if (!updating_log && dirty & /*sortedLogs*/ 1) {
				updating_log = true;
				logentry_changes.log = /*itemLog*/ ctx[9];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_log = false);
			}

			logentry.$set(logentry_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(logentry.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(logentry.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(logentry, detaching);
		}
	};
}

function LogManager_svelte_create_fragment(ctx) {
	let button;
	let addicon;
	let t;
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	let mounted;
	let dispose;
	addicon = new plus_svelte({ props: { size: 20 } });
	const if_block_creators = [LogManager_svelte_create_if_block, LogManager_svelte_create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*sortedLogs*/ ctx[0].length > 0) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(addicon.$$.fragment);
			t = (0,internal/* space */.xem)();
			if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
			(0,internal/* attr */.CFu)(button, "class", "icon medium");
			(0,internal/* attr */.CFu)(button, "name", "add-log");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* mount_component */.wSR)(addicon, button, null);
			(0,internal/* insert */.Yry)(target, t, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*addLog*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,internal/* check_outros */.GYV)();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				(0,internal/* transition_in */.c7F)(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(addicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(addicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
				(0,internal/* detach */.YoD)(t);
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			(0,internal/* destroy_component */.Hbl)(addicon);
			if_blocks[current_block_type_index].d(detaching);
			mounted = false;
			dispose();
		}
	};
}

let sortByWhat = 'occurredAt';

function LogManager_svelte_instance($$self, $$props, $$invalidate) {
	let db = new index_es/* default */.A('logs', { revs_limit: 1, auto_compaction: true });

	// Set up
	let item = {};

	let sortedLogs = [];
	let { source = {} } = $$props;

	// fetch equivalent log item
	async function getItem() {
		if (Object.hasOwn(source, 'logItemId') && typeof source.logItemId === 'string') {
			try {
				item = await db.get(source.logItemId);
				$$invalidate(0, sortedLogs = (0,lodash.sortBy)(item.logs, [sortByWhat]).reverse());
			} catch(ignore) {
				
			}
		}
	}

	// Event handlers for adding, updating and removing item logs
	async function addLog() {
		let action = { ok: false };

		if (Object.hasOwn(item, 'logs') && Array.isArray(item.logs)) {
			item.logs.push(new lib_Log(source.durationType, source.durationIncrement));
			action = await db.put(item);
		} else {
			item = {
				logs: [new lib_Log(source.durationType, source.durationIncrement)]
			};

			action = await db.post(item);

			if (action.ok && action.id) {
				$$invalidate(4, source.logItemId = action.id, source);
				$$invalidate(4, source);
			}
		}

		if (action.ok) {
			await getItem();

			addToast({
				message: 'Log entry added',
				timeout: 3000
			});
		}
	}

	async function updateLog() {
		const update = await db.put(item);

		if (update.ok) {
			await getItem();

			addToast({
				message: 'Log entry saved',
				timeout: 3000
			});
		}
	}

	async function removeLog(event) {
		const { log } = event.detail;

		// filter out log to remove
		item.logs = item.logs.filter(logItem => {
			return logItem.createdAt !== log.createdAt;
		});

		const updated = await db.put(item);

		if (updated.ok) {
			await getItem();
			addToast({ message: 'Removed Log', timeout: 3000 });
		}
	}

	// Load todos on first run
	(0,runtime/* onMount */.Rc)(async () => {
		await getItem();
	});

	function logentry_log_binding(value, itemLog, each_value, itemLog_index) {
		each_value[itemLog_index] = value;
		$$invalidate(0, sortedLogs);
	}

	$$self.$$set = $$props => {
		if ('source' in $$props) $$invalidate(4, source = $$props.source);
	};

	return [sortedLogs, addLog, updateLog, removeLog, source, logentry_log_binding];
}

class LogManager extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, LogManager_svelte_instance, LogManager_svelte_create_fragment, internal/* safe_not_equal */.jXN, { source: 4 });
	}
}

/* harmony default export */ const LogManager_svelte = (LogManager);
;// ./src/lib/modals.js




const modalConfig = {
    tageditor: new lib_Modal({
        name: 'tageditor',
        title: 'Edit Tags',
        message: 'Add tags to help group and organise things',
        source: null,
        component: TagEditor_svelte
    }),
    logmanager: new lib_Modal({
        name: 'logmanager',
        title: 'Logs',
        message: 'Add and edit logs',
        source: null,
        component: LogManager_svelte
    })
}


// retrive configured modal by name
// merge/override default data
function getNewModal(modalName, modalData = {}) {
    let modal;
    if (Object.hasOwn(modalConfig, modalName)) {
        modal = modalConfig[modalName];
        modal.data = Object.assign(modal.data, modalData)
    } else {
        modal = {};
    }
    return modal;
}


;// ./src/lib/input/ModalBtn.svelte
/* src/lib/input/ModalBtn.svelte generated by Svelte v4.2.19 */






const get_icon_slot_changes = dirty => ({});
const get_icon_slot_context = ctx => ({});

// (41:4) {#if btnTitle }
function ModalBtn_svelte_create_if_block(ctx) {
	let t;

	return {
		c() {
			t = (0,internal/* text */.Qq7)(/*btnTitle*/ ctx[1]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*btnTitle*/ 2) (0,internal/* set_data */.iQh)(t, /*btnTitle*/ ctx[1]);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t);
			}
		}
	};
}

function ModalBtn_svelte_create_fragment(ctx) {
	let button;
	let t;
	let button_class_value;
	let current;
	let mounted;
	let dispose;
	const icon_slot_template = /*#slots*/ ctx[6].icon;
	const icon_slot = (0,internal/* create_slot */.Of3)(icon_slot_template, ctx, /*$$scope*/ ctx[5], get_icon_slot_context);
	let if_block = /*btnTitle*/ ctx[1] && ModalBtn_svelte_create_if_block(ctx);

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			if (icon_slot) icon_slot.c();
			t = (0,internal/* space */.xem)();
			if (if_block) if_block.c();
			(0,internal/* attr */.CFu)(button, "class", button_class_value = /*classes*/ ctx[0] + ' icon');
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);

			if (icon_slot) {
				icon_slot.m(button, null);
			}

			(0,internal/* append */.BCw)(button, t);
			if (if_block) if_block.m(button, null);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*loadModal*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (icon_slot) {
				if (icon_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					(0,internal/* update_slot_base */.nkG)(
						icon_slot,
						icon_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[5])
						: (0,internal/* get_slot_changes */.sWk)(icon_slot_template, /*$$scope*/ ctx[5], dirty, get_icon_slot_changes),
						get_icon_slot_context
					);
				}
			}

			if (/*btnTitle*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = ModalBtn_svelte_create_if_block(ctx);
					if_block.c();
					if_block.m(button, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (!current || dirty & /*classes*/ 1 && button_class_value !== (button_class_value = /*classes*/ ctx[0] + ' icon')) {
				(0,internal/* attr */.CFu)(button, "class", button_class_value);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(icon_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(icon_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
			}

			if (icon_slot) icon_slot.d(detaching);
			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function ModalBtn_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	let modal;

	function loadModal() {
		modal = getNewModal(modalName);
		modal.source = source;
		modal = addModal(modal);

		const unsubscribe = modals.subscribe(value => {
			// trigger reactivity on source
			$$invalidate(3, source);

			// check if the modal is still open / in the modals array
			let m = value.filter(t => {
				if (t.id === modal.id) {
					return true;
				}
			});

			// auto save source when modal has been closed / no longer in the modals array
			if (m.length === 0) {
				unsubscribe();
				dispatch('save');
			}
		});
	}

	let { classes = '' } = $$props;
	let { modalName } = $$props;
	let { source } = $$props;
	let { btnTitle } = $$props;

	$$self.$$set = $$props => {
		if ('classes' in $$props) $$invalidate(0, classes = $$props.classes);
		if ('modalName' in $$props) $$invalidate(4, modalName = $$props.modalName);
		if ('source' in $$props) $$invalidate(3, source = $$props.source);
		if ('btnTitle' in $$props) $$invalidate(1, btnTitle = $$props.btnTitle);
		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
	};

	return [classes, btnTitle, loadModal, source, modalName, $$scope, slots];
}

class ModalBtn extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, ModalBtn_svelte_instance, ModalBtn_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			classes: 0,
			modalName: 4,
			source: 3,
			btnTitle: 1
		});
	}
}

/* harmony default export */ const ModalBtn_svelte = (ModalBtn);
;// ./src/lib/input/TagButton.svelte
/* src/lib/input/TagButton.svelte generated by Svelte v4.2.19 */






function TagButton_svelte_create_fragment(ctx) {
	let button;
	let span;
	let t;
	let mounted;
	let dispose;

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			span = (0,internal/* element */.ND4)("span");
			t = (0,internal/* text */.Qq7)(/*tagName*/ ctx[0]);
			(0,internal/* attr */.CFu)(button, "class", "tag svelte-z8y88r");
			(0,internal/* set_style */.hgi)(button, "background-color", /*tag*/ ctx[1] ? /*tag*/ ctx[1].hex : 'transparent');
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* append */.BCw)(button, span);
			(0,internal/* append */.BCw)(span, t);

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*click_handler*/ ctx[3]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*tagName*/ 1) (0,internal/* set_data */.iQh)(t, /*tagName*/ ctx[0]);

			if (dirty & /*tag*/ 2) {
				(0,internal/* set_style */.hgi)(button, "background-color", /*tag*/ ctx[1] ? /*tag*/ ctx[1].hex : 'transparent');
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
			}

			mounted = false;
			dispose();
		}
	};
}

function TagButton_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(4, $settings = $$value));
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	let tag;
	let { tagName } = $$props;

	// get tag object if available
	function setTag(name) {
		if (name) {
			if (Object.hasOwn($settings.tags, name)) {
				$$invalidate(1, tag = $settings.tags[name]);
			}

			if (Object.hasOwn($settings.activityTypes, name)) {
				$$invalidate(1, tag = $settings.activityTypes[name]);
			}
		}
	}

	const click_handler = () => dispatch('tagClicked');

	$$self.$$set = $$props => {
		if ('tagName' in $$props) $$invalidate(0, tagName = $$props.tagName);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*tagName*/ 1) {
			$: setTag(tagName);
		}
	};

	return [tagName, tag, dispatch, click_handler];
}

class TagButton extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, TagButton_svelte_instance, TagButton_svelte_create_fragment, internal/* safe_not_equal */.jXN, { tagName: 0 });
	}
}

/* harmony default export */ const TagButton_svelte = (TagButton);

;// ./src/lib/input/SearchArray.svelte
/* src/lib/input/SearchArray.svelte generated by Svelte v4.2.19 */




function SearchArray_svelte_create_if_block(ctx) {
	let label_1;
	let t0;
	let t1;

	return {
		c() {
			label_1 = (0,internal/* element */.ND4)("label");
			t0 = (0,internal/* text */.Qq7)(/*label*/ ctx[0]);
			t1 = (0,internal/* text */.Qq7)(":");
			(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[1]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label_1, anchor);
			(0,internal/* append */.BCw)(label_1, t0);
			(0,internal/* append */.BCw)(label_1, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 1) (0,internal/* set_data */.iQh)(t0, /*label*/ ctx[0]);

			if (dirty & /*name*/ 2) {
				(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[1]);
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(label_1);
			}
		}
	};
}

function SearchArray_svelte_create_fragment(ctx) {
	let t;
	let input;
	let mounted;
	let dispose;
	let if_block = typeof /*label*/ ctx[0] !== "undefined" && SearchArray_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			t = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[1]);
			(0,internal/* attr */.CFu)(input, "type", "search");
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, t, anchor);
			(0,internal/* insert */.Yry)(target, input, anchor);
			(0,internal/* set_input_value */.Gvd)(input, /*term*/ ctx[2]);

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(input, "keyup", /*search*/ ctx[3]),
					(0,internal/* listen */.KTR)(input, "input", /*input_input_handler*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (typeof /*label*/ ctx[0] !== "undefined") {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = SearchArray_svelte_create_if_block(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*name*/ 2) {
				(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[1]);
			}

			if (dirty & /*term*/ 4 && input.value !== /*term*/ ctx[2]) {
				(0,internal/* set_input_value */.Gvd)(input, /*term*/ ctx[2]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t);
				(0,internal/* detach */.YoD)(input);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			(0,internal/* run_all */.oOW)(dispose);
		}
	};
}

function SearchArray_svelte_instance($$self, $$props, $$invalidate) {
	let term;
	let { source = [] } = $$props;
	let { results = [] } = $$props;
	let { label } = $$props;
	let { name } = $$props;

	function search() {
		if (term === '') {
			$$invalidate(4, results = source);
		} else {
			if (typeof term !== 'undefined' && term !== null && term !== '') {
				console.log(term);

				if (source) {
					$$invalidate(4, results);
				}

				let termParts = term.toLowerCase().split(' ');

				$$invalidate(4, results = source.filter(val => {
					let v = val.toLowerCase();
					let found = 1;

					// check if array value string contains all search term parts
					termParts.forEach(p => {
						if (v.indexOf(p) < 0) {
							found = 0;
						}
					});

					return found === 0 ? false : true;
				}).sort());
			}
		}
	}

	function input_input_handler() {
		term = this.value;
		$$invalidate(2, term);
	}

	$$self.$$set = $$props => {
		if ('source' in $$props) $$invalidate(5, source = $$props.source);
		if ('results' in $$props) $$invalidate(4, results = $$props.results);
		if ('label' in $$props) $$invalidate(0, label = $$props.label);
		if ('name' in $$props) $$invalidate(1, name = $$props.name);
	};

	return [label, name, term, search, results, source, input_input_handler];
}

class SearchArray extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, SearchArray_svelte_instance, SearchArray_svelte_create_fragment, internal/* safe_not_equal */.jXN, { source: 5, results: 4, label: 0, name: 1 });
	}
}

/* harmony default export */ const SearchArray_svelte = (SearchArray);
;// ./src/TagManager.svelte
/* src/TagManager.svelte generated by Svelte v4.2.19 */







function TagManager_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

function TagManager_svelte_get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (65:0) {:else}
function TagManager_svelte_create_else_block(ctx) {
	let p;

	return {
		c() {
			p = (0,internal/* element */.ND4)("p");
			p.textContent = "This provided source has no tags";
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, p, anchor);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(p);
			}
		}
	};
}

// (52:0) {#if sourceHasTags}
function TagManager_svelte_create_if_block(ctx) {
	let div0;
	let t0;
	let h3;
	let t2;
	let searcharray;
	let updating_results;
	let t3;
	let div1;
	let current;
	let each_value_1 = (0,internal/* ensure_array_like */.rv_)(/*source*/ ctx[0].tags);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = TagManager_svelte_create_each_block_1(TagManager_svelte_get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => (0,internal/* transition_out */.Tn8)(each_blocks_1[i], 1, 1, () => {
		each_blocks_1[i] = null;
	});

	function searcharray_results_binding(value) {
		/*searcharray_results_binding*/ ctx[8](value);
	}

	let searcharray_props = {
		name: "search-tags",
		source: /*availableTags*/ ctx[4]
	};

	if (/*searchResults*/ ctx[1] !== void 0) {
		searcharray_props.results = /*searchResults*/ ctx[1];
	}

	searcharray = new SearchArray_svelte({ props: searcharray_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(searcharray, 'results', searcharray_results_binding));
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*filteredTags*/ ctx[2]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = TagManager_svelte_create_each_block(TagManager_svelte_get_each_context(ctx, each_value, i));
	}

	const out_1 = i => (0,internal/* transition_out */.Tn8)(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div0 = (0,internal/* element */.ND4)("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = (0,internal/* space */.xem)();
			h3 = (0,internal/* element */.ND4)("h3");
			h3.textContent = "Add Tags";
			t2 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(searcharray.$$.fragment);
			t3 = (0,internal/* space */.xem)();
			div1 = (0,internal/* element */.ND4)("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(div0, "class", "removeTags");
			(0,internal/* attr */.CFu)(h3, "class", "svelte-164mia4");
			(0,internal/* attr */.CFu)(div1, "class", "addTags");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div0, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div0, null);
				}
			}

			(0,internal/* insert */.Yry)(target, t0, anchor);
			(0,internal/* insert */.Yry)(target, h3, anchor);
			(0,internal/* insert */.Yry)(target, t2, anchor);
			(0,internal/* mount_component */.wSR)(searcharray, target, anchor);
			(0,internal/* insert */.Yry)(target, t3, anchor);
			(0,internal/* insert */.Yry)(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*source, remove*/ 65) {
				each_value_1 = (0,internal/* ensure_array_like */.rv_)(/*source*/ ctx[0].tags);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = TagManager_svelte_get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
						(0,internal/* transition_in */.c7F)(each_blocks_1[i], 1);
					} else {
						each_blocks_1[i] = TagManager_svelte_create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						(0,internal/* transition_in */.c7F)(each_blocks_1[i], 1);
						each_blocks_1[i].m(div0, null);
					}
				}

				(0,internal/* group_outros */.V44)();

				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
					out(i);
				}

				(0,internal/* check_outros */.GYV)();
			}

			const searcharray_changes = {};

			if (!updating_results && dirty & /*searchResults*/ 2) {
				updating_results = true;
				searcharray_changes.results = /*searchResults*/ ctx[1];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_results = false);
			}

			searcharray.$set(searcharray_changes);

			if (dirty & /*filteredTags, add*/ 36) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*filteredTags*/ ctx[2]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = TagManager_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
					} else {
						each_blocks[i] = TagManager_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
						each_blocks[i].m(div1, null);
					}
				}

				(0,internal/* group_outros */.V44)();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out_1(i);
				}

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks_1[i]);
			}

			(0,internal/* transition_in */.c7F)(searcharray.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks_1 = each_blocks_1.filter(Boolean);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks_1[i]);
			}

			(0,internal/* transition_out */.Tn8)(searcharray.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div0);
				(0,internal/* detach */.YoD)(t0);
				(0,internal/* detach */.YoD)(h3);
				(0,internal/* detach */.YoD)(t2);
				(0,internal/* detach */.YoD)(t3);
				(0,internal/* detach */.YoD)(div1);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks_1, detaching);
			(0,internal/* destroy_component */.Hbl)(searcharray, detaching);
			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
		}
	};
}

// (54:8) {#each source.tags as tagName}
function TagManager_svelte_create_each_block_1(ctx) {
	let tagbutton;
	let current;

	function tagClicked_handler() {
		return /*tagClicked_handler*/ ctx[7](/*tagName*/ ctx[12]);
	}

	tagbutton = new TagButton_svelte({ props: { tagName: /*tagName*/ ctx[12] } });
	tagbutton.$on("tagClicked", tagClicked_handler);

	return {
		c() {
			(0,internal/* create_component */.N0i)(tagbutton.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(tagbutton, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const tagbutton_changes = {};
			if (dirty & /*source*/ 1) tagbutton_changes.tagName = /*tagName*/ ctx[12];
			tagbutton.$set(tagbutton_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(tagbutton.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(tagbutton.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(tagbutton, detaching);
		}
	};
}

// (61:8) {#each filteredTags as tagName}
function TagManager_svelte_create_each_block(ctx) {
	let tagbutton;
	let current;

	function tagClicked_handler_1() {
		return /*tagClicked_handler_1*/ ctx[9](/*tagName*/ ctx[12]);
	}

	tagbutton = new TagButton_svelte({ props: { tagName: /*tagName*/ ctx[12] } });
	tagbutton.$on("tagClicked", tagClicked_handler_1);

	return {
		c() {
			(0,internal/* create_component */.N0i)(tagbutton.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(tagbutton, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const tagbutton_changes = {};
			if (dirty & /*filteredTags*/ 4) tagbutton_changes.tagName = /*tagName*/ ctx[12];
			tagbutton.$set(tagbutton_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(tagbutton.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(tagbutton.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(tagbutton, detaching);
		}
	};
}

function TagManager_svelte_create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [TagManager_svelte_create_if_block, TagManager_svelte_create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*sourceHasTags*/ ctx[3]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,internal/* check_outros */.GYV)();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				(0,internal/* transition_in */.c7F)(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			if_blocks[current_block_type_index].d(detaching);
		}
	};
}

function TagManager_svelte_instance($$self, $$props, $$invalidate) {
	let sourceHasTags;
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(10, $settings = $$value));
	let availableTags = Object.keys($settings.tags);
	let searchResults = availableTags;
	let filteredTags = availableTags;
	let { source = {} } = $$props;

	function updateTags(sourceTags, resultTags) {
		$$invalidate(2, filteredTags = availableTags.filter(t => {
			// exclude if tag is in source
			if (sourceTags.indexOf(t) > -1) {
				return false;
			}

			// include if tag is in tag search results
			if (resultTags.indexOf(t) > -1) {
				return true;
			} else {
				return false;
			}
		}).sort());
	}

	function add(tagName) {
		if (source.tags.indexOf(tagName) < 0) {
			source.tags.push(tagName);
			$$invalidate(0, source);
		}
	}

	function remove(tagName) {
		let index = source.tags.indexOf(tagName);

		if (index > -1) {
			source.tags.splice(index, 1);
			$$invalidate(0, source);
		}
	}

	const tagClicked_handler = tagName => remove(tagName);

	function searcharray_results_binding(value) {
		searchResults = value;
		$$invalidate(1, searchResults);
	}

	const tagClicked_handler_1 = tagName => add(tagName);

	$$self.$$set = $$props => {
		if ('source' in $$props) $$invalidate(0, source = $$props.source);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*source*/ 1) {
			$: $$invalidate(3, sourceHasTags = Object.hasOwn(source, 'tags'));
		}

		if ($$self.$$.dirty & /*source, searchResults*/ 3) {
			$: {
				updateTags(source.tags, searchResults);
			}
		}
	};

	return [
		source,
		searchResults,
		filteredTags,
		sourceHasTags,
		availableTags,
		add,
		remove,
		tagClicked_handler,
		searcharray_results_binding,
		tagClicked_handler_1
	];
}

class TagManager extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, TagManager_svelte_instance, TagManager_svelte_create_fragment, internal/* safe_not_equal */.jXN, { source: 0 });
	}
}

/* harmony default export */ const TagManager_svelte = (TagManager);

;// ./src/Activity.svelte
/* src/Activity.svelte generated by Svelte v4.2.19 */





















function Activity_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[32] = list[i][0];
	child_ctx[33] = list[i][1];
	return child_ctx;
}

// (160:20) {#if doc.occurredAt && (doc.complete || doc.recur)}
function create_if_block_2(ctx) {
	let t;

	return {
		c() {
			t = (0,internal/* text */.Qq7)(/*agoStr*/ ctx[2]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*agoStr*/ 4) (0,internal/* set_data */.iQh)(t, /*agoStr*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t);
			}
		}
	};
}

// (165:20) 
function create_icon_slot_1(ctx) {
	let tagicon;
	let current;
	tagicon = new tagIcon_svelte({ props: { size: 20, slot: "icon" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(tagicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(tagicon, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(tagicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(tagicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(tagicon, detaching);
		}
	};
}

// (185:16) {#each Object.entries($settings.activityTypes) as [_, type]}
function Activity_svelte_create_each_block(ctx) {
	let option;
	let t_value = /*type*/ ctx[33].name + "";
	let t;
	let option_value_value;

	return {
		c() {
			option = (0,internal/* element */.ND4)("option");
			t = (0,internal/* text */.Qq7)(t_value);
			option.__value = option_value_value = /*type*/ ctx[33].type;
			(0,internal/* set_input_value */.Gvd)(option, option.__value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, option, anchor);
			(0,internal/* append */.BCw)(option, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*$settings*/ 32 && t_value !== (t_value = /*type*/ ctx[33].name + "")) (0,internal/* set_data */.iQh)(t, t_value);

			if (dirty[0] & /*$settings*/ 32 && option_value_value !== (option_value_value = /*type*/ ctx[33].type)) {
				option.__value = option_value_value;
				(0,internal/* set_input_value */.Gvd)(option, option.__value);
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(option);
			}
		}
	};
}

// (206:16) 
function create_icon_slot(ctx) {
	let logicon;
	let current;
	logicon = new notes_svelte({ props: { slot: "icon" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(logicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(logicon, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(logicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(logicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(logicon, detaching);
		}
	};
}

// (223:12) {#if doc.recur}
function Activity_svelte_create_if_block_1(ctx) {
	let div;
	let numberinput;
	let updating_val;
	let current;

	function numberinput_val_binding(value) {
		/*numberinput_val_binding*/ ctx[24](value);
	}

	let numberinput_props = {
		label: "Ocurrences",
		name: "activity-ocurrences"
	};

	if (/*doc*/ ctx[0].occurrences !== void 0) {
		numberinput_props.val = /*doc*/ ctx[0].occurrences;
	}

	numberinput = new Number_svelte({ props: numberinput_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(numberinput, 'val', numberinput_val_binding));

	return {
		c() {
			div = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(numberinput.$$.fragment);
			(0,internal/* attr */.CFu)(div, "class", "input-group");
			(0,internal/* attr */.CFu)(div, "data-group", "occurrence");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);
			(0,internal/* mount_component */.wSR)(numberinput, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const numberinput_changes = {};

			if (!updating_val && dirty[0] & /*doc*/ 1) {
				updating_val = true;
				numberinput_changes.val = /*doc*/ ctx[0].occurrences;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_val = false);
			}

			numberinput.$set(numberinput_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(numberinput.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(numberinput.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_component */.Hbl)(numberinput);
		}
	};
}

// (228:12) {#if doc.occurredAt !== null}
function Activity_svelte_create_if_block(ctx) {
	let div;
	let occurredat;
	let updating_agoStr;
	let updating_occurredAt;
	let current;

	function occurredat_agoStr_binding(value) {
		/*occurredat_agoStr_binding*/ ctx[25](value);
	}

	function occurredat_occurredAt_binding(value) {
		/*occurredat_occurredAt_binding*/ ctx[26](value);
	}

	let occurredat_props = { name: "activity-occurred-at" };

	if (/*agoStr*/ ctx[2] !== void 0) {
		occurredat_props.agoStr = /*agoStr*/ ctx[2];
	}

	if (/*doc*/ ctx[0].occurredAt !== void 0) {
		occurredat_props.occurredAt = /*doc*/ ctx[0].occurredAt;
	}

	occurredat = new OccurredAt_svelte({ props: occurredat_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(occurredat, 'agoStr', occurredat_agoStr_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(occurredat, 'occurredAt', occurredat_occurredAt_binding));

	return {
		c() {
			div = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(occurredat.$$.fragment);
			(0,internal/* attr */.CFu)(div, "class", "input-group");
			(0,internal/* attr */.CFu)(div, "data-group", "occurrence");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);
			(0,internal/* mount_component */.wSR)(occurredat, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const occurredat_changes = {};

			if (!updating_agoStr && dirty[0] & /*agoStr*/ 4) {
				updating_agoStr = true;
				occurredat_changes.agoStr = /*agoStr*/ ctx[2];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_agoStr = false);
			}

			if (!updating_occurredAt && dirty[0] & /*doc*/ 1) {
				updating_occurredAt = true;
				occurredat_changes.occurredAt = /*doc*/ ctx[0].occurredAt;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_occurredAt = false);
			}

			occurredat.$set(occurredat_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(occurredat.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(occurredat.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_component */.Hbl)(occurredat);
		}
	};
}

function Activity_svelte_create_fragment(ctx) {
	let article;
	let header;
	let div0;
	let button0;
	let targeticon;
	let t0;
	let div1;
	let button1;
	let strong;
	let t1_value = /*doc*/ ctx[0].name + "";
	let t1;
	let button1_class_value;
	let t2;
	let button2;
	let saveicon0;
	let t3;
	let div3;
	let div2;
	let p0;
	let t4;
	let modalbtn0;
	let updating_source;
	let t5;
	let p1;
	let t6;
	let t7;
	let button3;
	let saveicon1;
	let t8;
	let button4;
	let binicon;
	let t9;
	let section;
	let div4;
	let label0;
	let t11;
	let input;
	let t12;
	let div5;
	let label1;
	let t14;
	let select;
	let t15;
	let div6;
	let t16;
	let div7;
	let button5;
	let tagicon;
	let t17;
	let button6;
	let timeicon;
	let t18;
	let modalbtn1;
	let updating_source_1;
	let t19;
	let div8;
	let h30;
	let t21;
	let tagmanager;
	let updating_source_2;
	let t22;
	let div10;
	let h31;
	let t24;
	let div9;
	let duration;
	let updating_durationType;
	let updating_durationIncrement;
	let updating_value;
	let t25;
	let t26;
	let t27;
	let recurrence;
	let updating_doc;
	let t28;
	let div11;
	let article_transition;
	let current;
	let mounted;
	let dispose;
	targeticon = new target_svelte({});
	saveicon0 = new save_svelte({});
	let if_block0 = /*doc*/ ctx[0].occurredAt && (/*doc*/ ctx[0].complete || /*doc*/ ctx[0].recur) && create_if_block_2(ctx);

	function modalbtn0_source_binding(value) {
		/*modalbtn0_source_binding*/ ctx[13](value);
	}

	let modalbtn0_props = {
		classes: 'small',
		modalName: 'tageditor',
		$$slots: { icon: [create_icon_slot_1] },
		$$scope: { ctx }
	};

	if (/*doc*/ ctx[0] !== void 0) {
		modalbtn0_props.source = /*doc*/ ctx[0];
	}

	modalbtn0 = new ModalBtn_svelte({ props: modalbtn0_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(modalbtn0, 'source', modalbtn0_source_binding));
	modalbtn0.$on("save", /*debouncedSave*/ ctx[7]);
	saveicon1 = new save_svelte({});
	binicon = new bin_svelte({});
	let each_value = (0,internal/* ensure_array_like */.rv_)(Object.entries(/*$settings*/ ctx[5].activityTypes));
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = Activity_svelte_create_each_block(Activity_svelte_get_each_context(ctx, each_value, i));
	}

	tagicon = new tagIcon_svelte({});
	timeicon = new timeForward_svelte({});

	function modalbtn1_source_binding(value) {
		/*modalbtn1_source_binding*/ ctx[18](value);
	}

	let modalbtn1_props = {
		classes: 'medium m-5',
		modalName: 'logmanager',
		$$slots: { icon: [create_icon_slot] },
		$$scope: { ctx }
	};

	if (/*doc*/ ctx[0] !== void 0) {
		modalbtn1_props.source = /*doc*/ ctx[0];
	}

	modalbtn1 = new ModalBtn_svelte({ props: modalbtn1_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(modalbtn1, 'source', modalbtn1_source_binding));
	modalbtn1.$on("save", /*debouncedSave*/ ctx[7]);
	modalbtn1.$on("click", /*click_handler_3*/ ctx[19]);

	function tagmanager_source_binding(value) {
		/*tagmanager_source_binding*/ ctx[20](value);
	}

	let tagmanager_props = {};

	if (/*doc*/ ctx[0] !== void 0) {
		tagmanager_props.source = /*doc*/ ctx[0];
	}

	tagmanager = new TagManager_svelte({ props: tagmanager_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagmanager, 'source', tagmanager_source_binding));

	function duration_durationType_binding(value) {
		/*duration_durationType_binding*/ ctx[21](value);
	}

	function duration_durationIncrement_binding(value) {
		/*duration_durationIncrement_binding*/ ctx[22](value);
	}

	function duration_value_binding(value) {
		/*duration_value_binding*/ ctx[23](value);
	}

	let duration_props = {
		label: "duration",
		name: "activity-duration"
	};

	if (/*doc*/ ctx[0].durationType !== void 0) {
		duration_props.durationType = /*doc*/ ctx[0].durationType;
	}

	if (/*doc*/ ctx[0].durationIncrement !== void 0) {
		duration_props.durationIncrement = /*doc*/ ctx[0].durationIncrement;
	}

	if (/*durationStr*/ ctx[3] !== void 0) {
		duration_props.value = /*durationStr*/ ctx[3];
	}

	duration = new Duration_svelte({ props: duration_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(duration, 'durationType', duration_durationType_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(duration, 'durationIncrement', duration_durationIncrement_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(duration, 'value', duration_value_binding));
	let if_block1 = /*doc*/ ctx[0].recur && Activity_svelte_create_if_block_1(ctx);
	let if_block2 = /*doc*/ ctx[0].occurredAt !== null && Activity_svelte_create_if_block(ctx);

	function recurrence_doc_binding(value) {
		/*recurrence_doc_binding*/ ctx[27](value);
	}

	let recurrence_props = {};

	if (/*doc*/ ctx[0] !== void 0) {
		recurrence_props.doc = /*doc*/ ctx[0];
	}

	recurrence = new Recurrence_svelte({ props: recurrence_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(recurrence, 'doc', recurrence_doc_binding));

	return {
		c() {
			article = (0,internal/* element */.ND4)("article");
			header = (0,internal/* element */.ND4)("header");
			div0 = (0,internal/* element */.ND4)("div");
			button0 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(targeticon.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			div1 = (0,internal/* element */.ND4)("div");
			button1 = (0,internal/* element */.ND4)("button");
			strong = (0,internal/* element */.ND4)("strong");
			t1 = (0,internal/* text */.Qq7)(t1_value);
			t2 = (0,internal/* space */.xem)();
			button2 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(saveicon0.$$.fragment);
			t3 = (0,internal/* space */.xem)();
			div3 = (0,internal/* element */.ND4)("div");
			div2 = (0,internal/* element */.ND4)("div");
			p0 = (0,internal/* element */.ND4)("p");
			if (if_block0) if_block0.c();
			t4 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(modalbtn0.$$.fragment);
			t5 = (0,internal/* space */.xem)();
			p1 = (0,internal/* element */.ND4)("p");
			t6 = (0,internal/* text */.Qq7)(/*durationStr*/ ctx[3]);
			t7 = (0,internal/* space */.xem)();
			button3 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(saveicon1.$$.fragment);
			t8 = (0,internal/* space */.xem)();
			button4 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(binicon.$$.fragment);
			t9 = (0,internal/* space */.xem)();
			section = (0,internal/* element */.ND4)("section");
			div4 = (0,internal/* element */.ND4)("div");
			label0 = (0,internal/* element */.ND4)("label");
			label0.textContent = "Name :";
			t11 = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			t12 = (0,internal/* space */.xem)();
			div5 = (0,internal/* element */.ND4)("div");
			label1 = (0,internal/* element */.ND4)("label");
			label1.textContent = "Type :";
			t14 = (0,internal/* space */.xem)();
			select = (0,internal/* element */.ND4)("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t15 = (0,internal/* space */.xem)();
			div6 = (0,internal/* element */.ND4)("div");
			div6.innerHTML = ``;
			t16 = (0,internal/* space */.xem)();
			div7 = (0,internal/* element */.ND4)("div");
			button5 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(tagicon.$$.fragment);
			t17 = (0,internal/* space */.xem)();
			button6 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(timeicon.$$.fragment);
			t18 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(modalbtn1.$$.fragment);
			t19 = (0,internal/* space */.xem)();
			div8 = (0,internal/* element */.ND4)("div");
			h30 = (0,internal/* element */.ND4)("h3");
			h30.textContent = "Tags";
			t21 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(tagmanager.$$.fragment);
			t22 = (0,internal/* space */.xem)();
			div10 = (0,internal/* element */.ND4)("div");
			h31 = (0,internal/* element */.ND4)("h3");
			h31.textContent = "Time";
			t24 = (0,internal/* space */.xem)();
			div9 = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(duration.$$.fragment);
			t25 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			t26 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			t27 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(recurrence.$$.fragment);
			t28 = (0,internal/* space */.xem)();
			div11 = (0,internal/* element */.ND4)("div");
			div11.innerHTML = `<h3>Logs</h3>`;
			(0,internal/* attr */.CFu)(button0, "class", "icon list-btn svelte-6vd9kd");
			(0,internal/* attr */.CFu)(div0, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(strong, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(button1, "class", button1_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*doc*/ ctx[0].complete ? 'is-complete title' : 'title') + " svelte-6vd9kd"));
			(0,internal/* attr */.CFu)(button2, "class", "icon add-btn svelte-6vd9kd");
			(0,internal/* attr */.CFu)(div1, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(p0, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(p1, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(div2, "class", "since svelte-6vd9kd");
			(0,internal/* attr */.CFu)(button3, "class", "icon edit-btn svelte-6vd9kd");
			(0,internal/* attr */.CFu)(button4, "class", "icon edit-btn svelte-6vd9kd");
			(0,internal/* attr */.CFu)(div3, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(header, "class", "svelte-6vd9kd");
			(0,internal/* attr */.CFu)(label0, "for", "activity-name");
			(0,internal/* attr */.CFu)(input, "name", "activity-name");
			(0,internal/* attr */.CFu)(input, "type", "text");
			(0,internal/* attr */.CFu)(div4, "class", "input-group");
			(0,internal/* attr */.CFu)(div4, "data-group", "name");
			(0,internal/* attr */.CFu)(label1, "for", "activity-type");
			(0,internal/* attr */.CFu)(select, "name", "activity-type");
			if (/*doc*/ ctx[0].type === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select_change_handler*/ ctx[15].call(select));
			(0,internal/* attr */.CFu)(div5, "class", "input-group");
			(0,internal/* attr */.CFu)(div5, "data-group", "activity-type");
			(0,internal/* attr */.CFu)(button5, "class", "medium icon svelte-6vd9kd");
			(0,internal/* attr */.CFu)(button6, "class", "medium icon svelte-6vd9kd");
			(0,internal/* attr */.CFu)(div7, "class", "tab-buttons svelte-6vd9kd");
			(0,internal/* attr */.CFu)(div8, "class", "tab-group");
			(0,internal/* attr */.CFu)(div8, "data-group", "tags");
			(0,internal/* attr */.CFu)(div9, "class", "input-group");
			(0,internal/* attr */.CFu)(div9, "data-group", "duration");
			(0,internal/* attr */.CFu)(div10, "class", "tab-group");
			(0,internal/* attr */.CFu)(div10, "data-group", "time");
			(0,internal/* attr */.CFu)(div11, "class", "tab-group");
			(0,internal/* attr */.CFu)(div11, "data-group", "logs");
			(0,internal/* attr */.CFu)(section, "class", "edit");
			(0,internal/* attr */.CFu)(section, "data-tab", /*tab*/ ctx[4]);
			(0,internal/* attr */.CFu)(article, "data-viewmode", /*viewmode*/ ctx[1]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, article, anchor);
			(0,internal/* append */.BCw)(article, header);
			(0,internal/* append */.BCw)(header, div0);
			(0,internal/* append */.BCw)(div0, button0);
			(0,internal/* mount_component */.wSR)(targeticon, button0, null);
			(0,internal/* append */.BCw)(header, t0);
			(0,internal/* append */.BCw)(header, div1);
			(0,internal/* append */.BCw)(div1, button1);
			(0,internal/* append */.BCw)(button1, strong);
			(0,internal/* append */.BCw)(strong, t1);
			(0,internal/* append */.BCw)(div1, t2);
			(0,internal/* append */.BCw)(div1, button2);
			(0,internal/* mount_component */.wSR)(saveicon0, button2, null);
			(0,internal/* append */.BCw)(header, t3);
			(0,internal/* append */.BCw)(header, div3);
			(0,internal/* append */.BCw)(div3, div2);
			(0,internal/* append */.BCw)(div2, p0);
			if (if_block0) if_block0.m(p0, null);
			(0,internal/* append */.BCw)(div2, t4);
			(0,internal/* mount_component */.wSR)(modalbtn0, div2, null);
			(0,internal/* append */.BCw)(div2, t5);
			(0,internal/* append */.BCw)(div2, p1);
			(0,internal/* append */.BCw)(p1, t6);
			(0,internal/* append */.BCw)(div3, t7);
			(0,internal/* append */.BCw)(div3, button3);
			(0,internal/* mount_component */.wSR)(saveicon1, button3, null);
			(0,internal/* append */.BCw)(div3, t8);
			(0,internal/* append */.BCw)(div3, button4);
			(0,internal/* mount_component */.wSR)(binicon, button4, null);
			(0,internal/* append */.BCw)(article, t9);
			(0,internal/* append */.BCw)(article, section);
			(0,internal/* append */.BCw)(section, div4);
			(0,internal/* append */.BCw)(div4, label0);
			(0,internal/* append */.BCw)(div4, t11);
			(0,internal/* append */.BCw)(div4, input);
			(0,internal/* set_input_value */.Gvd)(input, /*doc*/ ctx[0].name);
			(0,internal/* append */.BCw)(section, t12);
			(0,internal/* append */.BCw)(section, div5);
			(0,internal/* append */.BCw)(div5, label1);
			(0,internal/* append */.BCw)(div5, t14);
			(0,internal/* append */.BCw)(div5, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			(0,internal/* select_option */.fs8)(select, /*doc*/ ctx[0].type, true);
			(0,internal/* append */.BCw)(section, t15);
			(0,internal/* append */.BCw)(section, div6);
			(0,internal/* append */.BCw)(section, t16);
			(0,internal/* append */.BCw)(section, div7);
			(0,internal/* append */.BCw)(div7, button5);
			(0,internal/* mount_component */.wSR)(tagicon, button5, null);
			(0,internal/* append */.BCw)(div7, t17);
			(0,internal/* append */.BCw)(div7, button6);
			(0,internal/* mount_component */.wSR)(timeicon, button6, null);
			(0,internal/* append */.BCw)(div7, t18);
			(0,internal/* mount_component */.wSR)(modalbtn1, div7, null);
			(0,internal/* append */.BCw)(section, t19);
			(0,internal/* append */.BCw)(section, div8);
			(0,internal/* append */.BCw)(div8, h30);
			(0,internal/* append */.BCw)(div8, t21);
			(0,internal/* mount_component */.wSR)(tagmanager, div8, null);
			(0,internal/* append */.BCw)(section, t22);
			(0,internal/* append */.BCw)(section, div10);
			(0,internal/* append */.BCw)(div10, h31);
			(0,internal/* append */.BCw)(div10, t24);
			(0,internal/* append */.BCw)(div10, div9);
			(0,internal/* mount_component */.wSR)(duration, div9, null);
			(0,internal/* append */.BCw)(div10, t25);
			if (if_block1) if_block1.m(div10, null);
			(0,internal/* append */.BCw)(div10, t26);
			if (if_block2) if_block2.m(div10, null);
			(0,internal/* append */.BCw)(div10, t27);
			(0,internal/* mount_component */.wSR)(recurrence, div10, null);
			(0,internal/* append */.BCw)(section, t28);
			(0,internal/* append */.BCw)(section, div11);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(button0, "click", /*debounceOccur*/ ctx[9]),
					(0,internal/* listen */.KTR)(button1, "click", /*click_handler*/ ctx[12]),
					(0,internal/* listen */.KTR)(button2, "click", /*debouncedAdd*/ ctx[8]),
					(0,internal/* listen */.KTR)(button3, "click", /*debouncedSave*/ ctx[7]),
					(0,internal/* listen */.KTR)(button4, "click", /*remove*/ ctx[6]),
					(0,internal/* listen */.KTR)(input, "input", /*input_input_handler*/ ctx[14]),
					(0,internal/* listen */.KTR)(select, "change", /*select_change_handler*/ ctx[15]),
					(0,internal/* listen */.KTR)(button5, "click", /*click_handler_1*/ ctx[16]),
					(0,internal/* listen */.KTR)(button6, "click", /*click_handler_2*/ ctx[17])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if ((!current || dirty[0] & /*doc*/ 1) && t1_value !== (t1_value = /*doc*/ ctx[0].name + "")) (0,internal/* set_data */.iQh)(t1, t1_value);

			if (!current || dirty[0] & /*doc, $settings*/ 33 && button1_class_value !== (button1_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*doc*/ ctx[0].complete ? 'is-complete title' : 'title') + " svelte-6vd9kd"))) {
				(0,internal/* attr */.CFu)(button1, "class", button1_class_value);
			}

			if (/*doc*/ ctx[0].occurredAt && (/*doc*/ ctx[0].complete || /*doc*/ ctx[0].recur)) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					if_block0.m(p0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			const modalbtn0_changes = {};

			if (dirty[1] & /*$$scope*/ 32) {
				modalbtn0_changes.$$scope = { dirty, ctx };
			}

			if (!updating_source && dirty[0] & /*doc*/ 1) {
				updating_source = true;
				modalbtn0_changes.source = /*doc*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source = false);
			}

			modalbtn0.$set(modalbtn0_changes);
			if (!current || dirty[0] & /*durationStr*/ 8) (0,internal/* set_data */.iQh)(t6, /*durationStr*/ ctx[3]);

			if (dirty[0] & /*doc, $settings*/ 33 && input.value !== /*doc*/ ctx[0].name) {
				(0,internal/* set_input_value */.Gvd)(input, /*doc*/ ctx[0].name);
			}

			if (dirty[0] & /*$settings*/ 32) {
				each_value = (0,internal/* ensure_array_like */.rv_)(Object.entries(/*$settings*/ ctx[5].activityTypes));
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = Activity_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = Activity_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty[0] & /*doc, $settings*/ 33) {
				(0,internal/* select_option */.fs8)(select, /*doc*/ ctx[0].type);
			}

			const modalbtn1_changes = {};

			if (dirty[1] & /*$$scope*/ 32) {
				modalbtn1_changes.$$scope = { dirty, ctx };
			}

			if (!updating_source_1 && dirty[0] & /*doc*/ 1) {
				updating_source_1 = true;
				modalbtn1_changes.source = /*doc*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source_1 = false);
			}

			modalbtn1.$set(modalbtn1_changes);
			const tagmanager_changes = {};

			if (!updating_source_2 && dirty[0] & /*doc*/ 1) {
				updating_source_2 = true;
				tagmanager_changes.source = /*doc*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source_2 = false);
			}

			tagmanager.$set(tagmanager_changes);
			const duration_changes = {};

			if (!updating_durationType && dirty[0] & /*doc*/ 1) {
				updating_durationType = true;
				duration_changes.durationType = /*doc*/ ctx[0].durationType;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_durationType = false);
			}

			if (!updating_durationIncrement && dirty[0] & /*doc*/ 1) {
				updating_durationIncrement = true;
				duration_changes.durationIncrement = /*doc*/ ctx[0].durationIncrement;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_durationIncrement = false);
			}

			if (!updating_value && dirty[0] & /*durationStr*/ 8) {
				updating_value = true;
				duration_changes.value = /*durationStr*/ ctx[3];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_value = false);
			}

			duration.$set(duration_changes);

			if (/*doc*/ ctx[0].recur) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty[0] & /*doc*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block1, 1);
					}
				} else {
					if_block1 = Activity_svelte_create_if_block_1(ctx);
					if_block1.c();
					(0,internal/* transition_in */.c7F)(if_block1, 1);
					if_block1.m(div10, t26);
				}
			} else if (if_block1) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}

			if (/*doc*/ ctx[0].occurredAt !== null) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty[0] & /*doc*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block2, 1);
					}
				} else {
					if_block2 = Activity_svelte_create_if_block(ctx);
					if_block2.c();
					(0,internal/* transition_in */.c7F)(if_block2, 1);
					if_block2.m(div10, t27);
				}
			} else if (if_block2) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}

			const recurrence_changes = {};

			if (!updating_doc && dirty[0] & /*doc*/ 1) {
				updating_doc = true;
				recurrence_changes.doc = /*doc*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_doc = false);
			}

			recurrence.$set(recurrence_changes);

			if (!current || dirty[0] & /*tab*/ 16) {
				(0,internal/* attr */.CFu)(section, "data-tab", /*tab*/ ctx[4]);
			}

			if (!current || dirty[0] & /*viewmode*/ 2) {
				(0,internal/* attr */.CFu)(article, "data-viewmode", /*viewmode*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(targeticon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(saveicon0.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(modalbtn0.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(saveicon1.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(binicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(tagicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(timeicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(modalbtn1.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(tagmanager.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(duration.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(if_block1);
			(0,internal/* transition_in */.c7F)(if_block2);
			(0,internal/* transition_in */.c7F)(recurrence.$$.fragment, local);

			if (local) {
				(0,internal/* add_render_callback */.Dti)(() => {
					if (!current) return;
					if (!article_transition) article_transition = (0,internal/* create_bidirectional_transition */.h86)(article, transition/* fade */.Rv, {}, true);
					article_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(targeticon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(saveicon0.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(modalbtn0.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(saveicon1.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(binicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(tagicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(timeicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(modalbtn1.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(tagmanager.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(duration.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(if_block1);
			(0,internal/* transition_out */.Tn8)(if_block2);
			(0,internal/* transition_out */.Tn8)(recurrence.$$.fragment, local);

			if (local) {
				if (!article_transition) article_transition = (0,internal/* create_bidirectional_transition */.h86)(article, transition/* fade */.Rv, {}, false);
				article_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(article);
			}

			(0,internal/* destroy_component */.Hbl)(targeticon);
			(0,internal/* destroy_component */.Hbl)(saveicon0);
			if (if_block0) if_block0.d();
			(0,internal/* destroy_component */.Hbl)(modalbtn0);
			(0,internal/* destroy_component */.Hbl)(saveicon1);
			(0,internal/* destroy_component */.Hbl)(binicon);
			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
			(0,internal/* destroy_component */.Hbl)(tagicon);
			(0,internal/* destroy_component */.Hbl)(timeicon);
			(0,internal/* destroy_component */.Hbl)(modalbtn1);
			(0,internal/* destroy_component */.Hbl)(tagmanager);
			(0,internal/* destroy_component */.Hbl)(duration);
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			(0,internal/* destroy_component */.Hbl)(recurrence);
			if (detaching && article_transition) article_transition.end();
			mounted = false;
			(0,internal/* run_all */.oOW)(dispose);
		}
	};
}

function Activity_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(5, $settings = $$value));
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();

	function add() {
		addToast({
			message: 'Created Activity "' + doc.name + '"',
			timeout: 3000
		});

		dispatch('add', { doc });
	}

	function remove() {
		addToast({
			message: 'Deleted "' + doc.name + '" ',
			timeout: 3000
		});

		dispatch('remove', { doc });
	}

	function save() {
		// reset complete flag for recurring activity
		if (doc.recur) {
			$$invalidate(0, doc.complete = false, doc);
		}

		addToast({
			message: 'Saved "' + doc.name + '" ',
			timeout: 3000
		});

		dispatch('update', { doc });
	}

	// only fire once, debouncing multiple clicks, reducing revisions
	const debouncedSave = (0,lodash.debounce)(save, 1000);

	const debouncedAdd = (0,lodash.debounce)(add, 1000);
	const debounceOccur = (0,lodash.debounce)(occurred, 500);

	function toggleMode(mode) {
		$$invalidate(1, viewmode = viewmode === mode ? 'list' : mode);
	}

	function toggleTab(t) {
		if (t === tab) {
			$$invalidate(4, tab = 'hidden');
		} else {
			$$invalidate(4, tab = t);
		}
	}

	function occurred() {
		let msg = 'Occurred';

		if (!doc.recur) {
			$$invalidate(0, doc.complete = !doc.complete, doc);
			msg = doc.complete ? 'Completed' : 'Uncompleted';
		} else {
			$$invalidate(0, doc.complete = false, doc);
			$$invalidate(0, doc.occurrences++, doc);
		}

		$$invalidate(0, doc.occurredAt = getDateTimeStr(), doc);

		addToast({
			message: '"' + doc.name + '" ' + msg,
			timeout: 3000
		});

		dispatch('update', { doc });
	}

	let agoStr;
	let durationStr;
	let { doc } = $$props;
	let { viewmode = 'list' } = $$props;
	let tab = 'hidden';
	const click_handler = () => toggleMode('edit');

	function modalbtn0_source_binding(value) {
		doc = value;
		$$invalidate(0, doc);
	}

	function input_input_handler() {
		doc.name = this.value;
		$$invalidate(0, doc);
	}

	function select_change_handler() {
		doc.type = (0,internal/* select_value */.Hw5)(this);
		$$invalidate(0, doc);
	}

	const click_handler_1 = () => toggleTab('tags');
	const click_handler_2 = () => toggleTab('time');

	function modalbtn1_source_binding(value) {
		doc = value;
		$$invalidate(0, doc);
	}

	const click_handler_3 = () => toggleTab('logs');

	function tagmanager_source_binding(value) {
		doc = value;
		$$invalidate(0, doc);
	}

	function duration_durationType_binding(value) {
		if ($$self.$$.not_equal(doc.durationType, value)) {
			doc.durationType = value;
			$$invalidate(0, doc);
		}
	}

	function duration_durationIncrement_binding(value) {
		if ($$self.$$.not_equal(doc.durationIncrement, value)) {
			doc.durationIncrement = value;
			$$invalidate(0, doc);
		}
	}

	function duration_value_binding(value) {
		durationStr = value;
		$$invalidate(3, durationStr);
	}

	function numberinput_val_binding(value) {
		if ($$self.$$.not_equal(doc.occurrences, value)) {
			doc.occurrences = value;
			$$invalidate(0, doc);
		}
	}

	function occurredat_agoStr_binding(value) {
		agoStr = value;
		$$invalidate(2, agoStr);
	}

	function occurredat_occurredAt_binding(value) {
		if ($$self.$$.not_equal(doc.occurredAt, value)) {
			doc.occurredAt = value;
			$$invalidate(0, doc);
		}
	}

	function recurrence_doc_binding(value) {
		doc = value;
		$$invalidate(0, doc);
	}

	$$self.$$set = $$props => {
		if ('doc' in $$props) $$invalidate(0, doc = $$props.doc);
		if ('viewmode' in $$props) $$invalidate(1, viewmode = $$props.viewmode);
	};

	return [
		doc,
		viewmode,
		agoStr,
		durationStr,
		tab,
		$settings,
		remove,
		debouncedSave,
		debouncedAdd,
		debounceOccur,
		toggleMode,
		toggleTab,
		click_handler,
		modalbtn0_source_binding,
		input_input_handler,
		select_change_handler,
		click_handler_1,
		click_handler_2,
		modalbtn1_source_binding,
		click_handler_3,
		tagmanager_source_binding,
		duration_durationType_binding,
		duration_durationIncrement_binding,
		duration_value_binding,
		numberinput_val_binding,
		occurredat_agoStr_binding,
		occurredat_occurredAt_binding,
		recurrence_doc_binding
	];
}

class Activity extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Activity_svelte_instance, Activity_svelte_create_fragment, internal/* safe_not_equal */.jXN, { doc: 0, viewmode: 1 }, null, [-1, -1]);
	}
}

/* harmony default export */ const Activity_svelte = (Activity);

;// ./src/DocBrowser.svelte
/* src/DocBrowser.svelte generated by Svelte v4.2.19 */













function DocBrowser_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[24] = list[i];
	return child_ctx;
}

// (121:0) {:else}
function DocBrowser_svelte_create_else_block(ctx) {
	let h1;
	let t0_value = /*sortedAndFilteredItems*/ ctx[10].length + "";
	let t0;
	let t1;
	let t2_value = /*items*/ ctx[0].length + "";
	let t2;
	let t3;

	return {
		c() {
			h1 = (0,internal/* element */.ND4)("h1");
			t0 = (0,internal/* text */.Qq7)(t0_value);
			t1 = (0,internal/* text */.Qq7)(" Activities (");
			t2 = (0,internal/* text */.Qq7)(t2_value);
			t3 = (0,internal/* text */.Qq7)(")");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h1, anchor);
			(0,internal/* append */.BCw)(h1, t0);
			(0,internal/* append */.BCw)(h1, t1);
			(0,internal/* append */.BCw)(h1, t2);
			(0,internal/* append */.BCw)(h1, t3);
		},
		p(ctx, dirty) {
			if (dirty & /*sortedAndFilteredItems*/ 1024 && t0_value !== (t0_value = /*sortedAndFilteredItems*/ ctx[10].length + "")) (0,internal/* set_data */.iQh)(t0, t0_value);
			if (dirty & /*items*/ 1 && t2_value !== (t2_value = /*items*/ ctx[0].length + "")) (0,internal/* set_data */.iQh)(t2, t2_value);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h1);
			}
		}
	};
}

// (117:0) {#if isLoading}
function DocBrowser_svelte_create_if_block_1(ctx) {
	let h1;

	return {
		c() {
			h1 = (0,internal/* element */.ND4)("h1");
			h1.textContent = "Loading…";
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h1, anchor);
		},
		p: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h1);
			}
		}
	};
}

// (139:0) {#if items.length > 0}
function DocBrowser_svelte_create_if_block(ctx) {
	let section0;
	let div0;
	let label0;
	let t1;
	let select0;
	let option0;
	let option1;
	let option2;
	let t5;
	let div1;
	let label1;
	let t7;
	let select1;
	let option3;
	let option4;
	let option5;
	let t11;
	let section1;
	let ul;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let mounted;
	let dispose;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*sortedAndFilteredItems*/ ctx[10]);
	const get_key = ctx => /*todo*/ ctx[24]._id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = DocBrowser_svelte_get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = DocBrowser_svelte_create_each_block(key, child_ctx));
	}

	return {
		c() {
			section0 = (0,internal/* element */.ND4)("section");
			div0 = (0,internal/* element */.ND4)("div");
			label0 = (0,internal/* element */.ND4)("label");
			label0.textContent = "Sort by :";
			t1 = (0,internal/* space */.xem)();
			select0 = (0,internal/* element */.ND4)("select");
			option0 = (0,internal/* element */.ND4)("option");
			option0.textContent = "Time";
			option1 = (0,internal/* element */.ND4)("option");
			option1.textContent = "Name";
			option2 = (0,internal/* element */.ND4)("option");
			option2.textContent = "Completion";
			t5 = (0,internal/* space */.xem)();
			div1 = (0,internal/* element */.ND4)("div");
			label1 = (0,internal/* element */.ND4)("label");
			label1.textContent = "Show :";
			t7 = (0,internal/* space */.xem)();
			select1 = (0,internal/* element */.ND4)("select");
			option3 = (0,internal/* element */.ND4)("option");
			option3.textContent = "all";
			option4 = (0,internal/* element */.ND4)("option");
			option4.textContent = "completed";
			option5 = (0,internal/* element */.ND4)("option");
			option5.textContent = "open";
			t11 = (0,internal/* space */.xem)();
			section1 = (0,internal/* element */.ND4)("section");
			ul = (0,internal/* element */.ND4)("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(label0, "for", "sort-item");
			option0.__value = "createdAt";
			(0,internal/* set_input_value */.Gvd)(option0, option0.__value);
			option1.__value = "text";
			(0,internal/* set_input_value */.Gvd)(option1, option1.__value);
			option2.__value = "complete";
			(0,internal/* set_input_value */.Gvd)(option2, option2.__value);
			(0,internal/* attr */.CFu)(select0, "name", "sort-item");
			if (/*sortByWhat*/ ctx[1] === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select0_change_handler*/ ctx[19].call(select0));
			(0,internal/* attr */.CFu)(label1, "for", "filter-item");
			option3.__value = "";
			(0,internal/* set_input_value */.Gvd)(option3, option3.__value);
			option4.__value = "complete";
			(0,internal/* set_input_value */.Gvd)(option4, option4.__value);
			option5.__value = "open";
			(0,internal/* set_input_value */.Gvd)(option5, option5.__value);
			(0,internal/* attr */.CFu)(select1, "name", "filter-item");
			if (/*completedFilter*/ ctx[2] === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select1_change_handler*/ ctx[20].call(select1));
			(0,internal/* attr */.CFu)(ul, "class", "svelte-12dzelb");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section0, anchor);
			(0,internal/* append */.BCw)(section0, div0);
			(0,internal/* append */.BCw)(div0, label0);
			(0,internal/* append */.BCw)(div0, t1);
			(0,internal/* append */.BCw)(div0, select0);
			(0,internal/* append */.BCw)(select0, option0);
			(0,internal/* append */.BCw)(select0, option1);
			(0,internal/* append */.BCw)(select0, option2);
			(0,internal/* select_option */.fs8)(select0, /*sortByWhat*/ ctx[1], true);
			(0,internal/* append */.BCw)(section0, t5);
			(0,internal/* append */.BCw)(section0, div1);
			(0,internal/* append */.BCw)(div1, label1);
			(0,internal/* append */.BCw)(div1, t7);
			(0,internal/* append */.BCw)(div1, select1);
			(0,internal/* append */.BCw)(select1, option3);
			(0,internal/* append */.BCw)(select1, option4);
			(0,internal/* append */.BCw)(select1, option5);
			(0,internal/* select_option */.fs8)(select1, /*completedFilter*/ ctx[2], true);
			(0,internal/* insert */.Yry)(target, t11, anchor);
			(0,internal/* insert */.Yry)(target, section1, anchor);
			(0,internal/* append */.BCw)(section1, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(ul, null);
				}
			}

			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(select0, "change", /*select0_change_handler*/ ctx[19]),
					(0,internal/* listen */.KTR)(select1, "change", /*select1_change_handler*/ ctx[20])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*sortByWhat*/ 2) {
				(0,internal/* select_option */.fs8)(select0, /*sortByWhat*/ ctx[1]);
			}

			if (dirty & /*completedFilter*/ 4) {
				(0,internal/* select_option */.fs8)(select1, /*completedFilter*/ ctx[2]);
			}

			if (dirty & /*sortedAndFilteredItems, removeDoc, updateDoc*/ 13312) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*sortedAndFilteredItems*/ ctx[10]);
				(0,internal/* group_outros */.V44)();
				each_blocks = (0,internal/* update_keyed_each */.l7s)(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, internal/* outro_and_destroy_block */.XP4, DocBrowser_svelte_create_each_block, null, DocBrowser_svelte_get_each_context);
				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section0);
				(0,internal/* detach */.YoD)(t11);
				(0,internal/* detach */.YoD)(section1);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			(0,internal/* run_all */.oOW)(dispose);
		}
	};
}

// (160:12) {#each sortedAndFilteredItems as todo (todo._id)}
function DocBrowser_svelte_create_each_block(key_1, ctx) {
	let li;
	let activity;
	let t;
	let current;
	activity = new Activity_svelte({ props: { doc: /*todo*/ ctx[24] } });
	activity.$on("remove", /*removeDoc*/ ctx[13]);
	activity.$on("update", /*updateDoc*/ ctx[12]);

	return {
		key: key_1,
		first: null,
		c() {
			li = (0,internal/* element */.ND4)("li");
			(0,internal/* create_component */.N0i)(activity.$$.fragment);
			t = (0,internal/* space */.xem)();
			this.first = li;
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, li, anchor);
			(0,internal/* mount_component */.wSR)(activity, li, null);
			(0,internal/* append */.BCw)(li, t);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const activity_changes = {};
			if (dirty & /*sortedAndFilteredItems*/ 1024) activity_changes.doc = /*todo*/ ctx[24];
			activity.$set(activity_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(activity.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(activity.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(li);
			}

			(0,internal/* destroy_component */.Hbl)(activity);
		}
	};
}

function DocBrowser_svelte_create_fragment(ctx) {
	let t0;
	let button;
	let addicon;
	let t1;
	let section;
	let activity;
	let t2;
	let tagcheckboxbar0;
	let updating_tags;
	let updating_selected;
	let t3;
	let tagcheckboxbar1;
	let updating_tags_1;
	let updating_selected_1;
	let t4;
	let if_block1_anchor;
	let current;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*isLoading*/ ctx[6]) return DocBrowser_svelte_create_if_block_1;
		return DocBrowser_svelte_create_else_block;
	}

	let current_block_type = select_block_type(ctx, -1);
	let if_block0 = current_block_type(ctx);
	addicon = new plus_svelte({});

	activity = new Activity_svelte({
			props: {
				doc: /*newDoc*/ ctx[5],
				viewmode: /*addNewItem*/ ctx[7] ? 'add' : 'hidden'
			}
		});

	activity.$on("add", /*addDoc*/ ctx[11]);

	function tagcheckboxbar0_tags_binding(value) {
		/*tagcheckboxbar0_tags_binding*/ ctx[15](value);
	}

	function tagcheckboxbar0_selected_binding(value) {
		/*tagcheckboxbar0_selected_binding*/ ctx[16](value);
	}

	let tagcheckboxbar0_props = {
		name: "activityTypes",
		classes: ['tagBar'],
		selectMax: "1"
	};

	if (/*activityTypes*/ ctx[9] !== void 0) {
		tagcheckboxbar0_props.tags = /*activityTypes*/ ctx[9];
	}

	if (/*selectedActivityTypes*/ ctx[4] !== void 0) {
		tagcheckboxbar0_props.selected = /*selectedActivityTypes*/ ctx[4];
	}

	tagcheckboxbar0 = new TagCheckboxBar_svelte({ props: tagcheckboxbar0_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar0, 'tags', tagcheckboxbar0_tags_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar0, 'selected', tagcheckboxbar0_selected_binding));

	function tagcheckboxbar1_tags_binding(value) {
		/*tagcheckboxbar1_tags_binding*/ ctx[17](value);
	}

	function tagcheckboxbar1_selected_binding(value) {
		/*tagcheckboxbar1_selected_binding*/ ctx[18](value);
	}

	let tagcheckboxbar1_props = { name: "tags", classes: ['tagBar'] };

	if (/*tags*/ ctx[8] !== void 0) {
		tagcheckboxbar1_props.tags = /*tags*/ ctx[8];
	}

	if (/*selectedTags*/ ctx[3] !== void 0) {
		tagcheckboxbar1_props.selected = /*selectedTags*/ ctx[3];
	}

	tagcheckboxbar1 = new TagCheckboxBar_svelte({ props: tagcheckboxbar1_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar1, 'tags', tagcheckboxbar1_tags_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar1, 'selected', tagcheckboxbar1_selected_binding));
	let if_block1 = /*items*/ ctx[0].length > 0 && DocBrowser_svelte_create_if_block(ctx);

	return {
		c() {
			if_block0.c();
			t0 = (0,internal/* space */.xem)();
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(addicon.$$.fragment);
			t1 = (0,internal/* space */.xem)();
			section = (0,internal/* element */.ND4)("section");
			(0,internal/* create_component */.N0i)(activity.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(tagcheckboxbar0.$$.fragment);
			t3 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(tagcheckboxbar1.$$.fragment);
			t4 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			if_block1_anchor = (0,internal/* empty */.Iex)();
			(0,internal/* attr */.CFu)(button, "class", "icon addItem");
		},
		m(target, anchor) {
			if_block0.m(target, anchor);
			(0,internal/* insert */.Yry)(target, t0, anchor);
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* mount_component */.wSR)(addicon, button, null);
			(0,internal/* insert */.Yry)(target, t1, anchor);
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* mount_component */.wSR)(activity, section, null);
			(0,internal/* insert */.Yry)(target, t2, anchor);
			(0,internal/* mount_component */.wSR)(tagcheckboxbar0, target, anchor);
			(0,internal/* insert */.Yry)(target, t3, anchor);
			(0,internal/* mount_component */.wSR)(tagcheckboxbar1, target, anchor);
			(0,internal/* insert */.Yry)(target, t4, anchor);
			if (if_block1) if_block1.m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block1_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*toggleNewItem*/ ctx[14]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			}

			const activity_changes = {};
			if (dirty & /*newDoc*/ 32) activity_changes.doc = /*newDoc*/ ctx[5];
			if (dirty & /*addNewItem*/ 128) activity_changes.viewmode = /*addNewItem*/ ctx[7] ? 'add' : 'hidden';
			activity.$set(activity_changes);
			const tagcheckboxbar0_changes = {};

			if (!updating_tags && dirty & /*activityTypes*/ 512) {
				updating_tags = true;
				tagcheckboxbar0_changes.tags = /*activityTypes*/ ctx[9];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_tags = false);
			}

			if (!updating_selected && dirty & /*selectedActivityTypes*/ 16) {
				updating_selected = true;
				tagcheckboxbar0_changes.selected = /*selectedActivityTypes*/ ctx[4];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_selected = false);
			}

			tagcheckboxbar0.$set(tagcheckboxbar0_changes);
			const tagcheckboxbar1_changes = {};

			if (!updating_tags_1 && dirty & /*tags*/ 256) {
				updating_tags_1 = true;
				tagcheckboxbar1_changes.tags = /*tags*/ ctx[8];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_tags_1 = false);
			}

			if (!updating_selected_1 && dirty & /*selectedTags*/ 8) {
				updating_selected_1 = true;
				tagcheckboxbar1_changes.selected = /*selectedTags*/ ctx[3];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_selected_1 = false);
			}

			tagcheckboxbar1.$set(tagcheckboxbar1_changes);

			if (/*items*/ ctx[0].length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*items*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block1, 1);
					}
				} else {
					if_block1 = DocBrowser_svelte_create_if_block(ctx);
					if_block1.c();
					(0,internal/* transition_in */.c7F)(if_block1, 1);
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(addicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(activity.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(tagcheckboxbar0.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(tagcheckboxbar1.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(if_block1);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(addicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(activity.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(tagcheckboxbar0.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(tagcheckboxbar1.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t0);
				(0,internal/* detach */.YoD)(button);
				(0,internal/* detach */.YoD)(t1);
				(0,internal/* detach */.YoD)(section);
				(0,internal/* detach */.YoD)(t2);
				(0,internal/* detach */.YoD)(t3);
				(0,internal/* detach */.YoD)(t4);
				(0,internal/* detach */.YoD)(if_block1_anchor);
			}

			if_block0.d(detaching);
			(0,internal/* destroy_component */.Hbl)(addicon);
			(0,internal/* destroy_component */.Hbl)(activity);
			(0,internal/* destroy_component */.Hbl)(tagcheckboxbar0, detaching);
			(0,internal/* destroy_component */.Hbl)(tagcheckboxbar1, detaching);
			if (if_block1) if_block1.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function DocBrowser_svelte_instance($$self, $$props, $$invalidate) {
	let sortedAndFilteredItems;
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(21, $settings = $$value));
	let db = new index_es/* default */.A('db', { revs_limit: 1, auto_compaction: true });

	/*
  const replication = PouchDB.sync('db', 'http://localhost:5984/svelte-todo-db', {
    live: true,
    retry: true
  }).on('change', async function (info) {
    await updateTodos()
  }).on('error', function (err) {
    console.log('Replication error:', err)
  })
*/
	// Set up
	let newDoc = new lib_ActivityDoc();

	let sortByWhat = 'createdAt';
	let completedFilter = '';
	let isLoading = true;
	let addNewItem = false;
	let tags = Object.keys($settings.tags);
	let selectedTags = [];
	let activityTypes = Object.keys($settings.activityTypes);
	let selectedActivityTypes = [];
	let { items = [] } = $$props;

	// Helper for reloading all todos from the local PouchDB. It’s on-device and has basically zero latency,
	// so we can use it quite liberally instead of keeping our local state up to date like you’d do
	// in a Redux reducer. It also saves us from having to rebuild the local state todos from the data we sent
	// to the database and the `_id` and `_rev` values that were sent back.
	async function updateItems() {
		const allDocs = await db.allDocs({ include_docs: true });
		$$invalidate(0, items = allDocs.rows.map(row => row.doc));
		$$invalidate(6, isLoading = false);
	}

	// Event handlers for adding, updating and removing todos
	async function addDoc(event) {
		const { doc } = event.detail;
		doc.complete = false;
		doc.createdAt = new Date().toISOString();
		const addition = await db.post(doc);

		if (addition.ok) {
			await updateItems();
		}

		$$invalidate(5, newDoc = new lib_ActivityDoc());
		$$invalidate(7, addNewItem = false);
	}

	async function updateDoc(event) {
		const { doc } = event.detail;
		const update = await db.put(doc);

		if (update.ok) {
			await updateItems();
		}
	}

	async function removeDoc(event) {
		const { doc } = event.detail;
		const removal = await db.remove(doc);

		if (removal.ok) {
			// For removal, we can just update the local state instead of reloading everything from PouchDB,
			// since we no longer care about the doc’s revision.
			$$invalidate(0, items = items.filter(activityDoc => {
				return activityDoc._id !== doc._id;
			}));
		}
	}

	// Load todos on first run
	(0,runtime/* onMount */.Rc)(async () => {
		await updateItems();
	});

	// New Item
	function toggleNewItem() {
		$$invalidate(7, addNewItem = !addNewItem);
	}

	function tagcheckboxbar0_tags_binding(value) {
		activityTypes = value;
		$$invalidate(9, activityTypes);
	}

	function tagcheckboxbar0_selected_binding(value) {
		selectedActivityTypes = value;
		$$invalidate(4, selectedActivityTypes);
	}

	function tagcheckboxbar1_tags_binding(value) {
		tags = value;
		$$invalidate(8, tags);
	}

	function tagcheckboxbar1_selected_binding(value) {
		selectedTags = value;
		$$invalidate(3, selectedTags);
	}

	function select0_change_handler() {
		sortByWhat = (0,internal/* select_value */.Hw5)(this);
		$$invalidate(1, sortByWhat);
	}

	function select1_change_handler() {
		completedFilter = (0,internal/* select_value */.Hw5)(this);
		$$invalidate(2, completedFilter);
	}

	$$self.$$set = $$props => {
		if ('items' in $$props) $$invalidate(0, items = $$props.items);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*items, sortByWhat, completedFilter, selectedActivityTypes, selectedTags*/ 31) {
			$: $$invalidate(10, sortedAndFilteredItems = (0,lodash.sortBy)(items, [sortByWhat]).filter(todo => {
				let filters = new lib_filters(completedFilter, selectedActivityTypes, selectedTags);

				if (filters.hasActiveFilters()) {
					return filters.matches(todo);
				}

				return true;
			}));
		}
	};

	return [
		items,
		sortByWhat,
		completedFilter,
		selectedTags,
		selectedActivityTypes,
		newDoc,
		isLoading,
		addNewItem,
		tags,
		activityTypes,
		sortedAndFilteredItems,
		addDoc,
		updateDoc,
		removeDoc,
		toggleNewItem,
		tagcheckboxbar0_tags_binding,
		tagcheckboxbar0_selected_binding,
		tagcheckboxbar1_tags_binding,
		tagcheckboxbar1_selected_binding,
		select0_change_handler,
		select1_change_handler
	];
}

class DocBrowser extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, DocBrowser_svelte_instance, DocBrowser_svelte_create_fragment, internal/* safe_not_equal */.jXN, { items: 0 });
	}
}

/* harmony default export */ const DocBrowser_svelte = (DocBrowser);

;// ./src/lib/icons/active.svelte
/* src/lib/icons/active.svelte generated by Svelte v4.2.19 */




function active_svelte_create_fragment(ctx) {
	let svg;
	let path0;
	let path1;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path0 = (0,internal/* svg_element */.QQy)("path");
			path1 = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path0, "d", "M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z");
			(0,internal/* attr */.CFu)(path0, "stroke", "#222");
			(0,internal/* attr */.CFu)(path0, "stroke-width", "1.5");
			(0,internal/* attr */.CFu)(path0, "stroke-linecap", "round");
			(0,internal/* attr */.CFu)(path0, "stroke-linejoin", "round");
			(0,internal/* attr */.CFu)(path1, "d", "M7.33008 14.49L9.71008 11.4C10.0501 10.96 10.6801 10.88 11.1201 11.22L12.9501 12.66C13.3901 13 14.0201 12.92 14.3601 12.49L16.6701 9.51001");
			(0,internal/* attr */.CFu)(path1, "stroke", "#222");
			(0,internal/* attr */.CFu)(path1, "stroke-width", "1.5");
			(0,internal/* attr */.CFu)(path1, "stroke-linecap", "round");
			(0,internal/* attr */.CFu)(path1, "stroke-linejoin", "round");
			(0,internal/* attr */.CFu)(svg, "width", "35px");
			(0,internal/* attr */.CFu)(svg, "height", "35px");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "fill", "none");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path0);
			(0,internal/* append */.BCw)(svg, path1);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Active extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, active_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const active_svelte = (Active);
;// ./src/lib/icons/burger.svelte
/* src/lib/icons/burger.svelte generated by Svelte v4.2.19 */




function burger_svelte_create_fragment(ctx) {
	let svg;
	let path0;
	let path1;
	let path2;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path0 = (0,internal/* svg_element */.QQy)("path");
			path1 = (0,internal/* svg_element */.QQy)("path");
			path2 = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path0, "d", "M21,19H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z");
			(0,internal/* set_style */.hgi)(path0, "fill", "#222");
			(0,internal/* attr */.CFu)(path1, "d", "M21,13H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z");
			(0,internal/* set_style */.hgi)(path1, "fill", "#222");
			(0,internal/* attr */.CFu)(path2, "d", "M21,7H3A1,1,0,0,1,3,5H21a1,1,0,0,1,0,2Z");
			(0,internal/* set_style */.hgi)(path2, "fill", "#222");
			(0,internal/* attr */.CFu)(svg, "width", "35px");
			(0,internal/* attr */.CFu)(svg, "height", "35px");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "id", "menu-alt");
			(0,internal/* attr */.CFu)(svg, "class", "icon glyph");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path0);
			(0,internal/* append */.BCw)(svg, path1);
			(0,internal/* append */.BCw)(svg, path2);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Burger extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, burger_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const burger_svelte = (Burger);
;// ./src/lib/icons/cog.svelte
/* src/lib/icons/cog.svelte generated by Svelte v4.2.19 */




function cog_svelte_create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "id", "Shape");
			(0,internal/* attr */.CFu)(path, "d", "M6.995,19.461a10.065,10.065,0,0,1-2.171-.9.756.756,0,0,1-.382-.7l.132-2.067a.151.151,0,0,0-.044-.116l-.707-.708a.149.149,0,0,0-.106-.043h-.01l-2.075.129-.047,0a.75.75,0,0,1-.654-.384,10.071,10.071,0,0,1-.9-2.176.755.755,0,0,1,.226-.766l1.559-1.376a.149.149,0,0,0,.05-.113V9.25a.151.151,0,0,0-.05-.113L.254,7.761a.754.754,0,0,1-.226-.766,10.115,10.115,0,0,1,.9-2.177.75.75,0,0,1,.654-.382h.047l2.075.129h.01a.153.153,0,0,0,.106-.044l.7-.7a.15.15,0,0,0,.043-.116L4.436,1.632a.754.754,0,0,1,.382-.7,10.115,10.115,0,0,1,2.177-.9.751.751,0,0,1,.766.226L9.137,1.813a.151.151,0,0,0,.113.05h.988a.149.149,0,0,0,.113-.05L11.728.254a.751.751,0,0,1,.766-.226,10.071,10.071,0,0,1,2.176.9.753.753,0,0,1,.383.7l-.129,2.075a.151.151,0,0,0,.043.116l.7.7a.155.155,0,0,0,.107.044h.009l2.075-.129H17.9a.752.752,0,0,1,.654.382,10.07,10.07,0,0,1,.9,2.177.753.753,0,0,1-.226.766L17.676,9.137a.152.152,0,0,0-.051.113v.988a.152.152,0,0,0,.051.113l1.559,1.376a.753.753,0,0,1,.226.766,10.026,10.026,0,0,1-.9,2.176.751.751,0,0,1-.654.384l-.047,0-2.075-.129h-.01a.149.149,0,0,0-.106.043l-.7.7a.154.154,0,0,0-.043.116l.129,2.075a.744.744,0,0,1-.383.7,10.011,10.011,0,0,1-2.171.9.746.746,0,0,1-.767-.226l-1.371-1.557a.149.149,0,0,0-.113-.051h-1a.152.152,0,0,0-.113.051L7.761,19.235a.751.751,0,0,1-.766.226ZM4.883,13.907l.708.707a1.649,1.649,0,0,1,.48,1.273l-.1,1.582a8.373,8.373,0,0,0,.988.409l1.055-1.194a1.652,1.652,0,0,1,1.238-.558h1a1.649,1.649,0,0,1,1.238.56l1.049,1.191a8.413,8.413,0,0,0,.989-.41l-.1-1.59a1.653,1.653,0,0,1,.481-1.27l.7-.7a1.664,1.664,0,0,1,1.167-.483l.1,0,1.59.1a8.376,8.376,0,0,0,.412-.994l-1.194-1.055a1.652,1.652,0,0,1-.558-1.238V9.25a1.652,1.652,0,0,1,.558-1.238l1.194-1.055a8.274,8.274,0,0,0-.412-.994l-1.59.1c-.033,0-.068,0-.1,0a1.642,1.642,0,0,1-1.169-.484l-.7-.7a1.65,1.65,0,0,1-.481-1.269l.1-1.59a8.748,8.748,0,0,0-.994-.413l-1.055,1.2a1.652,1.652,0,0,1-1.238.558H9.25a1.652,1.652,0,0,1-1.238-.558L6.958,1.61a8.8,8.8,0,0,0-.994.413l.1,1.59a1.65,1.65,0,0,1-.481,1.269l-.7.7a1.638,1.638,0,0,1-1.168.484c-.033,0-.067,0-.1,0l-1.59-.1a8.748,8.748,0,0,0-.413.994l1.2,1.055A1.652,1.652,0,0,1,3.363,9.25v.988a1.652,1.652,0,0,1-.558,1.238l-1.2,1.055a8.666,8.666,0,0,0,.413.994l1.59-.1.1,0A1.638,1.638,0,0,1,4.883,13.907Zm.106-4.168a4.75,4.75,0,1,1,4.75,4.75A4.756,4.756,0,0,1,4.989,9.739Zm1.5,0a3.25,3.25,0,1,0,3.25-3.25A3.254,3.254,0,0,0,6.489,9.739Z");
			(0,internal/* attr */.CFu)(path, "transform", "translate(2.3 2.3)");
			(0,internal/* attr */.CFu)(path, "fill", "#222");
			(0,internal/* attr */.CFu)(svg, "width", "40px");
			(0,internal/* attr */.CFu)(svg, "height", "40px");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Cog extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, cog_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const cog_svelte = (Cog);
;// ./src/lib/Menu.svelte
/* src/lib/Menu.svelte generated by Svelte v4.2.19 */




const get_items_slot_changes = dirty => ({});
const get_items_slot_context = ctx => ({});
const Menu_svelte_get_icon_slot_changes = dirty => ({});
const Menu_svelte_get_icon_slot_context = ctx => ({});

function Menu_svelte_create_fragment(ctx) {
	let button;
	let t;
	let aside;
	let aside_class_value;
	let current;
	let mounted;
	let dispose;
	const icon_slot_template = /*#slots*/ ctx[4].icon;
	const icon_slot = (0,internal/* create_slot */.Of3)(icon_slot_template, ctx, /*$$scope*/ ctx[3], Menu_svelte_get_icon_slot_context);
	const items_slot_template = /*#slots*/ ctx[4].items;
	const items_slot = (0,internal/* create_slot */.Of3)(items_slot_template, ctx, /*$$scope*/ ctx[3], get_items_slot_context);

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			if (icon_slot) icon_slot.c();
			t = (0,internal/* space */.xem)();
			aside = (0,internal/* element */.ND4)("aside");
			if (items_slot) items_slot.c();
			(0,internal/* attr */.CFu)(button, "class", "icon svelte-vhnsq1");
			(0,internal/* attr */.CFu)(aside, "class", aside_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*align*/ ctx[1]) + " svelte-vhnsq1"));
			(0,internal/* attr */.CFu)(aside, "data-viewmode", /*viewmode*/ ctx[0]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);

			if (icon_slot) {
				icon_slot.m(button, null);
			}

			(0,internal/* insert */.Yry)(target, t, anchor);
			(0,internal/* insert */.Yry)(target, aside, anchor);

			if (items_slot) {
				items_slot.m(aside, null);
			}

			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*toggle*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (icon_slot) {
				if (icon_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					(0,internal/* update_slot_base */.nkG)(
						icon_slot,
						icon_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[3])
						: (0,internal/* get_slot_changes */.sWk)(icon_slot_template, /*$$scope*/ ctx[3], dirty, Menu_svelte_get_icon_slot_changes),
						Menu_svelte_get_icon_slot_context
					);
				}
			}

			if (items_slot) {
				if (items_slot.p && (!current || dirty & /*$$scope*/ 8)) {
					(0,internal/* update_slot_base */.nkG)(
						items_slot,
						items_slot_template,
						ctx,
						/*$$scope*/ ctx[3],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[3])
						: (0,internal/* get_slot_changes */.sWk)(items_slot_template, /*$$scope*/ ctx[3], dirty, get_items_slot_changes),
						get_items_slot_context
					);
				}
			}

			if (!current || dirty & /*align*/ 2 && aside_class_value !== (aside_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*align*/ ctx[1]) + " svelte-vhnsq1"))) {
				(0,internal/* attr */.CFu)(aside, "class", aside_class_value);
			}

			if (!current || dirty & /*viewmode*/ 1) {
				(0,internal/* attr */.CFu)(aside, "data-viewmode", /*viewmode*/ ctx[0]);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(icon_slot, local);
			(0,internal/* transition_in */.c7F)(items_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(icon_slot, local);
			(0,internal/* transition_out */.Tn8)(items_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
				(0,internal/* detach */.YoD)(t);
				(0,internal/* detach */.YoD)(aside);
			}

			if (icon_slot) icon_slot.d(detaching);
			if (items_slot) items_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function Menu_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { viewmode } = $$props;
	let { align } = $$props;

	function toggle() {
		$$invalidate(0, viewmode = viewmode === 'open' ? 'hidden' : 'open');
	}

	$$self.$$set = $$props => {
		if ('viewmode' in $$props) $$invalidate(0, viewmode = $$props.viewmode);
		if ('align' in $$props) $$invalidate(1, align = $$props.align);
		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
	};

	return [viewmode, align, toggle, $$scope, slots];
}

class Menu extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Menu_svelte_instance, Menu_svelte_create_fragment, internal/* safe_not_equal */.jXN, { viewmode: 0, align: 1 });
	}
}

/* harmony default export */ const Menu_svelte = (Menu);

;// ./src/lib/MenuItem.svelte
/* src/lib/MenuItem.svelte generated by Svelte v4.2.19 */



const MenuItem_svelte_get_icon_slot_changes = dirty => ({});
const MenuItem_svelte_get_icon_slot_context = ctx => ({ class: "menu-icon svelte-154jvji" });

// (18:4) {#if iconAlign === 'right'}
function MenuItem_svelte_create_if_block_1(ctx) {
	let h3;
	let t;

	return {
		c() {
			h3 = (0,internal/* element */.ND4)("h3");
			t = (0,internal/* text */.Qq7)(/*label*/ ctx[1]);
			(0,internal/* attr */.CFu)(h3, "class", "svelte-154jvji");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h3, anchor);
			(0,internal/* append */.BCw)(h3, t);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 2) (0,internal/* set_data */.iQh)(t, /*label*/ ctx[1]);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h3);
			}
		}
	};
}

// (24:4) {#if iconAlign === 'left'}
function MenuItem_svelte_create_if_block(ctx) {
	let h3;
	let t;

	return {
		c() {
			h3 = (0,internal/* element */.ND4)("h3");
			t = (0,internal/* text */.Qq7)(/*label*/ ctx[1]);
			(0,internal/* attr */.CFu)(h3, "class", "svelte-154jvji");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h3, anchor);
			(0,internal/* append */.BCw)(h3, t);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 2) (0,internal/* set_data */.iQh)(t, /*label*/ ctx[1]);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h3);
			}
		}
	};
}

function MenuItem_svelte_create_fragment(ctx) {
	let button;
	let t0;
	let t1;
	let current;
	let if_block0 = /*iconAlign*/ ctx[0] === 'right' && MenuItem_svelte_create_if_block_1(ctx);
	const icon_slot_template = /*#slots*/ ctx[3].icon;
	const icon_slot = (0,internal/* create_slot */.Of3)(icon_slot_template, ctx, /*$$scope*/ ctx[2], MenuItem_svelte_get_icon_slot_context);
	let if_block1 = /*iconAlign*/ ctx[0] === 'left' && MenuItem_svelte_create_if_block(ctx);

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			if (if_block0) if_block0.c();
			t0 = (0,internal/* space */.xem)();
			if (icon_slot) icon_slot.c();
			t1 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			(0,internal/* attr */.CFu)(button, "class", "menu-item svelte-154jvji");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			if (if_block0) if_block0.m(button, null);
			(0,internal/* append */.BCw)(button, t0);

			if (icon_slot) {
				icon_slot.m(button, null);
			}

			(0,internal/* append */.BCw)(button, t1);
			if (if_block1) if_block1.m(button, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*iconAlign*/ ctx[0] === 'right') {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = MenuItem_svelte_create_if_block_1(ctx);
					if_block0.c();
					if_block0.m(button, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (icon_slot) {
				if (icon_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					(0,internal/* update_slot_base */.nkG)(
						icon_slot,
						icon_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[2])
						: (0,internal/* get_slot_changes */.sWk)(icon_slot_template, /*$$scope*/ ctx[2], dirty, MenuItem_svelte_get_icon_slot_changes),
						MenuItem_svelte_get_icon_slot_context
					);
				}
			}

			if (/*iconAlign*/ ctx[0] === 'left') {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = MenuItem_svelte_create_if_block(ctx);
					if_block1.c();
					if_block1.m(button, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(icon_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(icon_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
			}

			if (if_block0) if_block0.d();
			if (icon_slot) icon_slot.d(detaching);
			if (if_block1) if_block1.d();
		}
	};
}

function MenuItem_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { iconAlign = 'left' } = $$props;
	let { label } = $$props;

	$$self.$$set = $$props => {
		if ('iconAlign' in $$props) $$invalidate(0, iconAlign = $$props.iconAlign);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [iconAlign, label, $$scope, slots];
}

class MenuItem extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, MenuItem_svelte_instance, MenuItem_svelte_create_fragment, internal/* safe_not_equal */.jXN, { iconAlign: 0, label: 1 });
	}
}

/* harmony default export */ const MenuItem_svelte = (MenuItem);

;// ./src/lib/icons/dark-light.svelte
/* src/lib/icons/dark-light.svelte generated by Svelte v4.2.19 */




function dark_light_svelte_create_fragment(ctx) {
	let svg;
	let path0;
	let path1;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path0 = (0,internal/* svg_element */.QQy)("path");
			path1 = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path0, "d", "M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8V16Z");
			(0,internal/* attr */.CFu)(path0, "fill", "#000000");
			(0,internal/* attr */.CFu)(path1, "fill-rule", "evenodd");
			(0,internal/* attr */.CFu)(path1, "clip-rule", "evenodd");
			(0,internal/* attr */.CFu)(path1, "d", "M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4V8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16V20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z");
			(0,internal/* attr */.CFu)(path1, "fill", "#000000");
			(0,internal/* attr */.CFu)(svg, "fill", "#000000");
			(0,internal/* attr */.CFu)(svg, "height", "34px");
			(0,internal/* attr */.CFu)(svg, "width", "34px");
			(0,internal/* attr */.CFu)(svg, "version", "1.1");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 24 24");
			(0,internal/* attr */.CFu)(svg, "xml:space", "preserve");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path0);
			(0,internal/* append */.BCw)(svg, path1);
		},
		p: internal/* noop */.lQ1,
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

class Dark_light extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, dark_light_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const dark_light_svelte = (Dark_light);
;// ./src/lib/input/LightModeBtn.svelte
/* src/lib/input/LightModeBtn.svelte generated by Svelte v4.2.19 */





function LightModeBtn_svelte_create_fragment(ctx) {
	let button;
	let darklighticon;
	let current;
	let mounted;
	let dispose;
	darklighticon = new dark_light_svelte({});

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(darklighticon.$$.fragment);
			(0,internal/* attr */.CFu)(button, "id", "light-mode");
			(0,internal/* attr */.CFu)(button, "class", "svelte-ee90ys");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* mount_component */.wSR)(darklighticon, button, null);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*toggle*/ ctx[0]);
				mounted = true;
			}
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(darklighticon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(darklighticon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
			}

			(0,internal/* destroy_component */.Hbl)(darklighticon);
			mounted = false;
			dispose();
		}
	};
}

function LightModeBtn_svelte_instance($$self, $$props, $$invalidate) {
	let { value = 0 } = $$props;

	function toggle() {
		$$invalidate(1, value = value === 0 ? 1 : 0);
	}

	$$self.$$set = $$props => {
		if ('value' in $$props) $$invalidate(1, value = $$props.value);
	};

	return [toggle, value];
}

class LightModeBtn extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, LightModeBtn_svelte_instance, LightModeBtn_svelte_create_fragment, internal/* safe_not_equal */.jXN, { value: 1 });
	}
}

/* harmony default export */ const LightModeBtn_svelte = (LightModeBtn);

;// ./src/Settings.svelte
/* src/Settings.svelte generated by Svelte v4.2.19 */






function Settings_svelte_create_fragment(ctx) {
	let section;
	let h2;
	let t1;
	let lightmodebtn;
	let updating_value;
	let current;

	function lightmodebtn_value_binding(value) {
		/*lightmodebtn_value_binding*/ ctx[1](value);
	}

	let lightmodebtn_props = {};

	if (/*$settings*/ ctx[0].lightMode !== void 0) {
		lightmodebtn_props.value = /*$settings*/ ctx[0].lightMode;
	}

	lightmodebtn = new LightModeBtn_svelte({ props: lightmodebtn_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(lightmodebtn, 'value', lightmodebtn_value_binding));

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");
			h2 = (0,internal/* element */.ND4)("h2");
			h2.textContent = "Settings";
			t1 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(lightmodebtn.$$.fragment);
			(0,internal/* attr */.CFu)(h2, "class", "svelte-mjouae");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* append */.BCw)(section, h2);
			(0,internal/* append */.BCw)(section, t1);
			(0,internal/* mount_component */.wSR)(lightmodebtn, section, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const lightmodebtn_changes = {};

			if (!updating_value && dirty & /*$settings*/ 1) {
				updating_value = true;
				lightmodebtn_changes.value = /*$settings*/ ctx[0].lightMode;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_value = false);
			}

			lightmodebtn.$set(lightmodebtn_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(lightmodebtn.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(lightmodebtn.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_component */.Hbl)(lightmodebtn);
		}
	};
}

function Settings_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(0, $settings = $$value));

	function lightmodebtn_value_binding(value) {
		if ($$self.$$.not_equal($settings.lightMode, value)) {
			$settings.lightMode = value;
			settings.set($settings);
		}
	}

	return [$settings, lightmodebtn_value_binding];
}

class Settings extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Settings_svelte_instance, Settings_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const Settings_svelte = (Settings);

;// ./src/Navigation.svelte
/* src/Navigation.svelte generated by Svelte v4.2.19 */










function create_icon_slot_2(ctx) {
	let burgericon;
	let current;
	burgericon = new burger_svelte({ props: { slot: "icon" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(burgericon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(burgericon, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(burgericon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(burgericon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(burgericon, detaching);
		}
	};
}

// (22:16) 
function Navigation_svelte_create_icon_slot_1(ctx) {
	let activeicon;
	let current;
	activeicon = new active_svelte({ props: { slot: "icon" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(activeicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(activeicon, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(activeicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(activeicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(activeicon, detaching);
		}
	};
}

// (20:8) 
function create_items_slot_1(ctx) {
	let section;
	let menuitem;
	let current;

	menuitem = new MenuItem_svelte({
			props: {
				label: "Activities",
				$$slots: { icon: [Navigation_svelte_create_icon_slot_1] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");
			(0,internal/* create_component */.N0i)(menuitem.$$.fragment);
			(0,internal/* attr */.CFu)(section, "slot", "items");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* mount_component */.wSR)(menuitem, section, null);
			current = true;
		},
		p(ctx, dirty) {
			const menuitem_changes = {};

			if (dirty & /*$$scope*/ 1) {
				menuitem_changes.$$scope = { dirty, ctx };
			}

			menuitem.$set(menuitem_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(menuitem.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(menuitem.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_component */.Hbl)(menuitem);
		}
	};
}

// (28:8) 
function Navigation_svelte_create_icon_slot(ctx) {
	let cogicon;
	let current;
	cogicon = new cog_svelte({ props: { slot: "icon" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(cogicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(cogicon, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(cogicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(cogicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(cogicon, detaching);
		}
	};
}

// (29:8) 
function create_items_slot(ctx) {
	let settings;
	let current;
	settings = new Settings_svelte({ props: { slot: "items" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(settings.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(settings, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(settings.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(settings.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(settings, detaching);
		}
	};
}

function Navigation_svelte_create_fragment(ctx) {
	let header;
	let menu0;
	let t0;
	let div;
	let t1;
	let menu1;
	let current;

	menu0 = new Menu_svelte({
			props: {
				viewmode: "hidden",
				align: "left",
				$$slots: {
					items: [create_items_slot_1],
					icon: [create_icon_slot_2]
				},
				$$scope: { ctx }
			}
		});

	menu1 = new Menu_svelte({
			props: {
				viewmode: "hidden",
				align: "right",
				$$slots: {
					items: [create_items_slot],
					icon: [Navigation_svelte_create_icon_slot]
				},
				$$scope: { ctx }
			}
		});

	return {
		c() {
			header = (0,internal/* element */.ND4)("header");
			(0,internal/* create_component */.N0i)(menu0.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			div = (0,internal/* element */.ND4)("div");
			t1 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(menu1.$$.fragment);
			(0,internal/* attr */.CFu)(div, "id", "logo");
			(0,internal/* attr */.CFu)(header, "class", "svelte-sl5tyb");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, header, anchor);
			(0,internal/* mount_component */.wSR)(menu0, header, null);
			(0,internal/* append */.BCw)(header, t0);
			(0,internal/* append */.BCw)(header, div);
			(0,internal/* append */.BCw)(header, t1);
			(0,internal/* mount_component */.wSR)(menu1, header, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const menu0_changes = {};

			if (dirty & /*$$scope*/ 1) {
				menu0_changes.$$scope = { dirty, ctx };
			}

			menu0.$set(menu0_changes);
			const menu1_changes = {};

			if (dirty & /*$$scope*/ 1) {
				menu1_changes.$$scope = { dirty, ctx };
			}

			menu1.$set(menu1_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(menu0.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(menu1.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(menu0.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(menu1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(header);
			}

			(0,internal/* destroy_component */.Hbl)(menu0);
			(0,internal/* destroy_component */.Hbl)(menu1);
		}
	};
}

class Navigation extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, Navigation_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const Navigation_svelte = (Navigation);

;// ./src/lib/vendor/svg.js
/*!
* @svgdotjs/svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.2.4
* https://svgjs.dev/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Thu Jun 27 2024 12:00:16 GMT+0200 (Central European Summer Time)
*/;
const methods$1 = {};
const names = [];
function registerMethods(name, m) {
  if (Array.isArray(name)) {
    for (const _name of name) {
      registerMethods(_name, m);
    }
    return;
  }
  if (typeof name === 'object') {
    for (const _name in name) {
      registerMethods(_name, name[_name]);
    }
    return;
  }
  addMethodNames(Object.getOwnPropertyNames(m));
  methods$1[name] = Object.assign(methods$1[name] || {}, m);
}
function getMethodsFor(name) {
  return methods$1[name] || {};
}
function getMethodNames() {
  return [...new Set(names)];
}
function addMethodNames(_names) {
  names.push(..._names);
}

// Map function
function map(array, block) {
  let i;
  const il = array.length;
  const result = [];
  for (i = 0; i < il; i++) {
    result.push(block(array[i]));
  }
  return result;
}

// Filter function
function filter(array, block) {
  let i;
  const il = array.length;
  const result = [];
  for (i = 0; i < il; i++) {
    if (block(array[i])) {
      result.push(array[i]);
    }
  }
  return result;
}

// Degrees to radians
function radians(d) {
  return d % 360 * Math.PI / 180;
}

// Radians to degrees
function degrees(r) {
  return r * 180 / Math.PI % 360;
}

// Convert camel cased string to dash separated
function unCamelCase(s) {
  return s.replace(/([A-Z])/g, function (m, g) {
    return '-' + g.toLowerCase();
  });
}

// Capitalize first letter of a string
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Calculate proportional width and height values when necessary
function proportionalSize(element, width, height, box) {
  if (width == null || height == null) {
    box = box || element.bbox();
    if (width == null) {
      width = box.width / box.height * height;
    } else if (height == null) {
      height = box.height / box.width * width;
    }
  }
  return {
    width: width,
    height: height
  };
}

/**
 * This function adds support for string origins.
 * It searches for an origin in o.origin o.ox and o.originX.
 * This way, origin: {x: 'center', y: 50} can be passed as well as ox: 'center', oy: 50
 **/
function getOrigin(o, element) {
  const origin = o.origin;
  // First check if origin is in ox or originX
  let ox = o.ox != null ? o.ox : o.originX != null ? o.originX : 'center';
  let oy = o.oy != null ? o.oy : o.originY != null ? o.originY : 'center';

  // Then check if origin was used and overwrite in that case
  if (origin != null) {
    [ox, oy] = Array.isArray(origin) ? origin : typeof origin === 'object' ? [origin.x, origin.y] : [origin, origin];
  }

  // Make sure to only call bbox when actually needed
  const condX = typeof ox === 'string';
  const condY = typeof oy === 'string';
  if (condX || condY) {
    const {
      height,
      width,
      x,
      y
    } = element.bbox();

    // And only overwrite if string was passed for this specific axis
    if (condX) {
      ox = ox.includes('left') ? x : ox.includes('right') ? x + width : x + width / 2;
    }
    if (condY) {
      oy = oy.includes('top') ? y : oy.includes('bottom') ? y + height : y + height / 2;
    }
  }

  // Return the origin as it is if it wasn't a string
  return [ox, oy];
}
const descriptiveElements = new Set(['desc', 'metadata', 'title']);
const isDescriptive = element => descriptiveElements.has(element.nodeName);
const writeDataToDom = (element, data, defaults = {}) => {
  const cloned = {
    ...data
  };
  for (const key in cloned) {
    if (cloned[key].valueOf() === defaults[key]) {
      delete cloned[key];
    }
  }
  if (Object.keys(cloned).length) {
    element.node.setAttribute('data-svgjs', JSON.stringify(cloned)); // see #428
  } else {
    element.node.removeAttribute('data-svgjs');
    element.node.removeAttribute('svgjs:data');
  }
};

var utils = {
  __proto__: null,
  capitalize: capitalize,
  degrees: degrees,
  filter: filter,
  getOrigin: getOrigin,
  isDescriptive: isDescriptive,
  map: map,
  proportionalSize: proportionalSize,
  radians: radians,
  unCamelCase: unCamelCase,
  writeDataToDom: writeDataToDom
};

// Default namespaces
const svg = 'http://www.w3.org/2000/svg';
const html = 'http://www.w3.org/1999/xhtml';
const xmlns = 'http://www.w3.org/2000/xmlns/';
const xlink = 'http://www.w3.org/1999/xlink';

var namespaces = {
  __proto__: null,
  html: html,
  svg: svg,
  xlink: xlink,
  xmlns: xmlns
};

const globals = {
  window: typeof window === 'undefined' ? null : window,
  document: typeof document === 'undefined' ? null : document
};
function registerWindow(win = null, doc = null) {
  globals.window = win;
  globals.document = doc;
}
const save = {};
function saveWindow() {
  save.window = globals.window;
  save.document = globals.document;
}
function restoreWindow() {
  globals.window = save.window;
  globals.document = save.document;
}
function withWindow(win, fn) {
  saveWindow();
  registerWindow(win, win.document);
  fn(win, win.document);
  restoreWindow();
}
function getWindow() {
  return globals.window;
}

class Base {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}

const svg_elements = {};
const root = '___SYMBOL___ROOT___';

// Method for element creation
function create(name, ns = svg) {
  // create element
  return globals.document.createElementNS(ns, name);
}
function makeInstance(element, isHTML = false) {
  if (element instanceof Base) return element;
  if (typeof element === 'object') {
    return adopter(element);
  }
  if (element == null) {
    return new svg_elements[root]();
  }
  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopter(globals.document.querySelector(element));
  }

  // Make sure, that HTML elements are created with the correct namespace
  const wrapper = isHTML ? globals.document.createElement('div') : create('svg');
  wrapper.innerHTML = element;

  // We can use firstChild here because we know,
  // that the first char is < and thus an element
  element = adopter(wrapper.firstChild);

  // make sure, that element doesn't have its wrapper attached
  wrapper.removeChild(wrapper.firstChild);
  return element;
}
function nodeOrNew(name, node) {
  return node && (node instanceof globals.window.Node || node.ownerDocument && node instanceof node.ownerDocument.defaultView.Node) ? node : create(name);
}

// Adopt existing svg elements
function adopt(node) {
  // check for presence of node
  if (!node) return null;

  // make sure a node isn't already adopted
  if (node.instance instanceof Base) return node.instance;
  if (node.nodeName === '#document-fragment') {
    return new svg_elements.Fragment(node);
  }

  // initialize variables
  let className = capitalize(node.nodeName || 'Dom');

  // Make sure that gradients are adopted correctly
  if (className === 'LinearGradient' || className === 'RadialGradient') {
    className = 'Gradient';

    // Fallback to Dom if element is not known
  } else if (!svg_elements[className]) {
    className = 'Dom';
  }
  return new svg_elements[className](node);
}
let adopter = adopt;
function mockAdopt(mock = adopt) {
  adopter = mock;
}
function register(element, name = element.name, asRoot = false) {
  svg_elements[name] = element;
  if (asRoot) svg_elements[root] = element;
  addMethodNames(Object.getOwnPropertyNames(element.prototype));
  return element;
}
function getClass(name) {
  return svg_elements[name];
}

// Element id sequence
let did = 1000;

// Get next named element id
function eid(name) {
  return 'Svgjs' + capitalize(name) + did++;
}

// Deep new id assignment
function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (let i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i]);
  }
  if (node.id) {
    node.id = eid(node.nodeName);
    return node;
  }
  return node;
}

// Method for extending objects
function extend(modules, methods) {
  let key, i;
  modules = Array.isArray(modules) ? modules : [modules];
  for (i = modules.length - 1; i >= 0; i--) {
    for (key in methods) {
      modules[i].prototype[key] = methods[key];
    }
  }
}
function wrapWithAttrCheck(fn) {
  return function (...args) {
    const o = args[args.length - 1];
    if (o && o.constructor === Object && !(o instanceof Array)) {
      return fn.apply(this, args.slice(0, -1)).attr(o);
    } else {
      return fn.apply(this, args);
    }
  };
}

// Get all siblings, including myself
function siblings() {
  return this.parent().children();
}

// Get the current position siblings
function position() {
  return this.parent().index(this);
}

// Get the next element (will return null if there is none)
function next() {
  return this.siblings()[this.position() + 1];
}

// Get the next element (will return null if there is none)
function prev() {
  return this.siblings()[this.position() - 1];
}

// Send given element one step forward
function forward() {
  const i = this.position();
  const p = this.parent();

  // move node one step forward
  p.add(this.remove(), i + 1);
  return this;
}

// Send given element one step backward
function backward() {
  const i = this.position();
  const p = this.parent();
  p.add(this.remove(), i ? i - 1 : 0);
  return this;
}

// Send given element all the way to the front
function front() {
  const p = this.parent();

  // Move node forward
  p.add(this.remove());
  return this;
}

// Send given element all the way to the back
function back() {
  const p = this.parent();

  // Move node back
  p.add(this.remove(), 0);
  return this;
}

// Inserts a given element before the targeted element
function before(element) {
  element = makeInstance(element);
  element.remove();
  const i = this.position();
  this.parent().add(element, i);
  return this;
}

// Inserts a given element after the targeted element
function after(element) {
  element = makeInstance(element);
  element.remove();
  const i = this.position();
  this.parent().add(element, i + 1);
  return this;
}
function insertBefore(element) {
  element = makeInstance(element);
  element.before(this);
  return this;
}
function insertAfter(element) {
  element = makeInstance(element);
  element.after(this);
  return this;
}
registerMethods('Dom', {
  siblings,
  position,
  next,
  prev,
  forward,
  backward,
  front,
  back,
  before,
  after,
  insertBefore,
  insertAfter
});

// Parse unit value
const numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;

// Parse hex value
const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

// Parse rgb value
const rgb = /rgb\((\d+),(\d+),(\d+)\)/;

// Parse reference id
const reference = /(#[a-z_][a-z0-9\-_]*)/i;

// splits a transformation chain
const transforms = /\)\s*,?\s*/;

// Whitespace
const whitespace = /\s/g;

// Test hex value
const isHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i;

// Test rgb value
const isRgb = /^rgb\(/;

// Test for blank string
const isBlank = /^(\s+)?$/;

// Test for numeric string
const isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

// Test for image url
const isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;

// split at whitespace and comma
const delimiter = /[\s,]+/;

// Test for path letter
const isPathLetter = /[MLHVCSQTAZ]/i;

var regex = {
  __proto__: null,
  delimiter: delimiter,
  hex: hex,
  isBlank: isBlank,
  isHex: isHex,
  isImage: isImage,
  isNumber: isNumber,
  isPathLetter: isPathLetter,
  isRgb: isRgb,
  numberAndUnit: numberAndUnit,
  reference: reference,
  rgb: rgb,
  transforms: transforms,
  whitespace: whitespace
};

// Return array of classes on the node
function classes() {
  const attr = this.attr('class');
  return attr == null ? [] : attr.trim().split(delimiter);
}

// Return true if class exists on the node, false otherwise
function hasClass(name) {
  return this.classes().indexOf(name) !== -1;
}

// Add class to the node
function addClass(name) {
  if (!this.hasClass(name)) {
    const array = this.classes();
    array.push(name);
    this.attr('class', array.join(' '));
  }
  return this;
}

// Remove class from the node
function removeClass(name) {
  if (this.hasClass(name)) {
    this.attr('class', this.classes().filter(function (c) {
      return c !== name;
    }).join(' '));
  }
  return this;
}

// Toggle the presence of a class on the node
function toggleClass(name) {
  return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
}
registerMethods('Dom', {
  classes,
  hasClass,
  addClass,
  removeClass,
  toggleClass
});

// Dynamic style generator
function css(style, val) {
  const ret = {};
  if (arguments.length === 0) {
    // get full style as object
    this.node.style.cssText.split(/\s*;\s*/).filter(function (el) {
      return !!el.length;
    }).forEach(function (el) {
      const t = el.split(/\s*:\s*/);
      ret[t[0]] = t[1];
    });
    return ret;
  }
  if (arguments.length < 2) {
    // get style properties as array
    if (Array.isArray(style)) {
      for (const name of style) {
        const cased = name;
        ret[name] = this.node.style.getPropertyValue(cased);
      }
      return ret;
    }

    // get style for property
    if (typeof style === 'string') {
      return this.node.style.getPropertyValue(style);
    }

    // set styles in object
    if (typeof style === 'object') {
      for (const name in style) {
        // set empty string if null/undefined/'' was given
        this.node.style.setProperty(name, style[name] == null || isBlank.test(style[name]) ? '' : style[name]);
      }
    }
  }

  // set style for property
  if (arguments.length === 2) {
    this.node.style.setProperty(style, val == null || isBlank.test(val) ? '' : val);
  }
  return this;
}

// Show element
function show() {
  return this.css('display', '');
}

// Hide element
function hide() {
  return this.css('display', 'none');
}

// Is element visible?
function visible() {
  return this.css('display') !== 'none';
}
registerMethods('Dom', {
  css,
  show,
  hide,
  visible
});

// Store data values on svg nodes
function data(a, v, r) {
  if (a == null) {
    // get an object of attributes
    return this.data(map(filter(this.node.attributes, el => el.nodeName.indexOf('data-') === 0), el => el.nodeName.slice(5)));
  } else if (a instanceof Array) {
    const data = {};
    for (const key of a) {
      data[key] = this.data(key);
    }
    return data;
  } else if (typeof a === 'object') {
    for (v in a) {
      this.data(v, a[v]);
    }
  } else if (arguments.length < 2) {
    try {
      return JSON.parse(this.attr('data-' + a));
    } catch (e) {
      return this.attr('data-' + a);
    }
  } else {
    this.attr('data-' + a, v === null ? null : r === true || typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v));
  }
  return this;
}
registerMethods('Dom', {
  data
});

// Remember arbitrary data
function remember(k, v) {
  // remember every item in an object individually
  if (typeof arguments[0] === 'object') {
    for (const key in k) {
      this.remember(key, k[key]);
    }
  } else if (arguments.length === 1) {
    // retrieve memory
    return this.memory()[k];
  } else {
    // store memory
    this.memory()[k] = v;
  }
  return this;
}

// Erase a given memory
function forget() {
  if (arguments.length === 0) {
    this._memory = {};
  } else {
    for (let i = arguments.length - 1; i >= 0; i--) {
      delete this.memory()[arguments[i]];
    }
  }
  return this;
}

// This triggers creation of a new hidden class which is not performant
// However, this function is not rarely used so it will not happen frequently
// Return local memory object
function memory() {
  return this._memory = this._memory || {};
}
registerMethods('Dom', {
  remember,
  forget,
  memory
});

function sixDigitHex(hex) {
  return hex.length === 4 ? ['#', hex.substring(1, 2), hex.substring(1, 2), hex.substring(2, 3), hex.substring(2, 3), hex.substring(3, 4), hex.substring(3, 4)].join('') : hex;
}
function componentHex(component) {
  const integer = Math.round(component);
  const bounded = Math.max(0, Math.min(255, integer));
  const hex = bounded.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
function is(object, space) {
  for (let i = space.length; i--;) {
    if (object[space[i]] == null) {
      return false;
    }
  }
  return true;
}
function getParameters(a, b) {
  const params = is(a, 'rgb') ? {
    _a: a.r,
    _b: a.g,
    _c: a.b,
    _d: 0,
    space: 'rgb'
  } : is(a, 'xyz') ? {
    _a: a.x,
    _b: a.y,
    _c: a.z,
    _d: 0,
    space: 'xyz'
  } : is(a, 'hsl') ? {
    _a: a.h,
    _b: a.s,
    _c: a.l,
    _d: 0,
    space: 'hsl'
  } : is(a, 'lab') ? {
    _a: a.l,
    _b: a.a,
    _c: a.b,
    _d: 0,
    space: 'lab'
  } : is(a, 'lch') ? {
    _a: a.l,
    _b: a.c,
    _c: a.h,
    _d: 0,
    space: 'lch'
  } : is(a, 'cmyk') ? {
    _a: a.c,
    _b: a.m,
    _c: a.y,
    _d: a.k,
    space: 'cmyk'
  } : {
    _a: 0,
    _b: 0,
    _c: 0,
    space: 'rgb'
  };
  params.space = b || params.space;
  return params;
}
function cieSpace(space) {
  if (space === 'lab' || space === 'xyz' || space === 'lch') {
    return true;
  } else {
    return false;
  }
}
function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
class Color {
  constructor(...inputs) {
    this.init(...inputs);
  }

  // Test if given value is a color
  static isColor(color) {
    return color && (color instanceof Color || this.isRgb(color) || this.test(color));
  }

  // Test if given value is an rgb object
  static isRgb(color) {
    return color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number';
  }

  /*
  Generating random colors
  */
  static random(mode = 'vibrant', t) {
    // Get the math modules
    const {
      random,
      round,
      sin,
      PI: pi
    } = Math;

    // Run the correct generator
    if (mode === 'vibrant') {
      const l = (81 - 57) * random() + 57;
      const c = (83 - 45) * random() + 45;
      const h = 360 * random();
      const color = new Color(l, c, h, 'lch');
      return color;
    } else if (mode === 'sine') {
      t = t == null ? random() : t;
      const r = round(80 * sin(2 * pi * t / 0.5 + 0.01) + 150);
      const g = round(50 * sin(2 * pi * t / 0.5 + 4.6) + 200);
      const b = round(100 * sin(2 * pi * t / 0.5 + 2.3) + 150);
      const color = new Color(r, g, b);
      return color;
    } else if (mode === 'pastel') {
      const l = (94 - 86) * random() + 86;
      const c = (26 - 9) * random() + 9;
      const h = 360 * random();
      const color = new Color(l, c, h, 'lch');
      return color;
    } else if (mode === 'dark') {
      const l = 10 + 10 * random();
      const c = (125 - 75) * random() + 86;
      const h = 360 * random();
      const color = new Color(l, c, h, 'lch');
      return color;
    } else if (mode === 'rgb') {
      const r = 255 * random();
      const g = 255 * random();
      const b = 255 * random();
      const color = new Color(r, g, b);
      return color;
    } else if (mode === 'lab') {
      const l = 100 * random();
      const a = 256 * random() - 128;
      const b = 256 * random() - 128;
      const color = new Color(l, a, b, 'lab');
      return color;
    } else if (mode === 'grey') {
      const grey = 255 * random();
      const color = new Color(grey, grey, grey);
      return color;
    } else {
      throw new Error('Unsupported random color mode');
    }
  }

  // Test if given value is a color string
  static test(color) {
    return typeof color === 'string' && (isHex.test(color) || isRgb.test(color));
  }
  cmyk() {
    // Get the rgb values for the current color
    const {
      _a,
      _b,
      _c
    } = this.rgb();
    const [r, g, b] = [_a, _b, _c].map(v => v / 255);

    // Get the cmyk values in an unbounded format
    const k = Math.min(1 - r, 1 - g, 1 - b);
    if (k === 1) {
      // Catch the black case
      return new Color(0, 0, 0, 1, 'cmyk');
    }
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    // Construct the new color
    const color = new Color(c, m, y, k, 'cmyk');
    return color;
  }
  hsl() {
    // Get the rgb values
    const {
      _a,
      _b,
      _c
    } = this.rgb();
    const [r, g, b] = [_a, _b, _c].map(v => v / 255);

    // Find the maximum and minimum values to get the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // If the r, g, v values are identical then we are grey
    const isGrey = max === min;

    // Calculate the hue and saturation
    const delta = max - min;
    const s = isGrey ? 0 : l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    const h = isGrey ? 0 : max === r ? ((g - b) / delta + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / delta + 2) / 6 : max === b ? ((r - g) / delta + 4) / 6 : 0;

    // Construct and return the new color
    const color = new Color(360 * h, 100 * s, 100 * l, 'hsl');
    return color;
  }
  init(a = 0, b = 0, c = 0, d = 0, space = 'rgb') {
    // This catches the case when a falsy value is passed like ''
    a = !a ? 0 : a;

    // Reset all values in case the init function is rerun with new color space
    if (this.space) {
      for (const component in this.space) {
        delete this[this.space[component]];
      }
    }
    if (typeof a === 'number') {
      // Allow for the case that we don't need d...
      space = typeof d === 'string' ? d : space;
      d = typeof d === 'string' ? 0 : d;

      // Assign the values straight to the color
      Object.assign(this, {
        _a: a,
        _b: b,
        _c: c,
        _d: d,
        space
      });
      // If the user gave us an array, make the color from it
    } else if (a instanceof Array) {
      this.space = b || (typeof a[3] === 'string' ? a[3] : a[4]) || 'rgb';
      Object.assign(this, {
        _a: a[0],
        _b: a[1],
        _c: a[2],
        _d: a[3] || 0
      });
    } else if (a instanceof Object) {
      // Set the object up and assign its values directly
      const values = getParameters(a, b);
      Object.assign(this, values);
    } else if (typeof a === 'string') {
      if (isRgb.test(a)) {
        const noWhitespace = a.replace(whitespace, '');
        const [_a, _b, _c] = rgb.exec(noWhitespace).slice(1, 4).map(v => parseInt(v));
        Object.assign(this, {
          _a,
          _b,
          _c,
          _d: 0,
          space: 'rgb'
        });
      } else if (isHex.test(a)) {
        const hexParse = v => parseInt(v, 16);
        const [, _a, _b, _c] = hex.exec(sixDigitHex(a)).map(hexParse);
        Object.assign(this, {
          _a,
          _b,
          _c,
          _d: 0,
          space: 'rgb'
        });
      } else throw Error("Unsupported string format, can't construct Color");
    }

    // Now add the components as a convenience
    const {
      _a,
      _b,
      _c,
      _d
    } = this;
    const components = this.space === 'rgb' ? {
      r: _a,
      g: _b,
      b: _c
    } : this.space === 'xyz' ? {
      x: _a,
      y: _b,
      z: _c
    } : this.space === 'hsl' ? {
      h: _a,
      s: _b,
      l: _c
    } : this.space === 'lab' ? {
      l: _a,
      a: _b,
      b: _c
    } : this.space === 'lch' ? {
      l: _a,
      c: _b,
      h: _c
    } : this.space === 'cmyk' ? {
      c: _a,
      m: _b,
      y: _c,
      k: _d
    } : {};
    Object.assign(this, components);
  }
  lab() {
    // Get the xyz color
    const {
      x,
      y,
      z
    } = this.xyz();

    // Get the lab components
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    // Construct and return a new color
    const color = new Color(l, a, b, 'lab');
    return color;
  }
  lch() {
    // Get the lab color directly
    const {
      l,
      a,
      b
    } = this.lab();

    // Get the chromaticity and the hue using polar coordinates
    const c = Math.sqrt(a ** 2 + b ** 2);
    let h = 180 * Math.atan2(b, a) / Math.PI;
    if (h < 0) {
      h *= -1;
      h = 360 - h;
    }

    // Make a new color and return it
    const color = new Color(l, c, h, 'lch');
    return color;
  }
  /*
  Conversion Methods
  */

  rgb() {
    if (this.space === 'rgb') {
      return this;
    } else if (cieSpace(this.space)) {
      // Convert to the xyz color space
      let {
        x,
        y,
        z
      } = this;
      if (this.space === 'lab' || this.space === 'lch') {
        // Get the values in the lab space
        let {
          l,
          a,
          b
        } = this;
        if (this.space === 'lch') {
          const {
            c,
            h
          } = this;
          const dToR = Math.PI / 180;
          a = c * Math.cos(dToR * h);
          b = c * Math.sin(dToR * h);
        }

        // Undo the nonlinear function
        const yL = (l + 16) / 116;
        const xL = a / 500 + yL;
        const zL = yL - b / 200;

        // Get the xyz values
        const ct = 16 / 116;
        const mx = 0.008856;
        const nm = 7.787;
        x = 0.95047 * (xL ** 3 > mx ? xL ** 3 : (xL - ct) / nm);
        y = 1.0 * (yL ** 3 > mx ? yL ** 3 : (yL - ct) / nm);
        z = 1.08883 * (zL ** 3 > mx ? zL ** 3 : (zL - ct) / nm);
      }

      // Convert xyz to unbounded rgb values
      const rU = x * 3.2406 + y * -1.5372 + z * -0.4986;
      const gU = x * -0.9689 + y * 1.8758 + z * 0.0415;
      const bU = x * 0.0557 + y * -0.204 + z * 1.057;

      // Convert the values to true rgb values
      const pow = Math.pow;
      const bd = 0.0031308;
      const r = rU > bd ? 1.055 * pow(rU, 1 / 2.4) - 0.055 : 12.92 * rU;
      const g = gU > bd ? 1.055 * pow(gU, 1 / 2.4) - 0.055 : 12.92 * gU;
      const b = bU > bd ? 1.055 * pow(bU, 1 / 2.4) - 0.055 : 12.92 * bU;

      // Make and return the color
      const color = new Color(255 * r, 255 * g, 255 * b);
      return color;
    } else if (this.space === 'hsl') {
      // https://bgrins.github.io/TinyColor/docs/tinycolor.html
      // Get the current hsl values
      let {
        h,
        s,
        l
      } = this;
      h /= 360;
      s /= 100;
      l /= 100;

      // If we are grey, then just make the color directly
      if (s === 0) {
        l *= 255;
        const color = new Color(l, l, l);
        return color;
      }

      // TODO I have no idea what this does :D If you figure it out, tell me!
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      // Get the rgb values
      const r = 255 * hueToRgb(p, q, h + 1 / 3);
      const g = 255 * hueToRgb(p, q, h);
      const b = 255 * hueToRgb(p, q, h - 1 / 3);

      // Make a new color
      const color = new Color(r, g, b);
      return color;
    } else if (this.space === 'cmyk') {
      // https://gist.github.com/felipesabino/5066336
      // Get the normalised cmyk values
      const {
        c,
        m,
        y,
        k
      } = this;

      // Get the rgb values
      const r = 255 * (1 - Math.min(1, c * (1 - k) + k));
      const g = 255 * (1 - Math.min(1, m * (1 - k) + k));
      const b = 255 * (1 - Math.min(1, y * (1 - k) + k));

      // Form the color and return it
      const color = new Color(r, g, b);
      return color;
    } else {
      return this;
    }
  }
  toArray() {
    const {
      _a,
      _b,
      _c,
      _d,
      space
    } = this;
    return [_a, _b, _c, _d, space];
  }
  toHex() {
    const [r, g, b] = this._clamped().map(componentHex);
    return `#${r}${g}${b}`;
  }
  toRgb() {
    const [rV, gV, bV] = this._clamped();
    const string = `rgb(${rV},${gV},${bV})`;
    return string;
  }
  toString() {
    return this.toHex();
  }
  xyz() {
    // Normalise the red, green and blue values
    const {
      _a: r255,
      _b: g255,
      _c: b255
    } = this.rgb();
    const [r, g, b] = [r255, g255, b255].map(v => v / 255);

    // Convert to the lab rgb space
    const rL = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    const gL = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    const bL = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to the xyz color space without bounding the values
    const xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
    const yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.0;
    const zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;

    // Get the proper xyz values by applying the bounding
    const x = xU > 0.008856 ? Math.pow(xU, 1 / 3) : 7.787 * xU + 16 / 116;
    const y = yU > 0.008856 ? Math.pow(yU, 1 / 3) : 7.787 * yU + 16 / 116;
    const z = zU > 0.008856 ? Math.pow(zU, 1 / 3) : 7.787 * zU + 16 / 116;

    // Make and return the color
    const color = new Color(x, y, z, 'xyz');
    return color;
  }

  /*
  Input and Output methods
  */

  _clamped() {
    const {
      _a,
      _b,
      _c
    } = this.rgb();
    const {
      max,
      min,
      round
    } = Math;
    const format = v => max(0, min(round(v), 255));
    return [_a, _b, _c].map(format);
  }

  /*
  Constructing colors
  */
}

class Point {
  // Initialize
  constructor(...args) {
    this.init(...args);
  }

  // Clone point
  clone() {
    return new Point(this);
  }
  init(x, y) {
    const base = {
      x: 0,
      y: 0
    };

    // ensure source as object
    const source = Array.isArray(x) ? {
      x: x[0],
      y: x[1]
    } : typeof x === 'object' ? {
      x: x.x,
      y: x.y
    } : {
      x: x,
      y: y
    };

    // merge source
    this.x = source.x == null ? base.x : source.x;
    this.y = source.y == null ? base.y : source.y;
    return this;
  }
  toArray() {
    return [this.x, this.y];
  }
  transform(m) {
    return this.clone().transformO(m);
  }

  // Transform point with matrix
  transformO(m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m);
    }
    const {
      x,
      y
    } = this;

    // Perform the matrix multiplication
    this.x = m.a * x + m.c * y + m.e;
    this.y = m.b * x + m.d * y + m.f;
    return this;
  }
}
function point(x, y) {
  return new Point(x, y).transformO(this.screenCTM().inverseO());
}

function closeEnough(a, b, threshold) {
  return Math.abs(b - a) < (1e-6);
}
class Matrix {
  constructor(...args) {
    this.init(...args);
  }
  static formatTransforms(o) {
    // Get all of the parameters required to form the matrix
    const flipBoth = o.flip === 'both' || o.flip === true;
    const flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
    const flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
    const skewX = o.skew && o.skew.length ? o.skew[0] : isFinite(o.skew) ? o.skew : isFinite(o.skewX) ? o.skewX : 0;
    const skewY = o.skew && o.skew.length ? o.skew[1] : isFinite(o.skew) ? o.skew : isFinite(o.skewY) ? o.skewY : 0;
    const scaleX = o.scale && o.scale.length ? o.scale[0] * flipX : isFinite(o.scale) ? o.scale * flipX : isFinite(o.scaleX) ? o.scaleX * flipX : flipX;
    const scaleY = o.scale && o.scale.length ? o.scale[1] * flipY : isFinite(o.scale) ? o.scale * flipY : isFinite(o.scaleY) ? o.scaleY * flipY : flipY;
    const shear = o.shear || 0;
    const theta = o.rotate || o.theta || 0;
    const origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
    const ox = origin.x;
    const oy = origin.y;
    // We need Point to be invalid if nothing was passed because we cannot default to 0 here. That is why NaN
    const position = new Point(o.position || o.px || o.positionX || NaN, o.py || o.positionY || NaN);
    const px = position.x;
    const py = position.y;
    const translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
    const tx = translate.x;
    const ty = translate.y;
    const relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
    const rx = relative.x;
    const ry = relative.y;

    // Populate all of the values
    return {
      scaleX,
      scaleY,
      skewX,
      skewY,
      shear,
      theta,
      rx,
      ry,
      tx,
      ty,
      ox,
      oy,
      px,
      py
    };
  }
  static fromArray(a) {
    return {
      a: a[0],
      b: a[1],
      c: a[2],
      d: a[3],
      e: a[4],
      f: a[5]
    };
  }
  static isMatrixLike(o) {
    return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
  }

  // left matrix, right matrix, target matrix which is overwritten
  static matrixMultiply(l, r, o) {
    // Work out the product directly
    const a = l.a * r.a + l.c * r.b;
    const b = l.b * r.a + l.d * r.b;
    const c = l.a * r.c + l.c * r.d;
    const d = l.b * r.c + l.d * r.d;
    const e = l.e + l.a * r.e + l.c * r.f;
    const f = l.f + l.b * r.e + l.d * r.f;

    // make sure to use local variables because l/r and o could be the same
    o.a = a;
    o.b = b;
    o.c = c;
    o.d = d;
    o.e = e;
    o.f = f;
    return o;
  }
  around(cx, cy, matrix) {
    return this.clone().aroundO(cx, cy, matrix);
  }

  // Transform around a center point
  aroundO(cx, cy, matrix) {
    const dx = cx || 0;
    const dy = cy || 0;
    return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy);
  }

  // Clones this matrix
  clone() {
    return new Matrix(this);
  }

  // Decomposes this matrix into its affine parameters
  decompose(cx = 0, cy = 0) {
    // Get the parameters from the matrix
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    // Figure out if the winding direction is clockwise or counterclockwise
    const determinant = a * d - b * c;
    const ccw = determinant > 0 ? 1 : -1;

    // Since we only shear in x, we can use the x basis to get the x scale
    // and the rotation of the resulting matrix
    const sx = ccw * Math.sqrt(a * a + b * b);
    const thetaRad = Math.atan2(ccw * b, ccw * a);
    const theta = 180 / Math.PI * thetaRad;
    const ct = Math.cos(thetaRad);
    const st = Math.sin(thetaRad);

    // We can then solve the y basis vector simultaneously to get the other
    // two affine parameters directly from these parameters
    const lam = (a * c + b * d) / determinant;
    const sy = c * sx / (lam * a - b) || d * sx / (lam * b + a);

    // Use the translations
    const tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
    const ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy);

    // Construct the decomposition and return it
    return {
      // Return the affine parameters
      scaleX: sx,
      scaleY: sy,
      shear: lam,
      rotate: theta,
      translateX: tx,
      translateY: ty,
      originX: cx,
      originY: cy,
      // Return the matrix parameters
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }

  // Check if two matrices are equal
  equals(other) {
    if (other === this) return true;
    const comp = new Matrix(other);
    return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
  }

  // Flip matrix on x or y, at a given offset
  flip(axis, around) {
    return this.clone().flipO(axis, around);
  }
  flipO(axis, around) {
    return axis === 'x' ? this.scaleO(-1, 1, around, 0) : axis === 'y' ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis); // Define an x, y flip point
  }

  // Initialize
  init(source) {
    const base = Matrix.fromArray([1, 0, 0, 1, 0, 0]);

    // ensure source as object
    source = source instanceof Element ? source.matrixify() : typeof source === 'string' ? Matrix.fromArray(source.split(delimiter).map(parseFloat)) : Array.isArray(source) ? Matrix.fromArray(source) : typeof source === 'object' && Matrix.isMatrixLike(source) ? source : typeof source === 'object' ? new Matrix().transform(source) : arguments.length === 6 ? Matrix.fromArray([].slice.call(arguments)) : base;

    // Merge the source matrix with the base matrix
    this.a = source.a != null ? source.a : base.a;
    this.b = source.b != null ? source.b : base.b;
    this.c = source.c != null ? source.c : base.c;
    this.d = source.d != null ? source.d : base.d;
    this.e = source.e != null ? source.e : base.e;
    this.f = source.f != null ? source.f : base.f;
    return this;
  }
  inverse() {
    return this.clone().inverseO();
  }

  // Inverses matrix
  inverseO() {
    // Get the current parameters out of the matrix
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const e = this.e;
    const f = this.f;

    // Invert the 2x2 matrix in the top left
    const det = a * d - b * c;
    if (!det) throw new Error('Cannot invert ' + this);

    // Calculate the top 2x2 matrix
    const na = d / det;
    const nb = -b / det;
    const nc = -c / det;
    const nd = a / det;

    // Apply the inverted matrix to the top right
    const ne = -(na * e + nc * f);
    const nf = -(nb * e + nd * f);

    // Construct the inverted matrix
    this.a = na;
    this.b = nb;
    this.c = nc;
    this.d = nd;
    this.e = ne;
    this.f = nf;
    return this;
  }
  lmultiply(matrix) {
    return this.clone().lmultiplyO(matrix);
  }
  lmultiplyO(matrix) {
    const r = this;
    const l = matrix instanceof Matrix ? matrix : new Matrix(matrix);
    return Matrix.matrixMultiply(l, r, this);
  }

  // Left multiplies by the given matrix
  multiply(matrix) {
    return this.clone().multiplyO(matrix);
  }
  multiplyO(matrix) {
    // Get the matrices
    const l = this;
    const r = matrix instanceof Matrix ? matrix : new Matrix(matrix);
    return Matrix.matrixMultiply(l, r, this);
  }

  // Rotate matrix
  rotate(r, cx, cy) {
    return this.clone().rotateO(r, cx, cy);
  }
  rotateO(r, cx = 0, cy = 0) {
    // Convert degrees to radians
    r = radians(r);
    const cos = Math.cos(r);
    const sin = Math.sin(r);
    const {
      a,
      b,
      c,
      d,
      e,
      f
    } = this;
    this.a = a * cos - b * sin;
    this.b = b * cos + a * sin;
    this.c = c * cos - d * sin;
    this.d = d * cos + c * sin;
    this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
    this.f = f * cos + e * sin - cx * sin - cy * cos + cy;
    return this;
  }

  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(x, y = x, cx = 0, cy = 0) {
    // Support uniform scaling
    if (arguments.length === 3) {
      cy = cx;
      cx = y;
      y = x;
    }
    const {
      a,
      b,
      c,
      d,
      e,
      f
    } = this;
    this.a = a * x;
    this.b = b * y;
    this.c = c * x;
    this.d = d * y;
    this.e = e * x - cx * x + cx;
    this.f = f * y - cy * y + cy;
    return this;
  }

  // Shear matrix
  shear(a, cx, cy) {
    return this.clone().shearO(a, cx, cy);
  }

  // eslint-disable-next-line no-unused-vars
  shearO(lx, cx = 0, cy = 0) {
    const {
      a,
      b,
      c,
      d,
      e,
      f
    } = this;
    this.a = a + b * lx;
    this.c = c + d * lx;
    this.e = e + f * lx - cy * lx;
    return this;
  }

  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(x, y = x, cx = 0, cy = 0) {
    // support uniformal skew
    if (arguments.length === 3) {
      cy = cx;
      cx = y;
      y = x;
    }

    // Convert degrees to radians
    x = radians(x);
    y = radians(y);
    const lx = Math.tan(x);
    const ly = Math.tan(y);
    const {
      a,
      b,
      c,
      d,
      e,
      f
    } = this;
    this.a = a + b * lx;
    this.b = b + a * ly;
    this.c = c + d * lx;
    this.d = d + c * ly;
    this.e = e + f * lx - cy * lx;
    this.f = f + e * ly - cx * ly;
    return this;
  }

  // SkewX
  skewX(x, cx, cy) {
    return this.skew(x, 0, cx, cy);
  }

  // SkewY
  skewY(y, cx, cy) {
    return this.skew(0, y, cx, cy);
  }
  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }

  // Convert matrix to string
  toString() {
    return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
  }

  // Transform a matrix into another matrix by manipulating the space
  transform(o) {
    // Check if o is a matrix and then left multiply it directly
    if (Matrix.isMatrixLike(o)) {
      const matrix = new Matrix(o);
      return matrix.multiplyO(this);
    }

    // Get the proposed transformations and the current transformations
    const t = Matrix.formatTransforms(o);
    const current = this;
    const {
      x: ox,
      y: oy
    } = new Point(t.ox, t.oy).transform(current);

    // Construct the resulting matrix
    const transformer = new Matrix().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy);

    // If we want the origin at a particular place, we force it there
    if (isFinite(t.px) || isFinite(t.py)) {
      const origin = new Point(ox, oy).transform(transformer);
      // TODO: Replace t.px with isFinite(t.px)
      // Doesn't work because t.px is also 0 if it wasn't passed
      const dx = isFinite(t.px) ? t.px - origin.x : 0;
      const dy = isFinite(t.py) ? t.py - origin.y : 0;
      transformer.translateO(dx, dy);
    }

    // Translate now after positioning
    transformer.translateO(t.tx, t.ty);
    return transformer;
  }

  // Translate matrix
  translate(x, y) {
    return this.clone().translateO(x, y);
  }
  translateO(x, y) {
    this.e += x || 0;
    this.f += y || 0;
    return this;
  }
  valueOf() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }
}
function ctm() {
  return new Matrix(this.node.getCTM());
}
function screenCTM() {
  try {
    /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
       This is needed because FF does not return the transformation matrix
       for the inner coordinate system when getScreenCTM() is called on nested svgs.
       However all other Browsers do that */
    if (typeof this.isRoot === 'function' && !this.isRoot()) {
      const rect = this.rect(1, 1);
      const m = rect.node.getScreenCTM();
      rect.remove();
      return new Matrix(m);
    }
    return new Matrix(this.node.getScreenCTM());
  } catch (e) {
    console.warn(`Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`);
    return new Matrix();
  }
}
register(Matrix, 'Matrix');

function parser() {
  // Reuse cached element if possible
  if (!parser.nodes) {
    const svg = makeInstance().size(2, 0);
    svg.node.style.cssText = ['opacity: 0', 'position: absolute', 'left: -100%', 'top: -100%', 'overflow: hidden'].join(';');
    svg.attr('focusable', 'false');
    svg.attr('aria-hidden', 'true');
    const path = svg.path().node;
    parser.nodes = {
      svg,
      path
    };
  }
  if (!parser.nodes.svg.node.parentNode) {
    const b = globals.document.body || globals.document.documentElement;
    parser.nodes.svg.addTo(b);
  }
  return parser.nodes;
}

function isNulledBox(box) {
  return !box.width && !box.height && !box.x && !box.y;
}
function domContains(node) {
  return node === globals.document || (globals.document.documentElement.contains || function (node) {
    // This is IE - it does not support contains() for top-level SVGs
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node === globals.document;
  }).call(globals.document.documentElement, node);
}
class Box {
  constructor(...args) {
    this.init(...args);
  }
  addOffset() {
    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += globals.window.pageXOffset;
    this.y += globals.window.pageYOffset;
    return new Box(this);
  }
  init(source) {
    const base = [0, 0, 0, 0];
    source = typeof source === 'string' ? source.split(delimiter).map(parseFloat) : Array.isArray(source) ? source : typeof source === 'object' ? [source.left != null ? source.left : source.x, source.top != null ? source.top : source.y, source.width, source.height] : arguments.length === 4 ? [].slice.call(arguments) : base;
    this.x = source[0] || 0;
    this.y = source[1] || 0;
    this.width = this.w = source[2] || 0;
    this.height = this.h = source[3] || 0;

    // Add more bounding box properties
    this.x2 = this.x + this.w;
    this.y2 = this.y + this.h;
    this.cx = this.x + this.w / 2;
    this.cy = this.y + this.h / 2;
    return this;
  }
  isNulled() {
    return isNulledBox(this);
  }

  // Merge rect box with another, return a new instance
  merge(box) {
    const x = Math.min(this.x, box.x);
    const y = Math.min(this.y, box.y);
    const width = Math.max(this.x + this.width, box.x + box.width) - x;
    const height = Math.max(this.y + this.height, box.y + box.height) - y;
    return new Box(x, y, width, height);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
  }
  transform(m) {
    if (!(m instanceof Matrix)) {
      m = new Matrix(m);
    }
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
    const pts = [new Point(this.x, this.y), new Point(this.x2, this.y), new Point(this.x, this.y2), new Point(this.x2, this.y2)];
    pts.forEach(function (p) {
      p = p.transform(m);
      xMin = Math.min(xMin, p.x);
      xMax = Math.max(xMax, p.x);
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    });
    return new Box(xMin, yMin, xMax - xMin, yMax - yMin);
  }
}
function getBox(el, getBBoxFn, retry) {
  let box;
  try {
    // Try to get the box with the provided function
    box = getBBoxFn(el.node);

    // If the box is worthless and not even in the dom, retry
    // by throwing an error here...
    if (isNulledBox(box) && !domContains(el.node)) {
      throw new Error('Element not in the dom');
    }
  } catch (e) {
    // ... and calling the retry handler here
    box = retry(el);
  }
  return box;
}
function bbox() {
  // Function to get bbox is getBBox()
  const getBBox = node => node.getBBox();

  // Take all measures so that a stupid browser renders the element
  // so we can get the bbox from it when we try again
  const retry = el => {
    try {
      const clone = el.clone().addTo(parser().svg).show();
      const box = clone.node.getBBox();
      clone.remove();
      return box;
    } catch (e) {
      // We give up...
      throw new Error(`Getting bbox of element "${el.node.nodeName}" is not possible: ${e.toString()}`);
    }
  };
  const box = getBox(this, getBBox, retry);
  const bbox = new Box(box);
  return bbox;
}
function rbox(el) {
  const getRBox = node => node.getBoundingClientRect();
  const retry = el => {
    // There is no point in trying tricks here because if we insert the element into the dom ourselves
    // it obviously will be at the wrong position
    throw new Error(`Getting rbox of element "${el.node.nodeName}" is not possible`);
  };
  const box = getBox(this, getRBox, retry);
  const rbox = new Box(box);

  // If an element was passed, we want the bbox in the coordinate system of that element
  if (el) {
    return rbox.transform(el.screenCTM().inverseO());
  }

  // Else we want it in absolute screen coordinates
  // Therefore we need to add the scrollOffset
  return rbox.addOffset();
}

// Checks whether the given point is inside the bounding box
function inside(x, y) {
  const box = this.bbox();
  return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
}
registerMethods({
  viewbox: {
    viewbox(x, y, width, height) {
      // act as getter
      if (x == null) return new Box(this.attr('viewBox'));

      // act as setter
      return this.attr('viewBox', new Box(x, y, width, height));
    },
    zoom(level, point) {
      // Its best to rely on the attributes here and here is why:
      // clientXYZ: Doesn't work on non-root svgs because they dont have a CSSBox (silly!)
      // getBoundingClientRect: Doesn't work because Chrome just ignores width and height of nested svgs completely
      //                        that means, their clientRect is always as big as the content.
      //                        Furthermore this size is incorrect if the element is further transformed by its parents
      // computedStyle: Only returns meaningful values if css was used with px. We dont go this route here!
      // getBBox: returns the bounding box of its content - that doesn't help!
      let {
        width,
        height
      } = this.attr(['width', 'height']);

      // Width and height is a string when a number with a unit is present which we can't use
      // So we try clientXYZ
      if (!width && !height || typeof width === 'string' || typeof height === 'string') {
        width = this.node.clientWidth;
        height = this.node.clientHeight;
      }

      // Giving up...
      if (!width || !height) {
        throw new Error('Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element');
      }
      const v = this.viewbox();
      const zoomX = width / v.width;
      const zoomY = height / v.height;
      const zoom = Math.min(zoomX, zoomY);
      if (level == null) {
        return zoom;
      }
      let zoomAmount = zoom / level;

      // Set the zoomAmount to the highest value which is safe to process and recover from
      // The * 100 is a bit of wiggle room for the matrix transformation
      if (zoomAmount === Infinity) zoomAmount = Number.MAX_SAFE_INTEGER / 100;
      point = point || new Point(width / 2 / zoomX + v.x, height / 2 / zoomY + v.y);
      const box = new Box(v).transform(new Matrix({
        scale: zoomAmount,
        origin: point
      }));
      return this.viewbox(box);
    }
  }
});
register(Box, 'Box');

// import { subClassArray } from './ArrayPolyfill.js'

class List extends Array {
  constructor(arr = [], ...args) {
    super(arr, ...args);
    if (typeof arr === 'number') return this;
    this.length = 0;
    this.push(...arr);
  }
}
extend([List], {
  each(fnOrMethodName, ...args) {
    if (typeof fnOrMethodName === 'function') {
      return this.map((el, i, arr) => {
        return fnOrMethodName.call(el, el, i, arr);
      });
    } else {
      return this.map(el => {
        return el[fnOrMethodName](...args);
      });
    }
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const reserved = ['toArray', 'constructor', 'each'];
List.extend = function (methods) {
  methods = methods.reduce((obj, name) => {
    // Don't overwrite own methods
    if (reserved.includes(name)) return obj;

    // Don't add private methods
    if (name[0] === '_') return obj;

    // Allow access to original Array methods through a prefix
    if (name in Array.prototype) {
      obj['$' + name] = Array.prototype[name];
    }

    // Relay every call to each()
    obj[name] = function (...attrs) {
      return this.each(name, ...attrs);
    };
    return obj;
  }, {});
  extend([List], methods);
};

function baseFind(query, parent) {
  return new List(map((parent || globals.document).querySelectorAll(query), function (node) {
    return adopt(node);
  }));
}

// Scoped find method
function find(query) {
  return baseFind(query, this.node);
}
function findOne(query) {
  return adopt(this.node.querySelector(query));
}

let listenerId = 0;
const windowEvents = {};
function getEvents(instance) {
  let n = instance.getEventHolder();

  // We dont want to save events in global space
  if (n === globals.window) n = windowEvents;
  if (!n.events) n.events = {};
  return n.events;
}
function getEventTarget(instance) {
  return instance.getEventTarget();
}
function clearEvents(instance) {
  let n = instance.getEventHolder();
  if (n === globals.window) n = windowEvents;
  if (n.events) n.events = {};
}

// Add event binder in the SVG namespace
function on(node, events, listener, binding, options) {
  const l = listener.bind(binding || node);
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);

  // events can be an array of events or a string of events
  events = Array.isArray(events) ? events : events.split(delimiter);

  // add id to listener
  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++listenerId;
  }
  events.forEach(function (event) {
    const ev = event.split('.')[0];
    const ns = event.split('.')[1] || '*';

    // ensure valid object
    bag[ev] = bag[ev] || {};
    bag[ev][ns] = bag[ev][ns] || {};

    // reference listener
    bag[ev][ns][listener._svgjsListenerId] = l;

    // add listener
    n.addEventListener(ev, l, options || false);
  });
}

// Add event unbinder in the SVG namespace
function off(node, events, listener, options) {
  const instance = makeInstance(node);
  const bag = getEvents(instance);
  const n = getEventTarget(instance);

  // listener can be a function or a number
  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId;
    if (!listener) return;
  }

  // events can be an array of events or a string or undefined
  events = Array.isArray(events) ? events : (events || '').split(delimiter);
  events.forEach(function (event) {
    const ev = event && event.split('.')[0];
    const ns = event && event.split('.')[1];
    let namespace, l;
    if (listener) {
      // remove listener reference
      if (bag[ev] && bag[ev][ns || '*']) {
        // removeListener
        n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false);
        delete bag[ev][ns || '*'][listener];
      }
    } else if (ev && ns) {
      // remove all listeners for a namespaced event
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) {
          off(n, [ev, ns].join('.'), l);
        }
        delete bag[ev][ns];
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) {
            off(n, [event, ns].join('.'));
          }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) {
          off(n, [ev, namespace].join('.'));
        }
        delete bag[ev];
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) {
        off(n, event);
      }
      clearEvents(instance);
    }
  });
}
function dispatch(node, event, data, options) {
  const n = getEventTarget(node);

  // Dispatch event
  if (event instanceof globals.window.Event) {
    n.dispatchEvent(event);
  } else {
    event = new globals.window.CustomEvent(event, {
      detail: data,
      cancelable: true,
      ...options
    });
    n.dispatchEvent(event);
  }
  return event;
}

class EventTarget extends Base {
  addEventListener() {}
  dispatch(event, data, options) {
    return dispatch(this, event, data, options);
  }
  dispatchEvent(event) {
    const bag = this.getEventHolder().events;
    if (!bag) return true;
    const events = bag[event.type];
    for (const i in events) {
      for (const j in events[i]) {
        events[i][j](event);
      }
    }
    return !event.defaultPrevented;
  }

  // Fire given event
  fire(event, data, options) {
    this.dispatch(event, data, options);
    return this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }

  // Unbind event from listener
  off(event, listener, options) {
    off(this, event, listener, options);
    return this;
  }

  // Bind given event to listener
  on(event, listener, binding, options) {
    on(this, event, listener, binding, options);
    return this;
  }
  removeEventListener() {}
}
register(EventTarget, 'EventTarget');

function noop() {}

// Default animation values
const timeline = {
  duration: 400,
  ease: '>',
  delay: 0
};

// Default attribute values
const attrs = {
  // fill and stroke
  'fill-opacity': 1,
  'stroke-opacity': 1,
  'stroke-width': 0,
  'stroke-linejoin': 'miter',
  'stroke-linecap': 'butt',
  fill: '#000000',
  stroke: '#000000',
  opacity: 1,
  // position
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  // size
  width: 0,
  height: 0,
  // radius
  r: 0,
  rx: 0,
  ry: 0,
  // gradient
  offset: 0,
  'stop-opacity': 1,
  'stop-color': '#000000',
  // text
  'text-anchor': 'start'
};

var svg_defaults = {
  __proto__: null,
  attrs: attrs,
  noop: noop,
  timeline: timeline
};

class SVGArray extends Array {
  constructor(...args) {
    super(...args);
    this.init(...args);
  }
  clone() {
    return new this.constructor(this);
  }
  init(arr) {
    // This catches the case, that native map tries to create an array with new Array(1)
    if (typeof arr === 'number') return this;
    this.length = 0;
    this.push(...this.parse(arr));
    return this;
  }

  // Parse whitespace separated string
  parse(array = []) {
    // If already is an array, no need to parse it
    if (array instanceof Array) return array;
    return array.trim().split(delimiter).map(parseFloat);
  }
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
  toSet() {
    return new Set(this);
  }
  toString() {
    return this.join(' ');
  }

  // Flattens the array if needed
  valueOf() {
    const ret = [];
    ret.push(...this);
    return ret;
  }
}

// Module for unit conversions
class SVGNumber {
  // Initialize
  constructor(...args) {
    this.init(...args);
  }
  convert(unit) {
    return new SVGNumber(this.value, unit);
  }

  // Divide number
  divide(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this / number, this.unit || number.unit);
  }
  init(value, unit) {
    unit = Array.isArray(value) ? value[1] : unit;
    value = Array.isArray(value) ? value[0] : value;

    // initialize defaults
    this.value = 0;
    this.unit = unit || '';

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -3.4e38 : +3.4e38 : value;
    } else if (typeof value === 'string') {
      unit = value.match(numberAndUnit);
      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1]);

        // normalize
        if (unit[5] === '%') {
          this.value /= 100;
        } else if (unit[5] === 's') {
          this.value *= 1000;
        }

        // store unit
        this.unit = unit[5];
      }
    } else {
      if (value instanceof SVGNumber) {
        this.value = value.valueOf();
        this.unit = value.unit;
      }
    }
    return this;
  }

  // Subtract number
  minus(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this - number, this.unit || number.unit);
  }

  // Add number
  plus(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this + number, this.unit || number.unit);
  }

  // Multiply number
  times(number) {
    number = new SVGNumber(number);
    return new SVGNumber(this * number, this.unit || number.unit);
  }
  toArray() {
    return [this.value, this.unit];
  }
  toJSON() {
    return this.toString();
  }
  toString() {
    return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6 : this.unit === 's' ? this.value / 1e3 : this.value) + this.unit;
  }
  valueOf() {
    return this.value;
  }
}

const colorAttributes = new Set(['fill', 'stroke', 'color', 'bgcolor', 'stop-color', 'flood-color', 'lighting-color']);
const hooks = [];
function registerAttrHook(fn) {
  hooks.push(fn);
}

// Set svg element attribute
function attr(attr, val, ns) {
  // act as full getter
  if (attr == null) {
    // get an object of attributes
    attr = {};
    val = this.node.attributes;
    for (const node of val) {
      attr[node.nodeName] = isNumber.test(node.nodeValue) ? parseFloat(node.nodeValue) : node.nodeValue;
    }
    return attr;
  } else if (attr instanceof Array) {
    // loop through array and get all values
    return attr.reduce((last, curr) => {
      last[curr] = this.attr(curr);
      return last;
    }, {});
  } else if (typeof attr === 'object' && attr.constructor === Object) {
    // apply every attribute individually if an object is passed
    for (val in attr) this.attr(val, attr[val]);
  } else if (val === null) {
    // remove value
    this.node.removeAttribute(attr);
  } else if (val == null) {
    // act as a getter if the first and only argument is not an object
    val = this.node.getAttribute(attr);
    return val == null ? attrs[attr] : isNumber.test(val) ? parseFloat(val) : val;
  } else {
    // Loop through hooks and execute them to convert value
    val = hooks.reduce((_val, hook) => {
      return hook(attr, _val, this);
    }, val);

    // ensure correct numeric values (also accepts NaN and Infinity)
    if (typeof val === 'number') {
      val = new SVGNumber(val);
    } else if (colorAttributes.has(attr) && Color.isColor(val)) {
      // ensure full hex color
      val = new Color(val);
    } else if (val.constructor === Array) {
      // Check for plain arrays and parse array values
      val = new SVGArray(val);
    }

    // if the passed attribute is leading...
    if (attr === 'leading') {
      // ... call the leading method instead
      if (this.leading) {
        this.leading(val);
      }
    } else {
      // set given attribute on node
      typeof ns === 'string' ? this.node.setAttributeNS(ns, attr, val.toString()) : this.node.setAttribute(attr, val.toString());
    }

    // rebuild if required
    if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
      this.rebuild();
    }
  }
  return this;
}

class Dom extends EventTarget {
  constructor(node, attrs) {
    super();
    this.node = node;
    this.type = node.nodeName;
    if (attrs && node !== attrs) {
      this.attr(attrs);
    }
  }

  // Add given element at a position
  add(element, i) {
    element = makeInstance(element);

    // If non-root svg nodes are added we have to remove their namespaces
    if (element.removeNamespace && this.node instanceof globals.window.SVGElement) {
      element.removeNamespace();
    }
    if (i == null) {
      this.node.appendChild(element.node);
    } else if (element.node !== this.node.childNodes[i]) {
      this.node.insertBefore(element.node, this.node.childNodes[i]);
    }
    return this;
  }

  // Add element to given container and return self
  addTo(parent, i) {
    return makeInstance(parent).put(this, i);
  }

  // Returns all child elements
  children() {
    return new List(map(this.node.children, function (node) {
      return adopt(node);
    }));
  }

  // Remove all elements in this container
  clear() {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild);
    }
    return this;
  }

  // Clone element
  clone(deep = true, assignNewIds = true) {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom();

    // clone element
    let nodeClone = this.node.cloneNode(deep);
    if (assignNewIds) {
      // assign new id
      nodeClone = assignNewId(nodeClone);
    }
    return new this.constructor(nodeClone);
  }

  // Iterates over all children and invokes a given block
  each(block, deep) {
    const children = this.children();
    let i, il;
    for (i = 0, il = children.length; i < il; i++) {
      block.apply(children[i], [i, children]);
      if (deep) {
        children[i].each(block, deep);
      }
    }
    return this;
  }
  element(nodeName, attrs) {
    return this.put(new Dom(create(nodeName), attrs));
  }

  // Get first child
  first() {
    return adopt(this.node.firstChild);
  }

  // Get a element at the given index
  get(i) {
    return adopt(this.node.childNodes[i]);
  }
  getEventHolder() {
    return this.node;
  }
  getEventTarget() {
    return this.node;
  }

  // Checks if the given element is a child
  has(element) {
    return this.index(element) >= 0;
  }
  html(htmlOrFn, outerHTML) {
    return this.xml(htmlOrFn, outerHTML, html);
  }

  // Get / set id
  id(id) {
    // generate new id if no id set
    if (typeof id === 'undefined' && !this.node.id) {
      this.node.id = eid(this.type);
    }

    // don't set directly with this.node.id to make `null` work correctly
    return this.attr('id', id);
  }

  // Gets index of given element
  index(element) {
    return [].slice.call(this.node.childNodes).indexOf(element.node);
  }

  // Get the last child
  last() {
    return adopt(this.node.lastChild);
  }

  // matches the element vs a css selector
  matches(selector) {
    const el = this.node;
    const matcher = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector || null;
    return matcher && matcher.call(el, selector);
  }

  // Returns the parent element instance
  parent(type) {
    let parent = this;

    // check for parent
    if (!parent.node.parentNode) return null;

    // get parent element
    parent = adopt(parent.node.parentNode);
    if (!type) return parent;

    // loop through ancestors if type is given
    do {
      if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
    } while (parent = adopt(parent.node.parentNode));
    return parent;
  }

  // Basically does the same as `add()` but returns the added element instead
  put(element, i) {
    element = makeInstance(element);
    this.add(element, i);
    return element;
  }

  // Add element to given container and return container
  putIn(parent, i) {
    return makeInstance(parent).add(this, i);
  }

  // Remove element
  remove() {
    if (this.parent()) {
      this.parent().removeElement(this);
    }
    return this;
  }

  // Remove a given child
  removeElement(element) {
    this.node.removeChild(element.node);
    return this;
  }

  // Replace this with element
  replace(element) {
    element = makeInstance(element);
    if (this.node.parentNode) {
      this.node.parentNode.replaceChild(element.node, this.node);
    }
    return element;
  }
  round(precision = 2, map = null) {
    const factor = 10 ** precision;
    const attrs = this.attr(map);
    for (const i in attrs) {
      if (typeof attrs[i] === 'number') {
        attrs[i] = Math.round(attrs[i] * factor) / factor;
      }
    }
    this.attr(attrs);
    return this;
  }

  // Import / Export raw svg
  svg(svgOrFn, outerSVG) {
    return this.xml(svgOrFn, outerSVG, svg);
  }

  // Return id on string conversion
  toString() {
    return this.id();
  }
  words(text) {
    // This is faster than removing all children and adding a new one
    this.node.textContent = text;
    return this;
  }
  wrap(node) {
    const parent = this.parent();
    if (!parent) {
      return this.addTo(node);
    }
    const position = parent.index(this);
    return parent.put(node, position).put(this);
  }

  // write svgjs data to the dom
  writeDataToDom() {
    // dump variables recursively
    this.each(function () {
      this.writeDataToDom();
    });
    return this;
  }

  // Import / Export raw svg
  xml(xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === 'boolean') {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }

    // act as getter if no svg string is given
    if (xmlOrFn == null || typeof xmlOrFn === 'function') {
      // The default for exports is, that the outerNode is included
      outerXML = outerXML == null ? true : outerXML;

      // write svgjs data to the dom
      this.writeDataToDom();
      let current = this;

      // An export modifier was passed
      if (xmlOrFn != null) {
        current = adopt(current.node.cloneNode(true));

        // If the user wants outerHTML we need to process this node, too
        if (outerXML) {
          const result = xmlOrFn(current);
          current = result || current;

          // The user does not want this node? Well, then he gets nothing
          if (result === false) return '';
        }

        // Deep loop through all children and apply modifier
        current.each(function () {
          const result = xmlOrFn(this);
          const _this = result || this;

          // If modifier returns false, discard node
          if (result === false) {
            this.remove();

            // If modifier returns new node, use it
          } else if (result && this !== _this) {
            this.replace(_this);
          }
        }, true);
      }

      // Return outer or inner content
      return outerXML ? current.node.outerHTML : current.node.innerHTML;
    }

    // Act as setter if we got a string

    // The default for import is, that the current node is not replaced
    outerXML = outerXML == null ? false : outerXML;

    // Create temporary holder
    const well = create('wrapper', ns);
    const fragment = globals.document.createDocumentFragment();

    // Dump raw svg
    well.innerHTML = xmlOrFn;

    // Transplant nodes into the fragment
    for (let len = well.children.length; len--;) {
      fragment.appendChild(well.firstElementChild);
    }
    const parent = this.parent();

    // Add the whole fragment at once
    return outerXML ? this.replace(fragment) && parent : this.add(fragment);
  }
}
extend(Dom, {
  attr,
  find,
  findOne
});
register(Dom, 'Dom');

class Element extends Dom {
  constructor(node, attrs) {
    super(node, attrs);

    // initialize data object
    this.dom = {};

    // create circular reference
    this.node.instance = this;
    if (node.hasAttribute('data-svgjs') || node.hasAttribute('svgjs:data')) {
      // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
      this.setData(JSON.parse(node.getAttribute('data-svgjs')) ?? JSON.parse(node.getAttribute('svgjs:data')) ?? {});
    }
  }

  // Move element by its center
  center(x, y) {
    return this.cx(x).cy(y);
  }

  // Move by center over x-axis
  cx(x) {
    return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
  }

  // Move by center over y-axis
  cy(y) {
    return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
  }

  // Get defs
  defs() {
    const root = this.root();
    return root && root.defs();
  }

  // Relative move over x and y axes
  dmove(x, y) {
    return this.dx(x).dy(y);
  }

  // Relative move over x axis
  dx(x = 0) {
    return this.x(new SVGNumber(x).plus(this.x()));
  }

  // Relative move over y axis
  dy(y = 0) {
    return this.y(new SVGNumber(y).plus(this.y()));
  }
  getEventHolder() {
    return this;
  }

  // Set height of element
  height(height) {
    return this.attr('height', height);
  }

  // Move element to given x and y values
  move(x, y) {
    return this.x(x).y(y);
  }

  // return array of all ancestors of given type up to the root svg
  parents(until = this.root()) {
    const isSelector = typeof until === 'string';
    if (!isSelector) {
      until = makeInstance(until);
    }
    const parents = new List();
    let parent = this;
    while ((parent = parent.parent()) && parent.node !== globals.document && parent.nodeName !== '#document-fragment') {
      parents.push(parent);
      if (!isSelector && parent.node === until.node) {
        break;
      }
      if (isSelector && parent.matches(until)) {
        break;
      }
      if (parent.node === this.root().node) {
        // We worked our way to the root and didn't match `until`
        return null;
      }
    }
    return parents;
  }

  // Get referenced element form attribute value
  reference(attr) {
    attr = this.attr(attr);
    if (!attr) return null;
    const m = (attr + '').match(reference);
    return m ? makeInstance(m[1]) : null;
  }

  // Get parent document
  root() {
    const p = this.parent(getClass(root));
    return p && p.root();
  }

  // set given data to the elements data property
  setData(o) {
    this.dom = o;
    return this;
  }

  // Set element size to given width and height
  size(width, height) {
    const p = proportionalSize(this, width, height);
    return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height));
  }

  // Set width of element
  width(width) {
    return this.attr('width', width);
  }

  // write svgjs data to the dom
  writeDataToDom() {
    writeDataToDom(this, this.dom);
    return super.writeDataToDom();
  }

  // Move over x-axis
  x(x) {
    return this.attr('x', x);
  }

  // Move over y-axis
  y(y) {
    return this.attr('y', y);
  }
}
extend(Element, {
  bbox,
  rbox,
  inside,
  point,
  ctm,
  screenCTM
});
register(Element, 'Element');

// Define list of available attributes for stroke and fill
const sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
  fill: ['color', 'opacity', 'rule'],
  prefix: function (t, a) {
    return a === 'color' ? t : t + '-' + a;
  }
}

// Add sugar for fill and stroke
;
['fill', 'stroke'].forEach(function (m) {
  const extension = {};
  let i;
  extension[m] = function (o) {
    if (typeof o === 'undefined') {
      return this.attr(m);
    }
    if (typeof o === 'string' || o instanceof Color || Color.isRgb(o) || o instanceof Element) {
      this.attr(m, o);
    } else {
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--) {
        if (o[sugar[m][i]] != null) {
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
        }
      }
    }
    return this;
  };
  registerMethods(['Element', 'Runner'], extension);
});
registerMethods(['Element', 'Runner'], {
  // Let the user set the matrix directly
  matrix: function (mat, b, c, d, e, f) {
    // Act as a getter
    if (mat == null) {
      return new Matrix(this);
    }

    // Act as a setter, the user can pass a matrix or a set of numbers
    return this.attr('transform', new Matrix(mat, b, c, d, e, f));
  },
  // Map rotation to transform
  rotate: function (angle, cx, cy) {
    return this.transform({
      rotate: angle,
      ox: cx,
      oy: cy
    }, true);
  },
  // Map skew to transform
  skew: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      skew: x,
      ox: y,
      oy: cx
    }, true) : this.transform({
      skew: [x, y],
      ox: cx,
      oy: cy
    }, true);
  },
  shear: function (lam, cx, cy) {
    return this.transform({
      shear: lam,
      ox: cx,
      oy: cy
    }, true);
  },
  // Map scale to transform
  scale: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({
      scale: x,
      ox: y,
      oy: cx
    }, true) : this.transform({
      scale: [x, y],
      ox: cx,
      oy: cy
    }, true);
  },
  // Map translate to transform
  translate: function (x, y) {
    return this.transform({
      translate: [x, y]
    }, true);
  },
  // Map relative translations to transform
  relative: function (x, y) {
    return this.transform({
      relative: [x, y]
    }, true);
  },
  // Map flip to transform
  flip: function (direction = 'both', origin = 'center') {
    if ('xybothtrue'.indexOf(direction) === -1) {
      origin = direction;
      direction = 'both';
    }
    return this.transform({
      flip: direction,
      origin: origin
    }, true);
  },
  // Opacity
  opacity: function (value) {
    return this.attr('opacity', value);
  }
});
registerMethods('radius', {
  // Add x and y radius
  radius: function (x, y = x) {
    const type = (this._element || this).type;
    return type === 'radialGradient' ? this.attr('r', new SVGNumber(x)) : this.rx(x).ry(y);
  }
});
registerMethods('Path', {
  // Get path length
  length: function () {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function (length) {
    return new Point(this.node.getPointAtLength(length));
  }
});
registerMethods(['Element', 'Runner'], {
  // Set font
  font: function (a, v) {
    if (typeof a === 'object') {
      for (v in a) this.font(v, a[v]);
      return this;
    }
    return a === 'leading' ? this.leading(v) : a === 'anchor' ? this.attr('text-anchor', v) : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style' ? this.attr('font-' + a, v) : this.attr(a, v);
  }
});

// Add events to elements
const methods = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel', 'contextmenu', 'wheel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel'].reduce(function (last, event) {
  // add event to Element
  const fn = function (f) {
    if (f === null) {
      this.off(event);
    } else {
      this.on(event, f);
    }
    return this;
  };
  last[event] = fn;
  return last;
}, {});
registerMethods('Element', methods);

// Reset all transformations
function untransform() {
  return this.attr('transform', null);
}

// merge the whole transformation chain into one matrix and returns it
function matrixify() {
  const matrix = (this.attr('transform') || ''
  // split transformations
  ).split(transforms).slice(0, -1).map(function (str) {
    // generate key => value pairs
    const kv = str.trim().split('(');
    return [kv[0], kv[1].split(delimiter).map(function (str) {
      return parseFloat(str);
    })];
  }).reverse()
  // merge every transformation into one matrix
  .reduce(function (matrix, transform) {
    if (transform[0] === 'matrix') {
      return matrix.lmultiply(Matrix.fromArray(transform[1]));
    }
    return matrix[transform[0]].apply(matrix, transform[1]);
  }, new Matrix());
  return matrix;
}

// add an element to another parent without changing the visual representation on the screen
function toParent(parent, i) {
  if (this === parent) return this;
  if (isDescriptive(this.node)) return this.addTo(parent, i);
  const ctm = this.screenCTM();
  const pCtm = parent.screenCTM().inverse();
  this.addTo(parent, i).untransform().transform(pCtm.multiply(ctm));
  return this;
}

// same as above with parent equals root-svg
function toRoot(i) {
  return this.toParent(this.root(), i);
}

// Add transformations
function transform(o, relative) {
  // Act as a getter if no object was passed
  if (o == null || typeof o === 'string') {
    const decomposed = new Matrix(this).decompose();
    return o == null ? decomposed : decomposed[o];
  }
  if (!Matrix.isMatrixLike(o)) {
    // Set the origin according to the defined transform
    o = {
      ...o,
      origin: getOrigin(o, this)
    };
  }

  // The user can pass a boolean, an Element or an Matrix or nothing
  const cleanRelative = relative === true ? this : relative || false;
  const result = new Matrix(cleanRelative).transform(o);
  return this.attr('transform', result);
}
registerMethods('Element', {
  untransform,
  matrixify,
  toParent,
  toRoot,
  transform
});

class Container extends Element {
  flatten() {
    this.each(function () {
      if (this instanceof Container) {
        return this.flatten().ungroup();
      }
    });
    return this;
  }
  ungroup(parent = this.parent(), index = parent.index(this)) {
    // when parent != this, we want append all elements to the end
    index = index === -1 ? parent.children().length : index;
    this.each(function (i, children) {
      // reverse each
      return children[children.length - i - 1].toParent(parent, index);
    });
    return this.remove();
  }
}
register(Container, 'Container');

class Defs extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('defs', node), attrs);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
register(Defs, 'Defs');

class Shape extends Element {}
register(Shape, 'Shape');

// Radius x value
function rx(rx) {
  return this.attr('rx', rx);
}

// Radius y value
function ry(ry) {
  return this.attr('ry', ry);
}

// Move over x-axis
function x$3(x) {
  return x == null ? this.cx() - this.rx() : this.cx(x + this.rx());
}

// Move over y-axis
function y$3(y) {
  return y == null ? this.cy() - this.ry() : this.cy(y + this.ry());
}

// Move by center over x-axis
function cx$1(x) {
  return this.attr('cx', x);
}

// Move by center over y-axis
function cy$1(y) {
  return this.attr('cy', y);
}

// Set width of element
function width$2(width) {
  return width == null ? this.rx() * 2 : this.rx(new SVGNumber(width).divide(2));
}

// Set height of element
function height$2(height) {
  return height == null ? this.ry() * 2 : this.ry(new SVGNumber(height).divide(2));
}

var circled = {
  __proto__: null,
  cx: cx$1,
  cy: cy$1,
  height: height$2,
  rx: rx,
  ry: ry,
  width: width$2,
  x: x$3,
  y: y$3
};

class Ellipse extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('ellipse', node), attrs);
  }
  size(width, height) {
    const p = proportionalSize(this, width, height);
    return this.rx(new SVGNumber(p.width).divide(2)).ry(new SVGNumber(p.height).divide(2));
  }
}
extend(Ellipse, circled);
registerMethods('Container', {
  // Create an ellipse
  ellipse: wrapWithAttrCheck(function (width = 0, height = width) {
    return this.put(new Ellipse()).size(width, height).move(0, 0);
  })
});
register(Ellipse, 'Ellipse');

class Fragment extends Dom {
  constructor(node = globals.document.createDocumentFragment()) {
    super(node);
  }

  // Import / Export raw xml
  xml(xmlOrFn, outerXML, ns) {
    if (typeof xmlOrFn === 'boolean') {
      ns = outerXML;
      outerXML = xmlOrFn;
      xmlOrFn = null;
    }

    // because this is a fragment we have to put all elements into a wrapper first
    // before we can get the innerXML from it
    if (xmlOrFn == null || typeof xmlOrFn === 'function') {
      const wrapper = new Dom(create('wrapper', ns));
      wrapper.add(this.node.cloneNode(true));
      return wrapper.xml(false, ns);
    }

    // Act as setter if we got a string
    return super.xml(xmlOrFn, false, ns);
  }
}
register(Fragment, 'Fragment');

function from(x, y) {
  return (this._element || this).type === 'radialGradient' ? this.attr({
    fx: new SVGNumber(x),
    fy: new SVGNumber(y)
  }) : this.attr({
    x1: new SVGNumber(x),
    y1: new SVGNumber(y)
  });
}
function to(x, y) {
  return (this._element || this).type === 'radialGradient' ? this.attr({
    cx: new SVGNumber(x),
    cy: new SVGNumber(y)
  }) : this.attr({
    x2: new SVGNumber(x),
    y2: new SVGNumber(y)
  });
}

var gradiented = {
  __proto__: null,
  from: from,
  to: to
};

class Gradient extends Container {
  constructor(type, attrs) {
    super(nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type), attrs);
  }

  // custom attr to handle transform
  attr(a, b, c) {
    if (a === 'transform') a = 'gradientTransform';
    return super.attr(a, b, c);
  }
  bbox() {
    return new Box();
  }
  targets() {
    return baseFind('svg [fill*=' + this.id() + ']');
  }

  // Alias string conversion to fill
  toString() {
    return this.url();
  }

  // Update gradient
  update(block) {
    // remove all stops
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }
    return this;
  }

  // Return the fill id
  url() {
    return 'url(#' + this.id() + ')';
  }
}
extend(Gradient, gradiented);
registerMethods({
  Container: {
    // Create gradient element in defs
    gradient(...args) {
      return this.defs().gradient(...args);
    }
  },
  // define gradient
  Defs: {
    gradient: wrapWithAttrCheck(function (type, block) {
      return this.put(new Gradient(type)).update(block);
    })
  }
});
register(Gradient, 'Gradient');

class Pattern extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('pattern', node), attrs);
  }

  // custom attr to handle transform
  attr(a, b, c) {
    if (a === 'transform') a = 'patternTransform';
    return super.attr(a, b, c);
  }
  bbox() {
    return new Box();
  }
  targets() {
    return baseFind('svg [fill*=' + this.id() + ']');
  }

  // Alias string conversion to fill
  toString() {
    return this.url();
  }

  // Update pattern by rebuilding
  update(block) {
    // remove content
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }
    return this;
  }

  // Return the fill id
  url() {
    return 'url(#' + this.id() + ')';
  }
}
registerMethods({
  Container: {
    // Create pattern element in defs
    pattern(...args) {
      return this.defs().pattern(...args);
    }
  },
  Defs: {
    pattern: wrapWithAttrCheck(function (width, height, block) {
      return this.put(new Pattern()).update(block).attr({
        x: 0,
        y: 0,
        width: width,
        height: height,
        patternUnits: 'userSpaceOnUse'
      });
    })
  }
});
register(Pattern, 'Pattern');

class Image extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('image', node), attrs);
  }

  // (re)load image
  load(url, callback) {
    if (!url) return this;
    const img = new globals.window.Image();
    on(img, 'load', function (e) {
      const p = this.parent(Pattern);

      // ensure image size
      if (this.width() === 0 && this.height() === 0) {
        this.size(img.width, img.height);
      }
      if (p instanceof Pattern) {
        // ensure pattern size if not set
        if (p.width() === 0 && p.height() === 0) {
          p.size(this.width(), this.height());
        }
      }
      if (typeof callback === 'function') {
        callback.call(this, e);
      }
    }, this);
    on(img, 'load error', function () {
      // dont forget to unbind memory leaking events
      off(img);
    });
    return this.attr('href', img.src = url, xlink);
  }
}
registerAttrHook(function (attr, val, _this) {
  // convert image fill and stroke to patterns
  if (attr === 'fill' || attr === 'stroke') {
    if (isImage.test(val)) {
      val = _this.root().defs().image(val);
    }
  }
  if (val instanceof Image) {
    val = _this.root().defs().pattern(0, 0, pattern => {
      pattern.add(val);
    });
  }
  return val;
});
registerMethods({
  Container: {
    // create image element, load image and set its size
    image: wrapWithAttrCheck(function (source, callback) {
      return this.put(new Image()).size(0, 0).load(source, callback);
    })
  }
});
register(Image, 'Image');

class PointArray extends SVGArray {
  // Get bounding box of points
  bbox() {
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    this.forEach(function (el) {
      maxX = Math.max(el[0], maxX);
      maxY = Math.max(el[1], maxY);
      minX = Math.min(el[0], minX);
      minY = Math.min(el[1], minY);
    });
    return new Box(minX, minY, maxX - minX, maxY - minY);
  }

  // Move point string
  move(x, y) {
    const box = this.bbox();

    // get relative offset
    x -= box.x;
    y -= box.y;

    // move every point
    if (!isNaN(x) && !isNaN(y)) {
      for (let i = this.length - 1; i >= 0; i--) {
        this[i] = [this[i][0] + x, this[i][1] + y];
      }
    }
    return this;
  }

  // Parse point string and flat array
  parse(array = [0, 0]) {
    const points = [];

    // if it is an array, we flatten it and therefore clone it to 1 depths
    if (array instanceof Array) {
      array = Array.prototype.concat.apply([], array);
    } else {
      // Else, it is considered as a string
      // parse points
      array = array.trim().split(delimiter).map(parseFloat);
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop();

    // wrap points in two-tuples
    for (let i = 0, len = array.length; i < len; i = i + 2) {
      points.push([array[i], array[i + 1]]);
    }
    return points;
  }

  // Resize poly string
  size(width, height) {
    let i;
    const box = this.bbox();

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      if (box.width) this[i][0] = (this[i][0] - box.x) * width / box.width + box.x;
      if (box.height) this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
    }
    return this;
  }

  // Convert array to line object
  toLine() {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    };
  }

  // Convert array to string
  toString() {
    const array = [];
    // convert to a poly point string
    for (let i = 0, il = this.length; i < il; i++) {
      array.push(this[i].join(','));
    }
    return array.join(' ');
  }
  transform(m) {
    return this.clone().transformO(m);
  }

  // transform points with matrix (similar to Point.transform)
  transformO(m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m);
    }
    for (let i = this.length; i--;) {
      // Perform the matrix multiplication
      const [x, y] = this[i];
      this[i][0] = m.a * x + m.c * y + m.e;
      this[i][1] = m.b * x + m.d * y + m.f;
    }
    return this;
  }
}

const MorphArray = PointArray;

// Move by left top corner over x-axis
function x$2(x) {
  return x == null ? this.bbox().x : this.move(x, this.bbox().y);
}

// Move by left top corner over y-axis
function y$2(y) {
  return y == null ? this.bbox().y : this.move(this.bbox().x, y);
}

// Set width of element
function width$1(width) {
  const b = this.bbox();
  return width == null ? b.width : this.size(width, b.height);
}

// Set height of element
function height$1(height) {
  const b = this.bbox();
  return height == null ? b.height : this.size(b.width, height);
}

var pointed = {
  __proto__: null,
  MorphArray: MorphArray,
  height: height$1,
  width: width$1,
  x: x$2,
  y: y$2
};

class Line extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('line', node), attrs);
  }

  // Get array
  array() {
    return new PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
  }

  // Move by left top corner
  move(x, y) {
    return this.attr(this.array().move(x, y).toLine());
  }

  // Overwrite native plot() method
  plot(x1, y1, x2, y2) {
    if (x1 == null) {
      return this.array();
    } else if (typeof y1 !== 'undefined') {
      x1 = {
        x1,
        y1,
        x2,
        y2
      };
    } else {
      x1 = new PointArray(x1).toLine();
    }
    return this.attr(x1);
  }

  // Set element size to given width and height
  size(width, height) {
    const p = proportionalSize(this, width, height);
    return this.attr(this.array().size(p.width, p.height).toLine());
  }
}
extend(Line, pointed);
registerMethods({
  Container: {
    // Create a line element
    line: wrapWithAttrCheck(function (...args) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a PointArray
      return Line.prototype.plot.apply(this.put(new Line()), args[0] != null ? args : [0, 0, 0, 0]);
    })
  }
});
register(Line, 'Line');

class Marker extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('marker', node), attrs);
  }

  // Set height of element
  height(height) {
    return this.attr('markerHeight', height);
  }
  orient(orient) {
    return this.attr('orient', orient);
  }

  // Set marker refX and refY
  ref(x, y) {
    return this.attr('refX', x).attr('refY', y);
  }

  // Return the fill id
  toString() {
    return 'url(#' + this.id() + ')';
  }

  // Update marker
  update(block) {
    // remove all content
    this.clear();

    // invoke passed block
    if (typeof block === 'function') {
      block.call(this, this);
    }
    return this;
  }

  // Set width of element
  width(width) {
    return this.attr('markerWidth', width);
  }
}
registerMethods({
  Container: {
    marker(...args) {
      // Create marker element in defs
      return this.defs().marker(...args);
    }
  },
  Defs: {
    // Create marker
    marker: wrapWithAttrCheck(function (width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new Marker()).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
    })
  },
  marker: {
    // Create and attach markers
    marker(marker, width, height, block) {
      let attr = ['marker'];

      // Build attribute name
      if (marker !== 'all') attr.push(marker);
      attr = attr.join('-');

      // Set marker attribute
      marker = arguments[1] instanceof Marker ? arguments[1] : this.defs().marker(width, height, block);
      return this.attr(attr, marker);
    }
  }
});
register(Marker, 'Marker');

/***
Base Class
==========
The base stepper class that will be
***/

function makeSetterGetter(k, f) {
  return function (v) {
    if (v == null) return this[k];
    this[k] = v;
    if (f) f.call(this);
    return this;
  };
}
const easing = {
  '-': function (pos) {
    return pos;
  },
  '<>': function (pos) {
    return -Math.cos(pos * Math.PI) / 2 + 0.5;
  },
  '>': function (pos) {
    return Math.sin(pos * Math.PI / 2);
  },
  '<': function (pos) {
    return -Math.cos(pos * Math.PI / 2) + 1;
  },
  bezier: function (x1, y1, x2, y2) {
    // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
    return function (t) {
      if (t < 0) {
        if (x1 > 0) {
          return y1 / x1 * t;
        } else if (x2 > 0) {
          return y2 / x2 * t;
        } else {
          return 0;
        }
      } else if (t > 1) {
        if (x2 < 1) {
          return (1 - y2) / (1 - x2) * t + (y2 - x2) / (1 - x2);
        } else if (x1 < 1) {
          return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1);
        } else {
          return 1;
        }
      } else {
        return 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3;
      }
    };
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function (steps, stepPosition = 'end') {
    // deal with "jump-" prefix
    stepPosition = stepPosition.split('-').reverse()[0];
    let jumps = steps;
    if (stepPosition === 'none') {
      --jumps;
    } else if (stepPosition === 'both') {
      ++jumps;
    }

    // The beforeFlag is essentially useless
    return (t, beforeFlag = false) => {
      // Step is called currentStep in referenced url
      let step = Math.floor(t * steps);
      const jumping = t * step % 1 === 0;
      if (stepPosition === 'start' || stepPosition === 'both') {
        ++step;
      }
      if (beforeFlag && jumping) {
        --step;
      }
      if (t >= 0 && step < 0) {
        step = 0;
      }
      if (t <= 1 && step > jumps) {
        step = jumps;
      }
      return step / jumps;
    };
  }
};
class Stepper {
  done() {
    return false;
  }
}

/***
Easing Functions
================
***/

class Ease extends Stepper {
  constructor(fn = timeline.ease) {
    super();
    this.ease = easing[fn] || fn;
  }
  step(from, to, pos) {
    if (typeof from !== 'number') {
      return pos < 1 ? from : to;
    }
    return from + (to - from) * this.ease(pos);
  }
}

/***
Controller Types
================
***/

class Controller extends Stepper {
  constructor(fn) {
    super();
    this.stepper = fn;
  }
  done(c) {
    return c.done;
  }
  step(current, target, dt, c) {
    return this.stepper(current, target, dt, c);
  }
}
function recalculate() {
  // Apply the default parameters
  const duration = (this._duration || 500) / 1000;
  const overshoot = this._overshoot || 0;

  // Calculate the PID natural response
  const eps = 1e-10;
  const pi = Math.PI;
  const os = Math.log(overshoot / 100 + eps);
  const zeta = -os / Math.sqrt(pi * pi + os * os);
  const wn = 3.9 / (zeta * duration);

  // Calculate the Spring values
  this.d = 2 * zeta * wn;
  this.k = wn * wn;
}
class Spring extends Controller {
  constructor(duration = 500, overshoot = 0) {
    super();
    this.duration(duration).overshoot(overshoot);
  }
  step(current, target, dt, c) {
    if (typeof current === 'string') return current;
    c.done = dt === Infinity;
    if (dt === Infinity) return target;
    if (dt === 0) return current;
    if (dt > 100) dt = 16;
    dt /= 1000;

    // Get the previous velocity
    const velocity = c.velocity || 0;

    // Apply the control to get the new position and store it
    const acceleration = -this.d * velocity - this.k * (current - target);
    const newPosition = current + velocity * dt + acceleration * dt * dt / 2;

    // Store the velocity
    c.velocity = velocity + acceleration * dt;

    // Figure out if we have converged, and if so, pass the value
    c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
    return c.done ? target : newPosition;
  }
}
extend(Spring, {
  duration: makeSetterGetter('_duration', recalculate),
  overshoot: makeSetterGetter('_overshoot', recalculate)
});
class PID extends Controller {
  constructor(p = 0.1, i = 0.01, d = 0, windup = 1000) {
    super();
    this.p(p).i(i).d(d).windup(windup);
  }
  step(current, target, dt, c) {
    if (typeof current === 'string') return current;
    c.done = dt === Infinity;
    if (dt === Infinity) return target;
    if (dt === 0) return current;
    const p = target - current;
    let i = (c.integral || 0) + p * dt;
    const d = (p - (c.error || 0)) / dt;
    const windup = this._windup;

    // antiwindup
    if (windup !== false) {
      i = Math.max(-windup, Math.min(i, windup));
    }
    c.error = p;
    c.integral = i;
    c.done = Math.abs(p) < 0.001;
    return c.done ? target : current + (this.P * p + this.I * i + this.D * d);
  }
}
extend(PID, {
  windup: makeSetterGetter('_windup'),
  p: makeSetterGetter('P'),
  i: makeSetterGetter('I'),
  d: makeSetterGetter('D')
});

const segmentParameters = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0
};
const pathHandlers = {
  M: function (c, p, p0) {
    p.x = p0.x = c[0];
    p.y = p0.y = c[1];
    return ['M', p.x, p.y];
  },
  L: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return ['L', c[0], c[1]];
  },
  H: function (c, p) {
    p.x = c[0];
    return ['H', c[0]];
  },
  V: function (c, p) {
    p.y = c[0];
    return ['V', c[0]];
  },
  C: function (c, p) {
    p.x = c[4];
    p.y = c[5];
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]];
  },
  S: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return ['S', c[0], c[1], c[2], c[3]];
  },
  Q: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return ['Q', c[0], c[1], c[2], c[3]];
  },
  T: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return ['T', c[0], c[1]];
  },
  Z: function (c, p, p0) {
    p.x = p0.x;
    p.y = p0.y;
    return ['Z'];
  },
  A: function (c, p) {
    p.x = c[5];
    p.y = c[6];
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
  }
};
const mlhvqtcsaz = 'mlhvqtcsaz'.split('');
for (let i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
  pathHandlers[mlhvqtcsaz[i]] = function (i) {
    return function (c, p, p0) {
      if (i === 'H') c[0] = c[0] + p.x;else if (i === 'V') c[0] = c[0] + p.y;else if (i === 'A') {
        c[5] = c[5] + p.x;
        c[6] = c[6] + p.y;
      } else {
        for (let j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x);
        }
      }
      return pathHandlers[i](c, p, p0);
    };
  }(mlhvqtcsaz[i].toUpperCase());
}
function makeAbsolut(parser) {
  const command = parser.segment[0];
  return pathHandlers[command](parser.segment.slice(1), parser.p, parser.p0);
}
function segmentComplete(parser) {
  return parser.segment.length && parser.segment.length - 1 === segmentParameters[parser.segment[0].toUpperCase()];
}
function startNewSegment(parser, token) {
  parser.inNumber && finalizeNumber(parser, false);
  const pathLetter = isPathLetter.test(token);
  if (pathLetter) {
    parser.segment = [token];
  } else {
    const lastCommand = parser.lastCommand;
    const small = lastCommand.toLowerCase();
    const isSmall = lastCommand === small;
    parser.segment = [small === 'm' ? isSmall ? 'l' : 'L' : lastCommand];
  }
  parser.inSegment = true;
  parser.lastCommand = parser.segment[0];
  return pathLetter;
}
function finalizeNumber(parser, inNumber) {
  if (!parser.inNumber) throw new Error('Parser Error');
  parser.number && parser.segment.push(parseFloat(parser.number));
  parser.inNumber = inNumber;
  parser.number = '';
  parser.pointSeen = false;
  parser.hasExponent = false;
  if (segmentComplete(parser)) {
    finalizeSegment(parser);
  }
}
function finalizeSegment(parser) {
  parser.inSegment = false;
  if (parser.absolute) {
    parser.segment = makeAbsolut(parser);
  }
  parser.segments.push(parser.segment);
}
function isArcFlag(parser) {
  if (!parser.segment.length) return false;
  const isArc = parser.segment[0].toUpperCase() === 'A';
  const length = parser.segment.length;
  return isArc && (length === 4 || length === 5);
}
function isExponential(parser) {
  return parser.lastToken.toUpperCase() === 'E';
}
const pathDelimiters = new Set([' ', ',', '\t', '\n', '\r', '\f']);
function pathParser(d, toAbsolute = true) {
  let index = 0;
  let token = '';
  const parser = {
    segment: [],
    inNumber: false,
    number: '',
    lastToken: '',
    inSegment: false,
    segments: [],
    pointSeen: false,
    hasExponent: false,
    absolute: toAbsolute,
    p0: new Point(),
    p: new Point()
  };
  while (parser.lastToken = token, token = d.charAt(index++)) {
    if (!parser.inSegment) {
      if (startNewSegment(parser, token)) {
        continue;
      }
    }
    if (token === '.') {
      if (parser.pointSeen || parser.hasExponent) {
        finalizeNumber(parser, false);
        --index;
        continue;
      }
      parser.inNumber = true;
      parser.pointSeen = true;
      parser.number += token;
      continue;
    }
    if (!isNaN(parseInt(token))) {
      if (parser.number === '0' || isArcFlag(parser)) {
        parser.inNumber = true;
        parser.number = token;
        finalizeNumber(parser, true);
        continue;
      }
      parser.inNumber = true;
      parser.number += token;
      continue;
    }
    if (pathDelimiters.has(token)) {
      if (parser.inNumber) {
        finalizeNumber(parser, false);
      }
      continue;
    }
    if (token === '-' || token === '+') {
      if (parser.inNumber && !isExponential(parser)) {
        finalizeNumber(parser, false);
        --index;
        continue;
      }
      parser.number += token;
      parser.inNumber = true;
      continue;
    }
    if (token.toUpperCase() === 'E') {
      parser.number += token;
      parser.hasExponent = true;
      continue;
    }
    if (isPathLetter.test(token)) {
      if (parser.inNumber) {
        finalizeNumber(parser, false);
      } else if (!segmentComplete(parser)) {
        throw new Error('parser Error');
      } else {
        finalizeSegment(parser);
      }
      --index;
    }
  }
  if (parser.inNumber) {
    finalizeNumber(parser, false);
  }
  if (parser.inSegment && segmentComplete(parser)) {
    finalizeSegment(parser);
  }
  return parser.segments;
}

function arrayToString(a) {
  let s = '';
  for (let i = 0, il = a.length; i < il; i++) {
    s += a[i][0];
    if (a[i][1] != null) {
      s += a[i][1];
      if (a[i][2] != null) {
        s += ' ';
        s += a[i][2];
        if (a[i][3] != null) {
          s += ' ';
          s += a[i][3];
          s += ' ';
          s += a[i][4];
          if (a[i][5] != null) {
            s += ' ';
            s += a[i][5];
            s += ' ';
            s += a[i][6];
            if (a[i][7] != null) {
              s += ' ';
              s += a[i][7];
            }
          }
        }
      }
    }
  }
  return s + ' ';
}
class PathArray extends SVGArray {
  // Get bounding box of path
  bbox() {
    parser().path.setAttribute('d', this.toString());
    return new Box(parser.nodes.path.getBBox());
  }

  // Move path string
  move(x, y) {
    // get bounding box of current situation
    const box = this.bbox();

    // get relative offset
    x -= box.x;
    y -= box.y;
    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (let l, i = this.length - 1; i >= 0; i--) {
        l = this[i][0];
        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] += x;
          this[i][2] += y;
        } else if (l === 'H') {
          this[i][1] += x;
        } else if (l === 'V') {
          this[i][1] += y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] += x;
          this[i][2] += y;
          this[i][3] += x;
          this[i][4] += y;
          if (l === 'C') {
            this[i][5] += x;
            this[i][6] += y;
          }
        } else if (l === 'A') {
          this[i][6] += x;
          this[i][7] += y;
        }
      }
    }
    return this;
  }

  // Absolutize and parse path to array
  parse(d = 'M0 0') {
    if (Array.isArray(d)) {
      d = Array.prototype.concat.apply([], d).toString();
    }
    return pathParser(d);
  }

  // Resize path string
  size(width, height) {
    // get bounding box of current situation
    const box = this.bbox();
    let i, l;

    // If the box width or height is 0 then we ignore
    // transformations on the respective axis
    box.width = box.width === 0 ? 1 : box.width;
    box.height = box.height === 0 ? 1 : box.height;

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      l = this[i][0];
      if (l === 'M' || l === 'L' || l === 'T') {
        this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
        this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
      } else if (l === 'H') {
        this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
      } else if (l === 'V') {
        this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
        this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
        this[i][3] = (this[i][3] - box.x) * width / box.width + box.x;
        this[i][4] = (this[i][4] - box.y) * height / box.height + box.y;
        if (l === 'C') {
          this[i][5] = (this[i][5] - box.x) * width / box.width + box.x;
          this[i][6] = (this[i][6] - box.y) * height / box.height + box.y;
        }
      } else if (l === 'A') {
        // resize radii
        this[i][1] = this[i][1] * width / box.width;
        this[i][2] = this[i][2] * height / box.height;

        // move position values
        this[i][6] = (this[i][6] - box.x) * width / box.width + box.x;
        this[i][7] = (this[i][7] - box.y) * height / box.height + box.y;
      }
    }
    return this;
  }

  // Convert array to string
  toString() {
    return arrayToString(this);
  }
}

const getClassForType = value => {
  const type = typeof value;
  if (type === 'number') {
    return SVGNumber;
  } else if (type === 'string') {
    if (Color.isColor(value)) {
      return Color;
    } else if (delimiter.test(value)) {
      return isPathLetter.test(value) ? PathArray : SVGArray;
    } else if (numberAndUnit.test(value)) {
      return SVGNumber;
    } else {
      return NonMorphable;
    }
  } else if (morphableTypes.indexOf(value.constructor) > -1) {
    return value.constructor;
  } else if (Array.isArray(value)) {
    return SVGArray;
  } else if (type === 'object') {
    return ObjectBag;
  } else {
    return NonMorphable;
  }
};
class Morphable {
  constructor(stepper) {
    this._stepper = stepper || new Ease('-');
    this._from = null;
    this._to = null;
    this._type = null;
    this._context = null;
    this._morphObj = null;
  }
  at(pos) {
    return this._morphObj.morph(this._from, this._to, pos, this._stepper, this._context);
  }
  done() {
    const complete = this._context.map(this._stepper.done).reduce(function (last, curr) {
      return last && curr;
    }, true);
    return complete;
  }
  from(val) {
    if (val == null) {
      return this._from;
    }
    this._from = this._set(val);
    return this;
  }
  stepper(stepper) {
    if (stepper == null) return this._stepper;
    this._stepper = stepper;
    return this;
  }
  to(val) {
    if (val == null) {
      return this._to;
    }
    this._to = this._set(val);
    return this;
  }
  type(type) {
    // getter
    if (type == null) {
      return this._type;
    }

    // setter
    this._type = type;
    return this;
  }
  _set(value) {
    if (!this._type) {
      this.type(getClassForType(value));
    }
    let result = new this._type(value);
    if (this._type === Color) {
      result = this._to ? result[this._to[4]]() : this._from ? result[this._from[4]]() : result;
    }
    if (this._type === ObjectBag) {
      result = this._to ? result.align(this._to) : this._from ? result.align(this._from) : result;
    }
    result = result.toConsumable();
    this._morphObj = this._morphObj || new this._type();
    this._context = this._context || Array.apply(null, Array(result.length)).map(Object).map(function (o) {
      o.done = true;
      return o;
    });
    return result;
  }
}
class NonMorphable {
  constructor(...args) {
    this.init(...args);
  }
  init(val) {
    val = Array.isArray(val) ? val[0] : val;
    this.value = val;
    return this;
  }
  toArray() {
    return [this.value];
  }
  valueOf() {
    return this.value;
  }
}
class TransformBag {
  constructor(...args) {
    this.init(...args);
  }
  init(obj) {
    if (Array.isArray(obj)) {
      obj = {
        scaleX: obj[0],
        scaleY: obj[1],
        shear: obj[2],
        rotate: obj[3],
        translateX: obj[4],
        translateY: obj[5],
        originX: obj[6],
        originY: obj[7]
      };
    }
    Object.assign(this, TransformBag.defaults, obj);
    return this;
  }
  toArray() {
    const v = this;
    return [v.scaleX, v.scaleY, v.shear, v.rotate, v.translateX, v.translateY, v.originX, v.originY];
  }
}
TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const sortByKey = (a, b) => {
  return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
};
class ObjectBag {
  constructor(...args) {
    this.init(...args);
  }
  align(other) {
    const values = this.values;
    for (let i = 0, il = values.length; i < il; ++i) {
      // If the type is the same we only need to check if the color is in the correct format
      if (values[i + 1] === other[i + 1]) {
        if (values[i + 1] === Color && other[i + 7] !== values[i + 7]) {
          const space = other[i + 7];
          const color = new Color(this.values.splice(i + 3, 5))[space]().toArray();
          this.values.splice(i + 3, 0, ...color);
        }
        i += values[i + 2] + 2;
        continue;
      }
      if (!other[i + 1]) {
        return this;
      }

      // The types differ, so we overwrite the new type with the old one
      // And initialize it with the types default (e.g. black for color or 0 for number)
      const defaultObject = new other[i + 1]().toArray();

      // Than we fix the values array
      const toDelete = values[i + 2] + 3;
      values.splice(i, toDelete, other[i], other[i + 1], other[i + 2], ...defaultObject);
      i += values[i + 2] + 2;
    }
    return this;
  }
  init(objOrArr) {
    this.values = [];
    if (Array.isArray(objOrArr)) {
      this.values = objOrArr.slice();
      return;
    }
    objOrArr = objOrArr || {};
    const entries = [];
    for (const i in objOrArr) {
      const Type = getClassForType(objOrArr[i]);
      const val = new Type(objOrArr[i]).toArray();
      entries.push([i, Type, val.length, ...val]);
    }
    entries.sort(sortByKey);
    this.values = entries.reduce((last, curr) => last.concat(curr), []);
    return this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const obj = {};
    const arr = this.values;

    // for (var i = 0, len = arr.length; i < len; i += 2) {
    while (arr.length) {
      const key = arr.shift();
      const Type = arr.shift();
      const num = arr.shift();
      const values = arr.splice(0, num);
      obj[key] = new Type(values); // .valueOf()
    }
    return obj;
  }
}
const morphableTypes = [NonMorphable, TransformBag, ObjectBag];
function registerMorphableType(type = []) {
  morphableTypes.push(...[].concat(type));
}
function makeMorphable() {
  extend(morphableTypes, {
    to(val) {
      return new Morphable().type(this.constructor).from(this.toArray()) // this.valueOf())
      .to(val);
    },
    fromArray(arr) {
      this.init(arr);
      return this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(from, to, pos, stepper, context) {
      const mapper = function (i, index) {
        return stepper.step(i, to[index], pos, context[index], context);
      };
      return this.fromArray(from.map(mapper));
    }
  });
}

class Path extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('path', node), attrs);
  }

  // Get array
  array() {
    return this._array || (this._array = new PathArray(this.attr('d')));
  }

  // Clear array cache
  clear() {
    delete this._array;
    return this;
  }

  // Set height of element
  height(height) {
    return height == null ? this.bbox().height : this.size(this.bbox().width, height);
  }

  // Move by left top corner
  move(x, y) {
    return this.attr('d', this.array().move(x, y));
  }

  // Plot new path
  plot(d) {
    return d == null ? this.array() : this.clear().attr('d', typeof d === 'string' ? d : this._array = new PathArray(d));
  }

  // Set element size to given width and height
  size(width, height) {
    const p = proportionalSize(this, width, height);
    return this.attr('d', this.array().size(p.width, p.height));
  }

  // Set width of element
  width(width) {
    return width == null ? this.bbox().width : this.size(width, this.bbox().height);
  }

  // Move by left top corner over x-axis
  x(x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y);
  }

  // Move by left top corner over y-axis
  y(y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y);
  }
}

// Define morphable array
Path.prototype.MorphArray = PathArray;

// Add parent method
registerMethods({
  Container: {
    // Create a wrapped path element
    path: wrapWithAttrCheck(function (d) {
      // make sure plot is called as a setter
      return this.put(new Path()).plot(d || new PathArray());
    })
  }
});
register(Path, 'Path');

// Get array
function array() {
  return this._array || (this._array = new PointArray(this.attr('points')));
}

// Clear array cache
function clear() {
  delete this._array;
  return this;
}

// Move by left top corner
function move$2(x, y) {
  return this.attr('points', this.array().move(x, y));
}

// Plot new path
function plot(p) {
  return p == null ? this.array() : this.clear().attr('points', typeof p === 'string' ? p : this._array = new PointArray(p));
}

// Set element size to given width and height
function size$1(width, height) {
  const p = proportionalSize(this, width, height);
  return this.attr('points', this.array().size(p.width, p.height));
}

var poly = {
  __proto__: null,
  array: array,
  clear: clear,
  move: move$2,
  plot: plot,
  size: size$1
};

class Polygon extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('polygon', node), attrs);
  }
}
registerMethods({
  Container: {
    // Create a wrapped polygon element
    polygon: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polygon()).plot(p || new PointArray());
    })
  }
});
extend(Polygon, pointed);
extend(Polygon, poly);
register(Polygon, 'Polygon');

class Polyline extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('polyline', node), attrs);
  }
}
registerMethods({
  Container: {
    // Create a wrapped polygon element
    polyline: wrapWithAttrCheck(function (p) {
      // make sure plot is called as a setter
      return this.put(new Polyline()).plot(p || new PointArray());
    })
  }
});
extend(Polyline, pointed);
extend(Polyline, poly);
register(Polyline, 'Polyline');

class Rect extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('rect', node), attrs);
  }
}
extend(Rect, {
  rx,
  ry
});
registerMethods({
  Container: {
    // Create a rect element
    rect: wrapWithAttrCheck(function (width, height) {
      return this.put(new Rect()).size(width, height);
    })
  }
});
register(Rect, 'Rect');

class Queue {
  constructor() {
    this._first = null;
    this._last = null;
  }

  // Shows us the first item in the list
  first() {
    return this._first && this._first.value;
  }

  // Shows us the last item in the list
  last() {
    return this._last && this._last.value;
  }
  push(value) {
    // An item stores an id and the provided value
    const item = typeof value.next !== 'undefined' ? value : {
      value: value,
      next: null,
      prev: null
    };

    // Deal with the queue being empty or populated
    if (this._last) {
      item.prev = this._last;
      this._last.next = item;
      this._last = item;
    } else {
      this._last = item;
      this._first = item;
    }

    // Return the current item
    return item;
  }

  // Removes the item that was returned from the push
  remove(item) {
    // Relink the previous item
    if (item.prev) item.prev.next = item.next;
    if (item.next) item.next.prev = item.prev;
    if (item === this._last) this._last = item.prev;
    if (item === this._first) this._first = item.next;

    // Invalidate item
    item.prev = null;
    item.next = null;
  }
  shift() {
    // Check if we have a value
    const remove = this._first;
    if (!remove) return null;

    // If we do, remove it and relink things
    this._first = remove.next;
    if (this._first) this._first.prev = null;
    this._last = this._first ? this._last : null;
    return remove.value;
  }
}

const Animator = {
  nextDraw: null,
  frames: new Queue(),
  timeouts: new Queue(),
  immediates: new Queue(),
  timer: () => globals.window.performance || globals.window.Date,
  transforms: [],
  frame(fn) {
    // Store the node
    const node = Animator.frames.push({
      run: fn
    });

    // Request an animation frame if we don't have one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }

    // Return the node so we can remove it easily
    return node;
  },
  timeout(fn, delay) {
    delay = delay || 0;

    // Work out when the event should fire
    const time = Animator.timer().now() + delay;

    // Add the timeout to the end of the queue
    const node = Animator.timeouts.push({
      run: fn,
      time: time
    });

    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }
    return node;
  },
  immediate(fn) {
    // Add the immediate fn to the end of the queue
    const node = Animator.immediates.push(fn);
    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
    }
    return node;
  },
  cancelFrame(node) {
    node != null && Animator.frames.remove(node);
  },
  clearTimeout(node) {
    node != null && Animator.timeouts.remove(node);
  },
  cancelImmediate(node) {
    node != null && Animator.immediates.remove(node);
  },
  _draw(now) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    let nextTimeout = null;
    const lastTimeout = Animator.timeouts.last();
    while (nextTimeout = Animator.timeouts.shift()) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run();
      } else {
        Animator.timeouts.push(nextTimeout);
      }

      // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) break;
    }

    // Run all of the animation frames
    let nextFrame = null;
    const lastFrame = Animator.frames.last();
    while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
      nextFrame.run(now);
    }
    let nextImmediate = null;
    while (nextImmediate = Animator.immediates.shift()) {
      nextImmediate();
    }

    // If we have remaining timeouts or frames, draw until we don't anymore
    Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first() ? globals.window.requestAnimationFrame(Animator._draw) : null;
  }
};

const makeSchedule = function (runnerInfo) {
  const start = runnerInfo.start;
  const duration = runnerInfo.runner.duration();
  const end = start + duration;
  return {
    start: start,
    duration: duration,
    end: end,
    runner: runnerInfo.runner
  };
};
const defaultSource = function () {
  const w = globals.window;
  return (w.performance || w.Date).now();
};
class Timeline extends EventTarget {
  // Construct a new timeline on the given element
  constructor(timeSource = defaultSource) {
    super();
    this._timeSource = timeSource;

    // terminate resets all variables to their initial state
    this.terminate();
  }
  active() {
    return !!this._nextFrame;
  }
  finish() {
    // Go to end and pause
    this.time(this.getEndTimeOfTimeline() + 1);
    return this.pause();
  }

  // Calculates the end of the timeline
  getEndTime() {
    const lastRunnerInfo = this.getLastRunnerInfo();
    const lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
    const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
    return lastStartTime + lastDuration;
  }
  getEndTimeOfTimeline() {
    const endTimes = this._runners.map(i => i.start + i.runner.duration());
    return Math.max(0, ...endTimes);
  }
  getLastRunnerInfo() {
    return this.getRunnerInfoById(this._lastRunnerId);
  }
  getRunnerInfoById(id) {
    return this._runners[this._runnerIds.indexOf(id)] || null;
  }
  pause() {
    this._paused = true;
    return this._continue();
  }
  persist(dtOrForever) {
    if (dtOrForever == null) return this._persist;
    this._persist = dtOrForever;
    return this;
  }
  play() {
    // Now make sure we are not paused and continue the animation
    this._paused = false;
    return this.updateTime()._continue();
  }
  reverse(yes) {
    const currentSpeed = this.speed();
    if (yes == null) return this.speed(-currentSpeed);
    const positive = Math.abs(currentSpeed);
    return this.speed(yes ? -positive : positive);
  }

  // schedules a runner on the timeline
  schedule(runner, delay, when) {
    if (runner == null) {
      return this._runners.map(makeSchedule);
    }

    // The start time for the next animation can either be given explicitly,
    // derived from the current timeline time or it can be relative to the
    // last start time to chain animations directly

    let absoluteStartTime = 0;
    const endTime = this.getEndTime();
    delay = delay || 0;

    // Work out when to start the animation
    if (when == null || when === 'last' || when === 'after') {
      // Take the last time and increment
      absoluteStartTime = endTime;
    } else if (when === 'absolute' || when === 'start') {
      absoluteStartTime = delay;
      delay = 0;
    } else if (when === 'now') {
      absoluteStartTime = this._time;
    } else if (when === 'relative') {
      const runnerInfo = this.getRunnerInfoById(runner.id);
      if (runnerInfo) {
        absoluteStartTime = runnerInfo.start + delay;
        delay = 0;
      }
    } else if (when === 'with-last') {
      const lastRunnerInfo = this.getLastRunnerInfo();
      const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
      absoluteStartTime = lastStartTime;
    } else {
      throw new Error('Invalid value for the "when" parameter');
    }

    // Manage runner
    runner.unschedule();
    runner.timeline(this);
    const persist = runner.persist();
    const runnerInfo = {
      persist: persist === null ? this._persist : persist,
      start: absoluteStartTime + delay,
      runner
    };
    this._lastRunnerId = runner.id;
    this._runners.push(runnerInfo);
    this._runners.sort((a, b) => a.start - b.start);
    this._runnerIds = this._runners.map(info => info.runner.id);
    this.updateTime()._continue();
    return this;
  }
  seek(dt) {
    return this.time(this._time + dt);
  }
  source(fn) {
    if (fn == null) return this._timeSource;
    this._timeSource = fn;
    return this;
  }
  speed(speed) {
    if (speed == null) return this._speed;
    this._speed = speed;
    return this;
  }
  stop() {
    // Go to start and pause
    this.time(0);
    return this.pause();
  }
  time(time) {
    if (time == null) return this._time;
    this._time = time;
    return this._continue(true);
  }

  // Remove the runner from this timeline
  unschedule(runner) {
    const index = this._runnerIds.indexOf(runner.id);
    if (index < 0) return this;
    this._runners.splice(index, 1);
    this._runnerIds.splice(index, 1);
    runner.timeline(null);
    return this;
  }

  // Makes sure, that after pausing the time doesn't jump
  updateTime() {
    if (!this.active()) {
      this._lastSourceTime = this._timeSource();
    }
    return this;
  }

  // Checks if we are running and continues the animation
  _continue(immediateStep = false) {
    Animator.cancelFrame(this._nextFrame);
    this._nextFrame = null;
    if (immediateStep) return this._stepImmediate();
    if (this._paused) return this;
    this._nextFrame = Animator.frame(this._step);
    return this;
  }
  _stepFn(immediateStep = false) {
    // Get the time delta from the last time and update the time
    const time = this._timeSource();
    let dtSource = time - this._lastSourceTime;
    if (immediateStep) dtSource = 0;
    const dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
    this._lastSourceTime = time;

    // Only update the time if we use the timeSource.
    // Otherwise use the current time
    if (!immediateStep) {
      // Update the time
      this._time += dtTime;
      this._time = this._time < 0 ? 0 : this._time;
    }
    this._lastStepTime = this._time;
    this.fire('time', this._time);

    // This is for the case that the timeline was seeked so that the time
    // is now before the startTime of the runner. That is why we need to set
    // the runner to position 0

    // FIXME:
    // However, resetting in insertion order leads to bugs. Considering the case,
    // where 2 runners change the same attribute but in different times,
    // resetting both of them will lead to the case where the later defined
    // runner always wins the reset even if the other runner started earlier
    // and therefore should win the attribute battle
    // this can be solved by resetting them backwards
    for (let k = this._runners.length; k--;) {
      // Get and run the current runner and ignore it if its inactive
      const runnerInfo = this._runners[k];
      const runner = runnerInfo.runner;

      // Make sure that we give the actual difference
      // between runner start time and now
      const dtToStart = this._time - runnerInfo.start;

      // Dont run runner if not started yet
      // and try to reset it
      if (dtToStart <= 0) {
        runner.reset();
      }
    }

    // Run all of the runners directly
    let runnersLeft = false;
    for (let i = 0, len = this._runners.length; i < len; i++) {
      // Get and run the current runner and ignore it if its inactive
      const runnerInfo = this._runners[i];
      const runner = runnerInfo.runner;
      let dt = dtTime;

      // Make sure that we give the actual difference
      // between runner start time and now
      const dtToStart = this._time - runnerInfo.start;

      // Dont run runner if not started yet
      if (dtToStart <= 0) {
        runnersLeft = true;
        continue;
      } else if (dtToStart < dt) {
        // Adjust dt to make sure that animation is on point
        dt = dtToStart;
      }
      if (!runner.active()) continue;

      // If this runner is still going, signal that we need another animation
      // frame, otherwise, remove the completed runner
      const finished = runner.step(dt).done;
      if (!finished) {
        runnersLeft = true;
        // continue
      } else if (runnerInfo.persist !== true) {
        // runner is finished. And runner might get removed
        const endTime = runner.duration() - runner.time() + this._time;
        if (endTime + runnerInfo.persist < this._time) {
          // Delete runner and correct index
          runner.unschedule();
          --i;
          --len;
        }
      }
    }

    // Basically: we continue when there are runners right from us in time
    // when -->, and when runners are left from us when <--
    if (runnersLeft && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0) {
      this._continue();
    } else {
      this.pause();
      this.fire('finished');
    }
    return this;
  }
  terminate() {
    // cleanup memory

    // Store the timing variables
    this._startTime = 0;
    this._speed = 1.0;

    // Determines how long a runner is hold in memory. Can be a dt or true/false
    this._persist = 0;

    // Keep track of the running animations and their starting parameters
    this._nextFrame = null;
    this._paused = true;
    this._runners = [];
    this._runnerIds = [];
    this._lastRunnerId = -1;
    this._time = 0;
    this._lastSourceTime = 0;
    this._lastStepTime = 0;

    // Make sure that step is always called in class context
    this._step = this._stepFn.bind(this, false);
    this._stepImmediate = this._stepFn.bind(this, true);
  }
}
registerMethods({
  Element: {
    timeline: function (timeline) {
      if (timeline == null) {
        this._timeline = this._timeline || new Timeline();
        return this._timeline;
      } else {
        this._timeline = timeline;
        return this;
      }
    }
  }
});

class Runner extends EventTarget {
  constructor(options) {
    super();

    // Store a unique id on the runner, so that we can identify it later
    this.id = Runner.id++;

    // Ensure a default value
    options = options == null ? timeline.duration : options;

    // Ensure that we get a controller
    options = typeof options === 'function' ? new Controller(options) : options;

    // Declare all of the variables
    this._element = null;
    this._timeline = null;
    this.done = false;
    this._queue = [];

    // Work out the stepper and the duration
    this._duration = typeof options === 'number' && options;
    this._isDeclarative = options instanceof Controller;
    this._stepper = this._isDeclarative ? options : new Ease();

    // We copy the current values from the timeline because they can change
    this._history = {};

    // Store the state of the runner
    this.enabled = true;
    this._time = 0;
    this._lastTime = 0;

    // At creation, the runner is in reset state
    this._reseted = true;

    // Save transforms applied to this runner
    this.transforms = new Matrix();
    this.transformId = 1;

    // Looping variables
    this._haveReversed = false;
    this._reverse = false;
    this._loopsDone = 0;
    this._swing = false;
    this._wait = 0;
    this._times = 1;
    this._frameId = null;

    // Stores how long a runner is stored after being done
    this._persist = this._isDeclarative ? true : null;
  }
  static sanitise(duration, delay, when) {
    // Initialise the default parameters
    let times = 1;
    let swing = false;
    let wait = 0;
    duration = duration ?? timeline.duration;
    delay = delay ?? timeline.delay;
    when = when || 'last';

    // If we have an object, unpack the values
    if (typeof duration === 'object' && !(duration instanceof Stepper)) {
      delay = duration.delay ?? delay;
      when = duration.when ?? when;
      swing = duration.swing || swing;
      times = duration.times ?? times;
      wait = duration.wait ?? wait;
      duration = duration.duration ?? timeline.duration;
    }
    return {
      duration: duration,
      delay: delay,
      swing: swing,
      times: times,
      wait: wait,
      when: when
    };
  }
  active(enabled) {
    if (enabled == null) return this.enabled;
    this.enabled = enabled;
    return this;
  }

  /*
  Private Methods
  ===============
  Methods that shouldn't be used externally
  */
  addTransform(transform) {
    this.transforms.lmultiplyO(transform);
    return this;
  }
  after(fn) {
    return this.on('finished', fn);
  }
  animate(duration, delay, when) {
    const o = Runner.sanitise(duration, delay, when);
    const runner = new Runner(o.duration);
    if (this._timeline) runner.timeline(this._timeline);
    if (this._element) runner.element(this._element);
    return runner.loop(o).schedule(o.delay, o.when);
  }
  clearTransform() {
    this.transforms = new Matrix();
    return this;
  }

  // TODO: Keep track of all transformations so that deletion is faster
  clearTransformsFromQueue() {
    if (!this.done || !this._timeline || !this._timeline._runnerIds.includes(this.id)) {
      this._queue = this._queue.filter(item => {
        return !item.isTransform;
      });
    }
  }
  delay(delay) {
    return this.animate(0, delay);
  }
  duration() {
    return this._times * (this._wait + this._duration) - this._wait;
  }
  during(fn) {
    return this.queue(null, fn);
  }
  ease(fn) {
    this._stepper = new Ease(fn);
    return this;
  }
  /*
  Runner Definitions
  ==================
  These methods help us define the runtime behaviour of the Runner or they
  help us make new runners from the current runner
  */

  element(element) {
    if (element == null) return this._element;
    this._element = element;
    element._prepareRunner();
    return this;
  }
  finish() {
    return this.step(Infinity);
  }
  loop(times, swing, wait) {
    // Deal with the user passing in an object
    if (typeof times === 'object') {
      swing = times.swing;
      wait = times.wait;
      times = times.times;
    }

    // Sanitise the values and store them
    this._times = times || Infinity;
    this._swing = swing || false;
    this._wait = wait || 0;

    // Allow true to be passed
    if (this._times === true) {
      this._times = Infinity;
    }
    return this;
  }
  loops(p) {
    const loopDuration = this._duration + this._wait;
    if (p == null) {
      const loopsDone = Math.floor(this._time / loopDuration);
      const relativeTime = this._time - loopsDone * loopDuration;
      const position = relativeTime / this._duration;
      return Math.min(loopsDone + position, this._times);
    }
    const whole = Math.floor(p);
    const partial = p % 1;
    const time = loopDuration * whole + this._duration * partial;
    return this.time(time);
  }
  persist(dtOrForever) {
    if (dtOrForever == null) return this._persist;
    this._persist = dtOrForever;
    return this;
  }
  position(p) {
    // Get all of the variables we need
    const x = this._time;
    const d = this._duration;
    const w = this._wait;
    const t = this._times;
    const s = this._swing;
    const r = this._reverse;
    let position;
    if (p == null) {
      /*
      This function converts a time to a position in the range [0, 1]
      The full explanation can be found in this desmos demonstration
        https://www.desmos.com/calculator/u4fbavgche
      The logic is slightly simplified here because we can use booleans
      */

      // Figure out the value without thinking about the start or end time
      const f = function (x) {
        const swinging = s * Math.floor(x % (2 * (w + d)) / (w + d));
        const backwards = swinging && !r || !swinging && r;
        const uncliped = Math.pow(-1, backwards) * (x % (w + d)) / d + backwards;
        const clipped = Math.max(Math.min(uncliped, 1), 0);
        return clipped;
      };

      // Figure out the value by incorporating the start time
      const endTime = t * (w + d) - w;
      position = x <= 0 ? Math.round(f(1e-5)) : x < endTime ? f(x) : Math.round(f(endTime - 1e-5));
      return position;
    }

    // Work out the loops done and add the position to the loops done
    const loopsDone = Math.floor(this.loops());
    const swingForward = s && loopsDone % 2 === 0;
    const forwards = swingForward && !r || r && swingForward;
    position = loopsDone + (forwards ? p : 1 - p);
    return this.loops(position);
  }
  progress(p) {
    if (p == null) {
      return Math.min(1, this._time / this.duration());
    }
    return this.time(p * this.duration());
  }

  /*
  Basic Functionality
  ===================
  These methods allow us to attach basic functions to the runner directly
  */
  queue(initFn, runFn, retargetFn, isTransform) {
    this._queue.push({
      initialiser: initFn || noop,
      runner: runFn || noop,
      retarget: retargetFn,
      isTransform: isTransform,
      initialised: false,
      finished: false
    });
    const timeline = this.timeline();
    timeline && this.timeline()._continue();
    return this;
  }
  reset() {
    if (this._reseted) return this;
    this.time(0);
    this._reseted = true;
    return this;
  }
  reverse(reverse) {
    this._reverse = reverse == null ? !this._reverse : reverse;
    return this;
  }
  schedule(timeline, delay, when) {
    // The user doesn't need to pass a timeline if we already have one
    if (!(timeline instanceof Timeline)) {
      when = delay;
      delay = timeline;
      timeline = this.timeline();
    }

    // If there is no timeline, yell at the user...
    if (!timeline) {
      throw Error('Runner cannot be scheduled without timeline');
    }

    // Schedule the runner on the timeline provided
    timeline.schedule(this, delay, when);
    return this;
  }
  step(dt) {
    // If we are inactive, this stepper just gets skipped
    if (!this.enabled) return this;

    // Update the time and get the new position
    dt = dt == null ? 16 : dt;
    this._time += dt;
    const position = this.position();

    // Figure out if we need to run the stepper in this frame
    const running = this._lastPosition !== position && this._time >= 0;
    this._lastPosition = position;

    // Figure out if we just started
    const duration = this.duration();
    const justStarted = this._lastTime <= 0 && this._time > 0;
    const justFinished = this._lastTime < duration && this._time >= duration;
    this._lastTime = this._time;
    if (justStarted) {
      this.fire('start', this);
    }

    // Work out if the runner is finished set the done flag here so animations
    // know, that they are running in the last step (this is good for
    // transformations which can be merged)
    const declarative = this._isDeclarative;
    this.done = !declarative && !justFinished && this._time >= duration;

    // Runner is running. So its not in reset state anymore
    this._reseted = false;
    let converged = false;
    // Call initialise and the run function
    if (running || declarative) {
      this._initialise(running);

      // clear the transforms on this runner so they dont get added again and again
      this.transforms = new Matrix();
      converged = this._run(declarative ? dt : position);
      this.fire('step', this);
    }
    // correct the done flag here
    // declarative animations itself know when they converged
    this.done = this.done || converged && declarative;
    if (justFinished) {
      this.fire('finished', this);
    }
    return this;
  }

  /*
  Runner animation methods
  ========================
  Control how the animation plays
  */
  time(time) {
    if (time == null) {
      return this._time;
    }
    const dt = time - this._time;
    this.step(dt);
    return this;
  }
  timeline(timeline) {
    // check explicitly for undefined so we can set the timeline to null
    if (typeof timeline === 'undefined') return this._timeline;
    this._timeline = timeline;
    return this;
  }
  unschedule() {
    const timeline = this.timeline();
    timeline && timeline.unschedule(this);
    return this;
  }

  // Run each initialise function in the runner if required
  _initialise(running) {
    // If we aren't running, we shouldn't initialise when not declarative
    if (!running && !this._isDeclarative) return;

    // Loop through all of the initialisers
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      // Get the current initialiser
      const current = this._queue[i];

      // Determine whether we need to initialise
      const needsIt = this._isDeclarative || !current.initialised && running;
      running = !current.finished;

      // Call the initialiser if we need to
      if (needsIt && running) {
        current.initialiser.call(this);
        current.initialised = true;
      }
    }
  }

  // Save a morpher to the morpher list so that we can retarget it later
  _rememberMorpher(method, morpher) {
    this._history[method] = {
      morpher: morpher,
      caller: this._queue[this._queue.length - 1]
    };

    // We have to resume the timeline in case a controller
    // is already done without being ever run
    // This can happen when e.g. this is done:
    //    anim = el.animate(new SVG.Spring)
    // and later
    //    anim.move(...)
    if (this._isDeclarative) {
      const timeline = this.timeline();
      timeline && timeline.play();
    }
  }

  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run(positionOrDt) {
    // Run all of the _queue directly
    let allfinished = true;
    for (let i = 0, len = this._queue.length; i < len; ++i) {
      // Get the current function to run
      const current = this._queue[i];

      // Run the function if its not finished, we keep track of the finished
      // flag for the sake of declarative _queue
      const converged = current.runner.call(this, positionOrDt);
      current.finished = current.finished || converged === true;
      allfinished = allfinished && current.finished;
    }

    // We report when all of the constructors are finished
    return allfinished;
  }

  // do nothing and return false
  _tryRetarget(method, target, extra) {
    if (this._history[method]) {
      // if the last method wasn't even initialised, throw it away
      if (!this._history[method].caller.initialised) {
        const index = this._queue.indexOf(this._history[method].caller);
        this._queue.splice(index, 1);
        return false;
      }

      // for the case of transformations, we use the special retarget function
      // which has access to the outer scope
      if (this._history[method].caller.retarget) {
        this._history[method].caller.retarget.call(this, target, extra);
        // for everything else a simple morpher change is sufficient
      } else {
        this._history[method].morpher.to(target);
      }
      this._history[method].caller.finished = false;
      const timeline = this.timeline();
      timeline && timeline.play();
      return true;
    }
    return false;
  }
}
Runner.id = 0;
class FakeRunner {
  constructor(transforms = new Matrix(), id = -1, done = true) {
    this.transforms = transforms;
    this.id = id;
    this.done = done;
  }
  clearTransformsFromQueue() {}
}
extend([Runner, FakeRunner], {
  mergeWith(runner) {
    return new FakeRunner(runner.transforms.lmultiply(this.transforms), runner.id);
  }
});

// FakeRunner.emptyRunner = new FakeRunner()

const lmultiply = (last, curr) => last.lmultiplyO(curr);
const getRunnerTransform = runner => runner.transforms;
function mergeTransforms() {
  // Find the matrix to apply to the element and apply it
  const runners = this._transformationRunners.runners;
  const netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new Matrix());
  this.transform(netTransform);
  this._transformationRunners.merge();
  if (this._transformationRunners.length() === 1) {
    this._frameId = null;
  }
}
class RunnerArray {
  constructor() {
    this.runners = [];
    this.ids = [];
  }
  add(runner) {
    if (this.runners.includes(runner)) return;
    const id = runner.id + 1;
    this.runners.push(runner);
    this.ids.push(id);
    return this;
  }
  clearBefore(id) {
    const deleteCnt = this.ids.indexOf(id + 1) || 1;
    this.ids.splice(0, deleteCnt, 0);
    this.runners.splice(0, deleteCnt, new FakeRunner()).forEach(r => r.clearTransformsFromQueue());
    return this;
  }
  edit(id, newRunner) {
    const index = this.ids.indexOf(id + 1);
    this.ids.splice(index, 1, id + 1);
    this.runners.splice(index, 1, newRunner);
    return this;
  }
  getByID(id) {
    return this.runners[this.ids.indexOf(id + 1)];
  }
  length() {
    return this.ids.length;
  }
  merge() {
    let lastRunner = null;
    for (let i = 0; i < this.runners.length; ++i) {
      const runner = this.runners[i];
      const condition = lastRunner && runner.done && lastRunner.done && (
      // don't merge runner when persisted on timeline
      !runner._timeline || !runner._timeline._runnerIds.includes(runner.id)) && (!lastRunner._timeline || !lastRunner._timeline._runnerIds.includes(lastRunner.id));
      if (condition) {
        // the +1 happens in the function
        this.remove(runner.id);
        const newRunner = runner.mergeWith(lastRunner);
        this.edit(lastRunner.id, newRunner);
        lastRunner = newRunner;
        --i;
      } else {
        lastRunner = runner;
      }
    }
    return this;
  }
  remove(id) {
    const index = this.ids.indexOf(id + 1);
    this.ids.splice(index, 1);
    this.runners.splice(index, 1);
    return this;
  }
}
registerMethods({
  Element: {
    animate(duration, delay, when) {
      const o = Runner.sanitise(duration, delay, when);
      const timeline = this.timeline();
      return new Runner(o.duration).loop(o).element(this).timeline(timeline.play()).schedule(o.delay, o.when);
    },
    delay(by, when) {
      return this.animate(0, by, when);
    },
    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore(currentRunner) {
      this._transformationRunners.clearBefore(currentRunner.id);
    },
    _currentTransform(current) {
      return this._transformationRunners.runners
      // we need the equal sign here to make sure, that also transformations
      // on the same runner which execute before the current transformation are
      // taken into account
      .filter(runner => runner.id <= current.id).map(getRunnerTransform).reduce(lmultiply, new Matrix());
    },
    _addRunner(runner) {
      this._transformationRunners.add(runner);

      // Make sure that the runner merge is executed at the very end of
      // all Animator functions. That is why we use immediate here to execute
      // the merge right after all frames are run
      Animator.cancelImmediate(this._frameId);
      this._frameId = Animator.immediate(mergeTransforms.bind(this));
    },
    _prepareRunner() {
      if (this._frameId == null) {
        this._transformationRunners = new RunnerArray().add(new FakeRunner(new Matrix(this)));
      }
    }
  }
});

// Will output the elements from array A that are not in the array B
const difference = (a, b) => a.filter(x => !b.includes(x));
extend(Runner, {
  attr(a, v) {
    return this.styleAttr('attr', a, v);
  },
  // Add animatable styles
  css(s, v) {
    return this.styleAttr('css', s, v);
  },
  styleAttr(type, nameOrAttrs, val) {
    if (typeof nameOrAttrs === 'string') {
      return this.styleAttr(type, {
        [nameOrAttrs]: val
      });
    }
    let attrs = nameOrAttrs;
    if (this._tryRetarget(type, attrs)) return this;
    let morpher = new Morphable(this._stepper).to(attrs);
    let keys = Object.keys(attrs);
    this.queue(function () {
      morpher = morpher.from(this.element()[type](keys));
    }, function (pos) {
      this.element()[type](morpher.at(pos).valueOf());
      return morpher.done();
    }, function (newToAttrs) {
      // Check if any new keys were added
      const newKeys = Object.keys(newToAttrs);
      const differences = difference(newKeys, keys);

      // If their are new keys, initialize them and add them to morpher
      if (differences.length) {
        // Get the values
        const addedFromAttrs = this.element()[type](differences);

        // Get the already initialized values
        const oldFromAttrs = new ObjectBag(morpher.from()).valueOf();

        // Merge old and new
        Object.assign(oldFromAttrs, addedFromAttrs);
        morpher.from(oldFromAttrs);
      }

      // Get the object from the morpher
      const oldToAttrs = new ObjectBag(morpher.to()).valueOf();

      // Merge in new attributes
      Object.assign(oldToAttrs, newToAttrs);

      // Change morpher target
      morpher.to(oldToAttrs);

      // Make sure that we save the work we did so we don't need it to do again
      keys = newKeys;
      attrs = newToAttrs;
    });
    this._rememberMorpher(type, morpher);
    return this;
  },
  zoom(level, point) {
    if (this._tryRetarget('zoom', level, point)) return this;
    let morpher = new Morphable(this._stepper).to(new SVGNumber(level));
    this.queue(function () {
      morpher = morpher.from(this.element().zoom());
    }, function (pos) {
      this.element().zoom(morpher.at(pos), point);
      return morpher.done();
    }, function (newLevel, newPoint) {
      point = newPoint;
      morpher.to(newLevel);
    });
    this._rememberMorpher('zoom', morpher);
    return this;
  },
  /**
   ** absolute transformations
   **/

  //
  // M v -----|-----(D M v = F v)------|----->  T v
  //
  // 1. define the final state (T) and decompose it (once)
  //    t = [tx, ty, the, lam, sy, sx]
  // 2. on every frame: pull the current state of all previous transforms
  //    (M - m can change)
  //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
  // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
  //   - Note F(0) = M
  //   - Note F(1) = T
  // 4. Now you get the delta matrix as a result: D = F * inv(M)

  transform(transforms, relative, affine) {
    // If we have a declarative function, we should retarget it if possible
    relative = transforms.relative || relative;
    if (this._isDeclarative && !relative && this._tryRetarget('transform', transforms)) {
      return this;
    }

    // Parse the parameters
    const isMatrix = Matrix.isMatrixLike(transforms);
    affine = transforms.affine != null ? transforms.affine : affine != null ? affine : !isMatrix;

    // Create a morpher and set its type
    const morpher = new Morphable(this._stepper).type(affine ? TransformBag : Matrix);
    let origin;
    let element;
    let current;
    let currentAngle;
    let startTransform;
    function setup() {
      // make sure element and origin is defined
      element = element || this.element();
      origin = origin || getOrigin(transforms, element);
      startTransform = new Matrix(relative ? undefined : element);

      // add the runner to the element so it can merge transformations
      element._addRunner(this);

      // Deactivate all transforms that have run so far if we are absolute
      if (!relative) {
        element._clearTransformRunnersBefore(this);
      }
    }
    function run(pos) {
      // clear all other transforms before this in case something is saved
      // on this runner. We are absolute. We dont need these!
      if (!relative) this.clearTransform();
      const {
        x,
        y
      } = new Point(origin).transform(element._currentTransform(this));
      let target = new Matrix({
        ...transforms,
        origin: [x, y]
      });
      let start = this._isDeclarative && current ? current : startTransform;
      if (affine) {
        target = target.decompose(x, y);
        start = start.decompose(x, y);

        // Get the current and target angle as it was set
        const rTarget = target.rotate;
        const rCurrent = start.rotate;

        // Figure out the shortest path to rotate directly
        const possibilities = [rTarget - 360, rTarget, rTarget + 360];
        const distances = possibilities.map(a => Math.abs(a - rCurrent));
        const shortest = Math.min(...distances);
        const index = distances.indexOf(shortest);
        target.rotate = possibilities[index];
      }
      if (relative) {
        // we have to be careful here not to overwrite the rotation
        // with the rotate method of Matrix
        if (!isMatrix) {
          target.rotate = transforms.rotate || 0;
        }
        if (this._isDeclarative && currentAngle) {
          start.rotate = currentAngle;
        }
      }
      morpher.from(start);
      morpher.to(target);
      const affineParameters = morpher.at(pos);
      currentAngle = affineParameters.rotate;
      current = new Matrix(affineParameters);
      this.addTransform(current);
      element._addRunner(this);
      return morpher.done();
    }
    function retarget(newTransforms) {
      // only get a new origin if it changed since the last call
      if ((newTransforms.origin || 'center').toString() !== (transforms.origin || 'center').toString()) {
        origin = getOrigin(newTransforms, element);
      }

      // overwrite the old transformations with the new ones
      transforms = {
        ...newTransforms,
        origin
      };
    }
    this.queue(setup, run, retarget, true);
    this._isDeclarative && this._rememberMorpher('transform', morpher);
    return this;
  },
  // Animatable x-axis
  x(x) {
    return this._queueNumber('x', x);
  },
  // Animatable y-axis
  y(y) {
    return this._queueNumber('y', y);
  },
  ax(x) {
    return this._queueNumber('ax', x);
  },
  ay(y) {
    return this._queueNumber('ay', y);
  },
  dx(x = 0) {
    return this._queueNumberDelta('x', x);
  },
  dy(y = 0) {
    return this._queueNumberDelta('y', y);
  },
  dmove(x, y) {
    return this.dx(x).dy(y);
  },
  _queueNumberDelta(method, to) {
    to = new SVGNumber(to);

    // Try to change the target if we have this method already registered
    if (this._tryRetarget(method, to)) return this;

    // Make a morpher and queue the animation
    const morpher = new Morphable(this._stepper).to(to);
    let from = null;
    this.queue(function () {
      from = this.element()[method]();
      morpher.from(from);
      morpher.to(from + to);
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    }, function (newTo) {
      morpher.to(from + new SVGNumber(newTo));
    });

    // Register the morpher so that if it is changed again, we can retarget it
    this._rememberMorpher(method, morpher);
    return this;
  },
  _queueObject(method, to) {
    // Try to change the target if we have this method already registered
    if (this._tryRetarget(method, to)) return this;

    // Make a morpher and queue the animation
    const morpher = new Morphable(this._stepper).to(to);
    this.queue(function () {
      morpher.from(this.element()[method]());
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    });

    // Register the morpher so that if it is changed again, we can retarget it
    this._rememberMorpher(method, morpher);
    return this;
  },
  _queueNumber(method, value) {
    return this._queueObject(method, new SVGNumber(value));
  },
  // Animatable center x-axis
  cx(x) {
    return this._queueNumber('cx', x);
  },
  // Animatable center y-axis
  cy(y) {
    return this._queueNumber('cy', y);
  },
  // Add animatable move
  move(x, y) {
    return this.x(x).y(y);
  },
  amove(x, y) {
    return this.ax(x).ay(y);
  },
  // Add animatable center
  center(x, y) {
    return this.cx(x).cy(y);
  },
  // Add animatable size
  size(width, height) {
    // animate bbox based size for all other elements
    let box;
    if (!width || !height) {
      box = this._element.bbox();
    }
    if (!width) {
      width = box.width / box.height * height;
    }
    if (!height) {
      height = box.height / box.width * width;
    }
    return this.width(width).height(height);
  },
  // Add animatable width
  width(width) {
    return this._queueNumber('width', width);
  },
  // Add animatable height
  height(height) {
    return this._queueNumber('height', height);
  },
  // Add animatable plot
  plot(a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if (arguments.length === 4) {
      return this.plot([a, b, c, d]);
    }
    if (this._tryRetarget('plot', a)) return this;
    const morpher = new Morphable(this._stepper).type(this._element.MorphArray).to(a);
    this.queue(function () {
      morpher.from(this._element.array());
    }, function (pos) {
      this._element.plot(morpher.at(pos));
      return morpher.done();
    });
    this._rememberMorpher('plot', morpher);
    return this;
  },
  // Add leading method
  leading(value) {
    return this._queueNumber('leading', value);
  },
  // Add animatable viewbox
  viewbox(x, y, width, height) {
    return this._queueObject('viewbox', new Box(x, y, width, height));
  },
  update(o) {
    if (typeof o !== 'object') {
      return this.update({
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      });
    }
    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', o.offset);
    return this;
  }
});
extend(Runner, {
  rx,
  ry,
  from,
  to
});
register(Runner, 'Runner');

class Svg extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('svg', node), attrs);
    this.namespace();
  }

  // Creates and returns defs element
  defs() {
    if (!this.isRoot()) return this.root().defs();
    return adopt(this.node.querySelector('defs')) || this.put(new Defs());
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof globals.window.SVGElement) && this.node.parentNode.nodeName !== '#document-fragment';
  }

  // Add namespaces
  namespace() {
    if (!this.isRoot()) return this.root().namespace();
    return this.attr({
      xmlns: svg,
      version: '1.1'
    }).attr('xmlns:xlink', xlink, xmlns);
  }
  removeNamespace() {
    return this.attr({
      xmlns: null,
      version: null
    }).attr('xmlns:xlink', null, xmlns).attr('xmlns:svgjs', null, xmlns);
  }

  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    if (this.isRoot()) return this;
    return super.root();
  }
}
registerMethods({
  Container: {
    // Create nested svg document
    nested: wrapWithAttrCheck(function () {
      return this.put(new Svg());
    })
  }
});
register(Svg, 'Svg', true);

class svg_Symbol extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('symbol', node), attrs);
  }
}
registerMethods({
  Container: {
    symbol: wrapWithAttrCheck(function () {
      return this.put(new svg_Symbol());
    })
  }
});
register(svg_Symbol, 'Symbol');

// Create plain text node
function plain(text) {
  // clear if build mode is disabled
  if (this._build === false) {
    this.clear();
  }

  // create text node
  this.node.appendChild(globals.document.createTextNode(text));
  return this;
}

// Get length of text element
function svg_length() {
  return this.node.getComputedTextLength();
}

// Move over x-axis
// Text is moved by its bounding box
// text-anchor does NOT matter
function x$1(x, box = this.bbox()) {
  if (x == null) {
    return box.x;
  }
  return this.attr('x', this.attr('x') + x - box.x);
}

// Move over y-axis
function y$1(y, box = this.bbox()) {
  if (y == null) {
    return box.y;
  }
  return this.attr('y', this.attr('y') + y - box.y);
}
function move$1(x, y, box = this.bbox()) {
  return this.x(x, box).y(y, box);
}

// Move center over x-axis
function cx(x, box = this.bbox()) {
  if (x == null) {
    return box.cx;
  }
  return this.attr('x', this.attr('x') + x - box.cx);
}

// Move center over y-axis
function cy(y, box = this.bbox()) {
  if (y == null) {
    return box.cy;
  }
  return this.attr('y', this.attr('y') + y - box.cy);
}
function center(x, y, box = this.bbox()) {
  return this.cx(x, box).cy(y, box);
}
function ax(x) {
  return this.attr('x', x);
}
function ay(y) {
  return this.attr('y', y);
}
function amove(x, y) {
  return this.ax(x).ay(y);
}

// Enable / disable build mode
function build(build) {
  this._build = !!build;
  return this;
}

var textable = {
  __proto__: null,
  amove: amove,
  ax: ax,
  ay: ay,
  build: build,
  center: center,
  cx: cx,
  cy: cy,
  length: svg_length,
  move: move$1,
  plain: plain,
  x: x$1,
  y: y$1
};

class Text extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('text', node), attrs);
    this.dom.leading = this.dom.leading ?? new SVGNumber(1.3); // store leading value for rebuilding
    this._rebuild = true; // enable automatic updating of dy values
    this._build = false; // disable build mode for adding multiple lines
  }

  // Set / get leading
  leading(value) {
    // act as getter
    if (value == null) {
      return this.dom.leading;
    }

    // act as setter
    this.dom.leading = new SVGNumber(value);
    return this.rebuild();
  }

  // Rebuild appearance type
  rebuild(rebuild) {
    // store new rebuild flag if given
    if (typeof rebuild === 'boolean') {
      this._rebuild = rebuild;
    }

    // define position of all lines
    if (this._rebuild) {
      const self = this;
      let blankLineOffset = 0;
      const leading = this.dom.leading;
      this.each(function (i) {
        if (isDescriptive(this.node)) return;
        const fontSize = globals.window.getComputedStyle(this.node).getPropertyValue('font-size');
        const dy = leading * new SVGNumber(fontSize);
        if (this.dom.newLined) {
          this.attr('x', self.attr('x'));
          if (this.text() === '\n') {
            blankLineOffset += dy;
          } else {
            this.attr('dy', i ? dy + blankLineOffset : 0);
            blankLineOffset = 0;
          }
        }
      });
      this.fire('rebuild');
    }
    return this;
  }

  // overwrite method from parent to set data properly
  setData(o) {
    this.dom = o;
    this.dom.leading = new SVGNumber(o.leading || 1.3);
    return this;
  }
  writeDataToDom() {
    writeDataToDom(this, this.dom, {
      leading: 1.3
    });
    return this;
  }

  // Set the text content
  text(text) {
    // act as getter
    if (text === undefined) {
      const children = this.node.childNodes;
      let firstLine = 0;
      text = '';
      for (let i = 0, len = children.length; i < len; ++i) {
        // skip textPaths - they are no lines
        if (children[i].nodeName === 'textPath' || isDescriptive(children[i])) {
          if (i === 0) firstLine = i + 1;
          continue;
        }

        // add newline if its not the first child and newLined is set to true
        if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
          text += '\n';
        }

        // add content of this node
        text += children[i].textContent;
      }
      return text;
    }

    // remove existing content
    this.clear().build(true);
    if (typeof text === 'function') {
      // call block
      text.call(this, this);
    } else {
      // store text and make sure text is not blank
      text = (text + '').split('\n');

      // build new lines
      for (let j = 0, jl = text.length; j < jl; j++) {
        this.newLine(text[j]);
      }
    }

    // disable build mode and rebuild lines
    return this.build(false).rebuild();
  }
}
extend(Text, textable);
registerMethods({
  Container: {
    // Create text element
    text: wrapWithAttrCheck(function (text = '') {
      return this.put(new Text()).text(text);
    }),
    // Create plain text element
    plain: wrapWithAttrCheck(function (text = '') {
      return this.put(new Text()).plain(text);
    })
  }
});
register(Text, 'Text');

class Tspan extends Shape {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('tspan', node), attrs);
    this._build = false; // disable build mode for adding multiple lines
  }

  // Shortcut dx
  dx(dx) {
    return this.attr('dx', dx);
  }

  // Shortcut dy
  dy(dy) {
    return this.attr('dy', dy);
  }

  // Create new line
  newLine() {
    // mark new line
    this.dom.newLined = true;

    // fetch parent
    const text = this.parent();

    // early return in case we are not in a text element
    if (!(text instanceof Text)) {
      return this;
    }
    const i = text.index(this);
    const fontSize = globals.window.getComputedStyle(this.node).getPropertyValue('font-size');
    const dy = text.dom.leading * new SVGNumber(fontSize);

    // apply new position
    return this.dy(i ? dy : 0).attr('x', text.x());
  }

  // Set text content
  text(text) {
    if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '');
    if (typeof text === 'function') {
      this.clear().build(true);
      text.call(this, this);
      this.build(false);
    } else {
      this.plain(text);
    }
    return this;
  }
}
extend(Tspan, textable);
registerMethods({
  Tspan: {
    tspan: wrapWithAttrCheck(function (text = '') {
      const tspan = new Tspan();

      // clear if build mode is disabled
      if (!this._build) {
        this.clear();
      }

      // add new tspan
      return this.put(tspan).text(text);
    })
  },
  Text: {
    newLine: function (text = '') {
      return this.tspan(text).newLine();
    }
  }
});
register(Tspan, 'Tspan');

class Circle extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('circle', node), attrs);
  }
  radius(r) {
    return this.attr('r', r);
  }

  // Radius x value
  rx(rx) {
    return this.attr('r', rx);
  }

  // Alias radius x value
  ry(ry) {
    return this.rx(ry);
  }
  size(size) {
    return this.radius(new SVGNumber(size).divide(2));
  }
}
extend(Circle, {
  x: x$3,
  y: y$3,
  cx: cx$1,
  cy: cy$1,
  width: width$2,
  height: height$2
});
registerMethods({
  Container: {
    // Create circle element
    circle: wrapWithAttrCheck(function (size = 0) {
      return this.put(new Circle()).size(size).move(0, 0);
    })
  }
});
register(Circle, 'Circle');

class ClipPath extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('clipPath', node), attrs);
  }

  // Unclip all clipped elements and remove itself
  remove() {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip();
    });

    // remove clipPath from parent
    return super.remove();
  }
  targets() {
    return baseFind('svg [clip-path*=' + this.id() + ']');
  }
}
registerMethods({
  Container: {
    // Create clipping element
    clip: wrapWithAttrCheck(function () {
      return this.defs().put(new ClipPath());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference('clip-path');
    },
    clipWith(element) {
      // use given clip or create a new one
      const clipper = element instanceof ClipPath ? element : this.parent().clip().add(element);

      // apply mask
      return this.attr('clip-path', 'url(#' + clipper.id() + ')');
    },
    // Unclip element
    unclip() {
      return this.attr('clip-path', null);
    }
  }
});
register(ClipPath, 'ClipPath');

class ForeignObject extends Element {
  constructor(node, attrs = node) {
    super(nodeOrNew('foreignObject', node), attrs);
  }
}
registerMethods({
  Container: {
    foreignObject: wrapWithAttrCheck(function (width, height) {
      return this.put(new ForeignObject()).size(width, height);
    })
  }
});
register(ForeignObject, 'ForeignObject');

function dmove(dx, dy) {
  this.children().forEach(child => {
    let bbox;

    // We have to wrap this for elements that dont have a bbox
    // e.g. title and other descriptive elements
    try {
      // Get the childs bbox
      // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1905039
      // Because bbox for nested svgs returns the contents bbox in the coordinate space of the svg itself (weird!), we cant use bbox for svgs
      // Therefore we have to use getBoundingClientRect. But THAT is broken (as explained in the bug).
      // Funnily enough the broken behavior would work for us but that breaks it in chrome
      // So we have to replicate the broken behavior of FF by just reading the attributes of the svg itself
      bbox = child.node instanceof getWindow().SVGSVGElement ? new Box(child.attr(['x', 'y', 'width', 'height'])) : child.bbox();
    } catch (e) {
      return;
    }

    // Get childs matrix
    const m = new Matrix(child);
    // Translate childs matrix by amount and
    // transform it back into parents space
    const matrix = m.translate(dx, dy).transform(m.inverse());
    // Calculate new x and y from old box
    const p = new Point(bbox.x, bbox.y).transform(matrix);
    // Move element
    child.move(p.x, p.y);
  });
  return this;
}
function dx(dx) {
  return this.dmove(dx, 0);
}
function dy(dy) {
  return this.dmove(0, dy);
}
function height(height, box = this.bbox()) {
  if (height == null) return box.height;
  return this.size(box.width, height, box);
}
function move(x = 0, y = 0, box = this.bbox()) {
  const dx = x - box.x;
  const dy = y - box.y;
  return this.dmove(dx, dy);
}
function size(width, height, box = this.bbox()) {
  const p = proportionalSize(this, width, height, box);
  const scaleX = p.width / box.width;
  const scaleY = p.height / box.height;
  this.children().forEach(child => {
    const o = new Point(box).transform(new Matrix(child).inverse());
    child.scale(scaleX, scaleY, o.x, o.y);
  });
  return this;
}
function width(width, box = this.bbox()) {
  if (width == null) return box.width;
  return this.size(width, box.height, box);
}
function x(x, box = this.bbox()) {
  if (x == null) return box.x;
  return this.move(x, box.y, box);
}
function y(y, box = this.bbox()) {
  if (y == null) return box.y;
  return this.move(box.x, y, box);
}

var containerGeometry = {
  __proto__: null,
  dmove: dmove,
  dx: dx,
  dy: dy,
  height: height,
  move: move,
  size: size,
  width: width,
  x: x,
  y: y
};

class G extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('g', node), attrs);
  }
}
extend(G, containerGeometry);
registerMethods({
  Container: {
    // Create a group element
    group: wrapWithAttrCheck(function () {
      return this.put(new G());
    })
  }
});
register(G, 'G');

class A extends Container {
  constructor(node, attrs = node) {
    super(nodeOrNew('a', node), attrs);
  }

  // Link target attribute
  target(target) {
    return this.attr('target', target);
  }

  // Link url
  to(url) {
    return this.attr('href', url, xlink);
  }
}
extend(A, containerGeometry);
registerMethods({
  Container: {
    // Create a hyperlink element
    link: wrapWithAttrCheck(function (url) {
      return this.put(new A()).to(url);
    })
  },
  Element: {
    unlink() {
      const link = this.linker();
      if (!link) return this;
      const parent = link.parent();
      if (!parent) {
        return this.remove();
      }
      const index = parent.index(link);
      parent.add(this, index);
      link.remove();
      return this;
    },
    linkTo(url) {
      // reuse old link if possible
      let link = this.linker();
      if (!link) {
        link = new A();
        this.wrap(link);
      }
      if (typeof url === 'function') {
        url.call(link, link);
      } else {
        link.to(url);
      }
      return this;
    },
    linker() {
      const link = this.parent();
      if (link && link.node.nodeName.toLowerCase() === 'a') {
        return link;
      }
      return null;
    }
  }
});
register(A, 'A');

class Mask extends Container {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('mask', node), attrs);
  }

  // Unmask all masked elements and remove itself
  remove() {
    // unmask all targets
    this.targets().forEach(function (el) {
      el.unmask();
    });

    // remove mask from parent
    return super.remove();
  }
  targets() {
    return baseFind('svg [mask*=' + this.id() + ']');
  }
}
registerMethods({
  Container: {
    mask: wrapWithAttrCheck(function () {
      return this.defs().put(new Mask());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference('mask');
    },
    maskWith(element) {
      // use given mask or create a new one
      const masker = element instanceof Mask ? element : this.parent().mask().add(element);

      // apply mask
      return this.attr('mask', 'url(#' + masker.id() + ')');
    },
    // Unmask element
    unmask() {
      return this.attr('mask', null);
    }
  }
});
register(Mask, 'Mask');

class Stop extends Element {
  constructor(node, attrs = node) {
    super(nodeOrNew('stop', node), attrs);
  }

  // add color stops
  update(o) {
    if (typeof o === 'number' || o instanceof SVGNumber) {
      o = {
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      };
    }

    // set attributes
    if (o.opacity != null) this.attr('stop-opacity', o.opacity);
    if (o.color != null) this.attr('stop-color', o.color);
    if (o.offset != null) this.attr('offset', new SVGNumber(o.offset));
    return this;
  }
}
registerMethods({
  Gradient: {
    // Add a color stop
    stop: function (offset, color, opacity) {
      return this.put(new Stop()).update(offset, color, opacity);
    }
  }
});
register(Stop, 'Stop');

function cssRule(selector, rule) {
  if (!selector) return '';
  if (!rule) return selector;
  let ret = selector + '{';
  for (const i in rule) {
    ret += unCamelCase(i) + ':' + rule[i] + ';';
  }
  ret += '}';
  return ret;
}
class Style extends Element {
  constructor(node, attrs = node) {
    super(nodeOrNew('style', node), attrs);
  }
  addText(w = '') {
    this.node.textContent += w;
    return this;
  }
  font(name, src, params = {}) {
    return this.rule('@font-face', {
      fontFamily: name,
      src: src,
      ...params
    });
  }
  rule(selector, obj) {
    return this.addText(cssRule(selector, obj));
  }
}
registerMethods('Dom', {
  style(selector, obj) {
    return this.put(new Style()).rule(selector, obj);
  },
  fontface(name, src, params) {
    return this.put(new Style()).font(name, src, params);
  }
});
register(Style, 'Style');

class TextPath extends Text {
  // Initialize node
  constructor(node, attrs = node) {
    super(nodeOrNew('textPath', node), attrs);
  }

  // return the array of the path track element
  array() {
    const track = this.track();
    return track ? track.array() : null;
  }

  // Plot path if any
  plot(d) {
    const track = this.track();
    let pathArray = null;
    if (track) {
      pathArray = track.plot(d);
    }
    return d == null ? pathArray : this;
  }

  // Get the path element
  track() {
    return this.reference('href');
  }
}
registerMethods({
  Container: {
    textPath: wrapWithAttrCheck(function (text, path) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = this.text(text);
      }
      return text.path(path);
    })
  },
  Text: {
    // Create path for text to run on
    path: wrapWithAttrCheck(function (track, importNodes = true) {
      const textPath = new TextPath();

      // if track is a path, reuse it
      if (!(track instanceof Path)) {
        // create path element
        track = this.defs().path(track);
      }

      // link textPath to path and add content
      textPath.attr('href', '#' + track, xlink);

      // Transplant all nodes from text to textPath
      let node;
      if (importNodes) {
        while (node = this.node.firstChild) {
          textPath.node.appendChild(node);
        }
      }

      // add textPath element as child node and return textPath
      return this.put(textPath);
    }),
    // Get the textPath children
    textPath() {
      return this.findOne('textPath');
    }
  },
  Path: {
    // creates a textPath from this path
    text: wrapWithAttrCheck(function (text) {
      // Convert text to instance if needed
      if (!(text instanceof Text)) {
        text = new Text().addTo(this.parent()).text(text);
      }

      // Create textPath from text and path and return
      return text.path(this);
    }),
    targets() {
      return baseFind('svg textPath').filter(node => {
        return (node.attr('href') || '').includes(this.id());
      });

      // Does not work in IE11. Use when IE support is dropped
      // return baseFind('svg textPath[*|href*=' + this.id() + ']')
    }
  }
});
TextPath.prototype.MorphArray = PathArray;
register(TextPath, 'TextPath');

class Use extends Shape {
  constructor(node, attrs = node) {
    super(nodeOrNew('use', node), attrs);
  }

  // Use element as a reference
  use(element, file) {
    // Set lined element
    return this.attr('href', (file || '') + '#' + element, xlink);
  }
}
registerMethods({
  Container: {
    // Create a use element
    use: wrapWithAttrCheck(function (element, file) {
      return this.put(new Use()).use(element, file);
    })
  }
});
register(Use, 'Use');

/* Optional Modules */
const SVG = makeInstance;
extend([Svg, svg_Symbol, Image, Pattern, Marker], getMethodsFor('viewbox'));
extend([Line, Polyline, Polygon, Path], getMethodsFor('marker'));
extend(Text, getMethodsFor('Text'));
extend(Path, getMethodsFor('Path'));
extend(Defs, getMethodsFor('Defs'));
extend([Text, Tspan], getMethodsFor('Tspan'));
extend([Rect, Ellipse, Gradient, Runner], getMethodsFor('radius'));
extend(EventTarget, getMethodsFor('EventTarget'));
extend(Dom, getMethodsFor('Dom'));
extend(Element, getMethodsFor('Element'));
extend(Shape, getMethodsFor('Shape'));
extend([Container, Fragment], getMethodsFor('Container'));
extend(Gradient, getMethodsFor('Gradient'));
extend(Runner, getMethodsFor('Runner'));
List.extend(getMethodNames());
registerMorphableType([SVGNumber, Color, Box, Matrix, SVGArray, PointArray, PathArray, Point]);
makeMorphable();


//# sourceMappingURL=svg.esm.js.map

;// ./src/lib/icons/success.svelte
/* src/lib/icons/success.svelte generated by Svelte v4.2.19 */




function success_svelte_create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "fill", "currentColor");
			(0,internal/* attr */.CFu)(path, "d", "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z");
			(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			(0,internal/* set_style */.hgi)(svg, "text-align", "center");
			(0,internal/* set_style */.hgi)(svg, "display", "inline-block");
			(0,internal/* attr */.CFu)(svg, "aria-hidden", "true");
			(0,internal/* attr */.CFu)(svg, "focusable", "false");
			(0,internal/* attr */.CFu)(svg, "role", "img");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 512 512");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*width*/ 1) {
				(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function success_svelte_instance($$self, $$props, $$invalidate) {
	let { width = "1em" } = $$props;

	$$self.$$set = $$props => {
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
	};

	return [width];
}

class Success extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, success_svelte_instance, success_svelte_create_fragment, internal/* safe_not_equal */.jXN, { width: 0 });
	}
}

/* harmony default export */ const success_svelte = (Success);
;// ./src/lib/icons/error.svelte
/* src/lib/icons/error.svelte generated by Svelte v4.2.19 */




function error_svelte_create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "fill", "currentColor");
			(0,internal/* attr */.CFu)(path, "d", "M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z");
			(0,internal/* attr */.CFu)(path, "class", "");
			(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			(0,internal/* set_style */.hgi)(svg, "text-align", "center");
			(0,internal/* set_style */.hgi)(svg, "display", "inline-block");
			(0,internal/* attr */.CFu)(svg, "aria-hidden", "true");
			(0,internal/* attr */.CFu)(svg, "focusable", "false");
			(0,internal/* attr */.CFu)(svg, "role", "img");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 512 512");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*width*/ 1) {
				(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function error_svelte_instance($$self, $$props, $$invalidate) {
	let { width = "1em" } = $$props;

	$$self.$$set = $$props => {
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
	};

	return [width];
}

class error_svelte_Error extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, error_svelte_instance, error_svelte_create_fragment, internal/* safe_not_equal */.jXN, { width: 0 });
	}
}

/* harmony default export */ const error_svelte = (error_svelte_Error);
;// ./src/lib/icons/info.svelte
/* src/lib/icons/info.svelte generated by Svelte v4.2.19 */




function info_svelte_create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "fill", "currentColor");
			(0,internal/* attr */.CFu)(path, "d", "M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z");
			(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			(0,internal/* set_style */.hgi)(svg, "text-align", "center");
			(0,internal/* set_style */.hgi)(svg, "display", "inline-block");
			(0,internal/* attr */.CFu)(svg, "aria-hidden", "true");
			(0,internal/* attr */.CFu)(svg, "focusable", "false");
			(0,internal/* attr */.CFu)(svg, "role", "img");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 512 512");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*width*/ 1) {
				(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function info_svelte_instance($$self, $$props, $$invalidate) {
	let { width = "1em" } = $$props;

	$$self.$$set = $$props => {
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
	};

	return [width];
}

class Info extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, info_svelte_instance, info_svelte_create_fragment, internal/* safe_not_equal */.jXN, { width: 0 });
	}
}

/* harmony default export */ const info_svelte = (Info);
;// ./src/lib/icons/close.svelte
/* src/lib/icons/close.svelte generated by Svelte v4.2.19 */




function close_svelte_create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "class", "fill");
			(0,internal/* attr */.CFu)(path, "fill", "#333");
			(0,internal/* attr */.CFu)(path, "d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z");
			(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			(0,internal/* set_style */.hgi)(svg, "text-align", "center");
			(0,internal/* set_style */.hgi)(svg, "display", "inline-block");
			(0,internal/* attr */.CFu)(svg, "aria-hidden", "true");
			(0,internal/* attr */.CFu)(svg, "focusable", "false");
			(0,internal/* attr */.CFu)(svg, "role", "img");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 0 352 512");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*width*/ 1) {
				(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[0]);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

function close_svelte_instance($$self, $$props, $$invalidate) {
	let { width = "1em" } = $$props;

	$$self.$$set = $$props => {
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
	};

	return [width];
}

class Close extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, close_svelte_instance, close_svelte_create_fragment, internal/* safe_not_equal */.jXN, { width: 0 });
	}
}

/* harmony default export */ const close_svelte = (Close);
;// ./src/Toast.svelte
/* src/Toast.svelte generated by Svelte v4.2.19 */













function create_if_block_3(ctx) {
	let svg;
	let svg_id_value;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			(0,internal/* attr */.CFu)(svg, "id", svg_id_value = 'svg' + /*svgId*/ ctx[4]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
		},
		p: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}
		}
	};
}

// (38:2) {:else}
function Toast_svelte_create_else_block(ctx) {
	let infoicon;
	let current;
	infoicon = new info_svelte({ props: { width: "1.1em" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(infoicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(infoicon, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(infoicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(infoicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(infoicon, detaching);
		}
	};
}

// (36:29) 
function Toast_svelte_create_if_block_2(ctx) {
	let erroricon;
	let current;
	erroricon = new error_svelte({ props: { width: "1.1em" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(erroricon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(erroricon, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(erroricon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(erroricon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(erroricon, detaching);
		}
	};
}

// (34:2) {#if type === "success"}
function Toast_svelte_create_if_block_1(ctx) {
	let successicon;
	let current;
	successicon = new success_svelte({ props: { width: "1.1em" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(successicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(successicon, target, anchor);
			current = true;
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(successicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(successicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(successicon, detaching);
		}
	};
}

// (46:2) {#if dismissible}
function Toast_svelte_create_if_block(ctx) {
	let button;
	let closeicon;
	let current;
	let mounted;
	let dispose;
	closeicon = new close_svelte({ props: { width: "0.8em" } });

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(closeicon.$$.fragment);
			(0,internal/* attr */.CFu)(button, "class", "close svelte-16r76vy");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* mount_component */.wSR)(closeicon, button, null);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*click_handler*/ ctx[8]);
				mounted = true;
			}
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(closeicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(closeicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
			}

			(0,internal/* destroy_component */.Hbl)(closeicon);
			mounted = false;
			dispose();
		}
	};
}

function Toast_svelte_create_fragment(ctx) {
	let article;
	let t0;
	let current_block_type_index;
	let if_block1;
	let t1;
	let div;
	let t2;
	let article_class_value;
	let article_transition;
	let current;
	let if_block0 = /*$settings*/ ctx[2].toastArt && create_if_block_3(ctx);
	const if_block_creators = [Toast_svelte_create_if_block_1, Toast_svelte_create_if_block_2, Toast_svelte_create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*type*/ ctx[0] === "success") return 0;
		if (/*type*/ ctx[0] === "error") return 1;
		return 2;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	const default_slot_template = /*#slots*/ ctx[7].default;
	const default_slot = (0,internal/* create_slot */.Of3)(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
	let if_block2 = /*dismissible*/ ctx[1] && Toast_svelte_create_if_block(ctx);

	return {
		c() {
			article = (0,internal/* element */.ND4)("article");
			if (if_block0) if_block0.c();
			t0 = (0,internal/* space */.xem)();
			if_block1.c();
			t1 = (0,internal/* space */.xem)();
			div = (0,internal/* element */.ND4)("div");
			if (default_slot) default_slot.c();
			t2 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			(0,internal/* attr */.CFu)(div, "class", "text svelte-16r76vy");
			(0,internal/* attr */.CFu)(article, "class", article_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*classes*/ ctx[5].push(/*type*/ ctx[0]).join(' ')) + " svelte-16r76vy"));
			(0,internal/* attr */.CFu)(article, "role", "alert");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, article, anchor);
			if (if_block0) if_block0.m(article, null);
			(0,internal/* append */.BCw)(article, t0);
			if_blocks[current_block_type_index].m(article, null);
			(0,internal/* append */.BCw)(article, t1);
			(0,internal/* append */.BCw)(article, div);

			if (default_slot) {
				default_slot.m(div, null);
			}

			(0,internal/* append */.BCw)(article, t2);
			if (if_block2) if_block2.m(article, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*$settings*/ ctx[2].toastArt) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(article, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index !== previous_block_index) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,internal/* check_outros */.GYV)();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				} else {
					
				}

				(0,internal/* transition_in */.c7F)(if_block1, 1);
				if_block1.m(article, t1);
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
					(0,internal/* update_slot_base */.nkG)(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[6],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[6])
						: (0,internal/* get_slot_changes */.sWk)(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
						null
					);
				}
			}

			if (/*dismissible*/ ctx[1]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*dismissible*/ 2) {
						(0,internal/* transition_in */.c7F)(if_block2, 1);
					}
				} else {
					if_block2 = Toast_svelte_create_if_block(ctx);
					if_block2.c();
					(0,internal/* transition_in */.c7F)(if_block2, 1);
					if_block2.m(article, null);
				}
			} else if (if_block2) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}

			if (!current || dirty & /*type*/ 1 && article_class_value !== (article_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*classes*/ ctx[5].push(/*type*/ ctx[0]).join(' ')) + " svelte-16r76vy"))) {
				(0,internal/* attr */.CFu)(article, "class", article_class_value);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block1);
			(0,internal/* transition_in */.c7F)(default_slot, local);
			(0,internal/* transition_in */.c7F)(if_block2);

			if (local) {
				(0,internal/* add_render_callback */.Dti)(() => {
					if (!current) return;
					if (!article_transition) article_transition = (0,internal/* create_bidirectional_transition */.h86)(article, transition/* fade */.Rv, {}, true);
					article_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block1);
			(0,internal/* transition_out */.Tn8)(default_slot, local);
			(0,internal/* transition_out */.Tn8)(if_block2);

			if (local) {
				if (!article_transition) article_transition = (0,internal/* create_bidirectional_transition */.h86)(article, transition/* fade */.Rv, {}, false);
				article_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(article);
			}

			if (if_block0) if_block0.d();
			if_blocks[current_block_type_index].d();
			if (default_slot) default_slot.d(detaching);
			if (if_block2) if_block2.d();
			if (detaching && article_transition) article_transition.end();
		}
	};
}

function Toast_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(2, $settings = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	let svgId = (0,v4/* default */.A)();
	let classes = ['toast'];
	let { type = "error" } = $$props;
	let { dismissible = true } = $$props;

	(0,runtime/* onMount */.Rc)(() => {
		if ($settings.toastArt) {
			classes.push('art');
			let draw = SVG().addTo('#svg' + svgId).size(320, 320);
			let rect = draw.rect(100, 100).attr({ fill: '#f06' });
		}
	});

	const click_handler = () => dispatch("dismiss");

	$$self.$$set = $$props => {
		if ('type' in $$props) $$invalidate(0, type = $$props.type);
		if ('dismissible' in $$props) $$invalidate(1, dismissible = $$props.dismissible);
		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
	};

	return [
		type,
		dismissible,
		$settings,
		dispatch,
		svgId,
		classes,
		$$scope,
		slots,
		click_handler
	];
}

class Toast extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Toast_svelte_instance, Toast_svelte_create_fragment, internal/* safe_not_equal */.jXN, { type: 0, dismissible: 1 });
	}
}

/* harmony default export */ const Toast_svelte = (Toast);

;// ./src/Toasts.svelte
/* src/Toasts.svelte generated by Svelte v4.2.19 */






function Toasts_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

// (6:0) {#if $toasts}
function Toasts_svelte_create_if_block(ctx) {
	let section;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*$toasts*/ ctx[0]);
	const get_key = ctx => /*toast*/ ctx[2].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = Toasts_svelte_get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = Toasts_svelte_create_each_block(key, child_ctx));
	}

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(section, "name", "toasts");
			(0,internal/* attr */.CFu)(section, "class", "svelte-1wow8bn");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(section, null);
				}
			}

			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*$toasts*/ 1) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*$toasts*/ ctx[0]);
				(0,internal/* group_outros */.V44)();
				each_blocks = (0,internal/* update_keyed_each */.l7s)(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, internal/* outro_and_destroy_block */.XP4, Toasts_svelte_create_each_block, null, Toasts_svelte_get_each_context);
				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (9:6) <Toast         type={toast.type}         dismissible={toast.dismissible}         on:dismiss={() => dismissToast(toast.id)}>
function create_default_slot(ctx) {
	let t_value = /*toast*/ ctx[2].message + "";
	let t;

	return {
		c() {
			t = (0,internal/* text */.Qq7)(t_value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*$toasts*/ 1 && t_value !== (t_value = /*toast*/ ctx[2].message + "")) (0,internal/* set_data */.iQh)(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t);
			}
		}
	};
}

// (8:4) {#each $toasts as toast (toast.id)}
function Toasts_svelte_create_each_block(key_1, ctx) {
	let first;
	let toast_1;
	let current;

	function dismiss_handler() {
		return /*dismiss_handler*/ ctx[1](/*toast*/ ctx[2]);
	}

	toast_1 = new Toast_svelte({
			props: {
				type: /*toast*/ ctx[2].type,
				dismissible: /*toast*/ ctx[2].dismissible,
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	toast_1.$on("dismiss", dismiss_handler);

	return {
		key: key_1,
		first: null,
		c() {
			first = (0,internal/* empty */.Iex)();
			(0,internal/* create_component */.N0i)(toast_1.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, first, anchor);
			(0,internal/* mount_component */.wSR)(toast_1, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const toast_1_changes = {};
			if (dirty & /*$toasts*/ 1) toast_1_changes.type = /*toast*/ ctx[2].type;
			if (dirty & /*$toasts*/ 1) toast_1_changes.dismissible = /*toast*/ ctx[2].dismissible;

			if (dirty & /*$$scope, $toasts*/ 33) {
				toast_1_changes.$$scope = { dirty, ctx };
			}

			toast_1.$set(toast_1_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(toast_1.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(toast_1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(first);
			}

			(0,internal/* destroy_component */.Hbl)(toast_1, detaching);
		}
	};
}

function Toasts_svelte_create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$toasts*/ ctx[0] && Toasts_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*$toasts*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$toasts*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block, 1);
					}
				} else {
					if_block = Toasts_svelte_create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.c7F)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

function Toasts_svelte_instance($$self, $$props, $$invalidate) {
	let $toasts;
	(0,internal/* component_subscribe */.j0C)($$self, toasts, $$value => $$invalidate(0, $toasts = $$value));
	const dismiss_handler = toast => dismissToast(toast.id);
	return [$toasts, dismiss_handler];
}

class Toasts extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Toasts_svelte_instance, Toasts_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const Toasts_svelte = (Toasts);

;// ./src/Modal.svelte
/* src/Modal.svelte generated by Svelte v4.2.19 */






function Modal_svelte_create_else_block(ctx) {
	let section;
	let p;
	let t1;
	let button;
	let closeicon;
	let current;
	let mounted;
	let dispose;
	closeicon = new close_svelte({ props: { width: "1.5em" } });

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");
			p = (0,internal/* element */.ND4)("p");
			p.textContent = "This is not the modal you're looking for....";
			t1 = (0,internal/* space */.xem)();
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(closeicon.$$.fragment);
			(0,internal/* attr */.CFu)(button, "class", "close");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* append */.BCw)(section, p);
			(0,internal/* append */.BCw)(section, t1);
			(0,internal/* append */.BCw)(section, button);
			(0,internal/* mount_component */.wSR)(closeicon, button, null);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*dismissModal*/ ctx[2]);
				mounted = true;
			}
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(closeicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(closeicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_component */.Hbl)(closeicon);
			mounted = false;
			dispose();
		}
	};
}

// (20:0) {#if modal}
function Modal_svelte_create_if_block(ctx) {
	let section;
	let div;
	let t0;
	let t1;
	let t2;
	let button;
	let closeicon;
	let section_name_value;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*modal*/ ctx[1].title && Modal_svelte_create_if_block_3(ctx);
	let if_block1 = /*modal*/ ctx[1].message && Modal_svelte_create_if_block_2(ctx);
	let if_block2 = /*modal*/ ctx[1].component && Modal_svelte_create_if_block_1(ctx);
	closeicon = new close_svelte({ props: { width: "1.5em" } });

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");
			div = (0,internal/* element */.ND4)("div");
			if (if_block0) if_block0.c();
			t0 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			t1 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			t2 = (0,internal/* space */.xem)();
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(closeicon.$$.fragment);
			(0,internal/* attr */.CFu)(button, "class", "icon close");
			(0,internal/* attr */.CFu)(div, "class", "content");
			(0,internal/* attr */.CFu)(section, "class", "modal svelte-ud3qd5");
			(0,internal/* attr */.CFu)(section, "name", section_name_value = /*modal*/ ctx[1].title);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* append */.BCw)(section, div);
			if (if_block0) if_block0.m(div, null);
			(0,internal/* append */.BCw)(div, t0);
			if (if_block1) if_block1.m(div, null);
			(0,internal/* append */.BCw)(div, t1);
			if (if_block2) if_block2.m(div, null);
			(0,internal/* append */.BCw)(div, t2);
			(0,internal/* append */.BCw)(div, button);
			(0,internal/* mount_component */.wSR)(closeicon, button, null);
			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*dismissModal*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*modal*/ ctx[1].title) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = Modal_svelte_create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(div, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*modal*/ ctx[1].message) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = Modal_svelte_create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(div, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*modal*/ ctx[1].component) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*modal*/ 2) {
						(0,internal/* transition_in */.c7F)(if_block2, 1);
					}
				} else {
					if_block2 = Modal_svelte_create_if_block_1(ctx);
					if_block2.c();
					(0,internal/* transition_in */.c7F)(if_block2, 1);
					if_block2.m(div, t2);
				}
			} else if (if_block2) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}

			if (!current || dirty & /*modal*/ 2 && section_name_value !== (section_name_value = /*modal*/ ctx[1].title)) {
				(0,internal/* attr */.CFu)(section, "name", section_name_value);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block2);
			(0,internal/* transition_in */.c7F)(closeicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block2);
			(0,internal/* transition_out */.Tn8)(closeicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			(0,internal/* destroy_component */.Hbl)(closeicon);
			mounted = false;
			dispose();
		}
	};
}

// (23:8) {#if modal.title}
function Modal_svelte_create_if_block_3(ctx) {
	let h2;
	let t_value = /*modal*/ ctx[1].title + "";
	let t;

	return {
		c() {
			h2 = (0,internal/* element */.ND4)("h2");
			t = (0,internal/* text */.Qq7)(t_value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h2, anchor);
			(0,internal/* append */.BCw)(h2, t);
		},
		p(ctx, dirty) {
			if (dirty & /*modal*/ 2 && t_value !== (t_value = /*modal*/ ctx[1].title + "")) (0,internal/* set_data */.iQh)(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h2);
			}
		}
	};
}

// (27:8) {#if modal.message}
function Modal_svelte_create_if_block_2(ctx) {
	let p;
	let t_value = /*modal*/ ctx[1].message + "";
	let t;

	return {
		c() {
			p = (0,internal/* element */.ND4)("p");
			t = (0,internal/* text */.Qq7)(t_value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, p, anchor);
			(0,internal/* append */.BCw)(p, t);
		},
		p(ctx, dirty) {
			if (dirty & /*modal*/ 2 && t_value !== (t_value = /*modal*/ ctx[1].message + "")) (0,internal/* set_data */.iQh)(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(p);
			}
		}
	};
}

// (31:8) {#if modal.component}
function Modal_svelte_create_if_block_1(ctx) {
	let switch_instance;
	let updating_source;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*modal*/ ctx[1].data];

	function switch_instance_source_binding(value) {
		/*switch_instance_source_binding*/ ctx[3](value);
	}

	var switch_value = /*modal*/ ctx[1].component;

	function switch_props(ctx, dirty) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = (0,internal/* assign */.kpz)(switch_instance_props, switch_instance_spread_levels[i]);
		}

		if (dirty !== undefined && dirty & /*modal*/ 2) {
			switch_instance_props = (0,internal/* assign */.kpz)(switch_instance_props, (0,internal/* get_spread_update */.HN9)(switch_instance_spread_levels, [(0,internal/* get_spread_object */.lRO)(/*modal*/ ctx[1].data)]));
		}

		if (/*source*/ ctx[0] !== void 0) {
			switch_instance_props.source = /*source*/ ctx[0];
		}

		return { props: switch_instance_props };
	}

	if (switch_value) {
		switch_instance = (0,internal/* construct_svelte_component */.obh)(switch_value, switch_props(ctx));
		internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(switch_instance, 'source', switch_instance_source_binding));
	}

	return {
		c() {
			if (switch_instance) (0,internal/* create_component */.N0i)(switch_instance.$$.fragment);
			switch_instance_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if (switch_instance) (0,internal/* mount_component */.wSR)(switch_instance, target, anchor);
			(0,internal/* insert */.Yry)(target, switch_instance_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*modal*/ 2 && switch_value !== (switch_value = /*modal*/ ctx[1].component)) {
				if (switch_instance) {
					(0,internal/* group_outros */.V44)();
					const old_component = switch_instance;

					(0,internal/* transition_out */.Tn8)(old_component.$$.fragment, 1, 0, () => {
						(0,internal/* destroy_component */.Hbl)(old_component, 1);
					});

					(0,internal/* check_outros */.GYV)();
				}

				if (switch_value) {
					switch_instance = (0,internal/* construct_svelte_component */.obh)(switch_value, switch_props(ctx, dirty));
					internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(switch_instance, 'source', switch_instance_source_binding));
					(0,internal/* create_component */.N0i)(switch_instance.$$.fragment);
					(0,internal/* transition_in */.c7F)(switch_instance.$$.fragment, 1);
					(0,internal/* mount_component */.wSR)(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				const switch_instance_changes = (dirty & /*modal*/ 2)
				? (0,internal/* get_spread_update */.HN9)(switch_instance_spread_levels, [(0,internal/* get_spread_object */.lRO)(/*modal*/ ctx[1].data)])
				: {};

				if (!updating_source && dirty & /*source*/ 1) {
					updating_source = true;
					switch_instance_changes.source = /*source*/ ctx[0];
					(0,internal/* add_flush_callback */.Jk$)(() => updating_source = false);
				}

				switch_instance.$set(switch_instance_changes);
			}
		},
		i(local) {
			if (current) return;
			if (switch_instance) (0,internal/* transition_in */.c7F)(switch_instance.$$.fragment, local);
			current = true;
		},
		o(local) {
			if (switch_instance) (0,internal/* transition_out */.Tn8)(switch_instance.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(switch_instance_anchor);
			}

			if (switch_instance) (0,internal/* destroy_component */.Hbl)(switch_instance, detaching);
		}
	};
}

function Modal_svelte_create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [Modal_svelte_create_if_block, Modal_svelte_create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*modal*/ ctx[1]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,internal/* check_outros */.GYV)();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				(0,internal/* transition_in */.c7F)(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			if_blocks[current_block_type_index].d(detaching);
		}
	};
}

function Modal_svelte_instance($$self, $$props, $$invalidate) {
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	let { source } = $$props;
	let { modal } = $$props;

	function dismissModal() {
		dispatch("dismiss");
	}

	function switch_instance_source_binding(value) {
		source = value;
		$$invalidate(0, source);
	}

	$$self.$$set = $$props => {
		if ('source' in $$props) $$invalidate(0, source = $$props.source);
		if ('modal' in $$props) $$invalidate(1, modal = $$props.modal);
	};

	return [source, modal, dismissModal, switch_instance_source_binding];
}

class Modal_svelte_Modal extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Modal_svelte_instance, Modal_svelte_create_fragment, internal/* safe_not_equal */.jXN, { source: 0, modal: 1 });
	}
}

/* harmony default export */ const Modal_svelte = (Modal_svelte_Modal);

;// ./src/Modals.svelte
/* src/Modals.svelte generated by Svelte v4.2.19 */







function Modals_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	child_ctx[4] = list;
	child_ctx[5] = i;
	return child_ctx;
}

// (7:0) {#if $modals}
function Modals_svelte_create_if_block(ctx) {
	let section;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let section_transition;
	let current;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*$modals*/ ctx[0]);
	const get_key = ctx => /*modal*/ ctx[3].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = Modals_svelte_get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = Modals_svelte_create_each_block(key, child_ctx));
	}

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(section, "name", "modals");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(section, null);
				}
			}

			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*$modals*/ 1) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*$modals*/ ctx[0]);
				(0,internal/* group_outros */.V44)();
				each_blocks = (0,internal/* update_keyed_each */.l7s)(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, internal/* outro_and_destroy_block */.XP4, Modals_svelte_create_each_block, null, Modals_svelte_get_each_context);
				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			if (local) {
				(0,internal/* add_render_callback */.Dti)(() => {
					if (!current) return;
					if (!section_transition) section_transition = (0,internal/* create_bidirectional_transition */.h86)(section, transition/* fade */.Rv, {}, true);
					section_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			if (local) {
				if (!section_transition) section_transition = (0,internal/* create_bidirectional_transition */.h86)(section, transition/* fade */.Rv, {}, false);
				section_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (detaching && section_transition) section_transition.end();
		}
	};
}

// (9:4) {#each $modals as modal (modal.id)}
function Modals_svelte_create_each_block(key_1, ctx) {
	let first;
	let modal_1;
	let updating_source;
	let current;

	function modal_1_source_binding(value) {
		/*modal_1_source_binding*/ ctx[1](value, /*modal*/ ctx[3]);
	}

	function dismiss_handler() {
		return /*dismiss_handler*/ ctx[2](/*modal*/ ctx[3]);
	}

	let modal_1_props = { modal: /*modal*/ ctx[3] };

	if (/*modal*/ ctx[3].source !== void 0) {
		modal_1_props.source = /*modal*/ ctx[3].source;
	}

	modal_1 = new Modal_svelte({ props: modal_1_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(modal_1, 'source', modal_1_source_binding));
	modal_1.$on("dismiss", dismiss_handler);

	return {
		key: key_1,
		first: null,
		c() {
			first = (0,internal/* empty */.Iex)();
			(0,internal/* create_component */.N0i)(modal_1.$$.fragment);
			this.first = first;
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, first, anchor);
			(0,internal/* mount_component */.wSR)(modal_1, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const modal_1_changes = {};
			if (dirty & /*$modals*/ 1) modal_1_changes.modal = /*modal*/ ctx[3];

			if (!updating_source && dirty & /*$modals*/ 1) {
				updating_source = true;
				modal_1_changes.source = /*modal*/ ctx[3].source;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source = false);
			}

			modal_1.$set(modal_1_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(modal_1.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(modal_1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(first);
			}

			(0,internal/* destroy_component */.Hbl)(modal_1, detaching);
		}
	};
}

function Modals_svelte_create_fragment(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$modals*/ ctx[0] && Modals_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = (0,internal/* empty */.Iex)();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*$modals*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$modals*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block, 1);
					}
				} else {
					if_block = Modals_svelte_create_if_block(ctx);
					if_block.c();
					(0,internal/* transition_in */.c7F)(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block, 1, 1, () => {
					if_block = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

function Modals_svelte_instance($$self, $$props, $$invalidate) {
	let $modals;
	(0,internal/* component_subscribe */.j0C)($$self, modals, $$value => $$invalidate(0, $modals = $$value));

	function modal_1_source_binding(value, modal) {
		if ($$self.$$.not_equal(modal.source, value)) {
			modal.source = value;
			modals.set($modals);
		}
	}

	const dismiss_handler = modal => dismissModal(modal.id);
	return [$modals, modal_1_source_binding, dismiss_handler];
}

class Modals extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Modals_svelte_instance, Modals_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const Modals_svelte = (Modals);
;// ./src/App.svelte
/* src/App.svelte generated by Svelte v4.2.19 */









function App_svelte_create_fragment(ctx) {
	let toasts;
	let t0;
	let div;
	let navigation;
	let t1;
	let main;
	let docbrowser;
	let t2;
	let modals;
	let div_data_light_mode_value;
	let current;
	toasts = new Toasts_svelte({});
	navigation = new Navigation_svelte({});
	docbrowser = new DocBrowser_svelte({});
	modals = new Modals_svelte({});

	return {
		c() {
			(0,internal/* create_component */.N0i)(toasts.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			div = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(navigation.$$.fragment);
			t1 = (0,internal/* space */.xem)();
			main = (0,internal/* element */.ND4)("main");
			(0,internal/* create_component */.N0i)(docbrowser.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(modals.$$.fragment);
			(0,internal/* attr */.CFu)(div, "data-light-mode", div_data_light_mode_value = /*$settings*/ ctx[0].lightMode);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(toasts, target, anchor);
			(0,internal/* insert */.Yry)(target, t0, anchor);
			(0,internal/* insert */.Yry)(target, div, anchor);
			(0,internal/* mount_component */.wSR)(navigation, div, null);
			(0,internal/* append */.BCw)(div, t1);
			(0,internal/* append */.BCw)(div, main);
			(0,internal/* mount_component */.wSR)(docbrowser, main, null);
			(0,internal/* append */.BCw)(div, t2);
			(0,internal/* mount_component */.wSR)(modals, div, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (!current || dirty & /*$settings*/ 1 && div_data_light_mode_value !== (div_data_light_mode_value = /*$settings*/ ctx[0].lightMode)) {
				(0,internal/* attr */.CFu)(div, "data-light-mode", div_data_light_mode_value);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(toasts.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(navigation.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(docbrowser.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(modals.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(toasts.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(navigation.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(docbrowser.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(modals.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(t0);
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_component */.Hbl)(toasts, detaching);
			(0,internal/* destroy_component */.Hbl)(navigation);
			(0,internal/* destroy_component */.Hbl)(docbrowser);
			(0,internal/* destroy_component */.Hbl)(modals);
		}
	};
}

function App_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(0, $settings = $$value));
	return [$settings];
}

class App extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, App_svelte_instance, App_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const App_svelte = (App);
;// ./src/main.js


const app = new App_svelte({
	target: document.body,
	props: {
		name: 'wyrd'
	}
});

window.app = app;

/* harmony default export */ const main = ((/* unused pure expression or super */ null && (app)));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			23: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkwyrd"] = self["webpackChunkwyrd"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, [522], () => (__webpack_require__(114)))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [522], () => (__webpack_require__(229)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;