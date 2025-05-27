import Whisk from '../src';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const projects = await whisk.getProjectHistory(12); // Will limit to 12 project results
if (projects.Err || !projects.Ok) {
    console.error("Error fetching project history:", projects.Err);
}

for(const project of projects.Ok!) {
    console.log("Project ID: ", project.name)
    console.log("Project Title: ", project.displayName)    
    console.log("------- x --------\n")
}