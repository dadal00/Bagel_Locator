import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_ICON_SIZE = 30;

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

  const [pictures] = useState([
    {
      uri: 'home_navBar_1',
    },
    {
      uri: 'bagelFinder_navBar_2',
    },
    {
      uri: 'shoppingCart_navBar_3',
    },
    {
      uri: 'profile_navBar_4',
    },
  ]);

  const fetchData = () => {
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
        {/* {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            image={{uri:marker.uri}}
          />
        ))} */}
      </MapView>
      <View style={styles.legendBox}>
        {pictures.map((marker, index) => (
          <View key={index} style={styles.legendItem}>
            <Image source={{uri:marker.uri}} style={styles.legendIcon} />
          </View>
        ))}
      </View>
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
    legendBox: {
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: '#213A6B',
      flexDirection: 'row',
      height: Dimensions.get('window').height * 0.08,
    },
    legendItem: {
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: 30,
    },
    legendIcon: {
      width: MAX_ICON_SIZE,
      height: MAX_ICON_SIZE,
      resizeMode: 'contain',
    },
});
   
export default Map;
