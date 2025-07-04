// Define colors for each letter A-Z
export const categoryColors = {
    A: "#FF6B6B", B: "#4ECDC4", C: "#FFD166", D: "#06D6A0", E: "#118AB2", 
    F: "#073B4C", G: "#8338EC", H: "#3A86FF", I: "#FB5607", J: "#FFBE0B",
    K: "#FF006E", L: "#8AC926", M: "#FFCC00", N: "#9B5DE5", O: "#F15BB5", 
    P: "#00BBF9", Q: "#00F5D4", R: "#EF476F", S: "#FCA311", T: "#14213D",
    U: "#E76F51", V: "#2A9D8F", W: "#E07A5F", X: "#81B29A", Y: "#F3D5B5", 
    Z: "#D62828"
};

// Function to get color based on first letter
export const getCategoryColor = (category) => {
    if (!category || typeof category !== 'string') {
        return "#CCCCCC"; // Default color for null, undefined or non-string values
    }
    const firstLetter = category.charAt(0).toUpperCase();
    return categoryColors[firstLetter] || "#CCCCCC";
};
