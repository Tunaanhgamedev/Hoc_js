// import { DOMAdapter, WebWorkerAdapter } from "pixi.js";

// // Must be set before creating anything in PixiJS
// DOMAdapter.set(WebWorkerAdapter);

// const app = new Application();

// await app.init({
//   width: 800,
//   height: 600,
// });

// app.canvas; // OffscreenCanvas
import { DOMAdapter } from "pixi.js";

const CustomAdapter = {
  createCanvas: (width, height) => {
    /* custom implementation */
  },
  getCanvasRenderingContext2D: () => {
    /* custom implementation */
  },
  getWebGLRenderingContext: () => {
    /* custom implementation */
  },
  getNavigator: () => ({ userAgent: "Custom", gpu: null }),
  getBaseUrl: () => "custom://",
  fetch: async (url, options) => {
    /* custom fetch */
  },
  parseXML: (xml) => {
    /* custom XML parser */
  },
};

DOMAdapter.set(CustomAdapter);
