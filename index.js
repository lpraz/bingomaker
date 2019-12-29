import {h, app} from "hyperapp"

app({
    node: document.getElementById("app"),
    init: {},
    view: () => <p>Hello, world!</p>
})