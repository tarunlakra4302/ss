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
    thumbnail: "/images/volunteer/General volunteer.jpeg",
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
    thumbnail: "/gallery/3.jpeg",
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
    thumbnail: "/gallery/1.jpeg",
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
    thumbnail: "/images/events/Edible Gardening workshop by Muthukaran_10 May.jpg",
  },
];
