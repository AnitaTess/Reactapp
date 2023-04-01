import React from "react";

function Info() {
    return (
        <div className="info">
          <h2>How to use WeatherPal?</h2>
          <div className="lista">
          <ol>
            <li>What are you up to right now? Add an entry with your comment!</li>
            <li>Allow the usage of geoloalisation to let the app share your location and weather information with others.</li>
            <li>Is the weather dangerous and you want your entry to be an alert? Mark the checkbox next to it!</li>
            <li>Add a picture of the weather conditions to help users visualise the situation.</li>
            <li>Edit your comment or delete your entry whenever you want.</li>
            <li>Use filter tabs to quickly switch from positive types of entries to dangerous ones.</li>
            <li>Enjoy and stay safe!</li>
          </ol>
          </div>
        </div>
      );
}

export default Info;