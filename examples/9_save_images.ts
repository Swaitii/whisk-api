import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const images = await whisk.getImageHistory(12); // Will limit to 12 image results
if (images.Err || !images.Ok) {
    console.error("Error getting image history:", images.Err);
}

if (!images.Ok?.length) {
    console.error("No images found in history.");
    process.exit(1);
}

const result = await whisk.saveImageDirect(images.Ok![0]!.name, "my_image.png");
if (result.Err || !result.Ok) {
    console.error("Error saving image:", result.Err);
}
