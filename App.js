import React,{useState,useEffect} from 'react';
import MapView,{Marker} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' && status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  
  return (
    <View style={styles.container}>
     
      <MapView 
      style={styles.map} 
     region={{

      latitude: 49.78227100453792, 
      longitude: 22.77424858187272,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }}
      
      >
       <Marker
    coordinate={{
      latitude:49.7803014086921, 
      longitude: 22.76600752434019 ,
    }}
    />

<Marker
    coordinate={{
      latitude:49.78591891571912, 
      longitude: 22.76611810224204,
    }}
    />
    
<Marker
    coordinate={{
      latitude:49.78370479629267, 
      longitude: 22.76692201994785,
    }}
/>
        </MapView>
        
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 
 });
 
