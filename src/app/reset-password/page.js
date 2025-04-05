import ResetPasswordForm from "./ResetPasswordForm";
import HeaderSection from "../(header)/HeaderSection";
 
export default function ResetPasswordPage({ searchParams }) {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <HeaderSection />
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <ResetPasswordForm searchParams={searchParams} />
      </div>
    </main>
  );
}
