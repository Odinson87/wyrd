/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 114:
/***/ (() => {

// extracted by mini-css-extract-plugin


/***/ }),

/***/ 292:
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
// EXTERNAL MODULE: ./node_modules/pouchdb-browser/lib/index.es.js + 5 modules
var index_es = __webpack_require__(295);
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
    Activity: new lib_Tag("Activity", "Activity", "#44BBFF")
}

const TagsEnum = {
    Reward: new lib_Tag("Reward", "Activity", "#99EE00"),
    Garden: new lib_Tag("Garden", "Activity", "#BBD686"),
    Project: new lib_Tag("Project", "Activity", "#348aa7"),
    Chore: new lib_Tag("Chore", "Activity", "#D999B9"),
    Shopping: new lib_Tag("Shopping", "Activity", "#C57B57"),
    Health: new lib_Tag("Health", "Activity", "#179889"),
    Trigger:  new lib_Tag("Trigger", "Activity", "#EE6000"),
    Distraction: new lib_Tag("Distraction", "Activity", "#EECA3A")
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
;// ./src/lib/input/TagObject.svelte
/* src/lib/input/TagObject.svelte generated by Svelte v4.2.19 */










function TagObject_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	return child_ctx;
}

// (80:12) {#each Object.keys($settings.activityTypes) as tagName}
function TagObject_svelte_create_each_block(ctx) {
	let option;
	let t_value = /*tagName*/ ctx[9] + "";
	let t;
	let option_value_value;

	return {
		c() {
			option = (0,internal/* element */.ND4)("option");
			t = (0,internal/* text */.Qq7)(t_value);
			option.__value = option_value_value = /*tagName*/ ctx[9];
			(0,internal/* set_input_value */.Gvd)(option, option.__value);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, option, anchor);
			(0,internal/* append */.BCw)(option, t);
		},
		p(ctx, dirty) {
			if (dirty & /*$settings*/ 2 && t_value !== (t_value = /*tagName*/ ctx[9] + "")) (0,internal/* set_data */.iQh)(t, t_value);

			if (dirty & /*$settings*/ 2 && option_value_value !== (option_value_value = /*tagName*/ ctx[9])) {
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

function TagObject_svelte_create_fragment(ctx) {
	let article;
	let header;
	let div0;
	let h3;
	let t0_value = /*tag*/ ctx[0].name + "";
	let t0;
	let t1;
	let div1;
	let button0;
	let saveicon;
	let t2;
	let button1;
	let deleteicon;
	let t3;
	let div2;
	let label0;
	let t5;
	let select;
	let t6;
	let div3;
	let label1;
	let t8;
	let input;
	let article_transition;
	let current;
	let mounted;
	let dispose;
	saveicon = new save_svelte({});
	deleteicon = new bin_svelte({});
	let each_value = (0,internal/* ensure_array_like */.rv_)(Object.keys(/*$settings*/ ctx[1].activityTypes));
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = TagObject_svelte_create_each_block(TagObject_svelte_get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			article = (0,internal/* element */.ND4)("article");
			header = (0,internal/* element */.ND4)("header");
			div0 = (0,internal/* element */.ND4)("div");
			h3 = (0,internal/* element */.ND4)("h3");
			t0 = (0,internal/* text */.Qq7)(t0_value);
			t1 = (0,internal/* space */.xem)();
			div1 = (0,internal/* element */.ND4)("div");
			button0 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(saveicon.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			button1 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(deleteicon.$$.fragment);
			t3 = (0,internal/* space */.xem)();
			div2 = (0,internal/* element */.ND4)("div");
			label0 = (0,internal/* element */.ND4)("label");
			label0.textContent = "Type :";
			t5 = (0,internal/* space */.xem)();
			select = (0,internal/* element */.ND4)("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = (0,internal/* space */.xem)();
			div3 = (0,internal/* element */.ND4)("div");
			label1 = (0,internal/* element */.ND4)("label");
			label1.textContent = "Color :";
			t8 = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			(0,internal/* attr */.CFu)(h3, "class", "svelte-1azi0ca");
			(0,internal/* attr */.CFu)(div0, "class", "svelte-1azi0ca");
			(0,internal/* attr */.CFu)(button0, "class", "icon svelte-1azi0ca");
			(0,internal/* attr */.CFu)(button1, "class", "icon svelte-1azi0ca");
			(0,internal/* attr */.CFu)(div1, "class", "svelte-1azi0ca");
			(0,internal/* attr */.CFu)(header, "class", "svelte-1azi0ca");
			(0,internal/* attr */.CFu)(label0, "for", "type");
			(0,internal/* attr */.CFu)(select, "name", "type");
			if (/*tag*/ ctx[0].type === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select_change_handler*/ ctx[4].call(select));
			(0,internal/* attr */.CFu)(div2, "class", "input-group svelte-1azi0ca");
			(0,internal/* attr */.CFu)(label1, "for", "hexColor");
			(0,internal/* attr */.CFu)(input, "type", "color");
			(0,internal/* attr */.CFu)(input, "name", "hexColor");
			(0,internal/* attr */.CFu)(input, "class", "svelte-1azi0ca");
			(0,internal/* attr */.CFu)(div3, "class", "input-group svelte-1azi0ca");
			(0,internal/* set_style */.hgi)(article, "border-color", /*tag*/ ctx[0].hex);
			(0,internal/* attr */.CFu)(article, "class", "svelte-1azi0ca");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, article, anchor);
			(0,internal/* append */.BCw)(article, header);
			(0,internal/* append */.BCw)(header, div0);
			(0,internal/* append */.BCw)(div0, h3);
			(0,internal/* append */.BCw)(h3, t0);
			(0,internal/* append */.BCw)(header, t1);
			(0,internal/* append */.BCw)(header, div1);
			(0,internal/* append */.BCw)(div1, button0);
			(0,internal/* mount_component */.wSR)(saveicon, button0, null);
			(0,internal/* append */.BCw)(div1, t2);
			(0,internal/* append */.BCw)(div1, button1);
			(0,internal/* mount_component */.wSR)(deleteicon, button1, null);
			(0,internal/* append */.BCw)(article, t3);
			(0,internal/* append */.BCw)(article, div2);
			(0,internal/* append */.BCw)(div2, label0);
			(0,internal/* append */.BCw)(div2, t5);
			(0,internal/* append */.BCw)(div2, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			(0,internal/* select_option */.fs8)(select, /*tag*/ ctx[0].type, true);
			(0,internal/* append */.BCw)(article, t6);
			(0,internal/* append */.BCw)(article, div3);
			(0,internal/* append */.BCw)(div3, label1);
			(0,internal/* append */.BCw)(div3, t8);
			(0,internal/* append */.BCw)(div3, input);
			(0,internal/* set_input_value */.Gvd)(input, /*tag*/ ctx[0].hex);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(button0, "click", /*debouncedSave*/ ctx[2]),
					(0,internal/* listen */.KTR)(button1, "click", /*debouncedRemove*/ ctx[3]),
					(0,internal/* listen */.KTR)(select, "change", /*select_change_handler*/ ctx[4]),
					(0,internal/* listen */.KTR)(input, "input", /*input_input_handler*/ ctx[5])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if ((!current || dirty & /*tag*/ 1) && t0_value !== (t0_value = /*tag*/ ctx[0].name + "")) (0,internal/* set_data */.iQh)(t0, t0_value);

			if (dirty & /*Object, $settings*/ 2) {
				each_value = (0,internal/* ensure_array_like */.rv_)(Object.keys(/*$settings*/ ctx[1].activityTypes));
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = TagObject_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = TagObject_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*tag, Object, $settings*/ 3) {
				(0,internal/* select_option */.fs8)(select, /*tag*/ ctx[0].type);
			}

			if (dirty & /*tag, Object, $settings*/ 3) {
				(0,internal/* set_input_value */.Gvd)(input, /*tag*/ ctx[0].hex);
			}

			if (!current || dirty & /*tag*/ 1) {
				(0,internal/* set_style */.hgi)(article, "border-color", /*tag*/ ctx[0].hex);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(saveicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(deleteicon.$$.fragment, local);

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
			(0,internal/* transition_out */.Tn8)(saveicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(deleteicon.$$.fragment, local);

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

			(0,internal/* destroy_component */.Hbl)(saveicon);
			(0,internal/* destroy_component */.Hbl)(deleteicon);
			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
			if (detaching && article_transition) article_transition.end();
			mounted = false;
			(0,internal/* run_all */.oOW)(dispose);
		}
	};
}

function TagObject_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(1, $settings = $$value));
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	const debouncedSave = (0,lodash.debounce)(save, 1000);
	const debouncedRemove = (0,lodash.debounce)(remove, 1000);
	let { tag } = $$props;

	function remove() {
		dispatch('remove', { tag });
	}

	function save() {
		dispatch('save', { tag });
	}

	(0,runtime/* onMount */.Rc)(() => {
		
	}); //console.log($settings.activityTypes)

	function select_change_handler() {
		tag.type = (0,internal/* select_value */.Hw5)(this);
		$$invalidate(0, tag);
	}

	function input_input_handler() {
		tag.hex = this.value;
		$$invalidate(0, tag);
	}

	$$self.$$set = $$props => {
		if ('tag' in $$props) $$invalidate(0, tag = $$props.tag);
	};

	return [
		tag,
		$settings,
		debouncedSave,
		debouncedRemove,
		select_change_handler,
		input_input_handler
	];
}

class TagObject extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, TagObject_svelte_instance, TagObject_svelte_create_fragment, internal/* safe_not_equal */.jXN, { tag: 0 });
	}
}

/* harmony default export */ const TagObject_svelte = (TagObject);

;// ./src/lib/input/SearchArray.svelte
/* src/lib/input/SearchArray.svelte generated by Svelte v4.2.19 */




function SearchArray_svelte_create_if_block(ctx) {
	let label_1;
	let t0;
	let t1;

	return {
		c() {
			label_1 = (0,internal/* element */.ND4)("label");
			t0 = (0,internal/* text */.Qq7)(/*label*/ ctx[1]);
			t1 = (0,internal/* text */.Qq7)(":");
			(0,internal/* attr */.CFu)(label_1, "for", /*name*/ ctx[2]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, label_1, anchor);
			(0,internal/* append */.BCw)(label_1, t0);
			(0,internal/* append */.BCw)(label_1, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 2) (0,internal/* set_data */.iQh)(t0, /*label*/ ctx[1]);

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

function SearchArray_svelte_create_fragment(ctx) {
	let t;
	let input;
	let mounted;
	let dispose;
	let if_block = typeof /*label*/ ctx[1] !== "undefined" && SearchArray_svelte_create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			t = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[2]);
			(0,internal/* attr */.CFu)(input, "type", "search");
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			(0,internal/* insert */.Yry)(target, t, anchor);
			(0,internal/* insert */.Yry)(target, input, anchor);
			(0,internal/* set_input_value */.Gvd)(input, /*term*/ ctx[0]);

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(input, "keyup", /*search*/ ctx[3]),
					(0,internal/* listen */.KTR)(input, "input", /*input_input_handler*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (typeof /*label*/ ctx[1] !== "undefined") {
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

			if (dirty & /*name*/ 4) {
				(0,internal/* attr */.CFu)(input, "name", /*name*/ ctx[2]);
			}

			if (dirty & /*term*/ 1 && input.value !== /*term*/ ctx[0]) {
				(0,internal/* set_input_value */.Gvd)(input, /*term*/ ctx[0]);
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
	let { term } = $$props;
	let { source = [] } = $$props;
	let { results = [] } = $$props;
	let { label } = $$props;
	let { name } = $$props;

	function sourceChanged(s) {
		search();
	}

	function search() {
		if (term === '') {
			$$invalidate(4, results = source);
		} else {
			if (typeof term !== 'undefined' && term !== null && term !== '') {
				//console.log(term);
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
			} else {
				$$invalidate(4, results = source);
			}
		}
	}

	function input_input_handler() {
		term = this.value;
		$$invalidate(0, term);
	}

	$$self.$$set = $$props => {
		if ('term' in $$props) $$invalidate(0, term = $$props.term);
		if ('source' in $$props) $$invalidate(5, source = $$props.source);
		if ('results' in $$props) $$invalidate(4, results = $$props.results);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('name' in $$props) $$invalidate(2, name = $$props.name);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*source*/ 32) {
			$: {
				sourceChanged(source);
			}
		}
	};

	return [term, label, name, search, results, source, input_input_handler];
}

class SearchArray extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, SearchArray_svelte_instance, SearchArray_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			term: 0,
			source: 5,
			results: 4,
			label: 1,
			name: 2
		});
	}
}

/* harmony default export */ const SearchArray_svelte = (SearchArray);
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
;// ./src/components/TagEditor.svelte
/* src/components/TagEditor.svelte generated by Svelte v4.2.19 */











function TagEditor_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

// (79:8) {#if Object.hasOwn($settings.tags, tagName) }
function TagEditor_svelte_create_if_block(ctx) {
	let tagobject;
	let current;

	tagobject = new TagObject_svelte({
			props: {
				tag: /*$settings*/ ctx[1].tags[/*tagName*/ ctx[14]]
			}
		});

	tagobject.$on("save", /*save*/ ctx[6]);
	tagobject.$on("remove", /*deleteTag*/ ctx[7]);

	return {
		c() {
			(0,internal/* create_component */.N0i)(tagobject.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(tagobject, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const tagobject_changes = {};
			if (dirty & /*$settings, filteredTags*/ 10) tagobject_changes.tag = /*$settings*/ ctx[1].tags[/*tagName*/ ctx[14]];
			tagobject.$set(tagobject_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(tagobject.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(tagobject.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(tagobject, detaching);
		}
	};
}

// (78:4) {#each filteredTags as tagName}
function TagEditor_svelte_create_each_block(ctx) {
	let show_if = Object.hasOwn(/*$settings*/ ctx[1].tags, /*tagName*/ ctx[14]);
	let if_block_anchor;
	let current;
	let if_block = show_if && TagEditor_svelte_create_if_block(ctx);

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
		p(ctx, dirty) {
			if (dirty & /*$settings, filteredTags*/ 10) show_if = Object.hasOwn(/*$settings*/ ctx[1].tags, /*tagName*/ ctx[14]);

			if (show_if) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$settings, filteredTags*/ 10) {
						(0,internal/* transition_in */.c7F)(if_block, 1);
					}
				} else {
					if_block = TagEditor_svelte_create_if_block(ctx);
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

function TagEditor_svelte_create_fragment(ctx) {
	let h3;
	let t1;
	let searcharray;
	let updating_term;
	let updating_results;
	let updating_source;
	let t2;
	let button;
	let addicon;
	let t3;
	let section;
	let current;
	let mounted;
	let dispose;

	function searcharray_term_binding(value) {
		/*searcharray_term_binding*/ ctx[8](value);
	}

	function searcharray_results_binding(value) {
		/*searcharray_results_binding*/ ctx[9](value);
	}

	function searcharray_source_binding(value) {
		/*searcharray_source_binding*/ ctx[10](value);
	}

	let searcharray_props = { name: "search-tags" };

	if (/*searchTerm*/ ctx[4] !== void 0) {
		searcharray_props.term = /*searchTerm*/ ctx[4];
	}

	if (/*searchResults*/ ctx[0] !== void 0) {
		searcharray_props.results = /*searchResults*/ ctx[0];
	}

	if (/*availableTags*/ ctx[2] !== void 0) {
		searcharray_props.source = /*availableTags*/ ctx[2];
	}

	searcharray = new SearchArray_svelte({ props: searcharray_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(searcharray, 'term', searcharray_term_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(searcharray, 'results', searcharray_results_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(searcharray, 'source', searcharray_source_binding));
	addicon = new plus_svelte({});
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*filteredTags*/ ctx[3]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = TagEditor_svelte_create_each_block(TagEditor_svelte_get_each_context(ctx, each_value, i));
	}

	const out = i => (0,internal/* transition_out */.Tn8)(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			h3 = (0,internal/* element */.ND4)("h3");
			h3.textContent = "Search or Add Tags";
			t1 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(searcharray.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(addicon.$$.fragment);
			t3 = (0,internal/* space */.xem)();
			section = (0,internal/* element */.ND4)("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(h3, "class", "svelte-164mia4");
			(0,internal/* attr */.CFu)(button, "class", "icon");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, h3, anchor);
			(0,internal/* insert */.Yry)(target, t1, anchor);
			(0,internal/* mount_component */.wSR)(searcharray, target, anchor);
			(0,internal/* insert */.Yry)(target, t2, anchor);
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* mount_component */.wSR)(addicon, button, null);
			(0,internal/* insert */.Yry)(target, t3, anchor);
			(0,internal/* insert */.Yry)(target, section, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(section, null);
				}
			}

			current = true;

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*debouncedAdd*/ ctx[5]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const searcharray_changes = {};

			if (!updating_term && dirty & /*searchTerm*/ 16) {
				updating_term = true;
				searcharray_changes.term = /*searchTerm*/ ctx[4];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_term = false);
			}

			if (!updating_results && dirty & /*searchResults*/ 1) {
				updating_results = true;
				searcharray_changes.results = /*searchResults*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_results = false);
			}

			if (!updating_source && dirty & /*availableTags*/ 4) {
				updating_source = true;
				searcharray_changes.source = /*availableTags*/ ctx[2];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source = false);
			}

			searcharray.$set(searcharray_changes);

			if (dirty & /*$settings, filteredTags, save, deleteTag, Object*/ 202) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*filteredTags*/ ctx[3]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = TagEditor_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						(0,internal/* transition_in */.c7F)(each_blocks[i], 1);
					} else {
						each_blocks[i] = TagEditor_svelte_create_each_block(child_ctx);
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
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(searcharray.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(addicon.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				(0,internal/* transition_in */.c7F)(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(searcharray.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(addicon.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				(0,internal/* transition_out */.Tn8)(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(h3);
				(0,internal/* detach */.YoD)(t1);
				(0,internal/* detach */.YoD)(t2);
				(0,internal/* detach */.YoD)(button);
				(0,internal/* detach */.YoD)(t3);
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_component */.Hbl)(searcharray, detaching);
			(0,internal/* destroy_component */.Hbl)(addicon);
			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

function TagEditor_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(1, $settings = $$value));
	let availableTags = Object.keys($settings.tags);
	let searchResults = availableTags;
	let filteredTags = availableTags;
	let searchTerm;
	const debouncedAdd = (0,lodash.debounce)(add, 500);

	function settingsUpdated(s) {
		$$invalidate(2, availableTags = Object.keys(s.tags));
	}

	function updateTags(resultTags) {
		$$invalidate(3, filteredTags = availableTags.filter(t => {
			// include if tag is in tag search results
			if (resultTags.indexOf(t) > -1) {
				return true;
			} else {
				return false;
			}
		}).sort());
	}

	function add() {
		if (searchTerm !== '' && !Object.hasOwn($settings.tags, searchTerm)) {
			let t = new lib_Tag(searchTerm, TypesEnum.Activity.name, '#777777');
			(0,internal/* set_store_value */.vu6)(settings, $settings.tags[t.name] = t, $settings);

			// trigger updates;
			settings.set($settings);
		}
	}

	function save(event) {
		const { tag } = event.detail;

		if (tag.name !== '') {
			(0,internal/* set_store_value */.vu6)(settings, $settings.tags[tag.name] = tag, $settings);
		}
	}

	function deleteTag(event) {
		const { tag } = event.detail;
		delete $settings.tags[tag.name];

		// trigger updates;
		settings.set($settings);
	}

	function searcharray_term_binding(value) {
		searchTerm = value;
		$$invalidate(4, searchTerm);
	}

	function searcharray_results_binding(value) {
		searchResults = value;
		$$invalidate(0, searchResults);
	}

	function searcharray_source_binding(value) {
		availableTags = value;
		$$invalidate(2, availableTags);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$settings*/ 2) {
			$: {
				settingsUpdated($settings);
			}
		}

		if ($$self.$$.dirty & /*searchResults*/ 1) {
			$: {
				updateTags(searchResults);
			}
		}
	};

	return [
		searchResults,
		$settings,
		availableTags,
		filteredTags,
		searchTerm,
		debouncedAdd,
		save,
		deleteTag,
		searcharray_term_binding,
		searcharray_results_binding,
		searcharray_source_binding
	];
}

class TagEditor extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, TagEditor_svelte_instance, TagEditor_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
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

;// ./src/components/LogEntry.svelte
/* src/components/LogEntry.svelte generated by Svelte v4.2.19 */









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

;// ./src/components/LogManager.svelte
/* src/components/LogManager.svelte generated by Svelte v4.2.19 */






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
        title: 'Configure Tags',
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

;// ./src/components/TagManager.svelte
/* src/components/TagManager.svelte generated by Svelte v4.2.19 */







function TagManager_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	return child_ctx;
}

function TagManager_svelte_get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	return child_ctx;
}

// (74:0) {:else}
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

// (61:0) {#if sourceHasTags}
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
		/*searcharray_results_binding*/ ctx[9](value);
	}

	let searcharray_props = {
		name: "search-tags",
		source: /*availableTags*/ ctx[2]
	};

	if (/*searchResults*/ ctx[1] !== void 0) {
		searcharray_props.results = /*searchResults*/ ctx[1];
	}

	searcharray = new SearchArray_svelte({ props: searcharray_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(searcharray, 'results', searcharray_results_binding));
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*filteredTags*/ ctx[3]);
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
			if (dirty & /*availableTags*/ 4) searcharray_changes.source = /*availableTags*/ ctx[2];

			if (!updating_results && dirty & /*searchResults*/ 2) {
				updating_results = true;
				searcharray_changes.results = /*searchResults*/ ctx[1];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_results = false);
			}

			searcharray.$set(searcharray_changes);

			if (dirty & /*filteredTags, add*/ 40) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*filteredTags*/ ctx[3]);
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

// (63:8) {#each source.tags as tagName}
function TagManager_svelte_create_each_block_1(ctx) {
	let tagbutton;
	let current;

	function tagClicked_handler() {
		return /*tagClicked_handler*/ ctx[8](/*tagName*/ ctx[13]);
	}

	tagbutton = new TagButton_svelte({ props: { tagName: /*tagName*/ ctx[13] } });
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
			if (dirty & /*source*/ 1) tagbutton_changes.tagName = /*tagName*/ ctx[13];
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

// (70:8) {#each filteredTags as tagName}
function TagManager_svelte_create_each_block(ctx) {
	let tagbutton;
	let current;

	function tagClicked_handler_1() {
		return /*tagClicked_handler_1*/ ctx[10](/*tagName*/ ctx[13]);
	}

	tagbutton = new TagButton_svelte({ props: { tagName: /*tagName*/ ctx[13] } });
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
			if (dirty & /*filteredTags*/ 8) tagbutton_changes.tagName = /*tagName*/ ctx[13];
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
		if (/*sourceHasTags*/ ctx[4]) return 0;
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
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(7, $settings = $$value));
	let availableTags = Object.keys($settings.tags);
	let searchResults = availableTags;
	let filteredTags = availableTags;
	let { source = {} } = $$props;

	// reset settings when configuration change
	function settingsUpdated(s) {
		$$invalidate(2, availableTags = Object.keys(s.tags));

		// remove tags from object when removed from settings
		$$invalidate(0, source.tags = source.tags.filter(t => availableTags.includes(t)), source);
	}

	function updateTags(sourceTags, resultTags) {
		$$invalidate(3, filteredTags = availableTags.filter(t => {
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
		if ($$self.$$.dirty & /*$settings*/ 128) {
			$: {
				settingsUpdated($settings);
			}
		}

		if ($$self.$$.dirty & /*source*/ 1) {
			$: $$invalidate(4, sourceHasTags = Object.hasOwn(source, 'tags'));
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
		availableTags,
		filteredTags,
		sourceHasTags,
		add,
		remove,
		$settings,
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

;// ./src/lib/components/TagIndicator.svelte
/* src/lib/components/TagIndicator.svelte generated by Svelte v4.2.19 */





function TagIndicator_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (26:4) {#each tags as tagName}
function TagIndicator_svelte_create_each_block(ctx) {
	let span;

	return {
		c() {
			span = (0,internal/* element */.ND4)("span");
			(0,internal/* set_style */.hgi)(span, "border", "3px solid " + /*$settings*/ ctx[2].tags[/*tagName*/ ctx[3]].hex);
			(0,internal/* set_style */.hgi)(span, "width", 100 / /*count*/ ctx[1] + "%");
			(0,internal/* attr */.CFu)(span, "class", "svelte-nl0i8x");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, span, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*$settings, tags*/ 5) {
				(0,internal/* set_style */.hgi)(span, "border", "3px solid " + /*$settings*/ ctx[2].tags[/*tagName*/ ctx[3]].hex);
			}

			if (dirty & /*count*/ 2) {
				(0,internal/* set_style */.hgi)(span, "width", 100 / /*count*/ ctx[1] + "%");
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(span);
			}
		}
	};
}

function TagIndicator_svelte_create_fragment(ctx) {
	let div;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*tags*/ ctx[0]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = TagIndicator_svelte_create_each_block(TagIndicator_svelte_get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = (0,internal/* element */.ND4)("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(div, "class", "tag-indicator svelte-nl0i8x");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*$settings, tags, count*/ 7) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*tags*/ ctx[0]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = TagIndicator_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = TagIndicator_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
		}
	};
}

function TagIndicator_svelte_instance($$self, $$props, $$invalidate) {
	let count;
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(2, $settings = $$value));
	let { tags = [] } = $$props;

	$$self.$$set = $$props => {
		if ('tags' in $$props) $$invalidate(0, tags = $$props.tags);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*tags*/ 1) {
			$: $$invalidate(1, count = tags.length);
		}
	};

	return [tags, count, $settings];
}

class TagIndicator extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, TagIndicator_svelte_instance, TagIndicator_svelte_create_fragment, internal/* safe_not_equal */.jXN, { tags: 0 });
	}
}

/* harmony default export */ const TagIndicator_svelte = (TagIndicator);

;// ./src/components/Activity.svelte
/* src/components/Activity.svelte generated by Svelte v4.2.19 */






















function Activity_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[32] = list[i][0];
	child_ctx[33] = list[i][1];
	return child_ctx;
}

// (164:20) {#if doc.occurredAt && (doc.complete || doc.recur)}
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

// (169:20) 
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

// (189:16) {#each Object.entries($settings.activityTypes) as [_, type]}
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

// (210:16) 
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

// (227:12) {#if doc.recur}
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

// (232:12) {#if doc.occurredAt !== null}
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
	let tagindicator;
	let updating_tags;
	let t0;
	let header;
	let div0;
	let button0;
	let targeticon;
	let t1;
	let div1;
	let button1;
	let strong;
	let t2_value = /*doc*/ ctx[0].name + "";
	let t2;
	let button1_class_value;
	let t3;
	let button2;
	let saveicon0;
	let t4;
	let div3;
	let div2;
	let p0;
	let t5;
	let modalbtn0;
	let t6;
	let p1;
	let t7;
	let t8;
	let button3;
	let saveicon1;
	let t9;
	let button4;
	let binicon;
	let t10;
	let section;
	let div4;
	let label0;
	let t12;
	let input;
	let t13;
	let div5;
	let label1;
	let t15;
	let select;
	let t16;
	let div6;
	let t17;
	let div7;
	let button5;
	let tagicon;
	let t18;
	let button6;
	let timeicon;
	let t19;
	let modalbtn1;
	let updating_source;
	let t20;
	let div8;
	let h30;
	let t22;
	let tagmanager;
	let updating_source_1;
	let t23;
	let div10;
	let h31;
	let t25;
	let div9;
	let duration;
	let updating_durationType;
	let updating_durationIncrement;
	let updating_value;
	let t26;
	let t27;
	let t28;
	let recurrence;
	let updating_doc;
	let t29;
	let div11;
	let article_transition;
	let current;
	let mounted;
	let dispose;

	function tagindicator_tags_binding(value) {
		/*tagindicator_tags_binding*/ ctx[12](value);
	}

	let tagindicator_props = {};

	if (/*doc*/ ctx[0].tags !== void 0) {
		tagindicator_props.tags = /*doc*/ ctx[0].tags;
	}

	tagindicator = new TagIndicator_svelte({ props: tagindicator_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagindicator, 'tags', tagindicator_tags_binding));
	targeticon = new target_svelte({});
	saveicon0 = new save_svelte({});
	let if_block0 = /*doc*/ ctx[0].occurredAt && (/*doc*/ ctx[0].complete || /*doc*/ ctx[0].recur) && create_if_block_2(ctx);

	modalbtn0 = new ModalBtn_svelte({
			props: {
				classes: 'small',
				modalName: 'tageditor',
				$$slots: { icon: [create_icon_slot_1] },
				$$scope: { ctx }
			}
		});

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
			(0,internal/* create_component */.N0i)(tagindicator.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			header = (0,internal/* element */.ND4)("header");
			div0 = (0,internal/* element */.ND4)("div");
			button0 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(targeticon.$$.fragment);
			t1 = (0,internal/* space */.xem)();
			div1 = (0,internal/* element */.ND4)("div");
			button1 = (0,internal/* element */.ND4)("button");
			strong = (0,internal/* element */.ND4)("strong");
			t2 = (0,internal/* text */.Qq7)(t2_value);
			t3 = (0,internal/* space */.xem)();
			button2 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(saveicon0.$$.fragment);
			t4 = (0,internal/* space */.xem)();
			div3 = (0,internal/* element */.ND4)("div");
			div2 = (0,internal/* element */.ND4)("div");
			p0 = (0,internal/* element */.ND4)("p");
			if (if_block0) if_block0.c();
			t5 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(modalbtn0.$$.fragment);
			t6 = (0,internal/* space */.xem)();
			p1 = (0,internal/* element */.ND4)("p");
			t7 = (0,internal/* text */.Qq7)(/*durationStr*/ ctx[3]);
			t8 = (0,internal/* space */.xem)();
			button3 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(saveicon1.$$.fragment);
			t9 = (0,internal/* space */.xem)();
			button4 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(binicon.$$.fragment);
			t10 = (0,internal/* space */.xem)();
			section = (0,internal/* element */.ND4)("section");
			div4 = (0,internal/* element */.ND4)("div");
			label0 = (0,internal/* element */.ND4)("label");
			label0.textContent = "Name :";
			t12 = (0,internal/* space */.xem)();
			input = (0,internal/* element */.ND4)("input");
			t13 = (0,internal/* space */.xem)();
			div5 = (0,internal/* element */.ND4)("div");
			label1 = (0,internal/* element */.ND4)("label");
			label1.textContent = "Type :";
			t15 = (0,internal/* space */.xem)();
			select = (0,internal/* element */.ND4)("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t16 = (0,internal/* space */.xem)();
			div6 = (0,internal/* element */.ND4)("div");
			div6.innerHTML = ``;
			t17 = (0,internal/* space */.xem)();
			div7 = (0,internal/* element */.ND4)("div");
			button5 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(tagicon.$$.fragment);
			t18 = (0,internal/* space */.xem)();
			button6 = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(timeicon.$$.fragment);
			t19 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(modalbtn1.$$.fragment);
			t20 = (0,internal/* space */.xem)();
			div8 = (0,internal/* element */.ND4)("div");
			h30 = (0,internal/* element */.ND4)("h3");
			h30.textContent = "Tags";
			t22 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(tagmanager.$$.fragment);
			t23 = (0,internal/* space */.xem)();
			div10 = (0,internal/* element */.ND4)("div");
			h31 = (0,internal/* element */.ND4)("h3");
			h31.textContent = "Time";
			t25 = (0,internal/* space */.xem)();
			div9 = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(duration.$$.fragment);
			t26 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			t27 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			t28 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(recurrence.$$.fragment);
			t29 = (0,internal/* space */.xem)();
			div11 = (0,internal/* element */.ND4)("div");
			div11.innerHTML = `<h3>Logs</h3>`;
			(0,internal/* attr */.CFu)(button0, "class", "icon list-btn svelte-98fro7");
			(0,internal/* attr */.CFu)(div0, "class", "svelte-98fro7");
			(0,internal/* attr */.CFu)(strong, "class", "svelte-98fro7");
			(0,internal/* attr */.CFu)(button1, "class", button1_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*doc*/ ctx[0].complete ? 'is-complete title' : 'title') + " svelte-98fro7"));
			(0,internal/* attr */.CFu)(button2, "class", "icon add-btn svelte-98fro7");
			(0,internal/* attr */.CFu)(div1, "class", "svelte-98fro7");
			(0,internal/* attr */.CFu)(p0, "class", "svelte-98fro7");
			(0,internal/* attr */.CFu)(p1, "class", "svelte-98fro7");
			(0,internal/* attr */.CFu)(div2, "class", "since svelte-98fro7");
			(0,internal/* attr */.CFu)(button3, "class", "icon edit-btn svelte-98fro7");
			(0,internal/* attr */.CFu)(button4, "class", "icon edit-btn svelte-98fro7");
			(0,internal/* attr */.CFu)(div3, "class", "svelte-98fro7");
			(0,internal/* attr */.CFu)(header, "class", "svelte-98fro7");
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
			(0,internal/* attr */.CFu)(button5, "class", "medium icon svelte-98fro7");
			(0,internal/* attr */.CFu)(button6, "class", "medium icon svelte-98fro7");
			(0,internal/* attr */.CFu)(div7, "class", "tab-buttons svelte-98fro7");
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
			(0,internal/* mount_component */.wSR)(tagindicator, article, null);
			(0,internal/* append */.BCw)(article, t0);
			(0,internal/* append */.BCw)(article, header);
			(0,internal/* append */.BCw)(header, div0);
			(0,internal/* append */.BCw)(div0, button0);
			(0,internal/* mount_component */.wSR)(targeticon, button0, null);
			(0,internal/* append */.BCw)(header, t1);
			(0,internal/* append */.BCw)(header, div1);
			(0,internal/* append */.BCw)(div1, button1);
			(0,internal/* append */.BCw)(button1, strong);
			(0,internal/* append */.BCw)(strong, t2);
			(0,internal/* append */.BCw)(div1, t3);
			(0,internal/* append */.BCw)(div1, button2);
			(0,internal/* mount_component */.wSR)(saveicon0, button2, null);
			(0,internal/* append */.BCw)(header, t4);
			(0,internal/* append */.BCw)(header, div3);
			(0,internal/* append */.BCw)(div3, div2);
			(0,internal/* append */.BCw)(div2, p0);
			if (if_block0) if_block0.m(p0, null);
			(0,internal/* append */.BCw)(div2, t5);
			(0,internal/* mount_component */.wSR)(modalbtn0, div2, null);
			(0,internal/* append */.BCw)(div2, t6);
			(0,internal/* append */.BCw)(div2, p1);
			(0,internal/* append */.BCw)(p1, t7);
			(0,internal/* append */.BCw)(div3, t8);
			(0,internal/* append */.BCw)(div3, button3);
			(0,internal/* mount_component */.wSR)(saveicon1, button3, null);
			(0,internal/* append */.BCw)(div3, t9);
			(0,internal/* append */.BCw)(div3, button4);
			(0,internal/* mount_component */.wSR)(binicon, button4, null);
			(0,internal/* append */.BCw)(article, t10);
			(0,internal/* append */.BCw)(article, section);
			(0,internal/* append */.BCw)(section, div4);
			(0,internal/* append */.BCw)(div4, label0);
			(0,internal/* append */.BCw)(div4, t12);
			(0,internal/* append */.BCw)(div4, input);
			(0,internal/* set_input_value */.Gvd)(input, /*doc*/ ctx[0].name);
			(0,internal/* append */.BCw)(section, t13);
			(0,internal/* append */.BCw)(section, div5);
			(0,internal/* append */.BCw)(div5, label1);
			(0,internal/* append */.BCw)(div5, t15);
			(0,internal/* append */.BCw)(div5, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select, null);
				}
			}

			(0,internal/* select_option */.fs8)(select, /*doc*/ ctx[0].type, true);
			(0,internal/* append */.BCw)(section, t16);
			(0,internal/* append */.BCw)(section, div6);
			(0,internal/* append */.BCw)(section, t17);
			(0,internal/* append */.BCw)(section, div7);
			(0,internal/* append */.BCw)(div7, button5);
			(0,internal/* mount_component */.wSR)(tagicon, button5, null);
			(0,internal/* append */.BCw)(div7, t18);
			(0,internal/* append */.BCw)(div7, button6);
			(0,internal/* mount_component */.wSR)(timeicon, button6, null);
			(0,internal/* append */.BCw)(div7, t19);
			(0,internal/* mount_component */.wSR)(modalbtn1, div7, null);
			(0,internal/* append */.BCw)(section, t20);
			(0,internal/* append */.BCw)(section, div8);
			(0,internal/* append */.BCw)(div8, h30);
			(0,internal/* append */.BCw)(div8, t22);
			(0,internal/* mount_component */.wSR)(tagmanager, div8, null);
			(0,internal/* append */.BCw)(section, t23);
			(0,internal/* append */.BCw)(section, div10);
			(0,internal/* append */.BCw)(div10, h31);
			(0,internal/* append */.BCw)(div10, t25);
			(0,internal/* append */.BCw)(div10, div9);
			(0,internal/* mount_component */.wSR)(duration, div9, null);
			(0,internal/* append */.BCw)(div10, t26);
			if (if_block1) if_block1.m(div10, null);
			(0,internal/* append */.BCw)(div10, t27);
			if (if_block2) if_block2.m(div10, null);
			(0,internal/* append */.BCw)(div10, t28);
			(0,internal/* mount_component */.wSR)(recurrence, div10, null);
			(0,internal/* append */.BCw)(section, t29);
			(0,internal/* append */.BCw)(section, div11);
			current = true;

			if (!mounted) {
				dispose = [
					(0,internal/* listen */.KTR)(button0, "click", /*debounceOccur*/ ctx[9]),
					(0,internal/* listen */.KTR)(button1, "click", /*click_handler*/ ctx[13]),
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
			const tagindicator_changes = {};

			if (!updating_tags && dirty[0] & /*doc*/ 1) {
				updating_tags = true;
				tagindicator_changes.tags = /*doc*/ ctx[0].tags;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_tags = false);
			}

			tagindicator.$set(tagindicator_changes);
			if ((!current || dirty[0] & /*doc*/ 1) && t2_value !== (t2_value = /*doc*/ ctx[0].name + "")) (0,internal/* set_data */.iQh)(t2, t2_value);

			if (!current || dirty[0] & /*doc, $settings*/ 33 && button1_class_value !== (button1_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*doc*/ ctx[0].complete ? 'is-complete title' : 'title') + " svelte-98fro7"))) {
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

			modalbtn0.$set(modalbtn0_changes);
			if (!current || dirty[0] & /*durationStr*/ 8) (0,internal/* set_data */.iQh)(t7, /*durationStr*/ ctx[3]);

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

			if (!updating_source && dirty[0] & /*doc*/ 1) {
				updating_source = true;
				modalbtn1_changes.source = /*doc*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source = false);
			}

			modalbtn1.$set(modalbtn1_changes);
			const tagmanager_changes = {};

			if (!updating_source_1 && dirty[0] & /*doc*/ 1) {
				updating_source_1 = true;
				tagmanager_changes.source = /*doc*/ ctx[0];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_source_1 = false);
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
					if_block1.m(div10, t27);
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
					if_block2.m(div10, t28);
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
			(0,internal/* transition_in */.c7F)(tagindicator.$$.fragment, local);
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
			(0,internal/* transition_out */.Tn8)(tagindicator.$$.fragment, local);
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

			(0,internal/* destroy_component */.Hbl)(tagindicator);
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
	let tab = 'hidden';
	let { doc } = $$props;
	let { viewmode = 'list' } = $$props;

	function tagindicator_tags_binding(value) {
		if ($$self.$$.not_equal(doc.tags, value)) {
			doc.tags = value;
			$$invalidate(0, doc);
		}
	}

	const click_handler = () => toggleMode('edit');

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
		tagindicator_tags_binding,
		click_handler,
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
;// ./src/components/DocBrowser.svelte
/* src/components/DocBrowser.svelte generated by Svelte v4.2.19 */













function DocBrowser_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i];
	return child_ctx;
}

// (196:0) {:else}
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
			t1 = (0,internal/* text */.Qq7)(" Items (");
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

// (192:0) {#if isLoading}
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

// (214:0) {#if items.length > 0}
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
	const get_key = ctx => /*item*/ ctx[27]._id;

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
			if (/*sortByWhat*/ ctx[1] === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select0_change_handler*/ ctx[20].call(select0));
			(0,internal/* attr */.CFu)(label1, "for", "filter-item");
			option3.__value = "";
			(0,internal/* set_input_value */.Gvd)(option3, option3.__value);
			option4.__value = "complete";
			(0,internal/* set_input_value */.Gvd)(option4, option4.__value);
			option5.__value = "open";
			(0,internal/* set_input_value */.Gvd)(option5, option5.__value);
			(0,internal/* attr */.CFu)(select1, "name", "filter-item");
			if (/*completedFilter*/ ctx[2] === void 0) (0,internal/* add_render_callback */.Dti)(() => /*select1_change_handler*/ ctx[21].call(select1));
			(0,internal/* attr */.CFu)(ul, "class", "svelte-5j3fvj");
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
					(0,internal/* listen */.KTR)(select0, "change", /*select0_change_handler*/ ctx[20]),
					(0,internal/* listen */.KTR)(select1, "change", /*select1_change_handler*/ ctx[21])
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

// (235:12) {#each sortedAndFilteredItems as item (item._id)}
function DocBrowser_svelte_create_each_block(key_1, ctx) {
	let li;
	let activity;
	let t;
	let current;
	activity = new Activity_svelte({ props: { doc: /*item*/ ctx[27] } });
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
			if (dirty & /*sortedAndFilteredItems*/ 1024) activity_changes.doc = /*item*/ ctx[27];
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
		if (/*isLoading*/ ctx[5]) return DocBrowser_svelte_create_if_block_1;
		return DocBrowser_svelte_create_else_block;
	}

	let current_block_type = select_block_type(ctx, -1);
	let if_block0 = current_block_type(ctx);
	addicon = new plus_svelte({});

	activity = new Activity_svelte({
			props: {
				doc: /*newDoc*/ ctx[6],
				viewmode: /*addNewItem*/ ctx[7] ? 'add' : 'hidden'
			}
		});

	activity.$on("add", /*addDoc*/ ctx[11]);

	function tagcheckboxbar0_tags_binding(value) {
		/*tagcheckboxbar0_tags_binding*/ ctx[16](value);
	}

	function tagcheckboxbar0_selected_binding(value) {
		/*tagcheckboxbar0_selected_binding*/ ctx[17](value);
	}

	let tagcheckboxbar0_props = {
		name: "activityTypes",
		classes: ['tagBar'],
		selectMax: "1"
	};

	if (/*activityTypes*/ ctx[8] !== void 0) {
		tagcheckboxbar0_props.tags = /*activityTypes*/ ctx[8];
	}

	if (/*selectedActivityTypes*/ ctx[4] !== void 0) {
		tagcheckboxbar0_props.selected = /*selectedActivityTypes*/ ctx[4];
	}

	tagcheckboxbar0 = new TagCheckboxBar_svelte({ props: tagcheckboxbar0_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar0, 'tags', tagcheckboxbar0_tags_binding));
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(tagcheckboxbar0, 'selected', tagcheckboxbar0_selected_binding));

	function tagcheckboxbar1_tags_binding(value) {
		/*tagcheckboxbar1_tags_binding*/ ctx[18](value);
	}

	function tagcheckboxbar1_selected_binding(value) {
		/*tagcheckboxbar1_selected_binding*/ ctx[19](value);
	}

	let tagcheckboxbar1_props = { name: "tags", classes: ['tagBar'] };

	if (/*tags*/ ctx[9] !== void 0) {
		tagcheckboxbar1_props.tags = /*tags*/ ctx[9];
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
			if (dirty & /*newDoc*/ 64) activity_changes.doc = /*newDoc*/ ctx[6];
			if (dirty & /*addNewItem*/ 128) activity_changes.viewmode = /*addNewItem*/ ctx[7] ? 'add' : 'hidden';
			activity.$set(activity_changes);
			const tagcheckboxbar0_changes = {};

			if (!updating_tags && dirty & /*activityTypes*/ 256) {
				updating_tags = true;
				tagcheckboxbar0_changes.tags = /*activityTypes*/ ctx[8];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_tags = false);
			}

			if (!updating_selected && dirty & /*selectedActivityTypes*/ 16) {
				updating_selected = true;
				tagcheckboxbar0_changes.selected = /*selectedActivityTypes*/ ctx[4];
				(0,internal/* add_flush_callback */.Jk$)(() => updating_selected = false);
			}

			tagcheckboxbar0.$set(tagcheckboxbar0_changes);
			const tagcheckboxbar1_changes = {};

			if (!updating_tags_1 && dirty & /*tags*/ 512) {
				updating_tags_1 = true;
				tagcheckboxbar1_changes.tags = /*tags*/ ctx[9];
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
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(15, $settings = $$value));
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
	let isLoading = true;

	let newDoc = new lib_ActivityDoc();
	let sortByWhat = 'createdAt';
	let completedFilter = '';
	let addNewItem = false;
	let activityTypes = [];
	let tags = [];
	let selectedTags = [];
	let selectedActivityTypes = [];
	let { items = [] } = $$props;

	// reset settings when configuration change
	function settingsUpdated(s) {
		// track changes and update docs if required        
		let freshTypes = Object.keys(s.activityTypes);

		let freshTags = Object.keys(s.tags);

		// if any tags/types selected no longer exist, filter out 
		if (selectedActivityTypes.length > 0) {
			$$invalidate(4, selectedActivityTypes = selectedActivityTypes.filter(t => freshTypes.includes(t)));
		}

		if (selectedTags.length > 0) {
			$$invalidate(3, selectedTags = selectedTags.filter(t => freshTags.includes(t)));
		}

		// when there are missing tags update db removing them from each required doc
		let missingTags = tags.filter(t => !freshTags.includes(t));

		if (missingTags.length > 0) {
			removeDocTags(missingTags);
		}

		// set values from new settings
		$$invalidate(8, activityTypes = freshTypes);

		$$invalidate(9, tags = freshTags);
	}

	async function removeDocTags(missingTags) {
		let itemsToUpdate = items.filter(d => {
			let update = false;

			missingTags.forEach(tagName => {
				update = d.tags.includes(tagName);
			});

			return update;
		});

		itemsToUpdate = itemsToUpdate.map(d => {
			missingTags.forEach(tagName => {
				d.tags = d.tags.filter(t => t !== tagName);
			});

			return d;
		});

		const updated = await updateDocs(itemsToUpdate);

		if (updated.ok) {
			addToast({
				message: 'Removed Tag(s): ' + missingTags.join(', '),
				timeout: 3000
			});
		} else {
			addToast({
				type: 'error',
				message: JSON.stringify(updated)
			});
		}
	}

	// Helper for reloading all todos from the local PouchDB. It’s on-device and has basically zero latency,
	// so we can use it quite liberally instead of keeping our local state up to date like you’d do
	// in a Redux reducer. It also saves us from having to rebuild the local state todos from the data we sent
	// to the database and the `_id` and `_rev` values that were sent back.
	async function updateItems() {
		const allDocs = await db.allDocs({ include_docs: true });
		$$invalidate(0, items = allDocs.rows.map(row => row.doc));
		$$invalidate(5, isLoading = false);
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

		$$invalidate(6, newDoc = new lib_ActivityDoc());
		$$invalidate(7, addNewItem = false);
	}

	async function updateDocs(docs) {
		const updated = await db.bulkDocs(docs);
		let success = true;

		if (updated.forEach(u => {
			if (!u.ok) {
				success = false;
			}
		})) await updateItems();

		return { ok: success, results: updated };
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
		$$invalidate(8, activityTypes);
	}

	function tagcheckboxbar0_selected_binding(value) {
		selectedActivityTypes = value;
		$$invalidate(4, selectedActivityTypes);
	}

	function tagcheckboxbar1_tags_binding(value) {
		tags = value;
		$$invalidate(9, tags);
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
			$: $$invalidate(10, sortedAndFilteredItems = (0,lodash.sortBy)(items, [sortByWhat]).filter(item => {
				let filters = new lib_filters(completedFilter, selectedActivityTypes, selectedTags);

				if (filters.hasActiveFilters()) {
					return filters.matches(item);
				}

				return true;
			}));
		}

		if ($$self.$$.dirty & /*$settings*/ 32768) {
			$: {
				settingsUpdated($settings);
			}
		}
	};

	return [
		items,
		sortByWhat,
		completedFilter,
		selectedTags,
		selectedActivityTypes,
		isLoading,
		newDoc,
		addNewItem,
		activityTypes,
		tags,
		sortedAndFilteredItems,
		addDoc,
		updateDoc,
		removeDoc,
		toggleNewItem,
		$settings,
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
;// ./src/lib/components/Menu.svelte
/* src/lib/components/Menu.svelte generated by Svelte v4.2.19 */




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

;// ./src/lib/components/MenuItem.svelte
/* src/lib/components/MenuItem.svelte generated by Svelte v4.2.19 */



const get_control_slot_changes_1 = dirty => ({});
const get_control_slot_context_1 = ctx => ({});
const MenuItem_svelte_get_icon_slot_changes = dirty => ({});
const MenuItem_svelte_get_icon_slot_context = ctx => ({ class: "menu-icon svelte-vk0vsa" });
const get_control_slot_changes = dirty => ({});
const get_control_slot_context = ctx => ({});

// (24:4) {#if iconSide === 'right'}
function create_if_block_3(ctx) {
	let current;
	const control_slot_template = /*#slots*/ ctx[3].control;
	const control_slot = (0,internal/* create_slot */.Of3)(control_slot_template, ctx, /*$$scope*/ ctx[2], get_control_slot_context);

	return {
		c() {
			if (control_slot) control_slot.c();
		},
		m(target, anchor) {
			if (control_slot) {
				control_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (control_slot) {
				if (control_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					(0,internal/* update_slot_base */.nkG)(
						control_slot,
						control_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[2])
						: (0,internal/* get_slot_changes */.sWk)(control_slot_template, /*$$scope*/ ctx[2], dirty, get_control_slot_changes),
						get_control_slot_context
					);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(control_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(control_slot, local);
			current = false;
		},
		d(detaching) {
			if (control_slot) control_slot.d(detaching);
		}
	};
}

// (28:4) {#if iconSide === 'right'}
function MenuItem_svelte_create_if_block_2(ctx) {
	let h3;
	let t;

	return {
		c() {
			h3 = (0,internal/* element */.ND4)("h3");
			t = (0,internal/* text */.Qq7)(/*label*/ ctx[1]);
			(0,internal/* attr */.CFu)(h3, "class", "svelte-vk0vsa");
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

// (34:4) {#if iconSide === 'left'}
function MenuItem_svelte_create_if_block_1(ctx) {
	let h3;
	let t;

	return {
		c() {
			h3 = (0,internal/* element */.ND4)("h3");
			t = (0,internal/* text */.Qq7)(/*label*/ ctx[1]);
			(0,internal/* attr */.CFu)(h3, "class", "svelte-vk0vsa");
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

// (38:4) {#if iconSide === 'left'}
function MenuItem_svelte_create_if_block(ctx) {
	let current;
	const control_slot_template = /*#slots*/ ctx[3].control;
	const control_slot = (0,internal/* create_slot */.Of3)(control_slot_template, ctx, /*$$scope*/ ctx[2], get_control_slot_context_1);

	return {
		c() {
			if (control_slot) control_slot.c();
		},
		m(target, anchor) {
			if (control_slot) {
				control_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, dirty) {
			if (control_slot) {
				if (control_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					(0,internal/* update_slot_base */.nkG)(
						control_slot,
						control_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? (0,internal/* get_all_dirty_from_scope */.i32)(/*$$scope*/ ctx[2])
						: (0,internal/* get_slot_changes */.sWk)(control_slot_template, /*$$scope*/ ctx[2], dirty, get_control_slot_changes_1),
						get_control_slot_context_1
					);
				}
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(control_slot, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(control_slot, local);
			current = false;
		},
		d(detaching) {
			if (control_slot) control_slot.d(detaching);
		}
	};
}

function MenuItem_svelte_create_fragment(ctx) {
	let button;
	let t0;
	let t1;
	let t2;
	let t3;
	let current;
	let if_block0 = /*iconSide*/ ctx[0] === 'right' && create_if_block_3(ctx);
	let if_block1 = /*iconSide*/ ctx[0] === 'right' && MenuItem_svelte_create_if_block_2(ctx);
	const icon_slot_template = /*#slots*/ ctx[3].icon;
	const icon_slot = (0,internal/* create_slot */.Of3)(icon_slot_template, ctx, /*$$scope*/ ctx[2], MenuItem_svelte_get_icon_slot_context);
	let if_block2 = /*iconSide*/ ctx[0] === 'left' && MenuItem_svelte_create_if_block_1(ctx);
	let if_block3 = /*iconSide*/ ctx[0] === 'left' && MenuItem_svelte_create_if_block(ctx);

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			if (if_block0) if_block0.c();
			t0 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			t1 = (0,internal/* space */.xem)();
			if (icon_slot) icon_slot.c();
			t2 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			t3 = (0,internal/* space */.xem)();
			if (if_block3) if_block3.c();
			(0,internal/* attr */.CFu)(button, "class", "menu-item svelte-vk0vsa");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			if (if_block0) if_block0.m(button, null);
			(0,internal/* append */.BCw)(button, t0);
			if (if_block1) if_block1.m(button, null);
			(0,internal/* append */.BCw)(button, t1);

			if (icon_slot) {
				icon_slot.m(button, null);
			}

			(0,internal/* append */.BCw)(button, t2);
			if (if_block2) if_block2.m(button, null);
			(0,internal/* append */.BCw)(button, t3);
			if (if_block3) if_block3.m(button, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*iconSide*/ ctx[0] === 'right') {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*iconSide*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					(0,internal/* transition_in */.c7F)(if_block0, 1);
					if_block0.m(button, t0);
				}
			} else if (if_block0) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}

			if (/*iconSide*/ ctx[0] === 'right') {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = MenuItem_svelte_create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(button, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
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

			if (/*iconSide*/ ctx[0] === 'left') {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = MenuItem_svelte_create_if_block_1(ctx);
					if_block2.c();
					if_block2.m(button, t3);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*iconSide*/ ctx[0] === 'left') {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty & /*iconSide*/ 1) {
						(0,internal/* transition_in */.c7F)(if_block3, 1);
					}
				} else {
					if_block3 = MenuItem_svelte_create_if_block(ctx);
					if_block3.c();
					(0,internal/* transition_in */.c7F)(if_block3, 1);
					if_block3.m(button, null);
				}
			} else if (if_block3) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block0);
			(0,internal/* transition_in */.c7F)(icon_slot, local);
			(0,internal/* transition_in */.c7F)(if_block3);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(if_block0);
			(0,internal/* transition_out */.Tn8)(icon_slot, local);
			(0,internal/* transition_out */.Tn8)(if_block3);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(button);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (icon_slot) icon_slot.d(detaching);
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
		}
	};
}

function MenuItem_svelte_instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { iconSide = 'left' } = $$props;
	let { label } = $$props;

	$$self.$$set = $$props => {
		if ('iconSide' in $$props) $$invalidate(0, iconSide = $$props.iconSide);
		if ('label' in $$props) $$invalidate(1, label = $$props.label);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [iconSide, label, $$scope, slots];
}

class MenuItem extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, MenuItem_svelte_instance, MenuItem_svelte_create_fragment, internal/* safe_not_equal */.jXN, { iconSide: 0, label: 1 });
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

;// ./src/lib/icons/palette.svelte
/* src/lib/icons/palette.svelte generated by Svelte v4.2.19 */




function palette_svelte_create_fragment(ctx) {
	let svg;
	let path;

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			path = (0,internal/* svg_element */.QQy)("path");
			(0,internal/* attr */.CFu)(path, "d", "M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z");
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
			(0,internal/* attr */.CFu)(svg, "height", "35px");
			(0,internal/* attr */.CFu)(svg, "viewBox", "0 -960 960 960");
			(0,internal/* attr */.CFu)(svg, "width", "35px");
			(0,internal/* attr */.CFu)(svg, "fill", "#222");
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

class Palette extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, null, palette_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const palette_svelte = (Palette);
;// ./src/lib/input/Toggle.svelte
/* src/lib/input/Toggle.svelte generated by Svelte v4.2.19 */




function Toggle_svelte_create_fragment(ctx) {
	let button;
	let span;
	let span_class_value;
	let mounted;
	let dispose;

	return {
		c() {
			button = (0,internal/* element */.ND4)("button");
			span = (0,internal/* element */.ND4)("span");
			(0,internal/* attr */.CFu)(span, "class", span_class_value = "switch step-" + /*step*/ ctx[1] + " position-" + /*position*/ ctx[0] + " svelte-13h1cqt");
			(0,internal/* attr */.CFu)(button, "class", "icon toggle svelte-13h1cqt");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, button, anchor);
			(0,internal/* append */.BCw)(button, span);

			if (!mounted) {
				dispose = (0,internal/* listen */.KTR)(button, "click", /*toggle*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*step, position*/ 3 && span_class_value !== (span_class_value = "switch step-" + /*step*/ ctx[1] + " position-" + /*position*/ ctx[0] + " svelte-13h1cqt")) {
				(0,internal/* attr */.CFu)(span, "class", span_class_value);
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

function Toggle_svelte_instance($$self, $$props, $$invalidate) {
	let position;
	let step;
	let { value } = $$props;
	let { possibleValues = [false, true] } = $$props;

	// step through possible values, restarting when reaching the end
	function toggle() {
		if (position === possibleValues.length - 1) {
			$$invalidate(3, value = possibleValues[0]);
		} else {
			$$invalidate(3, value = possibleValues[position + 1]);
		}
	}

	$$self.$$set = $$props => {
		if ('value' in $$props) $$invalidate(3, value = $$props.value);
		if ('possibleValues' in $$props) $$invalidate(4, possibleValues = $$props.possibleValues);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*possibleValues, value*/ 24) {
			// the index of the current value
			$: $$invalidate(0, position = possibleValues.indexOf(value));
		}

		if ($$self.$$.dirty & /*possibleValues*/ 16) {
			// class for css positioning of the switch
			$: $$invalidate(1, step = possibleValues.length);
		}
	};

	return [position, step, toggle, value, possibleValues];
}

class Toggle extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Toggle_svelte_instance, Toggle_svelte_create_fragment, internal/* safe_not_equal */.jXN, { value: 3, possibleValues: 4 });
	}
}

/* harmony default export */ const Toggle_svelte = (Toggle);

;// ./src/components/Settings.svelte
/* src/components/Settings.svelte generated by Svelte v4.2.19 */









function Settings_svelte_create_icon_slot(ctx) {
	let paletteicon;
	let current;
	paletteicon = new palette_svelte({ props: { slot: "icon" } });

	return {
		c() {
			(0,internal/* create_component */.N0i)(paletteicon.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(paletteicon, target, anchor);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(paletteicon.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(paletteicon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(paletteicon, detaching);
		}
	};
}

// (17:8) 
function create_control_slot(ctx) {
	let toggle;
	let updating_value;
	let current;

	function toggle_value_binding(value) {
		/*toggle_value_binding*/ ctx[1](value);
	}

	let toggle_props = { slot: "control" };

	if (/*$settings*/ ctx[0].toastArt !== void 0) {
		toggle_props.value = /*$settings*/ ctx[0].toastArt;
	}

	toggle = new Toggle_svelte({ props: toggle_props });
	internal/* binding_callbacks */.Dnk.push(() => (0,internal/* bind */.oIE)(toggle, 'value', toggle_value_binding));

	return {
		c() {
			(0,internal/* create_component */.N0i)(toggle.$$.fragment);
		},
		m(target, anchor) {
			(0,internal/* mount_component */.wSR)(toggle, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const toggle_changes = {};

			if (!updating_value && dirty & /*$settings*/ 1) {
				updating_value = true;
				toggle_changes.value = /*$settings*/ ctx[0].toastArt;
				(0,internal/* add_flush_callback */.Jk$)(() => updating_value = false);
			}

			toggle.$set(toggle_changes);
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(toggle.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(toggle.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			(0,internal/* destroy_component */.Hbl)(toggle, detaching);
		}
	};
}

function Settings_svelte_create_fragment(ctx) {
	let section;
	let h2;
	let t1;
	let menuitem;
	let t2;
	let lightmodebtn;
	let updating_value;
	let current;

	menuitem = new MenuItem_svelte({
			props: {
				label: "Notification Art",
				$$slots: {
					control: [create_control_slot],
					icon: [Settings_svelte_create_icon_slot]
				},
				$$scope: { ctx }
			}
		});

	function lightmodebtn_value_binding(value) {
		/*lightmodebtn_value_binding*/ ctx[2](value);
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
			(0,internal/* create_component */.N0i)(menuitem.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(lightmodebtn.$$.fragment);
			(0,internal/* attr */.CFu)(h2, "class", "svelte-mjouae");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* append */.BCw)(section, h2);
			(0,internal/* append */.BCw)(section, t1);
			(0,internal/* mount_component */.wSR)(menuitem, section, null);
			(0,internal/* append */.BCw)(section, t2);
			(0,internal/* mount_component */.wSR)(lightmodebtn, section, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const menuitem_changes = {};

			if (dirty & /*$$scope, $settings*/ 9) {
				menuitem_changes.$$scope = { dirty, ctx };
			}

			menuitem.$set(menuitem_changes);
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
			(0,internal/* transition_in */.c7F)(menuitem.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(lightmodebtn.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(menuitem.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(lightmodebtn.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_component */.Hbl)(menuitem);
			(0,internal/* destroy_component */.Hbl)(lightmodebtn);
		}
	};
}

function Settings_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(0, $settings = $$value));

	function toggle_value_binding(value) {
		if ($$self.$$.not_equal($settings.toastArt, value)) {
			$settings.toastArt = value;
			settings.set($settings);
		}
	}

	function lightmodebtn_value_binding(value) {
		if ($$self.$$.not_equal($settings.lightMode, value)) {
			$settings.lightMode = value;
			settings.set($settings);
		}
	}

	return [$settings, toggle_value_binding, lightmodebtn_value_binding];
}

class Settings extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, Settings_svelte_instance, Settings_svelte_create_fragment, internal/* safe_not_equal */.jXN, {});
	}
}

/* harmony default export */ const Settings_svelte = (Settings);

;// ./src/components/Navigation.svelte
/* src/components/Navigation.svelte generated by Svelte v4.2.19 */










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
			(0,internal/* attr */.CFu)(path, "class", "fill");
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

class Error extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();
		(0,internal/* init */.TsN)(this, options, error_svelte_instance, error_svelte_create_fragment, internal/* safe_not_equal */.jXN, { width: 0 });
	}
}

/* harmony default export */ const error_svelte = (Error);
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
			(0,internal/* attr */.CFu)(path, "fill", "#eee");
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
;// ./src/components/Art.svelte
/* src/components/Art.svelte generated by Svelte v4.2.19 */




function Art_svelte_get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (118:4) {#each layers as layer}
function Art_svelte_create_each_block(ctx) {
	let g;
	let use0;
	let use0_x_value;
	let use0_y_value;
	let use1;
	let use1_x_value;
	let use1_y_value;
	let use2;
	let use2_x_value;
	let use2_y_value;
	let use2_transform_value;

	return {
		c() {
			g = (0,internal/* svg_element */.QQy)("g");
			use0 = (0,internal/* svg_element */.QQy)("use");
			use1 = (0,internal/* svg_element */.QQy)("use");
			use2 = (0,internal/* svg_element */.QQy)("use");
			(0,internal/* attr */.CFu)(use0, "href", "#circle");
			(0,internal/* attr */.CFu)(use0, "x", use0_x_value = 0 - /*rv*/ ctx[4].s80 / 2);
			(0,internal/* attr */.CFu)(use0, "y", use0_y_value = 0 - /*rv*/ ctx[4].s80 / 2);
			(0,internal/* set_style */.hgi)(use0, "opacity", "1.0");
			(0,internal/* attr */.CFu)(use0, "stroke", "url(#Gradient1)");
			(0,internal/* attr */.CFu)(use0, "stroke-width", "3");
			(0,internal/* attr */.CFu)(use1, "href", "#rect");
			(0,internal/* attr */.CFu)(use1, "x", use1_x_value = 0 - /*rv*/ ctx[4].s80 / 2);
			(0,internal/* attr */.CFu)(use1, "y", use1_y_value = 0 - /*rv*/ ctx[4].s80 / 2);
			(0,internal/* set_style */.hgi)(use1, "opacity", "1.0");
			(0,internal/* attr */.CFu)(use1, "stroke", "url(#Gradient1)");
			(0,internal/* attr */.CFu)(use1, "stroke-width", "3");
			(0,internal/* attr */.CFu)(use1, "transform", "rotate(45)");
			(0,internal/* attr */.CFu)(use2, "href", "#polyline");
			(0,internal/* attr */.CFu)(use2, "x", use2_x_value = 0 - /*rv*/ ctx[4].s80 / 2);
			(0,internal/* attr */.CFu)(use2, "y", use2_y_value = 0 - /*rv*/ ctx[4].s80 / 2);
			(0,internal/* set_style */.hgi)(use2, "opacity", "1.0");
			(0,internal/* attr */.CFu)(use2, "stroke", "url(#Gradient1)");
			(0,internal/* attr */.CFu)(use2, "stroke-width", "3");
			(0,internal/* attr */.CFu)(use2, "transform", use2_transform_value = "rotate(" + 360 / 4 / /*rv*/ ctx[4].points + ")");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, g, anchor);
			(0,internal/* append */.BCw)(g, use0);
			(0,internal/* append */.BCw)(g, use1);
			(0,internal/* append */.BCw)(g, use2);
		},
		p(ctx, dirty) {
			if (dirty & /*rv*/ 16 && use0_x_value !== (use0_x_value = 0 - /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(use0, "x", use0_x_value);
			}

			if (dirty & /*rv*/ 16 && use0_y_value !== (use0_y_value = 0 - /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(use0, "y", use0_y_value);
			}

			if (dirty & /*rv*/ 16 && use1_x_value !== (use1_x_value = 0 - /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(use1, "x", use1_x_value);
			}

			if (dirty & /*rv*/ 16 && use1_y_value !== (use1_y_value = 0 - /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(use1, "y", use1_y_value);
			}

			if (dirty & /*rv*/ 16 && use2_x_value !== (use2_x_value = 0 - /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(use2, "x", use2_x_value);
			}

			if (dirty & /*rv*/ 16 && use2_y_value !== (use2_y_value = 0 - /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(use2, "y", use2_y_value);
			}

			if (dirty & /*rv*/ 16 && use2_transform_value !== (use2_transform_value = "rotate(" + 360 / 4 / /*rv*/ ctx[4].points + ")")) {
				(0,internal/* attr */.CFu)(use2, "transform", use2_transform_value);
			}
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(g);
			}
		}
	};
}

function Art_svelte_create_fragment(ctx) {
	let svg;
	let defs;
	let linearGradient;
	let stop0;
	let stop1;
	let symbol0;
	let circle;
	let circle_cx_value;
	let circle_cy_value;
	let circle_r_value;
	let symbol0_viewBox_value;
	let symbol0_width_value;
	let symbol0_height_value;
	let symbol1;
	let rect;
	let rect_x_value;
	let rect_y_value;
	let rect_width_value;
	let rect_height_value;
	let symbol1_viewBox_value;
	let symbol1_width_value;
	let symbol1_height_value;
	let symbol2;
	let polyline;
	let polyline_points_value;
	let symbol2_viewBox_value;
	let symbol2_width_value;
	let symbol2_height_value;
	let svg_viewBox_value;
	let each_value = (0,internal/* ensure_array_like */.rv_)(/*layers*/ ctx[3]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = Art_svelte_create_each_block(Art_svelte_get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			svg = (0,internal/* svg_element */.QQy)("svg");
			defs = (0,internal/* svg_element */.QQy)("defs");
			linearGradient = (0,internal/* svg_element */.QQy)("linearGradient");
			stop0 = (0,internal/* svg_element */.QQy)("stop");
			stop1 = (0,internal/* svg_element */.QQy)("stop");
			symbol0 = (0,internal/* svg_element */.QQy)("symbol");
			circle = (0,internal/* svg_element */.QQy)("circle");
			symbol1 = (0,internal/* svg_element */.QQy)("symbol");
			rect = (0,internal/* svg_element */.QQy)("rect");
			symbol2 = (0,internal/* svg_element */.QQy)("symbol");
			polyline = (0,internal/* svg_element */.QQy)("polyline");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			(0,internal/* attr */.CFu)(stop0, "offset", "0%");
			(0,internal/* attr */.CFu)(stop0, "stop-color", "#888");
			(0,internal/* attr */.CFu)(stop1, "offset", "100%");
			(0,internal/* attr */.CFu)(stop1, "stop-color", "#eee");
			(0,internal/* attr */.CFu)(linearGradient, "id", "Gradient1");
			(0,internal/* attr */.CFu)(circle, "cx", circle_cx_value = /*rv*/ ctx[4].s80 / 2);
			(0,internal/* attr */.CFu)(circle, "cy", circle_cy_value = /*rv*/ ctx[4].s80 / 2);
			(0,internal/* attr */.CFu)(circle, "r", circle_r_value = /*rv*/ ctx[4].r80 - /*rv*/ ctx[4].m);
			(0,internal/* attr */.CFu)(circle, "fill", "none");
			(0,internal/* attr */.CFu)(symbol0, "id", "circle");
			(0,internal/* attr */.CFu)(symbol0, "viewBox", symbol0_viewBox_value = viewBoxCoords(/*rv*/ ctx[4].s80));
			(0,internal/* attr */.CFu)(symbol0, "width", symbol0_width_value = /*rv*/ ctx[4].s80);
			(0,internal/* attr */.CFu)(symbol0, "height", symbol0_height_value = /*rv*/ ctx[4].s80);
			(0,internal/* attr */.CFu)(rect, "x", rect_x_value = /*rv*/ ctx[4].m);
			(0,internal/* attr */.CFu)(rect, "y", rect_y_value = /*rv*/ ctx[4].m);
			(0,internal/* attr */.CFu)(rect, "width", rect_width_value = /*rv*/ ctx[4].s80 - /*rv*/ ctx[4].m * 2);
			(0,internal/* attr */.CFu)(rect, "height", rect_height_value = /*rv*/ ctx[4].s80 - /*rv*/ ctx[4].m * 2);
			(0,internal/* attr */.CFu)(rect, "fill", "none");
			(0,internal/* attr */.CFu)(symbol1, "id", "rect");
			(0,internal/* attr */.CFu)(symbol1, "viewBox", symbol1_viewBox_value = viewBoxCoords(/*rv*/ ctx[4].s80));
			(0,internal/* attr */.CFu)(symbol1, "width", symbol1_width_value = /*rv*/ ctx[4].s80);
			(0,internal/* attr */.CFu)(symbol1, "height", symbol1_height_value = /*rv*/ ctx[4].s80);
			(0,internal/* attr */.CFu)(polyline, "points", polyline_points_value = getVertexCoordsStr(/*rv*/ ctx[4].s80 / 2, /*rv*/ ctx[4].s80 / 2, /*rv*/ ctx[4].r80 - /*rv*/ ctx[4].m, /*rv*/ ctx[4].points, 1));
			(0,internal/* attr */.CFu)(polyline, "fill", "none");
			(0,internal/* attr */.CFu)(symbol2, "id", "polyline");
			(0,internal/* attr */.CFu)(symbol2, "viewBox", symbol2_viewBox_value = viewBoxCoords(/*rv*/ ctx[4].s80));
			(0,internal/* attr */.CFu)(symbol2, "width", symbol2_width_value = /*rv*/ ctx[4].s80);
			(0,internal/* attr */.CFu)(symbol2, "height", symbol2_height_value = /*rv*/ ctx[4].s80);
			(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[1]);
			(0,internal/* attr */.CFu)(svg, "height", /*height*/ ctx[2]);
			(0,internal/* attr */.CFu)(svg, "viewBox", svg_viewBox_value = viewBoxCoords(/*viewBoxSize*/ ctx[0], true));
			(0,internal/* attr */.CFu)(svg, "xmlns", "http://www.w3.org/2000/svg");
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, svg, anchor);
			(0,internal/* append */.BCw)(svg, defs);
			(0,internal/* append */.BCw)(defs, linearGradient);
			(0,internal/* append */.BCw)(linearGradient, stop0);
			(0,internal/* append */.BCw)(linearGradient, stop1);
			(0,internal/* append */.BCw)(defs, symbol0);
			(0,internal/* append */.BCw)(symbol0, circle);
			(0,internal/* append */.BCw)(defs, symbol1);
			(0,internal/* append */.BCw)(symbol1, rect);
			(0,internal/* append */.BCw)(defs, symbol2);
			(0,internal/* append */.BCw)(symbol2, polyline);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(svg, null);
				}
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*rv*/ 16 && circle_cx_value !== (circle_cx_value = /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(circle, "cx", circle_cx_value);
			}

			if (dirty & /*rv*/ 16 && circle_cy_value !== (circle_cy_value = /*rv*/ ctx[4].s80 / 2)) {
				(0,internal/* attr */.CFu)(circle, "cy", circle_cy_value);
			}

			if (dirty & /*rv*/ 16 && circle_r_value !== (circle_r_value = /*rv*/ ctx[4].r80 - /*rv*/ ctx[4].m)) {
				(0,internal/* attr */.CFu)(circle, "r", circle_r_value);
			}

			if (dirty & /*rv*/ 16 && symbol0_viewBox_value !== (symbol0_viewBox_value = viewBoxCoords(/*rv*/ ctx[4].s80))) {
				(0,internal/* attr */.CFu)(symbol0, "viewBox", symbol0_viewBox_value);
			}

			if (dirty & /*rv*/ 16 && symbol0_width_value !== (symbol0_width_value = /*rv*/ ctx[4].s80)) {
				(0,internal/* attr */.CFu)(symbol0, "width", symbol0_width_value);
			}

			if (dirty & /*rv*/ 16 && symbol0_height_value !== (symbol0_height_value = /*rv*/ ctx[4].s80)) {
				(0,internal/* attr */.CFu)(symbol0, "height", symbol0_height_value);
			}

			if (dirty & /*rv*/ 16 && rect_x_value !== (rect_x_value = /*rv*/ ctx[4].m)) {
				(0,internal/* attr */.CFu)(rect, "x", rect_x_value);
			}

			if (dirty & /*rv*/ 16 && rect_y_value !== (rect_y_value = /*rv*/ ctx[4].m)) {
				(0,internal/* attr */.CFu)(rect, "y", rect_y_value);
			}

			if (dirty & /*rv*/ 16 && rect_width_value !== (rect_width_value = /*rv*/ ctx[4].s80 - /*rv*/ ctx[4].m * 2)) {
				(0,internal/* attr */.CFu)(rect, "width", rect_width_value);
			}

			if (dirty & /*rv*/ 16 && rect_height_value !== (rect_height_value = /*rv*/ ctx[4].s80 - /*rv*/ ctx[4].m * 2)) {
				(0,internal/* attr */.CFu)(rect, "height", rect_height_value);
			}

			if (dirty & /*rv*/ 16 && symbol1_viewBox_value !== (symbol1_viewBox_value = viewBoxCoords(/*rv*/ ctx[4].s80))) {
				(0,internal/* attr */.CFu)(symbol1, "viewBox", symbol1_viewBox_value);
			}

			if (dirty & /*rv*/ 16 && symbol1_width_value !== (symbol1_width_value = /*rv*/ ctx[4].s80)) {
				(0,internal/* attr */.CFu)(symbol1, "width", symbol1_width_value);
			}

			if (dirty & /*rv*/ 16 && symbol1_height_value !== (symbol1_height_value = /*rv*/ ctx[4].s80)) {
				(0,internal/* attr */.CFu)(symbol1, "height", symbol1_height_value);
			}

			if (dirty & /*rv*/ 16 && polyline_points_value !== (polyline_points_value = getVertexCoordsStr(/*rv*/ ctx[4].s80 / 2, /*rv*/ ctx[4].s80 / 2, /*rv*/ ctx[4].r80 - /*rv*/ ctx[4].m, /*rv*/ ctx[4].points, 1))) {
				(0,internal/* attr */.CFu)(polyline, "points", polyline_points_value);
			}

			if (dirty & /*rv*/ 16 && symbol2_viewBox_value !== (symbol2_viewBox_value = viewBoxCoords(/*rv*/ ctx[4].s80))) {
				(0,internal/* attr */.CFu)(symbol2, "viewBox", symbol2_viewBox_value);
			}

			if (dirty & /*rv*/ 16 && symbol2_width_value !== (symbol2_width_value = /*rv*/ ctx[4].s80)) {
				(0,internal/* attr */.CFu)(symbol2, "width", symbol2_width_value);
			}

			if (dirty & /*rv*/ 16 && symbol2_height_value !== (symbol2_height_value = /*rv*/ ctx[4].s80)) {
				(0,internal/* attr */.CFu)(symbol2, "height", symbol2_height_value);
			}

			if (dirty & /*rv, layers*/ 24) {
				each_value = (0,internal/* ensure_array_like */.rv_)(/*layers*/ ctx[3]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = Art_svelte_get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = Art_svelte_create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(svg, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*width*/ 2) {
				(0,internal/* attr */.CFu)(svg, "width", /*width*/ ctx[1]);
			}

			if (dirty & /*height*/ 4) {
				(0,internal/* attr */.CFu)(svg, "height", /*height*/ ctx[2]);
			}

			if (dirty & /*viewBoxSize*/ 1 && svg_viewBox_value !== (svg_viewBox_value = viewBoxCoords(/*viewBoxSize*/ ctx[0], true))) {
				(0,internal/* attr */.CFu)(svg, "viewBox", svg_viewBox_value);
			}
		},
		i: internal/* noop */.lQ1,
		o: internal/* noop */.lQ1,
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(svg);
			}

			(0,internal/* destroy_each */.ppq)(each_blocks, detaching);
		}
	};
}

function viewBoxCoords(v, zeroCenter = false) {
	if (zeroCenter) {
		return 0 - v / 2 + ' ' + (0 - v / 2) + ' ' + v + ' ' + v;
	} else {
		return '0 0 ' + v + ' ' + v;
	}
}

function referenceValues(vBs, lC) {
	return {
		s80: vBs * 0.8,
		r80: vBs * 0.4,
		s50: vBs * 0.5,
		m: 10,
		points: 5
	};
}

function getVertexCoords(x = 0, y = 0, r = 1, n = 7, shift = 0) {
	let coords = [];
	let closeCoords = [];

	for (let i = 1; i <= n; i++) {
		coords.push([x + r * Math.cos(2 * Math.PI * i / n), y + r * Math.sin(2 * Math.PI * i / n)]);

		// keep return point
		if (i === 1) {
			closeCoords = coords[0];
		}
	}

	// shift the order in which the points join
	// creating stars when given odd number of nodes
	if (shift > 0 && n % 2 > 0) {
		let shifted = [];
		let i = 0;
		let added = 0;

		while (added <= n) {
			// start
			shifted.push(coords[i]);

			// skip points
			let next = i + 1 + shift;

			if (next >= n) {
				next = next - n;
			}

			//console.log(i, next)
			i = next;

			added++;
		}

		return shifted;
	}

	// add return point
	coords.push(closeCoords);

	return coords;
}

function getVertexCoordsStr(x = 0, y = 0, r = 1, n = 7, shift = 0) {
	let coords = getVertexCoords(x, y, r, n, shift);

	//console.log(coords);
	return coords.map(v => {
		return v.join(', ');
	}).join(' ');
}

function Art_svelte_instance($$self, $$props, $$invalidate) {
	let rv;
	let layers;
	let { viewBoxSize = 308 } = $$props;
	let { width = 308 } = $$props;
	let { height = 308 } = $$props;
	let { layerCount = 1 } = $$props;

	function getLayers(i) {
		let l = [];

		for (let i = 0; i < layerCount; i++) {
			l.push(i++);
		}

		return l;
	}

	$$self.$$set = $$props => {
		if ('viewBoxSize' in $$props) $$invalidate(0, viewBoxSize = $$props.viewBoxSize);
		if ('width' in $$props) $$invalidate(1, width = $$props.width);
		if ('height' in $$props) $$invalidate(2, height = $$props.height);
		if ('layerCount' in $$props) $$invalidate(5, layerCount = $$props.layerCount);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*viewBoxSize, layerCount*/ 33) {
			$: $$invalidate(4, rv = referenceValues(viewBoxSize, layerCount));
		}

		if ($$self.$$.dirty & /*layerCount*/ 32) {
			$: $$invalidate(3, layers = getLayers(layerCount));
		}
	};

	return [viewBoxSize, width, height, layers, rv, layerCount];
}

class Art extends internal/* SvelteComponent */.r7T {
	constructor(options) {
		super();

		(0,internal/* init */.TsN)(this, options, Art_svelte_instance, Art_svelte_create_fragment, internal/* safe_not_equal */.jXN, {
			viewBoxSize: 0,
			width: 1,
			height: 2,
			layerCount: 5
		});
	}
}

/* harmony default export */ const Art_svelte = (Art);
;// ./src/components/Toast.svelte
/* src/components/Toast.svelte generated by Svelte v4.2.19 */






//import { SVG } from '../lib/vendor/svg.js';









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

// (41:31) 
function Toast_svelte_create_if_block_3(ctx) {
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

// (39:4) {#if type === "success"}
function Toast_svelte_create_if_block_2(ctx) {
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

// (51:4) {#if dismissible}
function Toast_svelte_create_if_block_1(ctx) {
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
			(0,internal/* attr */.CFu)(button, "class", "close svelte-1dbp86a");
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

// (57:2) {#if $settings.toastArt }
function Toast_svelte_create_if_block(ctx) {
	let div;
	let art;
	let div_id_value;
	let current;
	art = new Art_svelte({});

	return {
		c() {
			div = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(art.$$.fragment);
			(0,internal/* attr */.CFu)(div, "class", "art");
			(0,internal/* attr */.CFu)(div, "id", div_id_value = 'svg' + /*svgId*/ ctx[5]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);
			(0,internal/* mount_component */.wSR)(art, div, null);
			current = true;
		},
		p: internal/* noop */.lQ1,
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(art.$$.fragment, local);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(art.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_component */.Hbl)(art);
		}
	};
}

function Toast_svelte_create_fragment(ctx) {
	let article;
	let div1;
	let current_block_type_index;
	let if_block0;
	let t0;
	let div0;
	let t1;
	let t2;
	let article_class_value;
	let article_transition;
	let current;
	const if_block_creators = [Toast_svelte_create_if_block_2, Toast_svelte_create_if_block_3, Toast_svelte_create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*type*/ ctx[0] === "success") return 0;
		if (/*type*/ ctx[0] === "error") return 1;
		return 2;
	}

	current_block_type_index = select_block_type(ctx, -1);
	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	const default_slot_template = /*#slots*/ ctx[7].default;
	const default_slot = (0,internal/* create_slot */.Of3)(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
	let if_block1 = /*dismissible*/ ctx[1] && Toast_svelte_create_if_block_1(ctx);
	let if_block2 = /*$settings*/ ctx[3].toastArt && Toast_svelte_create_if_block(ctx);

	return {
		c() {
			article = (0,internal/* element */.ND4)("article");
			div1 = (0,internal/* element */.ND4)("div");
			if_block0.c();
			t0 = (0,internal/* space */.xem)();
			div0 = (0,internal/* element */.ND4)("div");
			if (default_slot) default_slot.c();
			t1 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			t2 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			(0,internal/* attr */.CFu)(div0, "class", "text");
			(0,internal/* attr */.CFu)(div1, "class", "content svelte-1dbp86a");
			(0,internal/* attr */.CFu)(article, "class", article_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*type*/ ctx[0]) + " svelte-1dbp86a"));
			(0,internal/* attr */.CFu)(article, "role", "alert");
			(0,internal/* toggle_class */.goL)(article, "art", /*hasArt*/ ctx[2]);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, article, anchor);
			(0,internal/* append */.BCw)(article, div1);
			if_blocks[current_block_type_index].m(div1, null);
			(0,internal/* append */.BCw)(div1, t0);
			(0,internal/* append */.BCw)(div1, div0);

			if (default_slot) {
				default_slot.m(div0, null);
			}

			(0,internal/* append */.BCw)(div1, t1);
			if (if_block1) if_block1.m(div1, null);
			(0,internal/* append */.BCw)(article, t2);
			if (if_block2) if_block2.m(article, null);
			current = true;
		},
		p(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index !== previous_block_index) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				(0,internal/* check_outros */.GYV)();
				if_block0 = if_blocks[current_block_type_index];

				if (!if_block0) {
					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block0.c();
				} else {
					
				}

				(0,internal/* transition_in */.c7F)(if_block0, 1);
				if_block0.m(div1, t0);
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
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*dismissible*/ 2) {
						(0,internal/* transition_in */.c7F)(if_block1, 1);
					}
				} else {
					if_block1 = Toast_svelte_create_if_block_1(ctx);
					if_block1.c();
					(0,internal/* transition_in */.c7F)(if_block1, 1);
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				(0,internal/* group_outros */.V44)();

				(0,internal/* transition_out */.Tn8)(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				(0,internal/* check_outros */.GYV)();
			}

			if (/*$settings*/ ctx[3].toastArt) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*$settings*/ 8) {
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

			if (!current || dirty & /*type*/ 1 && article_class_value !== (article_class_value = "" + ((0,internal/* null_to_empty */.oEI)(/*type*/ ctx[0]) + " svelte-1dbp86a"))) {
				(0,internal/* attr */.CFu)(article, "class", article_class_value);
			}

			if (!current || dirty & /*type, hasArt*/ 5) {
				(0,internal/* toggle_class */.goL)(article, "art", /*hasArt*/ ctx[2]);
			}
		},
		i(local) {
			if (current) return;
			(0,internal/* transition_in */.c7F)(if_block0);
			(0,internal/* transition_in */.c7F)(default_slot, local);
			(0,internal/* transition_in */.c7F)(if_block1);
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
			(0,internal/* transition_out */.Tn8)(if_block0);
			(0,internal/* transition_out */.Tn8)(default_slot, local);
			(0,internal/* transition_out */.Tn8)(if_block1);
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

			if_blocks[current_block_type_index].d();
			if (default_slot) default_slot.d(detaching);
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (detaching && article_transition) article_transition.end();
		}
	};
}

function Toast_svelte_instance($$self, $$props, $$invalidate) {
	let $settings;
	(0,internal/* component_subscribe */.j0C)($$self, settings, $$value => $$invalidate(3, $settings = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	const dispatch = (0,runtime/* createEventDispatcher */.ur)();
	let svgId = (0,v4/* default */.A)();
	let hasArt = false;
	let { type = "error" } = $$props;
	let { dismissible = true } = $$props;

	(0,runtime/* onMount */.Rc)(() => {
		if ($settings.toastArt) {
			$$invalidate(2, hasArt = true);
		} //console.log('toast Art');
		/*
let draw = SVG().addTo('#svg' + svgId).size(270, 270);
let symbol = draw.symbol();  
symbol.rect(100, 100).attr({ fill: '#f06' });
draw.use(symbol).move(100, 100);
draw.use(symbol).move(10, 20).rotate(45).fill({ color: '#000', opacity: 0.6 });
*/
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
		hasArt,
		$settings,
		dispatch,
		svgId,
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

;// ./src/components/Toasts.svelte
/* src/components/Toasts.svelte generated by Svelte v4.2.19 */






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

;// ./src/components/Modal.svelte
/* src/components/Modal.svelte generated by Svelte v4.2.19 */






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
			(0,internal/* attr */.CFu)(button, "class", "close svelte-1t98tbr");
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

// (33:0) {#if modal}
function Modal_svelte_create_if_block(ctx) {
	let section;
	let button;
	let closeicon;
	let t0;
	let div;
	let t1;
	let t2;
	let section_name_value;
	let current;
	let mounted;
	let dispose;
	closeicon = new close_svelte({});
	let if_block0 = /*modal*/ ctx[1].title && Modal_svelte_create_if_block_3(ctx);
	let if_block1 = /*modal*/ ctx[1].message && Modal_svelte_create_if_block_2(ctx);
	let if_block2 = /*modal*/ ctx[1].component && Modal_svelte_create_if_block_1(ctx);

	return {
		c() {
			section = (0,internal/* element */.ND4)("section");
			button = (0,internal/* element */.ND4)("button");
			(0,internal/* create_component */.N0i)(closeicon.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			div = (0,internal/* element */.ND4)("div");
			if (if_block0) if_block0.c();
			t1 = (0,internal/* space */.xem)();
			if (if_block1) if_block1.c();
			t2 = (0,internal/* space */.xem)();
			if (if_block2) if_block2.c();
			(0,internal/* attr */.CFu)(button, "class", "close svelte-1t98tbr");
			(0,internal/* attr */.CFu)(div, "class", "content");
			(0,internal/* attr */.CFu)(section, "class", "modal svelte-1t98tbr");
			(0,internal/* attr */.CFu)(section, "name", section_name_value = /*modal*/ ctx[1].title);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, section, anchor);
			(0,internal/* append */.BCw)(section, button);
			(0,internal/* mount_component */.wSR)(closeicon, button, null);
			(0,internal/* append */.BCw)(section, t0);
			(0,internal/* append */.BCw)(section, div);
			if (if_block0) if_block0.m(div, null);
			(0,internal/* append */.BCw)(div, t1);
			if (if_block1) if_block1.m(div, null);
			(0,internal/* append */.BCw)(div, t2);
			if (if_block2) if_block2.m(div, null);
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
					if_block0.m(div, t1);
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
					if_block1.m(div, t2);
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
					if_block2.m(div, null);
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
			(0,internal/* transition_in */.c7F)(closeicon.$$.fragment, local);
			(0,internal/* transition_in */.c7F)(if_block2);
			current = true;
		},
		o(local) {
			(0,internal/* transition_out */.Tn8)(closeicon.$$.fragment, local);
			(0,internal/* transition_out */.Tn8)(if_block2);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				(0,internal/* detach */.YoD)(section);
			}

			(0,internal/* destroy_component */.Hbl)(closeicon);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			mounted = false;
			dispose();
		}
	};
}

// (39:8) {#if modal.title}
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

// (43:8) {#if modal.message}
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

// (47:8) {#if modal.component}
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

;// ./src/components/Modals.svelte
/* src/components/Modals.svelte generated by Svelte v4.2.19 */







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
	let div;
	let toasts;
	let t0;
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
			div = (0,internal/* element */.ND4)("div");
			(0,internal/* create_component */.N0i)(toasts.$$.fragment);
			t0 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(navigation.$$.fragment);
			t1 = (0,internal/* space */.xem)();
			main = (0,internal/* element */.ND4)("main");
			(0,internal/* create_component */.N0i)(docbrowser.$$.fragment);
			t2 = (0,internal/* space */.xem)();
			(0,internal/* create_component */.N0i)(modals.$$.fragment);
			(0,internal/* attr */.CFu)(div, "data-light-mode", div_data_light_mode_value = /*$settings*/ ctx[0].lightMode);
		},
		m(target, anchor) {
			(0,internal/* insert */.Yry)(target, div, anchor);
			(0,internal/* mount_component */.wSR)(toasts, div, null);
			(0,internal/* append */.BCw)(div, t0);
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
				(0,internal/* detach */.YoD)(div);
			}

			(0,internal/* destroy_component */.Hbl)(toasts);
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [522], () => (__webpack_require__(292)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;