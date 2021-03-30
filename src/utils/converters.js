import moment from "moment"

export const nameToUrl = name => {
    return name.toLowerCase().replaceAll(" ", "-");
}

export const urlToName = url => {
    return url.replaceAll("-", " ").toUpperCase().substr(1);
}
export const timestampToDate = timestamp => {
    const longDateTimeFormat = "D MMMM YYYY";
    return moment.utc(timestamp ).local().format(longDateTimeFormat);
}
