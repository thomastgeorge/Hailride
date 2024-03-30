import React, { useState, useRef, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet
import { UserContext } from '../../App';
import { Axios } from '../../Config/Axios/Axios';
import { Button} from 'antd';
import { NoteIcon, PersonFillIcon } from '@primer/octicons-react';
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MapPublish = ({newPublish, setNewPublish}) => {
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
    const [selectedRouteCoordinates, setSelectedRouteCoordinates] = useState([]);
    const [fromCoordinates, setFromCoordinates] = useState([]);
    const [toCoordinates, setToCoordinates] = useState([]);

    const { user } = useContext(UserContext)
    //console.log(user);

    const [valid, setvalid] = useState(true)

    const [starts, setStarts] = useState("")
    const [ends, setEnds] = useState("")
    const [rideDate, setRideDate] = useState("")
    const [rate, setRate] = useState("")
    const [passengers, setPassengers] = useState("")

    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFrom("");
        setTo("");
        setStarts("");
        setEnds("");
        setRideDate("");
        setRate("");
        setPassengers("");
    }

    const handleOk = () => {
        setLoading(true);
        if (!from || !to || !starts || !ends || !rideDate || !rate || !passengers) {
            setvalid(false)
            setLoading(false)
            console.log("invalid");
            return
        }
        Axios.post('/api/v1/app/rides/postRide', {
            addedByEmail: user.email,
            addedBy: user.name,
            from: from,
            to: to,
            fromCoordinates: fromCoordinates,
            toCoordinates: toCoordinates,
            selectedRouteCoordinates: selectedRouteCoordinates,
            mobile: user.personalDetails?.mobile,
            starts: starts,
            ends: ends,
            rideDate: rideDate,
            rate: rate,
            passengers: passengers,
            addedByUserRating: user.rating,
            addedByUserRatingCount: user.ratingCount,
        })
            .then(res => {
                //setOpen(false);
                setLoading(false)
                resetForm()
                console.log(res);
                setNewPublish(false)
            })
            .catch(err => {
                console.error();
                console.log(err);
                setLoading(false)
            })
    };

    const cancelPublish = () => {
        setNewPublish(false)
    }

    const handleOriginSearch = async (e) => {
        e.preventDefault();
        if (!originSearchQuery) return;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${originSearchQuery}&format=json&limit=5`);
        const data = await response.json();
        setOriginSearchResults(data);
        if (data.length > 0) {
            console.log("originSearchResults");
            console.log(data);
            console.log(data[0].display_name);
        }
    };

    const handleDestinationSearch = async (e) => {
        e.preventDefault();
        if (!destinationSearchQuery) return;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${destinationSearchQuery}&format=json`);
        const data = await response.json();
        setDestinationSearchResults(data);
        if (data.length > 0) {
            console.log("DestinationSearchResults");
            console.log(data);
            console.log(data[0].display_name);
        }
    };

    const handleSelectOrigin = (location) => {
        setSelectedOrigin(location);
        console.log(selectedOrigin);
    };

    const handleSelectDestination = (location) => {
        setSelectedDestination(location);
        console.log("selectedDestination");
        console.log(selectedDestination);
    };

    const fetchRoute = async () => {
        if (selectedOrigin && selectedDestination) {
            try {
                const originStr = selectedOrigin.name;
                const originSubString = originStr.split(',')[0];
                const destinationStr = selectedDestination.name;
                const destinationSubString = destinationStr.split(',')[0];
                console.log("split name");
                console.log(originSubString);
                setFrom(originSubString);
                console.log(destinationSubString);
                setTo(destinationSubString);
                const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${selectedOrigin.coordinates[1]},${selectedOrigin.coordinates[0]};${selectedDestination.coordinates[1]},${selectedDestination.coordinates[0]}?overview=full&steps=true&geometries=geojson&alternatives=true`);
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
                setSelectedRouteCoordinates(route[selectedRouteIndex]);
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
        console.log("selected Origin");
        console.log(selectedOrigin);
        console.log(selectedOrigin?.coordinates);
        console.log("selected Destination");
        console.log(selectedDestination);
        console.log(selectedDestination?.coordinates); 
        if(selectedOrigin && selectedDestination)
            fetchRoute();
        setFromCoordinates(selectedOrigin?.coordinates);
        setToCoordinates(selectedDestination?.coordinates);
    }, [selectedOrigin, selectedDestination]);



    const handleRouteClick = (index, routeCoordinates) => {
        console.log("inside handleRouteClick, index: ", index, routeCoordinates);
        setSelectedRouteIndex(index);
        setSelectedRouteCoordinates(route[selectedRouteIndex]);
    }

    console.log("selectedRouteIndex : ", selectedRouteIndex);
    // console.log("selectedRouteCoordinates: ", route[selectedRouteIndex]);

    const iconRef = useRef(null);
    useEffect(() => {
        iconRef.current = L.icon({
            iconUrl: "location.svg",
            iconSize: [23, 23],
        });
    }, []);  

    useEffect(() => {
        setSelectedRouteCoordinates(route[selectedRouteIndex]);
    }
    , [route]);


    return (
        <div className='p-2'>
            <div className="py-2 pb-2 p-2 align-items-center">
                <div className='p-2 pt-4 d-flex flex-column align-items-center'>
                        <b style={{ fontSize: "32px" }}>Publish New Ride!</b>
                </div>
                {
                    !valid &&
                    <b className="text-danger ps-3">*Fill out the required feilds</b>
                }
                <div className='mx-1'>
                    <form onSubmit={handleOriginSearch}>
                        <div className='d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>From<span className='text-danger'>*</span></b>
                            <input 
                                type='text'
                                //value={from}
                                onChange={(e) => setOriginSearchQuery(e.target.value)} 
                                className='p-2 w-100 rounded-3'
                                style={!valid && from === "" ? { borderColor: "red", background: "rgb(140, 217, 161)", outline: "none", border: "0" } : { outline: "none", border: "0", background: "rgb(140, 217, 161)"}} 
                            />
                        </div>
                    </form>
                    <hr className='m-0 p-0 mt-2' />
                        <form onSubmit={handleDestinationSearch}>
                            <div className='d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                                <b>To<span className='text-danger'>*</span></b>
                                <input 
                                    type='text'
                                    //value={to}
                                    onChange={(e) => setDestinationSearchQuery(e.target.value)} 
                                    className='p-2 w-100 rounded-3'
                                    style={!valid && from === "" ? { borderColor: "red", background: "rgb(140, 217, 161)", outline: "none", border: "0" } : { outline: "none", border: "0", background: "rgb(140, 217, 161)"}} 
                                />
                            </div>
                        </form>
                    <hr className='m-0 p-0 pb-2' />
                </div>
            </div>
            <MapContainer
                className='markercluster'
                style={{ height: 300, margin: 0, padding: 0, marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5, borderRadius: 10, border: "3px solid rgb(255, 255, 255)",}}
                center={[12.88, 77.45]}
                zoom={13}
                ref={mapRef}
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
            <div className="py-2 pt-3 pb-4 p-2 align-items-center mx-1">
                <hr className='m-0 p-0' />
                    <div>
                        <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>Ride Date<span className='text-danger'>*</span></b>
                            <input 
                            value={rideDate} 
                            onChange={e => setRideDate(e.target.value)} 
                            className='p-2 w-75 rounded-3' 
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
                            style={!valid && rideDate ? { borderColor: "red", background: "rgb(140, 217, 161)", outline: "none", border: "0" } : {outline: "none", border: "0", background: "rgb(140, 217, 161)" }} 
                            />
                        </div>
                    </div>
                    <hr className='m-0 p-0' />
                    <div className="mx-2 mt-2 pt-2 pb-1 rounded d-flex align-items-center justify-content-between" style={{maxWidth: '280px'}}>
                        <div style={{ textAlign: "center" }} >
                            <label htmlFor="starts">Start time</label><br />
                            <input 
                                id="starts"
                                type='time' 
                                value={starts} 
                                onChange={(e) => setStarts(e.target.value)} 
                                className='rounded pt-2 pb-2 align-items-center' 
                                style={!valid && starts == "" ? { borderColor: "red", background: "rgb(140, 217, 161)", maxWidth: "100px" } : {background: "rgb(140, 217, 161", maxWidth: "100px"}} 
                            />
                        </div>
                        <div><b>to</b></div>
                        <div style={{ textAlign: "center" }}>
                            <label htmlFor="ends">End time</label><br />
                            <input 
                                id="ends"
                                type='time' 
                                value={ends} 
                                onChange={(e) => setEnds(e.target.value)} 
                                className='rounded pt-2 pb-2 align-items-center' 
                                style={!valid && starts == "" ? { borderColor: "red", background: "rgb(140, 217, 161)", maxWidth: "100px" } : {background: "rgb(140, 217, 161)", maxWidth: "100px"}} 
                            />
                        </div>
                    </div>
                    <div className="mx-2 mt-2 pt-2 rounded d-flex align-items-center justify-content-between">
                        <div>
                            <div className='d-flex align-items-center rounded pe-2'>
                            <b>Rs.₹<span className='text-danger'>*</span></b>
                                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className='rounded p-2' style={{ width: "80px", outline: "none", border: "0", background: "rgb(140, 217, 161)" }} min={1} />
                                <NoteIcon size={22} fill={"black"} />
                            </div>
                            <hr className='m-0 p-0' />
                        </div>
                        <div>
                            <div className='d-flex align-items-center rounded pe-2'>
                                <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} className='rounded p-2' style={{ width: "60px", outline: "none", border: "0", background: "rgb(140, 217, 161)" }} min={1} />
                                <PersonFillIcon size={22} fill={"black"} />
                            </div>
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className="mx-2 mt-2 pt-2 rounded d-flex align-items-center justify-content-between">
                        <div onClick={cancelPublish} className='mx-1 btn d-flex justify-content-center bg-white'>
                        <b>Cancel</b>
                        </div>
                        <div >  
                            <Button type="primary" className='mx-1 mt-1' onClick={handleOk} loading={loading} style={{height: "40px"}}>
                                Publish
                            </Button>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default MapPublish;
