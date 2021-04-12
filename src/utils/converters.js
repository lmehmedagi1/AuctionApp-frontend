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

export const getMonthName = (month) => {
    return getMonthNames()[parseInt(month)-1];
}

export const getMonthFromName = (month) => {
    return getMonthNames().indexOf(month) + 1;
}

export const getMonthNames = () => {
    let months = [];
    for (let i=0; i<12; i++) {
        months.push(moment().month(i).format('MMMM'));
    }
    return months;
}

export const getDaysInAMonth = (year, month) => {
    return [...Array(moment(year + "-" + month, "YYYY-MM").daysInMonth()).keys()];
}
