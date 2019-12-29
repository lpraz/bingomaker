import {h, app} from "hyperapp"

const minSpaces = 24;
const states = {editor: "editor"};

const eventValue = event => event.target.value;

const view = {
    main: state => {
        console.log(state);
        if (state.state == states.editor)
            return view.editor(state.contents);
        else
            return view.error();
    },

    error: () => "An unexpected error occurred! Please refresh and try again.",

    editor: state => h("div", {}, [
        view.freeSpace(state.freeSpace),
        view.spaces(state.spaces),
        view.addSpace(),
        view.generate()
    ]),

    freeSpace: freeSpace => h("div", {}, [
        h("label", {}, "Free space:"),
        h("input", {}, freeSpace)
    ]),

    spaces: spaces => spaces.map((item, index) => h("div", {}, [
        h(
            "button",
            {
                disabled: spaces.length === minSpaces,
                onClick: action.removeSpace(index)
            },
            "-"),
        h("label", {}, `${index + 1}:`),
        h("input", {onChange: [action.editSpace(index), eventValue], value: item})
    ])),

    addSpace: () => h("button", {onClick: action.addSpace}, "+"),

    generate: () => h("button", {}, "Generate!")
};

const action = {
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
    })
};

app({
    node: document.getElementById("app"),
    init: {
        state: states.editor,
        contents: {
            freeSpace: "",
            spaces: Array(minSpaces).fill(undefined)
        }
    },
    view: state => view.main(state)
});