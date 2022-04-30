import React, { useEffect, useState } from "react";

export default function App(){

  //track of todos
  const[todos,setTodos] = useState(()=>{
    const savedTodos = localStorage.getItem("todos")
    if(savedTodos){
      // return the parsed JSON object back to a javascript object
      return JSON.parse(savedTodos)
    }else{
      return []
    }
  })

  //track of user input
  const[todo,setTodo] = useState("")


  // for editing
  //boolean state to know if we are editing
  //this will let us display different inputs based on a condition (conditional rendering)
  const[isEditing,setIsEditing] = useState(false)
  //object state to set so we know which todo item we are editing
  const[currentTodo,setCurrentTodo] = useState({})
console.log("current todo:", currentTodo)

  function handleInputChange(e){
    setTodo(e.target.value)
  }

  //to create a new object i.e todo(task)
  function handleFormSubmit(e){
    e.preventDefault();
    //dont submit if input is an empty string
    if(todo !==""){
      setTodos([
        ...todos,
        {
          id:todos.length+1,
          text:todo.trim()
        }
      ])
    }
    //clear out input box
    setTodo("");
  }

  function handleDeleteClick(id){
    const removeItem = todos.filter((todo)=>{
            // return the rest of the todos that don't match the item we are deleting
      return (todo.id !== id)
    })
    setTodos(removeItem)
  }

  function handleEditInputChange(e){
    setCurrentTodo({...currentTodo,text:e.target.value})
    console.log("on current edit: ",currentTodo)
  }


  useEffect(()=>{
    // JSON.stringify will convert the object into a JSON string 
    //because localstorage stores strings as key values pair 
    localStorage.setItem("todos",JSON.stringify(todos))

  },[todos])

  //when edit button is clicked
  function handleEditClick(todo){
    setIsEditing(true);
    // set the currentTodo to the todo item that was clicked
    setCurrentTodo({...todo})
  }

  //to edit a todo item
  function handleUpdateTodo(id,updatedTodo){
    // here we are mapping over the todos array - the idea is check if the todo.id matches the id we pass into the function
    // if the id's match, use the second parameter to pass in the updated todo object
    // otherwise just use old todo
    const updatedItem = todos.map((todo)=>{
      return todo.id === id ? updatedTodo : todo;
    })
    setIsEditing(false);
    setTodos(updatedItem)
  }

  function handleEditFormSubmit(e){
    e.preventDefault()
    handleUpdateTodo(currentTodo.id,currentTodo);
  }


  return(
    <div className="App">

      {isEditing?(
        <form onSubmit={handleEditFormSubmit}>
          <h2>Edit Todo</h2>
          <label htmlFor="editTodo">Edit todo:</label>
          <input
            name="editTodo"
            type="text"
            placeholder="Edit Todo"
            value={currentTodo.text}
            onChange={handleEditInputChange}
          />
          <button type="submit">Update</button>
          <button onClick={()=>setIsEditing(false)}>Cancel</button>
        </form>
      ):(
        // for input  
        <form onSubmit={handleFormSubmit}>
        <h2>Add Todo</h2>
        <label htmlFor="todo">Add todo:</label>
        <input 
          name="todo" 
          type="text" 
          placeholder="Create a new Todo" 
          value={todo}
          onChange={handleInputChange}
        />
        <button type="submit">Add</button>
      </form>
       )}

      {/* for todo lists */}
      <ul className="todo-list">
        {todos.map((todo)=>{
            return <li key={todo.id}>
              {todo.text}
              {/* on a side note, notice how we are calling the handleDeleteClick function, this makes sure we are not
              running the function on page load, but rather when the button is clicked  */}
              <button onClick={()=>handleEditClick(todo)}> Edit</button>
              <button onClick={()=>handleDeleteClick(todo.id)}> Del</button>
              </li>
         })}

         {/* {todos.map((todo)=>(
           <li>{todo}</li>
         ))} */}
        
      </ul>
    </div>
  )
}