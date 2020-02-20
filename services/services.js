function mapAlertAggregatedToRaw(type) {
  switch (type) {
    case "WINDS": 
      return ["HIGH_WIND"]
    case "SNOW": 
      return ["SNOW"]
    case "ICE": 
      return ["FROST"]
    case "THUNDER": 
      return ["THUNDERSTORM"]
    case "HEAT_WAVE": 
      return ["HEAT_WAVE"]
    case "COLD_WAVE": 
      return ["COLD_WAVE"]
    case "HEAVY_RAIN": 
      return ["HEAVY_RAIN_V2"]
    case "SUBMERSION": 
      return ["submersion"]
    case "THUNDER_V2": 
      return ["THUNDERSTORM_V2"]
    case "CRUE": 
      return ["CRUE"]
    case "POLLUTION": 
      return ["NO2", "O3", "PM10", "PM25"]
    default: 
      return ""
  }
}

function findCollectionFromType(type, country) {
  switch (type) {
    case "WINDS":
    case "SNOW":
    case "THUNDER": 
      if (country === "ITALY")
        return "AlertItaly"
      return "Alert"
    case "ICE":
    case "HEAT_WAVE":
    case "COLD_WAVE":
    case "HEAVY_RAIN":
    case "CRUE": 
      return "Alert"
    case "SUBMERSION": 
      return "AlertSubmersion"
    case "THUNDER_V2": 
      return "AlertThunder"
    case "POLLUTION": 
      return "AlertPollution"
    default: 
      return ""
  }
}

function valueForAlert(type) {
  switch (type) {
    case "WINDS": 
      return ["WIND_RAF", "WIND"]
    case "SNOW": 
      return ["snow_precipitation_low", "snow_precipitation_high"]
    case "ICE": 
      return ["temperature", "dew_point"]
    case "THUNDER": 
      return ["wind_speed_500mb", "wind_speed_850mb", "sweat"]
    case "HEAT_WAVE": 
    case "COLD_WAVE": 
      return ["max_day_1", "max_day_2", "max_day_3","min_day_1", "min_day_2", "min_day_3"]
    case "HEAVY_RAIN": 
      return ["cumul"]
    case "SUBMERSION":
      return ["wave_height", "swell_height", "total_height"]
    case "THUNDER_V2": 
      return ["EL_TEMPERATURE", "MUCAPE", "WIND"]
    case "CRUE": 
      return []
    case "POLLUTION": 
      return ["max", "avg"]
    default: 
      return []
  }
}
module.exports = {
  mapAlertAggregatedToRaw,
  findCollectionFromType,
  valueForAlert
}