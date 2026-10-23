// Placeholder until a real check exists: splits works by the last hex digit of their ID
export const isWorkSellable = (internalID: string) => parseInt(internalID.slice(-1), 16) % 2 === 0
