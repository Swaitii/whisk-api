import type { Credentials, FetchedImage, GenerationResult, ImageMetadata, Images, Projects, Prompt, Result } from "./global.types";
import type { Request } from "./global.types";
import { request } from "./utils/request";

export default class Whisk {
  credentials: Credentials;

  constructor(credentials: Credentials) {
    if (!credentials.cookie || credentials.cookie == "INVALID_COOKIE") {
      throw new Error("Cookie is missing or invalid.")
    }

    this.credentials = structuredClone(credentials)
  }

  async #checkCredentials() {
    if (!this.credentials.cookie) {
      throw new Error("Credentials are not set. Please provide a valid cookie.");
    }

    if (!this.credentials.authorizationKey) {
      const resp = await this.getAuthorizationToken();

      if (resp.Err || !resp.Ok) {
        throw new Error("Failed to get authorization token: " + resp.Err);
      }

      this.credentials.authorizationKey = resp.Ok;
    }
  }

  /**
   * Check if `Whisk` is available in your region.
   *
   * This un-availability can be easily bypassed by
   * generating authorization token from a region where
   * its available. Use VPN with US regions.
   */
  async isAvailable(): Promise<Result<boolean>> {
    const req: Request = {
      body: "{}",
      method: "POST",
      url: "https://aisandbox-pa.googleapis.com/v1:checkAppAvailability",
      headers: new Headers({ // The API key might not work next-time (unsure)
        "Content-Type": "text/plain;charset=UTF-8",
        "X-Goog-Api-Key": "AIzaSyBtrm0o5ab1c-Ec8ZuLcGt3oJAA5VWt3pY",
      }),
    };

    const response = await request(req);
    if (response.Err || !response.Ok) {
      return { Err: response.Err };
    }

    try {
      const responseBody = JSON.parse(response.Ok);
      return { Ok: responseBody.availabilityState === "AVAILABLE" };
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + response.Ok) };
    }
  }

  /**
   * Generates the authorization token for the user.
   * This generated token is required to make *most* of API calls.
   */
  async getAuthorizationToken(): Promise<Result<string>> {
    // Not on this one
    // this.#checkCredentials();
    if (!this.credentials.cookie) {
      return { Err: new Error("Empty or invalid cookies.") }
    }

    const req: Request = {
      method: "GET",
      url: "https://labs.google/fx/api/auth/session",
      headers: new Headers({ "Cookie": String(this.credentials.cookie) }),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      const token = parsedResp?.access_token;

      if (!token) {
        return { Err: new Error("Failed to get session token: " + resp.Ok) }
      }

      // Let's not mutate the credentials directly
      // this.credentials.authorizationKey = token;
      return { Ok: String(token) };
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + resp.Ok) };
    }
  }

  /**
   * Get the current credit status of the user. This is for `veo` only and not `whisk`.
   */
  async getCreditStatus(): Promise<Result<number>> {
    this.#checkCredentials();

    const req: Request = {
      method: "POST",
      body: JSON.stringify({ "tool": "BACKBONE", "videoModel": "VEO_2_1_I2V" }), // Unknown of other models
      url: "https://aisandbox-pa.googleapis.com/v1:GetUserVideoCreditStatusAction",
      headers: new Headers({ "Authorization": String(this.credentials.authorizationKey) }),
    };

    const response = await request(req);
    if (response.Err || !response.Ok) {
      return { Err: response.Err };
    }

    try {
      const responseBody = JSON.parse(response.Ok);

      // Other properties don't seem to be useful
      return { Ok: Number(responseBody.credits) }
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + response.Ok) };
    }
  }

  /**
   * Generates a new project ID (a unique identifier for each project) for the
   * given title so that you can start generating images in that specific project.
   * 
   * @param projectTitle The name you want to give to the project.
   */
  async getNewProjectId(projectTitle: string): Promise<Result<string>> {
    this.#checkCredentials();

    const req: Request = {
      method: "POST",
      // Long ass JSON
      body: JSON.stringify({
        "json": {
          "clientContext": {
            "tool": "BACKBONE",
            "sessionId": ";1748266079775" // Doesn't matter whatever the value is
            // But probably the last login time
          },
          "workflowMetadata": { "workflowName": projectTitle }
        }
      }),
      url: "https://labs.google/fx/api/trpc/media.createOrUpdateWorkflow",
      headers: new Headers({ "Cookie": String(this.credentials.cookie) }),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      const workflowID = parsedResp?.result?.data?.json?.result?.workflowId;

      return workflowID ? { Ok: String(workflowID) } : { Err: new Error("Failed to create new library" + resp.Ok) };
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + resp.Ok) }
    }
  }

  /**
   * Get all of your project history or library.
   * 
   * @param limitCount The number of projects you want to fetch.
   */
  async getProjectHistory(limitCount: number): Promise<Result<Projects[]>> {
    this.#checkCredentials();

    const reqJson = {
      "json": {
        "rawQuery": "",
        "type": "BACKBONE",
        "subtype": "PROJECT",
        "limit": limitCount,
        "cursor": null
      },
      "meta": { "values": { "cursor": ["undefined"] } }
    };

    const req: Request = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Cookie": String(this.credentials.cookie),
      }),
      url: `https://labs.google/fx/api/trpc/media.fetchUserHistory?input=` + JSON.stringify(reqJson),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      const workflowList = parsedResp?.result?.data?.json?.result?.userWorkflows;

      // More cases required here
      if (workflowList && Array.isArray(workflowList)) {
        return { Ok: workflowList as Projects[] }
      }

      return { Err: new Error("Failed to get project history: " + resp.Ok) }
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + resp.Ok) };
    }
  }

  /**
   * Get the image history of the user.
   * 
   * @param limitCount The number of images you want to fetch.
   */
  async getImageHistory(limitCount: number): Promise<Result<Images[]>> {
    this.#checkCredentials();

    // No upper known limit
    if (limitCount <= 0) {
      return { Err: new Error("Limit count must be between 1 and 100.") };
    }

    const reqJson = {
      "json": {
        "rawQuery": "",
        "type": "BACKBONE",
        "subtype": "IMAGE",
        "limit": limitCount,
        "cursor": null
      },
      "meta": { "values": { "cursor": ["undefined"] } }
    };

    const req: Request = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Cookie": String(this.credentials.cookie),
      }),
      url: `https://labs.google/fx/api/trpc/media.fetchUserHistory?input=` + JSON.stringify(reqJson),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) return { Err: resp.Err }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      const mediaList = parsedResp?.result?.data?.json?.result?.userWorkflows;

      // More cases required here
      if (mediaList || Array.isArray(mediaList)) {
        return { Ok: mediaList as Images[] }
      }

      return { Err: new Error("Failed to get image history: " + resp.Ok) }
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + resp.Ok) };
    }
  }


  /**
   * Fetches the content of a project by its ID.
   * 
   * @param projectId The ID of the project you want to fetch content from.
   */
  async getProjectContent(projectId: string): Promise<Result<ImageMetadata[]>> {
    this.#checkCredentials();

    if (!projectId) {
      return { Err: new Error("Project ID is required to fetch project content.") };
    }

    const reqJson = { "json": { "workflowId": projectId } };
    const req: Request = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Cookie": String(this.credentials.cookie),
      }),
      url: `https://labs.google/fx/api/trpc/media.getProjectWorkflow?input=` + JSON.stringify(reqJson),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      const mediaList = parsedResp?.result?.data?.json?.result?.media;

      // More cases required here
      if (!mediaList || !Array.isArray(mediaList)) {
        return { Err: new Error("Failed to get project content: " + resp.Ok) };
      }

      return { Ok: mediaList as ImageMetadata[] };
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + resp.Ok) };
    }
  }

  /**
   * Fetches the base64 encoded image from its media key (name).
   * Media key can be obtained by calling: `getImageHistory()[0...N].name`
   * 
   * @param mediaKey The media key of the image you want to fetch.
   */
  async getMedia(mediaKey: string): Promise<Result<FetchedImage>> {
    this.#checkCredentials();

    if (!mediaKey) {
      return { Err: new Error("Media key is required to fetch the image.") };
    }

    const reqJson = { "json": { "mediaKey": mediaKey } };
    const req: Request = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Cookie": String(this.credentials.cookie),
      }),
      url: `https://labs.google/fx/api/trpc/media.fetchMedia?input=` + JSON.stringify(reqJson),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      const image = parsedResp?.result?.data?.json?.result;

      if (!image) {
        return { Err: new Error("Failed to get media: " + resp.Ok) };
      }

      return { Ok: image as FetchedImage };
    } catch (err) {
      return { Err: new Error("Failed to parse response: " + resp.Ok) };
    }
  }

  /**
   * Generates an image based on the provided prompt.
   * 
   * @param prompt The prompt containing the details for image generation.
   */
  async generateImage(prompt: Prompt): Promise<Result<GenerationResult>> {
    this.#checkCredentials();

    if (!prompt || !prompt.prompt) {
      return { Err: new Error("Invalid prompt. Please provide a valid prompt and projectId") };
    }

    // You missed the projectId, so let's create a new one
    if (!prompt.projectId) {
      const id = await this.getNewProjectId("New Project");
      if (id.Err || !id.Ok)
        return { Err: id.Err }

      prompt.projectId = id.Ok;
    }

    if (!prompt.imageModel) {
      prompt.imageModel = "IMAGEN_3_5";
    }

    if (!prompt.aspectRatio) {
      prompt.aspectRatio = "IMAGE_ASPECT_RATIO_LANDSCAPE"; // Default in frontend
    }

    const reqJson = {
      "clientContext": {
        "workflowId": prompt.projectId,
        "tool": "BACKBONE",
        "sessionId": ";1748281496093"
      },
      "imageModelSettings": {
        "imageModel": prompt.imageModel,
        "aspectRatio": prompt.aspectRatio,
      },
      "seed": prompt.seed,
      "prompt": prompt.prompt,
      "mediaCategory": "MEDIA_CATEGORY_BOARD"
    };

    const req: Request = {
      method: "POST",
      body: JSON.stringify(reqJson),
      url: "https://aisandbox-pa.googleapis.com/v1/whisk:generateImage",
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": String(this.credentials.authorizationKey),
      }),
    };

    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);

      return { Ok: parsedResp as GenerationResult }
    } catch (err) {
      return { Err: new Error("Failed to parse response:" + resp.Ok) }
    }
  }
}