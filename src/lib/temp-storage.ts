// Temporary storage for settings while Settings table doesn't exist
let tempGlobalScale = 1.0;

export const getTempGlobalScale = () => tempGlobalScale;
export const setTempGlobalScale = (value: number) => { tempGlobalScale = value; };