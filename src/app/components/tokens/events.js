const events = {
    HANDLE_CELL_CLICK: (cell, reactEvent, id, browserEvent) => {
        console.log('On Cell Click Event');
    },
    HANDLE_CELL_DOUBLE_CLICK: (cell, reactEvent, id, browserEvent) => {
        console.log('On Cell Double Click Event');
    },
    HANDLE_ROW_CLICK: (row, reactEvent, id, browserEvent) => {
        console.log('On Row Click Event');
    },
    HANDLE_ROW_DOUBLE_CLICK: (row, reactEvent, id, browserEvent) => {
        console.log('On Row Double Click Event');
    },
    HANDLE_BEFORE_SELECTION: () => {
        console.log('On Before Selection')
    },
    HANDLE_AFTER_SELECTION: () => {
        console.log('On After Selection');
    },
    HANDLE_AFTER_INLINE_EDITOR_SAVE: () => {
        console.log('On After Save Inline Editor Event');
    },
    HANDLE_BEFORE_BULKACTION_SHOW: () => {
        console.log('On Before Bulk Action Show');
    },
    HANDLE_AFTER_BULKACTION_SHOW: () => {
        console.log('On After Bulk Action Show');
    }
};

export default events
