import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const newImage = await whisk.generateImage({
    prompt: "a prompt engineer spending days debugging messy code",
});
if (newImage.Err || !newImage.Ok) {
    console.error("Error generating image:", newImage.Err);
    process.exit(1);
}

const firstImage = newImage.Ok?.imagePanels[0]?.generatedImages[0];
const encodedImage = firstImage?.encodedImage;

if (!encodedImage) {
    console.error("No image was generated.");
    process.exit(1);
}

// Save the first generated image
whisk.saveImage(encodedImage, "stage_1.png");

const refinedImage = await whisk.refineImage({
    existingPrompt: firstImage.prompt,
    newRefinement: "His room is full of monitors and keyboards",
    base64image: encodedImage,
    imageId: firstImage.mediaGenerationId,
});
if (refinedImage.Err || !refinedImage.Ok) {
    console.error("Error refining image:", refinedImage.Err);
    process.exit(1);
}
const refinedImageData = refinedImage.Ok?.imagePanels[0]?.generatedImages[0]?.encodedImage;
if (!refinedImageData) {
    console.error("No refined image was generated.");
    process.exit(1);
}

// Save the refined image
whisk.saveImage(refinedImageData, "stage_2.png");
console.log("Image refinement completed successfully. Images saved as stage_1.png and stage_2.png.");