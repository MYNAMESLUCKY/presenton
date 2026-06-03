import AuthGate from "@/components/Auth/AuthGate";

export const dynamic = "force-dynamic";

const page = () => {
    return <AuthGate />;
};

export default page;