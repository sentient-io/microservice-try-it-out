import { computed, ref, watch } from "vue";

import { endpoint } from "src/services/tryItOutService";

const overriddenEndpointRef = ref("");

const debugState = {
  overriddenEndpoint: computed(() => overriddenEndpointRef.value),
};

const debugService = () => {
  const overrideEndpoint = (newEndpoint) => {
    // console.log("overrideEndpoint", newEndpoint);
    overriddenEndpointRef.value = newEndpoint;
  };

  return {
    overrideEndpoint,
  };
};

export { debugState, debugService };
