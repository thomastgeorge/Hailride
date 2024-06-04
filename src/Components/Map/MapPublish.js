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
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const inputRef = useRef(null);
    const [timeValid, setTimeValid] = useState(true)
    const [originSuggestionClicked, setOriginSuggestionClicked] = useState(false);
    const [destinationSuggestionClicked, setDestinationSuggestionClicked] = useState(false);

    const { user } = useContext(UserContext)


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
        if (!from || !to || !starts || !ends || !rideDate || !rate || !passengers || !timeValid) {
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

	const createCarIcon = (angle) => {
		return L.divIcon({
			html: `<img src="car_top_view_icon.svg" style="transform: rotate(${angle}deg); display: block; width: 32px; height: 48px;"/>`,
			iconSize: [32, 48],
			className: 'car-icon-container',
		});
	};

	const markerRef = useRef();
	const intervalRef = useRef();

	useEffect(() => {
		if (!selectedRouteCoordinates || selectedRouteCoordinates.length === 0) return;

		const map = mapRef.current;
		if (!map) return;

		// If the marker exists, remove it from the map
		if (markerRef.current) {
			map.removeLayer(markerRef.current);
		}

		let index = 0;
		let angle = 0;

		// Initialize the marker at the start point
		markerRef.current = L.marker(selectedRouteCoordinates[0], { icon: createCarIcon(angle) }).addTo(map);

		const moveMarker = () => {
			if (index < selectedRouteCoordinates.length) {
				const currentPoint = selectedRouteCoordinates[index];
				const nextPoint = selectedRouteCoordinates[index + 1];

				if (nextPoint) {
					angle = Math.atan2(nextPoint[1] - currentPoint[1], nextPoint[0] - currentPoint[0]) * 180 / Math.PI;
				}

				markerRef.current.setIcon(createCarIcon(angle));
				markerRef.current.setLatLng(currentPoint);
				index += Math.ceil(selectedRouteCoordinates.length / 124);
			} else {
				clearInterval(intervalRef.current);
				setTimeout(() => {
					index = 0;
					markerRef.current.setLatLng(selectedRouteCoordinates[0]);
					// time delay for repeated traversing
					intervalRef.current = setInterval(moveMarker, 250);
				}, 3000); // 3 seconds delay before restarting
			}
		};

		// first time traversing
		intervalRef.current = setInterval(moveMarker, 250);

		return () => {
			clearInterval(intervalRef.current);
			map.removeLayer(markerRef.current);
		};
	}, [selectedRouteCoordinates]);

    const cancelPublish = () => {
        setNewPublish(false)
    }

    const handleStartChange = (e) => {
        const startTime = e.target.value;
        setStarts(startTime);
        validateTime(startTime, ends);
    };

    const handleEndChange = (e) => {
        const endTime = e.target.value;
        setEnds(endTime);
        validateTime(starts, endTime);
    };

    const validateTime = (startTime, endTime) => {
        if (startTime && endTime) {
            const [startHour, startMinute] = startTime.split(':');
            const [endHour, endMinute] = endTime.split(':');

            const start = parseInt(startHour) * 60 + parseInt(startMinute);
            const end = parseInt(endHour) * 60 + parseInt(endMinute);
            if (start >= end) {
                setTimeValid(false);
            } else {
                setTimeValid(true);
            }
        }
    };

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

    const handleSearchQueryChange = (event) => {
        setOriginSearchQuery(event.target.value); 
        if(originSuggestionClicked){
            setOriginSuggestionClicked(false)
        }
    }

    const handleDestinationQueryChange = (event) => {
        setDestinationSearchQuery(event.target.value); 
        if(destinationSuggestionClicked){
            setDestinationSuggestionClicked(false)
        }
    }

    useEffect(() => {
        if(!originSuggestionClicked){
            setDestinationSuggestionClicked(true)
        }
        if(!destinationSuggestionClicked){
            setOriginSuggestionClicked(true)
        }
    }, [originSearchQuery, destinationSearchQuery]);

    useEffect(() => {
        if(selectedOrigin)
            handleSelectLocation(selectedOrigin.coordinates);
    }, [selectedOrigin]);

    useEffect(() => {
        if(selectedDestination)
            handleSelectLocation(selectedDestination.coordinates);
    }, [selectedDestination]);

    const handleSelectLocation = (location) => {
        mapRef.current.flyTo([location[0], location[1]], 13); // Fly to selected location on the map
        setOriginSuggestionClicked(true);
        setDestinationSuggestionClicked(true);
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
        if(selectedOrigin && selectedDestination){
            fetchRoute();
            function flyToTwoPoints(point1, point2) {
                // Calculate the bounding box
                var bounds = L.latLngBounds([point1, point2]);
            
                // Fit the bounding box to the map view
                mapRef.current.fitBounds(bounds);
            }
            
            var point1 = L.latLng(selectedOrigin.coordinates); 
            var point2 = L.latLng(selectedDestination.coordinates);
            
            flyToTwoPoints(point1, point2);
        }
        setFromCoordinates(selectedOrigin?.coordinates);
        setToCoordinates(selectedDestination?.coordinates);
    }, [selectedOrigin, selectedDestination]);



	const handleRouteClick = (index, routeCoordinates) => {
		fetchRoute()
			.then(()=>{
				console.log("inside handleRouteClick, index: ", index, routeCoordinates);
				setSelectedRouteCoordinates(route[selectedRouteIndex]);
				setSelectedRouteIndex(index);
			})
			.catch(error =>{
				console.log("error caught in fetchRoute()")
			})
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

    useEffect(() => {
        let timer = setTimeout(() => {
            const fetchSuggestions = async () => {
            if (originSearchQuery.length >= 3) {
                const apiKey = process.env.REACT_APP_ORS_API_KEY;
                const baseUrl = 'https://api.openrouteservice.org/geocode/autocomplete';
                const url = `${baseUrl}?&api_key=${apiKey}&text=${originSearchQuery}&boundary.country=IN`;
        
                try {
                const response = await fetch(url);
                const data = await response.json();
                setOriginSuggestions(data.features.slice(0, 5)); // Limit suggestions to top 5
                } catch (error) {
                console.error('Error fetching suggestions:', error);
                }
            } else {
                setOriginSuggestions([]);
            }
            };
        
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(timer);
      }, [originSearchQuery]);

      useEffect(() => {
        let timer = setTimeout(() => {
            const fetchSuggestions = async () => {
            if (destinationSearchQuery.length >= 3) {
                const apiKey = process.env.REACT_APP_ORS_API_KEY;
                const baseUrl = 'https://api.openrouteservice.org/geocode/autocomplete';
                const url = `${baseUrl}?&api_key=${apiKey}&text=${destinationSearchQuery}&boundary.country=IN`;       
                try {
                const response = await fetch(url);
                const data = await response.json();
                setDestinationSuggestions(data.features.slice(0, 5)); // Limit suggestions to top 5
                } catch (error) {
                console.error('Error fetching suggestions:', error);
                }
            } else {
                setDestinationSuggestions([]);
            }
            };
        
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(timer);
      }, [destinationSearchQuery]);

      const handleOriginSuggestionClick = (event, suggestion) => {
        event.stopPropagation();
        console.log("Origin suggestion clicked");
        console.log(suggestion);
        setOriginSearchQuery(suggestion.properties.label);//setSelectedOrigin({ name: suggestion.properties.label, coordinates: [suggestion.geometry.coordinates[1], suggestion.geometry.coordinates[0]] });
        setOriginSearchResults([{ display_name: suggestion.properties.label, lat: suggestion.geometry.coordinates[1], lon: suggestion.geometry.coordinates[0] }]);
        setOriginSuggestions([]);
        setOriginSuggestionClicked(true);
      };

      const handleDestinationSuggestionClick = (event, suggestion) => {
        event.stopPropagation();
        console.log("Destination suggestion clicked");
        console.log(suggestion);
        setDestinationSearchQuery(suggestion.properties.label);//setSelectedOrigin({ name: suggestion.properties.label, coordinates: [suggestion.geometry.coordinates[1], suggestion.geometry.coordinates[0]] });
        setDestinationSearchResults([{ display_name: suggestion.properties.label, lat: suggestion.geometry.coordinates[1], lon: suggestion.geometry.coordinates[0] }]);
        setDestinationSuggestions([]);
        setDestinationSuggestionClicked(true);
      };

      useEffect(() => {
        const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setOriginSuggestions([]);
            setDestinationSuggestions([]);
            setOriginSuggestionClicked(false);
            setDestinationSuggestionClicked(false);
        }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


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
                        <div className="d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100">
                            <b>From<span className="text-danger">*</span></b>
                            <div className="position-relative w-100">
                            <input
                                type="text"
                                id="originInput"
                                ref={inputRef}
                                value={originSearchQuery} // Set value now
                                onChange={(e) => handleSearchQueryChange(e)}
                                className="p-2 rounded-3"
                                style={!valid && !selectedOrigin?{background: "rgb(140, 217, 161)", outline: "none", border: "1px solid red", width: "100%"} :{ background: "rgb(140, 217, 161)", outline: "none", border: "0", width: "100%"}}
                            />
                            <ul id="autocompleteList" className="list-group position-absolute top-100 w-100 shadow-sm overflow-auto" style={{ zIndex: 999 }}>
                                {!originSuggestionClicked && originSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion.properties.id}
                                    className="list-group-item"
                                    onClick={(e) => handleOriginSuggestionClick(e, suggestion)}
                                    style={{ fontSize: '13px', cursor: 'pointer'}}
                                >
                                    {suggestion.properties.label}
                                </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                    </form>
                    <hr className='m-0 p-0 mt-2' />
                    <form onSubmit={handleDestinationSearch}>
                        <div className="d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100">
                            <b>To<span className="text-danger">*</span></b>
                            <div className="position-relative w-100 ps-4">
                            <input
                                type="text"
                                id="destinationInput"
                                ref={inputRef}
                                value={destinationSearchQuery} // Set value now
                                onChange={(e) => handleDestinationQueryChange(e)}
                                className="p-2 rounded-3"
                                style={!valid && !selectedDestination? {background: "rgb(140, 217, 161)", outline: "none", border: "1px solid red", width: "100%"} : { background: "rgb(140, 217, 161)", outline: "none", border: "0", width: "100%"}}
                            />
                            <ul id="autocompleteList" className="list-group position-absolute top-100 w-100 shadow-sm overflow-auto" style={{ zIndex: 999 }}>
                                {!destinationSuggestionClicked && destinationSuggestions.map((suggestion) => (
                                <li
                                    key={suggestion.properties.id}
                                    className="list-group-item"
                                    onClick={(e) => handleDestinationSuggestionClick(e, suggestion)}
                                    style={{ fontSize: '13px', cursor: 'pointer'}}
                                >
                                    {suggestion.properties.label}
                                </li>
                                ))}
                            </ul>
                            </div>
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
                            style={!valid && !rideDate ? { background: "rgb(140, 217, 161)", outline: "none", border: "1px solid red" } : {outline: "none", border: "0", background: "rgb(140, 217, 161)" }} 
                            />
                        </div>
                    </div>
                    <hr className='m-0 p-0' />
                    {!timeValid && (
                        <div className="d-flex justify-content-center">
                            <b className="text-danger">End time should be after start time</b>
                        </div>
                    )}
                    <div className="mx-2 mt-2 pt-2 pb-1 rounded d-flex align-items-center justify-content-between" style={{maxWidth: '280px'}}>
                        <div style={{ textAlign: "center" }} >
                            <label htmlFor="starts">Start time</label><br />
                            <input 
                                id="starts"
                                type='time' 
                                value={starts} 
                                onChange={handleStartChange} 
                                className='rounded pt-2 pb-2 align-items-center' 
                                style={!valid && starts=="" ? {background: "rgb(140, 217, 161)", border: "1px solid red", maxWidth: "100px", outline: "none" } : {border: "1px solid black", background: "rgb(140, 217, 161", outline: "none", maxWidth: "100px"}} 
                            />
                        </div>
                        <div><b>to</b></div>
                        <div style={{ textAlign: "center" }}>
                            <label htmlFor="ends">End time</label><br />
                            <input 
                                id="ends"
                                type='time' 
                                value={ends} 
                                onChange={handleEndChange} 
                                className='rounded pt-2 pb-2 align-items-center' 
                                style={!valid && ends=="" ? {background: "rgb(140, 217, 161)", border: "1px solid red", maxWidth: "100px" } : {border: "1px solid black", background: "rgb(140, 217, 161)", outline: "none", maxWidth: "100px"}} 
                            />
                        </div>
                    </div>
                    <div className="mx-2 mt-2 pt-2 rounded d-flex align-items-center justify-content-between">
                        <div>
                            <div className='d-flex align-items-center rounded pe-2'>
                            <b>Rs.₹<span className='text-danger'>*</span></b>
                                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
                                className='rounded p-2' 
                                style={!valid && !rate ?{ width: "80px", outline: "none", border: "1px solid red", background: "rgb(140, 217, 161)"}:{ width: "80px", outline: "none", border: "0", background: "rgb(140, 217, 161)" }} min={1} />
                                <NoteIcon size={22} fill={"black"} />
                            </div>
                            <hr className='m-0 p-0' />
                        </div>
                        <div>
                            <div className='d-flex align-items-center rounded pe-2'>
                                <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)}
                                className='rounded p-2' 
                                style={!valid && !passengers? {width: "60px", outline: "none", border: "1px solid red", background: "rgb(140, 217, 161)"}:{ width: "60px", outline: "none", border: "0", background: "rgb(140, 217, 161)" }} min={1} />
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
