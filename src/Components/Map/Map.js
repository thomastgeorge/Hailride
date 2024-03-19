import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
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
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${originSearchQuery}&format=json`);
        const data = await response.json();
        setOriginSearchResults(data);
        handleSelectOrigin();
        handleSetOrigin();
        if(data.length > 0){
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
        if(data.length > 0){
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
                const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${selectedOrigin.coordinates[1]},${selectedOrigin.coordinates[0]};${selectedDestination.coordinates[1]},${selectedDestination.coordinates[0]}?overview=full&steps=true&geometries=geojson`);
                if (!response.ok) {
                    throw new Error('Failed to fetch route');
                }
                const data = await response.json();
                console.log('Fetched route data:', data); // Log the fetched route data
                if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                    throw new Error('No valid route data found');
                }
    
                // Extract coordinates from the route data
                const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    
                // Set the route coordinates
                setRoute(routeCoordinates);
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }
    };
    
    
      useEffect(() => {
        // Fetch route initially when both origin and destination are selected
        console.log(selectedOrigin);
        console.log(selectedDestination);
        fetchRoute();

      }, [selectedOrigin, selectedDestination]); // Dependency array still needed to refetch on changes
    
      const handleRouteClick = () => {
        // Optional: Implement custom selection logic here
        // e.g., display route information in a modal or perform other actions
        console.log('Route clicked!');
      };

    return (
        <div>
            <form onSubmit={handleOriginSearch}>
                <input type='text' value={originSearchQuery} onChange={(e) => setOriginSearchQuery(e.target.value)} placeholder='Search origin location' />
                <button type='submit'>Search Origin</button>
            </form>
            <form onSubmit={handleDestinationSearch}>
                <input type='text' value={destinationSearchQuery} onChange={(e) => setDestinationSearchQuery(e.target.value)} placeholder='Search destination location' />
                <button type='submit'>Search Destination</button>
            </form>
            <MapContainer
                className='markercluster'
                style={{ height: 300, margin: 0, padding: 0, marginLeft: 7, marginRight: 7, borderRadius: 10, border: "3px solid rgb(140, 217, 161)"}}
                center={[12.88, 77.45]}
                zoom={13}
                ref={mapRef}
                onclick={handleMapClick}
            >
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedOrigin && <Marker position={selectedOrigin.coordinates}><Popup>{selectedOrigin.name}</Popup></Marker>}
                {selectedDestination && <Marker position={selectedDestination.coordinates}><Popup>{selectedDestination.name}</Popup></Marker>}
                {originSearchResults.map(result => (
                    <Marker key={result.place_id} position={[result.lat, result.lon]} eventHandlers={{ click: () => handleSelectOrigin({ name: result.display_name, coordinates: [result.lat, result.lon] }) }}>
                        <Popup>{result.display_name}</Popup>
                    </Marker>
                ))}
                {destinationSearchResults.map(result => (
                    <Marker key={result.place_id} position={[result.lat, result.lon]} eventHandlers={{ click: () => handleSelectDestination({ name: result.display_name, coordinates: [result.lat, result.lon] }) }}>
                        <Popup>{result.display_name}</Popup>
                    </Marker>
                ))}
                {route && (
                    <Polyline positions={route} color="blue" weight={5} onClick={handleRouteClick} />
                )}
            </MapContainer>
            {/* {selectedOrigin && <button onClick={handleSetOrigin}>Set Origin</button>}
            {selectedDestination && <button onClick={handleSetDestination}>Set Destination</button>}
            <button onClick={fetchRoute}>Get Route</button> */}
        </div>
    );
};

export default Map;
