import { createSelector } from 'reselect'

export const getAllTodos = state => state.todos

export const getCompletedTodos = createSelector([getAllTodos], todos => todos
        .filter(todo=>!todo.isPending))

export const getInCompleteTodos = createSelector([getAllTodos], todos => todos
        .filter(todo=>todo.isPending))