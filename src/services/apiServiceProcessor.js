import { deepCopy } from "./utils";

const processReqBdy = (originalReqBdy) => {
  // console.log("Deep copy request body value to make it reactive");
  /**
   * This is additional process to make request body's structure
   * easier for user to try it out.  Some data modification will
   * happened here, and may cause potential bug.
   *
   * To debug,go to apiService.js _setRequestBody() function and
   * follow the debugging instruction.
   */
  const deepCopiedReqBdy = deepCopy(originalReqBdy);
  const processedReqBdy = deepCopiedReqBdy;

  // This process used a lot of hard coded keys, a bit dangerous
  try {
    const content = processedReqBdy["content"];
    const contentTypes = Object.keys(content);
    contentTypes.forEach((contentType) => {
      const schema = content[contentType]["schema"];
      const propertiesObj = schema["properties"];
      const properties = Object.keys(propertiesObj);

      properties.forEach((propKey) => {
        const property = propertiesObj[propKey];
        const nestedProps = property?.["properties"] || null;

        if (property?.["format"] == "binary") {
          // console.log("detected binary input");
          /**
           * !! Critical !!
           * Forced binary type's example as empty file  to prevent
           * a vue warning in console. Because the original example
           * of a binary file can only be a string, and vue doesn't
           * allow that. So I have created an empty file object and
           * set the name as the example string value.
           *
           * It is ok to completely disable this line if necessary.
           */
          property["example"] = new File([""], property?.["example"]);

          // !! Critical !!
          /**
           * Below rule should never be triggered again.  This may
           * cause future error, once all errors are corrected  in
           * the documentation, update this rule to pure warning.
           */
          if (propKey == "file_name") {
            console.error(
              "Input fileds key 'file_type' been documented as binary file, supposed to be a string. Try It Out will automatically correct it, but please fix this on the yaml file."
            );
            delete property["format"];
            property["example"] = "";
          }
        }

        // If no nested property, do nothing
        if (!nestedProps) return;
        if (!property?.["example"]) {
          // If no example, generate example
          property["example"] = _flatNestedReqBdyPropExample(nestedProps);
        }

        if (!property?.["description"]) {
          // If no description, generate description
          property["description"] = _flatNestedReqBdyPropDescr(
            nestedProps,
            propKey + "."
          );
        }
        // _flatNestedReqBdyProps(property);
      });
    });
  } catch (err) {
    console.error(err);
  }

  // console.log(deepCopiedReqBdy);

  return processedReqBdy;
};

const _flatNestedReqBdyPropExample = (props) => {
  /**
   * Quite complex recursive logic. This function will check if
   * there is any nested properties element,if there is,trigger
   * a recursive loop to find the nested examples of all nested
   * properties. Then return a complete example object contains
   * all the child examples.
   */
  // If property is not an object. But this shouldn't happen
  if (typeof props !== "object") {
    console.warn(
      `property ${props} is not an object. Documentation structure may contains error. Please review.`
    );
    return;
  }
  const example = {};
  // console.log("props\n", typeof props);
  for (let [k, v] of Object.entries(props)) {
    if (v?.["properties"]) {
      // Has nested property, trigger recursive loop
      example[k] = _flatNestedReqBdyPropExample(v["properties"]);
    } else {
      // No more nested props, assign example
      example[k] = v?.["example"] ?? null;
    }
  }
  return example;
};

const _flatNestedReqBdyPropDescr = (props, parentKey = "") => {
  // If property is not an object. But this shouldn't happen
  if (typeof props !== "object") return;

  let description = "";
  // console.log("props\n", typeof props);
  for (let [k, v] of Object.entries(props)) {
    if (v?.["properties"]) {
      // Has nested property, trigger recursive loop
      description += _flatNestedReqBdyPropDescr(v["properties"], k + ".");
    } else {
      // No more nested props, assign example
      if (v?.["description"]) {
        description += `**${parentKey}${k}** : ${v["description"]}\n\n  `;
      }
    }
  }
  return description;
};

const _flatNestedReqBdyProps = (props) => {
  if (!props["example"]) {
  }

  if (!props["description"]) {
    // If no description, generate description
  }
};

export { processReqBdy };
