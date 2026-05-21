export const adminOverviewItems = [
  { label: "Total Revenue", value: "$42,860", change: "+8.2% from last month" },
  { label: "Orders", value: "1,284", change: "+5.1% from last month" },
  { label: "New Customers", value: "326", change: "+12.4% from last month" },
  { label: "Refund Requests", value: "18", change: "-2.3% from last month" },
]

export const adminRecentOrders = [
  { id: "#MS-2101", customer: "Ariana Patel", amount: "$148.00", status: "Paid" },
  { id: "#MS-2102", customer: "Tanvir Hasan", amount: "$92.50", status: "Pending" },
  { id: "#MS-2103", customer: "Nadia Akter", amount: "$215.20", status: "Shipped" },
  { id: "#MS-2104", customer: "Rahim Uddin", amount: "$58.40", status: "Paid" },
] as const

export const adminDashboardKpis = [
  { title: "Gross Sales", value: "$18,420", note: "This week +4.8%" },
  { title: "Net Profit", value: "$6,930", note: "This week +2.1%" },
  { title: "Conversion Rate", value: "3.9%", note: "This week +0.4%" },
  { title: "Average Order", value: "$74.20", note: "This week +1.3%" },
]

export const adminDashboardSalesRows = [
  { product: "Cotton Hoodie", category: "Fashion", sold: 152, revenue: "$3,648" },
  { product: "Desk Lamp Pro", category: "Home", sold: 118, revenue: "$2,714" },
  { product: "Wireless Earbuds", category: "Electronics", sold: 96, revenue: "$4,320" },
  { product: "Running Shoes", category: "Sports", sold: 84, revenue: "$5,040" },
]

export const adminCouponRows = [
  {
    code: "NEW10",
    type: "Percent",
    value: "10%",
    usage: "128 uses",
    status: "Active",
  },
  {
    code: "FLASH200",
    type: "Flat",
    value: "$200",
    usage: "42 uses",
    status: "Scheduled",
  },
  {
    code: "FREESHIP",
    type: "Shipping",
    value: "Free Delivery",
    usage: "310 uses",
    status: "Active",
  },
]

export const adminUserRows = [
  { name: "Ariana Patel", email: "ariana@example.com", role: "Customer", status: "Active" },
  { name: "Tanvir Hasan", email: "tanvir@example.com", role: "Customer", status: "Blocked" },
  { name: "Mita Roy", email: "mita@example.com", role: "Manager", status: "Active" },
  { name: "Rahim Uddin", email: "rahim@example.com", role: "Support", status: "Active" },
]

export type AdminOrderLine = {
  title: string
  qty: number
  unitPrice: number
}

export type AdminOrderRecord = {
  id: string
  createdAt: string
  customer: string
  customerEmail: string
  customerPhone: string
  payment: "Paid" | "Pending" | "Refunded"
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled"
  shippingAddress: string
  shippingMethod: string
  trackingId: string
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  lines: AdminOrderLine[]
}

export const adminOrderRows: AdminOrderRecord[] = [
  {
    id: "#MS-2201",
    createdAt: "2026-04-07 11:20 AM",
    customer: "Nadia Akter",
    customerEmail: "nadia@example.com",
    customerPhone: "+91 90000 10001",
    payment: "Paid",
    status: "Delivered",
    shippingAddress: "25 Lake View Road, Belgharia, Kolkata 700056",
    shippingMethod: "Shiprocket - Surface",
    trackingId: "SRK2201IND",
    subtotal: 129,
    shippingCharge: 10,
    discount: 20,
    total: 119,
    lines: [
      { title: "Wireless Earbuds", qty: 1, unitPrice: 45 },
      { title: "Fast Charger 65W", qty: 1, unitPrice: 39 },
      { title: "Phone Case Clear", qty: 1, unitPrice: 45 },
    ],
  },
  {
    id: "#MS-2202",
    createdAt: "2026-04-07 09:45 AM",
    customer: "Imran Ali",
    customerEmail: "imran@example.com",
    customerPhone: "+91 90000 10002",
    payment: "Pending",
    status: "Processing",
    shippingAddress: "48 Station Road, Dumdum, Kolkata 700028",
    shippingMethod: "Standard Courier",
    trackingId: "PENDING",
    subtotal: 54.5,
    shippingCharge: 0,
    discount: 0,
    total: 54.5,
    lines: [{ title: "Tempered Glass 2-Pack", qty: 1, unitPrice: 54.5 }],
  },
  {
    id: "#MS-2203",
    createdAt: "2026-04-06 07:18 PM",
    customer: "Sadia Noor",
    customerEmail: "sadia@example.com",
    customerPhone: "+91 90000 10003",
    payment: "Paid",
    status: "Shipped",
    shippingAddress: "12 Park Street, Kolkata 700016",
    shippingMethod: "Shiprocket - Air",
    trackingId: "SRK2203AIR",
    subtotal: 309.9,
    shippingCharge: 20,
    discount: 40,
    total: 289.9,
    lines: [
      { title: "Running Shoes", qty: 2, unitPrice: 120 },
      { title: "Sports Socks", qty: 1, unitPrice: 69.9 },
    ],
  },
  {
    id: "#MS-2204",
    createdAt: "2026-04-06 01:05 PM",
    customer: "Kamal Das",
    customerEmail: "kamal@example.com",
    customerPhone: "+91 90000 10004",
    payment: "Refunded",
    status: "Cancelled",
    shippingAddress: "9 BT Road, Baranagar, Kolkata 700035",
    shippingMethod: "Standard Courier",
    trackingId: "CANCELLED",
    subtotal: 73.25,
    shippingCharge: 0,
    discount: 0,
    total: 73.25,
    lines: [{ title: "Smart Bulb RGB", qty: 1, unitPrice: 73.25 }],
  },
]

export type AdminProductRecord = {
  name: string
  sku: string
  category: string
  brand: string
  stock: number
  mrp: number
  salePrice: number
  status: "Published" | "Draft" | "Out of stock"
  visibility: "Public" | "Hidden"
  shortDescription: string
  imageUrl: string
  tags: string[]
}

export const adminProductCategories = [
  "Mobiles",
  "Accessories",
  "Audio",
  "Wearables",
  "Smart Home",
]

export const adminProductRows: AdminProductRecord[] = [
  {
    name: "Cotton Hoodie",
    sku: "PRD-1001",
    category: "Fashion",
    brand: "Yuvraj-e-comWear",
    stock: 52,
    mrp: 32,
    salePrice: 24,
    status: "Published",
    visibility: "Public",
    shortDescription: "Cozy cotton hoodie with soft fleece inside.",
    imageUrl: "https://picsum.photos/seed/admin-hoodie/400/400",
    tags: ["winter", "hoodie"],
  },
  {
    name: "Wireless Earbuds",
    sku: "PRD-1002",
    category: "Audio",
    brand: "SoundFlow",
    stock: 18,
    mrp: 58,
    salePrice: 45,
    status: "Published",
    visibility: "Public",
    shortDescription: "Low-latency earbuds with deep bass.",
    imageUrl: "https://picsum.photos/seed/admin-earbuds/400/400",
    tags: ["tws", "bluetooth"],
  },
  {
    name: "Desk Lamp Pro",
    sku: "PRD-1003",
    category: "Smart Home",
    brand: "BrightLite",
    stock: 0,
    mrp: 31,
    salePrice: 23,
    status: "Out of stock",
    visibility: "Public",
    shortDescription: "Adjustable desk lamp with 3 light modes.",
    imageUrl: "https://picsum.photos/seed/admin-lamp/400/400",
    tags: ["lamp", "home"],
  },
]

export const adminNewProductDraft: AdminProductRecord = {
  name: "",
  sku: "",
  category: "Mobiles",
  brand: "",
  stock: 0,
  mrp: 0,
  salePrice: 0,
  status: "Draft",
  visibility: "Hidden",
  shortDescription: "",
  imageUrl: "",
  tags: [],
}

export const adminProfileData = {
  name: "Yuvraj-e-com Saha",
  role: "Store Owner",
  email: "Yuvraj-e-com@example.com",
  phone: "+91 90000 00000",
  location: "Belgharia, Kolkata",
  joined: "Jan 2024",
  bio: "Managing sales, catalog, fulfillment and customer support operations.",
}
