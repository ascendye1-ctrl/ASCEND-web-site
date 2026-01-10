export const initializeChat = (data: any) => console.log("AI Init with products");
export const generateProductDescription = async (name: string, cat: string) => {
    return `وصف مولد بواسطة الذكاء الاصطناعي لمنتج ${name} من فئة ${cat}`;
};