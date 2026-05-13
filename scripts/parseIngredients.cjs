const { v4: uuidv4 } = require('crypto')

// Raw data: [name, packSize, price]
const RAW = [
  ["16oz Peanut Cup","20 sleeves",8.01],
  ["32oz Peanut Cup","20 sleeves",10.22],
  ["Appetizer Egg Roll Boudin With Cheese","100/2.8",69.14],
  ["Appetizer Onion Ring 5/8\"","6/2.5 Lb",8.80],
  ["Appetizer Potato Ring Frozen","6/4 Lb",8.61],
  ["Bacon 18-22 Single Sliced Double Smoked","1/15 Lb",57.67],
  ["Bacon Wrapped Jalapeno Poppers","per case",93.03],
  ["Bag Foil Insulated Rib Bag","1/250cnt",136.38],
  ["Bag Fry Paper 4.5x3.5 White Plain","1/2000",22.26],
  ["Bag Sandwich White","6/1000",4.57],
  ["Batter Mix","per bag",2.50],
  ["Bavarian Almonds","per bag",11.75],
  ["Bavarian Cashews","per bag",12.00],
  ["Bavarian Pecans","per bag",13.75],
  ["Bayou Blend Crawfish","10 packs",9.66],
  ["Bayou Blend Pork","10 packs",9.12],
  ["Bayou Blend Shrimp","10 packs",9.22],
  ["Bean Baked Original Bacon Brown Sugar","6/117oz",16.26],
  ["Bean Lima Baby","1/20 Lb",33.60],
  ["Beans Black Low Sodium All Natural","6/#10 Can",5.57],
  ["Beans Refried Vegetarian","6/#10 Can",9.16],
  ["Beef Ground 73/27 Chub Fine Refrigerated","8/10 Lb",39.40],
  ["Beef Ground Patty 3-1 75/25 Au Jus Frozen","60/5.3oz",84.52],
  ["Beef Ground Patty 4-1 Breaded Country Steak","40/4oz",84.52],
  ["Beef Philly Steak Sirloin Puck Frozen","48/4oz",79.63],
  ["Beef Steak Fritter Chopped For Biscuit","71/2.25",65.87],
  ["Beef Strip For Fajita Fully Cooked Frozen","2/5 Lb",46.98],
  ["Beef Taco Filling Gluten Free Fully Cooked","4/5 Lb",14.97],
  ["Bologna Chicken Pork Beef For Biscuit","6/2 Lb",6.80],
  ["Boudin Alligator","5 packs",9.88],
  ["Boudin Ball With Pork Battered Frozen","1/12 Lb",60.78],
  ["Boudin Balls","per case",55.72],
  ["Boudin Crawfish","5 packs",9.10],
  ["Boudin Eggrolls","per case",70.67],
  ["Boudin Pork","5 packs",7.46],
  ["Box Barn Paper","1/150cnt",113.19],
  ["Box Carryout Chicken 7x4x2.75","1/500cnt",65.14],
  ["Box Paperboard Chicken 9x5x3 White","1/400cnt",131.34],
  ["Bread Texas Toast White 3/4\" Frozen","10/32oz",2.58],
  ["Breader Fish Fry Seasoned","1/25 Lb",32.93],
  ["Breader Shrimp Fry","1/25 Lb",33.33],
  ["Brisket","per bag",33.09],
  ["Broccoli Florets","12/2 Lb",3.74],
  ["Broth Chicken","12/49oz",3.97],
  ["Brownie Chocolate Chip Thaw & Serve","48/4oz",46.31],
  ["Brussel Sprouts IQF","12/2.5 Lb",5.24],
  ["Bun Hot Dog","12/12cnt",3.07],
  ["Bun Hot Dog 6\" Hinged Frozen","12/12cnt",3.27],
  ["Bun Plain 5\" Frozen Hamburger","64/3oz",3.63],
  ["Butter Blend Blocks","36/1 Lb",3.39],
  ["Cabbage Chopped 1x1 Fresh","4/5 Lb",5.24],
  ["Cabbage Chopped Fresh","4/5 Lb",4.83],
  ["Cake Chocolate Overload","2/14 sl",76.88],
  ["Cake Coconut Cloud","2/14 sl",76.88],
  ["Cake Limoncella","2/3.5 Lb",63.01],
  ["Candy Gummy Bear Mini 12 Flavor","4/5 Lb",18.42],
  ["Casserole Broccoli Cheese Rice Frozen","4/4.75 Lb",12.05],
  ["Casserole Hashbrown Ready To Bake","4/4.5 Lb",15.02],
  ["Casserole Potato Baked Frozen","4/4.75 Lb",11.80],
  ["Casserole Sweet Potato Dutch","4/4.75 Lb",14.17],
  ["Catfish Nugget","1/15 Lb",100.29],
  ["Catfish Whole","1/15 Lb",94.24],
  ["Cheddar Cheese Sausage","per case",43.50],
  ["Cheddar Deer Burrito","100 ea",241.68],
  ["Cheese American Yellow .5oz 160 Slice","4/5 Lb",13.83],
  ["Cheese Cheddar Yellow Mild Shredded","1/5 Lb",14.98],
  ["Cheese Cream Loaf","10/3 Lb",9.61],
  ["Cheese Swiss Sliced 192 Refrigerated","6/24oz",6.61],
  ["Cheesecake Cinnamon Churro Frozen","2/14 sl",47.50],
  ["Chicken and Dumplings","4/5 Lb",13.97],
  ["Chicken Breast 4oz","2/5 Lb",33.87],
  ["Chicken Breast Patty Fritter","1/10 Lb",41.37],
  ["Chicken Breast Strip Fajita Flame Broiled","2/5 Lb",27.19],
  ["Chicken Cut 8 Piece Bone In","16/3 Lb",88.98],
  ["Chicken Egg Roll","100/2.8",67.03],
  ["Chicken Tender Jumbo Clipped Refrigerated","4/10 Lb",94.02],
  ["Chip Tortilla Corn Yellow 1/4 Cut Fry","1/30 Lb",26.33],
  ["Cobbler Apple Frozen","4/5 Lb",11.07],
  ["Cobbler Blackberry Frozen","4/5 Lb",15.47],
  ["Cobbler Cherry Frozen","4/5 Lb",13.04],
  ["Cobbler Peach Frozen","4/5 Lb",19.75],
  ["Cobbler Pecan Deep Dish Thaw & Serve","4/5 Lb",9.38],
  ["Coleslaw Creamy","2/4.5 Lb",9.89],
  ["Collards","4 bags",9.98],
  ["Cone Cake #30 Dispenser Pack","6/100cnt",12.11],
  ["Cone Waffle Large Bulk","12/16cnt",5.48],
  ["Container Foam 12oz Squat White","20/25cnt",1.48],
  ["Container Foam 16oz Squat","20/25ct",1.66],
  ["Container Foam 3 Compartment 9x9x3 Hinged","2/100cnt",14.45],
  ["Container Foam 4oz Squat White Plain","20/50cnt",1.38],
  ["Container Foam 6oz Squat White","20/50cnt",1.98],
  ["Container Foam 8oz Squat White","20/50cnt",2.42],
  ["Container Foam 9x6x3 Hoagie Tray","2/100cnt",6.25],
  ["Container Foam Sandwich 6x6x3 Hinged White","4/125cnt",6.57],
  ["Container Hot Cold Paper 8oz White","20/50cnt",4.09],
  ["Container Paper 12oz White","20/1000",4.78],
  ["Container Paper 8oz White","20/50cnt",4.09],
  ["Container Plastic 3 Compartment Black Clear","2/60cnt",34.06],
  ["Container Plastic 32oz Rectangle Black Clear","3/50cnt",18.25],
  ["Container Plastic 32oz Round Black Base Clear","1/150cnt",58.65],
  ["Container Plastic 6x6x3 Clear Clamshell","4/125cnt",23.63],
  ["Container Plastic 8x8x3","2/125cnt",27.82],
  ["Corn Dog Cheese Jalapeno With Bag Frozen","36/4.25",27.54],
  ["Corn Dog Chicken Battered Honey Crunch","72/4.25",43.55],
  ["Corn Dog Chili Lovers With Bag Frozen","36/4.25",27.50],
  ["Corn Meal","1/25 Lb",14.33],
  ["Corn Super Sweet Fire Roasted IQF","6/2 Lb",5.92],
  ["Crab Stuffed In Shell 2oz","72/2oz",63.43],
  ["Cracker Saltine","500/2ct",24.90],
  ["Cream Cheese Icing","12 tubes",5.99],
  ["Creole Marinade","per bag",1.81],
  ["Crispito Chicken And Cheese Frozen","72/2.75",56.11],
  ["Crispito Chicken Cheese Buffalo Style","72/2.75",56.11],
  ["Cup 9oz Squat Clear Gelato","20/500cnt",3.90],
  ["Cup Plastic Souffle 2oz Portion Cup","10/250",3.30],
  ["Cutlery Kit","per case",14.15],
  ["Danish Elite Variety Pack","6/8ct",1.51],
  ["Deer Burrito Cheddar","100 ea",241.68],
  ["Deer Burrito Pepper Jack","per case",253.08],
  ["Dip Queso Blanco Frozen","4/5 Lb",14.84],
  ["Dip Roasted Street Corn Mexican Style","4/5 Lb",16.69],
  ["Donut Apple Fritter","36/4.75",50.67],
  ["Dough Biscuit Southern Style Buttermilk","168/3.17",62.38],
  ["Dough Cookie Chocolate Chip Pre-Portioned","160/2oz",62.85],
  ["Dough Cookie Oatmeal Raisin Frozen","160/2oz",67.24],
  ["Dough Cookie Peanut Butter 2oz","160/2oz",72.76],
  ["Dough Cookie Peanut Butter Reeses Decadent","80/4.5oz",86.36],
  ["Dough Cookie Red Velvet","80/4.5oz",84.08],
  ["Dough Cookie S'mores Decadent Frozen","80/4.5oz",93.66],
  ["Dough Cookie Triple Chocolate Decadent","80/4.5oz",84.77],
  ["Dough Cookie White Chocolate Macadamia Nut","80/4.5oz",93.48],
  ["Dough Roll Cinnamon Cinn-Sational Frozen","108/5oz",72.43],
  ["Dough Turnover Apple","2/60cnt",26.76],
  ["Dressing Honey Mustard Portion Cup","100/1.5",28.23],
  ["Dressing Ranch Buttermilk Western","2/1 Gal",26.60],
  ["Dressing Ranch Jalapeno Refrigerated","4/1 Gal",18.24],
  ["Dressing Ranch Portion Control Cup","100/1.5",26.35],
  ["Dressing Roasted Red Pepper And Garlic","2/1 Gal",24.35],
  ["Egg Patty Fried Homestyle","168/1.5",46.01],
  ["Egg Patty Imperial","per case",26.38],
  ["Egg Shell On White Medium Grade AA","1/30",38.52],
  ["Eggroll Pork And Vegetable Frozen","72/3oz",54.98],
  ["Flan 4oz Cup Individual Round Frozen","12/4oz",3.37],
  ["Flour Hotel & Restaurant All Purpose","1/25 Lb",8.20],
  ["Foil Aluminum Sheet","12/200",12.56],
  ["Food Release Oil Base With Soy","6/17oz",9.43],
  ["Fork Plastic Heavy Weight Black","1/1000 ea",4.41],
  ["Fries 3/8\" Crinkle Cut Battered Seasoned","12/8oz",4.45],
  ["Fries Potato Wedge Seasoned 8 Cut Frozen","6/5 Lb",8.33],
  ["Fries Straight Cut 5/16\" Thin","6/5 Lb",7.21],
  ["Fritter Corn Jalapeno Frozen/Hushpuppy","2/5 Lb",14.35],
  ["Garlic Granulated Jug","1/7.25 Lb",55.95],
  ["Garlic Powder","6/21oz",18.03],
  ["Gelato","per each",35.00],
  ["Gizzards","4/10 Lb",34.19],
  ["Gravy Mix Au Jus","16/3.3oz",2.28],
  ["Gravy Mix Biscuit Pepper No MSG","6/24oz",4.47],
  ["Gravy Mix Brown","8/16oz",2.72],
  ["Green Beans","6 bags",7.86],
  ["Grits","4 bags",11.00],
  ["Grits Quick Dry","8/5 Lb",9.68],
  ["Gumbo","4 bags",17.32],
  ["Ham For Biscuit Slice 1.2oz","4/2.5 Lb",12.34],
  ["Honey Pure Grade A Portion Cup","200/.5oz",34.62],
  ["Hot Pocket Pizza Stix Pepperoni Mozzarella","48/3oz",31.74],
  ["Hushpuppy Original Buttermilk","4/5 Lb",12.64],
  ["Ice Cream Mix Chocolate Light Refrigerated","9/64oz",4.39],
  ["Ice Cream Mix Vanilla Refrigerated","4/1 Gal",8.07],
  ["Italian Ice","per each",52.00],
  ["Jam Strawberry Packet","200/.5oz",20.74],
  ["Jelly Assorted Grape Apple Mixed Fruit","200/.5oz",17.79],
  ["Jelly Grape Pouch","200/.5oz",20.64],
  ["JV Hot Dogs","50/1 ea",46.40],
  ["Ketchup Fancy Canned","6/#10",6.26],
  ["Ketchup Fancy Foil","1000/9gm",27.51],
  ["King Cake Blueberry Strawberry Cream Cheese","per cake",31.00],
  ["King Cake Cream Cheese","per cake",28.00],
  ["King Cake Pecan Praline","per cake",30.00],
  ["King Cake Strawberry","per cake",28.00],
  ["King Cake Traditional","per cake",26.00],
  ["Knife Plastic Heavy Weight Black","1/1000 ea",4.81],
  ["Laminated Honeycomb Sandwich Wrap 14x16","2/500",36.42],
  ["Lasagna Meat And Sausage Traditional","4/96oz",24.75],
  ["Lid Container 12oz Plastic Dome Clear","20/50cnt",4.51],
  ["Lid Container Polystyrene Translucent 12oz","10/100",2.99],
  ["Lid Cup Plastic 6oz Vented White","10/100",2.28],
  ["Lid Cup Plastic Vented White 4oz","10/100",1.83],
  ["Lid Plastic Dome Container 8oz Clear","20/50cnt",3.97],
  ["Lid Souffle Cup 1.5-2oz PET","20/125",1.44],
  ["Liver","4/10 Lb",28.48],
  ["Mac and Cheese","6 bags",7.10],
  ["Mashed Potatoes","4 bags",9.65],
  ["Mayonnaise Heavy Duty Gallon Jug","4/1 Gal",9.79],
  ["Mayonnaise Pouch","500/9gm",32.11],
  ["Meat Loaf Beef","3/5 Lb",89.87],
  ["Mini Cream Pie","8/7oz",2.63],
  ["Mini Taco Beef","per case",27.91],
  ["Mini Taco Chicken","per case",27.91],
  ["Muffin Cornbread","96/2.125",42.13],
  ["Muffins Variety","48/4.25",61.09],
  ["Mustard Salad Yellow Classic","4/105oz",6.26],
  ["Mustard Yellow Portion Pack","500/5.5g",18.45],
  ["Napkin Small 6.5x8.4","6/720cnt",6.93],
  ["Napkin Xpress 13x8.5 White 1/4 Folded","12/500",5.22],
  ["Napkins","12/500",5.22],
  ["Napkins Bulk","per pack",34.86],
  ["Oil Butter Flavor","3/1 Gal",12.98],
  ["Okra Breaded Lightly Trans Fat Free","4/5 Lb",7.95],
  ["Onion Powder","6/20oz",17.25],
  ["Onion White Jumbo 3\" And Up Fresh","1/10 Lb",16.07],
  ["Onion Yellow Large","1/5 Lb",12.02],
  ["Pancake Maple Turkey Wrap On A Stick","56/2.85",34.44],
  ["Pancake Mix","6/5 Lb",8.02],
  ["Pancake On A Stick","56/2.85",34.44],
  ["Pasta Macaroni Elbow Heavy Wall","3/10 Lb",12.94],
  ["Pasta Penne Rigate","2/10 Lb",12.77],
  ["Pasta Spaghetti 10\"","2/10 Lb",13.30],
  ["Peanut Cup Lid","10 sleeves",5.01],
  ["Peanuts Regular/Cajun","6 cans",7.74],
  ["Peas Field With Snap","1/20 Lb",37.79],
  ["Pepper Bell Green Medium Fresh","1/5 Lb",11.55],
  ["Pepper Black Ground Packets","6/1000",6.68],
  ["Pepper Black Ground Shaker Disposable","48/1.5oz",1.18],
  ["Pepper Black Shaker Grind 34 Mesh Jug","1/5 Lb",40.00],
  ["Pepperjack Deer Burrito","per case",253.08],
  ["Peppers Jalapeno Fresh","1/1-1/9",34.20],
  ["Pickle Chip Cajun Chef","4/1 Gal",11.05],
  ["Pickle Chip Mt. Olive","4/1 Gal",8.58],
  ["Pie Crawfish Bulk Frozen","48/3.75",71.59],
  ["Pie Meat Original Bulk Frozen","48/3.75",57.88],
  ["Plate Foam 3 Compartment","4/125cnt",7.35],
  ["Pork Chop 4oz Boneless Center Cut","40/4oz",55.58],
  ["Pork Choppette Breaded Frozen","40/4oz",55.46],
  ["Pork Pulled With BBQ Sauce","2/5 Lb",19.27],
  ["Pork Rib Spare St Louis Style Frozen","12/3.6 Lb",11.40],
  ["Potato Jumbo Stuffed Tater Keg","106/1.5",39.78],
  ["Potato Salad","2/5 Lb",32.86],
  ["Pretzels","per case",43.36],
  ["Puff Pastry Taco Frozen","48/6oz",73.12],
  ["Puff Pizza Pepperoni 6oz Frozen","48/6oz",70.52],
  ["Red Beans","9 bags",6.49],
  ["Relish Dill","per jar",9.93],
  ["Rice Long Grain Parboiled Boxed","1/25 Lb",17.86],
  ["Rice White Long Grain Fully Cooked IQF","1/40 Lb",56.16],
  ["Roll Dinner Hawaiian Sweet Frozen","10/24cnt",5.79],
  ["Salsa Fire Roasted Ready To Use","6/#10 Can",9.52],
  ["Salsa Picante Chunky Packet","200/.5oz",10.02],
  ["Salt Iodized Round","24/26oz",0.86],
  ["Salt Packet .5 Gram","6/1000",3.73],
  ["Salt Shaker","48/4oz",0.43],
  ["Sauce Barbecue Original Gallon Jug","4/1 Gal",18.74],
  ["Sauce Barbecue Original Portion Cup","100/1.5",28.51],
  ["Sauce BBQ Original Jug","4/1 Gal",14.30],
  ["Sauce BBQ Portion Cup","100/1.5",28.51],
  ["Sauce Cocktail Cup Refrigerated","100/1.5",29.95],
  ["Sauce Hot Sauce Pouch","500/9gm",34.88],
  ["Sauce Marinara Dip Cup","60/2oz",34.73],
  ["Sauce Soy Packets","500/6ml",16.65],
  ["Sauce Spaghetti From Concentrate","6/#10 Can",6.87],
  ["Sauce Sweet And Sour Cup","100/1oz",19.86],
  ["Sauce Sweet Red Chili Sauce Bottles","per bottle",3.22],
  ["Sauce Taco Pouch","500/9g",27.65],
  ["Sauce Tartar Portion Cup Refrigerated","100/.75",19.68],
  ["Sauce Wing Kickin Bourbon Molasses Glaze","4/64oz",12.36],
  ["Sausage Link 4-1 Smoked Frozen","40/4oz",48.42],
  ["Sausage Original Link Smoked Split Frozen","64/2.5oz",60.58],
  ["Sausage Patty Special Recipe Fully Cooked","80/2oz",47.18],
  ["Sausage Pork Patty Jalapeno Smoked Cheddar","2/5 Lb",24.98],
  ["Sausage Smokies Link 5\" Hickory Smoked","1/10 Lb",48.57],
  ["Seasoned Corn","6 bags",6.18],
  ["Seasoning Blend Montreal Chicken Grill Mates","6/23oz",11.14],
  ["Seasoning Creole Original Tonys","1/8 Lb",20.90],
  ["Shortening Clear Liquid Fry","1/35 Lb",38.02],
  ["Shrimp White 31-40 Raw Peeled Deveined","5/2 Lb",12.57],
  ["Skewer Wooden","3/500cnt",13.24],
  ["Soft Serve Chocolate Ice Cream Mix","6/6 Lb",13.28],
  ["Soft Serve Vanilla Ice Cream Mix","6/6 Lb",13.16],
  ["Soup Chili Beef With Bean","4/4 Lb",17.80],
  ["Soup Cream Of Chicken","12/50oz",5.96],
  ["Sour Cream Packets","100/1oz",14.65],
  ["Spicy Chicken Patty","per case",40.84],
  ["Spicy Marinade","per bag",5.27],
  ["Spoon Plastic Heavy Weight Black","1/1000 ea",4.81],
  ["Spoon Wrapped","1/1000",20.29],
  ["Sprinkle Rainbow","1/10 Lb",28.46],
  ["Squash","12/32oz",4.12],
  ["Stuffed Nacho","per case",37.28],
  ["Sugar Brown Light Cane","12/2 Lb",2.96],
  ["Sweet Relish","per case",16.26],
  ["Syrup Breakfast Maple Imitation 1.4oz","100/1.4",16.18],
  ["Syrup Chocolate Full Flavor Can","6/#10 Can",12.61],
  ["Tamale Beef 18 Bag Of 4 Frozen","72/5oz",4.64],
  ["Tamale Chicken 18 Bag Of 4 Frozen","72/5oz",4.63],
  ["Tater Tot Barrel Frozen","6/5 Lb",10.33],
  ["Thermo Sandwich Wrap 10.5x14","4/500",26.88],
  ["Tomato Diced 3/4\" In Juice","6/#10 Can",5.13],
  ["Tomato Gravy","4 bags",12.34],
  ["Topping Butterfinger Chopped","2/5 Lb",26.64],
  ["Topping Butterscotch Ready To Use","6/#5 Can",8.52],
  ["Topping Candy Rainbow Nerds","2/5 Lb",27.28],
  ["Topping Caramel","6/66oz",8.00],
  ["Topping M&M's Plain Chopped","2/4 Lb",21.56],
  ["Topping Marshmallow Ready To Use","6/36oz",7.66],
  ["Topping Peanut Pieces","6 cans",12.37],
  ["Topping Peanut Pieces Salted","6/2.5 Lb",12.72],
  ["Topping Strawberry Pump Style","6/#5 Can",11.26],
  ["Tortilla Flour 12\"","8/12cnt",3.59],
  ["Tray Food Paper 5 Pound Red Check","2/250cnt",18.75],
  ["Vegetable Blend Peas and Carrots","12/2.5 Lb",4.56],
  ["Vegetable Blend Red & Green Pepper Onion Strip","6/2.5 Lb",4.56],
  ["Wrap Deli 12x10","12/500",7.42],
  ["Wrap Deli 12x10.75","per box",7.41],
  ["Wrap Foil 14x10.5 Cushion Plain","5/500cnt",29.66],
  ["Wrap Foil Cushion For Sandwiches","5/500ct",29.66],
  ["Onions","per case",16.10],
  ["Egg Patty Imperial","per case",26.38],
  ["Cutlery Kit","per case",14.15],
  ["Napkins Bulk","per pack",34.86],
]

function parsePackSize(ps, price) {
  ps = ps.trim()

  // "per X"
  if (/^per /i.test(ps)) {
    const unit = ps.replace(/^per /i, '').trim()
    return { unit, unitCost: price }
  }

  // "X ea" or "X packs/bags/sleeves/cans/tubes"
  const simpleMatch = ps.match(/^(\d+(?:\.\d+)?)\s+(packs?|bags?|sleeves?|cans?|tubes?)$/i)
  if (simpleMatch) {
    const qty = parseFloat(simpleMatch[1])
    const unit = simpleMatch[2].toLowerCase().replace(/s$/, '')
    return { unit, unitCost: +(price / qty).toFixed(6) }
  }

  // "100 ea"
  if (/^\d+\s+ea$/i.test(ps)) {
    const qty = parseInt(ps)
    return { unit: 'each', unitCost: +(price / qty).toFixed(6) }
  }

  // "X/Y Lb"
  const lbMatch = ps.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*Lb$/i)
  if (lbMatch) {
    const total = parseFloat(lbMatch[1]) * parseFloat(lbMatch[2])
    return { unit: 'lb', unitCost: +(price / total).toFixed(6) }
  }

  // "X/Y Gal"
  const galMatch = ps.match(/^(\d+)\s*\/\s*(\d+(?:\.\d+)?)\s*Gal$/i)
  if (galMatch) {
    const qty = parseInt(galMatch[1])
    return { unit: 'gallon', unitCost: +(price / qty).toFixed(6) }
  }

  // "X/#N Can" or "X/#N"
  const canMatch = ps.match(/^(\d+)\s*\/\s*#(\d+)(?:\s*Can?)?$/i)
  if (canMatch) {
    const qty = parseInt(canMatch[1])
    return { unit: `#${canMatch[2]} can`, unitCost: +(price / qty).toFixed(6) }
  }

  // "X/#N Can" with trailing space variant
  const canMatch2 = ps.match(/^(\d+)\s*\/\s*#(\d+)\s+Can$/i)
  if (canMatch2) {
    const qty = parseInt(canMatch2[1])
    return { unit: `#${canMatch2[2]} can`, unitCost: +(price / qty).toFixed(6) }
  }

  // "X/Ycnt" or "X/Yct"
  const cntMatch = ps.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*c(?:n)?t$/i)
  if (cntMatch) {
    const total = parseFloat(cntMatch[1]) * parseFloat(cntMatch[2])
    return { unit: 'each', unitCost: +(price / total).toFixed(6) }
  }

  // "X/Y ea"
  const eaMatch = ps.match(/^(\d+)\s*\/\s*(\d+)\s*ea$/i)
  if (eaMatch) {
    const total = parseInt(eaMatch[1]) * parseInt(eaMatch[2])
    return { unit: 'each', unitCost: +(price / total).toFixed(6) }
  }

  // "X/Y sl" (slices)
  const slMatch = ps.match(/^(\d+)\s*\/\s*(\d+)\s*sl$/i)
  if (slMatch) {
    const total = parseInt(slMatch[1]) * parseInt(slMatch[2])
    return { unit: 'slice', unitCost: +(price / total).toFixed(6) }
  }

  // "X/Y" where Y has a unit suffix (oz, gm, g, ml, etc.) → count X pieces
  const unitedMatch = ps.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*(oz|gm|g|ml|m)$/i)
  if (unitedMatch) {
    const qty = parseFloat(unitedMatch[1])
    return { unit: 'each', unitCost: +(price / qty).toFixed(6) }
  }

  // "X/Y" plain numbers only
  const plainMatch = ps.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/)
  if (plainMatch) {
    const packs = parseFloat(plainMatch[1])
    const qty2 = parseFloat(plainMatch[2])
    // If qty2 >= 100 assume packs×qty2 total (e.g. 12/500 = 6000 napkins)
    // If qty2 < 10 assume packs is the piece count (e.g. 100/2.8 = 100 each)
    if (qty2 >= 100) {
      const total = packs * qty2
      return { unit: 'each', unitCost: +(price / total).toFixed(6) }
    } else {
      return { unit: 'each', unitCost: +(price / packs).toFixed(6) }
    }
  }

  // "1/1-1/9" (jalapenos — treat as 1 case)
  if (ps === '1/1-1/9') {
    return { unit: 'case', unitCost: price }
  }

  // Fallback
  return { unit: ps, unitCost: price }
}

// Category heuristics based on name keywords
const PACKAGING_KEYWORDS = [
  'bag ','box ','container','lid ','lid\t','cup ','cup\t','plate','foam',
  'napkin','cone ','wrap ','foil ','fork','knife','spoon','tray','cutlery',
  'skewer','thermo','laminated','cracker saltine' // saltines are ingredient but fine
]
const SUPPLY_KEYWORDS = ['oil butter flavor','food release','shortening']

function getCategory(name) {
  const n = name.toLowerCase()
  if (SUPPLY_KEYWORDS.some(k => n.includes(k))) return 'supply'
  if (PACKAGING_KEYWORDS.some(k => n.startsWith(k) || n.includes(k))) return 'packaging'
  return 'ingredient'
}

const results = RAW.map(([name, packSize, price]) => {
  const { unit, unitCost } = parsePackSize(packSize, price)
  const category = getCategory(name)
  return {
    id: require('crypto').randomUUID(),
    name,
    unit,
    unitCost: Math.round(unitCost * 10000) / 10000,
    category,
  }
})

// Output as JSON
process.stdout.write(JSON.stringify(results, null, 2))
