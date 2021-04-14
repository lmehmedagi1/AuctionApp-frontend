export const hostUrl = "https://auction-app-atlantbh.herokuapp.com";
//export const hostUrl = "http://localhost:8080";
export const homeUrl = "/";
export const itemPageUrl = "/shop/single-product/*";
export const itemPageUrls = ["/shop/single-product/*", "/single-product/*", "/my-account/single-product/*"];
export const shopPageUrl = "/shop";
export const userProfileUrls = ["/my-account/profile", "/my-account/bids", "/my-account/seller", "/my-account/wishlist", "/my-account/settings"];
export const sellPageUrl = "/my-account/become-seller";

export const aboutUrl = "/about-us";
export const termsAndConditionsUrl = "/terms-and-conditions";
export const privacyPolicyUrl = "/privacy-policy";

export const loginUrl = "/login";
export const registerUrl = "/register";

export const homeUrls = [homeUrl, loginUrl, registerUrl];
export const shopUrls = [aboutUrl, termsAndConditionsUrl, privacyPolicyUrl, ...itemPageUrls, shopPageUrl];
export const accountUrls = [...userProfileUrls];
