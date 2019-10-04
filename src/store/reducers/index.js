import * as ACTION_TYPE from '../flags'

const initialState = {
    todos: [],
    todoToBeEdited: {}
}


export default function(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.ADD_NEW_TODO:
            return {
                ...state,
                todos: [...state.todos, ...action.payload],
                todoToBeEdited: {}
            }
        case ACTION_TYPE.REMOVE_A_TODO:
            return {
                ...state,
                todos: [...action.payload]
            }
        case ACTION_TYPE.EDIT_A_TODO:
            return {
                ...state,
                todoToBeEdited: action.payload
            }
        case ACTION_TYPE.CLEAR_TODO_LIST:
            return {
                ...state,
                todos: [],
                todoToBeEdited: {}
            }
        case ACTION_TYPE.TOGGLE_TODO_STATE:
            return {
                ...state,
                todos: state.todos.map(todo=>todo.createdAt === action.payload.createdAt ? Object.assign({},todo,{isPending:!action.payload.isPending}) : todo)
            }
        default:
            return state
    }
}