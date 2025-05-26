import Whisk from '../src';
import { expect, test } from 'bun:test';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

test("Checking availability", async () => {
    const res = await whisk.isAvailable();

    expect(res.Err).toBeUndefined()
    expect(res.Ok).toBeDefined(); // May be redundant
    expect(res.Ok).toBe(true);
});