/* 
=========================================
  TradeVithika Application Logic
  SPA Router, LocalDB State & Dashboard
  Dual Auth & Role Isolation Controller
  Advanced VendorOS Upgrade Core
=========================================
*/

// --- SUPABASE CLOUD DATABASE CONNECTION ---
const SUPABASE_URL = "https://ccabwgdkxnlkcqrptryw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Bt_Vf0V_y-MLd0tX5nssAQ_aeLLvFLi";
var supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Initial Mock Database Seed Data
const DEFAULT_SUPPLIERS = [
  {
    id: "supplier-1",
    name: "Rajesh Agro Traders",
    contactPerson: "Rajesh Patel",
    phone: "9876543210",
    email: "rajesh@agrotraders.com",
    password: "password",
    district: "Raisen",
    businessType: "Aggregator",
    commodities: ["Soybean", "Wheat"],
    verified: "verified", // verified, pending, unverified
    rating: 4.8,
    reviewsCount: 42,
    responseTime: "4 hours",
    responseRate: "94%",
    totalInquiries: 230,
    views: 248,
    about: "We are bulk grain aggregators active in Raisen and nearby mandis for over 15 years. We ensure high-quality FAQ grades and direct warehouse deliveries.",
    onboardingProgress: 50,
    docsUploaded: {
      aadhaar: true,
      gst: true,
      fssai: false,
      land: false
    }
  },
  {
    id: "supplier-2",
    name: "MP Grain House",
    contactPerson: "Shailendra Sharma",
    phone: "9123456789",
    email: "contact@mpgrains.com",
    password: "password",
    district: "Sehore",
    businessType: "Warehouse Owner",
    commodities: ["Chana", "Garlic"],
    verified: "verified",
    rating: 4.6,
    reviewsCount: 28,
    responseTime: "6 hours",
    responseRate: "89%",
    totalInquiries: 112,
    views: 185,
    about: "State-of-the-art warehousing and bulk trading facility in Sehore. Specializing in Chickpea storage and high-grade garlic supply.",
    onboardingProgress: 100,
    docsUploaded: {
      aadhaar: true,
      gst: true,
      fssai: true,
      land: true
    }
  },
  {
    id: "supplier-3",
    name: "Shri Balaji Agri Co.",
    contactPerson: "Dinesh Yadav",
    phone: "9405678123",
    email: "dinesh@balajiagri.com",
    password: "password",
    district: "Hoshangabad",
    businessType: "Farmer",
    commodities: ["Soybean", "Wheat", "Chana"],
    verified: "pending",
    rating: 4.9,
    reviewsCount: 19,
    responseTime: "2 hours",
    responseRate: "98%",
    totalInquiries: 95,
    views: 140,
    about: "Farmer producer cooperative from Hoshangabad. Direct from farms with certified moisture standards and transparent weights.",
    onboardingProgress: 75,
    docsUploaded: {
      aadhaar: true,
      gst: true,
      fssai: true,
      land: false
    }
  }
];

const DEFAULT_BUYERS = [
  {
    id: "buyer-1",
    name: "Ramesh Shah",
    companyName: "Bhopal Flour & Semolina Mills",
    phone: "9826011223",
    email: "ramesh@flourmill.com",
    password: "password",
    city: "Bhopal",
    savedSuppliers: ["supplier-1", "supplier-3"]
  }
];

const DEFAULT_LISTINGS = [
  {
    id: "listing-1",
    supplierId: "supplier-1",
    title: "Grade A Soybean — Ready Stock",
    commodity: "Soybean",
    hindiTitle: "सोयाबीन",
    variety: "JS-335",
    grade: "FAQ (Fair Average Quality)",
    moisture: "12%",
    quantity: 500, // quintal
    price: 4200, // per quintal
    minOrder: 100, // quintal
    packaging: "50kg Gunny Bags",
    delivery: "Ex-Warehouse, Raisen",
    harvestYear: "2024-25",
    district: "Raisen",
    taluka: "Gairatganj",
    postedDaysAgo: 2,
    views: 89,
    inquiries: 14,
    status: "active", // active, paused, pending
    description: "Excellent quality yellow Soybean JS-335 grade with low moisture and clean sorting. Direct ex-warehouse loading available. Weighment done on certified electronic scale at warehouse."
  },
  {
    id: "listing-2",
    supplierId: "supplier-1",
    title: "Premium Lokwan Sharbati Wheat",
    commodity: "Wheat",
    hindiTitle: "गेहूँ",
    variety: "Lokwan / Sharbati",
    grade: "Premium Bold",
    moisture: "11%",
    quantity: 800,
    price: 2250,
    minOrder: 150,
    packaging: "50kg Gunny Bags",
    delivery: "Can arrange transport",
    harvestYear: "2024-25",
    district: "Raisen",
    taluka: "Begumganj",
    postedDaysAgo: 4,
    views: 120,
    inquiries: 18,
    status: "active",
    description: "Super quality Sharbati wheat, direct from the heart of Madhya Pradesh. Known for rich golden grain size, perfect for premium flour mills and food processors."
  },
  {
    id: "listing-3",
    supplierId: "supplier-2",
    title: "Desi Chickpea (Chana) Bold Size",
    commodity: "Chana",
    hindiTitle: "चना",
    variety: "Desi Chana",
    grade: "FAQ Grade 1",
    moisture: "10.5%",
    quantity: 400,
    price: 5800,
    minOrder: 50,
    packaging: "50kg Jute Bags",
    delivery: "Ex-Warehouse, Sehore",
    harvestYear: "2024-25",
    district: "Sehore",
    taluka: "Ashta",
    postedDaysAgo: 1,
    views: 45,
    inquiries: 8,
    status: "active",
    description: "Top-tier bold Desi Chana harvested from Sehore. Professionally cleaned, zero weevil damage, ideal for packing or direct retail distribution."
  },
  {
    id: "listing-4",
    supplierId: "supplier-2",
    title: "Ooty Garlic (Lahsun) Extra Large",
    commodity: "Garlic",
    hindiTitle: "लहसुन",
    variety: "G2 Bold",
    grade: "Premium Bold (40mm+)",
    moisture: "Dry (Cured)",
    quantity: 120,
    price: 12500,
    minOrder: 20,
    packaging: "25kg Mesh Bags",
    delivery: "Ex-Warehouse, Sehore",
    harvestYear: "2024-25",
    district: "Sehore",
    taluka: "Ichhawar",
    postedDaysAgo: 3,
    views: 92,
    inquiries: 22,
    status: "active",
    description: "Fully dry and cured extra large Garlic cloves (G2 variety). Superior shelf life, white bulbs with strong aroma, ready for bulk shipment."
  },
  {
    id: "listing-5",
    supplierId: "supplier-3",
    title: "Organic Kalyan Sona Wheat",
    commodity: "Wheat",
    hindiTitle: "गेहूँ",
    variety: "Kalyan Sona",
    grade: "Standard FAQ",
    moisture: "12%",
    quantity: 350,
    price: 2150,
    minOrder: 80,
    packaging: "50kg Gunny Bags",
    delivery: "Ex-Farm, Hoshangabad",
    harvestYear: "2024-25",
    district: "Hoshangabad",
    taluka: "Itarsi",
    postedDaysAgo: 5,
    views: 63,
    inquiries: 9,
    status: "active",
    description: "Kalyan Sona Wheat grown organically. Direct collection from farm gate. Transparent weighing and assistance in loading provided."
  }
];

const DEFAULT_INQUIRIES = [
  {
    id: "inq-1",
    listingId: "listing-1",
    supplierId: "supplier-1",
    buyerId: "buyer-1",
    buyerName: "Ramesh Shah",
    companyName: "Bhopal Flour & Semolina Mills",
    phone: "9826011223",
    quantity: 200,
    location: "Bhopal, MP",
    message: "Need Grade A soybean for our January batch. Please share availability dates and if price is negotiable for immediate payment.",
    date: "2026-05-26",
    status: "new",
    replies: []
  },
  {
    id: "inq-2",
    listingId: "listing-2",
    supplierId: "supplier-1",
    buyerId: "buyer-1",
    buyerName: "Ramesh Shah",
    companyName: "Bhopal Flour & Semolina Mills",
    phone: "9826011223",
    quantity: 500,
    location: "Bhopal, MP",
    message: "Interested in the Premium Lokwan Sharbati Wheat. We require shipping to our Indore sorting facility. Can you arrange transport?",
    date: "2026-05-27",
    status: "replied",
    replies: [
      {
        sender: "supplier",
        text: "Yes Ramesh, we have tie-ups with local transporters in Raisen and can arrange fully covered trucks to Bhopal/Indore. Rates will be extra at actuals.",
        date: "2026-05-27"
      }
    ]
  }
];

// Seeded Alerts Notification List
const DEFAULT_NOTIFICATIONS = [
  {
    id: "noti-1",
    supplierId: "supplier-1",
    title: "New Inquiry Received",
    text: "Vijay Agrawal submitted a query for yellow Soybean JS-335 lot.",
    date: "Today, 4:30 PM",
    read: false
  },
  {
    id: "noti-2",
    supplierId: "supplier-1",
    title: "GST Document Approved",
    text: "Your GST Certificate has been successfully validated by the TradeVithika admin team.",
    date: "Yesterday, 2:15 PM",
    read: true
  },
  {
    id: "noti-3",
    supplierId: "supplier-1",
    title: "Complete Onboarding",
    text: "Upload remaining license/warehouse documents to unlock the verified checkmark badge.",
    date: "May 25",
    read: true
  }
];

const DEFAULT_BLOGS = [
  {
    id: "blog-1",
    title: "Maximizing Soybean Yields: JS-335 Cultivation Guide",
    author: "Dr. Arvind Pathak (Agri Research MP)",
    date: "2026-05-15",
    category: "Crop Cultivation",
    summary: "Essential practices, moisture control, and modern sowing methodologies to maximize yellow soybean yields in Raisen and Vidisha.",
    content: "Madhya Pradesh is the soybean bowl of India. The JS-335 variety has revolutionized yields across central India. However, to unlock maximum yield potentials, farmers must ensure strict moisture management (retaining 11-12% average moisture) and implement organic organic compost during seed dressing. Sowing in flat-ridge systems significantly improves soil aeration and protects crops during heavy monsoon spells in Raisen. Professional grain sorting at local warehouses ensures FAQ Grade 1, which trades at 10-15% premium rates over base Mandi price logs.",
    readTime: "4 min read",
    image: "🌱"
  },
  {
    id: "blog-2",
    title: "Understanding B2B Direct Crop Contracts on TradeVithika",
    author: "TradeVithika Operations Team",
    date: "2026-05-20",
    category: "Policy Upgrades",
    summary: "How bulk grain processors and farmer cooperatives negotiate and lock instant transaction prices without middlemen fees.",
    content: "TradeVithika's newly introduced B2B checkout contract suite allows flour mills and warehouses to lock high-volume deals directly with MP aggregators. By eliminating the typical 2-4% commission fees collected by traditional mandi brokers, buyers enjoy direct ex-warehouse loading rates while suppliers receive instant payments. The B2B checkout modal allows custom Letter of Credit (LC) payment clauses and platform-facilitated logistics, creating secure, auditable, and legally-binding transaction agreements.",
    readTime: "5 min read",
    image: "🤝"
  },
  {
    id: "blog-3",
    title: "Wheat Market Outlook: Sharbati Pricing Trends 2026",
    author: "Alok Gupta (Agricultural Economist)",
    date: "2026-05-28",
    category: "Market Insights",
    summary: "Analyzing bold Lokwan and premium Sharbati wheat demand shifts, mandi arrivals, and warehousing pricing forecasts.",
    content: "MP's Sharbati Wheat, famous for its golden grain boldness and sweet wheat flour texture, is commanding record-high prices this season. Direct warehouse collections in Sehore and Hoshangabad show that millers are bypassing public mandis due to quality-grade consistency issues. With our live OGD market ticker tracking regional mandi fluctuations in real time, millers can easily verify whether listed private wholesale lots are offering competitive best-deal discount margins. We anticipate Sharbati pricing to remain strong at ₹2,200-₹2,400 per quintal throughout the coming quarter.",
    readTime: "3 min read",
    image: "🌾"
  }
];

// Local Database Controller
class LocalDB {
  static dbCache = {
    suppliers: null,
    buyers: null,
    listings: null,
    inquiries: null,
    notifications: null,
    orders: null,
    blogs: null
  };

  static async prefetchCloudData() {
    if (supabase) {
      try {
        const [supsRes, buyersRes, listingsRes, inquiriesRes, notisRes, ordersRes, blogsRes] = await Promise.all([
          supabase.from('suppliers').select('*'),
          supabase.from('buyers').select('*'),
          supabase.from('listings').select('*'),
          supabase.from('inquiries').select('*'),
          supabase.from('notifications').select('*'),
          supabase.from('orders').select('*'),
          supabase.from('blogs').select('*')
        ]);

        if (!supsRes.error && supsRes.data && supsRes.data.length > 0) {
          this.dbCache.suppliers = supsRes.data.map(s => ({
            id: s.id,
            name: s.name,
            contactPerson: s.contact_person,
            phone: s.phone,
            email: s.email,
            password: s.password,
            district: s.district,
            businessType: s.business_type,
            commodities: s.commodities,
            verified: s.verified,
            rating: Number(s.rating) || 5.0,
            reviewsCount: s.reviews_count,
            responseTime: s.response_time,
            responseRate: s.response_rate,
            totalInquiries: s.total_inquiries,
            views: s.views,
            about: s.about,
            onboardingProgress: s.onboarding_progress,
            docsUploaded: typeof s.docs_uploaded === 'string' ? this.safeParse(s.docs_uploaded, {}) : s.docs_uploaded || {}
          }));
          localStorage.setItem("tv_suppliers", JSON.stringify(this.dbCache.suppliers));
        }

        if (!buyersRes.error && buyersRes.data && buyersRes.data.length > 0) {
          this.dbCache.buyers = buyersRes.data.map(b => ({
            id: b.id,
            name: b.name,
            companyName: b.company_name,
            phone: b.phone,
            email: b.email,
            password: b.password,
            city: b.city,
            savedSuppliers: b.saved_suppliers || []
          }));
          localStorage.setItem("tv_buyers", JSON.stringify(this.dbCache.buyers));
        }

        if (!listingsRes.error && listingsRes.data && listingsRes.data.length > 0) {
          this.dbCache.listings = listingsRes.data.map(l => ({
            id: l.id,
            supplierId: l.supplier_id,
            title: l.title,
            commodity: l.commodity,
            hindiTitle: l.hindi_title,
            variety: l.variety,
            grade: l.grade,
            moisture: l.moisture,
            quantity: l.quantity,
            price: l.price,
            minOrder: l.min_order,
            packaging: l.packaging,
            delivery: l.delivery,
            harvestYear: l.harvest_year,
            district: l.district,
            taluka: l.taluka,
            postedDaysAgo: l.posted_days_ago,
            views: l.views,
            inquiries: l.inquiries,
            status: l.status,
            description: l.description
          }));
          localStorage.setItem("tv_listings", JSON.stringify(this.dbCache.listings));
        }

        if (!inquiriesRes.error && inquiriesRes.data && inquiriesRes.data.length > 0) {
          this.dbCache.inquiries = inquiriesRes.data.map(i => ({
            id: i.id,
            listingId: i.listing_id,
            supplierId: i.supplier_id,
            buyerId: i.buyer_id,
            buyerName: i.buyer_name,
            companyName: i.company_name,
            phone: i.phone,
            quantity: i.quantity,
            offeredRate: i.offered_rate,
            location: i.location,
            message: i.message,
            date: i.date,
            status: i.status,
            replies: typeof i.replies === 'string' ? this.safeParse(i.replies, []) : i.replies || []
          }));
          localStorage.setItem("tv_inquiries", JSON.stringify(this.dbCache.inquiries));
        }

        if (!notisRes.error && notisRes.data && notisRes.data.length > 0) {
          this.dbCache.notifications = notisRes.data.map(n => ({
            id: n.id,
            supplierId: n.supplier_id,
            title: n.title,
            text: n.text,
            date: n.date,
            read: n.read
          }));
          localStorage.setItem("tv_notifications", JSON.stringify(this.dbCache.notifications));
        }

        if (!ordersRes.error && ordersRes.data && ordersRes.data.length > 0) {
          this.dbCache.orders = ordersRes.data.map(o => ({
            id: o.id,
            listingId: o.listing_id,
            buyerId: o.buyer_id,
            supplierId: o.supplier_id,
            quantity: o.quantity,
            unitPrice: o.unit_price,
            totalAmount: o.total_amount,
            paymentTerms: o.payment_terms,
            logisticsType: o.logistics_type,
            orderStatus: o.order_status,
            orderDate: o.order_date
          }));
          localStorage.setItem("tv_orders", JSON.stringify(this.dbCache.orders));
        }

        if (blogsRes && !blogsRes.error && blogsRes.data && blogsRes.data.length > 0) {
          this.dbCache.blogs = blogsRes.data.map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            date: b.date,
            category: b.category,
            summary: b.summary,
            content: b.content,
            readTime: b.read_time || b.readTime || "5 min read",
            image: b.image || "🌱"
          }));
          localStorage.setItem("tv_blogs", JSON.stringify(this.dbCache.blogs));
        }
      } catch (e) {
        console.warn("Cloud prefetch failed, using local/cached copies.", e);
      }
    }
  }

  static init() {
    if (!localStorage.getItem("tv_suppliers")) {
      localStorage.setItem("tv_suppliers", JSON.stringify(DEFAULT_SUPPLIERS));
    }
    if (!localStorage.getItem("tv_buyers")) {
      localStorage.setItem("tv_buyers", JSON.stringify(DEFAULT_BUYERS));
    }
    if (!localStorage.getItem("tv_listings")) {
      localStorage.setItem("tv_listings", JSON.stringify(DEFAULT_LISTINGS));
    }
    if (!localStorage.getItem("tv_inquiries")) {
      localStorage.setItem("tv_inquiries", JSON.stringify(DEFAULT_INQUIRIES));
    }
    if (!localStorage.getItem("tv_notifications")) {
      localStorage.setItem("tv_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
    if (!localStorage.getItem("tv_orders")) {
      localStorage.setItem("tv_orders", "[]");
    }
    if (!localStorage.getItem("tv_blogs")) {
      localStorage.setItem("tv_blogs", JSON.stringify(DEFAULT_BLOGS));
    }
    if (!localStorage.getItem("tv_logged_user")) {
      localStorage.setItem("tv_logged_user", "null"); 
    }

    // Initialize Memory Cache from Local Storage
    this.dbCache.suppliers = this.safeParse(localStorage.getItem("tv_suppliers"), DEFAULT_SUPPLIERS);
    this.dbCache.buyers = this.safeParse(localStorage.getItem("tv_buyers"), DEFAULT_BUYERS);
    this.dbCache.listings = this.safeParse(localStorage.getItem("tv_listings"), DEFAULT_LISTINGS);
    this.dbCache.inquiries = this.safeParse(localStorage.getItem("tv_inquiries"), DEFAULT_INQUIRIES);
    this.dbCache.notifications = this.safeParse(localStorage.getItem("tv_notifications"), DEFAULT_NOTIFICATIONS);
    this.dbCache.orders = this.safeParse(localStorage.getItem("tv_orders"), []);
    this.dbCache.blogs = this.safeParse(localStorage.getItem("tv_blogs"), DEFAULT_BLOGS);
  }

  static safeParse(val, fallback) {
    try {
      return val ? JSON.parse(val) : fallback;
    } catch(e) {
      return fallback;
    }
  }

  // --- SYNCHRONOUS GETTERS ---
  static getSuppliers() {
    if (!this.dbCache.suppliers) this.init();
    return this.dbCache.suppliers;
  }

  static getBuyers() {
    if (!this.dbCache.buyers) this.init();
    return this.dbCache.buyers;
  }

  static getListings() {
    if (!this.dbCache.listings) this.init();
    return this.dbCache.listings;
  }

  static getInquiries() {
    if (!this.dbCache.inquiries) this.init();
    return this.dbCache.inquiries;
  }

  static getNotifications() {
    if (!this.dbCache.notifications) this.init();
    return this.dbCache.notifications;
  }

  static getOrders() {
    if (!this.dbCache.orders) this.init();
    return this.dbCache.orders;
  }

  static getBlogs() {
    if (!this.dbCache.blogs) this.init();
    return this.dbCache.blogs;
  }

  // --- SYNCHRONOUS AND ASYNC WRITES ---
  static saveSuppliers(suppliers) {
    this.dbCache.suppliers = suppliers;
    localStorage.setItem("tv_suppliers", JSON.stringify(suppliers));
    if (supabase) {
      suppliers.forEach(async s => {
        try {
          await supabase.from('suppliers').upsert({
            id: s.id,
            name: s.name,
            contact_person: s.contactPerson,
            phone: s.phone,
            email: s.email,
            password: s.password,
            district: s.district,
            business_type: s.businessType,
            commodities: s.commodities,
            verified: s.verified,
            rating: s.rating,
            reviews_count: s.reviewsCount,
            response_time: s.responseTime,
            response_rate: s.responseRate,
            total_inquiries: s.totalInquiries,
            views: s.views,
            about: s.about,
            onboarding_progress: s.onboardingProgress,
            docs_uploaded: typeof s.docsUploaded === 'object' ? JSON.stringify(s.docsUploaded) : s.docsUploaded
          });
        } catch (e) {
          console.warn("Supabase suppliers save error:", e);
        }
      });
    }
  }

  static saveBuyers(buyers) {
    this.dbCache.buyers = buyers;
    localStorage.setItem("tv_buyers", JSON.stringify(buyers));
    if (supabase) {
      buyers.forEach(async b => {
        try {
          await supabase.from('buyers').upsert({
            id: b.id,
            name: b.name,
            company_name: b.companyName,
            phone: b.phone,
            email: b.email,
            password: b.password,
            city: b.city,
            saved_suppliers: b.savedSuppliers
          });
        } catch (e) {
          console.warn("Supabase buyers save error:", e);
        }
      });
    }
  }

  static saveListings(listings) {
    this.dbCache.listings = listings;
    localStorage.setItem("tv_listings", JSON.stringify(listings));
    if (supabase) {
      listings.forEach(async l => {
        try {
          await supabase.from('listings').upsert({
            id: l.id,
            supplier_id: l.supplierId,
            title: l.title,
            commodity: l.commodity,
            hindi_title: l.hindiTitle,
            variety: l.variety,
            grade: l.grade,
            moisture: l.moisture,
            quantity: l.quantity,
            price: l.price,
            min_order: l.minOrder,
            packaging: l.packaging,
            delivery: l.delivery,
            harvest_year: l.harvestYear,
            district: l.district,
            taluka: l.taluka,
            posted_days_ago: l.postedDaysAgo,
            views: l.views,
            inquiries: l.inquiries,
            status: l.status,
            description: l.description
          });
        } catch (e) {
          console.warn("Supabase listings save error:", e);
        }
      });
    }
  }

  static saveInquiries(inquiries) {
    this.dbCache.inquiries = inquiries;
    localStorage.setItem("tv_inquiries", JSON.stringify(inquiries));
    if (supabase) {
      inquiries.forEach(async i => {
        try {
          await supabase.from('inquiries').upsert({
            id: i.id,
            listing_id: i.listingId,
            supplier_id: i.supplierId,
            buyer_id: i.buyerId,
            buyer_name: i.buyerName,
            company_name: i.companyName,
            phone: i.phone,
            quantity: i.quantity,
            offered_rate: i.offeredRate,
            location: i.location,
            message: i.message,
            date: i.date,
            status: i.status,
            replies: typeof i.replies === 'object' ? JSON.stringify(i.replies) : i.replies
          });
        } catch (e) {
          console.warn("Supabase inquiries save error:", e);
        }
      });
    }
  }

  static saveNotifications(notifications) {
    this.dbCache.notifications = notifications;
    localStorage.setItem("tv_notifications", JSON.stringify(notifications));
    if (supabase) {
      notifications.forEach(async n => {
        try {
          await supabase.from('notifications').upsert({
            id: n.id,
            supplier_id: n.supplierId,
            title: n.title,
            text: n.text,
            date: n.date,
            read: n.read
          });
        } catch (e) {
          console.warn("Supabase notifications save error:", e);
        }
      });
    }
  }

  static saveOrder(o) {
    if (!this.dbCache.orders) this.dbCache.orders = [];
    this.dbCache.orders.unshift(o);
    localStorage.setItem("tv_orders", JSON.stringify(this.dbCache.orders));
    if (supabase) {
      try {
        supabase.from('orders').insert({
          id: o.id,
          listing_id: o.listingId,
          buyer_id: o.buyerId,
          supplier_id: o.supplierId,
          quantity: o.quantity,
          unit_price: o.unitPrice,
          total_amount: o.totalAmount,
          payment_terms: o.paymentTerms,
          logistics_type: o.logisticsType,
          order_status: o.orderStatus,
          order_date: o.orderDate
        }).then(({ error }) => {
          if (error) console.warn("Supabase order insert error:", error);
        });
      } catch (e) {
        console.warn("Supabase order insert catch:", e);
      }
    }
  }

  static saveBlogs(blogs) {
    this.dbCache.blogs = blogs;
    localStorage.setItem("tv_blogs", JSON.stringify(blogs));
    if (supabase) {
      blogs.forEach(async b => {
        try {
          await supabase.from('blogs').upsert({
            id: b.id,
            title: b.title,
            author: b.author,
            date: b.date,
            category: b.category,
            summary: b.summary,
            content: b.content,
            read_time: b.readTime,
            image: b.image
          });
        } catch (e) {
          console.warn("Supabase blogs save error:", e);
        }
      });
    }
  }

  static deleteBlog(id) {
    this.dbCache.blogs = this.dbCache.blogs.filter(b => b.id !== id);
    localStorage.setItem("tv_blogs", JSON.stringify(this.dbCache.blogs));
    if (supabase) {
      try {
        supabase.from('blogs').delete().eq('id', id).then(({ error }) => {
          if (error) console.warn("Supabase blog delete error:", error);
        });
      } catch (e) {
        console.warn("Supabase blog delete catch:", e);
      }
    }
  }

  // --- LOCAL USER METHODS ---
  static getLoggedUser() {
    const val = localStorage.getItem("tv_logged_user");
    return val === "null" ? null : JSON.parse(val);
  }

  static setLoggedUser(userObj) {
    localStorage.setItem("tv_logged_user", userObj ? JSON.stringify(userObj) : "null");
  }

  static logout() {
    this.setLoggedUser(null);
    localStorage.removeItem("tv_logged_supplier");
  }

  static getLoggedSupplierId() {
    return localStorage.getItem("tv_logged_supplier");
  }

  static getLoggedSupplier() {
    const id = this.getLoggedSupplierId();
    return this.getSuppliers().find(s => s.id === id);
  }
}

// --- REGIONAL MANDI MARKET SERVICES & API CONNECTORS ---
const MANDI_API_KEY = "df1c6f7aa80b0e016a96754e543cb8da605eaeec907cd33530e4211e28a79522";

class MandiService {
  static apiData = null;

  static async fetchLiveRates() {
    try {
      const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a86454360edd?api-key=${MANDI_API_KEY}&format=json&limit=100&filters[state]=Madhya Pradesh`);
      if (response.ok) {
        const json = await response.json();
        if (json.records && json.records.length > 0) {
          this.apiData = json.records;
          localStorage.setItem("tv_live_mandi_rates", JSON.stringify(json.records));
          console.log("Successfully loaded live Mandi rates from OGD API:", json.records.length, "records");
          return true;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch live Mandi rates, using cached/mock fallback.", e);
    }
    
    // Load from cache if fetch failed
    const cached = localStorage.getItem("tv_live_mandi_rates");
    if (cached) {
      try {
        this.apiData = JSON.parse(cached);
        return true;
      } catch (e) {}
    }
    return false;
  }

  static getMandiRate(commodity, district) {
    if (this.apiData) {
      const match = this.apiData.find(r => {
        const apiComm = (r.commodity || "").toLowerCase();
        const apiDist = (r.district || "").toLowerCase();
        const targetComm = commodity.toLowerCase();
        const targetDist = district ? district.toLowerCase() : "";
        
        let commMatch = apiComm.includes(targetComm);
        if (targetComm === "chana") {
          commMatch = commMatch || apiComm.includes("chana") || apiComm.includes("gram") || apiComm.includes("chickpea");
        }
        
        const distMatch = targetDist ? apiDist.includes(targetDist) : true;
        return commMatch && distMatch;
      });

      if (match && match.modal_price) {
        const price = parseFloat(match.modal_price);
        if (!isNaN(price) && price > 0) {
          return price;
        }
      }
    }

    const base = this.getBaseMandiRate(commodity);
    let seed = 0;
    if (district) {
      for (let i = 0; i < district.length; i++) {
        seed += district.charCodeAt(i);
      }
    }
    const fluctuation = (seed % 11) * 35 - 50; 
    return base + fluctuation;
  }

  static getBaseMandiRate(commodity) {
    const rates = {
      "Soybean": 4550,
      "Wheat": 2350,
      "Chana": 6050,
      "Garlic": 12500
    };
    return rates[commodity] || 5000;
  }
}

// Global Core App Controller
class App {
  static init() {
    LocalDB.init();
    this.currentUser = LocalDB.getLoggedUser();

    // Register Service Worker for PWA Offline Fallbacks
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
    
    this.appRoot = document.getElementById("app-root");

    this.navLinksContainer = document.getElementById("navbar-dynamic-links");
    this.navActionsContainer = document.getElementById("navbar-dynamic-actions");

    this.bindHashChange();
    this.bindAuthModal();
    this.updateNavbar();
    this.handleRoute();

    this.startLiveTicker();

    // Global B2B Buy Now button click delegator
    document.addEventListener("click", (e) => {
      const buyNowCard = e.target.closest(".buy-now-card-btn");
      if (buyNowCard) {
        const id = buyNowCard.getAttribute("data-id");
        const listing = LocalDB.getListings().find(l => l.id === id);
        if (listing) {
          this.showBuyNowModal(listing);
        }
      }
    });

    // Async prefetch from Supabase Cloud
    LocalDB.prefetchCloudData().then(() => {
      console.log("Successfully prefetched Supabase Cloud data.");
      // Refresh views with newly downloaded data
      this.updateNavbar();
      this.handleRoute();
    });

    // Fetch real-time Mandi rates from OGD API asynchronously
    MandiService.fetchLiveRates().then(() => {
      this.startLiveTicker();
      const hash = window.location.hash || "#home";
      if (hash === "#browse" || hash.startsWith("#listing-detail/")) {
        this.handleRoute();
      }
    });
  }

  static startLiveTicker() {
    const ticker = document.getElementById("live-ticker");
    if (!ticker) return;
    
    const prices = [
      { name: "Soybean", rate: `₹${MandiService.getMandiRate("Soybean").toLocaleString('en-IN')}`, change: "+₹30" },
      { name: "Wheat", rate: `₹${MandiService.getMandiRate("Wheat").toLocaleString('en-IN')}`, change: "+₹15" },
      { name: "Chana", rate: `₹${MandiService.getMandiRate("Chana").toLocaleString('en-IN')}`, change: "-₹40" },
      { name: "Garlic", rate: `₹${MandiService.getMandiRate("Garlic").toLocaleString('en-IN')}`, change: "+₹150" }
    ];
    
    let tickerHtml = "";
    for (let i = 0; i < 4; i++) {
      prices.forEach(p => {
        const isUp = p.change.startsWith("+");
        const changeClass = isUp ? "price-up" : "price-down";
        tickerHtml += `
          <div class="ticker-item">
            <span>🌾 <b>${p.name}:</b> ${p.rate}/quintal</span>
            <span class="${changeClass}">${p.change}</span>
          </div>
        `;
      });
    }
    ticker.innerHTML = tickerHtml;
  }

  static updateNavbar() {
    this.currentUser = LocalDB.getLoggedUser();

    if (!this.currentUser) {
      this.navLinksContainer.innerHTML = `
        <li><a href="#home" class="active">Home</a></li>
        <li><a href="#browse">Browse Commodities</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
      `;
      this.navActionsContainer.innerHTML = `
        <button class="btn btn-outline-saffron btn-sm" id="nav-login-trigger">Sign In / Register</button>
      `;
      
      document.getElementById("nav-login-trigger").addEventListener("click", () => {
        this.showAuthModal();
      });
    } 
    else if (this.currentUser.role === "supplier") {
      this.navLinksContainer.innerHTML = `
        <li><a href="#dashboard" class="nav-sub-trigger active" data-sub="home">🏠 Dashboard</a></li>
        <li><a href="#dashboard" class="nav-sub-trigger" data-sub="listings">📦 Listings</a></li>
        <li><a href="#dashboard" class="nav-sub-trigger" data-sub="orders">🤝 Sales Orders</a></li>
        <li><a href="#dashboard" class="nav-sub-trigger" data-sub="inquiries">📩 Inquiries</a></li>
        <li><a href="#dashboard" class="nav-sub-trigger" data-sub="documents">📄 Documents</a></li>
      `;
      this.navActionsContainer.innerHTML = `
        <span style="font-size: 13.5px; font-weight:600; color:var(--forest-secondary);">🚜 ${this.currentUser.name}</span>
        <button class="btn btn-outline btn-sm" id="nav-logout-btn" style="border-radius:4px;">Logout</button>
      `;

      document.querySelectorAll(".nav-sub-trigger").forEach(trig => {
        trig.addEventListener("click", (e) => {
          const anchor = e.target.closest("a");
          if (!anchor) return;
          const sub = anchor.getAttribute("data-sub");
          
          sessionStorage.setItem("dash_nav_subpage", sub);
          
          if (window.location.hash === "#dashboard") {
            // Instantly render the subpage inside the active dashboard workspace
            this.renderDashboardSubpage(sub);
            
            // Sync active states on header tabs
            document.querySelectorAll(".nav-sub-trigger").forEach(t => t.classList.remove("active"));
            anchor.classList.add("active");

            // Sync active states on sidebar menu links
            document.querySelectorAll(".dashboard-menu-link").forEach(l => {
              l.classList.toggle("active", l.getAttribute("data-sub") === sub);
            });
          }
        });
      });

      document.getElementById("nav-logout-btn").addEventListener("click", () => {
        this.performLogout();
      });
    } 
    else if (this.currentUser.role === "buyer") {
      this.navLinksContainer.innerHTML = `
        <li><a href="#home" class="active">Home</a></li>
        <li><a href="#browse">Browse Commodities</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#buyer-dashboard" style="font-weight:600; color:var(--saffron-primary);">📋 My Inquiries (Dashboard)</a></li>
      `;
      this.navActionsContainer.innerHTML = `
        <span style="font-size: 13.5px; font-weight:600; color:var(--saffron-primary);">🏢 ${this.currentUser.name}</span>
        <button class="btn btn-outline btn-sm" id="nav-logout-btn" style="border-radius:4px;">Logout</button>
      `;

      document.getElementById("nav-logout-btn").addEventListener("click", () => {
        this.performLogout();
      });
    }
    else if (this.currentUser.role === "admin") {
      this.navLinksContainer.innerHTML = `
        <li><a href="#admin" class="nav-admin-sub-trigger active" data-sub="overview">⚙️ Admin Control</a></li>
        <li><a href="#admin" class="nav-admin-sub-trigger" data-sub="suppliers">🚜 Verify Suppliers</a></li>
        <li><a href="#admin" class="nav-admin-sub-trigger" data-sub="listings">🌾 Listings Moderator</a></li>
        <li><a href="#admin" class="nav-admin-sub-trigger" data-sub="inquiries">💬 Global Inquiries</a></li>
        <li><a href="#admin" class="nav-admin-sub-trigger" data-sub="blogs">📰 Manage Blogs</a></li>
      `;
      this.navActionsContainer.innerHTML = `
        <span style="font-size: 13.5px; font-weight:600; color:var(--gold-accent);">🛡️ TradeVithika Admin</span>
        <button class="btn btn-outline btn-sm" id="nav-logout-btn" style="border-radius:4px;">Logout</button>
      `;

      document.querySelectorAll(".nav-admin-sub-trigger").forEach(trig => {
        trig.addEventListener("click", (e) => {
          const anchor = e.target.closest("a");
          if (!anchor) return;
          const sub = anchor.getAttribute("data-sub");
          
          sessionStorage.setItem("admin_nav_subpage", sub);
          
          if (window.location.hash === "#admin") {
            this.renderAdminSubpage(sub);
            
            document.querySelectorAll(".nav-admin-sub-trigger").forEach(t => t.classList.remove("active"));
            anchor.classList.add("active");

            document.querySelectorAll(".admin-sidebar .dashboard-menu-link").forEach(l => {
              l.classList.toggle("active", l.getAttribute("data-sub") === sub);
            });
          }
        });
      });

      document.getElementById("nav-logout-btn").addEventListener("click", () => {
        this.performLogout();
      });
    }
  }

  static performLogout() {
    LocalDB.logout();
    this.currentUser = null;
    this.updateNavbar();
    this.showToast("Logged out successfully");
    window.location.hash = "#home";
  }

  static bindHashChange() {
    window.addEventListener("hashchange", () => this.handleRoute());
  }

  static handleRoute() {
    // Refresh background state on navigation
    LocalDB.prefetchCloudData().then(() => {
      if (window.location.hash === "#dashboard") {
        this.updateDashboardBadgeCount();
        this.updateBellNotificationBadge();
      }
    });

    const hash = window.location.hash || "#home";

    // Google Analytics Single Page Application (SPA) Page View Tracking
    if (typeof gtag === 'function' && window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      gtag('config', window.GA_MEASUREMENT_ID, {
        'page_path': hash,
        'page_title': document.title || 'TradeVithika'
      });
    }

    this.currentUser = LocalDB.getLoggedUser();

    if (this.currentUser) {
      if (this.currentUser.role === "admin") {
        if (hash !== "#admin" && hash !== "#home") {
          window.location.hash = "#admin";
          this.showToast("🔒 Admins are locked to the Admin Control Workspace.", true);
          return;
        }
      }
      else if (this.currentUser.role === "supplier") {
        if (hash === "#admin") {
          window.location.hash = "#dashboard";
          this.showToast("🔒 Unauthorized access: Admins only.", true);
          return;
        }
        if (hash === "#browse" || hash.startsWith("#listing-detail/") || hash === "#how-it-works" || hash === "#register" || hash === "#blog" || hash.startsWith("#blog-detail/")) {
          window.location.hash = "#dashboard";
          this.showToast("🔒 Suppliers access only VendorOS Dashboard. Logout to browse public feed.", true);
          return;
        }
      }
      else if (this.currentUser.role === "buyer") {
        if (hash === "#admin" || hash === "#dashboard") {
          window.location.hash = "#home";
          this.showToast("🔒 Unauthorized access.", true);
          return;
        }
      }
    } else {
      if (hash === "#admin" || hash === "#dashboard" || hash === "#buyer-dashboard") {
        window.location.hash = "#home";
        this.showToast("🔒 Please sign in to access workspace panels.", true);
        this.showAuthModal();
        return;
      }
    }

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      }
    });

    if (hash.startsWith("#listing-detail/")) {
      const parts = hash.split("/");
      const id = parts[1];
      this.renderListingDetail(id);
      window.scrollTo(0, 0);
      return;
    }

    if (hash.startsWith("#supplier-profile/")) {
      const parts = hash.split("/");
      const id = parts[1];
      this.renderSupplierProfile(id);
      window.scrollTo(0, 0);
      return;
    }

    if (hash.startsWith("#blog-detail/")) {
      const parts = hash.split("/");
      const id = parts[1];
      this.renderBlogDetail(id);
      window.scrollTo(0, 0);
      return;
    }

    switch (hash) {
      case "#home":
        this.renderHome();
        break;
      case "#browse":
        this.renderBrowse();
        break;
      case "#blog":
        this.renderBlog();
        break;
      case "#dashboard":
        this.renderDashboard();
        break;
      case "#buyer-dashboard":
        this.renderBuyerDashboard();
        break;
      case "#admin":
        this.renderAdminDashboard();
        break;
      case "#register":
        this.renderRegister();
        break;
      case "#how-it-works":
        this.renderHowItWorks();
        break;
      default:
        this.renderHome();
    }
    window.scrollTo(0, 0);
  }

  static showToast(message, isError = false) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${isError ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <span>${isError ? '⚠️' : '✅'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("active"), 10);
    setTimeout(() => {
      toast.classList.remove("active");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- DUAL AUTHENTICATION MODAL LOGIC ---
  static bindAuthModal() {
    this.authModal = document.getElementById("auth-modal");
    this.authClose = document.getElementById("auth-modal-close");

    if (this.authClose) {
      this.authClose.addEventListener("click", () => this.hideAuthModal());
    }

    this.authRole = "buyer"; 
    this.authMode = "login"; 
    
    const tabBuyer = document.getElementById("auth-tab-buyer");
    const tabSupplier = document.getElementById("auth-tab-supplier");
    const tabAdmin = document.getElementById("auth-tab-admin");

    if (tabBuyer) tabBuyer.addEventListener("click", () => this.switchAuthTab("buyer"));
    if (tabSupplier) tabSupplier.addEventListener("click", () => this.switchAuthTab("supplier"));
    if (tabAdmin) tabAdmin.addEventListener("click", () => this.switchAuthTab("admin"));

    const toSignup = document.getElementById("auth-toggle-signup");
    const toLogin = document.getElementById("auth-toggle-login");

    if (toSignup && toLogin) {
      toSignup.addEventListener("click", () => this.switchAuthMode("signup"));
      toLogin.addEventListener("click", () => this.switchAuthMode("login"));
    }

    const dbResetBtn = document.getElementById("auth-db-reset");
    if (dbResetBtn) {
      dbResetBtn.addEventListener("click", () => {
        if (confirm("This will clear all local changes and reset the database to original pre-seeded credentials. Continue?")) {
          localStorage.clear();
          this.showToast("Database successfully reset. Reloading page...");
          setTimeout(() => window.location.reload(), 1000);
        }
      });
    }

    const forgotLink = document.getElementById("auth-forgot-password-link");
    if (forgotLink) {
      forgotLink.addEventListener("click", () => {
        const emailInput = document.getElementById("auth-login-email").value.trim();
        if (emailInput) {
          let foundUser = null;
          let roleText = "";
          
          const buyers = LocalDB.getBuyers();
          const matchedBuyer = buyers.find(b => b.email.toLowerCase() === emailInput.toLowerCase());
          if (matchedBuyer) {
            foundUser = matchedBuyer;
            roleText = "Buyer";
          } else {
            const suppliers = LocalDB.getSuppliers();
            const matchedSupplier = suppliers.find(s => s.email.toLowerCase() === emailInput.toLowerCase());
            if (matchedSupplier) {
              foundUser = matchedSupplier;
              roleText = "Supplier";
            }
          }

          if (emailInput.toLowerCase() === "admin@tradevithika.com") {
            this.showToast("🔒 Password recovery for TradeVithika Admin is secured. Default: 'password'.");
          } else if (foundUser) {
            this.showToast(`🔑 Recovery Successful! ${roleText} password is: "${foundUser.password}"`);
          } else {
            this.showToast("❌ No registered account found with this email.", true);
          }
        } else {
          this.showToast("💡 Please enter your Email Address first to retrieve your password.", true);
        }
      });
    }

    document.getElementById("auth-login-form").addEventListener("submit", (e) => this.handleLoginSubmit(e));
    document.getElementById("auth-signup-form").addEventListener("submit", (e) => this.handleSignupSubmit(e));
  }

  static showAuthModal(startRole = "buyer") {
    this.authModal.classList.add("active");
    this.switchAuthTab(startRole);
    this.switchAuthMode("login");
  }

  static hideAuthModal() {
    this.authModal.classList.remove("active");
  }

  static switchAuthTab(role) {
    this.authRole = role;
    const tabB = document.getElementById("auth-tab-buyer");
    const tabS = document.getElementById("auth-tab-supplier");
    const tabA = document.getElementById("auth-tab-admin");

    if (tabB) tabB.classList.toggle("active", role === "buyer");
    if (tabS) tabS.classList.toggle("active", role === "supplier");
    if (tabA) tabA.classList.toggle("active", role === "admin");

    const loginEmailLabel = document.getElementById("auth-login-email-label");
    const signupNameLabel = document.getElementById("auth-signup-name-label");
    const buyerExtraFields = document.getElementById("auth-signup-buyer-fields");
    const signupToggleContainer = document.getElementById("auth-toggle-signup") ? document.getElementById("auth-toggle-signup").parentElement : null;

    if (role === "buyer") {
      loginEmailLabel.innerText = "Buyer Email Address*";
      signupNameLabel.innerText = "Buyer Full Name*";
      if (buyerExtraFields) buyerExtraFields.style.display = "block";
      if (signupToggleContainer) signupToggleContainer.style.display = "block";
    } else if (role === "supplier") {
      loginEmailLabel.innerText = "Supplier Registered Email*";
      signupNameLabel.innerText = "Supplier Farm / Business Name*";
      if (buyerExtraFields) buyerExtraFields.style.display = "none";
      if (signupToggleContainer) signupToggleContainer.style.display = "block";
    } else if (role === "admin") {
      loginEmailLabel.innerText = "Administrator Email*";
      if (buyerExtraFields) buyerExtraFields.style.display = "none";
      if (signupToggleContainer) signupToggleContainer.style.display = "none";
    }
  }

  static switchAuthMode(mode) {
    this.authMode = mode;
    const loginPanel = document.getElementById("auth-login-panel");
    const signupPanel = document.getElementById("auth-signup-panel");
    const modalTitle = document.getElementById("auth-modal-title");

    if (mode === "login") {
      loginPanel.style.display = "block";
      signupPanel.style.display = "none";
      modalTitle.innerText = `Sign In — TradeVithika`;
    } else {
      loginPanel.style.display = "none";
      signupPanel.style.display = "block";
      modalTitle.innerText = `Register Account — TradeVithika`;
    }
  }

  static handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("auth-login-email").value.trim().toLowerCase();
    const pass = document.getElementById("auth-login-password").value;

    // Auto-detect Admin Credentials on any login tab
    if (email === "admin@tradevithika.com" && pass === "password") {
      LocalDB.setLoggedUser({
        id: "admin-1",
        role: "admin",
        name: "TradeVithika Administrator",
        email: "admin@tradevithika.com"
      });

      if (typeof gtag === 'function' && window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        gtag('event', 'login', {
          method: 'Email',
          user_role: 'admin',
          user_email: 'admin@tradevithika.com'
        });
      }

      this.showToast("Logged in successfully as Administrator");
      this.hideAuthModal();
      this.updateNavbar();
      window.location.hash = "#admin";
      return;
    }

    if (this.authRole === "buyer") {
      const buyers = LocalDB.getBuyers();
      const matched = buyers.find(b => b.email.toLowerCase() === email && b.password === pass);

      if (matched) {
        LocalDB.setLoggedUser({
          id: matched.id,
          role: "buyer",
          name: matched.name,
          email: matched.email
        });

        if (typeof gtag === 'function' && window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
          gtag('event', 'login', {
            method: 'Email',
            user_role: 'buyer',
            user_name: matched.name,
            user_email: matched.email
          });
        }

        this.showToast(`Logged in successfully as Buyer: ${matched.name}`);
        this.hideAuthModal();
        this.updateNavbar();
        window.location.hash = "#buyer-dashboard";
      } else {
        this.showToast("Invalid credentials. Try: ramesh@flourmill.com / password", true);
      }
    } 
    else if (this.authRole === "supplier") {
      const suppliers = LocalDB.getSuppliers();
      const matched = suppliers.find(s => s.email.toLowerCase() === email && s.password === pass);

      if (matched) {
        LocalDB.setLoggedUser({
          id: matched.id,
          role: "supplier",
          name: matched.name,
          email: matched.email
        });
        
        localStorage.setItem("tv_logged_supplier", matched.id);

        if (typeof gtag === 'function' && window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
          gtag('event', 'login', {
            method: 'Email',
            user_role: 'supplier',
            user_name: matched.name,
            user_email: matched.email
          });
        }

        this.showToast(`Logged in successfully as Supplier: ${matched.name}`);
        this.hideAuthModal();
        this.updateNavbar();
        window.location.hash = "#dashboard";
      } else {
        this.showToast("Invalid credentials. Try: rajesh@agrotraders.com / password", true);
      }
    }
  }

  static handleSignupSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById("auth-signup-name").value.trim();
    const phone = document.getElementById("auth-signup-phone").value.trim();
    const email = document.getElementById("auth-signup-email").value.trim();
    const password = document.getElementById("auth-signup-password").value;

    if (this.authRole === "buyer") {
      const company = document.getElementById("auth-signup-company").value.trim();
      const city = document.getElementById("auth-signup-city").value.trim();

      const newB = {
        id: "buyer-" + Date.now(),
        name: name,
        companyName: company || name + " Grains",
        phone: phone,
        email: email,
        password: password,
        city: city || "Madhya Pradesh",
        savedSuppliers: []
      };

      const buyers = LocalDB.getBuyers();
      buyers.push(newB);
      LocalDB.saveBuyers(buyers);

      LocalDB.setLoggedUser({
        id: newB.id,
        role: "buyer",
        name: newB.name,
        email: newB.email
      });

      this.showToast("Buyer Account registered successfully!");
      this.hideAuthModal();
      this.updateNavbar();
      window.location.hash = "#buyer-dashboard";
    } 
    else if (this.authRole === "supplier") {
      this.hideAuthModal();
      window.location.hash = "#register";
    }
  }

  // --- PAGE RENDERING METHODS ---

  // 1. HOMEPAGE
  static renderHome() {
    this.appRoot.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap;">
          <div class="hero-content" style="flex: 1.2; min-width: 320px; max-width: 700px;">
            <div class="hero-tagline">MADHYA PRADESH COOP</div>
            <h1>India's Most Trusted B2B Agri Commodity Marketplace</h1>
            <p class="hero-subtext">Connect with verified soybean, wheat, chana & garlic suppliers across Madhya Pradesh. Bulk buying made simple with direct negotiations.</p>
            
            <div class="search-panel">
              <div class="search-field-container">
                <select id="search-commodity">
                  <option value="">Select Commodity</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Wheat">Wheat (गेहूँ)</option>
                  <option value="Chana">Chana (चना)</option>
                  <option value="Garlic">Garlic (लहसुन)</option>
                </select>
              </div>
              <div class="search-divider"></div>
              <div class="search-field-container" style="flex: 1.5;">
                <input type="text" id="search-district" placeholder="Enter district (e.g. Raisen, Sehore)">
              </div>
              <button class="search-btn" id="home-search-btn">
                🔍 Search
              </button>
            </div>
            
            <div class="hero-actions" style="margin-top: 32px;">
              <a href="#browse" class="btn btn-primary btn-lg">Browse Listings</a>
              <button class="btn btn-outline btn-lg" id="home-supplier-reg-trigger" style="color: white; border-color: white; background: transparent; cursor:pointer;">List Your Products Free</button>
            </div>
          </div>
          
          <div class="hero-image-wrapper" style="flex: 1; min-width: 320px; display: flex; justify-content: center; align-items: center; position: relative; z-index: 10;">
            <img src="hero_agri_commerce.png" alt="TradeVithika Agricultural Commerce Marketplace" style="width: 100%; max-width: 480px; height: auto; border-radius: var(--radius-lg); box-shadow: 0 20px 40px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15);">
          </div>
        </div>
      </section>

      <!-- Trust Stats Bar -->
      <section class="stats-bar">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-number">500+</span>
              <span class="stat-label">Verified Suppliers</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">₹10 Cr+</span>
              <span class="stat-label">Trade Facilitated</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">12+</span>
              <span class="stat-label">Districts Covered</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">48hr</span>
              <span class="stat-label">Avg Response Time</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Commodities -->
      <section class="section-wrapper">
        <div class="container">
          <div class="section-header">
            <h2>Browse by Commodity</h2>
            <p>Select a core crop to view instant live stocks, active supplier details, and wholesale market listings.</p>
          </div>
          
          <div class="commodities-grid">
            <div class="commodity-card soybean-theme">
              <div class="commodity-icon-box">🌱</div>
              <h3>Soybean</h3>
              <p class="commodity-hindi">सोयाबीन</p>
              <div class="commodity-price-range">₹3,900 – ₹4,500 <span style="font-size:12px; font-weight:normal;">/qtl</span></div>
              <p class="commodity-meta">142 Active Listings<br>Raisen, Vidisha, Sehore</p>
              <button class="btn btn-primary btn-sm commodity-browse-btn" data-crop="Soybean">Browse Soybean</button>
            </div>
            
            <div class="commodity-card wheat-theme">
              <div class="commodity-icon-box">🌾</div>
              <h3>Wheat</h3>
              <p class="commodity-hindi">गेहूँ (Gehun)</p>
              <div class="commodity-price-range">₹2,000 – ₹2,300 <span style="font-size:12px; font-weight:normal;">/qtl</span></div>
              <p class="commodity-meta">98 Active Listings<br>Hoshangabad, Sehore, Raisen</p>
              <button class="btn btn-primary btn-sm commodity-browse-btn" data-crop="Wheat">Browse Wheat</button>
            </div>
            
            <div class="commodity-card chana-theme">
              <div class="commodity-icon-box">🧆</div>
              <h3>Chana</h3>
              <p class="commodity-hindi">चना (Chickpea)</p>
              <div class="commodity-price-range">₹5,500 – ₹6,200 <span style="font-size:12px; font-weight:normal;">/qtl</span></div>
              <p class="commodity-meta">76 Active Listings<br>Raisen, Narsinghpur, Damoh</p>
              <button class="btn btn-primary btn-sm commodity-browse-btn" data-crop="Chana">Browse Chana</button>
            </div>
            
            <div class="commodity-card garlic-theme">
              <div class="commodity-icon-box">🧄</div>
              <h3>Garlic</h3>
              <p class="commodity-hindi">लहसुन (Lahsun)</p>
              <div class="commodity-price-range">₹10,000 – ₹14,000 <span style="font-size:12px; font-weight:normal;">/qtl</span></div>
              <p class="commodity-meta">54 Active Listings<br>Mandsaur, Sehore, Indore</p>
              <button class="btn btn-primary btn-sm commodity-browse-btn" data-crop="Garlic">Browse Garlic</button>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="section-wrapper how-it-works-section">
        <div class="container">
          <div class="section-header">
            <h2>Trade in 3 Simple Steps</h2>
            <p>TradeVithika connects bulk flour mills and retail aggregators directly with verified farmers and warehouses.</p>
          </div>
          
          <div class="steps-container">
            <div class="step-card">
              <div class="step-icon-wrapper">🔍</div>
              <h3>1. Browse & Filter</h3>
              <p>Search list of high-grade commodities. Filter by moisture level, district, and minimum quantities.</p>
            </div>
            <div class="step-card">
              <div class="step-icon-wrapper">📩</div>
              <h3>2. Send Inquiry</h3>
              <p>Submit structured bulk requirements directly to the vendor with zero middleman commissions.</p>
            </div>
            <div class="step-card">
              <div class="step-icon-wrapper">🤝</div>
              <h3>3. Close the Deal</h3>
              <p>Coordinate pricing, arrange freight logistics, and complete transaction directly at warehouse gates.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Verified Suppliers -->
      <section class="section-wrapper">
        <div class="container">
          <div class="section-header">
            <h2>Trusted Suppliers on TradeVithika</h2>
            <p>Our top-rated agricultural suppliers undergoing standard verification checking and direct crop validation.</p>
          </div>
          
          <div class="commodities-grid" id="home-featured-suppliers" style="grid-template-columns: repeat(3, 1fr);">
            <!-- Dynamic Injection of verified suppliers -->
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section-wrapper" style="background-color: var(--white); border-top: 1px solid var(--gray-border);">
        <div class="container">
          <div class="section-header">
            <h2>What Our Traders Say</h2>
          </div>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <p class="testimonial-text">"TradeVithika ne meri business badal di. Ab seedha supplier se deal karta hoon, koi dalal nahi. Pure premium quality wheat directly available hota hai."</p>
              <div class="testimonial-author">
                <div class="author-info">
                  <h4>Ramesh Shah</h4>
                  <p>Bhopal Flour Mill Owner</p>
                </div>
                <div style="color: var(--gold-accent);">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div class="testimonial-card">
              <p class="testimonial-text">"Mere soybean ko directly MP ke premium mills tak contract mila. Profile create karne ke ek hafte mein pehla clear bulk order closed ho gaya."</p>
              <div class="testimonial-author">
                <div class="author-info">
                  <h4>Suresh Patel</h4>
                  <p>Soybean Aggregator, Raisen</p>
                </div>
                <div style="color: var(--gold-accent);">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Call to Action -->
      <section class="cta-banner">
        <div class="cta-banner-content">
          <h2>Are You an Agri Supplier in Madhya Pradesh?</h2>
          <p>List your products for free. Secure direct verified inquiries from large mills and manufacturers across India.</p>
          <button class="btn btn-primary btn-lg" id="home-cta-supplier-reg" style="background-color: var(--saffron-primary); color: white; cursor:pointer;">Register as Supplier — Free</button>
        </div>
      </section>
    `;

    this.renderHomeFeaturedSuppliers();
    this.bindHomeEvents();
  }

  static renderHomeFeaturedSuppliers() {
    const suppliers = LocalDB.getSuppliers().slice(0, 3);
    const container = document.getElementById("home-featured-suppliers");
    if (!container) return;

    container.innerHTML = suppliers.map(s => `
      <div class="supplier-card">
        <div class="supplier-header">
          <div class="supplier-info">
            <h3>
              ${s.name}
              <span class="verified-badge">✓ Verified</span>
            </h3>
            <span class="supplier-location">📍 ${s.district}, Madhya Pradesh</span>
          </div>
          <span class="supplier-rating">⭐ ${s.rating}</span>
        </div>
        <div class="supplier-tags">
          ${s.commodities.map(c => `<span class="tag">${c}</span>`).join('')}
          <span class="tag" style="background-color: var(--saffron-light); color: var(--saffron-primary); font-weight:600;">${s.businessType}</span>
        </div>
        <div class="supplier-meta-row">
          <span>⚡ Replies in ${s.responseTime}</span>
          <a href="#supplier-profile/${s.id}" class="btn btn-outline btn-sm" style="border-radius:4px;">View Profile</a>
        </div>
      </div>
    `).join('');
  }

  static bindHomeEvents() {
    const searchBtn = document.getElementById("home-search-btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const commodity = document.getElementById("search-commodity").value;
        const district = document.getElementById("search-district").value;
        
        sessionStorage.setItem("browse_filter_commodity", commodity);
        sessionStorage.setItem("browse_filter_district", district);
        window.location.hash = "#browse";
      });
    }

    document.querySelectorAll(".commodity-browse-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const crop = e.target.getAttribute("data-crop");
        sessionStorage.setItem("browse_filter_commodity", crop);
        window.location.hash = "#browse";
      });
    });

    const triggerReg = (e) => {
      e.preventDefault();
      this.showAuthModal("supplier");
      this.switchAuthMode("signup");
    };

    document.getElementById("home-supplier-reg-trigger").addEventListener("click", triggerReg);
    document.getElementById("home-cta-supplier-reg").addEventListener("click", triggerReg);
  }

  // 2. BROWSE LISTINGS PAGE
  static renderBrowse() {
    this.appRoot.innerHTML = `
      <div class="container browse-wrapper">
        <div class="browse-layout">
          <!-- Left Sidebar Filters -->
          <aside class="browse-sidebar">
            <h3 class="filter-title">Filter Listings</h3>
            
            <div class="filter-group">
              <span class="filter-group-label">Commodity</span>
              <label class="checkbox-label">
                <input type="checkbox" name="filter-commodity" value="Soybean"> Soybean (सोयाबीन)
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="filter-commodity" value="Wheat"> Wheat (गेहूँ)
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="filter-commodity" value="Chana"> Chana (चना)
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="filter-commodity" value="Garlic"> Garlic (लहसुन)
              </label>
            </div>
            
            <div class="filter-group">
              <span class="filter-group-label">District</span>
              <select class="filter-select" id="filter-district-select">
                <option value="">All Districts</option>
                <option value="Raisen">Raisen</option>
                <option value="Sehore">Sehore</option>
                <option value="Hoshangabad">Hoshangabad</option>
                <option value="Vidisha">Vidisha</option>
                <option value="Narsinghpur">Narsinghpur</option>
                <option value="Mandsaur">Mandsaur</option>
              </select>
            </div>
            
            <div class="filter-group">
              <span class="filter-group-label">Price Range (₹/Quintal)</span>
              <div class="price-range-slider">
                <div class="price-slider-inputs">
                  <input type="number" id="price-min" placeholder="Min" value="1000">
                  <span style="align-self:center;">-</span>
                  <input type="number" id="price-max" placeholder="Max" value="20000">
                </div>
              </div>
            </div>
            
            <div class="filter-group">
              <span class="filter-group-label">Min. Order Quantity (Quintal)</span>
              <select class="filter-select" id="filter-min-order">
                <option value="0">Show All</option>
                <option value="10">10+ qtl</option>
                <option value="50">50+ qtl</option>
                <option value="100">100+ qtl</option>
                <option value="500">500+ qtl</option>
              </select>
            </div>
            
            <div class="filter-group">
              <span class="filter-group-label">Supplier Type</span>
              <label class="radio-label">
                <input type="radio" name="filter-supplier-type" value="" checked> All Types
              </label>
              <label class="radio-label">
                <input type="radio" name="filter-supplier-type" value="Farmer"> Farmer
              </label>
              <label class="radio-label">
                <input type="radio" name="filter-supplier-type" value="Aggregator"> Aggregator
              </label>
              <label class="radio-label">
                <input type="radio" name="filter-supplier-type" value="Warehouse Owner"> Warehouse Owner
              </label>
            </div>
            
            <div class="filter-group" style="border:none; padding-bottom:0;">
              <label class="switch-label">
                <span>Verified Supplier Only</span>
                <span class="switch-wrapper">
                  <input type="checkbox" id="filter-verified-only">
                  <span class="slider"></span>
                </span>
              </label>
            </div>
            
            <button class="btn btn-primary btn-full" id="apply-filters-btn" style="margin-top:24px;">Apply Filters</button>
            <button class="btn btn-outline btn-full" id="reset-filters-btn" style="margin-top:10px;">Reset All</button>
          </aside>

          <!-- Right Grid Area -->
          <main class="browse-main">
            <div class="browse-top-bar">
              <div class="results-count" id="results-count-text">Showing listings...</div>
              <div>
                <select class="browse-sort-select" id="sort-select">
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="verified">Verified First</option>
                </select>
              </div>
            </div>
            
            <div class="listings-grid" id="listings-grid-container">
              <!-- Grid injected via JS -->
            </div>
          </main>
        </div>
      </div>
    `;

    this.loadSessionFilters();
    this.filterAndRenderListings();
    this.bindBrowseEvents();
  }

  static loadSessionFilters() {
    const com = sessionStorage.getItem("browse_filter_commodity");
    const dist = sessionStorage.getItem("browse_filter_district");
    
    if (com) {
      const checkbox = document.querySelector(`input[name="filter-commodity"][value="${com}"]`);
      if (checkbox) checkbox.checked = true;
      sessionStorage.removeItem("browse_filter_commodity");
    }
    if (dist) {
      const select = document.getElementById("filter-district-select");
      if (select) select.value = dist;
      sessionStorage.removeItem("browse_filter_district");
    }
  }

  static filterAndRenderListings() {
    const listings = LocalDB.getListings().filter(l => l.status === "active");
    const suppliers = LocalDB.getSuppliers();
    
    const selectedCommodities = Array.from(document.querySelectorAll('input[name="filter-commodity"]:checked')).map(c => c.value);
    const selectedDistrict = document.getElementById("filter-district-select").value;
    const minPrice = parseInt(document.getElementById("price-min").value) || 0;
    const maxPrice = parseInt(document.getElementById("price-max").value) || 200000;
    const minOrder = parseInt(document.getElementById("filter-min-order").value) || 0;
    const selectedSupplierType = document.querySelector('input[name="filter-supplier-type"]:checked').value;
    const verifiedOnly = document.getElementById("filter-verified-only").checked;
    const sortBy = document.getElementById("sort-select").value;

    let filtered = listings.filter(l => {
      const sup = suppliers.find(s => s.id === l.supplierId);
      if (selectedCommodities.length > 0 && !selectedCommodities.includes(l.commodity)) return false;
      if (selectedDistrict && l.district !== selectedDistrict) return false;
      if (l.price < minPrice || l.price > maxPrice) return false;
      if (l.minOrder < minOrder) return false;
      if (selectedSupplierType && sup.businessType !== selectedSupplierType) return false;
      if (verifiedOnly && sup.verified !== "verified") return false;
      return true;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "verified") {
      filtered.sort((a, b) => {
        const sa = suppliers.find(s => s.id === a.supplierId).verified === "verified" ? 1 : 0;
        const sb = suppliers.find(s => s.id === b.supplierId).verified === "verified" ? 1 : 0;
        return sb - sa;
      });
    } else { 
      filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    }

    const container = document.getElementById("listings-grid-container");
    const countText = document.getElementById("results-count-text");
    
    countText.innerText = `Showing ${filtered.length} listings for Madhya Pradesh`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:60px 20px; background:white; border-radius:12px; border:1px dashed var(--gray-border);">
          <span style="font-size:48px;">🌾</span>
          <h3 style="margin-top:16px;">No Active Listings Match Your Filters</h3>
          <p style="color:var(--gray-medium); margin-top:8px;">Try clearing filters or checking other districts.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(l => {
      const sup = suppliers.find(s => s.id === l.supplierId);
      const isVerified = sup.verified === "verified";
      const mandiRate = MandiService.getMandiRate(l.commodity, l.district);
      const savings = mandiRate - l.price;
      
      const dealBadgeHtml = savings > 0 
        ? `<div style="background: rgba(0, 181, 98, 0.08); color: var(--forest-secondary); font-size: 11.5px; padding: 8px 12px; border-radius: 6px; font-weight: 700; margin-top: 12px; border: 1px solid rgba(0, 181, 98, 0.18); display: flex; align-items: center; gap: 6px; justify-content: center;">
            💡 Best Deal: Saves you ₹${savings.toLocaleString('en-IN')}/qtl!
           </div>`
        : '';
      
      return `
        <div class="listing-card">
          <div class="listing-card-header">
            <span class="commodity-pill ${l.commodity.toLowerCase()}-pill">${l.commodity} / ${l.hindiTitle}</span>
            <span class="listing-date">Posted ${l.postedDaysAgo} days ago</span>
          </div>
          <h3>${l.title}</h3>
          
          <div class="listing-card-supplier">
            <b>${sup.name}</b>
            ${isVerified ? '<span class="verified-badge" style="padding:2px 8px; font-size:9px;">✓ Verified</span>' : '<span class="unverified-badge" style="padding:2px 8px; font-size:9px;">Unverified</span>'}
          </div>
          
          <div class="listing-location">
            📍 ${l.district}, MP
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:13px; background:var(--bg-light); padding:10px 12px; border-radius:6px; border:1px solid var(--gray-light);">
            <div>
              <span style="color:var(--gray-medium); font-size:11.5px;">Listed Price:</span>
              <div style="color:var(--saffron-primary); font-weight:700; font-size:15px; margin-top:2px;">₹${l.price.toLocaleString('en-IN')}/q</div>
            </div>
            <div style="text-align: right;">
              <span style="color:var(--gray-medium); font-size:11.5px;">Live Mandi Rate:</span>
              <div style="color:var(--dark); font-weight:700; font-size:15px; margin-top:2px;">₹${mandiRate.toLocaleString('en-IN')}/q</div>
            </div>
          </div>
          
          <div class="listing-specs-row">
            <div class="listing-spec-item">
              <span class="listing-spec-label">Min. Order</span>
              <span class="listing-spec-value">${l.minOrder} qtl</span>
            </div>
            <div class="listing-spec-item">
              <span class="listing-spec-label">Stock Size</span>
              <span class="listing-spec-value">${l.quantity} qtl</span>
            </div>
            <div class="listing-spec-item">
              <span class="listing-spec-label">Moisture</span>
              <span class="listing-spec-value">${l.moisture}</span>
            </div>
          </div>
          
          <div class="listing-secondary-specs">
            <span>Grade: <b>${l.grade}</b></span>
            <span>Delivery: <b>${l.delivery}</b></span>
          </div>

          ${dealBadgeHtml}
          
          <div class="listing-actions" style="margin-top: 16px; display: flex; gap: 8px;">
            <a href="#listing-detail/${l.id}" class="btn btn-outline" style="flex: 1; text-align: center; padding: 8px 12px; font-size: 13px;">Details</a>
            <button class="btn btn-outline-saffron send-quick-inquiry-btn" data-id="${l.id}" style="flex: 1; padding: 8px 12px; font-size: 13px;">Inquiry</button>
            <button class="btn btn-secondary buy-now-card-btn" data-id="${l.id}" style="flex: 1.2; padding: 8px 12px; font-size: 13px; cursor:pointer;">🛒 Buy Now</button>
          </div>
        </div>
      `;
    }).join('');
  }

  static bindBrowseEvents() {
    document.getElementById("apply-filters-btn").addEventListener("click", () => {
      this.filterAndRenderListings();
    });

    document.getElementById("reset-filters-btn").addEventListener("click", () => {
      document.querySelectorAll('input[name="filter-commodity"]').forEach(c => c.checked = false);
      document.getElementById("filter-district-select").value = "";
      document.getElementById("price-min").value = "1000";
      document.getElementById("price-max").value = "20000";
      document.getElementById("filter-min-order").value = "0";
      document.querySelector('input[name="filter-supplier-type"][value=""]').checked = true;
      document.getElementById("filter-verified-only").checked = false;
      this.filterAndRenderListings();
      this.showToast("All filters reset successfully");
    });

    document.getElementById("sort-select").addEventListener("change", () => {
      this.filterAndRenderListings();
    });

    document.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("send-quick-inquiry-btn")) {
        const id = e.target.getAttribute("data-id");
        window.location.hash = `#listing-detail/${id}`;
      }
    });
  }

  // 3. LISTING DETAIL PAGE
  static renderListingDetail(id) {
    const listing = LocalDB.getListings().find(l => l.id === id);
    if (!listing) {
      this.appRoot.innerHTML = `<div class="container" style="padding:100px text-align:center;"><h2>Listing Not Found</h2></div>`;
      return;
    }

    const supplier = LocalDB.getSuppliers().find(s => s.id === listing.supplierId);
    const mandiRate = MandiService.getMandiRate(listing.commodity, listing.district);
    const savings = mandiRate - listing.price;
    
    let emoji = "🌾";
    let themeClass = "wheat-theme";
    if (listing.commodity === "Soybean") { emoji = "🌱"; themeClass = "soybean-theme"; }
    else if (listing.commodity === "Chana") { emoji = "🧆"; themeClass = "chana-theme"; }
    else if (listing.commodity === "Garlic") { emoji = "🧄"; themeClass = "garlic-theme"; }

    const loggedBuyer = (this.currentUser && this.currentUser.role === "buyer") 
      ? LocalDB.getBuyers().find(b => b.id === this.currentUser.id) 
      : null;

    this.appRoot.innerHTML = `
      <div class="container" style="padding-top: 30px;">
        <div class="breadcrumbs">
          <a href="#home">Home</a> > <a href="#browse">Browse</a> > <span style="color:var(--charcoal); font-weight:600;">${listing.commodity}</span>
        </div>
        
        <div class="detail-layout">
          <div class="detail-main">
            <div class="gallery-container">
              <div class="main-image-mock ${themeClass}">
                ${emoji}
                <span class="main-image-bg-label">${listing.commodity} — Stock Photo</span>
              </div>
              <div class="gallery-thumbs">
                <div class="thumb-image-mock active">${emoji}</div>
                <div class="thumb-image-mock">🌾</div>
                <div class="thumb-image-mock">🏭</div>
              </div>
            </div>
            
            <span class="commodity-pill ${listing.commodity.toLowerCase()}-pill" style="font-size:12px; padding:6px 12px;">${listing.commodity}</span>
            <h1 style="font-size:32px; margin-top:12px; margin-bottom:20px;">${listing.title}</h1>
            
            <!-- Specifications -->
            <div class="specifications-panel">
              <h3 class="specs-title">Technical Specifications</h3>
              <table class="specs-table">
                <tr>
                  <td>Crop Variety</td>
                  <td>${listing.variety}</td>
                </tr>
                <tr>
                  <td>Moisture Content</td>
                  <td>${listing.moisture}</td>
                </tr>
                <tr>
                  <td>Quality Grade</td>
                  <td>${listing.grade}</td>
                </tr>
                <tr>
                  <td>Total Stock Volume</td>
                  <td>${listing.quantity} Quintals</td>
                </tr>
                <tr>
                  <td>Minimum Purchase Qty</td>
                  <td>${listing.minOrder} Quintals</td>
                </tr>
                <tr>
                  <td>Wholesale Price (Supplier Rate)</td>
                  <td><span style="font-weight:700; color:var(--saffron-primary);">₹${listing.price.toLocaleString('en-IN')} / Quintal</span></td>
                </tr>
                <tr>
                  <td>Live Mandi Reference Rate</td>
                  <td><span style="font-weight:600; color:var(--dark);">₹${mandiRate.toLocaleString('en-IN')} / Quintal</span></td>
                </tr>
                ${savings > 0 ? `
                <tr>
                  <td>Deal Analysis</td>
                  <td>
                    <span style="background:rgba(0, 181, 98, 0.08); color:var(--forest-secondary); font-size:11.5px; padding:6px 12px; border-radius:4px; font-weight:700; border:1px solid rgba(0, 181, 98, 0.18); display:inline-block;">
                      💡 Best Deal: Saves you ₹${savings.toLocaleString('en-IN')}/qtl! (${Math.round((savings/mandiRate)*100)}% cheaper than Mandi)
                    </span>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td>Packaging Details</td>
                  <td>${listing.packaging}</td>
                </tr>
                <tr>
                  <td>Terms of Delivery</td>
                  <td>${listing.delivery}</td>
                </tr>
                <tr>
                  <td>Harvesting Season</td>
                  <td>${listing.harvestYear}</td>
                </tr>
                <tr>
                  <td>Loading Location</td>
                  <td>📍 ${listing.taluka}, ${listing.district}, MP</td>
                </tr>
              </table>
            </div>

            <!-- Description -->
            <div class="description-panel">
              <h3 class="specs-title">Additional Details</h3>
              <p class="description-text">${listing.description}</p>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="detail-sidebar">
            <div class="supplier-detail-panel">
              <h3 class="form-title" style="border-bottom:1px solid var(--gray-border); padding-bottom:12px; margin-bottom:16px;">Supplier Details</h3>
              <div style="font-size:18px; font-weight:700; display:flex; align-items:center; gap:8px;">
                ${supplier.name}
                ${supplier.verified === "verified" ? '<span class="verified-badge">✓ Verified</span>' : ''}
              </div>
              <span class="supplier-location">📍 ${supplier.district}, MP</span>
              
              <div style="margin-top:16px; font-size:14px; color:var(--gray-medium); display:flex; flex-direction:column; gap:8px;">
                <span>⭐ Rating: <b>${supplier.rating} / 5.0</b></span>
                <span>⚡ Response Rate: <b>${supplier.responseRate}</b></span>
                <span>⏱️ Average Response: <b>Usually within ${supplier.responseTime}</b></span>
              </div>
              
              <p style="font-size:13px; margin-top:16px; border-top:1px solid var(--gray-light); padding-top:12px; color:var(--gray-medium); font-style:italic;">
                "${supplier.about}"
              </p>
            </div>

            <div class="inquiry-form-panel">
              <h3 class="form-title">Send Inquiry to Supplier</h3>
              <form id="listing-inquiry-form">
                <div class="form-group">
                  <label for="inq-name">Your Full Name*</label>
                  <input type="text" id="inq-name" class="form-input" required placeholder="E.g. Ramesh Shah" value="${loggedBuyer ? loggedBuyer.name : ''}">
                </div>
                <div class="form-group">
                  <label for="inq-company">Company/Mill Name*</label>
                  <input type="text" id="inq-company" class="form-input" required placeholder="E.g. Bhopal Mills" value="${loggedBuyer ? loggedBuyer.companyName : ''}">
                </div>
                <div class="form-group">
                  <label for="inq-phone">Contact Phone Number*</label>
                  <input type="tel" id="inq-phone" class="form-input" required placeholder="10-digit mobile number" value="${loggedBuyer ? loggedBuyer.phone : ''}">
                </div>
                <div class="form-group">
                  <label for="inq-qty">Required Quantity (Quintal)*</label>
                  <input type="number" id="inq-qty" class="form-input" required min="${listing.minOrder}" value="${listing.minOrder}">
                </div>
                <div class="form-group">
                  <label for="inq-price">Your Offered Price (₹/Quintal)*</label>
                  <input type="number" id="inq-price" class="form-input" required min="100" value="${listing.price}">
                </div>
                <div class="form-group" id="mandi-comparison-container" style="margin-top: 12px; margin-bottom: 12px;">
                  <!-- Dynamically populated comparison -->
                </div>
                <div class="form-group">
                  <label for="inq-location">Delivery Destination Location*</label>
                  <input type="text" id="inq-location" class="form-input" required placeholder="E.g. Bhopal, Indore" value="${loggedBuyer ? loggedBuyer.city : ''}">
                </div>
                <div class="form-group">
                  <label for="inq-msg">Additional Message (Optional)</label>
                  <textarea id="inq-msg" class="form-textarea" placeholder="E.g. Looking for shipping rates, moisture certificates..."></textarea>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                  <button type="submit" class="btn btn-primary" style="flex: 1;">Send Inquiry</button>
                  <button type="button" class="btn btn-secondary buy-now-detail-btn" style="flex: 1; cursor:pointer;">🛒 Buy Now</button>
                </div>
              </form>
              <div class="form-note">🔒 Your contact details are securely protected until vendor replies.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindDetailEvents(listing);
  }

  static bindDetailEvents(listing) {
    const form = document.getElementById("listing-inquiry-form");
    
    // Add real-time price comparison change listeners
    const priceInput = document.getElementById("inq-price");
    const compareContainer = document.getElementById("mandi-comparison-container");
    const mandiRate = MandiService.getMandiRate(listing.commodity, listing.district);
    
    const updateComparison = () => {
      if (!priceInput || !compareContainer) return;
      const val = parseFloat(priceInput.value) || 0;
      const diff = mandiRate - val;
      
      let badgeHtml = '';
      if (diff > 0) {
        badgeHtml = `
          <div style="background: rgba(0, 181, 98, 0.08); color: var(--forest-secondary); font-size: 11.5px; padding: 8px 12px; border-radius: 6px; font-weight: 700; border: 1px solid rgba(0, 181, 98, 0.18); display: flex; align-items: center; gap: 6px; justify-content: center;">
            💡 Recommended Deal: Saves you ₹${diff.toLocaleString('en-IN')}/qtl compared to Mandi!
          </div>
        `;
      }
      
      compareContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12.5px; background:var(--bg-light); padding:10px; border-radius:6px; border:1px solid var(--gray-light); margin-bottom:8px;">
          <div>
            <span style="color:var(--gray-medium);">Live Mandi Price:</span>
            <div style="color:var(--dark); font-weight:700;">₹${mandiRate.toLocaleString('en-IN')}/qtl</div>
          </div>
          <div style="text-align: right;">
            <span style="color:var(--gray-medium);">Your Offered Rate:</span>
            <div style="color:var(--saffron-primary); font-weight:700;">₹${val.toLocaleString('en-IN')}/qtl</div>
          </div>
        </div>
        ${badgeHtml}
      `;
    };
    
    if (priceInput) {
      priceInput.addEventListener("input", updateComparison);
      updateComparison(); // initial run
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (!this.currentUser) {
          this.showToast("🔒 Please login as a Buyer to submit commodity inquiries.", true);
          this.showAuthModal("buyer");
          return;
        }

        if (this.currentUser.role !== "buyer") {
          this.showToast("🔒 Only Buyer accounts can send crop inquiries.", true);
          return;
        }
        
        const newInq = {
          id: "inq-" + Date.now(),
          listingId: listing.id,
          supplierId: listing.supplierId,
          buyerId: this.currentUser.id,
          buyerName: document.getElementById("inq-name").value,
          companyName: document.getElementById("inq-company").value,
          phone: document.getElementById("inq-phone").value,
          quantity: parseInt(document.getElementById("inq-qty").value),
          offeredRate: parseFloat(document.getElementById("inq-price").value) || listing.price,
          location: document.getElementById("inq-location").value,
          message: document.getElementById("inq-msg").value,
          date: new Date().toISOString().split('T')[0],
          status: "new",
          replies: []
        };

        const inquiries = LocalDB.getInquiries();
        inquiries.unshift(newInq);
        LocalDB.saveInquiries(inquiries);

        // Append real-time alert to Supplier notification bell registry!
        const notifications = LocalDB.getNotifications();
        notifications.unshift({
          id: "noti-" + Date.now(),
          supplierId: listing.supplierId,
          title: "New Inquiry Recieved",
          text: `${newInq.buyerName} submitted a new quote query for ${listing.commodity}.`,
          date: "Just now",
          read: false
        });
        LocalDB.saveNotifications(notifications);

        const listings = LocalDB.getListings();
        const targetList = listings.find(l => l.id === listing.id);
        if (targetList) targetList.inquiries += 1;
        LocalDB.saveListings(listings);

        this.showToast("Inquiry sent successfully! Managed in your Buyer Dashboard.");
        form.reset();
        window.location.hash = "#buyer-dashboard";
      });
    }

    const buyNowDetailBtn = document.querySelector(".buy-now-detail-btn");
    if (buyNowDetailBtn) {
      buyNowDetailBtn.addEventListener("click", () => {
        this.showBuyNowModal(listing);
      });
    }

    document.querySelectorAll(".thumb-image-mock").forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        document.querySelectorAll(".thumb-image-mock").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        
        const main = document.querySelector(".main-image-mock");
        if (index === 1) {
          main.innerHTML = "🌾";
        } else if (index === 2) {
          main.innerHTML = "🏭";
        } else {
          main.innerHTML = "🌱";
        }
      });
    });
  }

  // 4. SUPPLIER PROFILE
  static renderSupplierProfile(id) {
    const supplier = LocalDB.getSuppliers().find(s => s.id === id);
    if (!supplier) {
      this.appRoot.innerHTML = `<div class="container" style="padding:100px; text-align:center;"><h2>Supplier Not Found</h2></div>`;
      return;
    }

    const listings = LocalDB.getListings().filter(l => l.supplierId === id && l.status === "active");

    // Pre-calculate count stats
    const countAll = listings.length;
    const countSoybean = listings.filter(l => l.commodity === "Soybean").length;
    const countWheat = listings.filter(l => l.commodity === "Wheat").length;
    const countChana = listings.filter(l => l.commodity === "Chana").length;
    const countGarlic = listings.filter(l => l.commodity === "Garlic").length;

    // Reset local filter state
    this.catalogSearchQuery = "";
    this.catalogActiveFilter = "all";
    this.catalogActiveSort = "default";

    this.appRoot.innerHTML = `
      <div class="container" style="padding-top:40px; padding-bottom:60px;">
        <!-- Supplier Profile Main Card -->
        <div style="background:white; border-radius:12px; border:1px solid var(--gray-border); padding:40px; margin-bottom:30px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px;">
          <div>
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <h1 style="font-size:32px; margin:0;">${supplier.name}</h1>
              ${supplier.verified === "verified" ? '<span class="verified-badge">✓ Verified</span>' : ''}
            </div>
            <p style="color:var(--gray-medium); margin-top:8px;">📍 Operating District: <b>${supplier.district}, Madhya Pradesh</b> | Member since Jan 2025</p>
            <p style="margin-top:20px; font-size:16px; line-height:1.6; max-width:800px; color:#444;">${supplier.about}</p>
            
            <div class="catalog-header-actions">
              <button class="btn btn-secondary btn-sm" id="catalog-download-pdf">📥 Download Digital Catalog</button>
              <button class="btn btn-outline btn-sm" id="catalog-bulk-price-btn">✉️ Request Custom Price List</button>
            </div>
          </div>
          
          <div style="background:var(--bg-light); border:1px solid var(--gray-border); padding:20px; border-radius:8px; text-align:center; min-width:220px; flex-shrink:0;">
            <div style="font-size:24px; font-weight:800; color:var(--saffron-primary);">⭐ ${supplier.rating}</div>
            <div style="font-size:12px; color:var(--gray-medium); margin-top:4px;">Supplier Rating (${supplier.reviewsCount} reviews)</div>
            <div style="margin-top:12px; border-top:1px solid var(--gray-border); padding-top:12px; font-size:13px; text-align:left; display:flex; flex-direction:column; gap:6px;">
              <span>⚡ Response Rate: <b>${supplier.responseRate}</b></span>
              <span>⏱️ Response Time: <b>${supplier.responseTime}</b></span>
            </div>
          </div>
        </div>
        
        <!-- Interactive Product Catalog Section -->
        <div class="catalog-section">
          <div class="catalog-toolbar">
            <!-- Left Side: Search Bar -->
            <div class="catalog-search-box">
              <input type="text" id="catalog-search-input" placeholder="Search crops in this catalog...">
            </div>
            
            <!-- Middle Side: Category Filter Pills -->
            <div class="catalog-filter-pills">
              <button class="catalog-filter-pill active" data-filter="all">All <span class="catalog-pill-count">${countAll}</span></button>
              <button class="catalog-filter-pill" data-filter="Soybean">Soybean <span class="catalog-pill-count">${countSoybean}</span></button>
              <button class="catalog-filter-pill" data-filter="Wheat">Wheat <span class="catalog-pill-count">${countWheat}</span></button>
              <button class="catalog-filter-pill" data-filter="Chana">Chana <span class="catalog-pill-count">${countChana}</span></button>
              <button class="catalog-filter-pill" data-filter="Garlic">Garlic <span class="catalog-pill-count">${countGarlic}</span></button>
            </div>
            
            <!-- Right Side: Sort dropdown -->
            <div class="catalog-sort-box">
              <select id="catalog-sort-select">
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="qty-high">Stock: High to Low</option>
              </select>
            </div>
          </div>
          
          <!-- Catalog List Container -->
          <div id="catalog-grid-wrapper">
            <!-- Dynamic catalog listings injected here -->
          </div>
        </div>
      </div>
      
      <!-- Floating Quick Quote Inquiry Modal -->
      <div id="catalog-quote-modal" class="modal-overlay" style="display:none;">
        <div class="modal-content" style="max-width: 480px; position:relative;">
          <div class="modal-header">
            <h3 id="quote-modal-title" style="font-size:18px;">Request Direct Quote</h3>
            <button class="modal-close" id="quote-modal-close">&times;</button>
          </div>
          <form id="catalog-quote-form" style="margin-top:16px;">
            <input type="hidden" id="quote-listing-id">
            <div class="form-group" style="margin-bottom:12px;">
              <label style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Selected Product</label>
              <input type="text" id="quote-listing-title" class="form-input" readonly style="background:var(--gray-light); font-weight:700;">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label for="quote-name" style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Your Full Name*</label>
              <input type="text" id="quote-name" class="form-input" required placeholder="E.g. Ramesh Shah">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label for="quote-company" style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Company / Mill Name*</label>
              <input type="text" id="quote-company" class="form-input" required placeholder="E.g. Bhopal Flour Mills">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label for="quote-phone" style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Contact Mobile*</label>
              <input type="tel" id="quote-phone" class="form-input" required placeholder="10-digit mobile number">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label for="quote-qty" style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Desired Quantity (Quintals)*</label>
              <input type="number" id="quote-qty" class="form-input" required min="1">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label for="quote-location" style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Delivery Destination Location*</label>
              <input type="text" id="quote-location" class="form-input" required placeholder="E.g. Bhopal, MP">
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label for="quote-msg" style="font-weight:600; font-size:12px; margin-bottom:4px; display:block;">Custom Inquiry Terms (Optional)</label>
              <textarea id="quote-msg" class="form-textarea" placeholder="E.g. Requesting sample, specific moisture grades, covered truck shipping terms..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Submit Instant Quote Request</button>
          </form>
          <div style="font-size:11px; color:var(--gray-medium); text-align:center; margin-top:12px;">🔒 Your contact details are securely protected until vendor replies.</div>
        </div>
      </div>
    `;

    // Render the initial grid list
    this.updateCatalogGrid(id, supplier);

    // Bind event listeners
    this.bindSupplierProfileEvents(id, supplier);
  }

  static updateCatalogGrid(id, supplier) {
    const wrapper = document.getElementById("catalog-grid-wrapper");
    if (!wrapper) return;

    let list = LocalDB.getListings().filter(l => l.supplierId === id && l.status === "active");

    // Apply category filter pill state
    if (this.catalogActiveFilter !== "all") {
      list = list.filter(l => l.commodity === this.catalogActiveFilter);
    }

    // Apply search query state
    if (this.catalogSearchQuery.trim() !== "") {
      const q = this.catalogSearchQuery.toLowerCase();
      list = list.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.variety.toLowerCase().includes(q) || 
        l.commodity.toLowerCase().includes(q)
      );
    }

    // Apply sort select state
    if (this.catalogActiveSort === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (this.catalogActiveSort === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (this.catalogActiveSort === "qty-high") {
      list.sort((a, b) => b.quantity - a.quantity);
    }

    if (list.length === 0) {
      wrapper.innerHTML = `
        <div style="text-align:center; padding:60px 0; color:var(--gray-medium);">
          <div style="font-size:36px; margin-bottom:16px;">🌾</div>
          <h3>No matching commodity listings found</h3>
          <p style="font-size:14px; margin-top:4px;">Try searching for another crop or adjusting your search filters.</p>
        </div>
      `;
      return;
    }

    wrapper.innerHTML = `
      <div class="catalog-grid">
        ${list.map(l => {
          let themeClass = "wheat-card";
          if (l.commodity === "Soybean") themeClass = "soybean-card";
          else if (l.commodity === "Chana") themeClass = "chana-card";
          else if (l.commodity === "Garlic") themeClass = "garlic-card";

          return `
            <div class="catalog-card ${themeClass}">
              <div class="catalog-card-header">
                <div>
                  <span class="commodity-pill ${l.commodity.toLowerCase()}-pill">${l.commodity}</span>
                  <h3 style="margin-top:8px; font-size:16px;">${l.title}</h3>
                </div>
                <span style="font-size:11px; color:var(--gray-medium); white-space:nowrap;">${l.postedDaysAgo} days ago</span>
              </div>
              <div class="catalog-card-body">
                <div class="catalog-specs-grid">
                  <div class="catalog-spec-item">
                    <span class="catalog-spec-lbl">Variety</span>
                    <span class="catalog-spec-val">${l.variety}</span>
                  </div>
                  <div class="catalog-spec-item">
                    <span class="catalog-spec-lbl">Moisture</span>
                    <span class="catalog-spec-val">${l.moisture}</span>
                  </div>
                  <div class="catalog-spec-item">
                    <span class="catalog-spec-lbl">Grade</span>
                    <span class="catalog-spec-val">${l.grade}</span>
                  </div>
                  <div class="catalog-spec-item">
                    <span class="catalog-spec-lbl">Stock Vol</span>
                    <span class="catalog-spec-val">${l.quantity} qtl</span>
                  </div>
                  <div class="catalog-spec-item">
                    <span class="catalog-spec-lbl">Wholesale Price</span>
                    <span class="catalog-spec-val" style="color:var(--forest-secondary); font-weight: 700;">₹${l.price.toLocaleString('en-IN')}/qtl</span>
                  </div>
                  <div class="catalog-spec-item">
                    <span class="catalog-spec-lbl">Min Purchase</span>
                    <span class="catalog-spec-val">${l.minOrder} qtl</span>
                  </div>
                </div>
              </div>
              <div class="catalog-card-actions">
                <a href="#listing-detail/${l.id}" class="btn btn-outline btn-sm">View Details</a>
                <button class="btn btn-primary btn-sm catalog-quote-btn" data-id="${l.id}" data-title="${l.title}" data-commodity="${l.commodity}" data-min="${l.minOrder}">Request Quote</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Re-bind click event on newly rendered quote buttons
    document.querySelectorAll(".catalog-quote-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const title = btn.getAttribute("data-title");
        const commodity = btn.getAttribute("data-commodity");
        const minOrder = btn.getAttribute("data-min");
        this.openQuoteModal(id, title, commodity, minOrder);
      });
    });
  }

  static bindSupplierProfileEvents(id, supplier) {
    const searchInput = document.getElementById("catalog-search-input");
    const sortSelect = document.getElementById("catalog-sort-select");
    const pills = document.querySelectorAll(".catalog-filter-pill");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.catalogSearchQuery = e.target.value;
        this.updateCatalogGrid(id, supplier);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.catalogActiveSort = e.target.value;
        this.updateCatalogGrid(id, supplier);
      });
    }

    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.catalogActiveFilter = pill.getAttribute("data-filter");
        this.updateCatalogGrid(id, supplier);
      });
    });

    // 📥 Download Digital Catalog CSV simulation with progress spinner
    const downloadBtn = document.getElementById("catalog-download-pdf");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `⏳ Compiling catalog...`;
        this.showToast("⚙️ Connecting and compiling digital price catalog...");

        setTimeout(() => {
          downloadBtn.innerHTML = `⏳ Encrypting spreadsheet...`;
        }, 800);

        setTimeout(() => {
          // Generate CSV data dynamically representing the active catalog
          const listings = LocalDB.getListings().filter(l => l.supplierId === id && l.status === "active");
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += "TradeVithika Product Catalog - " + supplier.name + "\r\n";
          csvContent += "Commodity,Variety,Grade,Moisture,Price (per Quintal),Min Order (Quintals),Stock Quantity (Quintals)\r\n";
          
          listings.forEach(l => {
            csvContent += `${l.commodity},${l.variety},${l.grade},${l.moisture},${l.price},${l.minOrder},${l.quantity}\r\n`;
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `TradeVithika_${supplier.name.replace(/\s+/g, "_")}_Catalog.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          downloadBtn.disabled = false;
          downloadBtn.innerHTML = `📥 Download Digital Catalog`;
          this.showToast("✅ Digital CSV catalog generated and downloaded!");
        }, 1800);
      });
    }

    // ✉️ Request Custom Price List
    const bulkBtn = document.getElementById("catalog-bulk-price-btn");
    if (bulkBtn) {
      bulkBtn.addEventListener("click", () => {
        const loggedUser = LocalDB.getLoggedUser();
        if (!loggedUser) {
          this.showToast("🔒 Please login as a Buyer to request pricing.", true);
          this.showAuthModal("buyer");
          return;
        }
        if (loggedUser.role !== "buyer") {
          this.showToast("🔒 Only Buyer accounts can request pricing lists.", true);
          return;
        }

        if (confirm(`Would you like to send a direct inquiry to ${supplier.name} requesting their wholesale bulk contract price lists and off-mandi delivery terms?`)) {
          // Seed custom pricing notification
          const notifications = LocalDB.getNotifications();
          notifications.unshift({
            id: "noti-" + Date.now(),
            supplierId: id,
            title: "Bulk Pricing Requested",
            text: `${loggedUser.name} requested your wholesale bulk contract pricing sheet.`,
            date: "Just now",
            read: false
          });
          LocalDB.saveNotifications(notifications);

          this.showToast("✅ Custom pricing sheet requested! Vendor notified.");
        }
      });
    }

    // Modal Close
    const modalClose = document.getElementById("quote-modal-close");
    const modal = document.getElementById("catalog-quote-modal");
    if (modalClose && modal) {
      modalClose.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    // Form submission
    const form = document.getElementById("catalog-quote-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const loggedUser = LocalDB.getLoggedUser();
        if (!loggedUser) {
          modal.style.display = "none";
          this.showToast("🔒 Please login as a Buyer to request quote inquiries.", true);
          this.showAuthModal("buyer");
          return;
        }
        if (loggedUser.role !== "buyer") {
          this.showToast("🔒 Only Buyer accounts can submit crop inquiries.", true);
          return;
        }

        const listId = document.getElementById("quote-listing-id").value;
        const targetListing = LocalDB.getListings().find(l => l.id === listId);

        const newInq = {
          id: "inq-" + Date.now(),
          listingId: listId,
          supplierId: id,
          buyerId: loggedUser.id,
          buyerName: document.getElementById("quote-name").value,
          companyName: document.getElementById("quote-company").value,
          phone: document.getElementById("quote-phone").value,
          quantity: parseInt(document.getElementById("quote-qty").value),
          location: document.getElementById("quote-location").value,
          message: document.getElementById("quote-msg").value,
          date: new Date().toISOString().split('T')[0],
          status: "new",
          replies: []
        };

        const inquiries = LocalDB.getInquiries();
        inquiries.unshift(newInq);
        LocalDB.saveInquiries(inquiries);

        // Add real-time VendorOS alert notification
        const notifications = LocalDB.getNotifications();
        notifications.unshift({
          id: "noti-" + Date.now(),
          supplierId: id,
          title: "New Inquiry Received",
          text: `${newInq.buyerName} submitted an instant catalog quote request for ${targetListing.commodity}.`,
          date: "Just now",
          read: false
        });
        LocalDB.saveNotifications(notifications);

        // Increment listing inquiries counter
        const listings = LocalDB.getListings();
        const tarL = listings.find(l => l.id === listId);
        if (tarL) tarL.inquiries += 1;
        LocalDB.saveListings(listings);

        modal.style.display = "none";
        this.showToast("✅ Inquiry sent successfully! Manage in your Buyer Dashboard.");
        form.reset();
        window.location.hash = "#buyer-dashboard";
      });
    }
  }

  static openQuoteModal(id, title, commodity, minOrder) {
    const modal = document.getElementById("catalog-quote-modal");
    if (!modal) return;

    // Load active buyer pre-seeded data if available
    const loggedUser = LocalDB.getLoggedUser();
    let buyerObj = null;
    if (loggedUser && loggedUser.role === "buyer") {
      buyerObj = LocalDB.getBuyers().find(b => b.id === loggedUser.id);
    }

    document.getElementById("quote-listing-id").value = id;
    document.getElementById("quote-listing-title").value = `${commodity} — ${title}`;
    
    document.getElementById("quote-qty").min = minOrder;
    document.getElementById("quote-qty").value = minOrder;

    if (buyerObj) {
      document.getElementById("quote-name").value = buyerObj.name;
      document.getElementById("quote-company").value = buyerObj.companyName;
      document.getElementById("quote-phone").value = buyerObj.phone;
      document.getElementById("quote-location").value = buyerObj.city;
    } else {
      document.getElementById("quote-name").value = "";
      document.getElementById("quote-company").value = "";
      document.getElementById("quote-phone").value = "";
      document.getElementById("quote-location").value = "";
    }

    modal.style.display = "flex";
  }

  static showBuyNowModal(listing) {
    if (!this.currentUser) {
      this.showToast("🔒 Please login as a Buyer to buy crops.", true);
      this.showAuthModal("buyer");
      return;
    }
    if (this.currentUser.role !== "buyer") {
      this.showToast("🔒 Only Buyer accounts can instantly purchase crops.", true);
      return;
    }

    let modal = document.getElementById("buy-now-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "buy-now-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    const mandiRate = MandiService.getMandiRate(listing.commodity, listing.district);
    const savingsPerQtl = mandiRate - listing.price;
    const initialQty = listing.minOrder;
    const initialTotal = initialQty * listing.price;
    const initialSavings = savingsPerQtl > 0 ? (savingsPerQtl * initialQty) : 0;

    modal.innerHTML = `
      <div class="modal-content premium-glass" style="max-width: 820px; width: 95%; position:relative; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(25px); border: 1.5px solid rgba(8, 28, 54, 0.08); box-shadow: 0 30px 60px rgba(8,28,54,0.15); padding: 0; overflow: hidden; border-radius: 12px; display: flex; flex-direction: column;">
        
        <!-- Header with organic linear gradient -->
        <div style="background: linear-gradient(135deg, var(--forest-secondary), #0F3D28); color: var(--white); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 20px; font-weight: 700; color: var(--white) !important; margin: 0; display:flex; align-items:center; gap:8px;">🛒 B2B Escrow Checkout Portal</h3>
            <span style="font-size: 11px; opacity: 0.8;">Agri-Commodity wholesale clearing network (MP Cooperative Escrow)</span>
          </div>
          <button class="modal-close" id="buy-now-modal-close" style="font-size:28px; background:none; border:none; cursor:pointer; color: var(--white); opacity: 0.8; transition: opacity 0.2s;">&times;</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; padding: 24px;" class="checkout-split-layout">
          
          <!-- Left Column: Parameters & Inputs -->
          <div>
            <div style="background: rgba(8, 28, 54, 0.03); border: 1px solid rgba(8, 28, 54, 0.06); padding: 14px; border-radius: 8px; margin-bottom: 18px; font-size: 13.5px;">
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; color: var(--charcoal);">${listing.title}</div>
              <div style="color: var(--gray-medium); margin-bottom: 8px; font-size:12px;">📍 Taluka: ${listing.taluka}, District: ${listing.district}, MP</div>
              <div style="display:flex; justify-content:space-between; font-size: 13px;">
                <span>Wholesale Price: <b style="color:var(--forest-secondary);">₹${listing.price.toLocaleString('en-IN')}/qtl</b></span>
                <span>Available Stock: <b style="color:var(--charcoal);">${listing.quantity} qtl</b></span>
              </div>
            </div>

            <form id="buy-now-form">
              <!-- Quantity Selector -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-weight: 700; font-size: 13px; color: var(--charcoal); margin-bottom: 6px; display: block;">Purchase Quantity (Quintals)*</label>
                <div style="display:flex; gap:10px; align-items:center;">
                  <input type="range" id="bn-quantity-slider" class="negotiation-slider" style="flex:1;" min="${listing.minOrder}" max="${listing.quantity}" value="${listing.minOrder}">
                  <input type="number" id="bn-quantity" class="form-input" required min="${listing.minOrder}" max="${listing.quantity}" value="${listing.minOrder}" style="width: 100px; text-align: center; font-weight:700;">
                </div>
                <span style="font-size:11px; color:var(--gray-medium); display:block; margin-top:4px;">Min order: ${listing.minOrder} qtl | Max stock: ${listing.quantity} qtl</span>
              </div>

              <!-- Escrow Payment Selection Tiles -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-weight: 700; font-size: 13px; color: var(--charcoal); margin-bottom: 6px; display: block;">Escrow Payment Terms*</label>
                <div class="checkout-tiles-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
                  <div class="checkout-tile pterm-tile active" data-value="NEFT/RTGS Bank Transfer" style="border: 2px solid var(--saffron-primary); background: rgba(232, 114, 28, 0.05); padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 18px;">🏦</div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--charcoal); margin-top: 4px;">NEFT/RTGS</div>
                  </div>
                  <div class="checkout-tile pterm-tile" data-value="Letter of Credit (LC)" style="border: 2px solid var(--gray-border); background: var(--white); padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 18px;">📋</div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--charcoal); margin-top: 4px;">Letter of Credit</div>
                  </div>
                  <div class="checkout-tile pterm-tile" data-value="15-day Vendor Credit" style="border: 2px solid var(--gray-border); background: var(--white); padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 18px;">💳</div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--charcoal); margin-top: 4px;">15-Day Credit</div>
                  </div>
                </div>
                <input type="hidden" id="bn-payment-terms" value="NEFT/RTGS Bank Transfer">
              </div>

              <!-- Freight Logistics Selection Tiles -->
              <div class="form-group" style="margin-bottom: 20px;">
                <label style="font-weight: 700; font-size: 13px; color: var(--charcoal); margin-bottom: 6px; display: block;">Freight & Transport Logistics*</label>
                <div class="checkout-tiles-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                  <div class="checkout-tile-log logistics-tile active" data-value="Self-arranged Transport" style="border: 2px solid var(--saffron-primary); background: rgba(232, 114, 28, 0.05); padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 18px;">🚜</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--charcoal); margin-top: 4px;">Ex-Warehouse (Self)</div>
                  </div>
                  <div class="checkout-tile-log logistics-tile" data-value="TradeVithika Freight Logistics" style="border: 2px solid var(--gray-border); background: var(--white); padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.3s;">
                    <div style="font-size: 18px;">🚚</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--charcoal); margin-top: 4px;">Door Delivery (Freight)</div>
                  </div>
                </div>
                <input type="hidden" id="bn-logistics" value="Self-arranged Transport">
              </div>

              <button type="submit" class="btn btn-secondary btn-full" style="padding:14px; font-size:16px; border-radius: 6px; font-weight:700;">🤝 Secure Escrow Lock & Purchase</button>
            </form>
          </div>

          <!-- Right Column: Live updating contract draft preview -->
          <div>
            <div class="live-contract-preview" style="background: radial-gradient(circle at 10% 10%, #FFFFFF, #FAF8F4 100%); border: 3px double #C5A059; border-radius: 8px; padding: 24px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-shadow: var(--shadow-sm); min-height: 380px;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 54px; color: rgba(197, 160, 89, 0.04); font-weight: 900; pointer-events: none; text-transform: uppercase; letter-spacing: 4px;">DRAFT</div>
              
              <div>
                <div style="text-align: center; font-size: 10px; color: #C5A059; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">📜 B2B Smart Escrow Contract</div>
                <h4 style="text-align: center; font-size: 14px; font-weight: 800; color: #081C36; margin: 0 0 10px 0;">AGRI-PURCHASE SALES ORDER</h4>
                
                <div style="height: 1px; background: linear-gradient(90deg, transparent, #C5A059 50%, transparent); margin-bottom: 16px;"></div>
                
                <div style="font-size: 12.5px; line-height: 1.6; color: var(--charcoal);">
                  <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                    <span style="color:var(--gray-medium);">🏢 Buyer Entity:</span> 
                    <span id="preview-buyer" style="font-weight:700; text-align:right;">${this.currentUser.name}</span>
                  </div>
                  <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                    <span style="color:var(--gray-medium);">🚜 Supplier Farm:</span> 
                    <span id="preview-supplier" style="font-weight:700; text-align:right;">${listing.supplierName || 'Rajesh Agro Traders'}</span>
                  </div>
                  <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                    <span style="color:var(--gray-medium);">🌾 Commodity Lot:</span> 
                    <span style="font-weight:700; text-align:right;">${listing.commodity} (${listing.variety || 'FAQ Grade'})</span>
                  </div>
                  <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                    <span style="color:var(--gray-medium);">📦 Volume:</span> 
                    <span id="preview-volume" style="font-weight:800; color:var(--forest-secondary);">${listing.minOrder} Quintals</span>
                  </div>
                  <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                    <span style="color:var(--gray-medium);">💳 Payment Escrow:</span> 
                    <span id="preview-payment" style="font-weight:700; font-size:11px; text-align:right; color:var(--saffron-primary);">NEFT/RTGS Bank Transfer</span>
                  </div>
                  <div style="margin-bottom: 6px; display:flex; justify-content:space-between;">
                    <span style="color:var(--gray-medium);">🚚 Freight Terms:</span> 
                    <span id="preview-logistics" style="font-weight:700; font-size:11px; text-align:right;">Self-arranged (Ex-Warehouse)</span>
                  </div>
                </div>
              </div>
              
              <div style="margin-top: 20px;">
                <!-- Real-time Mandi savings badge -->
                <div id="checkout-savings-container" style="background: var(--forest-light); border: 1px solid rgba(0, 181, 98, 0.15); padding: 12px; border-radius: 6px; text-align: center; margin-bottom: 12px; display: ${initialSavings > 0 ? 'block' : 'none'};">
                  <span style="font-size: 10px; color: var(--forest-hover); display: block; font-weight: 700; text-transform: uppercase;">💰 MOCK MANDI MARKET SAVINGS</span>
                  <b style="font-size: 13.5px; color: var(--forest-secondary);" id="checkout-savings-val">Saved ₹${initialSavings.toLocaleString('en-IN')}!</b>
                </div>

                <div style="background: rgba(197, 160, 89, 0.05); border: 1.5px solid rgba(197, 160, 89, 0.2); padding: 14px; border-radius: 6px; text-align: center;">
                  <span style="font-size: 10.5px; color: var(--gray-medium); display: block; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Estimated Clearing Value</span>
                  <b style="font-size: 20px; color: var(--forest-secondary);" id="preview-total-amount">₹${initialTotal.toLocaleString('en-IN')}</b>
                </div>
                
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 12px; justify-content: center; font-size: 11px; color: var(--forest-secondary); font-weight: 700; background: rgba(0, 181, 98, 0.05); padding: 8px; border-radius: 4px; border: 1px dashed rgba(0, 181, 98, 0.2);">
                  <span>🔒 Escrow Active (MP Agri Co-op Vault)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    `;

    modal.style.display = "flex";
    modal.classList.add("active");

    // Close handler
    document.getElementById("buy-now-modal-close").addEventListener("click", () => {
      modal.style.display = "none";
      modal.classList.remove("active");
    });

    // Elements
    const qtySlider = document.getElementById("bn-quantity-slider");
    const qtyInput = document.getElementById("bn-quantity");
    const previewVolume = document.getElementById("preview-volume");
    const previewTotal = document.getElementById("preview-total-amount");
    const savingsContainer = document.getElementById("checkout-savings-container");
    const savingsVal = document.getElementById("checkout-savings-val");

    // Interactive slider & input double bindings
    const updateCalculations = (q) => {
      if (q < listing.minOrder) q = listing.minOrder;
      if (q > listing.quantity) q = listing.quantity;

      qtyInput.value = q;
      qtySlider.value = q;

      previewVolume.innerText = `${q} Quintals`;
      const tot = q * listing.price;
      previewTotal.innerText = `₹${tot.toLocaleString('en-IN')}`;

      // Live Mandi savings calculation
      const currentSavings = savingsPerQtl > 0 ? (savingsPerQtl * q) : 0;
      if (currentSavings > 0) {
        savingsContainer.style.display = "block";
        savingsVal.innerText = `Saved ₹${currentSavings.toLocaleString('en-IN')}!`;
      } else {
        savingsContainer.style.display = "none";
      }
    };

    qtySlider.addEventListener("input", (e) => {
      updateCalculations(parseInt(e.target.value) || listing.minOrder);
    });

    qtyInput.addEventListener("input", (e) => {
      updateCalculations(parseInt(e.target.value) || listing.minOrder);
    });

    // Selectable checkout tiles events: Payments
    const hiddenPTerms = document.getElementById("bn-payment-terms");
    const previewPayment = document.getElementById("preview-payment");
    document.querySelectorAll(".pterm-tile").forEach(tile => {
      tile.addEventListener("click", (e) => {
        const clickedTile = e.currentTarget;
        document.querySelectorAll(".pterm-tile").forEach(t => {
          t.style.border = "2px solid var(--gray-border)";
          t.style.background = "var(--white)";
        });
        clickedTile.style.border = "2px solid var(--saffron-primary)";
        clickedTile.style.background = "rgba(232, 114, 28, 0.05)";
        
        const val = clickedTile.getAttribute("data-value");
        hiddenPTerms.value = val;
        previewPayment.innerText = val;
      });
    });

    // Selectable checkout tiles events: Logistics
    const hiddenLogistics = document.getElementById("bn-logistics");
    const previewLogistics = document.getElementById("preview-logistics");
    document.querySelectorAll(".logistics-tile").forEach(tile => {
      tile.addEventListener("click", (e) => {
        const clickedTile = e.currentTarget;
        document.querySelectorAll(".logistics-tile").forEach(t => {
          t.style.border = "2px solid var(--gray-border)";
          t.style.background = "var(--white)";
        });
        clickedTile.style.border = "2px solid var(--saffron-primary)";
        clickedTile.style.background = "rgba(232, 114, 28, 0.05)";
        
        const val = clickedTile.getAttribute("data-value");
        hiddenLogistics.value = val;
        previewLogistics.innerText = val === "Self-arranged Transport" ? "Self-arranged (Ex-Warehouse)" : "Door Delivery (Freight)";
      });
    });

    // Form submission
    const form = document.getElementById("buy-now-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = parseInt(qtyInput.value);
      if (isNaN(q) || q < listing.minOrder || q > listing.quantity) {
        this.showToast("⚠️ Please enter a valid quantity within available stock limits.", true);
        return;
      }

      const pTerms = hiddenPTerms.value;
      const logistics = hiddenLogistics.value;

      // 1. Create order object
      const newOrder = {
        id: "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
        listingId: listing.id,
        buyerId: this.currentUser.id,
        supplierId: listing.supplierId,
        quantity: q,
        unitPrice: listing.price,
        totalAmount: q * listing.price,
        paymentTerms: pTerms,
        logisticsType: logistics,
        orderStatus: "placed", // placed, shipped, delivered, closed
        orderDate: new Date().toISOString().split('T')[0]
      };

      // 2. Save order
      LocalDB.saveOrder(newOrder);

      // 3. Deduct listing quantity
      const allListings = LocalDB.getListings();
      const targetL = allListings.find(l => l.id === listing.id);
      if (targetL) {
        targetL.quantity = Math.max(0, targetL.quantity - q);
        // If stock goes to 0, pause or delete or keep it 0. Let's keep it active with 0 stock or pause it if 0
        if (targetL.quantity === 0) {
          targetL.status = "paused";
        }
        LocalDB.saveListings(allListings);
      }

      // 4. Send Supplier notification
      const notifications = LocalDB.getNotifications();
      notifications.unshift({
        id: "noti-" + Date.now(),
        supplierId: listing.supplierId,
        title: "🎉 New Bulk Order Placed!",
        text: `${this.currentUser.name} placed a bulk order of ${q} quintals of ${listing.commodity} for ₹${(q * listing.price).toLocaleString('en-IN')}.`,
        date: "Just now",
        read: false
      });
      LocalDB.saveNotifications(notifications);

      modal.style.display = "none";
      modal.classList.remove("active");
      this.showToast(`🎉 Order Placed! ${q} quintals locked. Verified B2B contract ORD-${newOrder.id} generated!`);
      
      // Redirect to buyer dashboard orders section
      window.location.hash = "#buyer-dashboard";
    });
  }

  // 5. SUPPLIER DASHBOARD (VENDOROS)
  static renderDashboard() {
    this.loggedSupplier = LocalDB.getLoggedSupplier();

    this.appRoot.innerHTML = `
      <div class="dashboard-wrapper">
        <aside class="dashboard-sidebar">
          <div class="sidebar-profile">
            <div class="sidebar-avatar">
              ${this.loggedSupplier.name.charAt(0)}
            </div>
            <div class="sidebar-name">${this.loggedSupplier.name}</div>
            <div style="margin-top:6px;">
              ${this.loggedSupplier.verified === 'verified' 
                ? '<span class="verified-badge">✓ Verified</span>' 
                : this.loggedSupplier.verified === 'pending'
                ? '<span class="under-review-badge">Under Review</span>'
                : '<span class="unverified-badge">Unverified</span>'
              }
            </div>
          </div>
          
          <ul class="dashboard-menu">
            <li class="dashboard-menu-link active" data-sub="home">🏠 Dashboard</li>
            <li class="dashboard-menu-link" data-sub="listings">📦 My Listings</li>
            <li class="dashboard-menu-link" data-sub="orders">🤝 Sales Orders</li>
            <li class="dashboard-menu-link" data-sub="inquiries" id="dash-inbox-link">
              📩 Inquiries 
              <span id="dash-inq-badge" style="background:var(--saffron-primary); color:white; font-size:10px; font-weight:700; padding:2px 6px; border-radius:10px; margin-left:auto; display:none;">0</span>
            </li>
            <li class="dashboard-menu-link" data-sub="analytics">📊 Analytics</li>
            <li class="dashboard-menu-link" data-sub="documents" id="nav-docs-link">📄 Documents</li>
            <li class="dashboard-menu-link" data-sub="profile">👤 My Profile</li>
          </ul>
        </aside>

        <!-- Main Dashboard Workspace Frame -->
        <div style="display:flex; flex-direction:column; flex-grow:1; min-height:100%;">
          
          <!-- Shared Header Top bar with Notification Bell inside workspace -->
          <div class="container" style="padding-top:30px; padding-bottom:10px;">
            <div class="dash-workspace-header">
              <h2 style="font-size:24px; font-weight:800;" id="dash-workspace-title">VendorOS Console</h2>
              
              <!-- Bell Notification Center icon -->
              <div class="dash-bell-container" id="dash-noti-bell-btn">
                <span class="dash-bell-icon">🔔</span>
                <span class="dash-bell-badge" id="dash-noti-unread-count">0</span>
                
                <!-- Slide dropdown notifications panel -->
                <div class="dash-noti-panel" id="dash-noti-dropdown">
                  <div class="dash-noti-header">
                    <span>Notifications Feed</span>
                    <a href="javascript:void(0)" id="dash-noti-clear-btn" style="color:var(--saffron-primary); font-size:11px;">Clear All</a>
                  </div>
                  <ul class="dash-noti-list" id="dash-noti-items-list">
                    <!-- Notifications items injected dynamically -->
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <main class="dashboard-main" id="dashboard-workspace" style="flex-grow:1; padding-top:10px;">
            <!-- Dynamic subpages injected here -->
          </main>
        </div>
      </div>
    `;

    this.bindDashboardNav();
    this.bindDashboardHeaderNoti();
    
    const navSub = sessionStorage.getItem("dash_nav_subpage") || "home";
    sessionStorage.removeItem("dash_nav_subpage");
    
    document.querySelectorAll(".dashboard-menu-link").forEach(l => {
      l.classList.toggle("active", l.getAttribute("data-sub") === navSub);
    });

    this.renderDashboardSubpage(navSub);
    this.updateDashboardBadgeCount();
    this.updateBellNotificationBadge();
  }

  static updateDashboardBadgeCount() {
    const list = LocalDB.getInquiries().filter(i => i.supplierId === this.loggedSupplier.id && i.status === "new");
    const badge = document.getElementById("dash-inq-badge");
    if (badge) {
      if (list.length > 0) {
        badge.innerText = list.length;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    }
  }

  // --- BELL NOTIFICATION DROPDOWN CONTROLLERS ---
  static bindDashboardHeaderNoti() {
    const bellBtn = document.getElementById("dash-noti-bell-btn");
    const dropdown = document.getElementById("dash-noti-dropdown");
    const clearBtn = document.getElementById("dash-noti-clear-btn");

    if (bellBtn) {
      bellBtn.addEventListener("click", (e) => {
        // Stop bubbling so clicking inside doesn't immediately close
        e.stopPropagation();
        dropdown.classList.toggle("active");
        
        // Mark all as read when opening dropdown
        if (dropdown.classList.contains("active")) {
          const list = LocalDB.getNotifications();
          list.forEach(n => { if (n.supplierId === this.loggedSupplier.id) n.read = true; });
          LocalDB.saveNotifications(list);
          this.updateBellNotificationBadge();
        }
      });
    }

    // Close panel when clicking outside
    document.addEventListener("click", () => {
      if (dropdown) dropdown.classList.remove("active");
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        let list = LocalDB.getNotifications();
        list = list.filter(n => n.supplierId !== this.loggedSupplier.id);
        LocalDB.saveNotifications(list);
        
        this.updateBellNotificationBadge();
        this.renderNotificationList();
        this.showToast("All notifications cleared");
      });
    }

    this.renderNotificationList();
  }

  static updateBellNotificationBadge() {
    const list = LocalDB.getNotifications().filter(n => n.supplierId === this.loggedSupplier.id && !n.read);
    const badge = document.getElementById("dash-noti-unread-count");
    if (badge) {
      if (list.length > 0) {
        badge.innerText = list.length;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }
  }

  static renderNotificationList() {
    const list = LocalDB.getNotifications().filter(n => n.supplierId === this.loggedSupplier.id);
    const container = document.getElementById("dash-noti-items-list");
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <li style="padding:30px; text-align:center; color:var(--gray-medium); font-size:12.5px;">
          📭 No new alerts
        </li>
      `;
      return;
    }

    container.innerHTML = list.map(n => `
      <li class="dash-noti-item ${!n.read ? 'unread' : ''}">
        <div class="dash-noti-item-title">${n.title}</div>
        <p class="dash-noti-item-text">${n.text}</p>
        <span class="dash-noti-item-time">${n.date}</span>
      </li>
    `).join('');
  }

  static bindDashboardNav() {
    document.querySelectorAll(".dashboard-menu-link").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".dashboard-menu-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        
        const sub = link.getAttribute("data-sub");
        this.renderDashboardSubpage(sub);
      });
    });
  }

  static renderDashboardSubpage(subpage) {
    const workspace = document.getElementById("dashboard-workspace");
    const headerTitle = document.getElementById("dash-workspace-title");
    if (!workspace) return;

    this.loggedSupplier = LocalDB.getLoggedSupplier(); 
    
    switch (subpage) {
      case "home":
        headerTitle.innerText = "VendorOS Console";
        this.renderDashboardHome(workspace);
        break;
      case "listings":
        headerTitle.innerText = "My Commodity Listings";
        this.renderDashboardListings(workspace);
        break;
      case "orders":
        headerTitle.innerText = "Sales Order Dispatches";
        this.renderDashboardOrders(workspace);
        break;
      case "inquiries":
        headerTitle.innerText = "Inquiry Inbox Manager";
        this.renderDashboardInquiries(workspace);
        break;
      case "analytics":
        headerTitle.innerText = "Performance & Traffic Analytics";
        this.renderDashboardAnalytics(workspace);
        break;
      case "documents":
        headerTitle.innerText = "Verification & License Manager";
        this.renderDashboardDocuments(workspace);
        break;
      case "profile":
        headerTitle.innerText = "My Business Profile Settings";
        this.renderDashboardProfile(workspace);
        break;
    }
  }

  // 5.1 Dashboard Home Panel
  static renderDashboardHome(workspace) {
    const listings = LocalDB.getListings().filter(l => l.supplierId === this.loggedSupplier.id);
    const inquiries = LocalDB.getInquiries().filter(i => i.supplierId === this.loggedSupplier.id);
    const newInquiries = inquiries.filter(i => i.status === "new");

    workspace.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
        <h3 style="font-size: 20px; font-weight:700;">Welcome, ${this.loggedSupplier.contactPerson}! 🌾</h3>
        <button class="btn btn-primary btn-sm" id="dash-quick-add-btn">➕ Add New Listing</button>
      </div>

      <!-- Quick Stats -->
      <div class="dashboard-stats-grid">
        <div class="dash-stat-card">
          <span class="dash-stat-label">Active Listings</span>
          <span class="dash-stat-value">${listings.filter(l => l.status === 'active').length}</span>
          <span class="dash-stat-dot green"></span>
        </div>
        <div class="dash-stat-card">
          <span class="dash-stat-label">New Inquiries</span>
          <span class="dash-stat-value" id="dash-home-new-inq-count">${newInquiries.length}</span>
          <span class="dash-stat-dot saffron"></span>
        </div>
        <div class="dash-stat-card">
          <span class="dash-stat-label">Monthly Profile Views</span>
          <span class="dash-stat-value">${this.loggedSupplier.views}</span>
          <span class="dash-stat-dot blue"></span>
        </div>
        <div class="dash-stat-card">
          <span class="dash-stat-label">Verification Status</span>
          <span class="dash-stat-value" style="font-size:16px; font-weight:700; color: ${this.loggedSupplier.verified === 'verified' ? 'var(--forest-secondary)' : 'var(--gold-accent)'}">
            ${this.loggedSupplier.verified === 'verified' ? '✓ Fully Verified' : 'Action Required'}
          </span>
        </div>
      </div>

      <div class="dashboard-grid-layout">
        <!-- Inbox Feed Preview -->
        <div class="dash-panel">
          <div class="dash-panel-header">
            <h3>Recent Buyer Inquiries</h3>
            <button class="btn btn-outline btn-sm" id="dash-view-inbox-btn">Go to Inbox</button>
          </div>
          
          <div id="dash-home-inquiries-feed">
            ${newInquiries.length === 0 ? `
              <div style="text-align:center; padding:30px; color:var(--gray-medium);">
                <p>📭 Your inbox is empty. Make sure your listings are active and competitive!</p>
              </div>
            ` : newInquiries.slice(0, 3).map(i => {
              const list = LocalDB.getListings().find(l => l.id === i.listingId);
              return `
                <div style="border-bottom:1px solid var(--gray-light); padding:16px 0; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <h4 style="font-size:15px; font-weight:700;">${i.buyerName} — ${i.companyName}</h4>
                    <span style="font-size:13px; color:var(--gray-medium);">Quantity: <b>${i.quantity} qtl</b> Soybean | Destination: <b>${i.location}</b></span>
                  </div>
                  <button class="btn btn-outline-saffron btn-sm dash-quick-reply-btn" data-inqid="${i.id}">Reply Inbox</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Onboarding Checklist -->
        <div class="dash-panel">
          <div class="dash-panel-header">
            <h3>Onboarding Tasks</h3>
          </div>
          
          <div>
            <div class="checklist-item checked">
              <span class="checklist-icon">✓</span>
              <span>Profile Created</span>
            </div>
            <div class="checklist-item ${listings.length > 0 ? 'checked' : ''}">
              <span class="checklist-icon">${listings.length > 0 ? '✓' : '☐'}</span>
              <span>First Listing Added</span>
            </div>
            <div class="checklist-item ${this.loggedSupplier.onboardingProgress >= 75 ? 'checked' : ''}">
              <span class="checklist-icon">${this.loggedSupplier.onboardingProgress >= 75 ? '✓' : '☐'}</span>
              <span>Aadhaar & GST Uploaded</span>
            </div>
            <div class="checklist-item ${this.loggedSupplier.verified === 'verified' ? 'checked' : ''}">
              <span class="checklist-icon">${this.loggedSupplier.verified === 'verified' ? '✓' : '☐'}</span>
              <span>Verified Supplier Badge Issued</span>
            </div>
            
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${this.loggedSupplier.onboardingProgress}%"></div>
            </div>
            <div style="font-size:12px; color:var(--gray-medium); text-align:right; margin-top:6px;">${this.loggedSupplier.onboardingProgress}% Complete</div>
          </div>
        </div>
      </div>
    `;

    this.bindDashboardHomeEvents();
  }

  static bindDashboardHomeEvents() {
    document.getElementById("dash-quick-add-btn").addEventListener("click", () => {
      document.querySelector('[data-sub="listings"]').click();
    });

    document.getElementById("dash-view-inbox-btn").addEventListener("click", () => {
      document.querySelector('[data-sub="inquiries"]').click();
    });

    document.querySelectorAll(".dash-quick-reply-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const inqId = e.target.getAttribute("data-inqid");
        sessionStorage.setItem("active_inbox_id", inqId);
        document.querySelector('[data-sub="inquiries"]').click();
      });
    });
  }

  static renderDashboardOrders(workspace) {
    const orders = LocalDB.getOrders().filter(o => o.supplierId === this.loggedSupplier.id);

    workspace.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
        <h3 style="font-size: 18px; font-weight:700;">Sales Order Contracts & Logistics</h3>
        <span style="font-size:12.5px; color:var(--gray-medium);">${orders.length} Active Orders</span>
      </div>

      <div class="dash-panel">
        ${orders.length === 0 ? `
          <div style="text-align:center; padding:50px 20px; color:var(--gray-medium);">
            <span style="font-size:40px;">🤝</span>
            <h4 style="margin-top:16px;">No sales orders locked yet</h4>
            <p style="font-size:14px; margin-top:8px;">Ensure your listings are active and competitive. When buyers click "Buy Now" on your lots, contracts appear here instantly.</p>
          </div>
        ` : `
          <div class="dash-table-wrapper">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>Order Contract</th>
                  <th>Buyer Mill</th>
                  <th>Commodity</th>
                  <th>Volume / Total</th>
                  <th>Payment / Freight</th>
                  <th>Shipping State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => {
                  const listing = LocalDB.getListings().find(l => l.id === o.listingId);
                  const buyer = LocalDB.getBuyers().find(b => b.id === o.buyerId) || { name: o.buyerId, companyName: "Bulk Processor" };
                  
                  let statusSelect = `
                    <select class="dash-filter-input order-status-select" data-orderid="${o.id}" style="width:130px; height:32px; padding:2px 8px; font-size:12px;">
                      <option value="placed" ${o.orderStatus === 'placed' ? 'selected' : ''}>📍 Confirmed</option>
                      <option value="shipped" ${o.orderStatus === 'shipped' ? 'selected' : ''}>🚚 Dispatched</option>
                      <option value="delivered" ${o.orderStatus === 'delivered' ? 'selected' : ''}>🔄 In Transit</option>
                      <option value="closed" ${o.orderStatus === 'closed' ? 'selected' : ''}>✅ Received</option>
                    </select>
                  `;

                  return `
                    <tr data-orderid="${o.id}">
                      <td>
                        <span style="font-weight:700; font-family:monospace; color:var(--saffron-primary);">${o.id}</span>
                        <div style="font-size:11px; color:var(--gray-medium); margin-top:2px;">${o.orderDate}</div>
                      </td>
                      <td>
                        <b>${buyer.name}</b>
                        <div style="font-size:11px; color:var(--gray-medium); margin-top:2px;">${buyer.companyName}</div>
                      </td>
                      <td>
                        <b>${listing ? listing.commodity : 'Crop'}</b>
                        <div style="font-size:11px; color:var(--gray-medium); margin-top:2px;">${listing ? listing.variety : ''}</div>
                      </td>
                      <td>
                        <b style="color:var(--forest-secondary);">${o.quantity} qtl</b>
                        <div style="font-size:11px; color:var(--gray-medium); margin-top:2px;">₹${o.totalAmount.toLocaleString('en-IN')}</div>
                      </td>
                      <td>
                        <span style="font-size:12px;">💳 ${o.paymentTerms}</span>
                        <div style="font-size:11px; color:var(--gray-medium); margin-top:2px;">🚚 ${o.logisticsType.split(' ')[0]}</div>
                      </td>
                      <td>
                        ${statusSelect}
                      </td>
                      <td>
                        <button class="btn btn-outline btn-sm print-invoice-btn" data-orderid="${o.id}" style="padding:4px 10px; font-size:11.5px; cursor:pointer;">📄 Invoice</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    this.bindDashboardOrdersEvents();
  }

  static bindDashboardOrdersEvents() {
    // Dropdown status changes
    document.querySelectorAll(".order-status-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const orderId = select.getAttribute("data-orderid");
        const newStatus = select.value;

        const allOrders = LocalDB.getOrders();
        const targetO = allOrders.find(o => o.id === orderId);
        if (targetO) {
          targetO.orderStatus = newStatus;
          localStorage.setItem("tv_orders", JSON.stringify(allOrders));
          this.showToast(`🚚 Order status updated to: ${newStatus}!`);
        }
      });
    });

    // simulated print invoice
    document.querySelectorAll(".print-invoice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-orderid");
        const o = LocalDB.getOrders().find(order => order.id === id);
        if (!o) return;
        const buyer = LocalDB.getBuyers().find(b => b.id === o.buyerId) || { name: "N/A", companyName: "N/A" };
        const supplier = LocalDB.getLoggedSupplier();

        const invoiceHtml = `
          <html>
          <head>
            <title>Invoice - ${o.id}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #00B562; padding-bottom: 20px; }
              .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 40px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background: #f4f4f4; }
              .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; color: #00B562; }
              .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 style="color: #00B562; margin: 0;">TradeVithika</h1>
                <span>B2B Commodity Contract Invoice</span>
              </div>
              <div style="text-align: right;">
                <h3>INVOICE</h3>
                <span>Contract ID: <b>${o.id}</b></span><br>
                <span>Date: ${o.orderDate}</span>
              </div>
            </div>
            
            <div class="details">
              <div>
                <h4>FROM (SUPPLIER PARTNER)</h4>
                <b>${supplier.name}</b><br>
                Contact: ${supplier.contactPerson}<br>
                Phone: ${supplier.phone}<br>
                Location: ${supplier.district}, MP
              </div>
              <div>
                <h4>TO (BUYER)</h4>
                <b>${buyer.name}</b><br>
                Company: ${buyer.companyName}<br>
                Location: ${o.logisticsType === 'TradeVithika Freight Logistics' ? 'Door Delivery Destination' : 'Ex-Warehouse Collection'}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item / Variety</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FAQ Grade Grain Lot</td>
                  <td>${o.quantity} quintals</td>
                  <td>₹${o.unitPrice.toLocaleString('en-IN')}/qtl</td>
                  <td>₹${o.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div class="total">
              Total Amount: ₹${o.totalAmount.toLocaleString('en-IN')}
            </div>

            <div style="margin-top: 40px; padding: 15px; background: #f9f9f9; border-radius: 6px; font-size: 13px;">
              📌 <b>Contract Note:</b> Payment via <b>${o.paymentTerms}</b>. Freight arranged via <b>${o.logisticsType}</b>.
            </div>

            <div class="footer">
              Thank you for trading on TradeVithika. For any support, contact billing@tradevithika.com.<br>
              © 2026 TradeVithika. All Rights Reserved. Madhya Pradesh, India.
            </div>
          </body>
          </html>
        `;

        const win = window.open("", "_blank");
        win.document.write(invoiceHtml);
        win.document.close();
        win.print();
      });
    });
  }

  // 5.2 UPGRADED Dashboard Listings Panel: Includes search, filters, multi-select bulk actions
  static renderDashboardListings(workspace) {
    this.selectedListingIds = []; // reset selection

    const supplierListings = LocalDB.getListings().filter(l => l.supplierId === this.loggedSupplier.id);
    
    // Calculate inventory metrics
    let totalVolume = 0;
    let totalValue = 0;
    let lowStockCount = 0;

    supplierListings.forEach(l => {
      totalVolume += l.quantity;
      totalValue += (l.price * l.quantity);
      if (l.quantity < 150) {
        lowStockCount++;
      }
    });

    workspace.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="font-size: 18px; font-weight:700;">Inventory Catalog</h3>
        <button class="btn btn-primary btn-sm" id="add-listing-trigger-btn">➕ Add New Listing</button>
      </div>

      <!-- Inventory Health Deck Summary Cards -->
      <div class="inventory-deck">
        <div class="inventory-deck-card">
          <span class="inventory-deck-lbl">🌾 Total Grains Volume</span>
          <span class="inventory-deck-val">${totalVolume.toLocaleString('en-IN')} qtl</span>
          <span class="inventory-deck-trend">Aggregated stock in warehouse</span>
        </div>
        <div class="inventory-deck-card">
          <span class="inventory-deck-lbl">💰 Total Asset Value</span>
          <span class="inventory-deck-val">₹${(totalValue / 100000).toFixed(2)} Lakhs</span>
          <span class="inventory-deck-trend">Evaluated at active price rates</span>
        </div>
        <div class="inventory-deck-card ${lowStockCount > 0 ? 'alert-pulse' : ''}">
          <span class="inventory-deck-lbl">⚠️ Low Stock Alerts</span>
          <span class="inventory-deck-val" style="${lowStockCount > 0 ? 'color:#D93025;' : ''}">${lowStockCount} Items</span>
          <span class="inventory-deck-trend" style="${lowStockCount > 0 ? 'color:#D93025; font-weight:600;' : ''}">
            ${lowStockCount > 0 ? 'Action required: Stock below 150qtl' : 'All grain levels healthy'}
          </span>
        </div>
      </div>

      <!-- Add Listing form collapsible -->
      <div class="dash-panel" id="add-listing-form-panel" style="display:none; margin-bottom:30px;">
        <div class="dash-panel-header">
          <h3>Add New Commodity Listing</h3>
          <button class="btn btn-outline btn-sm" id="close-add-listing-btn">Cancel</button>
        </div>
        
        <form id="new-listing-form">
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:20px;">
            <div class="form-group">
              <label>Commodity Type*</label>
              <select class="form-input" id="nl-commodity" required>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Wheat">Wheat (गेहूँ)</option>
                <option value="Chana">Chana (चना)</option>
                <option value="Garlic">Garlic (लहसुन)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Listing Title*</label>
              <input type="text" id="nl-title" class="form-input" required placeholder="E.g. Premium JS-335 Dry Soybean">
            </div>
            <div class="form-group">
              <label>Variety / Seed Name*</label>
              <input type="text" id="nl-variety" class="form-input" required placeholder="E.g. JS-335, Sharbati, Desi Chana">
            </div>
            <div class="form-group">
              <label>Quality Grade*</label>
              <input type="text" id="nl-grade" class="form-input" required placeholder="E.g. FAQ (Fair Average Quality), Premium Bold">
            </div>
            <div class="form-group">
              <label>Moisture Content (%)*</label>
              <input type="text" id="nl-moisture" class="form-input" required placeholder="E.g. 12% max, Cured Dry">
            </div>
            <div class="form-group">
              <label>Available Quantity (Quintal)*</label>
              <input type="number" id="nl-quantity" class="form-input" required placeholder="Available stock weight">
            </div>
            <div class="form-group">
              <label>Price (₹ per Quintal)*</label>
              <input type="number" id="nl-price" class="form-input" required placeholder="Rate in ₹/qtl">
            </div>
            <div class="form-group">
              <label>Minimum Order Quantity*</label>
              <input type="number" id="nl-min-order" class="form-input" required placeholder="Min purchase size in quintal">
            </div>
            <div class="form-group">
              <label>Packaging*</label>
              <input type="text" id="nl-packaging" class="form-input" required placeholder="E.g. 50kg Gunny Bags, Mesh bags">
            </div>
            <div class="form-group">
              <label>Delivery Terms*</label>
              <select class="form-input" id="nl-delivery" required>
                <option value="Ex-Warehouse">Ex-Warehouse Loading</option>
                <option value="Ex-Farm">Ex-Farm Collection</option>
                <option value="Can arrange transport">Can arrange transport (extra charges)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tehsil/Taluka*</label>
              <input type="text" id="nl-taluka" class="form-input" required placeholder="E.g. Gairatganj, Ashta">
            </div>
            <div class="form-group">
              <label>District*</label>
              <select class="form-input" id="nl-district" required>
                <option value="Raisen">Raisen</option>
                <option value="Sehore">Sehore</option>
                <option value="Hoshangabad">Hoshangabad</option>
                <option value="Vidisha">Vidisha</option>
                <option value="Narsinghpur">Narsinghpur</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-top:16px;">
            <label>Additional Product Details / Description*</label>
            <textarea id="nl-desc" class="form-textarea" required placeholder="Provide clear loading details, transport availability, or weighing scales quality."></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top:16px;">Submit Listing for Review</button>
        </form>
      </div>

      <!-- Search & Filters Row -->
      <div class="dash-listings-filter-row">
        <input type="text" id="dl-search-input" class="dash-filter-input" placeholder="Search by crop title..." style="flex:1;">
        <select id="dl-commodity-filter" class="dash-filter-input" style="width:160px;">
          <option value="">All Crops</option>
          <option value="Soybean">Soybean</option>
          <option value="Wheat">Wheat</option>
          <option value="Chana">Chana</option>
          <option value="Garlic">Garlic</option>
        </select>
        <select id="dl-status-filter" class="dash-filter-input" style="width:140px;">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <!-- Floating Bulk Action Panel -->
      <div class="bulk-actions-bar" id="dl-bulk-bar" style="display:none;">
        <div class="bulk-actions-text" id="dl-bulk-bar-text">0 items selected</div>
        <div class="bulk-actions-buttons">
          <button class="btn btn-outline-green btn-sm" id="dl-bulk-activate-btn">⚡ Bulk Activate</button>
          <button class="btn btn-outline-saffron btn-sm" id="dl-bulk-pause-btn">⏸️ Bulk Pause</button>
          <button class="btn btn-sm" id="dl-bulk-delete-btn" style="background:#D93025; color:white;">🗑️ Delete Selected</button>
        </div>
      </div>

      <!-- Listings Table -->
      <div class="dash-panel">
        <div class="dash-table-wrapper">
          <table class="dash-table" id="dl-table">
            <thead>
              <tr>
                <th style="width:40px; text-align:center;">
                  <input type="checkbox" id="dl-select-all-box" style="width:16px; height:16px; accent-color:var(--saffron-primary); cursor:pointer;">
                </th>
                <th>Crop Title</th>
                <th>Commodity</th>
                <th>Price/qtl</th>
                <th>Min. Order</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Inquiries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="dl-table-body">
              <!-- Grid rows injected via JS filterListings -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindDashboardListingsEvents();
    this.filterAndRenderDashboardListings();
  }

  static filterAndRenderDashboardListings() {
    const allListings = LocalDB.getListings().filter(l => l.supplierId === this.loggedSupplier.id);
    const searchVal = document.getElementById("dl-search-input").value.trim().toLowerCase();
    const comFilter = document.getElementById("dl-commodity-filter").value;
    const statusFilter = document.getElementById("dl-status-filter").value;

    const filtered = allListings.filter(l => {
      if (searchVal && !l.title.toLowerCase().includes(searchVal)) return false;
      if (comFilter && l.commodity !== comFilter) return false;
      if (statusFilter && l.status !== statusFilter) return false;
      return true;
    });

    const tbody = document.getElementById("dl-table-body");
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:40px; color:var(--gray-medium);">
            No matching listings found in catalog.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(l => `
      <tr data-rowid="${l.id}">
        <td style="text-align:center;">
          <input type="checkbox" class="dl-row-checkbox" data-listid="${l.id}" style="width:16px; height:16px; accent-color:var(--saffron-primary); cursor:pointer;" ${this.selectedListingIds.includes(l.id) ? 'checked' : ''}>
        </td>
        <td><b>${l.title}</b></td>
        <td>${l.commodity}</td>
        <td>
          <span class="inventory-editable" data-field="price" data-listid="${l.id}" title="Click to edit price">
            ₹${l.price.toLocaleString('en-IN')}
          </span>
        </td>
        <td>${l.minOrder} qtl</td>
        <td>
          <span class="inventory-editable" data-field="quantity" data-listid="${l.id}" title="Click to edit stock quantity">
            ${l.quantity} qtl
          </span>
          ${l.quantity < 150 ? '<span class="status-pill status-low-stock" style="margin-left: 6px; padding: 2px 6px; font-size: 10px;">⚠️ Low Stock</span>' : ''}
        </td>
        <td>
          <span class="status-pill status-${l.status}">
            ${l.status}
          </span>
        </td>
        <td><b>${l.inquiries}</b></td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn toggle-listing-btn" data-listid="${l.id}">
              ${l.status === 'active' ? 'Pause' : 'Activate'}
            </button>
            <button class="table-action-btn delete-listing-btn" data-listid="${l.id}" style="color:#D93025;">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Re-bind row triggers
    this.bindDashboardListingsRowTriggers();
    
    // Bind inline click editors
    this.bindInventoryInlineEditEvents();
  }

  static bindDashboardListingsEvents() {
    const addPanel = document.getElementById("add-listing-form-panel");
    const triggerBtn = document.getElementById("add-listing-trigger-btn");
    const closeBtn = document.getElementById("close-add-listing-btn");

    if (triggerBtn && addPanel) {
      triggerBtn.addEventListener("click", () => {
        addPanel.style.display = "block";
        triggerBtn.style.display = "none";
      });
    }

    if (closeBtn && addPanel) {
      closeBtn.addEventListener("click", () => {
        addPanel.style.display = "none";
        triggerBtn.style.display = "inline-block";
      });
    }

    // Dynamic filtering triggers
    document.getElementById("dl-search-input").addEventListener("input", () => this.filterAndRenderDashboardListings());
    document.getElementById("dl-commodity-filter").addEventListener("change", () => this.filterAndRenderDashboardListings());
    document.getElementById("dl-status-filter").addEventListener("change", () => this.filterAndRenderDashboardListings());

    // Checkbox multi-selection select all binding
    const selectAllBox = document.getElementById("dl-select-all-box");
    if (selectAllBox) {
      selectAllBox.addEventListener("change", (e) => {
        const boxes = document.querySelectorAll(".dl-row-checkbox");
        this.selectedListingIds = [];
        
        boxes.forEach(box => {
          box.checked = e.target.checked;
          if (e.target.checked) {
            this.selectedListingIds.push(box.getAttribute("data-listid"));
          }
        });
        
        this.updateDashboardBulkBar();
      });
    }

    // Submit new listing form
    const form = document.getElementById("new-listing-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const com = document.getElementById("nl-commodity").value;
        let hindi = "गेहूँ";
        if (com === "Soybean") hindi = "सोयाबीन";
        else if (com === "Chana") hindi = "चना";
        else if (com === "Garlic") hindi = "लहसुन";

        const newListing = {
          id: "listing-" + Date.now(),
          supplierId: this.loggedSupplier.id,
          title: document.getElementById("nl-title").value,
          commodity: com,
          hindiTitle: hindi,
          variety: document.getElementById("nl-variety").value,
          grade: document.getElementById("nl-grade").value,
          moisture: document.getElementById("nl-moisture").value,
          quantity: parseInt(document.getElementById("nl-quantity").value),
          price: parseInt(document.getElementById("nl-price").value),
          minOrder: parseInt(document.getElementById("nl-min-order").value),
          packaging: document.getElementById("nl-packaging").value,
          delivery: document.getElementById("nl-delivery").value,
          harvestYear: "2024-25",
          district: document.getElementById("nl-district").value,
          taluka: document.getElementById("nl-taluka").value,
          postedDaysAgo: 0,
          views: 0,
          inquiries: 0,
          status: "active",
          description: document.getElementById("nl-desc").value
        };

        const listings = LocalDB.getListings();
        listings.unshift(newListing);
        LocalDB.saveListings(listings);

        // Push new notification
        const notifications = LocalDB.getNotifications();
        notifications.unshift({
          id: "noti-" + Date.now(),
          supplierId: this.loggedSupplier.id,
          title: "Listing Created",
          text: `Product "${newListing.title}" successfully approved and active.`,
          date: "Just now",
          read: false
        });
        LocalDB.saveNotifications(notifications);
        this.updateBellNotificationBadge();

        if (listings.filter(l => l.supplierId === this.loggedSupplier.id).length === 1) {
          const suppliers = LocalDB.getSuppliers();
          const current = suppliers.find(s => s.id === this.loggedSupplier.id);
          if (current) {
            current.onboardingProgress += 25;
            LocalDB.saveSuppliers(suppliers);
          }
        }

        this.showToast("New listing added! Approved and live on marketplace.");
        this.renderDashboardSubpage("listings");
      });
    }

    // Bulk action click events
    document.getElementById("dl-bulk-activate-btn").addEventListener("click", () => this.handleBulkUpdateStatus("active"));
    document.getElementById("dl-bulk-pause-btn").addEventListener("click", () => this.handleBulkUpdateStatus("paused"));
    document.getElementById("dl-bulk-delete-btn").addEventListener("click", () => this.handleBulkDelete());
  }

  static bindDashboardListingsRowTriggers() {
    // Checkbox toggling inside rows
    document.querySelectorAll(".dl-row-checkbox").forEach(box => {
      box.addEventListener("change", (e) => {
        const id = box.getAttribute("data-listid");
        if (e.target.checked) {
          if (!this.selectedListingIds.includes(id)) this.selectedListingIds.push(id);
        } else {
          this.selectedListingIds = this.selectedListingIds.filter(i => i !== id);
        }
        
        // Sync Select-all box state
        const allBox = document.getElementById("dl-select-all-box");
        const totalRows = document.querySelectorAll(".dl-row-checkbox").length;
        if (allBox) allBox.checked = (this.selectedListingIds.length === totalRows);

        this.updateDashboardBulkBar();
      });
    });

    // Individual action button toggling
    document.querySelectorAll(".toggle-listing-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-listid");
        const listings = LocalDB.getListings();
        const listing = listings.find(l => l.id === id);
        if (listing) {
          listing.status = listing.status === "active" ? "paused" : "active";
          LocalDB.saveListings(listings);
          this.showToast(`Listing ${listing.status === 'active' ? 'activated' : 'paused'}`);
          this.renderDashboardSubpage("listings");
        }
      });
    });

    document.querySelectorAll(".delete-listing-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        if (confirm("Are you sure you want to delete this listing?")) {
          const id = e.target.getAttribute("data-listid");
          let listings = LocalDB.getListings();
          listings = listings.filter(l => l.id !== id);
          LocalDB.saveListings(listings);
          this.showToast("Listing deleted successfully");
          this.renderDashboardSubpage("listings");
        }
      });
    });
  }

  static bindInventoryInlineEditEvents() {
    const editables = document.querySelectorAll(".inventory-editable");
    
    editables.forEach(elem => {
      elem.addEventListener("click", (e) => {
        // Prevent editing if already in input state
        if (elem.querySelector("input")) return;

        const field = elem.getAttribute("data-field");
        const listId = elem.getAttribute("data-listid");
        const listing = LocalDB.getListings().find(l => l.id === listId);
        if (!listing) return;

        const originalVal = listing[field];
        elem.innerHTML = `<input type="number" class="inventory-inline-input" value="${originalVal}" min="0">`;
        
        const input = elem.querySelector("input");
        input.focus();
        input.select();

        let isSaved = false;

        const saveChanges = () => {
          if (isSaved) return;
          isSaved = true;

          const newVal = parseInt(input.value);

          if (isNaN(newVal) || newVal < 0) {
            this.showToast("⚠️ Invalid quantity or price value.", true);
            elem.innerHTML = field === "price" ? `₹${originalVal.toLocaleString('en-IN')}` : `${originalVal} qtl`;
            return;
          }

          if (newVal === originalVal) {
            elem.innerHTML = field === "price" ? `₹${originalVal.toLocaleString('en-IN')}` : `${originalVal} qtl`;
            return;
          }

          // Save new values to database
          const listings = LocalDB.getListings();
          const target = listings.find(l => l.id === listId);
          if (target) {
            target[field] = newVal;
            LocalDB.saveListings(listings);
          }

          // If quantity fell below 150, trigger high-priority alert notification
          if (field === "quantity" && newVal < 150 && originalVal >= 150) {
            const notifications = LocalDB.getNotifications();
            notifications.unshift({
              id: "noti-" + Date.now(),
              supplierId: this.loggedSupplier.id,
              title: "⚠️ Stock Warning!",
              text: `Warehouse Alert: "${listing.title}" stock level fell to ${newVal} qtl (under critical 150qtl threshold).`,
              date: "Just now",
              read: false
            });
            LocalDB.saveNotifications(notifications);
            this.updateBellNotificationBadge();
            this.showToast(`⚠️ Low stock warning triggered for ${listing.commodity}!`);
          }

          this.showToast(`✅ Successfully updated ${field === 'price' ? 'wholesale rate' : 'stock quantity'} to ${field === 'price' ? '₹' + newVal.toLocaleString('en-IN') + '/qtl' : newVal + ' qtl'}!`);
          
          // Re-render subpage to recalculate health decks and tables
          this.renderDashboardSubpage("listings");
        };

        const cancelChanges = () => {
          if (isSaved) return;
          isSaved = true;
          elem.innerHTML = field === "price" ? `₹${originalVal.toLocaleString('en-IN')}` : `${originalVal} qtl`;
        };

        input.addEventListener("keydown", (evt) => {
          if (evt.key === "Enter") {
            saveChanges();
          } else if (evt.key === "Escape") {
            cancelChanges();
          }
        });

        input.addEventListener("blur", () => {
          saveChanges();
        });
      });
    });
  }

  static updateDashboardBulkBar() {
    const bar = document.getElementById("dl-bulk-bar");
    const txt = document.getElementById("dl-bulk-bar-text");
    if (!bar || !txt) return;

    if (this.selectedListingIds.length > 0) {
      bar.style.display = "flex";
      txt.innerText = `${this.selectedListingIds.length} listings selected`;
    } else {
      bar.style.display = "none";
    }
  }

  // Perform bulk status update
  static handleBulkUpdateStatus(newStatus) {
    if (this.selectedListingIds.length === 0) return;

    const listings = LocalDB.getListings();
    listings.forEach(l => {
      if (this.selectedListingIds.includes(l.id)) {
        l.status = newStatus;
      }
    });
    LocalDB.saveListings(listings);

    this.showToast(`Bulk updated ${this.selectedListingIds.length} listings to ${newStatus}`);
    this.selectedListingIds = [];
    this.renderDashboardSubpage("listings");
  }

  // Perform bulk listing delete
  static handleBulkDelete() {
    if (this.selectedListingIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete these ${this.selectedListingIds.length} listings?`)) return;

    let listings = LocalDB.getListings();
    listings = listings.filter(l => !this.selectedListingIds.includes(l.id));
    LocalDB.saveListings(listings);

    this.showToast(`Successfully deleted ${this.selectedListingIds.length} crop lots`);
    this.selectedListingIds = [];
    this.renderDashboardSubpage("listings");
  }

  // 5.3 Dashboard Inquiry Inbox Panel
  static renderDashboardInquiries(workspace) {
    const inquiries = LocalDB.getInquiries().filter(i => i.supplierId === this.loggedSupplier.id);
    
    workspace.innerHTML = `
      <div class="inbox-layout">
        <div class="inbox-sidebar">
          <div class="inbox-sidebar-header">Recent Inquiries (${inquiries.length})</div>
          <ul class="inbox-list" id="inbox-inquiries-list">
            ${inquiries.length === 0 ? `
              <li style="padding:40px; text-align:center; color:var(--gray-medium);">No Inquiries</li>
            ` : inquiries.map(i => {
              const activeId = sessionStorage.getItem("active_inbox_id");
              const isActive = activeId === i.id;
              const isNew = i.status === "new";
              const listing = LocalDB.getListings().find(l => l.id === i.listingId);
              
              return `
                <li class="inbox-item ${isActive ? 'active' : ''}" data-inqid="${i.id}">
                  <div class="inbox-item-header">
                    <span>${i.date}</span>
                    ${isNew ? '<span class="status-pill status-active" style="padding:1px 6px; font-size:9px;">NEW</span>' : ''}
                  </div>
                  <h4>${i.buyerName}</h4>
                  <div class="inbox-item-desc">Req: ${i.quantity} qtl ${listing ? listing.commodity : ''} - ${i.location}</div>
                </li>
              `;
            }).join('')}
          </ul>
        </div>

        <div class="inbox-main" id="inbox-detail-view">
          <!-- Injected via selectInquiry JS -->
        </div>
      </div>
    `;

    this.bindDashboardInboxEvents();
    
    const activeId = sessionStorage.getItem("active_inbox_id");
    if (activeId) {
      this.selectInquiry(activeId);
      sessionStorage.removeItem("active_inbox_id");
    } else if (inquiries.length > 0) {
      this.selectInquiry(inquiries[0].id);
    } else {
      this.renderEmptyInboxMain();
    }
  }

  static renderEmptyInboxMain() {
    const main = document.getElementById("inbox-detail-view");
    if (main) {
      main.innerHTML = `
        <div class="inbox-main-empty">
          <span style="font-size:48px;">📩</span>
          <h3>Select an inquiry to view details</h3>
          <p>Read client specifications, verify quantity requirements, and send pricing quotes directly.</p>
        </div>
      `;
    }
  }

  static selectInquiry(id) {
    const inquiries = LocalDB.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (!inq) return;

    document.querySelectorAll(".inbox-item").forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-inqid") === id) {
        item.classList.add("active");
      }
    });

    const listing = LocalDB.getListings().find(l => l.id === inq.listingId);
    const main = document.getElementById("inbox-detail-view");
    if (!main) return;

    const mandiRate = listing ? MandiService.getMandiRate(listing.commodity, listing.district) : 5000;
    const initialOfferedRate = inq.offeredRate || (listing ? listing.price : 0);
    const savings = mandiRate - initialOfferedRate;
    
    let dealBadgeHtml = '';
    if (savings > 0) {
      dealBadgeHtml = `
        <span style="background:rgba(0, 181, 98, 0.08); color:var(--forest-secondary); font-size:11px; padding:4px 10px; border-radius:4px; font-weight:700; border:1px solid rgba(0, 181, 98, 0.18); display:inline-block;">
          💡 Saves ₹${savings.toLocaleString('en-IN')}/qtl vs Mandi
        </span>
      `;
    }

    const priceInfoHtml = `
      <div style="margin-top:10px; display:flex; gap:20px; align-items:center; background:#fbfbfb; padding:8px 12px; border-radius:6px; border:1px solid var(--gray-light); font-size:12.5px;">
        <div>Offered Rate: <b style="color:var(--saffron-primary);">₹${initialOfferedRate.toLocaleString('en-IN')}/qtl</b></div>
        <div>Mandi Reference: <b style="color:var(--dark);">₹${mandiRate.toLocaleString('en-IN')}/qtl</b></div>
        ${dealBadgeHtml}
      </div>
    `;

    main.innerHTML = `
      <div class="inbox-main-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="font-size:20px; font-weight:700;">${inq.buyerName}</h2>
            <span style="font-size:13px; color:var(--gray-medium);">Company: <b>${inq.companyName}</b> | 📞 ${inq.phone}</span>
          </div>
          <div>
            <span class="status-pill status-${inq.status}">${inq.status}</span>
          </div>
        </div>
        <div style="margin-top:12px; background:var(--bg-light); padding:10px; border-radius:6px; font-size:13px; border:1px solid var(--gray-border);">
          🌾 Inquiry against: <b>${listing ? listing.title : 'Deleted Listing'}</b> (Req: <b>${inq.quantity} quintals</b> to <b>${inq.location}</b>)
          ${priceInfoHtml}
        </div>
      </div>
      
      <!-- Interactive B2B Negotiation Drawer (Sleek Glassmorphic Widget) -->
      <div class="negotiation-panel">
        <h4 style="font-size:14px; font-weight:800; text-transform:uppercase; color:var(--charcoal); margin-bottom:14px; display:flex; align-items:center; gap:6px;">
          ⚖️ B2B Counter-Offer & Negotiation Hub
        </h4>
        
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px; align-items:center;">
          <div class="negotiation-bar-container">
            <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600;">
              <span>Adjust Counter-Offer:</span>
              <span style="color:var(--saffron-primary); font-weight:700; font-size:15px;" id="neg-rate-display">₹${initialOfferedRate}/qtl</span>
            </div>
            <input type="range" class="negotiation-slider" id="neg-slider-input" min="${Math.round(mandiRate * 0.7)}" max="${Math.round(mandiRate * 1.3)}" value="${initialOfferedRate}">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--gray-medium);">
              <span>Min: ₹${Math.round(mandiRate * 0.7)}/qtl</span>
              <span>Max: ₹${Math.round(mandiRate * 1.3)}/qtl</span>
            </div>
          </div>
          
          <div style="text-align:center;">
            <!-- Circular Progress Margin Gauge -->
            <div class="margin-circle-wrap">
              <svg class="margin-circle-svg">
                <circle class="margin-circle-bg" cx="45" cy="45" r="40"></circle>
                <circle class="margin-circle-progress" id="neg-circle-bar" cx="45" cy="45" r="40"></circle>
              </svg>
              <div class="margin-circle-text" id="neg-circle-text">0%</div>
            </div>
            <span style="font-size:10px; color:var(--gray-medium); display:block; margin-top:6px; font-weight:600;">Diff vs Mandi Rate</span>
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:16px; border-top:1px solid var(--gray-light); padding-top:16px;">
          <button class="btn btn-outline-saffron btn-sm" id="neg-propose-btn" style="flex:1;">Propose This Counter-Rate</button>
          <button class="btn btn-secondary btn-sm" id="neg-lock-btn" style="flex:1.2; font-weight:700;">🔒 Lock Deal & Issue Certificate</button>
        </div>
      </div>

      <div class="inbox-main-body" id="inbox-messages-container" style="display:flex; flex-direction:column; margin-top:20px; border-top:1px solid var(--gray-light); padding-top:20px;">
        <div class="inbox-bubble" style="align-self:flex-start;">
          <div style="font-weight:700; font-size:12px; color:var(--saffron-primary); margin-bottom:4px;">${inq.buyerName} (Buyer)</div>
          <p style="font-size:14px;">${inq.message}</p>
          <div style="font-size:10px; color:var(--gray-medium); text-align:right; margin-top:8px;">${inq.date}</div>
        </div>

        ${inq.replies.map(r => {
          const isCounter = r.text.startsWith("Counter-Offer Proposing:");
          const bubbleClass = r.sender === 'supplier' 
            ? (isCounter ? 'inbox-bubble-counter' : 'inbox-bubble-reply') 
            : '';
          
          return `
            <div class="inbox-bubble ${bubbleClass}" style="align-self: ${r.sender === 'supplier' ? 'flex-end' : 'flex-start'};">
              <div style="font-weight:700; font-size:12px; color: ${r.sender === 'supplier' ? 'var(--forest-secondary)' : 'var(--saffron-primary)'}; margin-bottom:4px;">
                ${r.sender === 'supplier' ? 'You (Supplier)' : `${inq.buyerName} (Buyer)`}
                ${isCounter ? '<span style="font-size:10px; background:var(--saffron-light); color:var(--saffron-hover); padding:1px 6px; border-radius:4px; margin-left:6px;">⚖️ Counter-Offer</span>' : ''}
              </div>
              <p style="font-size:14px;">${r.text}</p>
              <div style="font-size:10px; color:var(--gray-medium); text-align:right; margin-top:8px;">${r.date}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="inbox-main-footer">
        <form id="inbox-reply-form">
          <textarea class="form-textarea" id="inbox-reply-text" placeholder="Type your reply or price quote here..." required style="height:60px; margin-bottom:10px;"></textarea>
          <div style="display:flex; justify-content:space-between;">
            <button type="button" class="btn btn-outline btn-sm" id="inbox-close-deal-btn">Mark as Closed</button>
            <button type="submit" class="btn btn-primary btn-sm">Send Reply</button>
          </div>
        </form>
      </div>
    `;

    const msgBody = document.getElementById("inbox-messages-container");
    if (msgBody) msgBody.scrollTop = msgBody.scrollHeight;

    // Range Slider live updates binding
    const slider = document.getElementById("neg-slider-input");
    const rateDisplay = document.getElementById("neg-rate-display");
    const circleBar = document.getElementById("neg-circle-bar");
    const circleText = document.getElementById("neg-circle-text");

    const updateGauge = () => {
      if (!slider || !rateDisplay || !circleBar || !circleText) return;
      const val = parseInt(slider.value);
      rateDisplay.innerText = `₹${val.toLocaleString('en-IN')}/qtl`;

      // Percentage difference vs Mandi price
      const diffPercent = Math.round(((val - mandiRate) / mandiRate) * 100);
      const absDiff = Math.abs(diffPercent);
      const isCheaper = val <= mandiRate;

      circleText.innerText = `${isCheaper ? '-' : '+'}${absDiff}%`;
      circleText.style.color = isCheaper ? 'var(--forest-secondary)' : 'var(--saffron-hover)';
      circleBar.style.stroke = isCheaper ? 'var(--forest-secondary)' : 'var(--saffron-primary)';

      // Circular dashoffset calculation
      const limitPercent = Math.min(100, Math.max(0, 100 - absDiff));
      const circumference = 251.2;
      const offset = circumference - (circumference * (limitPercent / 100));
      circleBar.style.strokeDashoffset = offset;
    };

    if (slider) {
      slider.addEventListener("input", updateGauge);
      updateGauge(); // run initial
    }

    // Propose counter offer button binding
    const proposeBtn = document.getElementById("neg-propose-btn");
    if (proposeBtn) {
      proposeBtn.addEventListener("click", () => {
        const val = parseInt(slider.value);
        const replyText = document.getElementById("inbox-reply-text");
        if (replyText) {
          replyText.value = `Counter-Offer Proposing: ₹${val}/qtl. We ensure FAQ Grade 1 with strict loading timelines ex-warehouse. Let us lock this rate!`;
          replyText.focus();
          this.showToast("💡 Propose counter-offer text filled! Click 'Send Reply' to submit.");
        }
      });
    }

    // Lock deal & issue certificate button binding
    const lockBtn = document.getElementById("neg-lock-btn");
    if (lockBtn) {
      lockBtn.addEventListener("click", () => {
        const val = parseInt(slider.value);
        this.generateB2BCertificate(inq, listing, val);
      });
    }

    const replyForm = document.getElementById("inbox-reply-form");
    if (replyForm) {
      replyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const txt = document.getElementById("inbox-reply-text").value;
        
        const latestInquiries = LocalDB.getInquiries();
        const target = latestInquiries.find(i => i.id === id);
        if (target) {
          target.replies.push({
            sender: "supplier",
            text: txt,
            date: new Date().toISOString().split('T')[0]
          });
          target.status = "replied";
          LocalDB.saveInquiries(latestInquiries);
          
          this.showToast("Reply sent to buyer dashboard!");
          sessionStorage.setItem("active_inbox_id", id);
          this.renderDashboardSubpage("inquiries");
        }
      });
    }

    const closeBtn = document.getElementById("inbox-close-deal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        const latestInquiries = LocalDB.getInquiries();
        const target = latestInquiries.find(i => i.id === id);
        if (target) {
          target.status = "closed";
          LocalDB.saveInquiries(latestInquiries);
          this.showToast("Inquiry marked as closed");
          this.renderDashboardSubpage("inquiries");
        }
      });
    }
  }

  static generateB2BCertificate(inq, listing, agreedPrice) {
    const sup = this.loggedSupplier || LocalDB.getLoggedSupplier();
    const txnId = "TXN-" + Date.now().toString().slice(-6) + "-" + Math.floor(100 + Math.random() * 900);
    const totalVal = inq.quantity * agreedPrice;
    
    let modal = document.getElementById("cert-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "cert-modal";
      modal.className = "cert-modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="cert-card-container">
        <button style="position:absolute; top:20px; right:20px; background:none; border:none; font-size:24px; cursor:pointer; color:#C5A059;" id="cert-modal-close">&times;</button>
        <div class="cert-watermark">TradeVithika</div>
        
        <div class="cert-title-decor">
          📜 B2B Digital Sealed Certificate
        </div>
        
        <h2 style="font-size:20px; font-weight:800; text-align:center; color:#081C36; margin-bottom:8px;">AGRI-COMMODITY TRANSACTION RECORD</h2>
        <div style="text-align:center; font-size:12px; color:var(--gray-medium); font-weight:600; font-family:monospace; margin-bottom:20px;">
          Certificate ID: ${txnId} | Date: ${new Date().toISOString().split('T')[0]}
        </div>
        
        <div class="cert-line-divider"></div>
        
        <p style="font-size:14px; line-height:1.6; text-align:center; color:#555; margin:20px 0; font-style:italic;">
          "This is to certify that a wholesale commodity transaction contract has been successfully closed, validated, and registered on the TradeVithika Agri B2B open network."
        </p>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; font-size:13px; margin:24px 0; background:rgba(197,160,89,0.03); border:1px solid rgba(197,160,89,0.2); padding:20px; border-radius:6px;">
          <div>
            <span style="color:var(--gray-medium); display:block; font-size:11px; font-weight:600; text-transform:uppercase;">Buyer Entity</span>
            <b style="font-size:14px; color:#081C36;">${inq.buyerName}</b>
            <div style="color:#555; margin-top:2px;">Company: ${inq.companyName}</div>
            <div style="color:#555;">Destination: ${inq.location}</div>
          </div>
          <div>
            <span style="color:var(--gray-medium); display:block; font-size:11px; font-weight:600; text-transform:uppercase;">Supplier Partner</span>
            <b style="font-size:14px; color:#081C36;">${sup.name}</b>
            <div style="color:#555; margin-top:2px;">Contact: ${sup.contactPerson}</div>
            <div style="color:#555;">District: ${sup.district}, MP</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; margin-bottom:24px; text-align:center;">
          <div style="background:#FAF8F4; border:1px solid #E2E2DC; padding:12px; border-radius:6px;">
            <span style="font-size:10px; color:var(--gray-medium); font-weight:600; display:block;">COMMODITY LOT</span>
            <b style="font-size:14px; color:var(--charcoal);">${listing ? listing.commodity : 'Agri-Grain'}</b>
            <span style="font-size:11px; display:block; color:var(--gray-medium);">${listing ? listing.variety : ''}</span>
          </div>
          <div style="background:#FAF8F4; border:1px solid #E2E2DC; padding:12px; border-radius:6px;">
            <span style="font-size:10px; color:var(--gray-medium); font-weight:600; display:block;">VOLUME CONTRACT</span>
            <b style="font-size:14px; color:var(--forest-secondary);">${inq.quantity} Quintals</b>
            <span style="font-size:11px; display:block; color:var(--gray-medium);">FAQ Grade</span>
          </div>
          <div style="background:#FAF8F4; border:1px solid #E2E2DC; padding:12px; border-radius:6px;">
            <span style="font-size:10px; color:var(--gray-medium); font-weight:600; display:block;">LOCKED RATE</span>
            <b style="font-size:14px; color:var(--saffron-primary);">₹${agreedPrice}/qtl</b>
            <span style="font-size:11px; display:block; color:var(--gray-medium);">Ex-Warehouse</span>
          </div>
        </div>

        <div style="background:var(--forest-light); border: 1px solid rgba(0, 181, 98, 0.2); padding:16px; border-radius:6px; text-align:center; margin-bottom:30px;">
          <span style="font-size:11px; color:var(--gray-medium); font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block;">Total Contract Value</span>
          <b style="font-size:22px; color:var(--forest-secondary);">₹${totalVal.toLocaleString('en-IN')}</b>
          <span style="font-size:11px; color:var(--gray-medium); display:block; margin-top:2px;">(Zero Platform Commissions Charged)</span>
        </div>

        <div class="cert-line-divider"></div>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:30px;">
          <div style="text-align:center; font-family:monospace; font-size:11px; color:var(--gray-medium);">
            <div style="font-style:italic; font-family:'Poppins'; font-size:14px; color:#C5A059; margin-bottom:4px;">TradeVithika Compliance</div>
            ____________________<br>
            Authorized Registrar
          </div>
          
          <!-- Seal illustration -->
          <div class="cert-gold-seal">
            VERIFIED<br>B2B TRADE<br>🌾 MP COOP 🌾
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:40px; border-top:1px solid var(--gray-light); padding-top:16px;">
          <button class="btn btn-outline btn-sm" id="cert-btn-print" style="flex:1;">🖨️ Print Sealed Certificate</button>
          <button class="btn btn-secondary btn-sm" id="cert-btn-confirm" style="flex:1;">✅ Save & Close Negotiation</button>
        </div>
      </div>
    `;

    modal.style.display = "flex";

    // Bind certificate close
    document.getElementById("cert-modal-close").addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Save & Close negotiation button
    document.getElementById("cert-btn-confirm").addEventListener("click", () => {
      // 1. Convert inquiry to closed status
      const inquiries = LocalDB.getInquiries();
      const target = inquiries.find(i => i.id === inq.id);
      if (target) {
        target.status = "closed";
        target.offeredRate = agreedPrice; // lock agreed price
        LocalDB.saveInquiries(inquiries);
      }

      // 2. Generate a Sales Order contract automatically!
      const orderId = "ORD-" + Date.now().toString().slice(-6) + "-" + Math.floor(100 + Math.random() * 900);
      const newOrder = {
        id: orderId,
        listingId: inq.listingId,
        buyerId: inq.buyerId,
        supplierId: inq.supplierId,
        quantity: inq.quantity,
        unitPrice: agreedPrice,
        totalAmount: totalVal,
        paymentTerms: "NEFT/RTGS Bank Transfer",
        logisticsType: listing ? listing.delivery : "Ex-Warehouse",
        orderStatus: "placed",
        orderDate: new Date().toISOString().split('T')[0]
      };
      LocalDB.saveOrder(newOrder);

      // 3. Deduct stock volume
      if (listing) {
        const listings = LocalDB.getListings();
        const targetList = listings.find(l => l.id === listing.id);
        if (targetList) {
          targetList.quantity = Math.max(0, targetList.quantity - inq.quantity);
          if (targetList.quantity === 0) targetList.status = "paused";
          LocalDB.saveListings(listings);
        }
      }

      // 4. Send Supplier Notification
      const notifications = LocalDB.getNotifications();
      notifications.unshift({
        id: "noti-" + Date.now(),
        supplierId: inq.supplierId,
        title: "Deal Closed & Sales Order Generated!",
        text: `Negotiation for ${inq.buyerName} closed. B2B sales order contract ${orderId} successfully generated ex-warehouse.`,
        date: "Just now",
        read: false
      });
      LocalDB.saveNotifications(notifications);
      this.updateBellNotificationBadge();

      modal.style.display = "none";
      this.showToast(`🎉 B2B Deal locked successfully! Sales contract generated.`);
      this.renderDashboardSubpage("inquiries");
    });

    // Print certificate button
    document.getElementById("cert-btn-print").addEventListener("click", () => {
      const printWin = window.open("", "_blank");
      printWin.document.write(`
        <html>
        <head>
          <title>B2B Transaction Certificate - ${txnId}</title>
          <style>
            body { font-family: 'Inter', 'Poppins', sans-serif; padding: 40px; color: #333; line-height: 1.5; background:#FAF8F4; }
            .cert-border { border: 10px double #C5A059; padding: 40px; background:#fff; position:relative; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
            .watermark { position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-30deg); font-size:90px; color:rgba(197, 160, 89, 0.03); font-weight:900; pointer-events:none; }
            .title { text-align: center; color: #C5A059; font-size:18px; letter-spacing:4px; font-weight:bold; margin-bottom:20px; }
            .header-info { text-align:center; font-family:monospace; margin-bottom:30px; font-size:12px; color:#666; }
            .divider { height:2px; background: linear-gradient(90deg, transparent, #C5A059 50%, transparent); margin:20px 0; }
            .party-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; margin:30px 0; padding:20px; background:#FAF8F4; border:1px solid rgba(197,160,89,0.2); border-radius:6px; }
            .spec-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; text-align:center; margin:30px 0; }
            .spec-box { background:#FAF8F4; border:1px solid #ddd; padding:15px; border-radius:6px; }
            .value-box { background:#E8F5E9; border:1px solid #C8E6C9; padding:20px; border-radius:6px; text-align:center; margin:30px 0; }
            .signature-row { display:flex; justify-content:space-between; align-items:flex-end; margin-top:50px; }
            .seal { width: 90px; height: 90px; background: linear-gradient(135deg, #FFE082 0%, #FFB300 50%, #FF8F00 100%); border-radius:50%; border:4px dashed #FF6F00; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:11px; font-weight:800; text-align:center; }
          </style>
        </head>
        <body>
          <div class="cert-border">
            <div class="watermark">TradeVithika</div>
            <div class="title">B2B DIGITAL SEALED TRANSACTION CERTIFICATE</div>
            <h1 style="text-align:center; font-size:24px; color:#081C36; margin:0 0 8px 0;">AGRI-COMMODITY TRANSACTION RECORD</h1>
            <div class="header-info">Certificate ID: ${txnId} | Validated Timestamp: ${new Date().toISOString()}</div>
            
            <div class="divider"></div>
            
            <p style="text-align:center; font-style:italic; color:#555;">This is to certify that a wholesale commodity transaction contract has been successfully closed, validated, and registered on the TradeVithika Agri B2B open network.</p>
            
            <div class="party-grid">
              <div>
                <span style="font-size:10px; color:#777; display:block; text-transform:uppercase; font-weight:bold;">Buyer Entity</span>
                <b style="font-size:15px; color:#081C36;">${inq.buyerName}</b>
                <div style="margin-top:4px;">Company: ${inq.companyName}</div>
                <div>Destination: ${inq.location}</div>
              </div>
              <div>
                <span style="font-size:10px; color:#777; display:block; text-transform:uppercase; font-weight:bold;">Supplier Partner</span>
                <b style="font-size:15px; color:#081C36;">${sup.name}</b>
                <div style="margin-top:4px;">Contact: ${sup.contactPerson}</div>
                <div>District: ${sup.district}, MP</div>
              </div>
            </div>
 
            <div class="spec-grid">
              <div class="spec-box">
                <span style="font-size:10px; color:#666; font-weight:bold; display:block;">COMMODITY LOT</span>
                <b style="font-size:15px; color:#081C36;">${listing ? listing.commodity : 'Agri-Grain'}</b>
                <span style="font-size:11px; display:block; color:#777; margin-top:2px;">${listing ? listing.variety : ''}</span>
              </div>
              <div class="spec-box">
                <span style="font-size:10px; color:#666; font-weight:bold; display:block;">VOLUME CONTRACT</span>
                <b style="font-size:15px; color:#2E7D32;">${inq.quantity} Quintals</b>
                <span style="font-size:11px; display:block; color:#777; margin-top:2px;">FAQ Grade</span>
              </div>
              <div class="spec-box">
                <span style="font-size:10px; color:#666; font-weight:bold; display:block;">LOCKED RATE</span>
                <b style="font-size:15px; color:#0062FF;">₹${agreedPrice}/qtl</b>
                <span style="font-size:11px; display:block; color:#777; margin-top:2px;">Ex-Warehouse</span>
              </div>
            </div>
 
            <div class="value-box">
              <span style="font-size:11px; color:#666; font-weight:bold; text-transform:uppercase; display:block;">Total Contract Value</span>
              <b style="font-size:24px; color:#2E7D32;">₹${totalVal.toLocaleString('en-IN')}</b>
              <span style="font-size:11px; color:#666; display:block; margin-top:2px;">(Zero Platform Commissions Charged)</span>
            </div>
 
            <div class="divider"></div>
 
            <div class="signature-row">
              <div style="text-align:center; font-size:11px; color:#666;">
                <div style="font-style:italic; font-size:13px; color:#C5A059; margin-bottom:4px;">TradeVithika Compliance</div>
                ____________________<br>
                Authorized Registrar
              </div>
              <div class="seal">
                VERIFIED<br>B2B TRADE<br>🌾 MP COOP 🌾
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
    });
  }

  static bindDashboardInboxEvents() {
    document.querySelectorAll(".inbox-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-inqid");
        this.selectInquiry(id);
      });
    });
  }

  // 5.4 HIGH-FIDELITY Dashboard Analytics Panel (Chart.js Curves & SVG Circular Gauges)
  static renderDashboardAnalytics(workspace) {
    workspace.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="font-size: 18px; font-weight:700;">Performance metrics</h3>
        <button class="btn btn-outline btn-sm" id="analytics-csv-btn">📥 Export CSV Data</button>
      </div>

      <!-- Quick Metrics Grid (Dark Mode Premium Analytics Cards) -->
      <div class="dashboard-stats-grid">
        <div class="dash-stat-card analytics-dark-panel" style="text-align:center;">
          <span class="dash-stat-label" style="color:rgba(255,255,255,0.7) !important;">Response Rate Meter</span>
          <div class="gauge-wrap" style="border-top-color:var(--forest-secondary);">
            <span class="gauge-number">${this.loggedSupplier.responseRate}</span>
          </div>
          <span style="font-size:11px; color:rgba(255,255,255,0.5);">Target: >90% reply frequency</span>
        </div>
        
        <div class="dash-stat-card analytics-dark-panel">
          <span class="dash-stat-label" style="color:rgba(255,255,255,0.7) !important;">Views-to-Inquiry Funnel</span>
          <div class="funnel-container" style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:12.5px; display:flex; justify-content:space-between;"><span>Views:</span> <b style="color:var(--white);">248</b></div>
            <div style="font-size:12.5px; display:flex; justify-content:space-between;"><span>Inquiries:</span> <b style="color:var(--saffron-primary);">32 (12.9%)</b></div>
            <div style="font-size:12.5px; display:flex; justify-content:space-between;"><span>Replies:</span> <b style="color:var(--forest-secondary);">28 (87.5%)</b></div>
          </div>
        </div>

        <div class="dash-stat-card analytics-dark-panel" style="text-align:center;">
          <span class="dash-stat-label" style="color:rgba(255,255,255,0.7) !important;">Response Speed Time</span>
          <div class="gauge-wrap" style="border-top-color:var(--saffron-primary);">
            <span class="gauge-number" style="font-size:15px;">${this.loggedSupplier.responseTime}</span>
          </div>
          <span style="font-size:11px; color:rgba(255,255,255,0.5); text-align:center;">Avg client reply latency</span>
        </div>

        <div class="dash-stat-card analytics-dark-panel" style="text-align:center;">
          <span class="dash-stat-label" style="color:rgba(255,255,255,0.7) !important;">Top Performance Crop</span>
          <div style="margin-top:16px;">
            <span style="font-size:32px;">🌾</span>
            <h4 style="font-size:14.5px; font-weight:700; margin-top:8px; color:var(--white) !important;">Lokwan Sharbati Wheat</h4>
            <span style="font-size:11.5px; color:rgba(255,255,255,0.5);">18 Inquiries (56% share)</span>
          </div>
        </div>
      </div>

      <!-- Graph Canvas Areas -->
      <div class="analytics-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px; margin-top:30px;">
        <div class="chart-card analytics-dark-panel">
          <h3 style="font-size:15px; font-weight:700; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">Profile Views & Inquiries (7-Day Trend)</h3>
          <div class="chart-container" style="position:relative; height:240px; width:100%;">
            <canvas id="views-line-chart-canvas"></canvas>
          </div>
        </div>

        <div class="chart-card analytics-dark-panel">
          <h3 style="font-size:15px; font-weight:700; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">Best Inquiry Hours (Activity Heat)</h3>
          <div class="chart-container" style="position:relative; height:240px; width:100%;">
            <canvas id="hours-bar-chart-canvas"></canvas>
          </div>
        </div>

        <div class="chart-card analytics-dark-panel">
          <h3 style="font-size:15px; font-weight:700; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px;">District Volume Demand (Deals share)</h3>
          <div class="chart-container" style="position:relative; height:240px; width:100%;">
            <canvas id="district-doughnut-chart-canvas"></canvas>
          </div>
        </div>
      </div>
    `;

    // Initialize Chart.js visual charts with a micro-timeout to ensure DOM rendering
    setTimeout(() => this.initAnalyticsCharts(), 120);

    document.getElementById("analytics-csv-btn").addEventListener("click", () => {
      this.showToast("CSV data exported successfully! Check your downloads.");
    });
  }

  static initAnalyticsCharts() {
    const lineCtx = document.getElementById("views-line-chart-canvas");
    const barCtx = document.getElementById("hours-bar-chart-canvas");
    const doughnutCtx = document.getElementById("district-doughnut-chart-canvas");

    if (!lineCtx || !barCtx || !doughnutCtx) return;

    // Check if Chart.js library is loaded
    if (window.Chart) {
      // Configure global defaults for premium dark mode aesthetics
      Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
      Chart.defaults.font.family = "'Inter', 'Poppins', sans-serif";

      // 1. Curved Line Chart for Views & Inquiries (7-Day Trend)
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ["May 22", "May 23", "May 24", "May 25", "May 26", "May 27", "May 28"],
          datasets: [
            {
              label: 'Profile Views',
              data: [35, 45, 60, 40, 80, 95, 120],
              borderColor: '#2D6A4F', // Forest Green
              backgroundColor: 'rgba(45, 106, 79, 0.15)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#2D6A4F',
              pointHoverRadius: 6
            },
            {
              label: 'Buyer Inquiries',
              data: [4, 6, 8, 5, 12, 14, 18],
              borderColor: '#E8721C', // Saffron
              backgroundColor: 'rgba(232, 114, 28, 0.15)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#E8721C',
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'top', 
              labels: { 
                boxWidth: 12, 
                color: 'rgba(255, 255, 255, 0.8)',
                font: { size: 11, weight: '500' }
              } 
            },
            tooltip: {
              backgroundColor: '#0F172A',
              titleColor: '#FFFFFF',
              bodyColor: '#E2E8F0',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 6
            }
          },
          scales: {
            y: { 
              grid: { color: 'rgba(255, 255, 255, 0.08)' }, 
              ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } } 
            },
            x: { 
              grid: { display: false }, 
              ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } } 
            }
          }
        }
      });

      // 2. Bar Chart for Peak Inquiry hours (Activity Heat)
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
          datasets: [{
            label: 'Inquiry Volume',
            data: [5, 25, 40, 30, 48, 15],
            backgroundColor: 'linear-gradient(to top, #E8721C, #FF9E53)',
            backgroundColor: '#E8721C', // Fallback solid Saffron
            hoverBackgroundColor: '#FF9E53',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0F172A',
              titleColor: '#FFFFFF',
              bodyColor: '#E2E8F0',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 6
            }
          },
          scales: {
            y: { 
              grid: { color: 'rgba(255, 255, 255, 0.08)' }, 
              ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } } 
            },
            x: { 
              grid: { display: false }, 
              ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } } 
            }
          }
        }
      });

      // 3. District Volume Demand Doughnut Chart (Raisen vs. Sehore)
      new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ["Raisen", "Sehore", "Vidisha", "Hoshangabad", "Dewas"],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              '#E8721C', // Saffron
              '#2D6A4F', // Forest Green
              '#00A3FF', // Cyan Blue
              '#8C52FF', // Purple
              '#F4A623'  // Gold
            ],
            borderWidth: 2,
            borderColor: '#0A0F1D', // Matches panel dark background
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgba(255, 255, 255, 0.8)',
                boxWidth: 12,
                font: { size: 11 }
              }
            },
            tooltip: {
              backgroundColor: '#0F172A',
              titleColor: '#FFFFFF',
              bodyColor: '#E2E8F0',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 6
            }
          }
        }
      });
    } else {
      // Fallback in case of offline CDN block: Inject beautifully colored custom SVG vector graphs!
      lineCtx.parentElement.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#0A0F1D; border:1px solid rgba(255,255,255,0.06); border-radius:8px;">
          <svg viewBox="0 0 400 200" style="width:90%; height:80%;">
            <!-- Gridlines -->
            <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <line x1="40" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <line x1="40" y1="170" x2="380" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
            
            <!-- Lines Views -->
            <path d="M 50 160 L 100 130 L 150 90 L 200 120 L 250 60 L 300 40 L 350 25" fill="none" stroke="#2D6A4F" stroke-width="3" />
            <!-- Lines Inquiries -->
            <path d="M 50 168 L 100 155 L 150 140 L 200 150 L 250 110 L 300 95 L 350 80" fill="none" stroke="#E8721C" stroke-width="3" />
            
            <circle cx="350" cy="25" r="4" fill="#2D6A4F" />
            <circle cx="350" cy="80" r="4" fill="#E8721C" />
          </svg>
        </div>
      `;
      
      barCtx.parentElement.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#0A0F1D; border:1px solid rgba(255,255,255,0.06); border-radius:8px;">
          <svg viewBox="0 0 400 200" style="width:90%; height:80%;">
            <!-- Bars -->
            <rect x="50" y="150" width="30" height="20" fill="#E8721C" rx="2" />
            <rect x="110" y="90" width="30" height="80" fill="#E8721C" rx="2" />
            <rect x="170" y="50" width="30" height="120" fill="#E8721C" rx="2" />
            <rect x="230" y="70" width="30" height="100" fill="#E8721C" rx="2" />
            <rect x="290" y="40" width="30" height="130" fill="#E8721C" rx="2" />
            <rect x="350" y="120" width="30" height="50" fill="#E8721C" rx="2" />
            
            <line x1="30" y1="170" x2="390" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          </svg>
        </div>
      `;

      doughnutCtx.parentElement.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#0A0F1D; border:1px solid rgba(255,255,255,0.06); border-radius:8px;">
          <svg viewBox="0 0 400 200" style="width:90%; height:80%;">
            <!-- Outer Ring Background -->
            <circle cx="120" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="20" />
            <!-- Segment 1: Raisen (35%) -->
            <circle cx="120" cy="100" r="60" fill="none" stroke="#E8721C" stroke-width="20" stroke-dasharray="377" stroke-dashoffset="245" stroke-linecap="round" transform="rotate(-90 120 100)" />
            <!-- Segment 2: Sehore (25%) -->
            <circle cx="120" cy="100" r="60" fill="none" stroke="#2D6A4F" stroke-width="20" stroke-dasharray="377" stroke-dashoffset="282" stroke-linecap="round" transform="rotate(36 120 100)" />
            <!-- Segment 3: Vidisha (20%) -->
            <circle cx="120" cy="100" r="60" fill="none" stroke="#00A3FF" stroke-width="20" stroke-dasharray="377" stroke-dashoffset="301" stroke-linecap="round" transform="rotate(126 120 100)" />
            <!-- Segment 4: Hoshangabad (12%) -->
            <circle cx="120" cy="100" r="60" fill="none" stroke="#8C52FF" stroke-width="20" stroke-dasharray="377" stroke-dashoffset="331" stroke-linecap="round" transform="rotate(198 120 100)" />
            <!-- Segment 5: Dewas (8%) -->
            <circle cx="120" cy="100" r="60" fill="none" stroke="#F4A623" stroke-width="20" stroke-dasharray="377" stroke-dashoffset="346" stroke-linecap="round" transform="rotate(241 120 100)" />
            
            <!-- Legend inside SVG -->
            <g transform="translate(230, 25)">
              <rect x="0" y="0" width="10" height="10" fill="#E8721C" rx="2" />
              <text x="18" y="10" fill="rgba(255,255,255,0.7)" font-family="Inter" font-size="11">Raisen (35%)</text>
              
              <rect x="0" y="24" width="10" height="10" fill="#2D6A4F" rx="2" />
              <text x="18" y="34" fill="rgba(255,255,255,0.7)" font-family="Inter" font-size="11">Sehore (25%)</text>
              
              <rect x="0" y="48" width="10" height="10" fill="#00A3FF" rx="2" />
              <text x="18" y="58" fill="rgba(255,255,255,0.7)" font-family="Inter" font-size="11">Vidisha (20%)</text>
              
              <rect x="0" y="72" width="10" height="10" fill="#8C52FF" rx="2" />
              <text x="18" y="82" fill="rgba(255,255,255,0.7)" font-family="Inter" font-size="11">Hoshangabad (12%)</text>
              
              <rect x="0" y="96" width="10" height="10" fill="#F4A623" rx="2" />
              <text x="18" y="106" fill="rgba(255,255,255,0.7)" font-family="Inter" font-size="11">Dewas (8%)</text>
            </g>
          </svg>
        </div>
      `;
    }
  }

  // 5.5 UPGRADED Dashboard Documents Panel: Includes drag-drop files upload simulated progress delays
  static renderDashboardDocuments(workspace) {
    workspace.innerHTML = `
      <div class="dash-panel">
        <h3>Verification Badge Center: ${this.loggedSupplier.verified === 'verified' ? '<span style="color:var(--forest-secondary);">✓ VERIFIED PARTNER</span>' : '<span style="color:var(--gold-accent);">DOCUMENT UPLOAD REQUIRED</span>'}</h3>
        <p style="color:var(--gray-medium); font-size:14px; margin-top:4px;">Secure the Green Verification Badge to place highly on public searches. Buyers contact verified suppliers 3x more frequently.</p>
        
        <div class="progress-bar-container" style="margin-top:24px; height:12px;">
          <div class="progress-bar-fill" id="docs-progress-fill" style="width: ${this.loggedSupplier.onboardingProgress}%; background-color:var(--forest-secondary);"></div>
        </div>
        <div style="font-size:12px; color:var(--gray-medium); text-align:right; margin-top:6px; font-weight:600;" id="docs-progress-text">${this.loggedSupplier.onboardingProgress}% Complete</div>
        
        <div class="doc-grid" style="margin-top:30px;">
          <!-- Aadhaar -->
          <div class="doc-card" id="doc-card-aadhaar">
            <div class="doc-info">
              <h4>Aadhaar Card (ID Proof)</h4>
              <p class="doc-status" id="doc-aadhaar-status">${this.loggedSupplier.docsUploaded.aadhaar ? '✅ Verified Partner Record' : '❌ Document Missing'}</p>
              <div class="upload-progress-container" style="display:none;" id="progress-bar-aadhaar">
                <div class="upload-progress-fill-sim" id="progress-fill-aadhaar"></div>
              </div>
            </div>
            <div class="doc-action-slot" id="action-slot-aadhaar">
              ${this.loggedSupplier.docsUploaded.aadhaar 
                ? '<span style="font-weight:700; color:var(--forest-secondary); font-size:13px;">Locked</span>' 
                : '<button class="btn btn-outline btn-sm simulated-doc-upload-btn" data-doc="aadhaar">Upload file</button>'
              }
            </div>
          </div>

          <!-- GST -->
          <div class="doc-card" id="doc-card-gst">
            <div class="doc-info">
              <h4>GST Certificate (Tax Form)</h4>
              <p class="doc-status" id="doc-gst-status">${this.loggedSupplier.docsUploaded.gst ? '✅ Verified Partner Record' : '❌ Document Missing'}</p>
              <div class="upload-progress-container" style="display:none;" id="progress-bar-gst">
                <div class="upload-progress-fill-sim" id="progress-fill-gst"></div>
              </div>
            </div>
            <div class="doc-action-slot" id="action-slot-gst">
              ${this.loggedSupplier.docsUploaded.gst 
                ? '<span style="font-weight:700; color:var(--forest-secondary); font-size:13px;">Locked</span>' 
                : '<button class="btn btn-outline btn-sm simulated-doc-upload-btn" data-doc="gst">Upload file</button>'
              }
            </div>
          </div>

          <!-- FSSAI -->
          <div class="doc-card" id="doc-card-fssai">
            <div class="doc-info">
              <h4>FSSAI Food License</h4>
              <p class="doc-status" id="doc-fssai-status">${this.loggedSupplier.docsUploaded.fssai ? '✅ Verified Partner Record' : '❌ Document Missing'}</p>
              <div class="upload-progress-container" style="display:none;" id="progress-bar-fssai">
                <div class="upload-progress-fill-sim" id="progress-fill-fssai"></div>
              </div>
            </div>
            <div class="doc-action-slot" id="action-slot-fssai">
              ${this.loggedSupplier.docsUploaded.fssai 
                ? '<span style="font-weight:700; color:var(--forest-secondary); font-size:13px;">Locked</span>' 
                : '<button class="btn btn-outline btn-sm simulated-doc-upload-btn" data-doc="fssai">Upload file</button>'
              }
            </div>
          </div>

          <!-- Land Records -->
          <div class="doc-card" id="doc-card-land">
            <div class="doc-info">
              <h4>Land Records / Warehouse Lease</h4>
              <p class="doc-status" id="doc-land-status">${this.loggedSupplier.docsUploaded.land ? '✅ Verified Partner Record' : '❌ Document Missing'}</p>
              <div class="upload-progress-container" style="display:none;" id="progress-bar-land">
                <div class="upload-progress-fill-sim" id="progress-fill-land"></div>
              </div>
            </div>
            <div class="doc-action-slot" id="action-slot-land">
              ${this.loggedSupplier.docsUploaded.land 
                ? '<span style="font-weight:700; color:var(--forest-secondary); font-size:13px;">Locked</span>' 
                : '<button class="btn btn-outline btn-sm simulated-doc-upload-btn" data-doc="land">Upload file</button>'
              }
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindDashboardDocsEvents();
  }

  static bindDashboardDocsEvents() {
    document.querySelectorAll(".simulated-doc-upload-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const docType = e.target.getAttribute("data-doc");
        this.performSimulatedUpload(docType, e.target);
      });
    });
  }

  // Simulated upload interval delay animation
  static performSimulatedUpload(docType, btnElement) {
    const parentCard = document.getElementById(`doc-card-${docType}`);
    const statusText = parentCard.querySelector(".doc-status");
    const progressContainer = document.getElementById(`progress-bar-${docType}`);
    const progressFill = document.getElementById(`progress-fill-${docType}`);
    const actionSlot = document.getElementById(`action-slot-${docType}`);

    if (!parentCard) return;

    // 1. Hide Button, display loading spinner text
    actionSlot.innerHTML = `<span style="font-size:13px; font-weight:600; color:var(--saffron-primary);"><span class="upload-spinner-sim"></span>Reading file...</span>`;
    
    // Inject the high-fidelity secure sandboxed scan box!
    let scanBox = parentCard.querySelector(".secure-scan-box");
    if (!scanBox) {
      scanBox = document.createElement("div");
      scanBox.className = "secure-scan-box";
      scanBox.style.marginTop = "16px";
      parentCard.querySelector(".doc-info").appendChild(scanBox);
    }

    scanBox.innerHTML = `
      <div style="flex-shrink:0; position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:rgba(0,163,255,0.1); border-radius:50%; color:var(--saffron-primary);">
        <span class="upload-spinner-sim" style="width:24px; height:24px; border-width:3px; margin:0;"></span>
        <span style="position:absolute; font-size:12px;">🛡️</span>
      </div>
      <div style="flex-grow:1;">
        <div style="font-size:13px; font-weight:700; color:var(--charcoal); display:flex; justify-content:space-between; align-items:center;">
          <span>Vault Sandbox Scanner</span>
          <span class="scan-percentage" style="color:var(--saffron-primary); font-family:monospace; font-weight:800;">0%</span>
        </div>
        <div class="scan-status-log" style="font-size:11.5px; color:var(--gray-medium); margin-top:2px;">Initializing secure sandbox...</div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;" class="scan-checkpoints">
          <span style="font-size:10px; padding:2px 6px; background:var(--gray-light); border-radius:4px; color:var(--gray-medium); transition:all 0.3s;" id="scan-step-${docType}-1">1. Integrity Check</span>
          <span style="font-size:10px; padding:2px 6px; background:var(--gray-light); border-radius:4px; color:var(--gray-medium); transition:all 0.3s;" id="scan-step-${docType}-2">2. Virus Sweep</span>
          <span style="font-size:10px; padding:2px 6px; background:var(--gray-light); border-radius:4px; color:var(--gray-medium); transition:all 0.3s;" id="scan-step-${docType}-3">3. Govt Registry</span>
          <span style="font-size:10px; padding:2px 6px; background:var(--gray-light); border-radius:4px; color:var(--gray-medium); transition:all 0.3s;" id="scan-step-${docType}-4">4. Badge Issuance</span>
        </div>
      </div>
    `;

    progressContainer.style.display = "none"; // Hide standard simple progress bar
    statusText.style.display = "none"; // Hide plain text status
    
    let percent = 0;
    const interval = setInterval(() => {
      percent += 5; // increment slower for premium feel (20 steps total)
      if (percent > 100) percent = 100;
      
      const pctEl = scanBox.querySelector(".scan-percentage");
      const logEl = scanBox.querySelector(".scan-status-log");
      if (pctEl) pctEl.innerText = percent + "%";

      if (percent < 25) {
        if (logEl) logEl.innerText = "Initializing sandboxed container...";
      } else if (percent >= 25 && percent < 50) {
        if (logEl) logEl.innerText = "Integrity Check: PASS. Checking metadata...";
        const step1 = document.getElementById(`scan-step-${docType}-1`);
        if (step1) {
          step1.style.background = "rgba(0, 181, 98, 0.15)";
          step1.style.color = "var(--forest-secondary)";
          step1.style.fontWeight = "700";
        }
      } else if (percent >= 50 && percent < 75) {
        if (logEl) logEl.innerText = "Virus Sweep: CLEAN. Verifying key signatures...";
        const step2 = document.getElementById(`scan-step-${docType}-2`);
        if (step2) {
          step2.style.background = "rgba(0, 181, 98, 0.15)";
          step2.style.color = "var(--forest-secondary)";
          step2.style.fontWeight = "700";
        }
      } else if (percent >= 75 && percent < 100) {
        if (logEl) logEl.innerText = "Govt Registry: MATCHED. Generating secure token...";
        const step3 = document.getElementById(`scan-step-${docType}-3`);
        if (step3) {
          step3.style.background = "rgba(0, 181, 98, 0.15)";
          step3.style.color = "var(--forest-secondary)";
          step3.style.fontWeight = "700";
        }
      } else if (percent === 100) {
        clearInterval(interval);
        if (logEl) logEl.innerText = "Security check complete! Credential locked.";
        const step4 = document.getElementById(`scan-step-${docType}-4`);
        if (step4) {
          step4.style.background = "rgba(0, 181, 98, 0.15)";
          step4.style.color = "var(--forest-secondary)";
          step4.style.fontWeight = "700";
        }

        setTimeout(() => {
          // Perform state changes in localStorage
          const suppliers = LocalDB.getSuppliers();
          const current = suppliers.find(s => s.id === this.loggedSupplier.id);
          if (current) {
            current.docsUploaded[docType] = true;
            current.onboardingProgress += 25; 
            
            const allDocs = Object.values(current.docsUploaded).every(v => v === true);
            if (allDocs) {
              current.verified = "verified";
              current.onboardingProgress = 100;
            }
            LocalDB.saveSuppliers(suppliers);
            this.loggedSupplier = current; // update in-memory reference

            // Append to Notifications bell
            const notifications = LocalDB.getNotifications();
            notifications.unshift({
              id: "noti-" + Date.now(),
              supplierId: this.loggedSupplier.id,
              title: "Document Verified",
              text: `Your uploaded proof for ${docType.toUpperCase()} has been approved.`,
              date: "Just now",
              read: false
            });
            LocalDB.saveNotifications(notifications);
            
            this.updateBellNotificationBadge();
            this.renderNotificationList();

            // Update UI view elements
            this.showToast(`Document validated! Onboarding: ${current.onboardingProgress}%`);
            this.renderDashboardSubpage("documents");
          }
        }, 800); // short delay to show 100% completion state
      }
    }, 150);
  }

  // 5.6 Dashboard Profile Panel
  static renderDashboardProfile(workspace) {
    workspace.innerHTML = `
      <div class="dash-panel">
        <form id="dash-profile-form">
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:20px;">
            <div class="form-group">
              <label>Business Name*</label>
              <input type="text" id="prof-name" class="form-input" required value="${this.loggedSupplier.name}">
            </div>
            <div class="form-group">
              <label>Contact Person Full Name*</label>
              <input type="text" id="prof-person" class="form-input" required value="${this.loggedSupplier.contactPerson}">
            </div>
            <div class="form-group">
              <label>Phone Number* (OTP Verified)</label>
              <input type="tel" id="prof-phone" class="form-input" required value="${this.loggedSupplier.phone}">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="prof-email" class="form-input" value="${this.loggedSupplier.email}">
            </div>
            <div class="form-group">
              <label>Primary District*</label>
              <input type="text" id="prof-district" class="form-input" required value="${this.loggedSupplier.district}">
            </div>
            <div class="form-group">
              <label>Business Type*</label>
              <select class="form-input" id="prof-type">
                <option value="Farmer" ${this.loggedSupplier.businessType === 'Farmer' ? 'selected' : ''}>Farmer / Producer</option>
                <option value="Aggregator" ${this.loggedSupplier.businessType === 'Aggregator' ? 'selected' : ''}>Aggregator / Mandi Trader</option>
                <option value="Warehouse Owner" ${this.loggedSupplier.businessType === 'Warehouse Owner' ? 'selected' : ''}>Warehouse Owner</option>
              </select>
            </div>
          </div>
          
          <div class="form-group" style="margin-top:20px;">
            <label>About Your Business*</label>
            <textarea id="prof-about" class="form-textarea" required>${this.loggedSupplier.about}</textarea>
          </div>
          
          <button type="submit" class="btn btn-primary" style="margin-top:16px;">Save Profile Changes</button>
        </form>
      </div>
    `;

    document.getElementById("dash-profile-form").addEventListener("submit", (e) => {
      e.preventDefault();
      
      const suppliers = LocalDB.getSuppliers();
      const current = suppliers.find(s => s.id === this.loggedSupplier.id);
      if (current) {
        current.name = document.getElementById("prof-name").value;
        current.contactPerson = document.getElementById("prof-person").value;
        current.phone = document.getElementById("prof-phone").value;
        current.email = document.getElementById("prof-email").value;
        current.district = document.getElementById("prof-district").value;
        current.businessType = document.getElementById("prof-type").value;
        current.about = document.getElementById("prof-about").value;

        LocalDB.saveSuppliers(suppliers);
        this.showToast("Profile settings updated successfully!");
        this.renderDashboard();
      }
    });
  }

  // --- 6. BUYER DASHBOARD PANEL ---
  static renderBuyerDashboard() {
    this.currentUser = LocalDB.getLoggedUser();
    
    if (!this.currentUser || this.currentUser.role !== "buyer") {
      this.appRoot.innerHTML = `<div class="container" style="padding:100px; text-align:center;"><h2>Unauthorized</h2></div>`;
      return;
    }

    const inquiries = LocalDB.getInquiries().filter(i => i.buyerId === this.currentUser.id);
    const buyers = LocalDB.getBuyers();
    const buyerObj = buyers.find(b => b.id === this.currentUser.id);
    const savedSuppliers = LocalDB.getSuppliers().filter(s => buyerObj.savedSuppliers.includes(s.id));
    const orders = LocalDB.getOrders().filter(o => o.buyerId === this.currentUser.id);

    this.appRoot.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 80px;">
        <h1 style="font-size:32px; margin-bottom:8px;">Welcome, ${buyerObj.name}! 🏢</h1>
        <p style="color:var(--gray-medium); margin-bottom:30px;">Manage bulk purchasing inquiries, check direct vendor responses, and review saved suppliers.</p>

        <div class="buyer-dash-grid">
          <div class="buyer-dash-main">
            <h3 style="font-size: 18px; margin-bottom: 20px; border-bottom:1.5px solid var(--gray-border); padding-bottom:10px;">Submitted Bulk Inquiries (${inquiries.length})</h3>
            
            ${inquiries.length === 0 ? `
              <div style="text-align:center; padding:50px 20px; color:var(--gray-medium);">
                <span style="font-size:40px;">📭</span>
                <h4 style="margin-top:16px;">You haven't sent any inquiries yet</h4>
                <p style="font-size:14px; margin-top:8px;">Go to the commodities browse page to select high-grade lots and contact verified suppliers.</p>
                <a href="#browse" class="btn btn-primary btn-sm" style="margin-top:16px;">Browse Commodities</a>
              </div>
            ` : `
              <div class="dash-table-wrapper">
                <table class="dash-table">
                  <thead>
                    <tr>
                      <th>Crop / Listing</th>
                      <th>Supplier</th>
                      <th>Req. Quantity</th>
                      <th>Sent Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inquiries.map(i => {
                      const list = LocalDB.getListings().find(l => l.id === i.listingId);
                      const sup = LocalDB.getSuppliers().find(s => s.id === i.supplierId);
                      return `
                        <tr>
                          <td><b>${list ? list.commodity : 'Deleted lot'}</b></td>
                          <td>${sup ? sup.name : 'Unknown supplier'}</td>
                          <td><b>${i.quantity} qtl</b></td>
                          <td>${i.date}</td>
                          <td>
                            <span class="status-pill status-${i.status}">${i.status}</span>
                          </td>
                          <td>
                            <button class="btn btn-outline btn-sm view-inq-details-btn" data-inqid="${i.id}" style="cursor:pointer;">View Chat</button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}

            <div id="buyer-active-chat-container" style="display:none; margin-top:40px; border-top: 2px dashed var(--gray-border); padding-top:30px;">
              <!-- Dynamic Chat injects here -->
            </div>

            <h3 style="font-size: 18px; margin-top: 40px; margin-bottom: 20px; border-bottom:1.5px solid var(--gray-border); padding-bottom:10px;">🛒 My Purchases (B2B Bulk Contracts) (${orders.length})</h3>
            
            ${orders.length === 0 ? `
              <div style="text-align:center; padding:30px 20px; color:var(--gray-medium); background: white; border: 1px solid var(--gray-border); border-radius: var(--radius-sm);">
                <span style="font-size:32px;">📦</span>
                <p style="font-size:14px; margin-top:8px;">No bulk purchases made yet. Use "Buy Now" on active lots to instantly lock contracts.</p>
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:16px;">
                ${orders.map(o => {
                  const listing = LocalDB.getListings().find(l => l.id === o.listingId);
                  const supplier = LocalDB.getSuppliers().find(s => s.id === o.supplierId);
                  
                  // Progress bar status mappings
                  let activeStep = 1;
                  if (o.orderStatus === "shipped") activeStep = 2;
                  else if (o.orderStatus === "delivered") activeStep = 3;
                  else if (o.orderStatus === "closed") activeStep = 4;

                  return `
                    <div class="dash-panel" style="border: 1px solid var(--gray-border); padding: 20px; margin-bottom: 10px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--gray-light); padding-bottom:12px; margin-bottom:16px;">
                        <div>
                          <span style="font-size:12px; color:var(--gray-medium);">Contract ID:</span>
                          <span style="font-weight:700; font-family:monospace; color:var(--saffron-primary); margin-left:4px;">${o.id}</span>
                        </div>
                        <div style="text-align:right;">
                          <span style="font-size:12px; color:var(--gray-medium);">Date:</span>
                          <span style="font-weight:600; margin-left:4px;">${o.orderDate}</span>
                        </div>
                      </div>

                      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px; margin-bottom:20px;">
                        <div>
                          <span style="font-size:12px; color:var(--gray-medium);">Crop Commodity:</span>
                          <div style="font-weight:700; font-size:15px; margin-top:2px;">${listing ? listing.commodity : 'Bulk Lot'} (${listing ? listing.variety : ''})</div>
                        </div>
                        <div>
                          <span style="font-size:12px; color:var(--gray-medium);">Supplier Partner:</span>
                          <div style="font-weight:700; font-size:15px; margin-top:2px;">${supplier ? supplier.name : 'Verified Supplier'}</div>
                        </div>
                        <div>
                          <span style="font-size:12px; color:var(--gray-medium);">Transaction Volume:</span>
                          <div style="font-weight:700; font-size:15px; margin-top:2px; color:var(--forest-secondary);">${o.quantity} quintals</div>
                        </div>
                        <div>
                          <span style="font-size:12px; color:var(--gray-medium);">Financial Value:</span>
                          <div style="font-weight:700; font-size:15px; margin-top:2px; color:var(--forest-secondary);">₹${o.totalAmount.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px; margin-bottom:20px; background:var(--bg-light); padding:10px 12px; border-radius:6px; border:1px solid var(--gray-light); font-size:13px;">
                        <div>💳 Payment: <b>${o.paymentTerms}</b></div>
                        <div>🚚 Shipping: <b>${o.logisticsType}</b></div>
                      </div>

                      <!-- cargo shipping progress timeline -->
                      <div style="margin-top:20px;">
                        <span style="font-size:12px; color:var(--gray-medium); display:block; margin-bottom:10px; font-weight:600;">🚚 Cargo Shipping Progress:</span>
                        <div class="progress-timeline-wrapper" style="display:flex; justify-content:space-between; position:relative; margin-top:24px; padding:0 10px;">
                          
                          <!-- Progress Bar Line -->
                          <div style="position:absolute; top:8px; left:0; width:100%; height:4px; background:#e0e0e0; z-index:1;"></div>
                          <div style="position:absolute; top:8px; left:0; width:${(activeStep - 1) * 33.3}%; height:4px; background:var(--forest-secondary); z-index:2; transition:width 0.3s ease;"></div>

                          <div class="timeline-step" style="z-index:3; text-align:center; position:relative;">
                            <div style="width:20px; height:20px; border-radius:50%; background:${activeStep >= 1 ? 'var(--forest-secondary)' : '#e0e0e0'}; color:white; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 6px auto;">1</div>
                            <span style="font-size:11.5px; font-weight:${activeStep >= 1 ? '700' : '500'}; color:${activeStep >= 1 ? 'var(--charcoal)' : 'var(--gray-medium)'};">Confirmed</span>
                          </div>
                          
                          <div class="timeline-step" style="z-index:3; text-align:center; position:relative;">
                            <div style="width:20px; height:20px; border-radius:50%; background:${activeStep >= 2 ? 'var(--forest-secondary)' : '#e0e0e0'}; color:white; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 6px auto;">2</div>
                            <span style="font-size:11.5px; font-weight:${activeStep >= 2 ? '700' : '500'}; color:${activeStep >= 2 ? 'var(--charcoal)' : 'var(--gray-medium)'};">Dispatched</span>
                          </div>

                          <div class="timeline-step" style="z-index:3; text-align:center; position:relative;">
                            <div style="width:20px; height:20px; border-radius:50%; background:${activeStep >= 3 ? 'var(--forest-secondary)' : '#e0e0e0'}; color:white; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 6px auto;">3</div>
                            <span style="font-size:11.5px; font-weight:${activeStep >= 3 ? '700' : '500'}; color:${activeStep >= 3 ? 'var(--charcoal)' : 'var(--gray-medium)'};">In Transit</span>
                          </div>

                          <div class="timeline-step" style="z-index:3; text-align:center; position:relative;">
                            <div style="width:20px; height:20px; border-radius:50%; background:${activeStep >= 4 ? 'var(--forest-secondary)' : '#e0e0e0'}; color:white; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 6px auto;">4</div>
                            <span style="font-size:11.5px; font-weight:${activeStep >= 4 ? '700' : '500'}; color:${activeStep >= 4 ? 'var(--charcoal)' : 'var(--gray-medium)'};">Received</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <div class="buyer-dash-sidebar">
            <div class="supplier-detail-panel" style="padding:20px;">
              <h4 style="font-size:16px; margin-bottom:16px; border-bottom:1px solid var(--gray-border); padding-bottom:8px;">Saved Suppliers (${savedSuppliers.length})</h4>
              
              ${savedSuppliers.length === 0 ? `
                <p style="font-size:13px; color:var(--gray-medium);">No suppliers bookmarked yet.</p>
              ` : savedSuppliers.map(s => `
                <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <h5 style="font-size:14px; font-weight:700;">${s.name}</h5>
                    <span style="font-size:12px; color:var(--gray-medium);">📍 ${s.district}</span>
                  </div>
                  <a href="#supplier-profile/${s.id}" class="btn btn-outline btn-sm" style="padding:4px 10px; font-size:11px;">View</a>
                </div>
              `).join('')}
            </div>

            <div class="supplier-detail-panel" style="padding:20px; background-color: var(--saffron-light); border-color: rgba(232, 114, 28, 0.2);">
              <h4 style="font-size:16px; margin-bottom:8px; color: var(--saffron-primary);">Request For Quote (RFQ)</h4>
              <p style="font-size:12.5px; color: #666; line-height:1.5;">Cannot find specific variety or loading delivery parameters? Post an open RFQ. Suppliers will contact you with quotes directly.</p>
              <button class="btn btn-primary btn-sm" style="margin-top:14px; font-size:12px;" onclick="alert('Open RFQ systems launching in Phase 2!')">Post Open RFQ</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindBuyerDashboardEvents();
  }

  static bindBuyerDashboardEvents() {
    document.querySelectorAll(".view-inq-details-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-inqid");
        this.selectBuyerChat(id);
      });
    });
  }

  static selectBuyerChat(inqId) {
    const inquiries = LocalDB.getInquiries();
    const inq = inquiries.find(i => i.id === inqId);
    if (!inq) return;

    const list = LocalDB.getListings().find(l => l.id === inq.listingId);
    const sup = LocalDB.getSuppliers().find(s => s.id === inq.supplierId);
    const chatContainer = document.getElementById("buyer-active-chat-container");
    if (!chatContainer) return;

    const mandiRate = list ? MandiService.getMandiRate(list.commodity, list.district) : 5000;
    const offeredRate = inq.offeredRate || (list ? list.price : 0);
    const savings = mandiRate - offeredRate;
    
    let dealBadgeHtml = '';
    if (savings > 0) {
      dealBadgeHtml = `
        <span style="background:rgba(0, 181, 98, 0.08); color:var(--forest-secondary); font-size:11.5px; padding:4px 10px; border-radius:4px; font-weight:700; border:1px solid rgba(0, 181, 98, 0.18); display:inline-block;">
          💡 Best Deal: Saves you ₹${savings.toLocaleString('en-IN')}/qtl!
        </span>
      `;
    }

    const priceInfoHtml = `
      <div style="margin-bottom:16px; display:flex; gap:20px; align-items:center; background:var(--bg-light); padding:10px 12px; border-radius:6px; border:1px solid var(--gray-border); font-size:12.5px;">
        <div><b>Your Offered Price:</b> <span style="color:var(--saffron-primary); font-weight:700;">₹${offeredRate.toLocaleString('en-IN')}/qtl</span></div>
        <div><b>Live Mandi Reference Rate:</b> <span style="color:var(--dark); font-weight:700;">₹${mandiRate.toLocaleString('en-IN')}/qtl</span></div>
        ${dealBadgeHtml}
      </div>
    `;

    chatContainer.style.display = "block";
    chatContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="font-size:16px;">Chat with: <b>${sup ? sup.name : 'Supplier'}</b></h3>
        <span style="font-size:13px; color:var(--gray-medium);">⚡ Usually replies in ${sup ? sup.responseTime : '4 hours'}</span>
      </div>

      ${priceInfoHtml}

      <div class="buyer-chat-card">
        <div class="buyer-chat-feed" id="buyer-chat-feed-box">
          <div class="buyer-chat-bubble buyer-chat-bubble-sent">
            <div style="font-size:11px; font-weight:700; color:var(--forest-secondary); margin-bottom:2px;">You</div>
            <p>${inq.message}</p>
            <span style="font-size:9px; color:var(--gray-medium); display:block; text-align:right; margin-top:4px;">${inq.date}</span>
          </div>

          ${inq.replies.map(r => `
            <div class="buyer-chat-bubble ${r.sender === 'supplier' ? 'buyer-chat-bubble-received' : 'buyer-chat-bubble-sent'}">
              <div style="font-size:11px; font-weight:700; color: ${r.sender === 'supplier' ? 'var(--saffron-primary)' : 'var(--forest-secondary)'}; margin-bottom:2px;">
                ${r.sender === 'supplier' ? (sup ? sup.name : 'Supplier') : 'You'}
              </div>
              <p>${r.text}</p>
              <span style="font-size:9px; color:var(--gray-medium); display:block; text-align:right; margin-top:4px;">${r.date}</span>
            </div>
          `).join('')}
        </div>

        <form id="buyer-chat-input-form" style="display:flex; gap:10px;">
          <input type="text" id="buyer-chat-text" class="form-input" placeholder="Type a follow-up message to supplier..." required style="height:40px;">
          <button type="submit" class="btn btn-primary btn-sm" style="padding:0 24px;">Send</button>
        </form>
      </div>
    `;

    const feed = document.getElementById("buyer-chat-feed-box");
    if (feed) feed.scrollTop = feed.scrollHeight;

    document.getElementById("buyer-chat-input-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const txt = document.getElementById("buyer-chat-text").value;

      const latestInquiries = LocalDB.getInquiries();
      const target = latestInquiries.find(i => i.id === inqId);
      if (target) {
        target.replies.push({
          sender: "buyer",
          text: txt,
          date: new Date().toISOString().split('T')[0]
        });
        LocalDB.saveInquiries(latestInquiries);

        // Send simulated notification alert to Supplier notification bell registry!
        const notifications = LocalDB.getNotifications();
        notifications.unshift({
          id: "noti-" + Date.now(),
          supplierId: target.supplierId,
          title: "Follow-up Received",
          text: `${target.buyerName} sent a follow-up query: "${txt.slice(0, 30)}..."`,
          date: "Just now",
          read: false
        });
        LocalDB.saveNotifications(notifications);

        this.showToast("Message sent to supplier!");
        this.selectBuyerChat(inqId); 
      }
    });
  }

  // 7. HOW IT WORKS / FAQ PAGE
  static renderHowItWorks() {
    this.appRoot.innerHTML = `
      <div class="container" style="padding-top:60px; padding-bottom:90px;">
        <div class="section-header">
          <h1>How TradeVithika Works</h1>
          <p>Simplifying bulk B2B agricultural commodity trade across Madhya Pradesh with total transparency.</p>
        </div>

        <div class="how-to-columns">
          <div class="how-to-col buyer-col">
            <h3>🛒 For Bulk Buyers</h3>
            <ol class="how-to-steps">
              <li class="how-to-step-item">
                <span class="how-to-step-num">1</span>
                <div class="how-to-step-text">
                  <h4>Browse Crop Stocks</h4>
                  <p>Filter by grain variety, specific moisture percentage, and minimum order capacities.</p>
                </div>
              </li>
              <li class="how-to-step-item">
                <span class="how-to-step-num">2</span>
                <div class="how-to-step-text">
                  <h4>Submit Free Inquiries</h4>
                  <p>Send direct inquiry specifying quantity, quality grade, and your delivery destination.</p>
                </div>
              </li>
              <li class="how-to-step-item">
                <span class="how-to-step-num">3</span>
                <div class="how-to-step-text">
                  <h4>Direct Negotiation</h4>
                  <p>Receive live replies and quotes directly from the supplier without middleman commissions.</p>
                </div>
              </li>
            </ol>
          </div>

          <div class="how-to-col supplier-col">
            <h3>🚜 For Agricultural Suppliers</h3>
            <ol class="how-to-steps">
              <li class="how-to-step-item">
                <span class="how-to-step-num">1</span>
                <div class="how-to-step-text">
                  <h4>Create Free Account</h4>
                  <p>Register as farmer, aggregator, or warehouse owner in 5 minutes with phone OTP validation.</p>
                </div>
              </li>
              <li class="how-to-step-item">
                <span class="how-to-step-num">2</span>
                <div class="how-to-step-text">
                  <h4>List Crop Inventory</h4>
                  <p>Upload crop technical specifications, price ranges, and real harvest photos.</p>
                </div>
              </li>
              <li class="how-to-step-item">
                <span class="how-to-step-num">3</span>
                <div class="how-to-step-text">
                  <h4>Acquire Bulk Sales</h4>
                  <p>Reply directly to serious buyer inquiries, coordinate freight loading, and close transactions.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <h2 style="text-align:center; font-size:28px; margin-bottom:40px;">Frequently Asked Questions</h2>
        <div class="faq-section">
          <div class="faq-item">
            <button class="faq-question">Is TradeVithika free to use? <span>▼</span></button>
            <div class="faq-answer">
              Yes! TradeVithika is completely free for both bulk buyers and agri-commodity suppliers in Phase 1. We do not charge listing fees or commissions.
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question">How are suppliers verified? <span>▼</span></button>
            <div class="faq-answer">
              Suppliers submit official Aadhaar cards, GST registration certificates, and land ownership records via VendorOS. Our administrative team checks these records before assigning the Green Verified badge.
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question">What commodities can be listed? <span>▼</span></button>
            <div class="faq-answer">
              Currently, in Phase 1, we support Soybean (सोयाबीन), Wheat (गेहूँ), Chana (चना), and Garlic (लहसुन) bulk trading in Madhya Pradesh.
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question">Are payments handled on the platform? <span>▼</span></button>
            <div class="faq-answer">
              No, TradeVithika is an inquiry-based marketplace. Payments, logistics, and quality verification happen directly between buyer and supplier off-platform.
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindFAQEvents();
  }

  static bindFAQEvents() {
    document.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", () => {
        const item = q.parentElement;
        const isActive = item.classList.contains("active");
        
        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

  // 8. SUPPLIER REGISTRATION
  static renderRegister() {
    this.appRoot.innerHTML = `
      <div class="wizard-container">
        <div class="wizard-steps">
          <div class="wizard-step active" id="ws-step-1">
            <span class="step-num">1</span>
            <span class="step-label">Basic Info</span>
          </div>
          <div class="wizard-step" id="ws-step-2">
            <span class="step-num">2</span>
            <span class="step-label">Commodities</span>
          </div>
          <div class="wizard-step" id="ws-step-3">
            <span class="step-num">3</span>
            <span class="step-label">Setup Account</span>
          </div>
        </div>

        <div id="wizard-form-workspace">
          <!-- Wizard steps injected dynamically -->
        </div>
      </div>
    `;

    this.currentRegStep = 1;
    this.regData = {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      district: "Raisen",
      businessType: "Farmer",
      commodities: [],
      capacity: "",
      minOrder: "",
      hasWarehouse: "No",
      canTransport: "No"
    };

    this.renderRegStep(1);
  }

  static renderRegStep(step) {
    const ws = document.getElementById("wizard-form-workspace");
    if (!ws) return;

    for (let i = 1; i <= 3; i++) {
      const stepEl = document.getElementById(`ws-step-${i}`);
      if (stepEl) {
        stepEl.classList.remove("active", "completed");
        if (i < step) stepEl.classList.add("completed");
        if (i === step) stepEl.classList.add("active");
      }
    }

    if (step === 1) {
      ws.innerHTML = `
        <form id="reg-form-1">
          <div class="form-group">
            <label>Business / Farm Name*</label>
            <input type="text" id="reg-name" class="form-input" required placeholder="E.g. Yadav Farms" value="${this.regData.name}">
          </div>
          <div class="form-group">
            <label>Owner / Contact Person Full Name*</label>
            <input type="text" id="reg-person" class="form-input" required placeholder="E.g. Nimesh Yadav" value="${this.regData.contactPerson}">
          </div>
          <div class="form-group">
            <label>Mobile Phone Number*</label>
            <input type="tel" id="reg-phone" class="form-input" required placeholder="10-digit number for OTP confirmation" value="${this.regData.phone}">
          </div>
          <div class="form-group">
            <label>Email Address*</label>
            <input type="email" id="reg-email" class="form-input" required placeholder="Supplier login email" value="${this.regData.email}">
          </div>
          <div class="form-group">
            <label>District in MP*</label>
            <select id="reg-district" class="form-input" required>
              <option value="Raisen" ${this.regData.district === 'Raisen' ? 'selected' : ''}>Raisen</option>
              <option value="Sehore" ${this.regData.district === 'Sehore' ? 'selected' : ''}>Sehore</option>
              <option value="Hoshangabad" ${this.regData.district === 'Hoshangabad' ? 'selected' : ''}>Hoshangabad</option>
              <option value="Vidisha" ${this.regData.district === 'Vidisha' ? 'selected' : ''}>Vidisha</option>
              <option value="Narsinghpur" ${this.regData.district === 'Narsinghpur' ? 'selected' : ''}>Narsinghpur</option>
            </select>
          </div>
          <div class="form-group">
            <label>Business Type*</label>
            <select id="reg-type" class="form-input" required>
              <option value="Farmer" ${this.regData.businessType === 'Farmer' ? 'selected' : ''}>Farmer / Producer</option>
              <option value="Aggregator" ${this.regData.businessType === 'Aggregator' ? 'selected' : ''}>Aggregator / Mandi Trader</option>
              <option value="Warehouse Owner" ${this.regData.businessType === 'Warehouse Owner' ? 'selected' : ''}>Warehouse Owner</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" style="margin-top:24px;">Proceed to Step 2</button>
        </form>
      `;

      document.getElementById("reg-form-1").addEventListener("submit", (e) => {
        e.preventDefault();
        this.regData.name = document.getElementById("reg-name").value;
        this.regData.contactPerson = document.getElementById("reg-person").value;
        this.regData.phone = document.getElementById("reg-phone").value;
        this.regData.email = document.getElementById("reg-email").value;
        this.regData.district = document.getElementById("reg-district").value;
        this.regData.businessType = document.getElementById("reg-type").value;

        this.renderRegStep(2);
      });
    } else if (step === 2) {
      ws.innerHTML = `
        <form id="reg-form-2">
          <label class="form-group-label" style="font-weight:600; display:block; margin-bottom:12px;">Which commodities do you supply?*</label>
          <div class="multi-select-grid">
            <div class="multi-select-card ${this.regData.commodities.includes('Soybean') ? 'selected' : ''}" data-crop="Soybean">
              <input type="checkbox" ${this.regData.commodities.includes('Soybean') ? 'checked' : ''}>
              <span>🌱 Soybean / सोयाबीन</span>
            </div>
            <div class="multi-select-card ${this.regData.commodities.includes('Wheat') ? 'selected' : ''}" data-crop="Wheat">
              <input type="checkbox" ${this.regData.commodities.includes('Wheat') ? 'checked' : ''}>
              <span>🌾 Wheat / गेहूँ</span>
            </div>
            <div class="multi-select-card ${this.regData.commodities.includes('Chana') ? 'selected' : ''}" data-crop="Chana">
              <input type="checkbox" ${this.regData.commodities.includes('Chana') ? 'checked' : ''}>
              <span>🧆 Chana / चना</span>
            </div>
            <div class="multi-select-card ${this.regData.commodities.includes('Garlic') ? 'selected' : ''}" data-crop="Garlic">
              <input type="checkbox" ${this.regData.commodities.includes('Garlic') ? 'checked' : ''}>
              <span>🧄 Garlic / लहसुन</span>
            </div>
          </div>

          <div class="form-group" style="margin-top:20px;">
            <label>Approximate monthly supply capacity (Quintal)*</label>
            <input type="number" id="reg-cap" class="form-input" required value="${this.regData.capacity}">
          </div>
          
          <div class="form-group">
            <label>Minimum order you accept (Quintal)*</label>
            <input type="number" id="reg-min" class="form-input" required value="${this.regData.minOrder}">
          </div>

          <div style="display:flex; justify-content:space-between; gap:20px; margin-top:24px;">
            <button type="button" class="btn btn-outline" id="reg-back-1">Back</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Proceed to Step 3</button>
          </div>
        </form>
      `;

      document.querySelectorAll(".multi-select-card").forEach(card => {
        card.addEventListener("click", () => {
          const crop = card.getAttribute("data-crop");
          const checkbox = card.querySelector("input");
          
          if (this.regData.commodities.includes(crop)) {
            this.regData.commodities = this.regData.commodities.filter(c => c !== crop);
            card.classList.remove("selected");
            checkbox.checked = false;
          } else {
            this.regData.commodities.push(crop);
            card.classList.add("selected");
            checkbox.checked = true;
          }
        });
      });

      document.getElementById("reg-back-1").addEventListener("click", () => {
        this.renderRegStep(1);
      });

      document.getElementById("reg-form-2").addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.regData.commodities.length === 0) {
          this.showToast("Please select at least one commodity.", true);
          return;
        }
        this.regData.capacity = document.getElementById("reg-cap").value;
        this.regData.minOrder = document.getElementById("reg-min").value;
        this.renderRegStep(3);
      });
    } else if (step === 3) {
      ws.innerHTML = `
        <form id="reg-form-3">
          <div class="form-group">
            <label>Choose Dashboard Password*</label>
            <input type="password" id="reg-pass" class="form-input" required placeholder="Minimum 6 characters">
          </div>
          <div class="form-group">
            <label>Confirm Dashboard Password*</label>
            <input type="password" id="reg-pass-confirm" class="form-input" required>
          </div>
          
          <label class="checkbox-label" style="margin-top:24px;">
            <input type="checkbox" required>
            <span>I agree to TradeVithika's verification terms and agricultural policies.</span>
          </label>
          
          <div style="display:flex; justify-content:space-between; gap:20px; margin-top:24px;">
            <button type="button" class="btn btn-outline" id="reg-back-2">Back</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">Create My Account & List Products</button>
          </div>
        </form>
      `;

      document.getElementById("reg-back-2").addEventListener("click", () => {
        this.renderRegStep(2);
      });

      document.getElementById("reg-form-3").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const pass = document.getElementById("reg-pass").value;
        const confirmPass = document.getElementById("reg-pass-confirm").value;

        if (pass !== confirmPass) {
          this.showToast("Passwords do not match!", true);
          return;
        }

        const newSupId = "supplier-" + Date.now();
        const newSupplierObj = {
          id: newSupId,
          name: this.regData.name,
          contactPerson: this.regData.contactPerson,
          phone: this.regData.phone,
          email: this.regData.email,
          password: pass, 
          district: this.regData.district,
          businessType: this.regData.businessType,
          commodities: this.regData.commodities,
          verified: "unverified",
          rating: 5.0,
          reviewsCount: 0,
          responseTime: "8 hours",
          responseRate: "100%",
          totalInquiries: 0,
          views: 1,
          about: `Welcome to ${this.regData.name}! We supply bulk ${this.regData.commodities.join(' & ')} inside ${this.regData.district} district.`,
          onboardingProgress: 25, 
          docsUploaded: {
            aadhaar: false,
            gst: false,
            fssai: false,
            land: false
          }
        };

        const suppliers = LocalDB.getSuppliers();
        suppliers.push(newSupplierObj);
        LocalDB.saveSuppliers(suppliers);

        LocalDB.setLoggedUser({
          id: newSupId,
          role: "supplier",
          name: newSupplierObj.name,
          email: newSupplierObj.email
        });
        
        localStorage.setItem("tv_logged_supplier", newSupId);
        this.loggedSupplier = newSupplierObj;

        // Push welcoming notification
        const notifications = LocalDB.getNotifications();
        notifications.unshift({
          id: "noti-" + Date.now(),
          supplierId: newSupId,
          title: "Welcome Supplier!",
          text: "Welcome to TradeVithika VendorOS! Complete documents verification to earn green checkmarks.",
          date: "Just now",
          read: false
        });
        LocalDB.saveNotifications(notifications);

        this.showToast("Supplier Account registered! Welcome to VendorOS.");
        this.updateNavbar();
        window.location.hash = "#dashboard";
      });
    }
  }

  // --- PUBLIC AGRITECH MARKET INSIGHTS & BLOG PORTAL ---

  static renderBlog() {
    const blogs = LocalDB.getBlogs();
    
    let gridCardsHtml = "";
    blogs.forEach(b => {
      const isImageSrc = b.image && (b.image.startsWith("data:") || b.image.startsWith("http") || b.image.length > 4);
      const cardVisual = isImageSrc ? 
        `<img src="${b.image}" style="width: 100%; height: 100%; object-fit: cover;">` : 
        `<span style="font-size: 55px;">${b.image || '🌱'}</span>`;

      gridCardsHtml += `
        <div class="blog-card" data-id="${b.id}" style="background: white; border-radius: var(--radius-md); border: 1px solid var(--gray-border); overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: var(--shadow-sm); transition: var(--transition-smooth); cursor: pointer;">
          <div style="background: var(--gray-light); height: 160px; display: flex; justify-content: center; align-items: center; border-bottom: 1px solid var(--gray-border); overflow: hidden;">
            ${cardVisual}
          </div>
          <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="status-pill" style="background: var(--saffron-light); color: var(--saffron-hover); font-weight: 700; font-size: 11px; padding: 2px 10px; border-radius: 20px;">${b.category}</span>
              <span style="font-size: 11px; color: var(--gray-medium); font-weight: 500;">⏱️ ${b.readTime}</span>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; color: var(--charcoal); margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 48px;">
              ${b.title}
            </h3>
            <p style="font-size: 13px; color: var(--gray-medium); margin-bottom: 16px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1;">
              ${b.summary}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--gray-light); padding-top: 12px; margin-top: auto;">
              <span style="font-size: 12px; color: var(--gray-medium); font-weight: 600;">👤 ${b.author.split(" (")[0]}</span>
              <span style="font-size: 12px; color: var(--saffron-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">Read Post <span style="font-size: 14px;">→</span></span>
            </div>
          </div>
        </div>
      `;
    });

    this.appRoot.innerHTML = `
      <style>
        .btn-category-pill {
          padding: 8px 18px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 13.5px;
          border: 1px solid var(--gray-border);
          cursor: pointer;
          transition: var(--transition-smooth);
          background: white;
          color: var(--charcoal);
        }
        .btn-category-pill:hover {
          background: var(--gray-light);
          transform: translateY(-1px);
        }
        .btn-category-pill.active {
          background: var(--saffron-primary) !important;
          color: white !important;
          border-color: var(--saffron-primary) !important;
          box-shadow: 0 4px 12px rgba(0, 98, 255, 0.2);
        }
        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-premium) !important;
          border-color: var(--saffron-primary) !important;
        }
      </style>

      <!-- Hero Header Section -->
      <section class="blog-hero" style="background: linear-gradient(135deg, var(--charcoal) 0%, #102e52 100%); padding: 50px 0; color: white; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top:0; left:0; width:100%; height:100%; opacity:0.04; pointer-events:none; background: radial-gradient(circle, var(--forest-secondary) 10%, transparent 11%); background-size: 20px 20px;"></div>
        <div class="container">
          <span style="background: rgba(0, 181, 98, 0.15); color: var(--forest-secondary); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 12px; border: 1px solid rgba(0, 181, 98, 0.2);">📊 LIVE COOP MARKET INTELLIGENCE</span>
          <h1 style="color: white; font-size: 34px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 12px;">TradeVithika Market Insights</h1>
          <p style="color: rgba(255,255,255,0.75); font-size: 15px; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            Your trusted source for crop cultivation guides, policy updates, regional Madhya Pradesh mandi trends, and expert B2B agritech advisory.
          </p>
        </div>
      </section>

      <!-- Content & Filters Grid -->
      <section style="padding: 40px 0; background: var(--bg-light);">
        <div class="container">
          <div style="display: flex; gap: 20px; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 30px;">
            <!-- Category Filter Pills -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;" id="blog-category-filters">
              <button class="btn-category-pill active" data-category="all">All Insights</button>
              <button class="btn-category-pill" data-category="Crop Cultivation">Crop Cultivation 🌱</button>
              <button class="btn-category-pill" data-category="Market Insights">Market Insights 🌾</button>
              <button class="btn-category-pill" data-category="Policy Upgrades">Policy Upgrades 🤝</button>
              <button class="btn-category-pill" data-category="Agri-Tech">Agri-Tech ⚡</button>
            </div>
            
            <!-- Search Box -->
            <div style="position: relative; width: 100%; max-width: 320px;">
              <input type="text" id="blog-search" placeholder="Search insights or topics..." style="width: 100%; padding: 10px 16px 10px 40px; border-radius: 30px; border: 1px solid var(--gray-border); background: white; font-size: 14px; box-shadow: var(--shadow-sm); transition: var(--transition-smooth);">
              <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--gray-medium);">🔍</span>
            </div>
          </div>

          <!-- Blogs Main Grid -->
          <div id="blogs-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
            ${gridCardsHtml || `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--gray-medium); font-weight: 500;">No articles available.</div>`}
          </div>
        </div>
      </section>
    `;

    this.bindBlogEvents();
  }

  static bindBlogEvents() {
    // Navigate on card click
    document.querySelectorAll(".blog-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        window.location.hash = `#blog-detail/${id}`;
      });
    });

    const searchInput = document.getElementById("blog-search");
    const categoryButtons = document.querySelectorAll("#blog-category-filters .btn-category-pill");
    const gridContainer = document.getElementById("blogs-grid-container");

    if (!searchInput || !gridContainer) return;

    const filterBlogs = () => {
      const query = searchInput.value.toLowerCase().trim();
      const activeBtn = document.querySelector("#blog-category-filters .btn-category-pill.active");
      const activeCategory = activeBtn ? activeBtn.getAttribute("data-category") : "all";
      const blogs = LocalDB.getBlogs();

      const filtered = blogs.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(query) || 
                              b.summary.toLowerCase().includes(query) || 
                              b.content.toLowerCase().includes(query);
        const matchesCategory = activeCategory === "all" || b.category === activeCategory;
        return matchesSearch && matchesCategory;
      });

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: var(--radius-md); border: 1px solid var(--gray-border);">
            <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
            <h4 style="font-size: 16px; font-weight: 700; color: var(--charcoal); margin-bottom: 4px;">No Articles Found</h4>
            <p style="font-size: 13px; color: var(--gray-medium);">Try refining your search keywords or switching categories.</p>
          </div>
        `;
        return;
      }

      let gridHtml = "";
      filtered.forEach(b => {
        const isImageSrc = b.image && (b.image.startsWith("data:") || b.image.startsWith("http") || b.image.length > 4);
        const cardVisual = isImageSrc ? 
          `<img src="${b.image}" style="width: 100%; height: 100%; object-fit: cover;">` : 
          `<span style="font-size: 55px;">${b.image || '🌱'}</span>`;

        gridHtml += `
          <div class="blog-card" data-id="${b.id}" style="background: white; border-radius: var(--radius-md); border: 1px solid var(--gray-border); overflow: hidden; display: flex; flex-direction: column; height: 100%; box-shadow: var(--shadow-sm); transition: var(--transition-smooth); cursor: pointer;">
            <div style="background: var(--gray-light); height: 160px; display: flex; justify-content: center; align-items: center; border-bottom: 1px solid var(--gray-border); overflow: hidden;">
              ${cardVisual}
            </div>
            <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="status-pill" style="background: var(--saffron-light); color: var(--saffron-hover); font-weight: 700; font-size: 11px; padding: 2px 10px; border-radius: 20px;">${b.category}</span>
                <span style="font-size: 11px; color: var(--gray-medium); font-weight: 500;">⏱️ ${b.readTime}</span>
              </div>
              <h3 style="font-size: 17px; font-weight: 700; color: var(--charcoal); margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 48px;">
                ${b.title}
              </h3>
              <p style="font-size: 13px; color: var(--gray-medium); margin-bottom: 16px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1;">
                ${b.summary}
              </p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--gray-light); padding-top: 12px; margin-top: auto;">
                <span style="font-size: 12px; color: var(--gray-medium); font-weight: 600;">👤 ${b.author.split(" (")[0]}</span>
                <span style="font-size: 12px; color: var(--saffron-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">Read Post <span style="font-size: 14px;">→</span></span>
              </div>
            </div>
          </div>
        `;
      });

      gridContainer.innerHTML = gridHtml;

      // Re-bind click event to newly created cards
      gridContainer.querySelectorAll(".blog-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = card.getAttribute("data-id");
          window.location.hash = `#blog-detail/${id}`;
        });
      });
    };

    // Category button click listener
    categoryButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filterBlogs();
      });
    });

    // Search input listener
    searchInput.addEventListener("input", filterBlogs);
  }

  static renderBlogDetail(id) {
    const blogs = LocalDB.getBlogs();
    const blog = blogs.find(b => b.id === id);

    if (!blog) {
      this.appRoot.innerHTML = `
        <div class="container" style="padding: 80px 20px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 20px;">⚠️</div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--charcoal); margin-bottom: 8px;">Insight Article Not Found</h2>
          <p style="color: var(--gray-medium); margin-bottom: 24px;">The article you are looking for might have been archived or removed by system moderators.</p>
          <a href="#blog" class="btn btn-primary">Return to Blog Index</a>
        </div>
      `;
      return;
    }

    const paragraphHtml = blog.content.split("\n").map(para => {
      const trimmed = para.trim();
      if (trimmed.startsWith("[media:") && trimmed.endsWith("]")) {
        const mediaSource = trimmed.slice(7, -1).trim();
        return `
          <div style="text-align: center; margin: 30px 0; background: var(--gray-light); border-radius: var(--radius-md); border: 1px solid var(--gray-border); overflow: hidden; max-height: 500px; box-shadow: var(--shadow-sm);">
            <img src="${mediaSource}" style="width: 100%; height: auto; max-height: 500px; object-fit: contain; display: block; margin: 0 auto;">
          </div>
        `;
      } else if (trimmed.startsWith("![") && trimmed.includes("](") && trimmed.endsWith(")")) {
        const capStart = trimmed.indexOf("![") + 2;
        const capEnd = trimmed.indexOf("](");
        const urlStart = capEnd + 2;
        const urlEnd = trimmed.lastIndexOf(")");
        const caption = trimmed.slice(capStart, capEnd);
        const mediaSource = trimmed.slice(urlStart, urlEnd);
        const cleanCaption = caption === "Inserted Image" ? "" : caption;
        return `
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: var(--gray-light); border-radius: var(--radius-md); border: 1px solid var(--gray-border); overflow: hidden; max-height: 500px; display: inline-block; width: 100%; box-shadow: var(--shadow-sm);">
              <img src="${mediaSource}" alt="${cleanCaption}" style="width: 100%; height: auto; max-height: 500px; object-fit: contain; display: block; margin: 0 auto;">
            </div>
            ${cleanCaption ? `<span style="display: block; font-size: 12.5px; color: var(--gray-medium); margin-top: 8px; font-style: italic; font-weight: 500;">📷 ${cleanCaption}</span>` : ''}
          </div>
        `;
      } else if (trimmed === "") {
        return "";
      } else {
        return `
          <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.8; color: var(--charcoal); font-family: var(--font-body);">
            ${para}
          </p>
        `;
      }
    }).join("");

    this.appRoot.innerHTML = `
      <section style="padding: 40px 0; background: var(--bg-light); min-height: 80vh;">
        <div class="container" style="max-width: 800px;">
          <!-- Back Nav Link -->
          <a href="#blog" style="color: var(--saffron-primary); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 30px; font-size: 14px; transition: var(--transition-smooth);">
            <span style="font-size: 18px;">←</span> Back to insights
          </a>

          <!-- Main Article Container -->
          <article style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--gray-border); padding: 40px; box-shadow: var(--shadow-premium);">
            <!-- Category & Read Time -->
            <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
              <span class="status-pill" style="background: var(--saffron-light); color: var(--saffron-hover); font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 20px;">
                ${blog.category}
              </span>
              <span style="color: var(--gray-medium); font-size: 13px; font-weight: 500;">⏱️ ${blog.readTime}</span>
              <span style="color: var(--gray-medium); font-size: 13px; font-weight: 500;">📅 Published: ${blog.date}</span>
            </div>

            <!-- Big Premium Title -->
            <h1 style="font-size: 32px; font-weight: 800; color: var(--charcoal); margin-bottom: 24px; line-height: 1.35; font-family: var(--font-heading);">
              ${blog.title}
            </h1>

            <!-- Author & Verified Bio -->
            <div style="display: flex; align-items: center; gap: 12px; padding: 20px 0; border-top: 1px solid var(--gray-light); border-bottom: 1px solid var(--gray-light); margin-bottom: 30px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--saffron-primary); color: white; font-weight: 700; display: flex; justify-content: center; align-items: center; font-size: 18px; text-transform: uppercase;">
                ${blog.author.charAt(0)}
              </div>
              <div>
                <div style="font-weight: 700; color: var(--charcoal); font-size: 14.5px;">${blog.author}</div>
                <div style="font-size: 12px; color: var(--forest-secondary); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                  🛡️ Verified TradeVithika Agritech Advisor
                </div>
              </div>
            </div>

            <!-- Visual Icon -->
            <div style="text-align: center; margin-bottom: 35px; background: var(--gray-light); border-radius: var(--radius-md); border: 1px solid var(--gray-border); overflow: hidden; display: flex; justify-content: center; align-items: center; min-height: 200px; max-height: 400px; padding: 0;">
              ${blog.image && (blog.image.startsWith("data:") || blog.image.startsWith("http") || blog.image.length > 4) ? 
                `<img src="${blog.image}" style="width: 100%; height: 100%; max-height: 400px; object-fit: cover;">` : 
                `<span style="font-size: 75px; padding: 30px;">${blog.image || '🌱'}</span>`
              }
            </div>

            <!-- Full Article Content -->
            <div style="font-family: var(--font-body); margin-bottom: 40px;">
              ${paragraphHtml}
            </div>

            <!-- Footer Notes -->
            <div style="border-top: 1px solid var(--gray-light); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
              <span style="font-size: 13px; color: var(--gray-medium);">Share this article: <span style="cursor: pointer; color: var(--saffron-primary); font-weight: 600; margin-left: 8px;">🔗 Copy Link</span></span>
              <a href="#blog" style="color: var(--saffron-primary); font-weight: 700; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 4px;">Return to insights <span style="font-size: 16px;">→</span></a>
            </div>
          </article>
        </div>
      </section>
    `;
  }

  // --- ADMINISTRATOR AGRI-TECH BLOG MANAGEMENT WORKSPACE ---

  static renderAdminBlogs(workspace) {
    const blogs = LocalDB.getBlogs();

    let tableRows = "";
    blogs.forEach(b => {
      const isImageSrc = b.image && (b.image.startsWith("data:") || b.image.startsWith("http") || b.image.length > 4);
      const tableVisual = isImageSrc ? 
        `<img src="${b.image}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px;">` : 
        `<span style="font-size: 20px; font-weight: 700;">${b.image || '🌱'}</span>`;

      tableRows += `
        <tr style="border-bottom: 1px solid var(--gray-border);" data-id="${b.id}">
          <td style="padding: 12px 16px; font-weight: 700; font-size: 20px; text-align: center; width: 60px; color: var(--charcoal); background: var(--gray-light); border-radius: 8px; overflow: hidden;">
            ${tableVisual}
          </td>
          <td style="padding: 16px;">
            <div style="font-weight: 600; font-size: 13.5px; color: var(--charcoal); line-height: 1.4; max-width: 350px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.title}">${b.title}</div>
            <div style="font-size: 11px; color: var(--gray-medium); margin-top: 4px;">👤 ${b.author}</div>
          </td>
          <td style="padding: 16px;">
            <span class="status-pill" style="background: var(--saffron-light); color: var(--saffron-hover); font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 12px;">
              ${b.category}
            </span>
          </td>
          <td style="padding: 16px; font-size: 12.5px; color: var(--gray-medium); font-weight: 500;">
            ${b.date}
          </td>
          <td style="padding: 16px; font-size: 12.5px; color: var(--gray-medium); font-weight: 500;">
            ${b.readTime}
          </td>
          <td style="padding: 16px; text-align: right;">
            <button class="btn btn-outline btn-sm admin-blog-edit-btn" data-id="${b.id}" style="padding: 4px 8px; font-size: 12px; margin-right: 6px; cursor: pointer; border-radius: 4px; border-color: var(--saffron-primary); color: var(--saffron-primary);">✏️ Edit</button>
            <button class="btn btn-sm admin-blog-delete-btn" data-id="${b.id}" style="padding: 4px 8px; font-size: 12px; cursor: pointer; border-radius: 4px; background: #FF4D4D; color: white; border: none;">🗑️ Delete</button>
          </td>
        </tr>
      `;
    });

    workspace.innerHTML = `
      <!-- View 1: Publications List (Full Width) -->
      <div id="admin-blog-list-view" class="dashboard-card" style="padding: 0; overflow: hidden; border: 1px solid var(--gray-border); background: white; border-radius: var(--radius-md);">
        <div style="padding: 20px 24px; border-bottom: 1px solid var(--gray-border); display: flex; justify-content: space-between; align-items: center; background: white;">
          <div>
            <h4 style="font-size: 16px; font-weight: 700; margin: 0; color: var(--charcoal);">Active Agritech Insights & Publications</h4>
            <span style="font-size: 12.5px; color: var(--gray-medium); font-weight: 600; margin-top: 4px; display: inline-block;">${blogs.length} Articles Posted</span>
          </div>
          <button id="admin-blog-create-trigger" class="btn btn-primary btn-sm" style="padding: 8px 16px; font-size: 13px; font-weight: 700; cursor: pointer; border-radius: 6px;">➕ Create New Blog</button>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--gray-light); border-bottom: 1px solid var(--gray-border); color: var(--gray-medium); font-size: 11px; text-transform: uppercase; font-weight: 700;">
                <th style="padding: 12px 16px; width: 80px; text-align: center;">Icon</th>
                <th style="padding: 12px 16px;">Title & Author</th>
                <th style="padding: 12px 16px;">Category</th>
                <th style="padding: 12px 16px;">Published</th>
                <th style="padding: 12px 16px;">Read Time</th>
                <th style="padding: 12px 16px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || `<tr><td colspan="6" style="padding: 40px; text-align: center; color: var(--gray-medium);">No blogs published yet. Click 'Create New Blog' to write your first post!</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <!-- View 2: Form Panel (Full Width, Hidden by Default) -->
      <div id="admin-blog-form-view" class="dashboard-card" style="display: none; padding: 30px; border: 1px solid var(--gray-border); background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); max-width: 800px; margin: 0 auto;">
        <button type="button" id="admin-blog-back-btn" style="background: none; border: none; color: var(--saffron-primary); font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; margin-bottom: 20px; padding: 0; transition: var(--transition-smooth);">
          ← Back to publications list
        </button>
        
        <h4 id="admin-blog-form-title" style="font-size: 18px; font-weight: 700; margin-bottom: 20px; color: var(--charcoal); display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--gray-light); padding-bottom: 12px;">
          📝 Publish New Agricultural Post
        </h4>
        
        <form id="admin-blog-form" style="display: flex; flex-direction: column; gap: 16px;">
          <input type="hidden" id="admin-blog-id" value="">
          
          <div>
            <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px;">Article Title</label>
            <input type="text" id="admin-blog-title" placeholder="e.g. Garlic Harvesting and Sorting Guide" required style="width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body);">
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px;">Category</label>
              <select id="admin-blog-category" required style="width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body); background: white; height: 44px;">
                <option value="Crop Cultivation">Crop Cultivation 🌱</option>
                <option value="Market Insights">Market Insights 🌾</option>
                <option value="Policy Upgrades">Policy Upgrades 🤝</option>
                <option value="Agri-Tech">Agri-Tech ⚡</option>
              </select>
            </div>
            
            <div style="flex: 1; min-width: 200px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px;">Visual Cover / Emoji</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="file" id="admin-blog-media-file" accept="image/*" style="display: none;">
                <button type="button" id="admin-blog-media-trigger" class="btn btn-outline" style="padding: 8px 12px; font-size: 12.5px; font-weight: 600; border-radius: 6px; cursor: pointer; border-color: var(--gray-border); color: var(--charcoal); background: white; height: 44px; display: inline-flex; align-items: center; gap: 4px;">
                  🖼️ Upload Media
                </button>
                <input type="text" id="admin-blog-image" placeholder="🌱" required value="🌱" style="flex: 1; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body); text-align: center; height: 44px;">
              </div>
              <!-- Tiny thumbnail preview pane -->
              <div id="admin-blog-media-preview-container" style="display: none; margin-top: 8px; width: 60px; height: 60px; border-radius: 6px; border: 1px solid var(--gray-border); overflow: hidden; background: var(--gray-light); justify-content: center; align-items: center;">
                <img id="admin-blog-media-preview" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px;">Author Designation</label>
              <input type="text" id="admin-blog-author" placeholder="e.g. Dr. Ramesh Kumar" required value="TradeVithika Admin Operations" style="width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body);">
            </div>
            <div style="flex: 1; min-width: 200px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px;">Read Time</label>
              <input type="text" id="admin-blog-readtime" placeholder="e.g. 4 min read" required value="4 min read" style="width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body);">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin-bottom: 6px;">Short Summary</label>
            <textarea id="admin-blog-summary" placeholder="Provide a brief summary of the article contents for the preview grid..." required style="width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body); resize: vertical; min-height: 70px; line-height: 1.4;"></textarea>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <label style="display: block; font-size: 12.5px; font-weight: 600; color: var(--charcoal); margin: 0;">Full Article Content</label>
              <div>
                <input type="file" id="admin-blog-body-media-file" accept="image/*" style="display: none;">
                <button type="button" id="admin-blog-body-media-trigger" style="background: none; border: none; color: var(--saffron-primary); font-weight: 700; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; padding: 0; transition: var(--transition-smooth); font-family: var(--font-body);">
                  🖼️ Insert Image inside Article Body
                </button>
              </div>
            </div>
            <textarea id="admin-blog-content" placeholder="Write the main article details here. Press enter for paragraph breaks..." required style="width: 100%; padding: 12px 14px; border-radius: 6px; border: 1px solid var(--gray-border); font-size: 13.5px; font-family: var(--font-body); resize: vertical; min-height: 180px; line-height: 1.5;"></textarea>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 10px;">
            <button type="submit" id="admin-blog-submit-btn" class="btn btn-primary" style="flex: 1.5; padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer; border-radius: 6px;">Publish Article</button>
            <button type="button" id="admin-blog-cancel-btn" class="btn btn-outline" style="flex: 1; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 6px; border-color: var(--gray-border); color: var(--gray-medium);">Cancel</button>
          </div>
        </form>
      </div>
    `;

    this.bindAdminBlogsEvents();
  }

  static bindAdminBlogsEvents() {
    const form = document.getElementById("admin-blog-form");
    const submitBtn = document.getElementById("admin-blog-submit-btn");
    const cancelBtn = document.getElementById("admin-blog-cancel-btn");
    const backBtn = document.getElementById("admin-blog-back-btn");
    const formTitle = document.getElementById("admin-blog-form-title");
    
    const listView = document.getElementById("admin-blog-list-view");
    const formView = document.getElementById("admin-blog-form-view");
    const createTrigger = document.getElementById("admin-blog-create-trigger");

    const mediaFileInput = document.getElementById("admin-blog-media-file");
    const mediaTrigger = document.getElementById("admin-blog-media-trigger");
    const mediaPreview = document.getElementById("admin-blog-media-preview");
    const mediaPreviewContainer = document.getElementById("admin-blog-media-preview-container");
    const imageInput = document.getElementById("admin-blog-image");

    if (!form) return;

    // View toggler logic helper
    const showListView = () => {
      form.reset();
      document.getElementById("admin-blog-id").value = "";
      formTitle.innerHTML = "📝 Publish New Agricultural Post";
      submitBtn.innerText = "Publish Article";
      
      if (mediaPreviewContainer) mediaPreviewContainer.style.display = "none";
      if (mediaPreview) mediaPreview.src = "";
      if (imageInput) imageInput.value = "🌱";
      
      formView.style.display = "none";
      listView.style.display = "block";
    };

    const showFormView = () => {
      listView.style.display = "none";
      formView.style.display = "block";
      formView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (createTrigger) {
      createTrigger.addEventListener("click", () => {
        showFormView();
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        showListView();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        showListView();
      });
    }

    // Media File Upload Listener
    if (mediaTrigger && mediaFileInput && imageInput && mediaPreview && mediaPreviewContainer) {
      mediaTrigger.addEventListener("click", () => {
        mediaFileInput.click();
      });

      mediaFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          imageInput.value = dataUrl;
          
          mediaPreview.src = dataUrl;
          mediaPreviewContainer.style.display = "flex";
        };
        reader.readAsDataURL(file);
      });

      // Synchronize thumbnail preview dynamically if the user types or pastes an image URL/emoji manually
      imageInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        const isImageSrc = val && (val.startsWith("data:") || val.startsWith("http") || val.length > 4);
        if (isImageSrc) {
          mediaPreview.src = val;
          mediaPreviewContainer.style.display = "flex";
        } else {
          mediaPreviewContainer.style.display = "none";
          mediaPreview.src = "";
        }
      });
    }

    // Body Media File Upload Listener
    const bodyFileInput = document.getElementById("admin-blog-body-media-file");
    const bodyFileTrigger = document.getElementById("admin-blog-body-media-trigger");
    const contentTextarea = document.getElementById("admin-blog-content");

    if (bodyFileTrigger && bodyFileInput && contentTextarea) {
      bodyFileTrigger.addEventListener("click", () => {
        bodyFileInput.click();
      });

      bodyFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          
          // Insert markdown image tag at cursor position
          const startPos = contentTextarea.selectionStart;
          const endPos = contentTextarea.selectionEnd;
          const text = contentTextarea.value;
          
          const insertText = `\n![Inserted Image](${dataUrl})\n`;
          contentTextarea.value = text.substring(0, startPos) + insertText + text.substring(endPos);
          
          // Set cursor focus and position to right after the inserted text
          contentTextarea.focus();
          const newCursorPos = startPos + insertText.length;
          contentTextarea.setSelectionRange(newCursorPos, newCursorPos);
          
          // Trigger input event to make sure any validation or autosave works
          contentTextarea.dispatchEvent(new Event('input'));
          
          // Reset file input so same file can be selected again
          bodyFileInput.value = "";
          
          if (typeof App.showToast === 'function') {
            App.showToast("Image inserted successfully into article body!");
          } else {
            alert("Image inserted successfully into article body!");
          }
        };
        reader.readAsDataURL(file);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const idInput = document.getElementById("admin-blog-id").value;
      const title = document.getElementById("admin-blog-title").value.trim();
      const category = document.getElementById("admin-blog-category").value;
      const image = document.getElementById("admin-blog-image").value.trim();
      const author = document.getElementById("admin-blog-author").value.trim();
      const readTime = document.getElementById("admin-blog-readtime").value.trim();
      const summary = document.getElementById("admin-blog-summary").value.trim();
      const content = document.getElementById("admin-blog-content").value.trim();

      const blogs = LocalDB.getBlogs();

      if (idInput === "") {
        // Create new post
        const newPost = {
          id: "blog-" + Date.now(),
          title,
          category,
          image,
          author,
          readTime,
          summary,
          content,
          date: new Date().toISOString().split("T")[0]
        };

        blogs.unshift(newPost);
        LocalDB.saveBlogs(blogs);
        this.showToast(`Insight published: "${title}"!`);
      } else {
        // Edit existing post
        const index = blogs.findIndex(b => b.id === idInput);
        if (index !== -1) {
          blogs[index].title = title;
          blogs[index].category = category;
          blogs[index].image = image;
          blogs[index].author = author;
          blogs[index].readTime = readTime;
          blogs[index].summary = summary;
          blogs[index].content = content;
          
          LocalDB.saveBlogs(blogs);
          this.showToast(`Insight updated: "${title}"!`);
        }
      }

      // Sync & Render back to list
      const workspace = document.getElementById("admin-workspace");
      if (workspace) this.renderAdminBlogs(workspace);
    });

    // Edit action click binding
    document.querySelectorAll(".admin-blog-edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const blogs = LocalDB.getBlogs();
        const b = blogs.find(item => item.id === id);
        
        if (!b) return;

        document.getElementById("admin-blog-id").value = b.id;
        document.getElementById("admin-blog-title").value = b.title;
        document.getElementById("admin-blog-category").value = b.category;
        document.getElementById("admin-blog-image").value = b.image || "🌱";
        document.getElementById("admin-blog-author").value = b.author;
        document.getElementById("admin-blog-readtime").value = b.readTime;
        document.getElementById("admin-blog-summary").value = b.summary;
        document.getElementById("admin-blog-content").value = b.content;

        // Populate media previews if editing an image post
        if (b.image && (b.image.startsWith("data:") || b.image.startsWith("http") || b.image.length > 4)) {
          if (mediaPreview) mediaPreview.src = b.image;
          if (mediaPreviewContainer) mediaPreviewContainer.style.display = "flex";
        } else {
          if (mediaPreviewContainer) mediaPreviewContainer.style.display = "none";
          if (mediaPreview) mediaPreview.src = "";
        }

        formTitle.innerHTML = "✏️ Edit Agricultural Post";
        submitBtn.innerText = "Save Changes";
        
        showFormView();
      });
    });

    // Delete action click binding
    document.querySelectorAll(".admin-blog-delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const blogs = LocalDB.getBlogs();
        const b = blogs.find(item => item.id === id);

        if (!b) return;

        if (confirm(`Are you sure you want to permanently delete the article: "${b.title}"?`)) {
          LocalDB.deleteBlog(id);
          this.showToast(`Deleted post: "${b.title}".`);
          
          const workspace = document.getElementById("admin-workspace");
          if (workspace) this.renderAdminBlogs(workspace);
        }
      });
    });
  }

  // --- MARKETPLACE ADMINISTRATOR PANELS & LOGIC ---

  static renderAdminDashboard() {
    this.appRoot.innerHTML = `
      <div class="dashboard-wrapper">
        <aside class="dashboard-sidebar admin-sidebar">
          <div class="sidebar-profile">
            <div class="sidebar-avatar">
              A
            </div>
            <div class="sidebar-name">Admin Control</div>
            <div style="margin-top:6px;">
              <span class="status-pill status-verified" style="font-size: 11px; padding: 2px 8px; border-radius: 20px;">🛡️ Super Admin</span>
            </div>
          </div>
          
          <ul class="dashboard-menu">
            <li class="dashboard-menu-link active" data-sub="overview">⚙️ Admin Control</li>
            <li class="dashboard-menu-link" data-sub="suppliers">🚜 Verify Suppliers</li>
            <li class="dashboard-menu-link" data-sub="listings">🌾 Listings Moderator</li>
            <li class="dashboard-menu-link" data-sub="inquiries">💬 Global Inquiries</li>
            <li class="dashboard-menu-link" data-sub="blogs">📰 Manage Blogs</li>
          </ul>
        </aside>

        <!-- Main Dashboard Workspace Frame -->
        <div style="display:flex; flex-direction:column; flex-grow:1; min-height:100%;">
          <!-- Shared Header Top bar inside workspace -->
          <div class="container" style="padding-top:30px; padding-bottom:10px;">
            <div class="dash-workspace-header">
              <h2 style="font-size:24px; font-weight:800;" id="admin-workspace-title">Admin Console</h2>
            </div>
          </div>
          
          <!-- Workspace panel content area -->
          <div class="container" id="admin-workspace" style="padding-bottom:50px; flex-grow: 1;">
            <!-- Subpage content is injected here -->
          </div>
        </div>
      </div>
    `;

    this.bindAdminEvents();
    
    // Default to subpage "overview" or restore from sessionStorage
    const currentSub = sessionStorage.getItem("admin_nav_subpage") || "overview";
    this.renderAdminSubpage(currentSub);
  }

  static bindAdminEvents() {
    document.querySelectorAll(".admin-sidebar .dashboard-menu-link").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".admin-sidebar .dashboard-menu-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        
        const sub = link.getAttribute("data-sub");
        sessionStorage.setItem("admin_nav_subpage", sub);
        
        // Sync active state on navbar links if they exist
        document.querySelectorAll(".nav-admin-sub-trigger").forEach(t => {
          t.classList.toggle("active", t.getAttribute("data-sub") === sub);
        });

        this.renderAdminSubpage(sub);
      });
    });
  }

  static renderAdminSubpage(subpage) {
    const workspace = document.getElementById("admin-workspace");
    const headerTitle = document.getElementById("admin-workspace-title");
    if (!workspace) return;

    // Synchronize sidebar active tab state
    document.querySelectorAll(".admin-sidebar .dashboard-menu-link").forEach(l => {
      l.classList.toggle("active", l.getAttribute("data-sub") === subpage);
    });

    switch (subpage) {
      case "overview":
        headerTitle.innerText = "Admin Control Panel";
        this.renderAdminOverview(workspace);
        break;
      case "suppliers":
        headerTitle.innerText = "Verify Registered Suppliers";
        this.renderAdminSuppliers(workspace);
        break;
      case "listings":
        headerTitle.innerText = "Global Listings Moderator";
        this.renderAdminListings(workspace);
        break;
      case "inquiries":
        headerTitle.innerText = "Global Marketplace Inquiries";
        this.renderAdminInquiries(workspace);
        break;
      case "blogs":
        headerTitle.innerText = "Manage Agricultural Blogs";
        this.renderAdminBlogs(workspace);
        break;
    }
  }

  static renderAdminOverview(workspace) {
    const buyers = LocalDB.getBuyers();
    const suppliers = LocalDB.getSuppliers();
    const listings = LocalDB.getListings();
    const pendingSuppliers = suppliers.filter(s => s.verified === 'pending' || s.verified === 'unverified');

    workspace.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
        <h3 style="font-size: 20px; font-weight:700;">Marketplace Overview 📊</h3>
        <span style="font-size: 13px; color: var(--gray-medium);">Live Database Status: Stable</span>
      </div>

      <!-- Quick Stats -->
      <div class="dashboard-stats-grid">
        <div class="dash-stat-card admin-deck-card">
          <div class="stat-label">Total Registered Buyers</div>
          <div class="stat-value">${buyers.length}</div>
          <div class="stat-subtext" style="color: var(--forest-secondary);">👥 Active Wholesale Processors</div>
        </div>
        <div class="dash-stat-card admin-deck-card">
          <div class="stat-label">Total Registered Suppliers</div>
          <div class="stat-value">${suppliers.length}</div>
          <div class="stat-subtext" style="color: var(--saffron-primary);">🚜 Farmers & Aggregators</div>
        </div>
        <div class="dash-stat-card admin-deck-card">
          <div class="stat-label">Active Crop Listings</div>
          <div class="stat-value">${listings.length}</div>
          <div class="stat-subtext" style="color: var(--forest-secondary);">🌾 Active Commodities listed</div>
        </div>
        <div class="dash-stat-card admin-deck-card alert">
          <div class="stat-label">Pending Verifications</div>
          <div class="stat-value">${pendingSuppliers.length}</div>
          <div class="stat-subtext" style="color: var(--gold-accent);">⏳ Onboarding under review</div>
        </div>
      </div>

      <!-- Graphical Data -->
      <div class="dashboard-grid" style="margin-top: 24px;">
        <div class="dashboard-card" style="flex: 2; padding: 24px;">
          <h4 style="font-size: 16px; font-weight:700; margin-bottom: 16px;">Platform Trade & Inquiry Growth</h4>
          <div style="height: 300px; position: relative;">
            <canvas id="admin-growth-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-card" style="flex: 1; padding: 24px;">
          <h4 style="font-size: 16px; font-weight:700; margin-bottom: 16px;">Recent Audits & Logs</h4>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 1.8;">
            <li style="border-bottom: 1px solid var(--gray-border); padding: 8px 0; display:flex; justify-content:space-between;">
              <span>System initialized</span>
              <span style="color:var(--gray-medium);">Today</span>
            </li>
            <li style="border-bottom: 1px solid var(--gray-border); padding: 8px 0; display:flex; justify-content:space-between;">
              <span>Cache synchronized</span>
              <span style="color:var(--gray-medium);">Today</span>
            </li>
            <li style="border-bottom: 1px solid var(--gray-border); padding: 8px 0; display:flex; justify-content:space-between;">
              <span>Database seed validation</span>
              <span style="color:var(--gray-medium);">Yesterday</span>
            </li>
            <li style="border-bottom: 1px solid var(--gray-border); padding: 8px 0; display:flex; justify-content:space-between;">
              <span>Backup complete</span>
              <span style="color:var(--gray-medium);">Yesterday</span>
            </li>
          </ul>
        </div>
      </div>
    `;

    // Instantiate Chart.js for Admin Overview page
    const growthCtx = document.getElementById("admin-growth-chart")?.getContext("2d");
    if (growthCtx && window.Chart) {
      new Chart(growthCtx, {
        type: 'line',
        data: {
          labels: ["May 22", "May 23", "May 24", "May 25", "May 26", "May 27", "May 28"],
          datasets: [
            {
              label: 'Marketplace Inquiries',
              data: [15, 25, 38, 30, 48, 62, 85],
              borderColor: '#0062FF', 
              backgroundColor: 'rgba(0, 98, 255, 0.05)',
              borderWidth: 3,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Successful Deals',
              data: [8, 12, 20, 18, 28, 35, 52],
              borderColor: '#00B562', 
              backgroundColor: 'rgba(0, 181, 98, 0.05)',
              borderWidth: 3,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', weight: '600' } } }
          },
          scales: {
            y: { grid: { color: '#F0F0EC' }, ticks: { font: { family: 'Inter' } } },
            x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } }
          }
        }
      });
    }
  }

  static renderAdminSuppliers(workspace) {
    const suppliers = LocalDB.getSuppliers();

    let tableRows = "";
    suppliers.forEach(s => {
      const docsList = [];
      if (s.docsUploaded.aadhaar) docsList.push("Aadhaar");
      if (s.docsUploaded.gst) docsList.push("GST");
      if (s.docsUploaded.fssai) docsList.push("FSSAI");
      if (s.docsUploaded.land) docsList.push("Land");
      const docsHtml = docsList.length > 0 
        ? docsList.map(d => `<span style="font-size:11px; background:var(--gray-light); padding:2px 6px; border-radius:4px; margin-right:4px;">${d}</span>`).join('')
        : `<span style="color:var(--gray-medium); font-size:11px;">None Uploaded</span>`;

      const statusClass = s.verified === "verified" ? "status-verified" : s.verified === "pending" ? "status-pending" : "status-unverified";
      const statusText = s.verified === "verified" ? "✓ Verified" : s.verified === "pending" ? "⏳ Pending" : "Unverified";

      let actionHtml = "";
      if (s.verified === "verified") {
        actionHtml = `<button class="btn btn-text admin-action-suspend" data-id="${s.id}">🚫 Suspend</button>`;
      } else {
        actionHtml = `<button class="btn btn-text admin-action-approve" data-id="${s.id}">✅ Approve</button>`;
      }

      tableRows += `
        <tr style="border-bottom:1px solid var(--gray-border);">
          <td style="padding:16px; font-weight:600;">
            <div style="font-size:14px; color:var(--dark);">${s.name}</div>
            <div style="font-size:12px; color:var(--gray-medium); font-weight:normal;">Contact: ${s.contactPerson} (${s.phone})</div>
          </td>
          <td style="padding:16px; font-size:13.5px;">${s.district}</td>
          <td style="padding:16px; font-size:13.5px;"><span style="background:#E3F2FD; color:#0D47A1; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;">${s.businessType}</span></td>
          <td style="padding:16px;">${docsHtml}</td>
          <td style="padding:16px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="width:60px; background:#e0e0e0; height:6px; border-radius:3px; overflow:hidden;">
                <div style="width:${s.onboardingProgress}%; background:var(--forest-secondary); height:100%;"></div>
              </div>
              <span style="font-size:12px; font-weight:700;">${s.onboardingProgress}%</span>
            </div>
          </td>
          <td style="padding:16px;">
            <span class="status-pill ${statusClass}" style="font-size:11.5px; padding:4px 10px; border-radius:20px; font-weight:700;">${statusText}</span>
          </td>
          <td style="padding:16px; text-align:right;">
            ${actionHtml}
          </td>
        </tr>
      `;
    });

    workspace.innerHTML = `
      <div class="dashboard-card" style="padding:0; overflow:hidden;">
        <div style="padding:20px 24px; border-bottom:1px solid var(--gray-border); display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:16px; font-weight:700; margin:0;">Supplier Directory & Onboarding Records</h4>
          <span style="font-size:12.5px; color:var(--gray-medium);">${suppliers.length} Total Suppliers</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
              <tr style="background:var(--gray-light); border-bottom:1px solid var(--gray-border); color:var(--gray-medium); font-size:12px; text-transform:uppercase; font-weight:700;">
                <th style="padding:12px 16px;">Supplier Details</th>
                <th style="padding:12px 16px;">District</th>
                <th style="padding:12px 16px;">Type</th>
                <th style="padding:12px 16px;">Uploaded Documents</th>
                <th style="padding:12px 16px;">Onboarding</th>
                <th style="padding:12px 16px;">Status</th>
                <th style="padding:12px 16px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind verification actions
    workspace.querySelectorAll(".admin-action-approve").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.approveSupplierVerification(id);
      });
    });

    workspace.querySelectorAll(".admin-action-suspend").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.suspendSupplierVerification(id);
      });
    });
  }

  static approveSupplierVerification(id) {
    const suppliers = LocalDB.getSuppliers();
    const matched = suppliers.find(s => s.id === id);
    if (matched) {
      matched.verified = "verified";
      matched.onboardingProgress = 100;
      matched.docsUploaded.aadhaar = true;
      matched.docsUploaded.gst = true;
      matched.docsUploaded.fssai = true;
      matched.docsUploaded.land = true;
      LocalDB.saveSuppliers(suppliers);

      // Push notification directly to their VendorOS Notification Bell feed
      const notifications = LocalDB.getNotifications();
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      notifications.unshift({
        id: "noti-" + Date.now(),
        supplierId: matched.id,
        title: "✅ Verification Approved",
        text: "Congratulations! The TradeVithika Admin Team has reviewed your uploaded documents and officially verified your vendor profile. A verified checkmark badge has been added to your profile.",
        date: "Today, " + timeString,
        read: false
      });
      LocalDB.saveNotifications(notifications);

      this.showToast(`Supplier "${matched.name}" officially verified! Notification pushed to VendorOS.`);
      const workspace = document.getElementById("admin-workspace");
      if (workspace) this.renderAdminSuppliers(workspace);
    }
  }

  static suspendSupplierVerification(id) {
    const suppliers = LocalDB.getSuppliers();
    const matched = suppliers.find(s => s.id === id);
    if (matched) {
      matched.verified = "unverified";
      matched.onboardingProgress = 50;
      matched.docsUploaded.fssai = false;
      matched.docsUploaded.land = false;
      LocalDB.saveSuppliers(suppliers);

      // Push warning notification to VendorOS feed
      const notifications = LocalDB.getNotifications();
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      notifications.unshift({
        id: "noti-" + Date.now(),
        supplierId: matched.id,
        title: "⚠️ Account Verification Suspended",
        text: "Your verification status has been suspended by the Admin Team. Please review your uploaded business licenses and re-submit for audit.",
        date: "Today, " + timeString,
        read: false
      });
      LocalDB.saveNotifications(notifications);

      this.showToast(`Supplier "${matched.name}" has been suspended. Warning pushed to VendorOS.`, true);
      const workspace = document.getElementById("admin-workspace");
      if (workspace) this.renderAdminSuppliers(workspace);
    }
  }

  static renderAdminListings(workspace) {
    const listings = LocalDB.getListings();
    const suppliers = LocalDB.getSuppliers();

    let tableRows = "";
    listings.forEach(l => {
      const supplier = suppliers.find(s => s.id === l.supplierId) || { name: "Unknown Supplier" };
      const statusClass = l.status === "active" ? "status-verified" : "status-unverified";
      const statusText = l.status === "active" ? "Active" : "Paused";

      const toggleActionText = l.status === "active" ? "⏸️ Pause" : "▶️ Activate";
      const toggleActionClass = l.status === "active" ? "admin-action-suspend" : "admin-action-approve";

      tableRows += `
        <tr style="border-bottom:1px solid var(--gray-border);">
          <td style="padding:16px;">
            <div style="font-weight:600; color:var(--dark); font-size:14px;">${l.title}</div>
            <div style="font-size:12px; color:var(--gray-medium);">Variety: ${l.variety}</div>
          </td>
          <td style="padding:16px; font-size:13.5px;">${l.commodity}</td>
          <td style="padding:16px; font-size:13.5px; font-weight:600; color:var(--saffron-primary);">${supplier.name}</td>
          <td style="padding:16px; font-size:13.5px; font-weight:700;">₹${l.price.toLocaleString()}/q</td>
          <td style="padding:16px; font-size:13.5px;">${l.quantity} quintals</td>
          <td style="padding:16px; font-size:13.5px;">${l.district}</td>
          <td style="padding:16px;">
            <span class="status-pill ${statusClass}" style="font-size:11px; padding:3px 8px; border-radius:12px; font-weight:700;">${statusText}</span>
          </td>
          <td style="padding:16px; text-align:right; white-space:nowrap;">
            <button class="btn btn-text ${toggleActionClass}" data-id="${l.id}" style="margin-right:8px;">${toggleActionText}</button>
            <button class="btn btn-text admin-action-suspend delete-listing-btn" data-id="${l.id}">🗑️ Delete</button>
          </td>
        </tr>
      `;
    });

    workspace.innerHTML = `
      <div class="dashboard-card" style="padding:0; overflow:hidden;">
        <div style="padding:20px 24px; border-bottom:1px solid var(--gray-border); display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:16px; font-weight:700; margin:0;">Global Commodity Catalog Moderator</h4>
          <span style="font-size:12.5px; color:var(--gray-medium);">${listings.length} Active Listings</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
              <tr style="background:var(--gray-light); border-bottom:1px solid var(--gray-border); color:var(--gray-medium); font-size:12px; text-transform:uppercase; font-weight:700;">
                <th style="padding:12px 16px;">Crop Title</th>
                <th style="padding:12px 16px;">Commodity</th>
                <th style="padding:12px 16px;">Supplier</th>
                <th style="padding:12px 16px;">Price</th>
                <th style="padding:12px 16px;">Stock</th>
                <th style="padding:12px 16px;">District</th>
                <th style="padding:12px 16px;">Status</th>
                <th style="padding:12px 16px; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind action events
    workspace.querySelectorAll(".admin-action-approve, .admin-action-suspend").forEach(btn => {
      if (btn.classList.contains("delete-listing-btn")) return; 
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.toggleListingStatus(id);
      });
    });

    workspace.querySelectorAll(".delete-listing-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("Are you sure you want to permanently delete this listing? This action cannot be undone.")) {
          this.deleteListingGlobally(id);
        }
      });
    });
  }

  static toggleListingStatus(id) {
    const listings = LocalDB.getListings();
    const matched = listings.find(l => l.id === id);
    if (matched) {
      matched.status = matched.status === "active" ? "paused" : "active";
      LocalDB.saveListings(listings);
      this.showToast(`Listing "${matched.title}" successfully ${matched.status === 'active' ? 'activated' : 'paused'}!`);
      const workspace = document.getElementById("admin-workspace");
      if (workspace) this.renderAdminListings(workspace);
    }
  }

  static deleteListingGlobally(id) {
    let listings = LocalDB.getListings();
    const matched = listings.find(l => l.id === id);
    if (matched) {
      listings = listings.filter(l => l.id !== id);
      LocalDB.saveListings(listings);
      this.showToast(`Listing "${matched.title}" permanently deleted.`);
      const workspace = document.getElementById("admin-workspace");
      if (workspace) this.renderAdminListings(workspace);
    }
  }

  static renderAdminInquiries(workspace) {
    const inquiries = LocalDB.getInquiries();
    const suppliers = LocalDB.getSuppliers();
    const listings = LocalDB.getListings();

    let tableRows = "";
    inquiries.forEach(i => {
      const supplier = suppliers.find(s => s.id === i.supplierId) || { name: "Unknown Supplier" };
      const listing = listings.find(l => l.id === i.listingId) || { title: "Deleted Listing" };
      const statusClass = i.status === "new" ? "status-pending" : "status-verified";
      const statusText = i.status === "new" ? "New Query" : "Responded";

      tableRows += `
        <tr style="border-bottom:1px solid var(--gray-border);">
          <td style="padding:16px; font-size:13px; color:var(--gray-medium);">${i.date}</td>
          <td style="padding:16px; max-width: 300px;">
            <div style="font-weight:600; font-size:13.5px; color:var(--dark);">${listing.title}</div>
            <div style="font-size:12.5px; color:var(--gray-medium); margin-top:4px; font-style:italic;">"${i.message}"</div>
          </td>
          <td style="padding:16px;">
            <div style="font-weight:600; font-size:13.5px; color:var(--dark);">${i.buyerName}</div>
            <div style="font-size:12px; color:var(--gray-medium);">${i.companyName}</div>
          </td>
          <td style="padding:16px; font-weight:600; font-size:13.5px; color:var(--saffron-primary);">${supplier.name}</td>
          <td style="padding:16px; font-size:13.5px; font-weight:700;">${i.quantity} quintals</td>
          <td style="padding:16px;">
            <span class="status-pill ${statusClass}" style="font-size:11px; padding:3px 8px; border-radius:12px; font-weight:700;">${statusText}</span>
          </td>
        </tr>
      `;
    });

    workspace.innerHTML = `
      <div class="dashboard-card" style="padding:0; overflow:hidden;">
        <div style="padding:20px 24px; border-bottom:1px solid var(--gray-border); display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:16px; font-weight:700; margin:0;">Global Buyer-Supplier Negotiation Logs</h4>
          <span style="font-size:12.5px; color:var(--gray-medium);">${inquiries.length} Conversations Active</span>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
              <tr style="background:var(--gray-light); border-bottom:1px solid var(--gray-border); color:var(--gray-medium); font-size:12px; text-transform:uppercase; font-weight:700;">
                <th style="padding:12px 16px;">Date</th>
                <th style="padding:12px 16px;">Inquiry & Commodity</th>
                <th style="padding:12px 16px;">Buyer</th>
                <th style="padding:12px 16px;">Supplier Partner</th>
                <th style="padding:12px 16px;">Req. Quantity</th>
                <th style="padding:12px 16px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

// Initialise App once DOM content is loaded
window.addEventListener("DOMContentLoaded", () => {
  App.init();
});
