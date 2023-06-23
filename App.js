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
    title={"Miś Generał"}
    />

<Marker
    coordinate={{
      latitude:49.78591891571912, 
      longitude: 22.76611810224204,
    }}
    title={"Miś hydraulik"}
    />
    
<Marker
    coordinate={{
      latitude:49.78370479629267, 
      longitude: 22.76692201994785,
    }}
    title={"Miś informatyk"}
/>

<Marker
    coordinate={{
      latitude:49.78306627681199, 
      longitude: 22.77682148980239,
    }}
    title={"Miś kierowca autobusu"}
/>
<Marker
    coordinate={{
      latitude:49.78171054713026, 
      longitude: 22.77135283939332,
    }}
    title={"Miś mechanik"}
/>
<Marker
coordinate={{
latitude:49.78209690716262, 
longitude:22.762122937536446,
}}
title={"Miś z choinką"}
/>

<Marker 
coordinate={{
latitude:49.78182748533911, 
longitude:22.77340301544233 ,
}}
title={"Miś z dzwonem"}
/>

<Marker 
coordinate={{
latitude:49.783096274788896,
longitude: 22.771407289376196,
}}
title={"Miś z fajką"}
/>

<Marker
coordinate={{
latitude:49.78243512184017, 
longitude: 22.771968217292873,
}}
title={"Miś z lodami"}
/>

<Marker 
coordinate={{
latitude:49.783900434378204,
longitude: 22.77194183091356,
}}
title={"Miś z okularem"}
/>

<Marker
coordinate={{
latitude:49.78243022558096, 
longitude: 22.771306713491533,
}}
title={"Miś z perfumami"}
/>

<Marker 
coordinate={{
latitude:49.78306141028644, 
longitude: 22.76808612902565 ,
}}
title={"Miś z pizzą"}
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
 
