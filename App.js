import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Image, Text } from 'react-native';
import * as Location from 'expo-location';

const API_KEY = 'iClcPJZsOdBOCR69ScVWSp00aTgW5Orf6iSkJRGPfxQ';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [markers, setMarkers] = useState([
    { id: 1, latitude: 49.7803014086921, longitude: 22.76600752434019, title: 'Miś Generał', image: require('./assets/mis.png') },
    { id: 2, latitude: 49.78591891571912, longitude: 22.76611810224204, title: 'Miś hydraulik' },
    { id: 3, latitude: 49.78370479629267, longitude: 22.76692201994785, title: 'Miś informatyk' },
    { id: 4, latitude: 49.78306627681199, longitude: 22.77682148980239, title: 'Miś kierowca autobusu' },
    { id: 5, latitude: 49.78171054713026, longitude: 22.77135283939332, title: 'Miś mechanik' },
    { id: 6, latitude: 49.78209690716262, longitude: 22.762122937536446, title: 'Miś z choinką' },
    { id: 7, latitude: 49.78182748533911, longitude: 22.77340301544233, title: 'Miś z dzwonem' },
    { id: 8, latitude: 49.783096274788896, longitude: 22.771407289376196, title: 'Miś z fajką' },
    { id: 9, latitude: 49.78243512184017, longitude: 22.771968217292873, title: 'Miś z lodami' },
    { id: 10, latitude: 49.783900434378204, longitude: 22.77194183091356, title: 'Miś z okularem' },
    { id: 11, latitude: 49.78243022558096, longitude: 22.771306713491533, title: 'Miś z perfumami' },
    { id: 12, latitude: 49.78306141028644, longitude: 22.76808612902565, title: 'Miś z pizzą' },
  ]);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    const requestLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const userLocationData = {
        latitude: location.coords.latitude || 0,
        longitude: location.coords.longitude || 0,
      };
      setUserLocation(userLocationData);
      const region = {
        latitude: userLocationData.latitude,
        longitude: userLocationData.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      setMapRegion(region);
    };

    requestLocationPermissions();
  }, []);

  useEffect(() => {
    const updateLocation = async () => {
      if (geolocationEnabled) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        const userLocationData = {
          latitude: location.coords.latitude || 0,
          longitude: location.coords.longitude || 0,
        };
        setUserLocation(userLocationData);
        const region = {
          latitude: userLocationData.latitude,
          longitude: userLocationData.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };
        setMapRegion(region);
      }
    };

    updateLocation();
  }, [geolocationEnabled]);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text>{marker.title}</Text>
                  {marker.image && (
                    <Image style={styles.calloutImage} source={marker.image.default} />
                  )}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {errorMsg && (
        <View style={styles.locationBar}>
          <Text style={styles.locationText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 40,
    bottom: 70,
    left: 0,
    right: 0,
  },
  calloutContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutImage: {
    width: 70,
    height: 70,
    marginTop: 10,
  },
  locationBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    padding: 10,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
