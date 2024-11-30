export default function TopBar() {
  return (
    <div className="bg-gray-100 text-sm hidden sm:block">
      <div className="max-w-8xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <p className="text-gray-700">
            Free shipping on orders over ₹999 | Easy returns
          </p>
          <div className="flex items-center gap-4 text-gray-600">
            <a href="tel:+919876543210" className="hover:text-gray-900">
              Customer Care: +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
