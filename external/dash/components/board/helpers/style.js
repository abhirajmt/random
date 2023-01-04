/* eslint-disable */
const getLaneClassesByColspan = colspan => {
  switch (colspan) {
    case 1:
      return "col-span-5";
    case 2:
      return "col-span-9";
    case 3:
      return "col-span-13";
    case 4:
      return "col-span-18";
    default:
      return "col-span-5";
  }
};

export { getLaneClassesByColspan };
