import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { SIZES } from "./constants";
import * as Location from 'expo-location';
import { useState, useEffect } from "react";

const time = 'now';
const ScreenHeight = Dimensions.get('screen').height;

const LocationBar = ({ latitude, longitude }) => {
    const [userAddress, setUserAddress] = useState('Street');

    useEffect(() => {
        const reverseGeocode = async () => {
            try {
                const reversedGeocodeAddress = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });     
                if (reversedGeocodeAddress.length > 0) {
                    const { street, streetNumber } = reversedGeocodeAddress[0];
                    const formattedAddress = `${street ? street : 'Not located at the street'} ${streetNumber ? streetNumber : ''}`;
                    console.log('User now at:', formattedAddress);
                    setUserAddress(formattedAddress);
                }
            } catch (error) {
                console.log('Reverse geocoding error:', error);
            }
        }

        reverseGeocode();
    }, [latitude, longitude]);
    
    return (
        <View style={styles.main}>
            <Image
                style={styles.locationIcon}
                source={require("./assets/icon.png")}
            />
            <View style={styles.textBlock}>
                <Text style={styles.locationText}>{userAddress}</Text>
                <Text style={styles.statusText}>{'Update - ' + time}</Text>
            </View>
        </View>
    );
};

export default LocationBar;

// Styles
const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        height: ScreenHeight * 0.075,
        top: ScreenHeight * 0.02,
        width: '90%',
        alignSelf: 'center',
    },

    locationIcon: {
        width: 1,
        height: 1,
        opacity: 1,
        marginLeft: 5,
        marginRight: 15,
        marginTop: 5,
    },

    textBlock: {
        flexDirection: 'column',
        height: ScreenHeight * 0.075
    },
});