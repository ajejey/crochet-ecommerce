import SignupForm from "./SignupForm";
import HeaderSection from "../(header)/HeaderSection";

export default function SignupPage({ searchParams }) {
  return (
    <main className="flex items-center justify-center h-screen">
      <HeaderSection />
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <SignupForm searchParams={searchParams} />
      </div>
    </main>
  );
}