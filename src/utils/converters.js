export const nameToUrl = name => {
    return name.toLowerCase().replaceAll(" ", "-");
}

export const urlToName = url => {
    return url.replaceAll("-", " ").toUpperCase().substr(1);
}
