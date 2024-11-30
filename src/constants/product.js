export const PRODUCT_CATEGORIES = [
  {
    id: 'amigurumi',
    label: 'Amigurumi',
    description: 'Crocheted or knitted stuffed toys and creatures'
  },
  {
    id: 'blankets',
    label: 'Blankets',
    description: 'Crocheted blankets, throws, and afghans'
  },
  {
    id: 'accessories',
    label: 'Accessories',
    description: 'Scarves, hats, gloves, and other accessories'
  },
  {
    id: 'clothing',
    label: 'Clothing',
    description: 'Sweaters, shawls, and other wearable items'
  },
  {
    id: 'home',
    label: 'Home Decor',
    description: 'Pillows, rugs, and other decorative items'
  }
];

export const PRODUCT_STATUSES = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  OUT_OF_STOCK: 'outOfStock',
  DELETED: 'deleted'
};

export const getProductCategory = (categoryId) => {
  return PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
};

export const isValidCategory = (categoryId) => {
  return PRODUCT_CATEGORIES.some(cat => cat.id === categoryId);
};
