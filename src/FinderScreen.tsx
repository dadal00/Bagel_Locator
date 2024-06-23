import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Alert, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_ICON_SIZE = 35;
const TOP_RADIUS = 13;

interface MarkerData {
  title: string;
  address: string;
  city: string;
  prov_state: string;
  postal_zip: string;
  description: string;
  uri: string;
  latlng: {
    latitude: number;
    longitude: number;
  }
}

const Map = () => {

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const fetchData = async () => {
    try {
      const data = require('./stores.json');
      setMarkers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUserLocation = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        },
        error => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED) {
        getUserLocation(); // Retry getting the location after permission is granted
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to show your current location.');
      }
    } else {
      Alert.alert('Permission Denied', 'Location permission is required to show your current location.');
    }
  };

  React.useEffect(() => {
    fetchData();
    getUserLocation();
  }, []);

  return (
    <View style={styles.fullView}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Bagel Finder</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[selectedButton === 'bagel' ? styles.selectedButton : null, styles.button]}
            onPress={() => setSelectedButton(selectedButton === 'bagel' ? null : 'bagel')}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'bagel' ? 'bagel' : 'bagel_inactive'}} />
            <Text style={selectedButton === 'bagel' ? styles.selectedButtonText : styles.buttonText}>  IN-STORE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, selectedButton === 'grocery' ? styles.selectedButton : null]} 
            onPress={() => setSelectedButton(selectedButton === 'grocery' ? null : 'grocery')}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'grocery' ? 'grocery' : 'grocery_inactive'}} />
            <Text style={selectedButton === 'grocery' ? styles.selectedButtonText : styles.buttonText}>  GROCERY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, selectedButton === 'cafe' ? styles.selectedButton : null]} 
            onPress={() => setSelectedButton(selectedButton === 'cafe' ? null : 'cafe')}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'cafe' ? 'cafe_active' : 'cafe_inactive'}} />
            <Text style={selectedButton === 'cafe' ? styles.selectedButtonText : styles.buttonText}>  CAFE</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={initialRegion}
        showsUserLocation={true}
      >
        {markers.map((marker, index) => {
          if (!selectedButton || marker.uri === selectedButton) {
            return (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              >
                <Image
                  source={{ uri: marker.uri }}
                  style={{
                    width: MAX_ICON_SIZE,
                    height: MAX_ICON_SIZE + 15,
                    resizeMode: 'contain',
                  }}
                />
              </Marker>
            );
          } else {
            return null;
          }
        })}
      </MapView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fullView: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    width: '100%',
    height: '23%',
    backgroundColor: '#213A6B',
    padding: 15,
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    borderBottomLeftRadius: TOP_RADIUS,
    borderBottomRightRadius: TOP_RADIUS,
  },
  topBarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 35,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 7,
    padding: 3,
    paddingHorizontal: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 10,
    marginLeft: 5,
  },
  selectedButtonText: {
    color: '#213A6B',
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 10,
    marginLeft: 5,
  },
  icon: {
    width: MAX_ICON_SIZE - 15,
    height: MAX_ICON_SIZE,
    resizeMode: 'contain',
  },
});
   
export default Map;
