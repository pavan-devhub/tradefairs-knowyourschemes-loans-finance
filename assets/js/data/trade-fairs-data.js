/* Trade fairs listing, filter options and official sources.
   Converted from src/pages/trade-fairs/tradeFairsData.js (FAIRS rows expanded to objects). */
window.FEED = window.FEED || {};
FEED.data = FEED.data || {};
FEED.data.tradeFairs = {
  "SECTORS": [
    "Ministry of Agriculture",
    "Ministry of Commerce",
    "Ministry of Consumer Affairs & PDS",
    "Ministry of MSME",
    "Ministry of Co-operation",
    "Ministry of AYUSH",
    "Ministry of Shipping",
    "Ministry of Chemicals & Fertilizers",
    "Ministry of Forest",
    "Ministry of Health & Family Welfare",
    "Ministry of Women & Child Development",
    "Ministry of Defence",
    "Ministry of Textiles",
    "Ministry of Finance",
    "Ministry of HRD",
    "Ministry of Skill Development",
    "Ministry of Railways",
    "Ministry of Food Processing",
    "Ministry of Civil Aviation",
    "Ministry of Animal Husbandry",
    "Ministry of External Affairs"
  ],
  "STATES": [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu & Kashmir",
    "Chandigarh",
    "Puducherry"
  ],
  "MONTHS": [
    {
      "value": "1",
      "label": "January"
    },
    {
      "value": "2",
      "label": "February"
    },
    {
      "value": "3",
      "label": "March"
    },
    {
      "value": "4",
      "label": "April"
    },
    {
      "value": "5",
      "label": "May"
    },
    {
      "value": "6",
      "label": "June"
    },
    {
      "value": "7",
      "label": "July"
    },
    {
      "value": "8",
      "label": "August"
    },
    {
      "value": "9",
      "label": "September"
    },
    {
      "value": "10",
      "label": "October"
    },
    {
      "value": "11",
      "label": "November"
    },
    {
      "value": "12",
      "label": "December"
    }
  ],
  "SOURCES": {
    "apeda": {
      "name": "APEDA",
      "description": "Agri and processed food fairs, international listing",
      "url": "https://apeda.gov.in/TradeFairs"
    },
    "wb": {
      "name": "State Export Facilitation Centre, West Bengal",
      "description": "Domestic fairs, redirect link reference",
      "url": "https://www.wbseps.com/fairs.html"
    },
    "warsaw": {
      "name": "Embassy of India, Warsaw",
      "description": "Upcoming trade fairs",
      "url": "https://www.indianembassywarsaw.gov.in/page/upcomingtrade-fairs-in-india/"
    },
    "spice": {
      "name": "Spices Board",
      "description": "Spice trade fairs",
      "url": "https://www.indianspices.com/marketing/trade/trade-fairs.html"
    },
    "epch": {
      "name": "Export Promotion Council for Handicrafts",
      "description": "Proposed participation in international fairs",
      "url": "https://epch.in/"
    },
    "up": {
      "name": "UP International Trade Show",
      "description": "Domestic fair",
      "url": "https://upinternationaltradeshow.com/"
    },
    "tg": {
      "name": "Trade Events Worldwide",
      "description": "Design reference and worldwide event list",
      "url": "https://www.trade.gov.in/pages/trade-events-worldwide"
    }
  },
  "FAIRS": [
    {
      "scope": "international",
      "name": "SIAL Paris",
      "sector": "Ministry of Food Processing",
      "place": "France",
      "city": "Paris",
      "start": "2026-10-17",
      "end": "2026-10-21",
      "source": "apeda"
    },
    {
      "scope": "international",
      "name": "Gulfood",
      "sector": "Ministry of Food Processing",
      "place": "United Arab Emirates",
      "city": "Dubai",
      "start": "2027-01-25",
      "end": "2027-01-29",
      "source": "apeda"
    },
    {
      "scope": "international",
      "name": "Heimtextil",
      "sector": "Ministry of Textiles",
      "place": "Germany",
      "city": "Frankfurt",
      "start": "2027-01-12",
      "end": "2027-01-15",
      "source": "epch"
    },
    {
      "scope": "international",
      "name": "Ambiente",
      "sector": "Ministry of Commerce",
      "place": "Germany",
      "city": "Frankfurt",
      "start": "2027-02-05",
      "end": "2027-02-09",
      "source": "epch"
    },
    {
      "scope": "international",
      "name": "BIOFACH",
      "sector": "Ministry of Agriculture",
      "place": "Germany",
      "city": "Nuremberg",
      "start": "2027-02-17",
      "end": "2027-02-20",
      "source": "apeda"
    },
    {
      "scope": "international",
      "name": "Arab Health (WHX)",
      "sector": "Ministry of Health & Family Welfare",
      "place": "United Arab Emirates",
      "city": "Dubai",
      "start": "2027-02-01",
      "end": "2027-02-04",
      "source": "tg"
    },
    {
      "scope": "international",
      "name": "Foodex Japan",
      "sector": "Ministry of Food Processing",
      "place": "Japan",
      "city": "Tokyo",
      "start": "2027-03-09",
      "end": "2027-03-12",
      "source": "apeda"
    },
    {
      "scope": "international",
      "name": "Warsaw Industry Week",
      "sector": "Ministry of MSME",
      "place": "Poland",
      "city": "Warsaw",
      "start": "2027-03-17",
      "end": "2027-03-19",
      "source": "warsaw"
    },
    {
      "scope": "international",
      "name": "Hannover Messe",
      "sector": "Ministry of MSME",
      "place": "Germany",
      "city": "Hannover",
      "start": "2027-04-12",
      "end": "2027-04-16",
      "source": "tg"
    },
    {
      "scope": "international",
      "name": "Seafood Expo Global",
      "sector": "Ministry of Animal Husbandry",
      "place": "Spain",
      "city": "Barcelona",
      "start": "2027-04-20",
      "end": "2027-04-22",
      "source": "apeda"
    },
    {
      "scope": "international",
      "name": "Canton Fair",
      "sector": "Ministry of Commerce",
      "place": "China",
      "city": "Guangzhou",
      "start": "2027-04-15",
      "end": "2027-05-05",
      "source": "tg"
    },
    {
      "scope": "international",
      "name": "ACHEMA",
      "sector": "Ministry of Chemicals & Fertilizers",
      "place": "Germany",
      "city": "Frankfurt",
      "start": "2027-06-14",
      "end": "2027-06-18",
      "source": "tg"
    },
    {
      "scope": "international",
      "name": "Summer Fancy Food Show",
      "sector": "Ministry of Agriculture",
      "place": "United States",
      "city": "New York",
      "start": "2027-06-27",
      "end": "2027-06-29",
      "source": "apeda"
    },
    {
      "scope": "international",
      "name": "Spice sourcing mission",
      "sector": "Ministry of Commerce",
      "place": "Singapore",
      "city": "Singapore",
      "start": "2026-11-24",
      "end": "2026-11-26",
      "source": "spice"
    },
    {
      "scope": "national",
      "name": "IHGF Delhi Fair (Autumn)",
      "sector": "Ministry of Commerce",
      "place": "Delhi",
      "city": "Greater Noida",
      "start": "2026-10-14",
      "end": "2026-10-17",
      "source": "epch"
    },
    {
      "scope": "national",
      "name": "Global Economic Summit and World Trade Expo",
      "sector": "Ministry of Commerce",
      "place": "Maharashtra",
      "city": "Mumbai",
      "start": "2026-11-20",
      "end": "2026-11-21",
      "source": "tg"
    },
    {
      "scope": "national",
      "name": "India International Trade Fair (IITF)",
      "sector": "Ministry of Commerce",
      "place": "Delhi",
      "city": "New Delhi",
      "start": "2026-11-14",
      "end": "2026-11-27",
      "source": "tg"
    },
    {
      "scope": "national",
      "name": "Aqua and Fisheries Expo",
      "sector": "Ministry of Animal Husbandry",
      "place": "Andhra Pradesh",
      "city": "Visakhapatnam",
      "start": "2026-11-12",
      "end": "2026-11-14",
      "source": "apeda"
    },
    {
      "scope": "national",
      "name": "West Bengal MSME Trade Fair",
      "sector": "Ministry of MSME",
      "place": "West Bengal",
      "city": "Kolkata",
      "start": "2026-12-10",
      "end": "2026-12-14",
      "source": "wb"
    },
    {
      "scope": "national",
      "name": "International Agri Expo",
      "sector": "Ministry of Agriculture",
      "place": "Telangana",
      "city": "Hyderabad",
      "start": "2026-12-18",
      "end": "2026-12-20",
      "source": "apeda"
    },
    {
      "scope": "national",
      "name": "India International Leather Fair",
      "sector": "Ministry of Commerce",
      "place": "Tamil Nadu",
      "city": "Chennai",
      "start": "2027-01-30",
      "end": "2027-02-01",
      "source": "epch"
    },
    {
      "scope": "national",
      "name": "India International Seafood Show",
      "sector": "Ministry of Animal Husbandry",
      "place": "Kerala",
      "city": "Kochi",
      "start": "2027-02-05",
      "end": "2027-02-07",
      "source": "apeda"
    },
    {
      "scope": "national",
      "name": "India International Spices Conference",
      "sector": "Ministry of Commerce",
      "place": "Kerala",
      "city": "Kochi",
      "start": "2027-02-19",
      "end": "2027-02-21",
      "source": "spice"
    },
    {
      "scope": "national",
      "name": "Bharat Tex",
      "sector": "Ministry of Textiles",
      "place": "Delhi",
      "city": "New Delhi",
      "start": "2027-02-26",
      "end": "2027-03-01",
      "source": "tg"
    },
    {
      "scope": "national",
      "name": "AAHAR Food and Hospitality Fair",
      "sector": "Ministry of Food Processing",
      "place": "Delhi",
      "city": "New Delhi",
      "start": "2027-03-09",
      "end": "2027-03-13",
      "source": "apeda"
    },
    {
      "scope": "national",
      "name": "UP International Trade Show",
      "sector": "Ministry of MSME",
      "place": "Uttar Pradesh",
      "city": "Greater Noida",
      "start": "2027-09-24",
      "end": "2027-09-28",
      "source": "up"
    }
  ]
};
