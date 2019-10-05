import React, { useState, useEffect } from 'react';
import './App.css';
import { connect } from 'react-redux'
import { getAllTodos, getInCompleteTodos, getCompletedTodos } from './store/selectors'
import { toggleTodoState, addTodo, editATodo, removeATodo } from './store/actions-creators';



function ListAllTodos(props){
  const {todos,toggle,edit,remove} = props
  return (
    <ol>
      {
        todos.map((todo,i)=>(
          <li key={i}>
            <span onClick={e=>toggle(todo)} className={todo.isPending ? `pending` : `completed` }>{todo.value}<br />
              <small>{new Date(todo.createdAt).toString().split("GMT")[0]}</small>
              {todo.modifiedAt ? <small> > {new Date(todo.modifiedAt).toString().split("GMT")[0]}</small> : ""}
            </span>
            <button onClick={e=>edit(todos,todo)}>Edit</button>
            <button onClick={e=>remove(todos,todo)}>Remove</button>
          </li>
        ))
      }
    </ol>
  )
}


function App(props) {
  const [state,setState] = useState({
    todoToBeEdited:{},
    showingTodos:'all',
    isEditing:false,
    value:""
  })
  const [showingTodos,setShowTodos] = useState(null)

  const { dispatch, todoToBeEdited } = props
  useEffect(()=>{
    const value = props.todoToBeEdited.value ? props.todoToBeEdited.value : "" 
    setState(previousState=>({
      ...previousState,
      todoToBeEdited,
      value
    }))
    if(state.showingTodos === "completed"){
      setShowTodos([...props.completedTodos])
    }
    else if(state.showingTodos === "pending"){
      setShowTodos([...props.inCompleteTodos])
    } else {
      setShowTodos([...props.allTodos])
    }
    window.addEventListener('scroll',e=>{
      // if(document.documentElement.scrollTop > 50 && )
    })
  },[props,state.showingTodos,todoToBeEdited])

  const removeTodo = (allTodos,todoToBeRemoved) => {
    dispatch(removeATodo(allTodos,todoToBeRemoved))
  }

  const editTodo = async (allTodos,todoToBeEdited) => {
    await dispatch(removeATodo(allTodos, todoToBeEdited))
    dispatch(editATodo(todoToBeEdited))
    setState(previousState=>({
      ...previousState,
      isEditing:true,
      value:todoToBeEdited.value
    }))
  }

  const toggleTodo = (todoToBeToggled) => {
    dispatch(toggleTodoState(todoToBeToggled))
  }

  const addNewTodo = (e) => {
    e.preventDefault()
    if(e.target.value === ""){
      e.target.required = true
      return
    }
    const value = state.isEditing ? Object.assign({},state.todoToBeEdited,{value:state.value}) : state.value
    dispatch(addTodo(value))
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

  const handleBackgroundChange = (e) => {
    const _e = e;
    if(_e.target.value === "#fff"){
      document.documentElement.style.setProperty(`--formbg`,getRandomColor())
      document.documentElement.style.setProperty(`--text`,getRandomColor())
      document.documentElement.style.setProperty(`--${_e.target.name}`,`${_e.target.value}`)
      
    } else {
      document.documentElement.style.setProperty(`--formbg`,`${getRandomColor()}66`)
      document.documentElement.style.setProperty(`--text`,getRandomColor())
      document.documentElement.style.setProperty(`--${_e.target.name}`,`linear-gradient(120deg,${getRandomColor()},${getRandomColor()},${getRandomColor()})`)

    }
  }

  if(state === null || showingTodos === null){
    return <>Loading...</>
  }

  return (
    <div className="App">
      <div className="background-toggler">
        <select name="background" onChange={handleBackgroundChange}>
          <option value="linear-gradient(120deg, #a81010,#653445,#1bffce)">Gradient</option>
          <option value="#fff">White</option>
        </select>
      </div>
      <form onSubmit={addNewTodo}>
        <input type="text" value={state.value} onChange={handleChange} placeholder="Write your todos here" required/>
        <button type="submit">Add</button>
      </form>
      <ListAllTodos todos={showingTodos} edit={editTodo} remove={removeTodo} toggle={toggleTodo}/>
      {
        props.allTodos.length ? <ol>
          <li>
            <button name="completed" onClick={handleFilter} className={`list-toggler ${state.showingTodos === "completed" ? 'active' : ''}`}>Completed</button>
            <button name="pending" onClick={handleFilter} className={`list-toggler ${state.showingTodos === "pending" ? 'active' : ''}`}>Pending</button>
            <button name="all" onClick={handleFilter} className={`list-toggler ${state.showingTodos === "all" ? 'active' : ''}`}>All</button>
          </li> 
        </ol>: ""
      }
    </div>
  );
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
