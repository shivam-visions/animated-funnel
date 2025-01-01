import { tsParticles } from "tsparticles-engine";

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface FunnelOptions {
  containerId: string;
  stages: FunnelStage[];
  width?: number;
  height?: number;
  particleSettings?: {
    color?: string;
    number?: number;
    duration?: number;
  };
  tooltipFormatter?: (stage: FunnelStage) => string;
}

export const createFunnel = (options: FunnelOptions): void => {
  const { containerId, stages, width = 300, height = 500, particleSettings, tooltipFormatter } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Clear the container
  container.innerHTML = "";

  // Create SVG
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.style.overflow = "visible";

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);

  let yOffset = 0;

  // Create each stage and animate
  stages.forEach((stage, index) => {
    const stageHeight = (stage.value / totalValue) * height;
    const stageWidth = width - (index * width) / stages.length;

    // Create a circular path for the funnel stage (rounded)
    const radius = stageWidth / 2;
    const path = document.createElementNS(svgNS, "circle");
    path.setAttribute("cx", `${width / 2}`);
    path.setAttribute("cy", `${yOffset + radius}`);
    path.setAttribute("r", `${radius}`);
    path.setAttribute("fill", stage.color || "#7dd6f6");
    path.style.transition = "r 1s ease-in-out"; // Animating the radius for funnel buildup

    // Append path to the SVG
    svg.appendChild(path);

    // Tooltip logic
    const tooltip = document.createElement("div");
    tooltip.className = "funnel-tooltip";
    tooltip.style.display = "none";
    tooltip.innerHTML = tooltipFormatter ? tooltipFormatter(stage) : `${stage.label}: ${stage.value}`;
    document.body.appendChild(tooltip);

    path.addEventListener("mouseenter", (e) => {
      tooltip.style.left = `${e.pageX}px`;
      tooltip.style.top = `${e.pageY}px`;
      tooltip.style.display = "block";

      // Trigger celebration for last stage
      if (index === stages.length - 1) {
        triggerCelebration(containerId, particleSettings);
      }
    });

    path.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    // Animate the funnel buildup
    setTimeout(() => {
      path.setAttribute("r", `${radius}`); // This triggers the animation
    }, index * 500); // Delay to create build-up effect

    yOffset += stageHeight;
  });

  container.appendChild(svg);
};

export const triggerCelebration = (
  containerId: string,
  settings?: { color?: string; number?: number; duration?: number }
) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { color = "#1aa7ec", number = 50, duration = 3000 } = settings || {};

  tsParticles.load(containerId, {
    particles: {
      number: { value: number },
      size: { value: 3 },
      move: { enable: true, speed: 6 },
      opacity: { value: 0.7 },
      color: { value: color },
      shape: { type: "circle" },
    },
  });

  setTimeout(() => tsParticles.domItem(0)?.destroy(), duration);
};
