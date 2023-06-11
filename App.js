import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Platform,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// object안에 width를 가져오고 이름을 SCREEN_WIDTH로 바꾼다는 뜻

const API_KEY = "d09d7b83312ae2ff9d7becc92c3a21d7";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      //해당 if문을 통해서 사용자가 위치 접근 허가를 거절했다는 것을 알 수 있음
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={[styles.textColor, styles.cityName]}>{city}</Text>
      </View>
      <View style={styles.weather}>
        {days.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          <View style={styles.day}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={[styles.textColor, styles.temp]}>
                {parseFloat(days.main.temp).toFixed(1) + " º"}
              </Text>
              <Fontisto
                name={icons[[days.weather[0].main]]}
                size={120}
                color="white"
              />
            </View>

            <Text style={[styles.textColor, styles.desciption]}>
              {days.weather[0].main}
            </Text>
            <Text style={[styles.textColor, styles.tinydesciption]}>
              {days.weather[0].description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  textColor: {
    color: "white",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: 300,
  },
  weather: {
    flex: 2,
  },
  day: {
    flex: 1,
    alignItems: "flex-start",
  },
  temp: {
    marginTop: 50,
    fontSize: 90,
  },
  desciption: {
    marginTop: -10,
    fontSize: 35,
  },
  tinydesciption: {
    fontSize: 20,
  },
});
