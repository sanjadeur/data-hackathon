const TOTAL_ECOLOGICAL_FOOTPRINT = 'Total Ecological Footprint';
const HDI = "HDI";
const POPULATION = "Population (millions)";
const BDP_PER_CAPITA = "GDP per Capita";

const defaultStyle = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
};

function style(feature) {
    return {
        fillColor: getColor(feature.properties[currentCriteria]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    } 
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function round(x) {
    return Math.round(x * 100) / 100
}

function getColor(d) {
    if (d === undefined) {
        return '#eeeeee';
    }
    const diff = (currentMax - currentMin) / 8;
    
    return d > round(currentMin + 7 * diff) ? '#800026' :
        d > round(currentMin + 6 * diff) ? '#BD0026' :
        d > round(currentMin + 5 * diff) ? '#E31A1C' :
        d > round(currentMin + 4 * diff) ? '#FC4E2A' :
        d > round(currentMin + 3 * diff) ? '#FD8D3C' :
        d > round(currentMin + 2 * diff) ? '#FEB24C' :
        d > round(currentMin + diff) ? '#FED976' :
                    '#FFEDA0';
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


async function fetchCountryData() {
    const response = await fetch('data/countries-hires.json');
    const data = await response.json();
    countryData = data;
}

function updateProperties() {
    countryData.features.forEach(feature => {
        const mappedName = mapToPollution[feature.properties.NAME];
        const data = pollutionData[feature.properties.NAME] || pollutionData[mappedName];
        if (data === undefined) {
            return;
        }
        feature.properties = { ...feature.properties, ...data };
    });

    // console.log(
    //     Object.entries(pollutionData)
    //         .filter(([key, value]) => !value.used)
    //         .map(([key, value]) => key)
    // )
}
let legendDiv;

function addLengend() {
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        legendDiv = div;
        grades = [0, 1, 2, 3, 4, 5, 6, 7].map(value => round(currentMin + value * (currentMax - currentMin) / 8));

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

}
function initiInfo() {
    info = L.control();

    info.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        const title = '<h4>Total Ecological Footprint</h4>';
        this._div.innerHTML = title;
        this._div.innerHTML += (props ?
            '<b>' + props.NAME + '</b><br />' + (props[currentCriteria] ? props[currentCriteria] + ' gha per capita' : "Data unavailable")
            : 'Hover over a state');

    };

    info.addTo(map)
}

function initTitleLayer() {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: token,
    }).addTo(map); 
}

async function loadPollutionData() {
    const response = await fetch('data/pollution.json');
    const pollutionArray = await response.json()
    pollutionData = {};
    pollutionArray.forEach(entry => {
        pollutionData[entry.Country] = entry;
        pollutionData[entry.Country][BDP_PER_CAPITA] = parseFloat(entry[BDP_PER_CAPITA].substring(1).replace(/,/g, ''));
        entry.used = false;
    });
    // console.log(pollutionData);
}

async function setup() {
    await loadPollutionData();
    updateProperties(countryData);
    updateColoring();

    initTitleLayer();
    initiInfo();

    geojson = L.geoJson(countryData, {
        style,
        onEachFeature,
    }).addTo(map);

    addLengend();

}

function refreshCriteria() {
    updateColoring()
    geojson = L.geoJson(countryData, {
        style,
        onEachFeature,
    }).addTo(map);
    legendDiv.remove();
    addLengend();
}

const map = L.map('map', { minZoom: 2.8, maxZoom: 10 }).setView([20, 0], 2.4);
const token ='pk.eyJ1Ijoic29kaWMiLCJhIjoiY2p6a2M1eGxiMDNrYjNsbnh1MWY1c2NvcSJ9.FHmbwZS3FUYmB48j-U_ApA';

currentCriteria = document.getElementById('criteria').value;

function change() {
    currentCriteria = document.getElementById('criteria').value;
    refreshCriteria();
}

function updateColoring() {
    currentMax = Math.max(...Object.values(pollutionData).map(entry => entry[currentCriteria]).filter(x => !Number.isNaN(x)))
    currentMin = Math.min(...Object.values(pollutionData).map(entry => entry[currentCriteria]).filter(x => !Number.isNaN(x)))
}

document.getElementById('criteria').addEventListener('change', change);

// document.getelementbyid('sanya').addeventlistener('click', () => {
//     const element = document.getelementbyid('map');
//     element.style.fontsize = '120px';
//     element.style.color = "white";
//     // element.style.fontweight = 'bold';
//     element.style.lineheight = "800px";
//     element.style.textalign = 'center';
//     element.style.backgroundimage = 'url("sanja.jpg")';
//     element.style.backgroundsize = 'cover';
//     element.innertext = "machine learning";
// })

fetchCountryData().then(setup);