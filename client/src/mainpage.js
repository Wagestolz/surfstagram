import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getSurfSpots,
    getSurfSpotPosts,
    getRatings,
    getFollower,
} from "./actions";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    // InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import mapSytyles from "./mapstyles";
import SurfSpot from "./surfspot";
import CreateSurfSpot from "./createsurfspot";

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("../../secrets");
}
const key = secrets.API_KEY;

const libraries = ["places"];
const mapContainerStyle = {
    height: "100%",
    width: "100%",
};
const center = {
    lat: 21.320081,
    lng: -157.949153,
};
const options = {
    styles: mapSytyles,
    disableDefaultUI: true,
    zoomControl: true,
};

export default function MainPage() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getSurfSpots());
        dispatch(getSurfSpotPosts());
        dispatch(getRatings());
        dispatch(getFollower());
    }, []);
    const surfSpots = useSelector((state) => state && state.surfSpots);
    const user = useSelector((state) => state && state.user);
    const ratings = useSelector((state) => state && state.ratings);
    const followers = useSelector((state) => state && state.followers);

    const { isLoaded, loadError } = useLoadScript({
        id: "google-map-script",
        googleMapsApiKey: key,
        libraries,
    });
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [created, setCreated] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                });
            },
            () => null,
            options
        );
    }, []);
    function Locate({ panTo }) {
        return (
            <button
                className="locate"
                onClick={() => {
                    panTo({
                        lat: location.lat,
                        lng: location.lng,
                    });
                }}
            >
                <img src="/compass.png" alt="compass" />
            </button>
        );
    }
    const select = (marker) => {
        setSelected(marker);
    };
    const unselect = () => {
        setSelected(null);
    };
    const cancel = () => {
        setCreated(null);
        setMarkers([]);
    };
    const handleMapClick = (e) => {
        setTimeout(() => {
            setCreated({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                creator: user.id,
            });
        }, 500);

        setMarkers((currentMarkers) => [
            ...currentMarkers,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date(),
            },
        ]);
    };

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    if (loadError) return "Error loading Map";
    if (!isLoaded || !surfSpots || !ratings || !followers) {
        return null;
    }
    return (
        <>
            <div className="main-container">
                <Search panTo={panTo} />
                <div className="main-center">
                    {/* <img src="/surfspot2.png" className="map-logo" alt="logo" /> */}
                    <Locate panTo={panTo} />
                    {selected && (
                        <SurfSpot
                            selected={selected}
                            unselect={unselect}
                            userId={user.id}
                            userFirst={user.first}
                            userLast={user.last}
                            userRating={ratings.filter((rating) => {
                                return (
                                    rating.user_id === user.id &&
                                    rating.surfspot_id == selected.id
                                );
                            })}
                            surfSpotRatings={ratings.filter((rating) => {
                                return rating.surfspot_id == selected.id;
                            })}
                            following={followers.filter((follow) => {
                                return (
                                    follow.user_id === user.id &&
                                    follow.surfspot_id == selected.id
                                );
                            })}
                            surfSpotFollowers={followers.filter((follow) => {
                                return follow.surfspot_id == selected.id;
                            })}
                        />
                    )}
                    {created && (
                        <CreateSurfSpot created={created} cancel={cancel} />
                    )}
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={8}
                        center={center}
                        isLoaded={isLoaded}
                        options={options}
                        onClick={handleMapClick}
                        onLoad={onMapLoad}
                    >
                        {surfSpots.map((marker) => (
                            <Marker
                                key={marker.id}
                                position={{
                                    lat: parseFloat(marker.lat),
                                    lng: parseFloat(marker.lng),
                                }}
                                icon={{
                                    url: "/surfspot2.png",
                                    scaledSize: new window.google.maps.Size(
                                        30,
                                        30
                                    ),
                                    origin: new window.google.maps.Point(0, 0),
                                    anchor: new window.google.maps.Point(
                                        15,
                                        15
                                    ),
                                }}
                                onClick={() => select(marker)}
                            />
                        ))}
                        {markers &&
                            markers.map((marker) => (
                                <Marker
                                    key={marker.time.toISOString()}
                                    position={{
                                        lat: marker.lat,
                                        lng: marker.lng,
                                    }}
                                    icon={{
                                        url: "/surfspot2.png",
                                        scaledSize: new window.google.maps.Size(
                                            30,
                                            30
                                        ),
                                        origin: new window.google.maps.Point(
                                            0,
                                            0
                                        ),
                                        anchor: new window.google.maps.Point(
                                            15,
                                            15
                                        ),
                                    }}
                                    onClick={() => {
                                        setSelected(marker);
                                    }}
                                />
                            ))}
                        {/* {selected && (
                            <InfoWindow
                                position={{
                                    lat: parseFloat(selected.lat),
                                    lng: parseFloat(selected.lng),
                                }}
                                onCloseClick={() => {
                                    setSelected(null);
                                }}
                                className="info-window"
                            >
                                <div className="info-window">
                                    <h2>Amazing Surfspot</h2>
                                    <p>some description</p>
                                </div>
                            </InfoWindow>
                        )} */}
                    </GoogleMap>
                </div>
            </div>
        </>
    );
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => center.lat,
                lng: () => center.lng,
            },
            radius: 200 * 1000,
        },
    });
    return (
        <div className="search">
            <Combobox
                onSelect={async (address) => {
                    setValue(address, false);
                    clearSuggestions();
                    try {
                        const result = await getGeocode({ address });
                        const { lat, lng } = await getLatLng(result[0]);
                        panTo({ lat, lng });
                    } catch (error) {
                        console.log("error!");
                    }
                }}
            >
                <ComboboxInput
                    className="field"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    disabled={!ready}
                    placeholder="Enter adress..."
                />
                <ComboboxPopover className="search-listbox">
                    <ComboboxList className="search-results">
                        {status === "OK" &&
                            data.map(({ id, description }) => (
                                <ComboboxOption
                                    key={description}
                                    value={description}
                                />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}
