export default function OrderDetailsLayout({ children, modal }) {
  return (
    <div className="relative">
      {children}
      {modal}
    </div>
  );
}
