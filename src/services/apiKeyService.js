import { ref } from "vue";

const apiKey = ref();

const setApiKey = (key) => {
  apiKey.value = key;
};

export { apiKey, setApiKey };
