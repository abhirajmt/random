const getGridTemplateColumns = (min, max) => {
  const gridTemplateColumnMap = {};
  for (let itr = min; itr <= max; itr += 1) {
    gridTemplateColumnMap[itr] = `repeat(${itr}, minmax(0, 1fr))`;
  }
  return gridTemplateColumnMap;
};

const getGridColumn = (min, max) => {
  const gridColumnMap = {};
  for (let itr = min; itr <= max; itr += 1) {
    gridColumnMap[`span-${itr}`] = `span ${itr} / span ${itr}`;
  }
  return gridColumnMap;
};

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Open Sans", "sans-serif"],
    },
    colors: {
      porcelain: `#f5f6f7`,
      white: `#ffffff`,
      indigo: `#4d7cc7`,
      shark: `#2a2e36`,
      grey: `#888888`,
      darkOuterSpace: `#606369`,
      outerSpace: `#989CA6`,
      pearl: `#e8eaed`,
      alto: "#dddddd",
      colorf9: "#f9f9f9",
    },
    spacing: {
      auto: "auto",
      "0": "0",
      "1": "2px",
      "2": "4px",
      "3": "6px",
      "4": "8px",
      "5": "10px",
      "6": "12px",
      "7": "14px",
      "8": "16px",
      "9": "18px",
      "10": "20px",
      "11": "22px",
      "12": "24px",
      "13": "26px",
      "14": "28px",
      "15": "30px",
      "16": "32px",
      "23": "46px",
      "24": "48px",
    },
    fontSize: {
      xxs: "11px",
      xs: "12px",
      sm: "13px",
      md: "14px",
      lg: "16px",
      xl: "20px",
      xxl: "24px",
      mobile: "15px",
    },
    fontWeight: {
      normal: 400,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      "16": "16px",
      "20": "20px",
      "22": "22px",
      "24": "24px",
      "28": "28px",
      "30": "30px",
      "32": "32px",
    },
    borderWidth: {
      default: "1px",
      "0": "0",
      "1": "1px",
      "2": "2px",
    },
    borderRadius: {
      default: "8px",
      none: "0",
      sm: "2px",
      md: "4px",
      lg: "8px",
      full: "999px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    boxShadow: {
      default: "0 2px 4px 0 rgba(0,0,0,0.08)",
      none: "none",
    },
    zIndex: {
      "0": 0,
      "10": 10,
      auto: "auto",
    },
    extend: {
      height: {
        "114": "114px",
      },
      gridTemplateColumns: getGridTemplateColumns(1, 24),
      gridColumn: getGridColumn(1, 24),
    },
  },
  variants: {
    borderWidth: ["responsive", "last", "hover", "focus"],
  },
  plugins: [],
}
