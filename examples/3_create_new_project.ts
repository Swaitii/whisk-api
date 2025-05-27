import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const newProject = await whisk.getNewProjectId("My Project Title");
if (newProject.Err || !newProject.Ok) {
    console.error("Error creating new project:", newProject.Err);
}

console.log("New project created with ID:", newProject.Ok);