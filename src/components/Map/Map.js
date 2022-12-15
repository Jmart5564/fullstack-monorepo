import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useLocations } from '../../hooks/useLocations.js';
import { deleteLocation, addLocation, getLocations } from '../../services/location.js';
import { addJournal } from '../../services/journal.js';

export default function MapComponent() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -122.9703,
    width: '100vw',
    height: '100vh',
    zoom: 10,
  });
  const [selectedPin, setSelectedPin] = useState(null);
  const { locations, setLocations } = useLocations();
  const [openModal, setOpenModal] = useState(false);
  const textarea = useRef();
  const dateInput = useRef();

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelectedPin(null);
      }
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const pins = useMemo(
    () =>
      locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setSelectedPin(location);
          }}
        >
          <MushImg src="/mushroom2.svg" alt="Mushroom Icon" />
        </Marker>
      )),
    [locations]
  );

  const addMarker = async (e) => {
    if (openModal === true) {
      setOpenModal(false);
    }
    if (selectedPin !== null) {
      return;
    } else {
      const newLocation = e.lngLat;
      await addLocation(newLocation);
      const updatedLocations = await getLocations();
      setLocations(updatedLocations);
    }
  };

  const deleteMarker = async () => {
    await deleteLocation(selectedPin.id);
    const newLocations = locations.filter((loc) => loc.id !== selectedPin.id);
    setLocations(newLocations);
    setSelectedPin(null);
  };

  const addJournalEntry = async () => {
    if (textarea.current.value === '') {
      alert('Please provide an entry');
      return;
    }
    if (dateInput.current.value === '') {
      alert('Please provide a date');
      return;
    }
    const newJournal = {
      location_id: selectedPin.id,
      details: textarea.current.value,
      date: dateInput.current.value,
    };
    await addJournal(newJournal);
    setOpenModal(false);
    setSelectedPin(null);
    const updatedLocations = await getLocations();
    setLocations(updatedLocations);
  };

  return (
    <MainDiv>
      <MapDiv>
        <Map
          {...viewport}
          mapboxAccessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
          mapStyle="mapbox://styles/jmart5564/cla77df0d001n15oy0bcrhmzp"
          onClick={addMarker}
          onMove={(evt) => {
            setViewport(evt.viewport);
          }}
        >
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            showUserHeading={true}
            auto
            position="top-left"
          />
          <NavigationControl position="top-left" />
          <FullscreenControl position="top-left" />
          <ScaleControl />

          {pins}

          {selectedPin && (
            <Popup
              anchor="top"
              longitude={Number(selectedPin.longitude)}
              latitude={Number(selectedPin.latitude)}
              onClick={() => setOpenModal(false)}
              onClose={() => setSelectedPin(null)}
            >
              <PopUpDiv>
                <button onClick={() => setOpenModal(true)}>Add Entry</button>
                {selectedPin.journalArray.map((entry, i) => (
                  <JournalDiv key={i}>
                    <span>{entry.date}</span>
                    <p>{entry.details}</p>
                  </JournalDiv>
                ))}
                <button onClick={deleteMarker}>Delete Pin</button>
              </PopUpDiv>
            </Popup>
          )}
        </Map>
      </MapDiv>
      <ModalDiv>
        {openModal && (
          <FormDiv>
            <h1>Add New Journal Entry</h1>
            <input ref={dateInput} type="date"></input>
            <textarea ref={textarea} type="text"></textarea>
            <div>
              <button onClick={addJournalEntry}>Submit</button>
              <button onClick={() => setOpenModal(false)}>Cancel</button>
            </div>
          </FormDiv>
        )}
      </ModalDiv>
    </MainDiv>
  );
}

const MapDiv = styled.div`
  height: 87vh;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 20px;
  button {
    width: 40px;
    height: 40px;
    img {
      height: 50px;
      width: 50px;
    }
  }
`;

const MushImg = styled.img`
  height: 50px;
  width: 50px;
  cursor: pointer;
`;

const PopUpDiv = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-end;
  button {
    margin: 10px 0px;
    height: 20px;
    width: 80px;
    display: flex;
    align-self: center;
    justify-self: flex-end;
    cursor: pointer;
  }
`;

const JournalDiv = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-end;
  border-bottom: 1px solid black;
  p {
    margin: 0;
    text-align: center;
  }
`;

const ModalDiv = styled.div`
  width: 400px;
  height: fit-content;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-end;
  justify-self: center;
  align-self: center;
  z-index: 10;
  position: absolute;
  button {
    width: 70px;
    height: 30px;
    cursor: pointer;
  }
`;

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormDiv = styled.div`
  width: 400px;
  height: fit-content;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-end;
  z-index: 10;
  button {
    width: 70px;
    height: 30px;
    margin: 20px 10px;
  }
  textarea {
    height: 100px;
    width: 300px;
  }
  input {
    padding: 2px;
    margin-bottom: 15px;
    font-size: 15px;
  }
`;
