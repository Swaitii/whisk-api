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

// Note that it is accepting array of project IDs, so you can delete multiple projects at once
const deleteResult = await whisk.deleteProjects([projectId]);

if (deleteResult.Err || !deleteResult.Ok) {
    console.error("Error deleting project:", deleteResult.Err);
}

console.log(`Project deleted successfully, Project ID: ${projectId}`);