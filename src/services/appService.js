import { ref } from "vue";

/** Check if the page opened in iframe */
const isInIframe = window.location !== window.parent.location;

const prettyResExpandAll = ref(false);

export { isInIframe, prettyResExpandAll };
