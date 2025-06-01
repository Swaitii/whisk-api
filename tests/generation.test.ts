import Whisk from '../src';
import { expect, test, beforeEach } from 'bun:test';
import type { Prompt } from '../src/global.types';

const whisk = new Whisk({
  cookie: process.env.COOKIE || "INVALID_COOKIE",
});

test("Image generation", async () => {
  const project = await whisk.getNewProjectId("Sample Project");

  expect(project.Err).toBeUndefined();
  expect(project.Ok).toBeDefined();

  const prompt: Prompt = {
    projectId: project.Ok!,
    prompt: "A person who always forgets to write prompts",
  };

  const image = await whisk.generateImage(prompt);

  expect(image.Err).toBeUndefined();
  expect(image.Ok).toBeDefined();

  expect(image.Ok!.imagePanels).toBeInstanceOf(Array);
  expect(image.Ok!.imagePanels).toHaveLength(1);

  const imagePanel = image.Ok!.imagePanels[0]!;
  expect(imagePanel.generatedImages).toBeInstanceOf(Array);
  expect(imagePanel.generatedImages.length).toBeGreaterThan(0);
  expect(imagePanel.generatedImages[0]!.encodedImage).toBeDefined();
}, 30000);



test("Image generation without project id", async () => {
  const prompt: Prompt = {
    prompt: "A person who always forgets to write prompts",
  };

  const image = await whisk.generateImage(prompt);

  expect(image.Ok).toBeDefined();
  expect(image.Err).toBeUndefined();

  expect(image.Ok!.imagePanels).toBeInstanceOf(Array);
  expect(image.Ok!.imagePanels).toHaveLength(1);

  const imagePanel = image.Ok!.imagePanels[0]!;
  expect(imagePanel.generatedImages).toBeInstanceOf(Array);
  expect(imagePanel.generatedImages.length).toBeGreaterThan(0);
  expect(imagePanel.generatedImages[0]!.encodedImage).toBeDefined();
}, 30000);

test("Image generation with image aspect ratio", async () => {
  const prompt: Prompt = {
    aspectRatio: "IMAGE_ASPECT_RATIO_SQUARE",
    prompt: "A crocodile fish",
  };


  const image = await whisk.generateImage(prompt);

  expect(image.Ok).toBeDefined()
  expect(image.Ok!.imagePanels).toBeInstanceOf(Array);
  expect(image.Ok!.imagePanels).toHaveLength(1);

  const imagePanel = image.Ok!.imagePanels[0]!;
  expect(imagePanel.generatedImages).toBeInstanceOf(Array);
  expect(imagePanel.generatedImages.length).toBeGreaterThan(0);
  expect(imagePanel.generatedImages[0]!.encodedImage).toBeDefined();
}, 30000);

test("Image refinement", async () => {
  const prompt: Prompt = {
    prompt: "A person who always forgets to write prompts",
  }
  const image = await whisk.generateImage(prompt);
  expect(image.Err).toBeUndefined();
  expect(image.Ok).toBeDefined();
  expect(image.Ok!.imagePanels).toBeInstanceOf(Array);
  expect(image.Ok!.imagePanels).toHaveLength(1);
  const imagePanel = image.Ok!.imagePanels[0]!;
  expect(imagePanel.generatedImages).toBeInstanceOf(Array);
  expect(imagePanel.generatedImages.length).toBeGreaterThan(0);
  expect(imagePanel.generatedImages[0]!.encodedImage).toBeDefined();
  const encodedImage = imagePanel.generatedImages[0]!.encodedImage;
  const refinedImage = await whisk.refineImage({
    existingPrompt: imagePanel.generatedImages[0]!.prompt,
    newRefinement: "The person is wearing a hat",
    base64image: encodedImage,
    imageId: imagePanel.generatedImages[0]!.mediaGenerationId,
  });
  expect(refinedImage.Err).toBeUndefined();
  expect(refinedImage.Ok).toBeDefined();
  expect(refinedImage.Ok!.imagePanels).toBeInstanceOf(Array);
  expect(refinedImage.Ok!.imagePanels).toHaveLength(1);
  const refinedImagePanel = refinedImage.Ok!.imagePanels[0]!;
  expect(refinedImagePanel.generatedImages).toBeInstanceOf(Array);
  expect(refinedImagePanel.generatedImages.length).toBeGreaterThan(0);
  expect(refinedImagePanel.generatedImages[0]!.encodedImage).toBeDefined();
  const refinedEncodedImage = refinedImagePanel.generatedImages[0]!.encodedImage;
  expect(refinedEncodedImage).toBeDefined();
}, 40000);
