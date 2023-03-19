import React, { useState, useEffect } from "react";

function WeatherComponent() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  
  useEffect(() => {
    fetch('https://api.unsplash.com/photos/random?query=weather&client_id=tWMsP5MQbHpQpd9ioizhGs5KcrWay_dHysoPk8LzOjA')
      .then(response => response.json())
      .then(data => {
        const imageUrl = data.urls.regular;
        console.log(`Random weather image: ${imageUrl}`);
        setBackgroundImage(imageUrl);
      })
      .catch(error => {
        console.log("Unsplash API error:", error);
      });
  }, []);

  return (
    <div className="weather-container">
      <img width="300px" height="300px" src={backgroundImage} alt="weather" />
    </div>
  );
}

export default WeatherComponent;

