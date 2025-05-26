import Whisk from '../src';
import { describe, expect, test } from 'bun:test';

const whisk = new Whisk({
    cookie: process.env.COOKIE || "INVALID_COOKIE",
});

test("Getting authentication token", async () => {
    const token = await whisk.getAuthorizationToken();

    expect(token.Err).toBeUndefined()
    expect(token.Ok).toBeDefined()

    expect((token.Ok?.length || 0) > 20).toBe(true);
});

test("Supplying invalid cookie", async () => {
    const tempCookie = whisk.credentials.cookie;
    whisk.credentials.cookie = "I AM INVALID BRO"

    const token = await whisk.getAuthorizationToken();

    expect(token.Err).toBeDefined()

    // Set back the cookie
    whisk.credentials.cookie = tempCookie;
});