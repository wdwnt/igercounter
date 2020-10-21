
let source = document.getElementById('weather-card-template').innerHTML;
const weather_card_template = Handlebars.compile(source);

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

const buildWeatherCard = (title, weather) => {
let temperature = (
    weather.temperature || weather.temperatureHigh
).toFixed();
let summary = weather.summary.replace('.', '');
let precipProbability = (weather.precipProbability * 100).toFixed();

var context = {
    card_title: title,
    icon: weather.icon,
    image_src: `https://darksky.net/images/weather-icons/${weather.icon}.png`,
    card_text: `${summary} and ${temperature}&deg;F (${fahrenheitToCelsius(
    temperature
    )}&deg;C).<br /><br />Chance of rain: ${precipProbability}%`
};

return weather_card_template(context);
};

const buildDestinationInformation = destination => {
    let presented_by_url =
        'https://wdwnt.com/wp-content/uploads/2017/11/wdwnt_logo_2017_v2.png';
    let destination_name = 'Walt Disney World';
    let timezone = 'America/New_York';
    let park_number = '0';
    let locale = 'en-US';

    if (destination === 'dlr') {
        presented_by_url =
        'https://dlnewstoday.com/wp-content/uploads/2018/11/dlnt.png';
        destination_name = 'Disneyland';
        timezone = 'America/Los_Angeles';
        park_number = '1';
        locale = 'en-US';
    } else if (destination === 'tdr') {
        presented_by_url = 'https://wdwntsirv.sirv.com/wdwnt.com/2020/07/Logo-with-Tagline.png';
        destination_name = 'Tokyo Disney Resort';
        timezone = 'Asia/Tokyo';
        park_number = '2';
        locale = 'jp';
    } else if (destination === 'dlp') {
        destination_name = 'Disneyland Paris';
        timezone = 'Europe/Paris';
        park_number = '3';
        locale = 'fr-FR';
    } else if (destination === 'hkdl') {
        destination_name = 'Hong Kong Disneyland';
        timezone = 'Asia/Hong_Kong';
        park_number = '4';
        locale = 'zh-Hk';
    } else if (destination === 'shdr') {
        destination_name = 'Shanghai Disney Resort';
        timezone = 'Asia/Shanghai';
        park_number = '5';
        locale = 'zh-CN';
    }

    return {
        destination_name,
        presented_by_url,
        timezone,
        park_number,
        locale
    };
};


const parks_ul = document.getElementById('parks');
const weather_div = document.getElementById('weather');

const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1);
const removeExtention = thePath => thePath.slice(0, -5);
const destinationCode = removeExtention(getLastItem(window.location.pathname));
const destination = getParameterByName('destination') || destinationCode;

let destination_information = buildDestinationInformation(destination);

const presented_by_image = document.getElementById('presented-by-image');
presented_by_image.src = destination_information.presented_by_url;
const destination_name_span = document.getElementById('destination-name');
destination_name_span.innerHTML =
destination_information.destination_name;

const background = getParameterByName('background');

const PARKS_API_URL =
'https://wdwnt-now-api.herokuapp.com/api/destinations/' + destination_information.park_number + '/parks?sort=true';
const WEATHER_API_URL = 'https://weather.wdwnt.com/api/' + destination;
const BACKGROUND_IMAGE = '';

const date_div = document.getElementById('date');
date_div.innerHTML = new Date().toLocaleDateString('zh-Hk', {
timeZone: destination_information.timezone
});

document.querySelector('body').style.backgroundImage =
`url(${background})` || '';

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
                        <h3>${park.name}</h3>
                        <h6>${park.todaysHours}</h6>
                    `;

            parks_ul.appendChild(li);
            });
        });

        fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(weather => {
            var currently = buildWeatherCard('Right now', weather.currently);

            var daily = weather.daily.data;
            var today = buildWeatherCard('Today', daily[0]);
            var tomorrow = buildWeatherCard('Tomorrow', daily[1]);

            let day = new Date(daily[2].time * 1000).toLocaleDateString(
            'jp',
            {
                timeZone: destination_information.timezone,
                weekday: 'long'
            }
            );
            var twoDaysFromNow = buildWeatherCard(day, daily[2]);

            weather_div.innerHTML =
            '<div class="row">' +
            currently +
            today +
            tomorrow +
            twoDaysFromNow +
            '</div>';
        });
    },
    false
);
