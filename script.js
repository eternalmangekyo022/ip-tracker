console.log("Loaded script.")
var map = L.map('map')

const ipInputField = document.querySelector("input#ip-input")
let nonStaticValues = document.querySelectorAll('.non-static-value')


let currentMarker


const removeCurrentMarker = () => {
    map.removeLayer(currentMarker)
}

const addMarker = (coords, popup="No text specified.") => {
    currentMarker = L.marker(coords).addTo(map)
        .bindPopup(popup)
        .openPopup();
}

const setView = (coords, zoom=map.getZoom()) => {
    map.setView(coords, zoom)
    addMarker(coords, "You are around here.")
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


document.querySelector("form.search-ip-form").addEventListener("submit", async e => {
    e.preventDefault()
    if(ipInputField.value !== "") {
        const { coords } = await fetchCoordsByIp(ipInputField.value)
        removeCurrentMarker()
        setView(coords)
    } else {
        alert("Don't leave the form empty!")
    }

})

async function getOwnIP() {
    try {
        let res = await fetch("https://geo.ipify.org/api/v2/country?apiKey=at_dvELfF0z3SiokO6jcU3pXqr1pCapO")
        res = await res.json()

        return res.ip
    } catch(err) {
        console.error(err)
    }
}


async function fetchCoordsByIp(ip=null) {
    try {
        if(!ip) {
            ip = await getOwnIP()
        }
        let res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_dvELfF0z3SiokO6jcU3pXqr1pCapO&ipAddress=${ip}`)
        res = await res.json()
        let { lat, lng, region, timezone } = res.location
        let { isp } = res
        lat = parseFloat(lat)
        lng = parseFloat(lng)

        let data = [res.ip, region, "UTC " + timezone, isp]

        for(let i = 0; i < nonStaticValues.length; i++) {
            nonStaticValues[i].innerHTML = data[i]
        }

        return {
            coords: [lat, lng],
        }
    } catch(err) {
        console.error(err)
    }
}
// https://geo.ipify.org/api/v2/country?apiKey=at_dvELfF0z3SiokO6jcU3pXqr1pCapO&ipAddress=8.8.8.8


// uncomment this when the project goes live:
fetchCoordsByIp()
    .then(res => setView(res.coords, 2.5))
    .catch(err => console.error(err))

// setView([12.11, 32.22], 2.5)

