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

  const fmtReqBodyFromInputProps = (InputProps) => {
    if (!InputProps) return {};
    
    const reqBodyObj = {};
    Object.keys(InputProps).forEach((key) => {
      reqBodyObj[key] = InputProps[key].example;
    });
    const reqBodyStr = JSON.stringify(reqBodyObj);
    return reqBodyStr;
  };

  return { anythingToString, fmtReqBodyFromInputProps };
};

export { formatterService };
