import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [markers, setMarkers] = useState([
    { id: 1, latitude: 49.7803014086921, longitude: 22.76600752434019, title: 'Miś Generał' },
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
    // Add more marker objects as needed
  ]);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [route, setRoute] = useState(null);

  const handleGeolocationButtonPress = () => {
    setGeolocationEnabled(true);
  };

  const handleRouteButtonPress = () => {
    if (selectedMarker && userLocation) {
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const destination = `${selectedMarker.latitude},${selectedMarker.longitude}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.code === 'Ok' && data.routes.length > 0) {
            const routeData = data.routes[0];
            const routeCoordinates = routeData.geometry.coordinates.map(coord => ({
              latitude: coord[1],
              longitude: coord[0],
            }));
            setRoute(routeCoordinates);
          } else {
            console.log('No route found');
          }
        })
        .catch(error => {
          console.log('Error:', error);
        });
    }
  };
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.locationBar}>
        <Text style={styles.locationText}>
          Latitude: {userLocation?.latitude}
        </Text>
        <Text style={styles.locationText}>
          Longitude: {userLocation?.longitude}
        </Text>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: 49.78227100453792,
          longitude: 22.77424858187272,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        provider={MapView.PROVIDER_DEFAULT}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={'Moja pozycja'}
            image={require('./assets/elipsa.png')}
          />
        )}

        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            onPress={() => setSelectedMarker(marker)}
          />
        ))}

        {geolocationEnabled && userLocation && (
          <Circle
            center={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            radius={40} // Radius in meters
            strokeColor={'rgba(0, 0, 255, 0.5)'} // Circle stroke color
            fillColor={'rgba(0, 255, 0, 0.3)'} // Circle fill color
          />
        )}

              {route && (
                <Polyline
                  coordinates={route}
                  strokeWidth={3}
                  strokeColor="red"
                />
              )}
      </MapView>

      <TouchableOpacity
        style={styles.geolocationButton}
        onPress={handleGeolocationButtonPress}
      >
        <Image
          source={require('./assets/geobtn.png')}
          style={styles.geolocationButtonImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.routeButton}
        onPress={handleRouteButtonPress}
        disabled={!selectedMarker}
      >
        <Image
          source={require('./assets/routebtn.png')}
          style={styles.routeButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  geolocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1,
  },
  geolocationButtonImage: {
    width: 40,
    height: 40,
  },
  routeButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    zIndex: 1,
  },
  routeButtonImage: {
    width: 40,
    height: 40,
  },
  locationBar: {
    position: 'absolute',
    top: 60,
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
