import Whisk from '../src';
import { expect, test } from 'bun:test';

const whisk = new Whisk({
  cookie: process.env.COOKIE || "INVALID_COOKIE",
});

const projects = await whisk.getProjectHistory(12);

test("Getting new project id.", async () => {
  const project = await whisk.getNewProjectId("Funny images");

  expect(project.Ok).toBeDefined();
  expect(project.Err).toBeUndefined();
  // '30' as length is unknown, mine was 36
  expect(project.Ok!.length > 30).toBe(true);
});

test("Getting project history.", async () => {
  const projects = await whisk.getProjectHistory(10);

  expect(projects.Ok).toBeDefined()
  expect(projects.Err).toBeUndefined();
  expect(Array.isArray(projects.Ok)).toBe(true);
});

test("Get project history with long count limit.", async () => {
  const projects = await whisk.getProjectHistory(10000000000);

  expect(projects.Err).toBeDefined()
  expect(projects.Ok).toBeUndefined();
});

// Test if users has any projects
test.if((projects.Ok?.length || 0) > 0)("Get project contents", async () => {
  const projectId = projects.Ok![0]!.name;

  const projectContent = await whisk.getProjectContent(projectId);
  expect(projectContent.Err).toBeUndefined();
  expect(projectContent.Ok).toBeDefined();

  expect(projectContent.Ok!.length).toBeGreaterThan(0);
  expect(projectContent.Ok![0]?.name).toBeDefined()
})

test.if((projects.Ok?.length || 0) > 0)("Delete project", async () => {
  const projectId = projects.Ok![0]!.name;

  const deleteProject = await whisk.deleteProjects([projectId]);
  expect(deleteProject.Err).toBeUndefined();
  expect(deleteProject.Ok).toBeDefined();

  projects.Ok = projects.Ok!.slice(1) // Remove the deleted project from the list for further tests
})

test.if((projects.Ok?.length || 0) > 0)("Rename project", async () => {
  const projectId = projects.Ok![0]!.name;
  const newName = "Renamed project";

  const renameProject = await whisk.renameProject(newName, projectId);
  expect(renameProject.Err).toBeUndefined();
  expect(renameProject.Ok).toBeDefined();

  // Check if the project was renamed
  const projectContent = await whisk.getProjectHistory(12);
  expect(projectContent.Err).toBeUndefined();
  expect(projectContent.Ok).toBeDefined();

  expect(projectContent.Ok![0]?.displayName).toBe(newName);
});