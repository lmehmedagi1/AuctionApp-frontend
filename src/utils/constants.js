import countries from 'assets/json/countries-states-cities.json'

export const imagePlaceholder = "https://www.firstfishonline.com/wp-content/uploads/2017/07/default-placeholder-700x700.png";
export const avatarPlaceholder = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';

export const getDefaultCountry = () => countries[0].name;
export const getDefaultState = (country) => country.states[0].name;
export const getDefaultCity = (state) => state.cities[0].name;

export const getCountries = () => {
    return countries.map(country => country.name)
}

export const getStatesInCountry = (currCountry) => {
    if (currCountry == null || currCountry == '') currCountry = getDefaultCountry();
    let statesNames = [];
    countries.map(country => {
        if (country.name == currCountry) {
            statesNames = country.states.map(state => state.name)
        }
    })
    return statesNames
}

export const getCitiesInStates = (currCountry, currState) => {
    if (currCountry == null || currCountry == '') currCountry = getDefaultCountry();
    let citiesNames = [];
    countries.map(country => {
        if (country.name == currCountry) {
            if ((currState == null || currState == '') && country.states.length > 0) currState = getDefaultState(country);
            country.states.map(state => {
                if (state.name == currState) {
                    citiesNames = state.cities.map(city => city.name)
                }
            });
        }
    })
    return citiesNames
}

export const getFirstState = (newCountry) => {
    let newState = '';
    countries.map(country => {
        if (country.name == newCountry) {
            if (country.states.length > 0) newState = getDefaultState(country);
        }
    })
    return newState
}

export const getFirstCity = (newCountry, newState) => {
    let newCity = '';
    countries.map(country => {
        if (country.name == newCountry) {
            country.states.map(state => {
                if (state.name == newState) {
                    if (state.cities.length > 0) newCity = getDefaultCity(state);
                }
            });
        }
    })
    return newCity
}
