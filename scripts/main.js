import Ball from "./classes/ball.js";
import Cell from "./classes/cell.js";
import { createElement } from "./assets/utils.js";

const stats = document.querySelector(".stats");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const config = {
  size: 0.68,

  speed: null,
  bounds: null,

  cellCount: 28,
  cellSize: null,

  ballSize: null,

  types: ["denmark", "finland", "norway", "sweden"],

  elems: {
    denmark: null,
    finland: null,
    norway: null,
    sweden: null,
  },

  ballColors: {
    finland: "#FFFFFF",
    norway: "#BA0C2F",
    sweden: "#006AA7",
    denmark: "#C8102E",
  },

  colors: {
    finland: "#002F6C",
    norway: "#00205B",
    sweden: "#FECC02",
    denmark: "#FFFFFF",
  },
};

let balls = [];
const cells = [];

function init() {
  // Set a maximum size for the canvas
  const maxSize = 680; // You can adjust this value
  const windowSize = Math.min(window.innerWidth, window.innerHeight, maxSize);

  config.cellSize = Math.trunc((windowSize * config.size) / config.cellCount);
  config.ballSize = config.cellSize / 2;

  canvas.width = config.cellCount * config.cellSize;
  canvas.height = canvas.width; // Keep the square aspect ratio

  stats.style.width = `${canvas.width}px`;

  config.speed = canvas.width / 40;

  config.bounds = {
    left: 0,
    top: 0,
    right: canvas.width,
    bottom: canvas.height,
  };

  balls.push(
    new Ball({
      x: canvas.height / 4,
      y: canvas.height / 4,
      size: config.ballSize,
      color: config.ballColors.denmark,
      cellColor: config.colors.denmark,
      type: "denmark",
      speed: config.speed,
    }),
    new Ball({
      x: canvas.height / 4,
      y: (canvas.height / 4) * 3,
      size: config.ballSize,
      type: "norway",
      color: config.ballColors.norway, // Red color for Norway's flag
      cellColor: config.colors.norway, // Blue color for the cross
      bColor: "#FFFFFF", // White color for the border
      borderColor: "#00205B",
      speed: config.speed,
    }),
    new Ball({
      x: (canvas.height / 4) * 3,
      y: canvas.height / 4,
      size: config.ballSize,
      color: config.ballColors.finland,
      cellColor: config.colors.finland,
      type: "finland",
      speed: config.speed,
    }),
    new Ball({
      x: (canvas.height / 4) * 3,
      y: (canvas.height / 4) * 3,
      size: config.ballSize,
      color: config.ballColors.sweden,
      cellColor: config.colors.sweden,
      type: "sweden",
      speed: config.speed,
    })
  );

  for (let j = 0; j < config.cellCount; j++) {
    for (let i = 0; i < config.cellCount; i++) {
      let type = "";
      if (i < config.cellCount / 2) {
        if (j < config.cellCount / 2) {
          type = "denmark";
        } else {
          type = "norway";
        }
      } else {
        if (j < config.cellCount / 2) {
          type = "finland";
        } else {
          type = "sweden";
        }
      }
      const color = config.colors[type];

      cells.push(
        new Cell({
          x: i * config.cellSize,
          y: j * config.cellSize,
          size: config.cellSize,
          color,
          type,
        })
      );
    }
  }

  for (const type of config.types) {
    let emoji;

    // Define emojis for each type
    switch (type) {
      case "denmark":
        emoji = "🇩🇰"; // Emoji for Denmark
        break;
      case "finland":
        emoji = "🇫🇮"; // Emoji for Finland
        break;
      case "norway":
        emoji = "🇳🇴"; // Emoji for Norway
        break;
      case "sweden":
        emoji = "🇸🇪"; // Emoji for Sweden
        break;
      // Add more cases as needed for other types
      default:
        emoji = ""; // Default emoji or leave it empty
    }

    const elem = createElement(`<div class='stat ${type}'>
            <span class='emoji'>${emoji}</span>
            <span class='name'>${type}:</span>
            <span class='count'></span>
        </div>`);

    config.elems[type] = elem;
    stats.appendChild(elem);
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let counts = config.types.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  for (const cell of cells) {
    cell.draw(ctx);

    counts[cell.type] += 1;
  }

  for (const type of config.types) {
    if (counts[type] === 0) {
      balls = balls.filter((ball) => ball.type !== type);
    }

    config.elems[type].children[2].textContent = counts[type];
  }

  for (const ball of balls) {
    ball.draw(ctx);
  }
}

let animation = null;
function animate() {
  for (const ball of balls) {
    ball.move(config.bounds);
    ball.collide(config.bounds, cells);
  }

  draw();

  animation = requestAnimationFrame(animate);
}

canvas.addEventListener("click", () => {
  if (animation === null) {
    animate();
  } else {
    cancelAnimationFrame(animation);
    animation = null;
  }
});

init();

setTimeout(() => {
  animate();
}, 500);
