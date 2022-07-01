import { ref, watch } from "vue";

import { useRoute } from "vue-router";
const route = useRoute();
/** Check if the page opened in iframe */
const isInIframe = window.location !== window.parent.location;

const debugMode = ref(false);
// const debugMode = ref(true); // For testing

const prettyResExpandAll = ref(false);

const initPrettyResExpandAll = () => {
  prettyResExpandAll.value = false;
};

window.addEventListener("keypress", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key == "D") {
    debugMode.value = !debugMode.value;
    // TODO notification debug mode is activated
  }
});

export { isInIframe, prettyResExpandAll, initPrettyResExpandAll, debugMode };
