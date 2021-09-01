/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

/**
 * This service file provide some format conver services, becuase
 * there may be different types of input,the desired value should
 * always be consistent.
 * */

const formatterService = () => {
  function anythingToString(anything) {
    if (typeof anything === 'object') {
      return JSON.stringify(anything);
    }
    return anything.toString();
  }

  return { anythingToString };
};

export { formatterService };
