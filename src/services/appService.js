import { ref, watch } from "vue";

import { useRoute } from "vue-router";
const route = useRoute();
/** Check if the page opened in iframe */
const isInIframe = window.location !== window.parent.location;

const debugMode = ref(false);
// const debugMode = ref(true); // For testing

// Debug model will be enabled only when below value is true
const listenToDebugMode = ref(false);

const prettyResExpandAll = ref(false);

const initPrettyResExpandAll = () => {
  prettyResExpandAll.value = false;
};

window.addEventListener("keydown", (e) => {
  // console.log(e);
  if (e.shiftKey && e.key == "D") {
    // debugMode.value = !debugMode.value;
    listenToDebugMode.value = true;
    // TODO notification debug mode is activated
  }

  if (e.key == "E" && listenToDebugMode.value) {
    debugMode.value = !debugMode.value;
  }
});

window.addEventListener("keyup", (e) => {
  if (listenToDebugMode.value) {
    listenToDebugMode.value = false;
  }
});

export { isInIframe, prettyResExpandAll, initPrettyResExpandAll, debugMode };
