import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Banner from "./components/Banner"
import Todo from "./components/Todo";
import Info from "./components/Info";
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Popup from 'reactjs-popup';
import { deletePhoto} from "./db.jsx"

const FILTER_MAP = {
  All: () => true,
  Safe: (task) => !task.completed,
  Dangerous: (task) => task.completed
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

//App function
function App(props) {

    //geolocation
    function geoFindMe() {
      
      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Get the city name from the OpenCage Geocoder API
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=49352c6399a04850b1d5a27833bd8fe8&language=en`)
        
          .then(response => response.json())
          .then(data => {
            const city = data.results[0].components.city;
            if (city) {
              console.log("city found");

            } else {
              console.log("city not found");
            }
                   // weather forecast API call using the latitude and longitude values
      fetch(`https://api.weatherapi.com/v1/forecast.json?key=1292600cad6a4cb6b31172718231303&q=${latitude},${longitude}&days=1`)
      .then(response => response.json())
      .then(weatherData => {
        const temperature = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
        const iconUrl = weatherData.current.condition.icon;
        console.log(`Temperature in ${city}: ${temperature}°C`);
        console.log(`Weather condition in ${city}: ${condition} ${iconUrl}`);

        // Call the locateTask function with the weather forecast data
        locateTask(lastInsertedId, {latitude: latitude, longitude: longitude, city: city, temperature: temperature, condition: condition, iconUrl: iconUrl, error: "", mapLink: ""});
      })
      .catch(error => {
        console.log("Weather forecast API error:", error);
      });
            locateTask(lastInsertedId, {latitude: latitude, longitude: longitude, city: city, error: "", mapLink: ""});
          })
          .catch(error => {
            console.log("city not found");
          });
        }
    
      function error() {
        console.log("unable to retrive location!");
      }
    
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser");
      } else {
        console.log("locating");
        navigator.geolocation.getCurrentPosition(success, error);
      }
    }

  const [tasks, setTasks] = useState(() => {
    const initialValue = localStorage.getItem('todo-items')
    
    return initialValue !== null ? JSON.parse(initialValue) : []
  });

  const [filter, setFilter] = useState('All');
  const [lastInsertedId, setLastInsertedId] = useState("");

  useEffect(() => {
    localStorage.setItem('todo-items', JSON.stringify(tasks));
  },[tasks])

  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = { id: id, date: new Date().toLocaleString(), name, completed: false, location: {latitude:"", longitude:"", error:"", city:"", mapLink: "", temperature: "", condition: "", iconUrl:""}};
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
  }    

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {

      // if this task has the same ID as the edited task
      if (id === task.id) {

        // use object spread to make a new object whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }
  
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    deletePhoto(id);
  }  

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {

    // if this task has the same ID as the edited task
      if (id === task.id) {
        
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }  

  function locateTask(id, location) {
    const locatedTaskList = tasks.map((task) => {

      // if this task has the same ID as the edited task
        if (id === task.id) { return {...task, location: location}
      }
      return task;
    });
    setTasks(locatedTaskList);
  }  

  function photoedTask(id){
    const photoedTaskList = tasks.map(task =>{
      if(id === task.id){
        return{...task, photo: true}
      }
      return task;
    });
    setTasks(photoedTaskList);
  }

  const taskList = tasks
.filter(FILTER_MAP[filter])
.map((task) => (
  <Todo
    id={task.id}
    name={task.name}
    date={task.date}
    completed={task.completed}
    key={task.id}
    latitude={task.location.latitude}
    longitude={task.location.longitude}
    city={task.location.city}
    temperature={task.location.temperature}
    condition={task.location.condition}
    iconUrl={task.location.iconUrl}
    mapLink={`https://www.openstreetmap.org/#map=18/${task.location?.latitude ?? ''}/${task.location?.longitude ?? ''}`}
    toggleTaskCompleted={toggleTaskCompleted}
    photoedTask={photoedTask}
    deleteTask={deleteTask}
    editTask={editTask}
   
  />
));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  
  const tasksNoun = taskList.length !== 1 ? 'Entries' : 'Entry';
  const headingText = `${taskList.length} ${tasksNoun}`;

  //render
  return (
    <div className="todoapp">
      <div className="menu">
        <div className="menl">
<img width={80} className="logo" src="\icons\theicon.png" alt="weatherpal logo"></img>
        </div>
        <div className="wp"><a>WeatherPal</a></div>
        <div className="menr">
        <Popup contentStyle={{width: "450px",alignItems: "center", justifyContent: "center", textAlign: "center"}} overlayStyle={{ display: "flex", alignItems: "center", justifyContent: "center"}} trigger={<button id="flag">?</button>} modal>
  <div className="webcam-capture"><Info/></div>
</Popup>
        </div>
      </div>
      <div className="todoa stack-large">
      <h1>WeatherPal</h1>
      <h4>Easy way to alert others about the weather conditions in your area. Stay safe!</h4>
      <Banner />
      <Form addTask={addTask} geoFindMe={geoFindMe} />
      <div className="filters btn-group stack-exception">
      {filterList}
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
    </div>
  );
}

export default App;

