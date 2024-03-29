import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PublishItem from '../../Components/PublishItem/PublishItem'
import { LocationIcon } from '@primer/octicons-react'
import { LeapFrog } from '@uiball/loaders'
import 'leaflet/dist/leaflet.css';
import {pointToLineDistance, point, distance } from '@turf/turf';

const SearchResult = () => {

    const loc = useLocation()

    const [loader, setloader] = useState(false)

    const [months, setmonths] = useState(['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'])

    const [dateComponents, setdateComponents] = useState(loc.state.date.split("-"))

    const [selectedRides, setSelectedRides] = useState([]);
    console.log(loc.state.rides);
    console.log("user coordinates");
    console.log(loc.state.fromCoordinates);
    console.log(loc.state.toCoordinates);

    useEffect(() => {
        const uniqueRides = new Set();
        loc.state.rides.forEach(ride => {
            const selectedRouteCoordinate = ride.selectedRouteCoordinates;
            console.log(selectedRouteCoordinate);
            
            const line = {
                type: "LineString",
                coordinates: selectedRouteCoordinate.map(coordinate => [coordinate[0], coordinate[1]])
            };
            console.log("lineString");
            console.log(line);

            // var line = lineString([selectedRouteCoordinate]);
            var distanceFrom  = pointToLineDistance(loc.state.fromCoordinates, line, {units: 'kilometers'});
            var distanceTo  = pointToLineDistance(loc.state.toCoordinates, line, {units: 'kilometers'});

            var distanceBetweenUserFromAndFrom = distance(loc.state.fromCoordinates, ride.fromCoordinates, {units: 'kilometers'});
            var distanceBetweenUserFromAndTO = distance(loc.state.fromCoordinates, ride.toCoordinates, {units: 'kilometers'});

            var distanceBetweenUserToAndFrom = distance(loc.state.toCoordinates, ride.fromCoordinates, {units: 'kilometers'});
            var distanceBetweenUserToAndTO = distance(loc.state.toCoordinates, ride.toCoordinates, {units: 'kilometers'});

            if((distanceFrom < 0.5 && distanceTo < 0.5) && (distanceBetweenUserFromAndFrom <= distanceBetweenUserFromAndTO ||distanceBetweenUserToAndTO <= distanceBetweenUserToAndFrom)){
                uniqueRides.add(ride)
            }
            console.log("distanceFrom");
            console.log(distanceFrom);
            console.log("distanceto");
            console.log(distanceTo);
            console.log(selectedRides);
            console.log(selectedRides.length);
            console.log(loc.state.rides);
        })
        setSelectedRides(Array.from(uniqueRides));
    }, [])

    console.log("selectedRides after append");
    console.log(selectedRides);

    return (
        <div className="p-2">
            <div className="d-flex rounded-3 p-2" style={{ backgroundColor: "#8cd9a1" }}>
                <div className="w-75 p-1 pe-3">
                    <b><LocationIcon size={18} /> {loc.state.from}</b>
                    <hr></hr>
                    <b><LocationIcon size={18} /> {loc.state.to}</b>
                </div>
                <div className="w-25 text-white d-flex flex-column align-items-center bg-black p-2 rounded-3">
                    <b style={{ fontSize: "16px" }}>{dateComponents[2]}</b>
                    <p className="m-0 p-0" style={{ fontSize: "14px" }}>{dateComponents[1]
                    }</p>
                    <p className="m-0 p-0" style={{ fontSize: "14px" }}>{dateComponents[0]}</p>
                </div>
            </div>
            <hr />
            <div className="text-center w-100">
                {
                    loader ?
                        <div className='d-flex flex-column align-items-center'>
                            <LeapFrog />
                        </div>
                        :
                        selectedRides.length === 0 ?
                            <p className='fs-2 fw-bold'>No rides for this day.</p>
                            :
                            selectedRides.map(ride => {
                                return (
                                    <PublishItem ride={ride} type="hail" fromCoordinates={loc.state.fromCoordinates} toCoordinates={loc.state.toCoordinates}
                                    from={loc.state.from} to={loc.state.to} />
                                )
                            })
                }
            </div>
        </div>
    )
}

export default SearchResult