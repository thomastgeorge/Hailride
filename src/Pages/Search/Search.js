import { BookmarkFillIcon, CalendarIcon, DuplicateIcon, PersonFillIcon, PersonIcon } from '@primer/octicons-react'
import React, { useState, useContext, useEffect, useRef  } from 'react'
import SearchLocation from '../../Components/SearchLocation/SearchLocation'
import { useNavigate } from 'react-router-dom'
import { Axios } from '../../Config/Axios/Axios'
import { Spin } from 'antd'
import { DotSpinner, LeapFrog } from '@uiball/loaders'
import { UserContext } from '../../App'
import { MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet

const Search = () => {

    const [valid, setvalid] = useState(true)
    const [open, setOpen] = useState(false)

    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [date, setDate] = useState("")
    const [passengers, setPassengers] = useState(1)
    const { user } = useContext(UserContext)

    const nav = useNavigate()

    const [loader, setloader] = useState(false)

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

    const setLocation = (loc) => {
        open === 'from' ?
            setFrom(loc)
            :
            setTo(loc)
    }

    const searchRides = () => {
        setloader(true)
        if (!from || !to || !date || !passengers) {
            setvalid(false)
            setloader(false)
            return
        }

        Axios.get('/api/v1/app/rides/getRides', {
            params: {
                date: date,
                passengers: passengers,
                email: user.email
            }
        })
            .then(res => {
                setloader(false)
                nav('/searchResult', {
                    state: {
                        fromCoordinates: fromCoordinates,
                        toCoordinates: toCoordinates,
                        from: from,
                        to: to,
                        date: date,
                        rides: res.data.rides
                    }
                })
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                setloader(false)
            })
    }

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
        if (!destinationSearchQuery) return;
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
        console.log("selectedDestination");
        console.log(selectedDestination);
    };

    const handleSetOrigin = () => {
        if (originSearchResults) {
            //setFrom(originSearchResults.coordinates);
            console.log("selectedOrigin");
            console.log(selectedOrigin);

        }
    };

    const handleSetDestination = () => {
        if (selectedDestination) {
            //setTo(selectedDestination.coordinates);
            console.log("selected Destination");
            console.log(selectedDestination);
        }
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
        console.log(selectedOrigin);
        console.log(selectedDestination);
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

    const iconRef = useRef(null);

    useEffect(() => {
        iconRef.current = L.icon({
            iconUrl: "location.svg",
            iconSize: [23, 23],
        });
    }, []); 

    return (
        <>
            <div className='p-2 pt-4'>
                <div className='d-flex flex-column align-items-center'>
                    <b style={{ fontSize: "32px" }}>Hail your Ride!</b>
                    <img src="mainPage.jpg" style={{ width: 'calc( 100vw - 20px )' }} />
                </div>
                {
                    !valid &&
                    <b className="text-danger ps-3">*Fill out the required feilds</b>
                }
                <div className='rounded m-3 ' style={{ backgroundColor: "#8cd9a1" }}>
                    <div className='p-2 pb-4'>
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
                        <hr className='p-0 m-0' />
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
                        <hr className='p-0 m-0 pb-3' />
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
                        <div className='pt-3'>
                            <hr className='m-0 p-0' />
                        </div>
                        <div className='d-flex mt-3 align-items-center justify-content-between'>
                            <div className='d-flex flex-column text-dark'>
                                <p className='mb-1 ps-2 fw-bold'>Ride Date<span className='text-danger'>*</span></p>
                                <input 
                                type="date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                className='rounded p-2 pointer-events-none bg-gray-300' 
                                style={{ outline: "none", border: "0", background: "rgb(140, 217, 161)" }} 
                                min={new Date().toISOString().split("T")[0]} // Disable past dates
                                />
                            <hr className='p-0 m-0 text-dark' />
                            </div>

                            <div>
                                <p className='mb-1 text-dark fw-bold'>Passengers<span className='text-danger'>*</span></p>
                                <div className='rounded pe-2'>
                                    <div>
                                        <input type="number" value={passengers} onChange={e => { setPassengers(e.target.value) }} className='rounded p-2' style={{ width: "80px", outline: "none", border: "0", background: "rgb(140, 217, 161)" }} min={1} max={6} />
                                        <PersonFillIcon size={22} fill={"black"} />
                                    </div>
                                    <hr className='p-0 m-0 text-dark' />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={searchRides} className='p-2 py-3 btn d-flex justify-content-center bg-black' style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
                        {
                            loader ?
                                <LeapFrog color="white" />
                                :
                                <b className="text-white fs-5">Search</b>
                        }
                    </div>
                </div>
            </div>
            <SearchLocation open={open} setOpen={setOpen} setLocation={setLocation} />
        </>
    )
}

export default Search