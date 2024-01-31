import InputForm from '/components/InputForm.tsx';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    const handleUrlSubmit = (url) => {
        router.push(`/results?url=${encodeURIComponent(url)}`);
    };

    return (
        <div className="container mx-auto p-4">
            <InputForm onSubmitUrl={handleUrlSubmit} />
        </div>
    );
}
