// ============================================
// SEED.JS - SEED FOOD RECIPES ACROSS ALL CATEGORIES
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  const cats = await Category.find();
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c._id; });

  const recipes = [
    // Món Việt
    { name: 'Phở Bò Hà Nội', description: 'Phở bò truyền thống Hà Nội với nước dùng đậm đà', price: 55000, duration: 45, categoryId: catMap['mon-viet'], ingredients: ['bò', 'bánh phở', 'hành', 'gia vị', 'nước dùng', 'rái', 'hẹ'], thumbnail: 'https://images.unsplash.com/photo-1583224964978-2257b1c1c8e4?w=400', isActive: true },
    { name: 'Bún Chả Hà Nội', description: 'Bún chả thịt nướng truyền thống', price: 45000, duration: 40, categoryId: catMap['mon-viet'], ingredients: ['thịt heo', 'bún', 'nước mắm', 'đu đủ', 'rau thơm'], thumbnail: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isActive: true },
    { name: 'Bánh Mì Thịt', description: 'Bánh mì Việt Nam với nhân thịt đa dạng', price: 25000, duration: 15, categoryId: catMap['mon-viet'], ingredients: ['bánh mì', 'thịt nguội', 'dưa leo', 'ớt', 'nước sốt'], thumbnail: 'https://images.unsplash.com/photo-1605470672288-e4501f61a8e2?w=400', isActive: true },
    { name: 'Cơm Tấm Sườn', description: 'Cơm tấm sườn bì chả truyền thống Sài Gòn', price: 50000, duration: 35, categoryId: catMap['mon-viet'], ingredients: ['cơm', 'sườn', 'bì', 'chả', 'trứng', 'đồ chua'], thumbnail: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', isActive: true },
    { name: 'Bún Bò Huế', description: 'Bún bò Huế cay nồng đặc trưng miền Trung', price: 50000, duration: 50, categoryId: catMap['mon-viet'], ingredients: ['bò', 'bún', 'sả', 'ớt', 'món', 'đuôi bò'], thumbnail: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400', isActive: true },
    { name: 'Gỏi Cuốn', description: 'Gỏi cuốn tươi mát với tôm thịt', price: 35000, duration: 25, categoryId: catMap['mon-viet'], ingredients: ['tôm', 'thịt heo', 'bún', 'rau xà lách', 'bánh tráng'], thumbnail: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', isActive: true },
    { name: 'Cao Lầu Hội An', description: 'Món đặc sản Hội An với miến và thịt xá xíu', price: 45000, duration: 40, categoryId: catMap['mon-viet'], ingredients: ['miến', 'thịt xá xíu', 'rau xà lách', 'đu đủ'], thumbnail: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400', isActive: true },
    { name: 'Mì Quảng', description: 'Mì Quảng Nam với nước dùng vàng óng', price: 40000, duration: 35, categoryId: catMap['mon-viet'], ingredients: ['mì', 'tôm', 'thịt', 'bánh đa', 'đậu phộng', 'hành phi'], thumbnail: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', isActive: true },
    { name: 'Bánh Xèo', description: 'Bánh xèo giòn rụm nhồi tôm thịt', price: 40000, duration: 30, categoryId: catMap['mon-viet'], ingredients: ['bột bánh xèo', 'tôm', 'thịt heo', 'đậu xanh', 'nước mắm'], thumbnail: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isActive: true },
    { name: 'Bánh Đa Cua', description: 'Bánh đa cua Hải Phòng với chả cua', price: 45000, duration: 30, categoryId: catMap['mon-viet'], ingredients: ['bánh đa', 'cua', 'chả', 'hành', 'rái'], thumbnail: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isActive: true },
    // Món Á
    { name: 'Pad Thái', description: 'Mì xào Thái Lan chua cay ngọt hài hòa', price: 55000, duration: 25, categoryId: catMap['mon-a'], ingredients: ['mì', 'tôm', 'đu đủ', 'lạc', 'chanh', 'ớt'], thumbnail: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', isActive: true },
    { name: 'Dimsum Hấp', description: 'Bánh bao dimsum hấp thơm lừng', price: 30000, duration: 30, categoryId: catMap['mon-a'], ingredients: ['bột mì', 'thịt heo', 'tôm', 'nấm', 'hành'], thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', isActive: true },
    { name: 'Lẩu Thái', description: 'Lẩu Thái chua cay với hải sản tươi', price: 180000, duration: 60, categoryId: catMap['mon-a'], ingredients: ['tôm', 'cá', 'nấm', 'rau', 'sữa dừa', 'chanh', 'cay'], thumbnail: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', isActive: true },
    { name: 'Mì Trộn Jjajang', description: 'Mì trộn sốt đen Jjajangmyeon Hàn Quốc', price: 45000, duration: 20, categoryId: catMap['mon-a'], ingredients: ['mì', 'thịt bò', 'đậu phụ', 'khoai tây', 'hành', 'sốt jjajang'], thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', isActive: true },
    { name: 'Phở Cuốn Hà Nội', description: 'Phở cuốn thịt bò tươi ngon', price: 45000, duration: 25, categoryId: catMap['mon-a'], ingredients: ['bánh phở', 'thịt bò', 'rau xà lách', 'hành', 'nước mắm'], thumbnail: 'https://images.unsplash.com/photo-1583224964978-2257b1c1c8e4?w=400', isActive: true },
    // Món Âu
    { name: 'Spaghetti Carbonara', description: 'Mì Ý sốt kem trứng với bacon giòn', price: 85000, duration: 25, categoryId: catMap['mon-au'], ingredients: ['mì spaghetti', 'bacon', 'trứng', 'phô mai parmesan', 'hạt tiêu'], thumbnail: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', isActive: true },
    { name: 'Pizza Margherita', description: 'Pizza Ý với cà chua, mozzarella và basil', price: 120000, duration: 30, categoryId: catMap['mon-au'], ingredients: ['bột pizza', 'cà chua', 'mozzarella', 'basil', 'dầu olive'], thumbnail: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', isActive: true },
    { name: 'Steak Bò Mỹ', description: 'Bít tết bò nướng perfection', price: 250000, duration: 20, categoryId: catMap['mon-au'], ingredients: ['bò', 'bơ', 'tỏi', 'hương thảo', 'muối', 'tiêu'], thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', isActive: true },
    { name: 'Salad Caesar', description: 'Salad Caesar với sốt kem đặc biệt', price: 65000, duration: 15, categoryId: catMap['mon-au'], ingredients: ['xà lách romaine', 'phô mai parmesan', 'bánh mì giòn', 'thịt hun khói', 'sốt caesar'], thumbnail: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', isActive: true },
    { name: 'French Onion Soup', description: 'Súp hành tây Pháp nướng phô mai', price: 75000, duration: 45, categoryId: catMap['mon-au'], ingredients: ['hành tây', 'phô mai gruyère', 'bánh mì', 'nước dùng bò', 'bơ'], thumbnail: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', isActive: true },
    { name: 'Lasagna Bolognese', description: 'Lasagna Ý nhiều lớp phô mai', price: 130000, duration: 50, categoryId: catMap['mon-au'], ingredients: ['bột lasagna', 'thịt bò', 'cà chua', 'mozzarella', 'ricotta', 'bột chiên'], thumbnail: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400', isActive: true },
    { name: 'Beef Burger', description: 'Burger bò phô mai thơm ngon', price: 95000, duration: 20, categoryId: catMap['mon-au'], ingredients: ['bánh mì burger', 'thịt bò', 'phô mai cheddar', 'xà lách', 'cà chua', 'sốt'], thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isActive: true },
    // Món Nhật
    { name: 'Sushi Cá Hồi', description: 'Sushi tươi sống với cá hồi Na Uy', price: 150000, duration: 35, categoryId: catMap['mon-nhat'], ingredients: ['cơm nếm dấm', 'cá hồi', 'rong biển', 'wasabi'], thumbnail: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', isActive: true },
    { name: 'Ramen Tonkotsu', description: 'Mì ramen nước dùng xương heo đậm đà', price: 95000, duration: 40, categoryId: catMap['mon-nhat'], ingredients: ['mì ramen', 'xương heo', 'trứng', 'chả', 'hành', 'tảo'], thumbnail: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', isActive: true },
    { name: 'Tempura Tôm', description: 'Tôm tempura giòn tan trong bột chiên', price: 85000, duration: 25, categoryId: catMap['mon-nhat'], ingredients: ['tôm', 'bột tempura', 'nước lạnh', 'dầu chiên'], thumbnail: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400', isActive: true },
    { name: 'Donburi Bò', description: 'Cơm nóng với thịt bò và trứng rán', price: 75000, duration: 20, categoryId: catMap['mon-nhat'], ingredients: ['cơm', 'thịt bò', 'trứng', 'hành', 'nước sốt'], thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', isActive: true },
    { name: 'Gyoza Nhật', description: 'Bánh bao nhồi thịt chiên giòn', price: 55000, duration: 25, categoryId: catMap['mon-nhat'], ingredients: ['bột gyoza', 'thịt heo', 'cabbage', 'hành', 'tỏi'], thumbnail: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400', isActive: true },
    // Món Hàn
    { name: 'Bibimbap', description: 'Cơm trộn Hàn Quốc đầy màu sắc', price: 70000, duration: 30, categoryId: catMap['mon-han'], ingredients: ['cơm', 'thịt bò', 'trứng', 'rau trộn', 'gochujang', 'dầu mè'], thumbnail: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400', isActive: true },
    { name: 'Samgyeopsal', description: 'Thịt ba chỉ nướng Hàn Quốc', price: 130000, duration: 30, categoryId: catMap['mon-han'], ingredients: ['thịt ba chỉ', 'tỏi', 'ớt', 'kimchi', 'xà lách'], thumbnail: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isActive: true },
    { name: 'Tteokbokki', description: 'Bánh gạo Hàn Quốc cay ngọt', price: 45000, duration: 20, categoryId: catMap['mon-han'], ingredients: ['bánh gạo', 'nước dùng', 'gochujang', 'trứng', 'hành'], thumbnail: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', isActive: true },
    { name: 'Kimchi Jjigae', description: 'Canh kim chi Hàn Quốc cay nồng', price: 55000, duration: 35, categoryId: catMap['mon-han'], ingredients: ['kimchi', 'thịt heo', 'đậu phụ', 'hành', 'tỏi', 'ớt bột'], thumbnail: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd5?w=400', isActive: true },
    { name: 'Korean Fried Chicken', description: 'Gà chiên Hàn Quốc giòn gấu đôi', price: 85000, duration: 35, categoryId: catMap['mon-han'], ingredients: ['gà', 'bột chiên', 'sốt gochujang', 'mật ong', 'tỏi'], thumbnail: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', isActive: true },
    { name: 'Japchae', description: 'Miến trộn Hàn Quốc đậm đà', price: 60000, duration: 25, categoryId: catMap['mon-han'], ingredients: ['miến', 'thịt bò', 'nấm', 'đậu phụ', 'rau', 'nước sốt'], thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', isActive: true },
    // Tráng miệng
    { name: 'New York Cheesecake', description: 'Bánh phô mai mịn màng New York style', price: 65000, duration: 45, categoryId: catMap['trang-mieng'], ingredients: ['phô mai cream', 'bánh quy', 'đường', 'trứng', 'vanilla'], thumbnail: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400', isActive: true },
    { name: 'Tiramisu', description: 'Bánh tiramisu Ý với cà phê và mascarpone', price: 75000, duration: 40, categoryId: catMap['trang-mieng'], ingredients: ['mascarpone', 'bánh ladyfinger', 'cà phê espresso', 'cocoa', 'đường'], thumbnail: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', isActive: true },
    { name: 'Panna Cotta', description: 'Panna cotta vanilla với sốt dâu', price: 55000, duration: 20, categoryId: catMap['trang-mieng'], ingredients: ['kem tươi', 'sữa', 'đường', 'vanilla', 'dâu tây'], thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', isActive: true },
    { name: 'Chè Ba Màu', description: 'Chè ba màu truyền thống Việt Nam', price: 25000, duration: 25, categoryId: catMap['trang-mieng'], ingredients: ['đậu xanh', 'đậu đỏ', 'nước cốt dừa', 'đường', 'bột năng'], thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', isActive: true },
    { name: 'Kem Vanilla', description: 'Kem vanilla homemade mịn màng', price: 35000, duration: 30, categoryId: catMap['trang-mieng'], ingredients: ['sữa', 'kem whipping', 'đường', 'vanilla', 'trứng'], thumbnail: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', isActive: true },
    { name: 'Chocolate Brownie', description: 'Bánh brownie sô cô la đậm đặc', price: 45000, duration: 30, categoryId: catMap['trang-mieng'], ingredients: ['sô cô la', 'bơ', 'đường', 'trứng', 'bột mì'], thumbnail: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', isActive: true },
    { name: 'Bánh Flan', description: 'Bánh flan caramel mềm mịn', price: 30000, duration: 35, categoryId: catMap['trang-mieng'], ingredients: ['trứng', 'sữa', 'đường', 'vanilla', 'caramel'], thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', isActive: true },
    // Đồ uống
    { name: 'Trà Sữa Trân Châu', description: 'Trà sữa Đài Loan với trân châu đen', price: 35000, duration: 10, categoryId: catMap['do-uong'], ingredients: ['trà', 'sữa', 'trân châu', 'đường'], thumbnail: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400', isActive: true },
    { name: 'Sinh Tố Bơ', description: 'Sinh tố bơ béo ngậy Việt Nam', price: 30000, duration: 5, categoryId: catMap['do-uong'], ingredients: ['bơ', 'sữa', 'đường', 'đá'], thumbnail: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400', isActive: true },
    { name: 'Cà Phê Sữa Đá', description: 'Cà phê Việt phin truyền thống', price: 25000, duration: 5, categoryId: catMap['do-uong'], ingredients: ['cà phê', 'sữa đặc', 'đá'], thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', isActive: true },
    { name: 'Matcha Latte', description: 'Trà xanh Nhật pha sữa', price: 45000, duration: 8, categoryId: catMap['do-uong'], ingredients: ['matcha', 'sữa', 'đường', 'đá'], thumbnail: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400', isActive: true },
    { name: 'Trà Đá Chanh', description: 'Trà đá chanh tươi mát ngày hè', price: 20000, duration: 5, categoryId: catMap['do-uong'], ingredients: ['trà', 'chanh', 'đường', 'đá'], thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', isActive: true },
    // Món chay
    { name: 'Đậu Khuôn Chiên', description: 'Đậu khuôn chiên giòn với nước sốt', price: 35000, duration: 20, categoryId: catMap['mon-chay'], ingredients: ['đậu khuôn', 'bột chiên', 'nước mắm', 'tỏi', 'đường'], thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', isActive: true },
    { name: 'Salad Rau Má', description: 'Salad rau má tươi mát cho ngày nắng', price: 25000, duration: 10, categoryId: catMap['mon-chay'], ingredients: ['rau má', 'đậu phộng', 'nước mắm', 'chanh', 'ớt'], thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', isActive: true },
    { name: 'Miến Trộn Chay', description: 'Miến trộn rau củ thanh đạm', price: 35000, duration: 20, categoryId: catMap['mon-chay'], ingredients: ['miến', 'nấm', 'đậu phụ', 'cà rốt', 'rau thơm'], thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', isActive: true },
    { name: 'Rau Muống Xào Tỏi', description: 'Rau muống xào tỏi giòn ngon', price: 25000, duration: 10, categoryId: catMap['mon-chay'], ingredients: ['rau muống', 'tỏi', 'nước mắm', 'dầu ăn'], thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', isActive: true },
    { name: 'Đậu Phụ Non Chiên', description: 'Đậu phụ non chiên giòn vàng', price: 30000, duration: 15, categoryId: catMap['mon-chay'], ingredients: ['đậu phụ non', 'bột chiên', 'nước mắm', 'tỏi'], thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', isActive: true },
  ];

  let added = 0;
  for (const r of recipes) {
    const exists = await Product.findOne({ name: r.name });
    if (!exists) {
      await Product.create(r);
      console.log('Added:', r.name);
      added++;
    }
  }

  const total = await Product.countDocuments();
  console.log('Seeded ' + added + ' new recipes. Total in DB: ' + total);
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
