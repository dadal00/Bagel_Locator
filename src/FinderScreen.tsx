import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Alert, Platform, Animated} from 'react-native';
import Map, {PROVIDER_GOOGLE, Marker, Camera} from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import CustomCallout from "./Callout";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_ICON_SIZE = 35;
const TOP_RADIUS = 13;
const BOT_RADIUS = 22;

export type MarkerData = {
  title: string;
  address: string;
  uri: string;
  latlng: {
    latitude: number;
    longitude: number;
  };
  address_2: string;
  place_id: string;
  business_status: string;
  opening_hours: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
};

const MapScreen = () => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<Map>(null);
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

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false, // useNativeDriver: false since we are animating layout properties
    }).start();
    setExpanded(!expanded);
  };

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['15%', '60%'], // Change these to the desired heights
  });

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
        getUserLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to show your current location.');
      }
    } else {
      Alert.alert('Permission Denied', 'Location permission is required to show your current location.');
    }
  };

  const onMarkerPress = (latlng: any) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...latlng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const resetScrollView = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
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
            onPress={() => {setSelectedButton(selectedButton === 'bagel' ? null : 'bagel'); resetScrollView();}}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'bagel' ? 'bagel' : 'bagel_inactive'}} />
            <Text style={selectedButton === 'bagel' ? styles.selectedButtonText : styles.buttonText}>  IN-STORE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, selectedButton === 'grocery' ? styles.selectedButton : null]} 
            onPress={() => {setSelectedButton(selectedButton === 'grocery' ? null : 'grocery'); resetScrollView();}}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'grocery' ? 'grocery' : 'grocery_inactive'}} />
            <Text style={selectedButton === 'grocery' ? styles.selectedButtonText : styles.buttonText}>  GROCERY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, selectedButton === 'cafe' ? styles.selectedButton : null]} 
            onPress={() => {setSelectedButton(selectedButton === 'cafe' ? null : 'cafe'); resetScrollView();}}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'cafe' ? 'cafe_active' : 'cafe_inactive'}} />
            <Text style={selectedButton === 'cafe' ? styles.selectedButtonText : styles.buttonText}>  CAFE</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={styles.map}
        region={initialRegion}
        showsUserLocation={true}
        clusterColor="#213A6B"
        radius={SCREEN_WIDTH * 0.09}
      >
        {markers.map((marker, index) => {
          if (!selectedButton || marker.uri === selectedButton) {
            return (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                tracksViewChanges={false}
                onPress={() => onMarkerPress(marker.latlng)}
              >
                <CustomCallout marker={marker}></CustomCallout>
                <Image
                  source={{ uri: marker.uri }}
                  style={{
                    width: MAX_ICON_SIZE - 5,
                    height: MAX_ICON_SIZE + 5,
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
      <Animated.View style={[styles.bottomBar, { height: containerHeight }]}>
        <View style={styles.tap}>
          <TouchableOpacity 
            style={{
              width: '200%',
              height: '200%',
              borderRadius: TOP_RADIUS,
            }}
            onPress={() => {toggleExpand(); resetScrollView();}}
          />
        </View>
        <ScrollView style={styles.scrollContainer} ref={scrollViewRef}>
          {markers
            .filter(marker => !selectedButton || marker.uri === selectedButton)
            .map((marker, index) => (
            <View style={styles.secondTap}>
                
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: '90%',
    marginBottom: SCREEN_HEIGHT * 0.08,
  },
  secondTap: {
    height: SCREEN_HEIGHT * 0.145,
    backgroundColor: '#3A5485',
    marginTop: 15,
    borderRadius: TOP_RADIUS,
  },
  tap: {
    width: '13%',
    height: SCREEN_HEIGHT * 0.01,
    backgroundColor: '#3A5485',
    marginTop: 10,
    borderRadius: TOP_RADIUS,
    alignItems: 'center',
  },
  bottomBar: {
    width: '100%',
    backgroundColor: '#213A6B',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: BOT_RADIUS,
    borderTopRightRadius: BOT_RADIUS,
    alignItems: 'center',
  },
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
    fontFamily: 'Sora-Regular',
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
   
export default MapScreen;
function markerOnPress(coord: any) {
  throw new Error('Function not implemented.');
}

