import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const token = await whisk.getAuthorizationToken()
if (token.Err || !token.Ok) {
    console.error("Error getting authorization token:", token.Err);
}

// You can use the token for further API calls or store it securely
// Note: Ensure that the environment variable COOKIE is set with a valid cookie value
// before running this script, or replace "INVALID_COOKIE" with a valid cookie string.
console.log("Authorization token:", token.Ok);