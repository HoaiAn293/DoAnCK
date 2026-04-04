// ============================================
// SEED.JS - INITIALIZE FOOD RECIPE DATA
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_recipes';
    await mongoose.connect(uri);
    console.log('[INFO] MongoDB connected for seeding');
  } catch (error) {
    console.error('[ERROR] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedCategories = async () => {
  try {
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      await Category.deleteMany({});
      console.log('[INFO] Cleared existing categories');
    }

    const categories = [
      { name: 'Món nước', slug: 'mon-nuoc', description: 'Các món bún, phở, mì...' },
      { name: 'Món khô', slug: 'mon-kho', description: 'Các món cơm, xôi...' },
      { name: 'Món khai vị', slug: 'khai-vi', description: 'Các món gỏi, salad...' },
      { name: 'Tráng miệng', slug: 'trang-mieng', description: 'Các món chè, bánh...' },
    ];

    const docs = await Category.insertMany(categories);
    console.log('[SUCCESS] Created ' + docs.length + ' categories');
    return docs;
  } catch (error) {
    console.error('[ERROR] Error seeding categories:', error.message);
  }
};

const seedProducts = async (categories) => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      await Product.deleteMany({});
      console.log('[INFO] Cleared existing products');
    }

    const monNuoc = categories.find(c => c.name === 'Món nước')._id;
    const monKho = categories.find(c => c.name === 'Món khô')._id;
    const khaiVi = categories.find(c => c.name === 'Món khai vị')._id;

    const products = [
      {
        name: 'Phở Bò',
        description: 'Phở bò truyền thống Hà Nội',
        price: 55000,
        duration: 20,
        thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60',
        ingredients: ['Thịt bò', 'Bánh phở', 'Hành lá', 'Gừng', 'Hồi'],
        categoryId: monNuoc
      },
      {
        name: 'Bún Chả',
        description: 'Bún chả nướng than hoa',
        price: 45000,
        duration: 25,
        thumbnail: 'https://images.unsplash.com/photo-1564834724105-918b7ae10add?w=500&auto=format&fit=crop&q=60',
        ingredients: ['Thịt heo', 'Bún', 'Đu đủ', 'Cà rốt', 'Nước mắm'],
        categoryId: monNuoc
      },
      {
        name: 'Cơm Tấm Sườn Bì Chả',
        description: 'Cơm tấm Sài Gòn đặc biệt',
        price: 50000,
        duration: 15,
        thumbnail: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=60',
        ingredients: ['Gạo tấm', 'Sườn heo', 'Trứng', 'Dưa leo', 'Hành mỡ'],
        categoryId: monKho
      },
      {
        name: 'Salad Gà Áp Chảo',
        description: 'Salad gà ít béo cho người ăn kiêng',
        price: 65000,
        duration: 15,
        thumbnail: 'https://images.unsplash.com/photo-1546793665-c74683c3f38d?w=500&auto=format&fit=crop&q=60',
        ingredients: ['Thịt gà', 'Xà lách', 'Cà chua', 'Trứng', 'Sốt mè'],
        categoryId: khaiVi
      },
      {
        name: 'Bún Bò Huế',
        description: 'Bún bò chuẩn vị Huế',
        price: 60000,
        duration: 30,
        thumbnail: 'https://images.unsplash.com/photo-1621348160394-211805933b93?w=500&auto=format&fit=crop&q=60',
        ingredients: ['Thịt bò', 'Chân giò heo', 'Bún', 'Mắm ruốc', 'Sả'],
        categoryId: monNuoc
      }
    ];

    await Product.insertMany(products);
    console.log('[SUCCESS] Created ' + products.length + ' sample dishes');
  } catch (error) {
    console.error('[ERROR] Error seeding dishes:', error.message);
  }
};

const seed = async () => {
  try {
    await connectDB();
    console.log('[INFO] SEEDING FOOD RECIPE DATABASE...');

    const categories = await seedCategories();
    await seedProducts(categories);

    console.log('[SUCCESS] DATABASE SEEDING COMPLETED!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seeding failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
