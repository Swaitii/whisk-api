# whisk-api

[![Test](https://github.com/rohitaryal/whisk-api/actions/workflows/test.yaml/badge.svg)](https://github.com/rohitaryal/whisk-api/actions/workflows/test.yaml)
[![License](https://img.shields.io/npm/l/whisk-api.svg)](https://github.com/rohitaryal/whisk-api/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Bun.js](https://img.shields.io/badge/Bun.js-000000?logo=bun&logoColor=pink)](https://nodejs.org/)

An unofficial TypeScript/JavaScript API wrapper for Google Labs' Whisk image generation platform.

## Features

- **Image Generation**: Create high-quality images from text prompts
- **Image Refinement**: Enhance and modify existing generated images
- **Project Management**: Organize generations into projects with full CRUD operations
- **Media Management**: Access generation history and download images
- **Multiple Models**: Support for various Imagen models with different capabilities
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
bun i whisk-api
# or
npm i whisk-api
```

## Quick Start

```typescript
import Whisk from 'whisk-api';

const whisk = new Whisk({
  cookie: "your_google_labs_cookie_here"
});

// Generate an image
const result = await whisk.generateImage({
  prompt: "A serene mountain landscape at sunset"
});

if (result.Ok) {
  const imageData = result.Ok.imagePanels[0]?.generatedImages[0]?.encodedImage;
  whisk.saveImage(imageData, "mountain_sunset.png");
}
```

## Authentication

You'll need to obtain your Google Labs session cookie:

1. Visit [labs.google/fx/tools/whisk](https://labs.google/fx/tools/whisk)
2. Open browser developer tools (F12)
3. Go to Application/Storage → Cookies
4. Copy the cookie value and use it in your configuration

## Supported Models

| Model | Description | Capabilities |
|-------|-------------|--------------|
| **Imagen 2** | Second generation model | Standard quality image generation |
| **Imagen 3** | Third generation model | Improved quality and prompt adherence |
| **Imagen 3.1** | Enhanced version of Imagen 3 | Better detail rendering |
| **Imagen 4** | Latest generation model | Highest quality, best prompt understanding |
| **Imagen 3 Portrait** | Portrait-optimized variant | Specialized for portrait generation |
| **Imagen 3 Landscape** | Landscape-optimized variant | Specialized for landscape generation |
| **Imagen 3 Portrait 3:4** | Portrait with 3:4 aspect ratio | Fixed aspect ratio portraits |
| **Imagen 3 Landscape 4:3** | Landscape with 4:3 aspect ratio | Fixed aspect ratio landscapes |

## Examples

The library includes comprehensive examples in the [`examples/`](examples/) directory:

- [Getting authorization tokens](examples/1_get_auth_tokens.ts)
- [Checking credit status](examples/2_get_credit_status.ts)
- [Creating projects](examples/3_create_new_project.ts)
- [Managing project history](examples/4_list_all_project_history.ts)
- [Project content management](examples/5_get_content_of_projects.ts)
- [Deleting projects](examples/6_delete_projects.ts)
- [Renaming projects](examples/7_rename_project.ts)
- [Image generation history](examples/8_get_image_generation_history.ts)
- [Saving images](examples/9_save_images.ts)
- [Basic image generation](examples/10_generate_image.ts)
- [Image refinement](examples/11_refine_image.ts)

## API Reference

### Core Methods

- `generateImage(prompt)` - Generate images from text prompts
- `refineImage(refinementRequest)` - Refine existing images with new prompts
- `getProjectHistory(limit)` - Retrieve project history
- `getImageHistory(limit)` - Retrieve image generation history
- `getNewProjectId(title)` - Create new projects
- `deleteProjects(projectIds)` - Delete multiple projects
- `renameProject(newName, projectId)` - Rename existing projects
- `saveImage(base64Data, fileName)` - Save images to disk
- `getAuthorizationToken()` - Generate authentication tokens

### Response Format

All methods return a `Result<T>` type with either:
- `Ok`: Contains the successful response data
- `Err`: Contains error information

```typescript
const result = await whisk.generateImage({ prompt: "example" });
if (result.Err) {
  console.error("Generation failed:", result.Err);
} else {
  console.log("Success:", result.Ok);
}
```

## Development

```bash
# Install dependencies
bun install

# Set up environment
export COOKIE="your_cookie_here"

# Run tests
bun test

```

## Testing

The test suite requires a valid Google Labs cookie. Set the `COOKIE` environment variable and run:

```bash
bun test
```

## Limitations

- Requires valid Google's logged in cookies.
- Regional availability may vary
- Unofficial API subject to changes

## Contributing

Contributions are welcome. Please ensure all tests pass and follow the existing code style.

## License

This project is for educational and research purposes. Please respect Google's terms of service when using this library.

## Disclaimer

This is an unofficial API wrapper and is not affiliated with Google. Use at your own risk and ensure compliance with Google's terms of service.