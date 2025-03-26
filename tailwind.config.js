const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.{js,ts}", // Ensure Flowbite files are included
  ],
  safelist: [
    {
      pattern: /^datatable-.*$/, // ensure it matches dynamic classes
    },
  ],
  theme: {
    extend: {
      backgroundImage: {
        login: "url('/assets/bgImages/bgLogin.png')",
        customGradient: "linear-gradient(180deg, #FFFFFF 57.5%, #575656 97.5%)",
        "custom-green-gradient":
          "linear-gradient(360deg, #228512 27%, #24A652 58.5%)",
      },

      maxWidth: {
        layout: "1226px",
      },
      maxWidth: {
        layout: "1226px",
      },
      colors: {
        whitePara: "#E3E3E3",
        darkPara: "#3F3F3F",
      },
      fontFamily: {
        nunitoSans: "Nunito Sans",
      },
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
    // ... other plugins
  ],
});
