

export default function ViewTemplates() {
  // const titles=["","Simpler & Structured","Linear & Classic","Colourful & Attractive","Colourful & Highly Designed","Simpler & Linear","Highly Simpler & Classic"]
  const titles = ["",
    "Default Classic",
    "Simpler & Structured",
    "Linear & Classic",
    "Colourful & Attractive",
    "Colourful & Highly Designed",
    "Simpler & Linear",
    "Highly Simpler & Classic",
    "Elegant Modern Touch",
    "Creative Blocks",
    "Minimalist Professional",
    "Tech-Focused Resume",
    "Bold & Visual Design"
  ];

  const items = [
    {
      img: "/Temp/cv1.webp",
      title: titles[1],
      codeLink: "https://github.com/PrashantPKP/cv-templates/blob/main/cv1.html"
    },
    {
      img: "/Temp/cv2.webp",
      title: titles[2],
      codeLink: "https://github.com/PrashantPKP/cv-templates/blob/main/cv2.html"
    },
    {
      img: "/Temp/cv3.webp",
      title: titles[3],
      codeLink: "https://github.com/PrashantPKP/cv-templates/blob/main/cv3.html"
    },
    {
      img: "/Temp/cv4.webp",
      title: titles[4],
      codeLink: "https://github.com/PrashantPKP/cv-templates/blob/main/cv4.html"
    },
    {
      img: "/Temp/cv5.webp",
      title: titles[5],
      codeLink: "https://github.com/PrashantPKP/cv-templates/blob/main/cv5.html"
    },

    {
      img: "/Temp/cv6.webp",
      title: titles[6],
      codeLink: "https://github.com/PrashantPKP/cv-templates/blob/main/cv6.html"
    },

  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
      <h3 className="mt-10 mb-2 text-3xl text-gray-600 dark:text-slate-200 font-bold">Generated Templates</h3>
      <h5 className="mb-4 text-sm md:text-base font-semibold text-gray-500">Note: Consider to View Templates only on desktop mode</h5>
      <div className="w-[200px] h-1 bg-blue-700 mb-16 mx-auto mt-1 rounded dark:bg-blue-500"></div>

      {/* Change grid-cols-1 to grid-cols-2 for mobile */}
      <div className="grid grid-cols-2 gap-14 sm:grid-cols-2 md:grid-cols-2 max-w-5xl mx-auto place-items-center">
        {items.map((item, index) => (
          <div key={index} className="group relative mb-6 bg-white dark:bg-slate-700 hover:shadow-2xl hover:scale-105 transition-transform duration-[250ms] border-2 dark:shadow-[0_-4px_10px_rgba(0,0,0,0.1)]  border-gray-300 dark:border-gray-700 dark:shadow-gray-800 dark:hover:shadow-gray-600/50 rounded-lg overflow-hidden w-40 sm:w-44 md:w-48 lg:w-64 xl:w-72 flex flex-col items-center">
            {/* Adjust image size */}
            <img src={item.img} alt={item.title} className="w-full h-auto object-cover dark:opacity-80 dark:brightness-80 dark:contrast-90" />
            <div className="font-semibold text-gray-600 dark:text-gray-200 text-xs pb-2 pt-1 md:text-base"> {item.title} </div>
          </div>
        ))}
      </div>
    </div>

  );
}