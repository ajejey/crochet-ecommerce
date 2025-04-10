import { SuspendedPostHogPageView } from "@/components/PostHogProvider";

export default function SellersLayout({ children }) {
  return <div>
    <SuspendedPostHogPageView />
    {children}
  </div>;
}
