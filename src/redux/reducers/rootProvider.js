import { combineReducers } from "redux";

import registers from "./registors";

const rootProvider = combineReducers({
    registers: registers,
});

export default rootProvider;