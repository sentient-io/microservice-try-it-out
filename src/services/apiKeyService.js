import { ref, computed } from "vue";

const apiKeyRef = ref();
const apiKey = computed(() => apiKeyRef.value);

const setApiKey = (key) => {
  apiKeyRef.value = key;
};

export { apiKey, setApiKey };
