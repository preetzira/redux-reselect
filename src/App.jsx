import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux'
import { getAllTodos, getInCompleteTodos, getCompletedTodos } from './store/selectors'
import { toggleTodoState, addTodo, editATodo, removeATodo } from './store/actions-creators';



function ListAllTodos(props){
  const {todos,toggle,edit,remove} = props
  return (
    <ol>
      {
        todos.map(todo=>(
          <li key={todo.createdAt}>
            <span onClick={e=>toggle(todo)} className={todo.isPending ? `pending` : `completed` }>{todo.value}</span>
            <button onClick={e=>edit(todos,todo)}>Edit</button>
            <button onClick={e=>remove(todos,todo)}>Remove</button>
          </li>
        ))
      }
    </ol>
  )
}


function App(props) {
  const [state,setState] = useState(null)
  let showingTodos = []

  useEffect(()=>{
    const { dispatch, ...restProps } = props
    const value = props.todoToBeEdited.value ? props.todoToBeEdited.value : "" 
    setState(previousState=>({
      ...previousState,
      ...restProps,
      isEditing:false,
      value,
      showingTodos: previousState && previousState.showingTodos ? previousState.showingTodos : "all" 
    }))
    if(state && state.showingTodos === "all"){
      showingTodos = state.allTodos
    } else if(state && state.showingTodos === "completed"){
      showingTodos = state.completedTodos
    }
    else if(state && state.showingTodos === "pending"){
      showingTodos = state.inCompleteTodos
    }
    console.log(showingTodos)
  },[props.todos,props.todoToBeEdited])

  const removeTodo = (allTodos,todoToBeRemoved) => {
    console.log(allTodos,todoToBeRemoved)
    props.dispatch(removeATodo(allTodos,todoToBeRemoved))
  }

  const editTodo = async (allTodos,todoToBeEdited) => {
    await props.dispatch(removeATodo(allTodos, todoToBeEdited))
    await props.dispatch(editATodo(todoToBeEdited))
    setState(previousState=>({
      ...previousState,
      isEditing:true,
      value:todoToBeEdited.value
    }))
  }

  const toggleTodo = (todoToBeToggled) => {
    props.dispatch(toggleTodoState(todoToBeToggled))
  }

  const addNewTodo = (e) => {
    e.preventDefault()
    if(e.target.value === ""){
      e.target.required = true
      return
    }
    const value = state.isEditing ? Object.assign({},state.todoToBeEdited,{value:state.value}) : state.value
    props.dispatch(addTodo(value))
    setState(previousState=>({
      ...previousState,
      isEditing:false,
      value:""
    }))
    
  }

  const handleChange = e => {
    const value = e.target.value
    setState(prevState=>({
      ...prevState,
      value
    }))
  }

  const handleFilter = e => {
    const value = e.target.name
    setState(prevState=>({
      ...prevState,
      showingTodos : value
    }))
  }

  if(state === null){
    return <>Loading...</>
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form onSubmit={addNewTodo}>
          <input type="text" value={state.value} onChange={handleChange} required/>
          <button type="submit">Add</button>
        </form>
      </header>
      <ListAllTodos todos={showingTodos} edit={editTodo} remove={removeTodo} toggle={toggleTodo}/>
      {
        state.allTodos.length ? <ol>
          <li>
            <button name="completed" onClick={handleFilter} className="list-toggler">Completed</button>
            <button name="pending" onClick={handleFilter} className="list-toggler">Pending</button>
            <button name="all" onClick={handleFilter} className="list-toggler">All</button>
          </li> 
        </ol>: ""
      }
    </div>
  );
}

function mapStateToProps(state){
  return {
    allTodos:getAllTodos(state),
    completedTodos:getCompletedTodos(state),
    inCompleteTodos:getInCompleteTodos(state),
    todoToBeEdited:state.todoToBeEdited
  }
}

export default connect(mapStateToProps)(App);
