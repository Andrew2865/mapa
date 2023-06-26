import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import { Directions } from 'react-native-maps-directions';

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
    // Додайте більше об'єктів маркерів за необхідністю
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
      const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Замініть на свій ключ Google Maps API

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${API_KEY}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'OK' && data.routes.length > 0) {
            const routeData = data.routes[0];
            const routePoints = decodePolyline(routeData.overview_polyline.points);
            setRoute(routePoints);
          } else {
            console.log('No route found');
          }
        })
        .catch(error => {
          console.log('Error:', error);
        });
    }
  };

  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Збережіть координати користувача в стані `userLocation`
      const userLocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userLocationData);
    })();
  }, []);

  const decodePolyline = polyline => {
    const points = [];
    let index = 0,
      len = polyline.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

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
          <MapView.Polyline
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
  locationBar: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  geolocationButton: {
    position: 'absolute',
    bottom: 120,
    right: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 10,
    elevation: 1,
  },
  geolocationButtonImage: {
    width: 45,
    height: 40,
  },
  routeButton: {
    position: 'absolute',
    bottom: 60,
    right: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  routeButtonImage: {
    width:45 ,
    height: 40,
  },
});
