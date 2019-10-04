import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootState from './reducers/index'

const store = createStore(rootState, applyMiddleware(thunk))

export default store