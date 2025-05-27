import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const history = await whisk.getImageHistory(12); // Will limit to 12 image results
if (history.Err || !history.Ok) {
    console.error("Error fetching image generation history:", history.Err);
}

for (const image of history.Ok!) {
    console.log("Image ID: ", image.name);
    console.log("Created At: ", image.createTime);
    console.log("Prompt: ", image.media.image.prompt);
    console.log("Model Used: ", image.media.image.modelNameType);
    console.log("------- x --------\n");
}