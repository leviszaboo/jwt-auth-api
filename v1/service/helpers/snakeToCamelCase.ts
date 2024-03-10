export const snakeToCamelCase = (input: any): any => {
  if (input === null || typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(snakeToCamelCase);
  }

  const camelCaseObject: any = {};

  for (const key in input) {
    const newKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );
    camelCaseObject[newKey] = snakeToCamelCase(input[key]);
  }

  return camelCaseObject;
};
