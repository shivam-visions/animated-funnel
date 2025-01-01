import { tsParticles } from "tsparticles-engine";

export interface FunnelStage {
  label: string;
  value: number;
  color?: string; // Custom color for each stage
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

  // Clear the container before rendering the funnel
  container.innerHTML = "";

  // Create SVG for funnel visualization
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.style.overflow = "visible";

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);

  let yOffset = 0;
  stages.forEach((stage, index) => {
    const stageHeight = (stage.value / totalValue) * height;
    const stageWidth = width - (index * width) / stages.length;

    // Create path (rounded shape) for the stage
    const path = document.createElementNS(svgNS, "rect");
    path.setAttribute("x", `${(width - stageWidth) / 2}`);
    path.setAttribute("y", `${yOffset}`);
    path.setAttribute("width", `${stageWidth}`);
    path.setAttribute("height", `${stageHeight}`);
    path.setAttribute("rx", "30"); // Rounded corners
    path.setAttribute("ry", "30"); // Rounded corners
    path.setAttribute("fill", stage.color || "#66cc66");

    // Create gradient effect for each stage
    const gradientId = `gradient-${index}`;
    const defs = document.createElementNS(svgNS, "defs");
    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", gradientId);
    linearGradient.setAttribute("gradientTransform", "rotate(90)");

    // Adding stops for gradient effect
    ["#66cc66", "#44bb44"].forEach((color, i) => {
      const stop = document.createElementNS(svgNS, "stop");
      stop.setAttribute("offset", `${i * 100}%`);
      stop.setAttribute("style", `stop-color:${color}; stop-opacity:1`);
      linearGradient.appendChild(stop);
    });

    defs.appendChild(linearGradient);
    svg.appendChild(defs);
    path.setAttribute("fill", `url(#${gradientId})`);
    svg.appendChild(path);

    // Add tooltip functionality
    const tooltip = document.createElement("div");
    tooltip.className = "funnel-tooltip";
    tooltip.style.display = "none";
    tooltip.innerHTML = tooltipFormatter ? tooltipFormatter(stage) : `${stage.label}: ${stage.value}`;
    document.body.appendChild(tooltip);

    path.addEventListener("mouseenter", (e) => {
      tooltip.style.left = `${e.pageX}px`;
      tooltip.style.top = `${e.pageY}px`;
      tooltip.style.display = "block";

      // Trigger celebration on the final stage
      if (index === stages.length - 1) {
        triggerCelebration(containerId, particleSettings);
      }
    });

    path.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    yOffset += stageHeight;
  });

  container.appendChild(svg);

  // Animation to display funnel stages sequentially
  animateFunnelStages(stages.length, svg);
};

const animateFunnelStages = (totalStages: number, svg: SVGElement) => {
  let delay = 0;
  const paths = svg.querySelectorAll("rect");

  paths.forEach((path, index) => {
    path.style.opacity = "0";
    path.style.transition = `opacity 1s ease-in-out ${delay}s`;

    setTimeout(() => {
      path.style.opacity = "1";
    }, delay * 1000);

    delay += 0.5; // Sequential animation delay for each stage
  });
};

export const triggerCelebration = (
  containerId: string,
  settings?: { color?: string; number?: number; duration?: number }
) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { color = "#44bb44", number = 50, duration = 3000 } = settings || {};

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
