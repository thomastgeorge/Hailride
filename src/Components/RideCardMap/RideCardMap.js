import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RideCardMap = ({ride}) => {

    const mapRef = useRef();
    const [mapPoints, setMapPoints] = useState([]);

    const iconRef = useRef(L.icon({
        iconUrl: "location.svg",
        iconSize: [23, 23],
    }));

    useEffect(() => {
        setMapPoints(prevMapPoints => [...prevMapPoints, ride.hailedBy.name]);
    }, []);

    console.log("hailed by coordinates");
    console.log(ride.hailedBy[0]?.toCoordinates);

    return (
        <div className='p-2'>
            <MapContainer
                className='markercluster'
                style={{ height: 250, margin: 0, padding: 0, marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5, borderRadius: 10, border: "3px solid rgb(255, 255, 255)",}}
                center={[12.88, 77.45]}
                zoom={13}
                ref={mapRef}
            >
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                    ride.hailedBy.map((hailedBy, index) => {
                        // Filter hailedBy with the same coordinates as the current hailedBy object
                        const hailedFromSameCoordinates = ride.hailedBy.filter(hb =>
                            hb.fromCoordinates[0] === hailedBy.fromCoordinates[0] && hb.fromCoordinates[1] === hailedBy.fromCoordinates[1]
                        );

                        // Extract the names of those hailedBy objects
                        const names = hailedFromSameCoordinates.map(hb => hb.name);

                        // Render the Marker with the Popup displaying the names of those hailedBy objects
                        return (
                            <Marker 
                                key={index}
                                position={[hailedBy.fromCoordinates[0], hailedBy.fromCoordinates[1]]}
                                icon={iconRef.current}
                            >
                                <Popup>
                                    Hailed By:
                                    <div>
                                        <hr />
                                        {/* Render the names of those hailedBy objects */}
                                        <ul>
                                            {names.map((name, i) => (
                                                <li key={i}>{name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })
                }
                {
                    <Marker
                        position={[ride?.fromCoordinates[0], ride?.fromCoordinates[1]]}
                        icon={iconRef.current}
                    >
                        <Popup>
                            {ride.from}
                            {/* Check if anyone hailed from the ride's start point */}
                            {ride.hailedBy.some(hailedBy => hailedBy.fromCoordinates[0] === ride.fromCoordinates[0] && hailedBy.fromCoordinates[1] === ride.fromCoordinates[1]) && (
                                <div>
                                    <hr /> {/* Separator */}
                                    <div>Hailed from here:</div>
                                    <ul>
                                        {ride.hailedBy
                                            .filter(hailedBy => hailedBy.fromCoordinates[0] === ride.fromCoordinates[0] && hailedBy.fromCoordinates[1] === ride.fromCoordinates[1])
                                            .map((hailedBy, index) => (
                                                <li key={index}>{hailedBy.name}</li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </Popup>
                    </Marker>
                }
                {
                    <Marker 
                        position={[ride?.toCoordinates[0], ride?.toCoordinates[1]]}
                        icon={iconRef.current}
                    >
                        <Popup>
                            {ride.to}
                        </Popup>
                    </Marker>
                }
                {
                    <Polyline
                        positions={ride.selectedRouteCoordinates}
                        color="green"
                        //color={index === selectedRouteIndex ? 'green' : 'blue'}
                        //opacity={index === selectedRouteIndex ? 1 : 0.4}
                        weight={5}
                        //dashArray={index === selectedRouteIndex ? null : '5, 10'}
                    />
                }
            </MapContainer>
        </div>
    );
};

export default RideCardMap;