export interface DirectoryItem {
  id: string;
  name: string;
  category: 'PRODUCT' | 'BOOK' | 'SERVICE' | 'EVENT';
  description: string;
  url: string;
  location?: string;
  tags?: string[];
}

export const directoryData: DirectoryItem[] = [
  {
    "id": "1",
    "name": "Superbottoms",
    "category": "PRODUCT",
    "description": "Sustainable diapers brand",
    "url": "https://superbottoms.com/",
    "location": "Bangalore"
  },
  {
    "id": "2",
    "name": "Biography",
    "category": "BOOK",
    "description": "Almitra Pate: Waste Warrior by Dr. Sharad Kale",
    "url": "#",
    "location": "Bangalore"
  },
  {
    "id": "3",
    "name": "CARE: Charlie's Animal Rescue",
    "category": "SERVICE",
    "description": "Provides care to stray animals",
    "url": "#",
    "location": "Bangalore"
  },
  {
    "id": "4",
    "name": "Coconut Jayanagar",
    "category": "PRODUCT",
    "description": "Possibly takes old utensils",
    "url": "www.mycoconutworld.com",
    "location": "Bangalore"
  },
  {
    "id": "5",
    "name": "CUPA",
    "category": "SERVICE",
    "description": "animal care",
    "url": "#",
    "location": "Bangalore"
  },
  {
    "id": "6",
    "name": "Ecobharat",
    "category": "PRODUCT",
    "description": "Sustainable packaging bags",
    "url": "https://ecobharat.life/products.php",
    "location": "Bangalore"
  },
  {
    "id": "7",
    "name": "Arani Ecosteps",
    "category": "PRODUCT",
    "description": "sustainable cleaning material/essentials material",
    "url": "https://aranieco.com/",
    "location": "Bangalore"
  },
  {
    "id": "8",
    "name": "iNaturalist",
    "category": "SERVICE",
    "description": "Observe plants and animals",
    "url": "https://www.inaturalist.org/",
    "location": "Bangalore"
  },
  {
    "id": "9",
    "name": "SeasonWatch",
    "category": "SERVICE",
    "description": "Observes how seasons change with climate change",
    "url": "https://www.seasonwatch.in/",
    "location": "Bangalore"
  },
  {
    "id": "10",
    "name": "EcoEvents",
    "category": "SERVICE",
    "description": "Collects green events in Bangalore",
    "url": "https://whatsapp.com/channel/0029Va5rmSp0VycJkEwQHQ2n",
    "location": "Bangalore"
  },
  {
    "id": "11",
    "name": "Sahaja Organics",
    "category": "PRODUCT",
    "description": "Organic food",
    "url": "https://www.sahajaorganics.com/",
    "location": "Bangalore"
  },
  {
    "id": "12",
    "name": "Farmfreshbangalore ",
    "category": "PRODUCT",
    "description": "Organic food",
    "url": "https://farmfreshbangalore.com/",
    "location": "Bangalore"
  },
  {
    "id": "13",
    "name": "Navadarshanam",
    "category": "PRODUCT",
    "description": "Organic food",
    "url": "https://navadarshanam.org/?",
    "location": "Bangalore"
  },
  {
    "id": "14",
    "name": "Adah By Leesha",
    "category": "PRODUCT",
    "description": "sustainable clothing",
    "url": "https://adahbyleesha.com/",
    "location": "Bangalore"
  },
  {
    "id": "15",
    "name": "Lukka Chuppi",
    "category": "PRODUCT",
    "description": "Jewelry",
    "url": "https://lukkachuppi.com/",
    "location": "Bangalore"
  },
  {
    "id": "16",
    "name": "Shades of Earth",
    "category": "PRODUCT",
    "description": "sustainable clothing",
    "url": "https://www.instagram.com/shadesofearthofficial/?hl=en",
    "location": "Bangalore"
  },
  {
    "id": "17",
    "name": "Green FootPrint",
    "category": "PRODUCT",
    "description": "Everyday products",
    "url": "https://www.instagram.com/greenfootprintshop/?hl=en",
    "location": "Bangalore"
  },
  {
    "id": "18",
    "name": "Enviu",
    "category": "PRODUCT",
    "description": "waste recycling business",
    "url": "https://enviu.org/",
    "location": "Bangalore"
  },
  {
    "id": "19",
    "name": "Biome Solutions",
    "category": "SERVICE",
    "description": "spatial interventions",
    "url": "https://www.biome-solutions.com/",
    "location": "Bangalore"
  },
  {
    "id": "20",
    "name": "Febinora Events",
    "category": "SERVICE",
    "description": "for sustainable weddings",
    "url": "https://www.instagram.com/febinoraevents/",
    "location": "Bangalore"
  },
  {
    "id": "21",
    "name": "Environmentalist Foundation of India",
    "category": "SERVICE",
    "description": "Wildlife conservation and habilat restoration group. They also do clean up drives and also host quizzes. (Contact: https://www.instagram.com/p/DCcH4_GT2Vh/?img_index=2&igsh=Zm1lbndpb29hbnc%3D)",
    "url": "https://indiaenvironment.org/",
    "location": "Bangalore"
  },
  {
    "id": "22",
    "name": "ALTEFF",
    "category": "SERVICE",
    "description": "All Living Things Environmental Film Festival",
    "url": "#",
    "location": "Bangalore"
  },
  {
    "id": "23",
    "name": "Earth Conscious Life",
    "category": "PRODUCT",
    "description": "newsletter and shop, resource bank",
    "url": "https://earthconsciouslife.org/c/about",
    "location": "Bangalore"
  },
  {
    "id": "24",
    "name": "Rescript",
    "category": "PRODUCT",
    "description": "Recycled stationery from recycled paper",
    "url": "https://www.rescript.in/",
    "location": "Bangalore"
  },
  {
    "id": "25",
    "name": "https://www.instagram.com/sampoornaahara?igsh=NTU1Ym9jam1kNW5j",
    "category": "PRODUCT",
    "description": "Sustainable food (Contact: https://www.instagram.com/sampoornaahara?igsh=NTU1Ym9jam1kNW5j)",
    "url": "https://sampoornaahara.com/",
    "location": "Bangalore"
  },
  {
    "id": "26",
    "name": "Swisspack",
    "category": "PRODUCT",
    "description": "Packaging material",
    "url": "https://www.swisspack.co.in/materials/",
    "location": "Bangalore"
  },
  {
    "id": "27",
    "name": "Green Summit",
    "category": "EVENT",
    "description": "Brings together people to fight climate change. There are multiple summits that are organised in different states.",
    "url": "https://www.humanitarianaffairs.org/TheGreenSummit/Overview/",
    "location": "Bangalore"
  },
  {
    "id": "28",
    "name": "Wheedle Re-Earth Tech Pvt Ltd",
    "category": "PRODUCT",
    "description": "Platform to buy, sell or donate preloved products for babies and kids (Contact: 7760605631)",
    "url": "https://www.gowheedle.com/",
    "location": "Bangalore"
  },
  {
    "id": "29",
    "name": "ecoSansar",
    "category": "SERVICE",
    "description": "A Community Tool that aims to do a ground zero intervention that connects the consumer with the system via the local workforce to create a resilient, scalable, inclusive, and a strong backbone for the Circular Economy",
    "url": "https://ecosansar.com/",
    "location": "Bangalore"
  },
  {
    "id": "30",
    "name": "Praacheen VIdhaan",
    "category": "PRODUCT",
    "description": "Daily living sustainable products",
    "url": "https://www.praacheenvidhaan.com/",
    "location": "Bangalore"
  },
  {
    "id": "31",
    "name": "Saahas Zero Waste",
    "category": "SERVICE",
    "description": "Waste management service",
    "url": "https://saahaszerowaste.com/",
    "location": "Bangalore"
  },
  {
    "id": "32",
    "name": "Saahas Textile Recovery Facility",
    "category": "SERVICE",
    "description": "Contact: Every Saturday, they do SWAP events",
    "url": "https://g.co/kgs/xnB8ebM",
    "location": "Bangalore"
  },
  {
    "id": "33",
    "name": "SwachaGraha Green Spot",
    "category": "SERVICE",
    "description": "Waste management service",
    "url": "https://www.swachagraha.in/",
    "location": "Bangalore"
  },
  {
    "id": "34",
    "name": "2bin1bag",
    "category": "SERVICE",
    "description": "By SwachaGraha to segregate waste",
    "url": "https://www.2bin1bag.in/",
    "location": "Bangalore"
  },
  {
    "id": "35",
    "name": "Adrish",
    "category": "PRODUCT",
    "description": "Daily living sustainable products (Contact: https://g.co/kgs/itQzbS5)",
    "url": "https://www.adrish.co.in/",
    "location": "Bangalore"
  },
  {
    "id": "36",
    "name": "The Organic World",
    "category": "PRODUCT",
    "description": "Daily living sustainable products",
    "url": "http://theorganicworld.com/",
    "location": "Bangalore"
  },
  {
    "id": "37",
    "name": "Bubblenut Wash",
    "category": "PRODUCT",
    "description": "sustainable cleaning material/essentials material",
    "url": "https://bubblenutwash.com/",
    "location": "Bangalore"
  },
  {
    "id": "38",
    "name": "more details unable to find",
    "category": "PRODUCT",
    "description": "sustainable cleaning material/essentials material",
    "url": "https://www.refillable.store/",
    "location": "Bangalore"
  },
  {
    "id": "39",
    "name": "Samuhika Shakti",
    "category": "SERVICE",
    "description": "Recycling textile waste (Contact: https://www.youtube.com/watch?v=IaCE0MAOYCw)",
    "url": "https://www.saamuhikashakti.org/",
    "location": "Bangalore"
  },
  {
    "id": "40",
    "name": "Team Social Spotlight",
    "category": "SERVICE",
    "description": "volunteer run community dedicated to plantation and sustainability",
    "url": "https://www.instagram.com/teamsocialspotlight?igsh=aTBzNDZ3YXM1azEy",
    "location": "Bangalore"
  },
  {
    "id": "41",
    "name": "James Bond",
    "category": "SERVICE",
    "description": "Dry cleaners",
    "url": "https://jamesbonddrycleaners.com/",
    "location": "Bangalore"
  },
  {
    "id": "42",
    "name": "Greenlit",
    "category": "SERVICE",
    "description": "No description available",
    "url": "#",
    "location": "Bangalore"
  },
  {
    "id": "43",
    "name": "The Bartan Company",
    "category": "SERVICE",
    "description": "Eco-friendly event company",
    "url": "https://thebartancompany.com/",
    "location": "Bangalore"
  },
  {
    "id": "44",
    "name": "Rentelo",
    "category": "SERVICE",
    "description": "Rent 2 wheelers",
    "url": "https://www.rentelo.in/",
    "location": "Bangalore"
  },
  {
    "id": "45",
    "name": "Royal Brothers",
    "category": "SERVICE",
    "description": "Rent 2 wheelers",
    "url": "https://www.royalbrothers.com/bangalore/bike-rentals",
    "location": "Bangalore"
  },
  {
    "id": "46",
    "name": "Sarvam",
    "category": "SERVICE",
    "description": "holistic health and wellbeing organisation (Contact: Some say they sell products too, but couldn't locate it on the website)",
    "url": "https://sarvamwellness.in/",
    "location": "Bangalore"
  },
  {
    "id": "47",
    "name": "Third Planet Foundation",
    "category": "SERVICE",
    "description": "They provide CSR services (Contact: Ojus (9873218188) or Shruti (9908011588))",
    "url": "https://www.3planet.org/",
    "location": "Bangalore"
  },
  {
    "id": "48",
    "name": "Earth Recycler",
    "category": "SERVICE",
    "description": "Provides waste management services across wet, dry, and reject waste, in major cities (Contact: Rasia works there)",
    "url": "https://earthrecycler.com/",
    "location": "Bangalore"
  },
  {
    "id": "49",
    "name": "Ecocrew",
    "category": "PRODUCT",
    "description": "waste management through purchase of waste",
    "url": "https://www.ecocrew.in/",
    "location": "Bangalore"
  },
  {
    "id": "50",
    "name": "Reuse the bag",
    "category": "PRODUCT",
    "description": "sustainable living day to day products",
    "url": "https://www.instagram.com/reusethebag/reels/",
    "location": "Bangalore"
  },
  {
    "id": "51",
    "name": "Biotech India",
    "category": "PRODUCT",
    "description": "end to end biogas solution",
    "url": "https://www.biotech-india.org/index.aspx",
    "location": "Bangalore"
  },
  {
    "id": "52",
    "name": "Sarvodaya",
    "category": "SERVICE",
    "description": "Pet care",
    "url": "https://sarvodayavets.org/",
    "location": "Bangalore"
  },
  {
    "id": "53",
    "name": "Terrum",
    "category": "SERVICE",
    "description": "A community initiative for climate activists (Contact: We at Terrum are organizing a 'Support Circle for Social Org' on Jan 26th where orgs can pitch their idea and ask for specific support from the audience. Audiences are shortlisted people by Terrum who can volunteer/intern/freelance with the org.\r\n[31/12/24, 10:08:49 AM] Akshata Green Mic: Love this Renuka..i had been thinking of something like this for months..it would be soo great.)",
    "url": "https://terrum.in/",
    "location": "Bangalore"
  },
  {
    "id": "54",
    "name": "Sustera Foundation",
    "category": "SERVICE",
    "description": "fights climage change by collaborating with governments and organisations (Contact: Sustera Climate leadership program)",
    "url": "https://www.sustera.org/aboutsustera",
    "location": "Bangalore"
  },
  {
    "id": "55",
    "name": "EcoOrbit",
    "category": "PRODUCT",
    "description": "smart robots for waste segregation (Contact: https://www.linkedin.com/posts/ecoorbit-ai-solutions_wastemanagement-wastesorting-materialrecoveryfacility-activity-7279555386209136641-_k7Z?utm_source=share&utm_medium=member_desktop)",
    "url": "https://www.ecoorbitsolutions.com/",
    "location": "Bangalore"
  },
  {
    "id": "56",
    "name": "Swabhimaan",
    "category": "SERVICE",
    "description": "Works for the underprivileged in diverse areas in Bangalore, eg., food, education, health",
    "url": "https://www.swabhimaan.org/",
    "location": "Bangalore"
  },
  {
    "id": "57",
    "name": "Giventa",
    "category": "SERVICE",
    "description": "buy, sell, lend, borrow household items",
    "url": "https://www.giventa.in",
    "location": "Bangalore"
  },
  {
    "id": "58",
    "name": "Sumrux",
    "category": "SERVICE",
    "description": "buy, sell, lend, borrow household items",
    "url": "https://www.sumrux.com",
    "location": "Bangalore"
  },
  {
    "id": "59",
    "name": "Hope Welfare Trust",
    "category": "SERVICE",
    "description": "An NGO supporting rural Indian women",
    "url": "https://hopewelfaretrust.org.in/",
    "location": "Bangalore"
  },
  {
    "id": "60",
    "name": "Farm Fresh Bengaluru",
    "category": "PRODUCT",
    "description": "plastic free organic home delivery",
    "url": "Farmfreshbangalore.com",
    "location": "Bangalore"
  },
  {
    "id": "61",
    "name": "Healthy Buddha",
    "category": "PRODUCT",
    "description": "Organic farm produce (Contact: Has a customer care number, through which, possibly a custom order can be made)",
    "url": "https://healthybuddha.in/",
    "location": "Bangalore"
  },
  {
    "id": "62",
    "name": "Kaliyuga Oosai",
    "category": "SERVICE",
    "description": "converts waste into decor",
    "url": "https://www.instagram.com/kaliyuga_oosai/",
    "location": "Bangalore"
  },
  {
    "id": "63",
    "name": "Namma Ooru Foundation",
    "category": "SERVICE",
    "description": "An environment protection organisation in Chennai (Contact: Kavita is the contact person)",
    "url": "https://nammaooru.org/",
    "location": "Bangalore"
  },
  {
    "id": "64",
    "name": "Nilayaan Earth",
    "category": "PRODUCT",
    "description": "Environment conservation work (Contact: Deepesh is the contact person)",
    "url": "https://www.instagram.com/nilayaan.earth/",
    "location": "Bangalore"
  },
  {
    "id": "65",
    "name": "Beyond Next Ventures",
    "category": "SERVICE",
    "description": "Supports researchers working on entreprenership ",
    "url": "https://beyondnextventures.com/",
    "location": "Bangalore"
  },
  {
    "id": "66",
    "name": "Moonshots by Netzero Living",
    "category": "PRODUCT",
    "description": "Sustainable solid toothpaste company (Contact: https://forms.gle/Mfchh3FRhRaBHhqu7)",
    "url": "https://www.moonshots.co.in/",
    "location": "Bangalore"
  },
  {
    "id": "67",
    "name": "Saytrees",
    "category": "SERVICE",
    "description": "Environmental NGO focussing on afforestation, conservation, and clean energy",
    "url": "https://www.saytrees.org/",
    "location": "Bangalore"
  },
  {
    "id": "68",
    "name": "Coco custo",
    "category": "PRODUCT",
    "description": "Cleaning and detergent brand (Contact: Any place where coco custo boxes can be restocked?)",
    "url": "https://www.cococusto.com/collections/shop-all",
    "location": "Bangalore"
  },
  {
    "id": "69",
    "name": "Javi Naturals",
    "category": "PRODUCT",
    "description": "Cleaning and detergent brand",
    "url": "https://javiecocare.com/",
    "location": "Bangalore"
  },
  {
    "id": "70",
    "name": "reCharkha",
    "category": "PRODUCT",
    "description": "Upcycled plastic products",
    "url": "https://www.recharkha.org/",
    "location": "Bangalore"
  },
  {
    "id": "71",
    "name": "EcoKaari",
    "category": "PRODUCT",
    "description": "sustainable fashion",
    "url": "https://ecokaari.org/",
    "location": "Bangalore"
  },
  {
    "id": "72",
    "name": "Dabba Meals",
    "category": "PRODUCT",
    "description": "meal delivery service",
    "url": "https://dabbameals.in/",
    "location": "Bangalore"
  },
  {
    "id": "73",
    "name": "BAIF Development Research Foundation: Home",
    "category": "SERVICE",
    "description": "NGO working in agriculture- multiple projects",
    "url": "https://baif.org.in/baif-home/",
    "location": "Bangalore"
  },
  {
    "id": "74",
    "name": "R Buy Smart Refills",
    "category": "PRODUCT",
    "description": "refillable home cleaning products",
    "url": "https://rbuyonline.com/",
    "location": "Bangalore"
  },
  {
    "id": "75",
    "name": "Go Green Box",
    "category": "PRODUCT",
    "description": "end to end recyling solution for paper waste in workspaces",
    "url": "https://gogreenbox.in/",
    "location": "Bangalore"
  },
  {
    "id": "76",
    "name": "Fedrigoni Sylvicta",
    "category": "PRODUCT",
    "description": "A recyclable paper for packaging",
    "url": "https://specialpapers.fedrigoni.com/sylvicta/",
    "location": "Bangalore"
  },
  {
    "id": "77",
    "name": "Happy Ganga",
    "category": "PRODUCT",
    "description": "Natural detergents and cleaning liquid",
    "url": "https://www.happyganga.com/",
    "location": "Bangalore"
  },
  {
    "id": "78",
    "name": "Forest Lab",
    "category": "PRODUCT",
    "description": "Natural cleaning liquids and oils",
    "url": "https://www.forestlab.in/",
    "location": "Bangalore"
  },
  {
    "id": "79",
    "name": "Praanapoorna",
    "category": "PRODUCT",
    "description": "Natural cleaning liquids and personal care",
    "url": "https://praanapoorna.com/",
    "location": "Bangalore"
  },
  {
    "id": "80",
    "name": "Skrap",
    "category": "SERVICE",
    "description": "Map of dry waste collection centres",
    "url": "https://www.skrap.in/dry-waste-centres",
    "location": "Bangalore"
  },
  {
    "id": "81",
    "name": "The Bag",
    "category": "PRODUCT",
    "description": "Sustainable bags and other products (Contact: https://www.instagram.com/reusethebag/)",
    "url": "https://www.thebag.co.in/",
    "location": "Bangalore"
  },
  {
    "id": "82",
    "name": "Bluecat paper",
    "category": "PRODUCT",
    "description": "tree free papers",
    "url": "https://www.bluecatpaper.com/",
    "location": "Bangalore"
  },
  {
    "id": "83",
    "name": "Dhruvansh",
    "category": "PRODUCT",
    "description": "Environmental NGO in Hyderabad, it runs campaigns",
    "url": "https://dhruvansh.org/",
    "location": "Bangalore"
  },
  {
    "id": "84",
    "name": "Waterscience",
    "category": "PRODUCT",
    "description": "Hard water filters",
    "url": "https://www.instagram.com/waterscienceindia/?hl=en",
    "location": "Bangalore"
  },
  {
    "id": "85",
    "name": "Robin Hood Army",
    "category": "SERVICE",
    "description": "NGO tackling hunger issue",
    "url": "https://robinhoodarmy.com/",
    "location": "Bangalore"
  },
  {
    "id": "86",
    "name": "Tabbz Global",
    "category": "PRODUCT",
    "description": "Cleaning tablets to dissolve in water",
    "url": "https://www.instagram.com/tabbszglobal/",
    "location": "Bangalore"
  },
  {
    "id": "87",
    "name": "Goodeebag",
    "category": "SERVICE",
    "description": "Waste collection in exchange of rewards",
    "url": "https://api.goodeebag.com/",
    "location": "Bangalore"
  },
  {
    "id": "88",
    "name": "Prezerve",
    "category": "PRODUCT",
    "description": "Skin and haircare products (Contact: Shampoo and conditioner is said to be good)",
    "url": "https://prezerve.in/",
    "location": "Bangalore"
  },
  {
    "id": "89",
    "name": "Sukham Handmade",
    "category": "PRODUCT",
    "description": "Skin and haircare products (Contact: Shampoo is said to be good)",
    "url": "https://sukhamhandmade.com/",
    "location": "Bangalore"
  },
  {
    "id": "90",
    "name": "Soil and Health Solutions",
    "category": "PRODUCT",
    "description": "Composting solutions (Contact: https://www.instagram.com/vasuki.composting?igsh=ZDBqMnE2c2dvMTVv)",
    "url": "https://www.soilandhealth.in/about/",
    "location": "Bangalore"
  },
  {
    "id": "91",
    "name": "Sunilima Sustainable solutions",
    "category": "PRODUCT",
    "description": "Demonstrate, educate, and provide the solutions to live a Sustainable life with Composting , Bioenzyme and The Bartan Bank (Contact: https://www.instagram.com/reels/DGaWiwqAlHw/)",
    "url": "http://www.sunilima.in/",
    "location": "Bangalore"
  },
  {
    "id": "92",
    "name": "Matter Party",
    "category": "PRODUCT",
    "description": "Sustainable birthday party decor for rent (Contact: https://forms.gle/mSYucucRB4N9CoLXA)",
    "url": "https://www.matterparty.com/",
    "location": "Bangalore"
  },
  {
    "id": "93",
    "name": "MITU Foundation",
    "category": "SERVICE",
    "description": "upliftment of the urban and rural poor",
    "url": "https://www.mitufoundation.org/",
    "location": "Bangalore"
  },
  {
    "id": "94",
    "name": "Upcyclie",
    "category": "PRODUCT",
    "description": "upcycled clothes made by women in Chennai slums",
    "url": "https://upcyclie.com/",
    "location": "Bangalore"
  },
  {
    "id": "95",
    "name": "Dwij ",
    "category": "PRODUCT",
    "description": "upcycling jeans to make products",
    "url": "https://dwijproducts.com/",
    "location": "Bangalore"
  },
  {
    "id": "96",
    "name": "Reverse ",
    "category": "SERVICE",
    "description": "No description available",
    "url": "https://www.ourreverse.com/",
    "location": "Bangalore"
  },
  {
    "id": "97",
    "name": "Rebrand Reuse",
    "category": "SERVICE",
    "description": "Organisation dedicated to redesign recycle logo",
    "url": "https://rebrandreuse.org/",
    "location": "Bangalore"
  },
  {
    "id": "98",
    "name": "Respun",
    "category": "PRODUCT",
    "description": "Upcycling waste garments",
    "url": "https://respunindia.com/",
    "location": "Bangalore"
  },
  {
    "id": "99",
    "name": "Goonj",
    "category": "SERVICE",
    "description": "Works across diverse sectors such as environment, disasters, education, livelihood, infrastructure (Contact: They collect wearables. Electronic city, arcs layout & small office at ulsoor too)",
    "url": "https://goonj.org/",
    "location": "Bangalore"
  },
  {
    "id": "100",
    "name": "OMG Bakery",
    "category": "PRODUCT",
    "description": "No description available",
    "url": "https://www.instagram.com/omghealthybaking?igsh=d3huMjhwcW91NDJx",
    "location": "Bangalore"
  },
  {
    "id": "101",
    "name": "GreenMic",
    "category": "SERVICE",
    "description": "Climate change awareness",
    "url": "https://greenmic.my.canva.site/",
    "location": "Bangalore"
  },
  {
    "id": "102",
    "name": "Kamarakattu",
    "category": "PRODUCT",
    "description": "Daily care products",
    "url": "https://kamarkattuecostore.co.in/",
    "location": "Bangalore"
  },
  {
    "id": "103",
    "name": "Wild Ideas",
    "category": "PRODUCT",
    "description": "Home and personal care products",
    "url": "https://wildideas.in/",
    "location": "Bangalore"
  }
];
