const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    subcategory: {
      type: String,
      trim: true,
    },

    // Pricing
    price: {
      mrp: {
        type: Number,
        required: true,
      },
      selling: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
    },

    // Product Details
    description: {
      short: {
        type: String,
        maxlength: 200,
      },
      long: {
        type: String,
      },
    },

    // Features
    features: [
      {
        type: String,
      },
    ],

    // Applications
    applications: [
      {
        type: String,
      },
    ],

    // Technical Specifications
    specifications: {
      typeOfMachine: String,
      voltage: String,
      frequency: String,
      powerSource: String,
      burningAbility: String,
      weight: String,
      dimensions: String,
      paymentType: String,
      warranty: String,
      // CHANGED: colors is now an array instead of a string
      colors: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          hexCode: {
            type: String,
            trim: true,
          },
        },
      ],
      material: String,
      itemCode: String,
      burningCapacity: String,
      packagingDetails: String,
    },

    // Images - store filenames only
    images: [
      {
        type: String,
      },
    ],

    thumbnail: {
      type: String,
    },

    // YouTube Video URLs
    youtubeUrls: [
      {
        url: {
          type: String,
          trim: true,
        },
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],

    // Additional Information
    additionalInfo: {
      itemCode: String,
      deliveryTime: String,
      minOrderQuantity: Number,
      customizationAvailable: {
        type: Boolean,
        default: false,
      },
    },

    // Shipping
    shipping: {
      time: String,
      freeShipping: {
        type: Boolean,
        default: false,
      },
      weight: Number,
    },

    // Policies
    policies: {
      noRefund: {
        type: Boolean,
        default: false,
      },
      exchangeOnly: {
        type: Boolean,
        default: true,
      },
      inHouseManufacturing: {
        type: Boolean,
        default: false,
      },
    },

    // Ratings and Reviews
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Stock Management
    stock: {
      available: {
        type: Number,
        default: 0,
      },
      lowStockAlert: {
        type: Number,
        default: 5,
      },
      status: {
        type: String,
        enum: ["In Stock", "Out of Stock", "Limited Stock", "Pre-Order"],
        default: "In Stock",
      },
    },

    // SEO
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    // Status
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    // Created/Updated By
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Set thumbnail to first image if images exist
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0];
  }
});

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.price.mrp && this.price.selling) {
    return Math.round(
      ((this.price.mrp - this.price.selling) / this.price.mrp) * 100
    );
  }
  return 0;
});

// Ensure virtuals are included in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);