import {h, app} from "hyperapp"

const minSpaces = 24;
const states = {editing: "editing", viewing: "viewing"};

const eventValue = event => event.target.value;

const view = {
    main: state => {
        console.log(state);
        if (state.state == states.editing)
            return view.editor(state);
        
        if (state.state == states.viewing)
            return view.viewer(state);
        
        return view.error();
    },

    error: () => "An unexpected error occurred! Please refresh and try again.",

    editor: state => h("div", {}, [
        view.title(state.contents.title),
        view.freeSpace(state.contents.freeSpace),
        view.addSpace(),
        view.generate(),
        view.spaces(state.contents.spaces)
    ]),

    title: title => h("div", {}, [
        h("label", {}, "Title:"),
        h("input", {onChange: [action.editTitle, eventValue],
            value: title})
    ]),

    freeSpace: freeSpace => h("div", {}, [
        h("label", {}, "Free space:"),
        h("input", {
            onChange: [action.editFreeSpace, eventValue],
            value: freeSpace})
    ]),

    spaces: spaces => spaces.map((item, index) => h("div", {}, [
        h(
            "button",
            {
                disabled: spaces.length === minSpaces,
                onClick: action.removeSpace(index),
                tabindex: -1
            },
            "-"),
        h("label", {}, `${index + 1}:`),
        h("input", {onChange: [action.editSpace(index), eventValue], value: item})
    ])),

    addSpace: () => h("button", {onClick: action.addSpace}, "+"),

    generate: () => h("button", {onClick: action.changeToView}, "Generate!"),

    viewer: state => h("div", {}, [
        h("table", {}, [
            view.cardTitle(state.contents.title),
            view.cardRow(state.contents.spaces.slice(0, 5)),
            view.cardRow(state.contents.spaces.slice(5, 10)),
            view.cardFreeSpaceRow(state.contents.spaces.slice(10, 14),
                state.contents.freeSpace),
            view.cardRow(state.contents.spaces.slice(14, 19)),
            view.cardRow(state.contents.spaces.slice(19, 24))
        ])
    ]),

    cardTitle: title => h("tr", {}, h("th", {colspan: 5}, title)),

    cardRow: spaces => h("tr", {}, spaces.map(view.cardSpace)),

    cardFreeSpaceRow: (spaces, freeSpace) => h("tr", {}, [
        view.cardSpace(spaces[0]),
        view.cardSpace(spaces[1]),
        view.cardSpace(freeSpace),
        view.cardSpace(spaces[2]),
        view.cardSpace(spaces[3])
    ]),

    cardSpace: space => h("td", {}, space)
};

const action = {
    editTitle: (state, newTitle) => ({
        ...state,
        contents: {
            ...state.contents,
            title: newTitle
        }
    }),

    editFreeSpace: (state, newSpace) => ({
        ...state,
        contents: {
            ...state.contents,
            freeSpace: newSpace
        }
    }),

    addSpace: state => ({
        ...state,
        contents: {
            ...state.contents,
            spaces: state.contents.spaces.concat("")
        }
    }),

    editSpace: editIndex => (state, newSpace) => ({
        ...state,
        contents: {
            ...state.contents,
            spaces: state.contents.spaces.map((space, index) => {
                if (index == editIndex)
                    return newSpace;

                return space;
            })
        }
    }),

    removeSpace: removeIndex => state => ({
        ...state,
        contents: {
            ...state.contents,
            spaces: state.contents.spaces.filter(
                (_, index) => index != removeIndex)
        }
    }),

    changeToView: state => ({
        ...state,
        state: states.viewing
    })
};

app({
    node: document.getElementById("app"),
    init: {
        state: states.editing,
        contents: {
            title: "",
            freeSpace: "",
            spaces: Array(minSpaces).fill(undefined)
        }
    },
    view: state => view.main(state)
});