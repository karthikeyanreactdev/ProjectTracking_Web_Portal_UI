import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import projectReducer from '../store/reducer/projectReducer';
// creating and store and passing reducer and thunk middleware as parameter
let store=createStore(projectReducer, applyMiddleware(thunk));
export default store
