import { SuspendedPostHogPageView } from "@/components/PostHogProvider";

export default function OrderDetailsLayout({ children, modal }) {
  return (
    <div className="relative">
      <SuspendedPostHogPageView />
      {children}
      {modal}
    </div>
  );
}
