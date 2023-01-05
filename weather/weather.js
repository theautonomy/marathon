import { createApp } from 'https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js?module'
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.2/esm/axios.js'
import { ICON_MAP } from "./iconMap.js"

createApp({
  data() {
    return {
      current: [],
      daily: [],
      hourly: []
    }
  },

  mounted: function () {
    navigator.geolocation.getCurrentPosition(this.positionSuccess, this.positionError)
  },

  methods: {
    positionSuccess({ coords }) {
      console.log(coords.latitude);

      this.getWeather(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      )
        .then(this.renderWeather)
        .catch(e => {
          console.error(e)
          alert("Error getting weather.")
        })
    },

    getWeather(lat, lon, timezone) {
      return axios
        .get(
          "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime",
          {
            params: {
              latitude: lat,
              longitude: lon,
              timezone,
            },
          }
        )
        .then(({ data }) => {
          return {
            current: this.parseCurrentWeather(data),
            daily: this.parseDailyWeather(data),
            hourly: this.parseHourlyWeather(data),
          }
        })
    },

    parseCurrentWeather({ current_weather, daily }) {
      const {
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode,
      } = current_weather
      const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
      } = daily

      return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode,
        iconUrl: `${ICON_MAP.get(current_weather.weathercode)}.svg`,
      }
    },

    parseDailyWeather({ daily }) {
      return daily.time.map((time, index) => {
        return {
          timestamp: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(time * 1000),
          iconCode: daily.weathercode[index],
          iconUrl: `${ICON_MAP.get(daily.weathercode[index])}.svg`,
          maxTemp: Math.round(daily.temperature_2m_max[index]),
        }
      })
    },

    parseHourlyWeather({ hourly, current_weather }) {
      return hourly.time
        .map((time, index) => {
          return {
            day: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(time * 1000),
            hour: new Intl.DateTimeFormat(undefined, { hour: "numeric" }).format(time * 1000),
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            precip: Math.round(hourly.precipitation[index] * 100) / 100,
            iconUrl: `${ICON_MAP.get(hourly.weathercode[index])}.svg`,
          }
        })
        .filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
    },

    getIconUrl(iconCode) {
      return `${ICON_MAP.get(iconCode)}.svg`
    },

    renderWeather({ current, daily, hourly }) {
      this.current = current;
      this.daily = daily;
      this.hourly = hourly;
      document.body.classList.remove("blurred")
    },

    positionError() {
      alert(
        "There was an error getting your location. Please allow us to use your location and refresh the page."
      )
    },

  }
}).mount('#app');

