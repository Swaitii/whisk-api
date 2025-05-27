import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const history = await whisk.getProjectHistory(12); // Will limit to 12 image results
if (history.Err || !history.Ok) {
    console.error("Error fetching image generation history:", history.Err);
}

if (history.Ok?.length === 0) {
    console.log("No projects found.");
}

// Take first project and get its id first
const projectId = history.Ok![0]!.name;

// Now rename the project
const newName = "Renamed Project";
const renameResult = await whisk.renameProject(newName, projectId);
if (renameResult.Err || !renameResult.Ok) {
    console.error("Error renaming project:", renameResult.Err);
}
else {
    // Note that the server returns the project ID after renaming, not the new name.
    console.log(`Project renamed successfully, Project ID: ${renameResult.Ok}`);
}