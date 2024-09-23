/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "custom" : "url('/gambar/Rectangle.png')"
      },
      gridTemplateColumns: {
        mincontent: "repeat(9, minmax(min-content, 1fr))",
        repeat3: "repeat(3, min-content)",
        repeat2: "repeat(2, min-content)",  
      },
      fontFamily: {
        poppin: "Poppins",
        suse: "Italianno",
        robot: "Roboto",
      },
      colors: {
        primary: {
          10: "rgba(179, 220, 244, 1)",
          30: "rgba(77, 173, 229, 1)",
          50: "rgba(0, 138, 218, 1)",
          70: "rgba(0, 110, 174, 1)",
          90: "rgba(0, 83, 131, 1)",
        },
        secondary: {
          10: "rgba(188, 225, 230, 1)",
          30: "rgba(122, 194, 205, 1)",
          50: "rgba(33, 154, 171, 1)",
          70: "rgba(23, 108, 120, 1)",
          90: "rgba(17, 77, 86, 1)",
        },
        neutral: {
          10: "rgba(236, 236, 236, 1)",
          30: "rgba(198, 198, 198, 1)",
          50: "rgba(160, 160, 160, 1)",
          70: "rgba(102, 102, 102, 1)",
          80: "rgba(64, 64, 64, 0.45)",
          90: "rgba(64, 64, 64, 1)",
        },
        succes: {
          10: "rgba(151, 230, 184, 1)",
          30: "rgba(109, 219, 156, 1)",
          50: "rgba(41, 184, 102, 1)",
          70: "rgba(32, 143, 79, 1)",
          90: "rgba(22, 100, 55, 1)",
        },
        warning: {
          10: "rgba(255, 240, 219, 1)",
          30: "rgba(255, 220, 169, 1)",
          50: "rgba(255, 199, 117, 1)",
          70: "rgba(255, 178, 66, 1)",
          90: "rgba(255, 157, 15, 1)",
        },
        error: {
          10: "rgba(241, 179, 179, 1)",
          30: "rgba(232, 128, 128, 1)",
          50: "rgba(223, 77, 77, 1)",
          70: "rgba(188, 0, 0, 1)",
          90: "rgba(146, 0, 0, 1)",
        },
      },
      boxShadow: {
        sm: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        bs: "0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
        md: "0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0px 10px 10px -5px rgba(0, 0, 0, 0.04), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)",
        xxl: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        card: "0px 0px 8px 0px rgba(0, 0, 0, 0.1), 0px 0px 8px 0px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
