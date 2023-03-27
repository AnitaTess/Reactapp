import React, { useState, useRef, useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Webcam from 'react-webcam';
import { addPhoto, GetPhotoSrc} from "../db.jsx"

const WebcamCapture = (props) => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [ImgId, setImgId] = React.useState(null);
  const [PhotoSave, setPhotoSave] = React.useState(false);

  useEffect(() => {
    if (PhotoSave) {
      props.photoedTask(ImgId);
      setPhotoSave(false);
    }
  });

  const capture = React.useCallback((id) => {
    const ImageSrc = webcamRef.current.getScreenshot();
    setImgSrc(ImageSrc);
  },
  [webcamRef, setImgSrc]);
  const SavePhoto = (id, imgSrc) => {
    console.log("photosave detected")
    addPhoto(id, imgSrc);
    console.log("pic added")
    setImgId(id);
    console.log("img id set")
    setPhotoSave(true);
    console.log("pic saved")
  }
  return(
<>
{!imgSrc && (<Webcam
  audio = {false}
  ref={webcamRef}
  height={350}
  width={350}
  screenshotFormat = "image/jpeg"
 /> )}
 {imgSrc && (<img src={imgSrc}/>)}
 <div className="btn-group">
  {!imgSrc && (<button type="button" className="btn" onClick={()=>capture(props.id)}>Capture Photo</button>)}
  {imgSrc && (<button type="button" className="btn" onClick={()=>SavePhoto(props.id,imgSrc)}>Save Photo</button>)}
 </div>
</>
  );
};
//Retrieving photo by id from IndexedDBusing GetPhotoSrcin db.jsx
const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);
  //Render image tag with src attribute set to data URL retrieved from IndexedDB
  return(
    <>
    <div>
      <img src={photoSrc} alt={props.name}/>
    </div>
    </>
  )
}

export default function Todo(props) {
  const [showContent, setShowContent] = useState(false);

    const [isEditing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    function handleChange(e) {
        setNewName(e.target.value);
      }
      function handleSubmit(e) {
        e.preventDefault();
        props.editTask(props.id, newName);
        setNewName("");
        setEditing(false);
      }
      
      
    const editingTemplate = (
        <form className="stack-small" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="todo-label" htmlFor={props.id}>
              New name for {props.name}
            </label>
            <input
  id={props.id}
  className="todo-text"
  type="text"
  value={newName}
  onChange={handleChange}/>
          </div>
          <div className="btn-group">
          <button
  type="button"
  className="btn todo-cancel"
  onClick={() => setEditing(false)}>Cancel<span className="visually-hidden">renaming {props.name}</span>
</button>

            <button type="submit" className="btn btn__primary todo-edit">
              Save
              <span className="visually-hidden">new name for {props.name}</span>
            </button>
          </div>
        </form>
      );

      const viewTemplate = (
        <div id="cont">
      <button className={`tabbtn ${props.completed ? 'completed' : ''}`} onClick={() => setShowContent(!showContent)}>
        {showContent ? '➘ ' + props.name : '➙ ' + props.name }
      </button>
      {showContent && (
        <div>
        <div className="all">
          <a className="dangerous">Dangerous?</a>
        <div className="stack-small">
          <div className="c-cb">
            
              <input
                id={props.id}
                type="checkbox"
                defaultChecked={props.completed}
                onChange={() => props.toggleTaskCompleted(props.id)}
                
              />
              
              <label className="todo-label" htmlFor={props.id}>
                {props.name}</label>
                <div className="both">
                
                  <p>
                <br></br> at {props.date} 
                <br></br> from {props.city}
                | la {props.latitude}
                | lo {props.longitude}
                <br></br> {props.temperature}°C
                | {props.condition} 
                </p>
                
               
                <img width={50} src={props.iconUrl} alt="weather icon" />
                
                </div>
              </div>
              <div className="map-container">
                <div className="lefto">
              <a href={props.mapLink}>Map</a></div>
      <iframe
        title="OpenStreetMap"
        width="100%"
        height="400"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${props.longitude},${props.latitude},${props.longitude},${props.latitude}&layer=mapnik&marker=${props.latitude},${props.longitude}`}
      ></iframe>
    </div>
    

            <div className="btn-group">
            <button type="button" className="btn" onClick={() => setEditing(true)}>
  Edit <span className="visually-hidden">{props.name}</span>
</button>
<Popup contentStyle={{width: "450px",alignItems: "center", justifyContent: "center", textAlign: "center"}} overlayStyle={{ display: "flex", alignItems: "center", justifyContent: "center"}} trigger={<button type="button" className="btn">Selfie!</button>} modal>
  <div className="webcam-capture"><WebcamCapture id={props.id} photoedTask={props.photoedTask}/></div>
</Popup>
<Popup contentStyle={{width: "450px",alignItems: "center", justifyContent: "center", textAlign: "center"}} trigger={<button type="button" className="btn">View Photo</button>} modal>
  <div className="view-photo"><ViewPhoto id={props.id} alt={props.name}/></div>
</Popup>
              <button
                type="button"
                className="btn btn__danger"
                onClick={() => props.deleteTask(props.id)}
              >
                Delete <span className="visually-hidden">{props.name}</span>
              </button>
            </div>
        </div>
        </div>
        </div>
        )}
    </div>
      );      

      return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;

  }
  