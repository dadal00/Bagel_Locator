import React from "react";
import { View, StyleSheet, Dimensions, Image, Text } from "react-native";
import { Callout } from "react-native-maps";
import { MarkerData } from "./FinderScreen";

const screenWidth = Dimensions.get("window").width;

const imageDimensions = {
  "uri1": { width: 50, height: 50 },
  "uri2": { width: 60, height: 40 },
  "uri3": { width: 40, height: 60 },
};

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
            style={{ width: 35, height: "100%", marginRight:9}}
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
                fontFamily: 'Sora-Bold',
                color: '#B1C9DB',
                fontSize: 9.5,
              }}
            >{marker.address}</Text>
            <Text
              style={{
                fontFamily: 'Sora-Bold',
                color: '#B1C9DB',
                fontSize: 9.5,
              }}
            >{marker.city}, {marker.prov_state} {marker.postal_zip}</Text>
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
    width: screenWidth * 0.53,
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "transparent",
    overflow: "hidden",
    resizeMode: "contain",
    padding: 10
  },
  triangle: {
    left: (screenWidth * 0.5) / 2 - 10,
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
