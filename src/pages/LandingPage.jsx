import PageTitle from "../components/PageTitle";

export default function LandingPage() {
    return (
        <>
        <PageTitle
            title="Management Capstone"
            description="Welcome to the Management Capstone project. This is a platform designed to help you manage your projects effectively."
        />
        <div className="flex flex-col items-center justify-center h-screen bg-primary text-white">
            <h1 className="text-4xl font-black">Welcome to Management Capstone </h1>
            <h2 className="text-2xl font-semibold">Welcome to the Management Capstone project. This is a platform designed to help you manage your projects effectively.</h2>
        </div>
        </>
    )   
}