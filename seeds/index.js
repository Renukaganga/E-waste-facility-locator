
const mongoose = require('mongoose');
const EWPlant = require('../models/garbageplants');

mongoose.connect('mongodb://localhost:27017/E-Waste-Dump' , {
    useNewUrlParser : true ,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error"));
db.once("open" , () => {
    console.log("database connected");
})

const ewasteloc = 
[
  {
    Name: "E-Waste Recyclers India",
    Address: "A-46, near Crowne Plaza, Pocket C, Okhla Phase I, Okhla, New Delhi, Delhi 110020",
    Street: "A-46",
    Municipality: "near Crowne Plaza",
    Categories: "Recycling center, Corporate office",
    Phone: "18001025679",
    username: "18001025679", 
    Location : {
        type: "Point",
        coordinates : [77.2793059 , 28.5245577]
    }
  },

  {
    Name: "Namo eWaste Management Ltd.",
    Address: "Mile Stone, Faridabad, 14 1, NH-19, Faridabad, Haryana 121003",
    Street: "Mile Stone, Faridabad",
    Municipality: "14 1, NH-19",
    Categories: "Recycling center",
    Phone: "08130393629",
    username: "08130393629",
    Location : {
    type: "Point",
    coordinates : [77.30769 , 28.455841]
    }
  },

  {
    Name: "Greenzon E-waste Recycler Delhi",
    Address: "F 509 Deepali Building Nehru Place New Delhi, New Delhi, Delhi 110019",
    Street: "F 509 Deepali Building Nehru Place New Delhi",
    Municipality: "New Delhi, Delhi 110019",
    Categories: "Waste management service",
    Phone: "09811206076",
    username: "09811206076",
     
    Location : {
    type: "Point",
    coordinates : [77.2527734  , 28.548356599999998]
    }
  },

  {
    Name: "Techchef Ewaste Solutions Pvt Ltd",
    Address: "Top Floor, C-61, DDA Sheds, Pocket A, Okhla Phase I, Okhla Industrial Estate, New Delhi, Delhi 110020",
    Street: "Top Floor",
    Municipality: "C-61",
    Categories: "Waste management service",
    Phone: "08178022401",
    username: "08178022401",
     
    Location : {
    type: "Point",
    coordinates : [77.2748015  , 28.5275635]
    }
  },

  {
    Name: "Rocket Sales",
    Address: "Manjusha Building, 604-A, 6th Floor, 57, Nehru Place, New Delhi, Delhi 110019",
    Street: "Manjusha Building",
    Municipality: "604-A, 6th Floor, 57",
    Categories: "Waste management service",
    Phone: "08800575430",
    username: "08800575430",
     
    Location : {
    type: "Point",
    coordinates : [77.2522347 , 28.548843299999998]
    }
  },
  {
    Name: "Hindustan E-waste Management Pvt. Ltd.",
    Address: "8, Central Rd, Jangpura, Bhogal, New Delhi, Delhi 110014",
    Street: "8, Central Rd",
    Municipality: "Jangpura, Bhogal",
    Categories: "Waste management service",
    Phone: "01141553113",
    username: "01141553113",
     
    Location : {
    type: "Point",
    coordinates : [77.24938499999999 , 28.583346]
    }
  },
  {
    Name: "PRO E Waste Recycling",
    Address: "Plot no 32, Gharwali Colony, Sector 4, Ballabhgarh, Faridabad, Haryana 121004",
    Street: "Plot no 32",
    Municipality: "Gharwali Colony, Sector 4, Ballabhgarh",
    Categories: "Recycling center, Consultant, Waste management service",
    Phone: "09311208103",
    username: "09311208103",
     
    Location : {
    type: "Point",
    coordinates : [77.3266007 , 28.3427097]
    }
  },
  {
    Name: "Auctus E-Recycling Solutions Pvt. Ltd.",
    Address: "A-58 Udyog Kendra 1st, Main Surajpur Road, Habibpur, Noida-Greater Noida Expy, Noida, Uttar Pradesh 201301",
    Street: "A-58 Udyog Kendra 1st, Main Surajpur Road, Habibpur",
    Municipality: "Noida-Greater Noida Expy",
    Categories: "Recycling center",
    Phone: "18002701719",
    username: "18002701719",
     
    Location : {
    type: "Point",
    coordinates : [77.34056609999999 , 28.585401599999997]
    } 
  },
  {
    Name: "AVV E Waste Reprocess Pvt Ltd - e waste recycling in pan india (deals in all types of electrical waste)",
    Address: "11, Nehru Ground, New Industrial Twp 1, New Industrial Township, Faridabad, Haryana 121002",
    Street: 11,
    Municipality: "Nehru Ground, New Industrial Twp 1, New Industrial Township",
    Categories: "Recycling center, Recycling drop-off Location",
    Phone: "08178164186",
    username: "08178164186",
     
    Location : {
        type: "Point",
        coordinates : [77.3024645 , 28.3905916]
    }
  },
  {
    Name: "Resource E Waste Solution Pvt Ltd",
    Address: "Plot No:- 147, 3rd Floor, Patparganj Industrial Area, Delhi, 110092",
    Street: "Plot No:- 147, 3rd Floor",
    Municipality: "Patparganj Industrial Area",
    Categories: "Waste management service, Used computer store",
    Phone: "402735",
    username: "402735",
     
    Location : {
    type: "Point",
    coordinates:  [77.312752 , 28.6402528]
    }
  },
  {
    Name: "3R Recycler Pvt. Ltd.",
    Fulladdress: "502, 5th Floor, DDA Complex, Distt. Center, Laxmi Nagar, New Delhi, Delhi 110092",
    Street: "502, 5th Floor, DDA Complex, Distt. Center",
    Municipality: "Laxmi Nagar",
    Categories: "Recycling center",
    Phone: "01143026362",
    username: "01143026362",
     
    Location : {
      type : "Point",
      coordinates : [77.2840125 , 28.6397341]
    }
  },
  {
    Name: "E Waste Recycle Hub",
    Fulladdress: "BK-1/160, 1st Floor, Poorbi Shalimar Bag, Delhi 110088",
    Street: "BK-1/160, 1st Floor",
    Municipality: "Poorbi Shalimar Bag",
    Categories: "Recycling center",
    Phone: "1800123005566",
    username: "1800123005566",
     
    Location : {
      type : "Point",
      coordinates : [77.1683091 , 28.7095125]
    }
  },
  {
    Name: "E-Waste Recycling in India",
    Fulladdress: "Aneja Complex, R-24, Rita Block, Shakarpur, New Delhi, Delhi 110092",
    Street: "Aneja Complex",
    Municipality: "R-24, Rita Block",
    Categories: "Recycling center",
    Phone: "09717393992",
    username: "09717393992",
     
    Location : {
      type : "Point",
      coordinates : [77.29225149999999 , 28.636220299999998]
    }
  },
  {
    Name: "HM WASTE MANAGEMENT PVT. LTD",
    Fulladdress: "G- 21 bd chambers, Karol Bagh, New Delhi, Delhi 110005",
    Street: "G- 21 bd chambers",
    Municipality: "Karol Bagh",
    Categories: "Recycling center",
    Phone: "09999829648",
    username: "09999829648",
     
    Location : {
      type : "Point",
      coordinates : [77.19167639999999 , 28.653747199999998]
    }
  },
  {
    Name: "Bharat Recycling Pvt Ltd",
    Fulladdress: "119/1 Gali No. 19, Main Rd, North Ghonda, Delhi, 110053",
    Street: "119/1 Gali No. 19",
    Municipality: "Main Rd",
    Categories: "Recycling center",
    Phone: "09009009817",
    username: "09009009817",
     
    Location : {
      type : "Point",
      coordinates : [77.2746976 , 28.704548199999998]
    }
  },
  {
    Name: "RUDRA ENTERPRISES (E-WASTE RECYCLING , INSULATED COPPER WIRE DISPOSAL, HAZARDOUS WASTE DISPOSAL)",
    Fulladdress: "Plot No - A-96, Sector - A4, Tronica City, Upsidc Ind Area, Ghaziabad, Uttar Pradesh 201102",
    Street: "Plot No - A-96, Sector - A4, Tronica City, Upsidc Ind Area",
    Municipality: "Ghaziabad, Uttar Pradesh 201102",
    Categories: "Recycling center",
    Phone: "07011460401",
    username: "07011460401",
     
    Location : {
      type : "Point",
      coordinates : [77.255464 , 28.785546999999998]
    }
  },
  {
    Name: "Ecoex",
    Fulladdress: "Hansalaya Building, 5C, 5th floor, Barakhamba Rd, New Delhi, Delhi 110001",
    Street: "Hansalaya Building, 5C, 5th floor",
    Municipality: "Barakhamba Rd",
    Categories: "Waste management service",
    Phone: "01140346015",
    username: "01140346015",
    
    Location : {
      type : "Point",
      coordinates : [77.2257127 , 28.628742499999998]
    }
  }
]

const seeddb = async () => {
  await EWPlant.deleteMany({});
  for(i = 0 ; i < ewasteloc.length ; i++){
      const temp = new EWPlant(ewasteloc[i]);
      const password = "1234";
      const registeredUser = await EWPlant.register(temp , password);
      console.log(registeredUser);
  }
}
console.log(ewasteloc.length);
seeddb();