import { KeysToCamelCase } from "../../types/types";

export const snakeToCamelCase = <T>(input: T): KeysToCamelCase<T> => {
  const camelCaseObject = {} as KeysToCamelCase<T>;

  for (const key in input) {
    const newKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    ) as keyof KeysToCamelCase<T>;

    const value = input[key];

    camelCaseObject[newKey] =
      value !== null && typeof value === "object"
        ? snakeToCamelCase(value)
        : (value as any);
  }

  return camelCaseObject;
};
