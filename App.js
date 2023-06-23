import React,{useState,useEffect} from 'react';
import MapView,{ Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
 
  
  return (
    <View style={styles.container}>
     
      <MapView style={styles.map} 
     region={{
      latitude: 49.78226,
      longitude: 22.77425,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
    >
      <Marker 
      coordinate={{
        latitude: 49.78226,
        longitude: 22.77425, 
      }}
      image={require()}
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
 
