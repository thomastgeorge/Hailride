import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet

const MapPublish = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [originSearchQuery, setOriginSearchQuery] = useState('');
    const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
    const [originSearchResults, setOriginSearchResults] = useState([]);
    const [destinationSearchResults, setDestinationSearchResults] = useState([]);
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [route, setRoute] = useState([]);
    const mapRef = useRef();
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();

        // Check if origin or destination is selected
        if (selectedOrigin !== null) {
            setFrom({ name: data.display_name, coordinates: [lat, lng] });
            setSelectedOrigin(null);

        } else if (selectedDestination !== null) {
            setTo({ name: data.display_name, coordinates: [lat, lng] });
            setSelectedDestination(null);
        }
    };

    const handleOriginSearch = async (e) => {
        e.preventDefault();
        if (!originSearchQuery) return;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${originSearchQuery}&format=json&limit=5`);
        const data = await response.json();
        setOriginSearchResults(data);
        handleSelectOrigin();
        handleSetOrigin();
        if (data.length > 0) {
            console.log("originSearchResults");
            console.log(data);
            console.log(data[0].display_name);
        }
    };

    const handleDestinationSearch = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${destinationSearchQuery}&format=json`);
        const data = await response.json();
        setDestinationSearchResults(data);
        handleSetDestination();
        if (data.length > 0) {
            console.log("DestinationSearchResults");
            console.log(data);
            console.log(data[0].display_name);
        }
    };

    const handleSelectOrigin = (location) => {
        setSelectedOrigin(location);
    };

    const handleSelectDestination = (location) => {
        setSelectedDestination(location);
    };

    const handleSetOrigin = () => {
        console.log("selected Origin");
        console.log(selectedOrigin);
        console.log("End selected Origin");

        if (originSearchResults) {
            setFrom(originSearchResults.coordinates);
            console.log("selectedOrigin");
            console.log(selectedOrigin);

        }
    };

    const handleSetDestination = () => {
        if (selectedDestination) {
            setTo(selectedDestination.coordinates);
            setSelectedDestination(null);
        }
    };

    const fetchRoute = async () => {
        if (selectedOrigin && selectedDestination) {
            try {
                const str = selectedOrigin.name;
                const substring = str.split(',')[0];
                console.log("split name");
                console.log(substring);
                console.log("inside route");
                console.log(selectedOrigin);
                const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${selectedOrigin.coordinates[1]},${selectedOrigin.coordinates[0]};${selectedDestination.coordinates[1]},${selectedDestination.coordinates[0]}?overview=full&steps=true&geometries=geojson&alternatives=true`);
                if (!response.ok) {
                    throw new Error('Failed to fetch routes');
                }
                const data = await response.json();
                console.log('Fetched route data:', data);
                if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                    throw new Error('No valid route data found');
                }

                const routesCoordinates = data.routes.map(route => route.geometry.coordinates.map(coord => [coord[1], coord[0]]));
                setRoute(routesCoordinates);
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }
    };

    useEffect(() => {
        if (originSearchResults.length > 0) {
            setSelectedOrigin({ name: originSearchResults[0].display_name, coordinates: [originSearchResults[0].lat, originSearchResults[0].lon] });
        }
    }, [originSearchResults]);

    // Set initial selected destination based on the first search result, if available
    useEffect(() => {
        if (destinationSearchResults.length > 0) {
            setSelectedDestination({ name: destinationSearchResults[0].display_name, coordinates: [destinationSearchResults[0].lat, destinationSearchResults[0].lon] });
        }
    }, [destinationSearchResults]);


    useEffect(() => {
        // Fetch route initially when both origin and destination are selected
        console.log(selectedOrigin);
        console.log(selectedDestination);
        fetchRoute();
    }, [selectedOrigin, selectedDestination]);



    const handleRouteClick = (index, routeCoordinates) => {
        console.log("inside handleRouteClick, index: ", index, routeCoordinates);
        setSelectedRouteIndex(index);

    }

    console.log("selectedRouteIndex : ", selectedRouteIndex);

    const iconRef = useRef(null);
    useEffect(() => {
        iconRef.current = L.icon({
            iconUrl: "location.svg",
            iconSize: [23, 23],
        });
    }, []);  


    return (
        <div>
            <form onSubmit={handleOriginSearch}>
                <input type='text' value={originSearchQuery} onChange={(e) => setOriginSearchQuery(e.target.value)} placeholder='Starting location' />
                <button type='submit'>Search</button>
            </form>
            <form onSubmit={handleDestinationSearch}>
                <input type='text' value={destinationSearchQuery} onChange={(e) => setDestinationSearchQuery(e.target.value)} placeholder='Destination location' />
                <button type='submit'>Search</button>
            </form>
            <MapContainer
                className='markercluster'
                style={{ height: 300, margin: 0, padding: 0, marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5, borderRadius: 10, border: "3px solid rgb(140, 217, 161)" }}
                center={[12.88, 77.45]}
                zoom={13}
                ref={mapRef}
                onclick={handleMapClick}

            >
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {originSearchResults.map(result => (
                    <Marker
                        position={[result.lat, result.lon]}
                        eventHandlers={{ click: () => handleSelectOrigin({ name: result.display_name, coordinates: [result.lat, result.lon] }) }}
                        icon={iconRef.current}
                    >
                        <Popup>{result.display_name}</Popup>
                    </Marker>
                ))}
                {destinationSearchResults.map(result => (
                    <Marker key={result.place_id} position={[result.lat, result.lon]} eventHandlers={{ click: () => handleSelectDestination({ name: result.display_name, coordinates: [result.lat, result.lon] }) }}
                        icon={iconRef.current}>
                        <Popup>{result.display_name}</Popup>
                    </Marker>
                ))}

                {route && route.map((routeCoordinates, index) => (
                    <Polyline
                        key={`route-${index}-${selectedRouteIndex}`}
                        positions={routeCoordinates}
                         color="green"
                        //color={index === selectedRouteIndex ? 'green' : 'blue'}
                        opacity={index === selectedRouteIndex ? 1 : 0.4}
                        weight={5}
                        //dashArray={index === selectedRouteIndex ? null : '5, 10'}
                        eventHandlers={{ click: () => handleRouteClick(index, routeCoordinates) }}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPublish;
