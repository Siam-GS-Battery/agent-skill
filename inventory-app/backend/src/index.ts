import { buildApp } from "./app.js";
import { ENV } from "./env.js";

buildApp().listen(ENV.PORT, () => {
  console.log(`Inventory API on http://localhost:${ENV.PORT}`);
});
