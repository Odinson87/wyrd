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

export default Filters;