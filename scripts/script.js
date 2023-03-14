const parks_ul = document.getElementById('parks');
const weather_div = document.getElementById('weather');

const weather_card_template = document.getElementById('weather-card-template');

const getParameterByName = name => {
  let url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const fahrenheitToCelsius = value => {
  return ((value - 32) * (5 / 9)).toFixed();
};

const buildWeatherCard = (title, weather, column) => {
  const temperature = (
    weather.temperature || weather.temperatureHigh
  ).toFixed();

  const summary = weather.summary.replace('.', '');

  let precipText = '';

  if (weather.precipProbability !== undefined) {
    const precipProbability = (weather.precipProbability * 100).toFixed();

    precipText = `<br /><br />Chance of rain: ${precipProbability}%`;
  }

  const instance = document.importNode(weather_card_template.content, true);

  instance.querySelector('.weather-card-body').classList.add(column);
  instance.querySelector('.card-header').innerHTML = title;

  const card_text = `${summary} and ${temperature}&deg;F (${fahrenheitToCelsius(
      temperature
    )}&deg;C).${precipText}`;

  instance.querySelector('#weather-card-text').innerHTML = card_text;

  const weatherIcon = `wi-forecast-io-${weather.icon}`;
  instance.querySelector('.wi').classList.add(weatherIcon);

  weather_div.appendChild(instance);
};

const buildDestinationInformation = _destination => {
  let presented_by_url = 'wdwnt_logo.png';
  let destination_name = 'Walt Disney World';
  let timezone = 'America/New_York';

  return {
    destination_name,
    presented_by_url,
    timezone
  };
};

const destination = getParameterByName('destination') || 'wdw';
const destination_information = buildDestinationInformation(destination);

const presented_by_image = document.getElementById('presented-by-image');
presented_by_image.src = destination_information.presented_by_url;

const destination_name_span = document.getElementById('destination-name');
destination_name_span.innerHTML = destination_information.destination_name;

const PARKS_API_URL = 'https://wdwnt-now-api.herokuapp.com/api/destinations/0/parks?sort=true';
const WEATHER_API_URL = 'https://fastpass.wdwnt.com/weather/' + destination;

const date_div = document.getElementById('date');
date_div.innerHTML = new Date().toLocaleDateString('en-US', {
  timeZone: destination_information.timezone
});

document.addEventListener(
  'DOMContentLoaded',
  function() {
    fetch(PARKS_API_URL)
      .then(res => res.json())
      .then(parks => {
        parks.forEach(park => {
          const li = document.createElement('li');

          li.innerHTML = `
        <div class="image" style="background-image: url('${park.imageUrl}');"></div>
        <h4>${park.name}</h4>
        <h6>${park.todaysHours}</h6>
      `;

          parks_ul.appendChild(li);
        });
      });

    fetch(WEATHER_API_URL)
      .then(res => res.json())
      .then(weather => {
        buildWeatherCard('Right now', weather[destination].currently, 'now');

        const daily = weather[destination].daily.data;

        buildWeatherCard('Today', daily[0], 'today');
        buildWeatherCard('Tomorrow', daily[1], 'tomorrow');

        const day = new Date(daily[2].time * 1000).toLocaleDateString(
          'en-US',
          {
            timeZone: destination_information.timezone,
            weekday: 'long'
          }
        );

        buildWeatherCard(day, daily[2], 'two-days');
      });
  },
  false
);