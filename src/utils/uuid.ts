
export const generateUniqueId = (prefix: string = "user") => {
    return `amt-${prefix}-${crypto.randomUUID().slice(10)}`;
};