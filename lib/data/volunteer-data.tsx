import React from "react";

export const volunteerCards = [
  {
    id: 1,
    content: (
      <div>
        <p className="font-bold text-xl text-white underline">Beach Cleanups</p>
        <p className="font-normal text-base text-white mt-4">
          Join our weekly beach cleanup drives to protect marine life.
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=2560&auto=format&fit=crop",
  },
  {
    id: 2,
    content: (
      <div>
        <p className="font-bold text-xl text-white underline">Tree Planting</p>
        <p className="font-normal text-base text-white mt-4">
          Help us restore local forests and improve air quality.
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2560&auto=format&fit=crop",
  },
  {
    id: 3,
    content: (
      <div>
        <p className="font-bold text-xl text-white underline">Plogging</p>
        <p className="font-normal text-base text-white mt-4">
          Combine fitness with environmental care by picking up litter while jogging.
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
  },
  {
    id: 4,
    content: (
      <div>
        <p className="font-bold text-xl text-white underline">Urban Gardening</p>
        <p className="font-normal text-base text-white mt-4">
          Teach city dwellers how to grow their own sustainable food.
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1592150621344-828ec1830ade?q=80&w=2560&auto=format&fit=crop",
  },
];
