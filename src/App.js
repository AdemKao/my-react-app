import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([
    // use json server , turn these object to db.json
    // {
    //   id: 1,
    //   text: "Doctors Appointment",
    //   day: "Feb 5th at 2:30pm",
    //   reminder: true,
    // },
    // {
    //   id: 2,
    //   text: "Meeting at School",
    //   day: "Feb 6th at 1:30pm",
    //   reminder: true,
    // },
    // {
    //   id: 3,
    //   text: "Food Shopping",
    //   day: "Feb 5th at 2:30pm",
    //   reminder: false,
    // },
  ]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  //  Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    return data;
  };

  //  Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  };

  //  Add Task
  const addTask = async (task) => {
    //  Request Add to API
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    //  Add UI
    setTasks([...tasks, data]);

    // console.log("addTask", task);
    // const id = Math.floor(Math.random() * 1000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
  };

  //  Delete Task
  const deleteTask = async (id) => {
    //  console.log("delete", id);
    //  Request Delete Tasks to API
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });

    //  Setting UI
    setTasks(tasks.filter((task) => task.id !== id));
  };

  //  Toggle Reminder
  const toggleRemider = async (id) => {
    //  Response ID from API
    const taskToToggle = await fetchTask(id);
    const updTask = { taskToToggle, reminder: !taskToToggle.reminder };

    //  Request change toggle to API
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });

    const data = await res.json();

    setTasks(tasks.map((task) => (task.id === id ? { ...task, reminder: data.reminder } : task)));

    // console.log(id);
    // setTasks(tasks.map((task) => (task.id === id ? { ...task, reminder: !task.reminder } : task)));
  };

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Routes>
          <Route
            path="/"
            // exact //V6 不需增加exact
            // render={(props) => (
            //   <>
            //     {showAddTask && <AddTask onAdd={addTask} />}
            //     {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleRemider} /> : "No Tasks To Show"}
            //   </>
            // )}
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleRemider} /> : "No Tasks To Show"}
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// //use class
// class App extends React.Component {
//   render() {
//     return <h1>Hello from class</h1>;
//   }
// }

export default App;
