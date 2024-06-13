import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

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

  const fetchData = async () => {
    try {
      const data = require('./stores.json');
      setMarkers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.fullView}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Bagel Finder</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.selectedButton]} 
          >
            <Image style={styles.icon} source={{uri:'bagel_inactive'}} />
            <Text style={styles.buttonText}>IN-STORE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.selectedButton]} 
          >
            <Image style={styles.icon} source={{uri:'grocery_inactive'}} />
            <Text style={styles.buttonText}>GROCERY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.selectedButton]} 
          >
            <Image style={styles.icon} source={{uri:'cafe_inactive'}} />
            <Text style={styles.buttonText}>CAFE</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        {markers.map((marker, index) => (
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
          
        ))}
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 7,
    padding: 5,
    paddingHorizontal: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#213A6B',
  },
  buttonText: {
    color: 'white',
    fontWeight: 600,
    fontSize: 10.5,
    marginLeft: 5,
  },
  icon: {
    width: MAX_ICON_SIZE - 15,
    height: MAX_ICON_SIZE,
    resizeMode: 'contain',
  },
});
   
export default Map;
