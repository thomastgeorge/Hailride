import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RideCardMap = ({ride}) => {

    const mapRef = useRef();

    const iconRef = useRef(L.icon({
        iconUrl: "location.svg",
        iconSize: [23, 23],
    }));

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
                    <Marker
                        position={[ride?.fromCoordinates[0], ride?.fromCoordinates[1]]}
                        icon={iconRef.current}
                    >
                        <Popup>{ride.from}</Popup>
                    </Marker>
                }
                {
                    <Marker 
                        position={[ride?.toCoordinates[0], ride?.toCoordinates[1]]}
                        icon={iconRef.current}
                    >
                        <Popup>{ride.to}</Popup>
                    </Marker>
                }
                {
                    ride.hailedBy.map((hailedBy, index) => (
                        <Marker 
                            key={index}
                            position={[hailedBy?.fromCoordinates[0], hailedBy?.fromCoordinates[1]]}
                            icon={iconRef.current}
                        >
                            <Popup>Hailed By: {hailedBy.name}</Popup>
                        </Marker>
                    ))
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
