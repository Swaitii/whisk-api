import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const projects = await whisk.getProjectHistory(12); // Will limit to 12 image results
if (projects.Err || !projects.Ok) {
    console.error("Error fetching image generation history:", projects.Err);
    process.exit(1);
}

if (projects.Ok?.length === 0) {
    console.log("No projects found.");
}

// Take first project and get its id first
const projectId = projects.Ok![0]!.name;

// Now fetch for content of the project
const projectContent = await whisk.getProjectContent(projectId);
if (projectContent.Err || !projectContent.Ok) {
    console.error("Error fetching project content:", projectContent.Err);
    process.exit(1);
}

// Iterate through the images in the project content
for (const images of projectContent.Ok!) {
    console.log("Image ID: ", images.name);
    console.log("Created At: ", images.createTime);
    console.log("Prompt: ", images.image.prompt);
}

console.log(projectContent.Ok)