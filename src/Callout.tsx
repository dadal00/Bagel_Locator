import React from "react";
import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import { Callout } from "react-native-maps";
import { MarkerData } from "./FinderScreen";
import moment from "moment";

const screenWidth = Dimensions.get("window").width;
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

const CustomCallout: React.FC<{
  marker: MarkerData;
}> = ({ marker }) => {
  return (
    <Callout tooltip>
      <View>
        <View style={styles.container}>
          <Image
            source={{
              uri: marker.uri + "_inactive",
            }}
            resizeMode="contain"
            style={{ width: 45, height: "100%", marginRight:9}}
          ></Image>
          <View style={{flexShrink: 1, flexDirection: 'column',}}>
            <Text
              style={{
                fontSize: 12,
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
                fontSize: 9.5,
              }}
            >{marker.address}</Text>
            <Text
              style={{
                fontFamily: 'Sora-Regular',
                color: '#B1C9DB',
                fontSize: 9.5,
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
        </View>
        <View style={styles.triangle}></View>
      </View>
    </Callout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#213A6B',
    width: screenWidth * 0.6,
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "transparent",
    resizeMode: "contain",
    overflow: "visible",
    padding: 10
  },
  triangle: {
    left: (screenWidth * 0.6) / 2 - 10,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 20,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: "black",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
});

export default CustomCallout;
