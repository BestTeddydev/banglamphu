// MongoDB initialization script
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'banglamphu');

// Create application user
db.createUser({
  user: process.env.MONGO_APP_USERNAME || 'banglamphu_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'banglamphu_password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE || 'banglamphu'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
        password: { bsonType: 'string' },
        role: { bsonType: 'string', enum: ['user', 'admin'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('attractions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'coordinates'],
      properties: {
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        coordinates: {
          bsonType: 'object',
          required: ['lat', 'lng'],
          properties: {
            lat: { bsonType: 'number' },
            lng: { bsonType: 'number' }
          }
        },
        images: { bsonType: 'array' },
        isActive: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('packages', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price'],
      properties: {
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        price: { bsonType: 'number' },
        duration: { bsonType: 'number' },
        maxParticipants: { bsonType: 'number' },
        includes: { bsonType: 'array' },
        itinerary: { bsonType: 'array' },
        attractions: { bsonType: 'array' },
        images: { bsonType: 'array' },
        isActive: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('restaurants', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'coordinates'],
      properties: {
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        coordinates: {
          bsonType: 'object',
          required: ['lat', 'lng'],
          properties: {
            lat: { bsonType: 'number' },
            lng: { bsonType: 'number' }
          }
        },
        images: { bsonType: 'array' },
        isActive: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('bookings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user', 'package', 'date', 'participants'],
      properties: {
        user: { bsonType: 'objectId' },
        package: { bsonType: 'objectId' },
        date: { bsonType: 'date' },
        participants: { bsonType: 'number' },
        status: { bsonType: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
        totalPrice: { bsonType: 'number' },
        paymentStatus: { bsonType: 'string', enum: ['pending', 'paid', 'refunded'] },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

db.createCollection('research', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'pdfFile'],
      properties: {
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        authors: { bsonType: 'array' },
        abstract: { bsonType: 'string' },
        keywords: { bsonType: 'array' },
        pdfFile: { bsonType: 'string' },
        category: { bsonType: 'string' },
        year: { bsonType: 'number' },
        isActive: { bsonType: 'bool' },
        publishedAt: { bsonType: 'date' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.attractions.createIndex({ coordinates: '2dsphere' });
db.attractions.createIndex({ isActive: 1 });
db.packages.createIndex({ isActive: 1 });
db.packages.createIndex({ price: 1 });
db.restaurants.createIndex({ coordinates: '2dsphere' });
db.restaurants.createIndex({ isActive: 1 });
db.bookings.createIndex({ user: 1 });
db.bookings.createIndex({ package: 1 });
db.bookings.createIndex({ date: 1 });
db.bookings.createIndex({ status: 1 });
db.research.createIndex({ isActive: 1 });
db.research.createIndex({ category: 1 });
db.research.createIndex({ year: 1 });

print('MongoDB initialization completed successfully!');
