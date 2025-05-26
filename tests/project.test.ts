import Whisk from '../src';
import { expect, test } from 'bun:test';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

test("Getting new project id.", async () => {
    const project = await whisk.getNewProjectId("Funny images");

    expect(project.Ok).toBeDefined();
    expect(project.Err).toBeUndefined();
    // '30' as length is unknown, mine was 36
    expect((project.Ok?.length || 0) > 30).toBe(true);
});

test("Getting project history.", async () => {
    const projects = await whisk.getProjectHistory(10);

    expect(projects.Ok).toBeDefined()
    expect(projects.Err).toBeUndefined();
    
});