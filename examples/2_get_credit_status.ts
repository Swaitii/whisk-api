import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const creditStatus = await whisk.getCreditStatus();
if (creditStatus.Err || !creditStatus.Ok) {
    console.error("Error getting credit status:", creditStatus.Err);
}

// This is for Veo 2. Although `animate` is still not implemented,
// this is here for completeness and to ensure the API works as expected.
console.log("Credit remaining:", creditStatus.Ok);