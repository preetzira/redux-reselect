import * as ACTION_TYPE from '../flags'

export function addTodo(todoValue) {
    return dispatch => {
        let todoData
        if (typeof todoValue === "object") {
            todoData = [Object.assign({}, todoValue, { modifiedAt: Date.now() })]
        } else {
            todoData = [{
                value: todoValue,
                createdAt: Date.now(),
                modifiedAt: "",
                isPending:true
            }]
        }
        dispatch({
            type: ACTION_TYPE.ADD_NEW_TODO,
            payload: todoData
        })
    }
}

export function removeATodo(allTodos, todoToBeRemoved) {
    return dispatch => {
        const _allTodos = allTodos.slice()
        const todosAfterRemoving = _allTodos.filter(todoItem => todoItem.createdAt !== todoToBeRemoved.createdAt)
        dispatch({
            type: ACTION_TYPE.REMOVE_A_TODO,
            payload: todosAfterRemoving
        })
    }
}

export function editATodo(todoToBeEdited) {
    return dispatch => {
        dispatch({
            type: ACTION_TYPE.EDIT_A_TODO,
            payload: todoToBeEdited
        })
    }
}

export function clearAllTodos() {
    return dispatch => {
        dispatch({
            type: ACTION_TYPE.CLEAR_TODO_LIST
        })
    }
}

export function toggleTodoState(todoToBeToggled){
    return dispatch => {
        dispatch({
            type:ACTION_TYPE.TOGGLE_TODO_STATE,
            payload: todoToBeToggled
        })
    }
}