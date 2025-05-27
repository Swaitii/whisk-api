import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

// No need to provide anything else
// Please look at the /src/index.ts:generateImage function for default values
const result = await whisk.generateImage({
    prompt: "evironment made up of undefined null void vaccum and only blue earth is visible",
});
if (result.Err || !result.Ok) {
    console.error("Error generating image:", result.Err);
}

// Now get the base64 encoded image from the result
// Looks kinda messy, but thats google's backend team
const encodedImage = result.Ok?.imagePanels[0]?.generatedImages[0]?.encodedImage;
if (!encodedImage) {
    console.error("No image generated.");
    process.exit(1);
}

whisk.saveImage(encodedImage, "racist_crocodile.png");
console.log("Image generated and saved as racist_crocodile.png");

// There's also another way, but makes 2 requests and is very redundant
// Dont follow this unless you can't read the code above

// After you have generated the image
// const id = result.Ok?.imagePanels[0]?.generatedImages[0]?.mediaGenerationId;

// if (!id) {
//     console.error("No media generation ID found.");
//     process.exit(1);
// }

// const res = await whisk.saveImageDirect(id, "racist_crocodile_direct.png");
// if (res.Err || !res.Ok) {
//     console.error("Error saving image directly:", res.Err);
// }