import SignupForm from "./SignupForm";

export default function SignupPage({ searchParams }) {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-rose-50 to-white">
      <SignupForm searchParams={searchParams} />
    </div>
  );
}