import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Alert, Platform, TouchableOpacityComponent} from 'react-native';
import Map, {PROVIDER_GOOGLE, Marker, BoundingBox, Camera, Callout} from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import CustomCallout from "./Callout";
import moment from 'moment';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
// import KDBush from 'kdbush';
import SuperCluster from "supercluster";
// import * as geokdbush from 'geokdbush';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_ICON_SIZE = 35;
const TOP_RADIUS = 13;
const BOT_RADIUS = 22;

type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
const daysOfWeek = {
  Sunday: "day_0",
  Monday: "day_1",
  Tuesday: "day_2",
  Wednesday: "day_3",
  Thursday: "day_4",
  Friday: "day_5",
  Saturday: "day_6",
};
const formatTime = (time: string) => moment(time, "HHmm").format("h:mm A");

const date = new Date(); // or any date you want to use
const day : DayOfWeek = moment(date).format('dddd') as DayOfWeek;
const dayKey = daysOfWeek[day];

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
  const expanse = useSharedValue(SCREEN_HEIGHT * 0.15);
  const mapRef = useRef<Map>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  // const [markers2, setMarkers2] = useState<MarkerData[]>([]);
  // const [latLngArray, setLatLng] = useState<KDBush| null>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [filteredIndexes, setFiltered] = useState<MarkerData[]>([]);
  const [query, setQuery] = useState<BoundingBox>();
  const [cam, setCamera] = useState<Camera>();
  const clusterRef = useRef<SuperCluster>(null);
  const [access] = useState<number>(0);

  const fetchData = async () => {
    try {
      const data = require('./stores.json');
      setMarkers(data);
      // const a = (data as MarkerData[]).map(item => ({ ...item }));
      // setMarkers2(a);
      // const bush = new KDBush(a.length);
      // a.forEach(marker =>{
      //   // console.log("0");
      //   bush.add(marker.latlng.longitude, marker.latlng.latitude);
      // });
      // bush.finish();
      // setLatLng(bush);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(expanse.value, {
        damping: 2, // Adjust the damping for a smoother animation
        stiffness: 100, // Adjust stiffness for the spring animation
        mass: 1, // Mass of the spring system
        overshootClamping: true, // Prevent the spring from overshooting
      }),
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const toggleExpand = () => {
    expanse.value = expanded ? SCREEN_HEIGHT * 0.15 : SCREEN_HEIGHT * 0.6; // Set the height value for collapsed and expanded states
    setExpanded(!expanded); // Toggle the state
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
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const resetScrollView = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  useEffect(() => {
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
            onPress={() => {setSelectedButton(selectedButton === 'bagel' ? null : 'bagel'); resetScrollView();
              // if (!(selectedButton === 'bagel')) {
              //   for (const index of geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, markers2.length)) {
              //     if ('bagel' === markers2[index as number].uri){
              //       // setAccess(index as number);
              //       break;
              //     }
              //   }
              // } else {
              //   // setAccess(geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, 1)[0] as number);
              // }
              // console.log(filteredIndexes);
              // console.log(access);
            }}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'bagel' ? 'bagel' : 'bagel_inactive'}} />
            <Text style={selectedButton === 'bagel' ? styles.selectedButtonText : styles.buttonText}>  IN-STORE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, selectedButton === 'grocery' ? styles.selectedButton : null]} 
            onPress={() => {setSelectedButton(selectedButton === 'grocery' ? null : 'grocery'); resetScrollView();
              // if (!(selectedButton === 'grocery')) {
              //   for (const index of geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, markers.length)) {
              //     if ('grocery' === markers[index as number].uri){
              //       setAccess(index as number);
              //       break;
              //     }
              //   }
              // } else {
              //   setAccess(geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, 1)[0] as number);
              // }
            }}
          >
            <Image style={styles.icon} source={{uri:selectedButton === 'grocery' ? 'grocery' : 'grocery_inactive'}} />
            <Text style={selectedButton === 'grocery' ? styles.selectedButtonText : styles.buttonText}>  GROCERY</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, selectedButton === 'cafe' ? styles.selectedButton : null]} 
            onPress={() => {setSelectedButton(selectedButton === 'cafe' ? null : 'cafe'); resetScrollView();
              // if (!(selectedButton === 'cafe')) {
              //   for (const index of geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, markers.length)) {
              //     if ('cafe' === markers[index as number].uri){
              //       setAccess(index as number);
              //       break;
              //     }
              //   }
              // } else {
              //   setAccess(geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, 1)[0] as number);
              // }
            }}
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
        radius={SCREEN_WIDTH * 0.08}
        showsCompass={true}
        edgePadding={{top: 100, left: 50, bottom: 50, right: 50}}
        superClusterRef={clusterRef}
        onRegionChangeComplete={async (val) => {
          setQuery(await mapRef.current?.getMapBoundaries());
          setCamera(await mapRef.current?.getCamera());
        }}
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
                
                <Image
                  source={{ uri: marker.uri }}
                  style={{
                    width: MAX_ICON_SIZE - 5,
                    height: MAX_ICON_SIZE + 5,
                    resizeMode: 'contain',
                  }}
                />
                <CustomCallout marker={marker}/>
              </Marker>
            );
          }
        })}
      </MapView>
      <Animated.View style={[styles.bottomBar, animatedStyle]}>
        <TouchableOpacity 
            style={{
              marginTop: 0,
              width: '30%',
              height: SCREEN_HEIGHT * 0.05,
              borderRadius: TOP_RADIUS,
              zIndex: 1,
              marginBottom:-15,
              alignItems:'center',
            }}
            onPress={() => {toggleExpand(); resetScrollView();
              setFiltered((clusterRef?.current?.getClusters([query?.southWest.longitude as number, query?.southWest.latitude as number, query?.northEast.longitude as number, query?.northEast.latitude as number], cam?.zoom as number)?.filter(item => !item.properties.cluster).map(item => item.properties.index) as number[]).map(index => markers[index]));
              // for (const index of geokdbush.around(latLngArray, cam?.center.longitude as number, cam?.center.latitude as number, markers2.length)) {
              //   if (!selectedButton) {
              //     // setAccess(index as number);
              //     break;
              //   } else if (selectedButton === markers2[index as number].uri){
              //     // setAccess(index as number);
              //     break;
              //   }
              // }
              // console.log(filteredIndexes);
            }}
        >
          <View style={styles.tap}></View>
        </TouchableOpacity>
        {/* {filteredIndexes.length == 0 && markers.length != 0 ? (
          <ScrollView style={styles.scrollContainer} ref={scrollViewRef}>
            <View style={styles.secondTap}>
              <Image
                source={{
                  uri: markers2[access as number].uri + "_inactive",
                }}
                resizeMode="contain"
                style={{ 
                  width: 60, 
                  height: "100%",
                  marginRight: 19,
                }}
              />
              <View style={{
                  flex: 1,
                  flexDirection: 'column', 
                  // backgroundColor: 'white',
                  justifyContent:'center',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Sora-Bold',
                    color: "white",
                  }}
                >
                  {markers2[access as number].title}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Sora-Regular',
                    color: '#B1C9DB',
                    fontSize: 10,
                  }}
                >{markers2[access as number].address}</Text>
                <Text
                  style={{
                    fontFamily: 'Sora-Regular',
                    color: '#B1C9DB',
                    fontSize: 10,
                  }}
                >{markers2[access as number].address_2}</Text>
                {dayKey in markers2[access as number].opening_hours ? (
                  <Text
                    style={{
                      marginTop: 3,
                      fontFamily: 'Sora-SemiBold',
                      color: 'white',
                      fontSize: 9.5,
                    }}
                  >Hours: {formatTime((markers2[access as number].opening_hours[dayKey]).open)} - {formatTime((markers2[access as number].opening_hours[dayKey]).close)}</Text>
                ) : (
                  <Text
                    style={{
                      marginTop: 3,
                      fontFamily: 'Sora-SemiBold',
                      color: 'white',
                      fontSize: 9.5,
                    }}
                  >Closed Today</Text>
                )}
              </View>
              <TouchableOpacity
                style={{
                  width:25,
                  marginLeft: 15,
                }}
                onPress={() => onMarkerPress(markers[access as number].latlng)}
              >
                <Image
                  source={{
                    uri: "arrow",
                  }}
                  resizeMode="contain"
                  style={{ 
                    width: 15, 
                    height: "100%",
                    marginLeft: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : ( */}
          <ScrollView style={styles.scrollContainer} ref={scrollViewRef}>
            {filteredIndexes
              .filter((marker => !selectedButton || marker.uri === selectedButton) )
              .map((marker, index) => (
              <View style={styles.secondTap} key={index}>
                  <Image
                    source={{
                      uri: marker.uri + "_inactive",
                    }}
                    resizeMode="contain"
                    style={{ 
                      width: 60, 
                      height: "100%",
                      marginRight: 19,
                    }}
                  />
                  <View style={{
                      flex: 1,
                      flexDirection: 'column', 
                      // backgroundColor: 'white',
                      justifyContent:'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Sora-Bold',
                        color: "white",
                      }}
                    >
                      {marker.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Sora-Regular',
                        color: '#B1C9DB',
                        fontSize: 10,
                      }}
                    >{marker.address}</Text>
                    <Text
                      style={{
                        fontFamily: 'Sora-Regular',
                        color: '#B1C9DB',
                        fontSize: 10,
                      }}
                    >{marker.address_2}</Text>
                    {dayKey in marker.opening_hours ? (
                      <Text
                        style={{
                          marginTop: 3,
                          fontFamily: 'Sora-SemiBold',
                          color: 'white',
                          fontSize: 9.5,
                        }}
                      >Hours: {formatTime((marker.opening_hours[dayKey]).open)} - {formatTime((marker.opening_hours[dayKey]).close)}</Text>
                    ) : (
                      <Text
                        style={{
                          marginTop: 3,
                          fontFamily: 'Sora-SemiBold',
                          color: 'white',
                          fontSize: 9.5,
                        }}
                      >Closed Today</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      width:25,
                      marginLeft: 15,
                    }}
                    onPress={() => onMarkerPress(marker.latlng)}
                  >
                    <Image
                      source={{
                        uri: "arrow",
                      }}
                      resizeMode="contain"
                      style={{ 
                        width: 15, 
                        height: "100%",
                        marginLeft: 5,
                      }}
                    />
                  </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        {/* )} */}
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
    flexDirection: "row",
    resizeMode: "contain",
    padding: 20,
    justifyContent: 'center',
  },
  tap: {
    width: '40%',
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
    marginTop: SCREEN_HEIGHT * 0.1,
    width: '100%',
    height: SCREEN_HEIGHT * 0.8,
    zIndex: 0,
  },
  fullView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'green',
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

