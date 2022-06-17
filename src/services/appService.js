import { ref } from "vue";

/** Check if the page opened in iframe */
const isInIframe = window.location !== window.parent.location;

const prettyResExpandAll = ref(false);

const initPrettyResExpandAll = ()=>{
	prettyResExpandAll.value = false
}

export { isInIframe, prettyResExpandAll , initPrettyResExpandAll};
