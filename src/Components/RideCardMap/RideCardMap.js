import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { map } from 'leaflet'; // Import Leaflet
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function MapPosition(bounds){
    const ref = useRef(null)
    const setRef = useCallback(node => {
        if (ref.current) {
        // Make sure to cleanup any events/references added to the last instance
        }
    
        if (node) {
        // Check if a node is actually passed. Otherwise node would be null.
        // You can now do what you need to, addEventListeners, measure, etc.
        console.log("mapRef value changed:", node);
        }

        ref.current = node
        ref.current?.fitBounds(bounds);
		
    }, [])

  return [setRef]
}

function RideCardMap({ride}) {

    //const mapRef = useRef();
    const point1 = L.latLng(ride.toCoordinates);
    const point2 = L.latLng(ride.fromCoordinates);
    const bounds = L.latLngBounds([point1, point2]);
    const [mapRef] = MapPosition(bounds)

    const iconRef = useRef(L.icon({
        iconUrl: "location.svg",
        iconSize: [23, 23],
    }));
	const passengerIcon = useRef(L.icon({
		iconUrl: "passenger_icon.svg",
		iconSize: [23, 23],
	}))


    console.log("hailed by ToCoordinates");
    console.log(ride.hailedBy[0]?.toCoordinates);

    return (
        <div className='p-2'>
            <MapContainer
                className='markercluster'
                style={{ height: 250, margin: 0, padding: 0, marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5, borderRadius: 10, border: "3px solid rgb(255, 255, 255)" }}
                center={bounds.getCenter()}
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
                                icon={passengerIcon.current}
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
