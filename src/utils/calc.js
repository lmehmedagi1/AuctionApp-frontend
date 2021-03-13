export const timeDifference = (timestamp1, timestamp2) => {
    let difference = timestamp1 - timestamp2;
    return Math.floor(difference/1000/60/60/24);
}
