## Installation

To install the Animated Funnel NPM package, run the following command in your terminal:

```bash
npm install animated-funnel
```

If you encounter the following warning:

```
npm WARN <package-name> requires a peer of <dependency-name> but none was installed.
```

You might need to install it with the `--legacy-peer-deps` flag to resolve compatibility issues:

```bash
npm install animated-funnel --legacy-peer-deps
```

Alternatively, if possible, try upgrading your dependencies to resolve peer dependency conflicts and avoid the need for `--legacy-peer-deps`.

## Setup

Once installed, you can use the package in your project by importing and using the `createFunnel` function.

### Example Usage

1. Import the package:

```javascript
import { createFunnel } from "animated-funnel";
```

2. Prepare the funnel stages data:

```javascript
const stages = [
  { label: "Stage 1", value: 500, color: "#ff5733" },
  { label: "Stage 2", value: 400, color: "#ffbd33" },
  { label: "Stage 3", value: 300, color: "#33ff57" },
  { label: "Stage 4", value: 200, color: "#33b5ff" }
];
```

3. Call the `createFunnel` function with your desired options:

```javascript
createFunnel({
  containerId: "funnel-container",
  stages: stages,
  width: 400,
  height: 600,
  particleSettings: {
    color: "#ff4500",
    number: 100,
    duration: 4000
  },
  tooltipFormatter: (stage) => `${stage.label} - ${stage.value} users`
});
```

4. Include a container in your HTML where the funnel will be rendered:

```html
<div id="funnel-container"></div>
```

## Options

- `containerId`: (string) The ID of the container element where the funnel will be rendered.
- `stages`: (array) An array of funnel stages, each containing:
  - `label`: (string) The name of the stage.
  - `value`: (number) The value representing the stage's size.
  - `color`: (optional string) The color for the stage.
- `width`: (optional number) The width of the funnel (default: 300).
- `height`: (optional number) The height of the funnel (default: 500).
- `particleSettings`: (optional object) Configuration for particle effects:
  - `color`: (optional string) Color of the particles.
  - `number`: (optional number) Number of particles to display.
  - `duration`: (optional number) Duration of the particle effect (in ms).
- `tooltipFormatter`: (optional function) A function that formats the tooltip content.

## Troubleshooting

If you are using npm and receive a prompt asking you to add `--legacy-peer-deps` during installation, this typically indicates a peer dependency conflict. Adding `--legacy-peer-deps` to the installation command should resolve the issue, or you can try upgrading your dependencies to avoid it.

## License

This package is licensed under the MIT License.