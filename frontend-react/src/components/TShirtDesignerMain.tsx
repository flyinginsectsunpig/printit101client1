import React, { useState, useEffect } from 'react';
import { Upload, Shirt, AlertCircle } from 'lucide-react';
import Auth from './Auth';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import TShirtUpload from "./TShirtUpload";
import TShirtPositioning from "./TShirtPositioning";

const TShirtDesignerMain: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'upload' | 'positioning'>('upload');
    const [user, setUser] = useState<any>(null);
    const [tshirtData, setTshirtData] = useState<any>(null);
    const [notification, setNotification] = useState<string>('');

    const API_BASE = 'http://localhost:8080';

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleAuthSuccess = (userData: any) => {
        setUser(userData);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('currentUser');
        setCurrentStep('upload');
        setTshirtData(null);
        setNotification('');
    };

    const showNotification = (message: string): void => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const safeJsonParse = async (response: Response) => {
        try {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return { success: true, message: text };
            }
            const text = await response.text();
            if (!text.trim()) return { success: true, message: 'Empty response' };
            return JSON.parse(text);
        } catch (error) {
            const text = await response.text();
            return { success: false, error: 'Invalid JSON response', rawResponse: text };
        }
    };

    const makeApiCall = async (url: string, options: RequestInit, fallbackData?: any) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await safeJsonParse(response);
        } catch (error) {
            if (fallbackData) return fallbackData;
            throw error;
        }
    };

    if (!user) {
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    const handleContinueToPositioning = (data: any) => {
        setTshirtData(data);
        setCurrentStep('positioning');
        showNotification('Proceed to position your design');
    };

    const handleBackToUpload = () => {
        setCurrentStep('upload');
        showNotification('Back to product details');
    };

    const handleSaveDesign = async (data: any) => {
        try {
            // --- upload image ---
            const formData = new FormData();
            const response = await fetch(data.tshirtData.uploadedImage);
            const blob = await response.blob();
            const file = new File([blob], data.tshirtData.uploadedFileName, { type: blob.type });
            formData.append('file', file);

            const uploadResponse = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
            let filePath;
            if (uploadResponse.ok) {
                const contentType = uploadResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const uploadData = await uploadResponse.json();
                    filePath = uploadData.filePath || uploadData.path || data.tshirtData.uploadedImage;
                } else {
                    filePath = await uploadResponse.text() || data.tshirtData.uploadedImage;
                }
            } else {
                filePath = data.tshirtData.uploadedImage;
            }

            // --- design ---
            const design = await makeApiCall(
                `${API_BASE}/design/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ filePath }),
                },
                { designId: Date.now(), filePath }
            );

            // --- position ---
            const position = await makeApiCall(
                `${API_BASE}/position/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ x: data.position.x, y: data.position.y }),
                },
                { positionId: Date.now(), ...data.position }
            );

            // --- rotation ---
            const rotation = await makeApiCall(
                `${API_BASE}/rotation/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ angle: data.rotation }),
                },
                { rotationId: Date.now() + 1, angle: data.rotation }
            );

            // --- scale ---
            const scale = await makeApiCall(
                `${API_BASE}/scale/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ value: data.scale }),
                },
                { scaleId: Date.now() + 2, value: data.scale }
            );

            // --- placement ---
            const placement = await makeApiCall(
                `${API_BASE}/placement-data/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify({ position, rotation, scale }),
                },
                { placementDataId: Date.now() + 3, position, rotation, scale }
            );

            // --- tshirt ---
            const tshirtCreateData = {
                designId: design.designId,
                placementDataId: placement.placementDataId,
                name: data.tshirtData.name,
                description: data.tshirtData.description || 'Custom designed t-shirt',
                price: 299.99, // price in Rands
                color: data.tshirtData.selectedColor,
                size: data.tshirtData.selectedSize,
                quantity: data.tshirtData.quantity,
            };

            const tshirtResult = await makeApiCall(
                `${API_BASE}/tshirt/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                    body: JSON.stringify(tshirtCreateData),
                },
                { tshirtId: Date.now() + 4, ...tshirtCreateData }
            );

            // ✅ Add to cart
            addToCart({
                id: tshirtResult.tshirtId,
                name: tshirtResult.name,
                price: tshirtResult.price,
                quantity: tshirtResult.quantity,
            });

            showNotification('T-shirt added to cart! Redirecting to checkout...');

            // ✅ Redirect to checkout page
            setTimeout(() => {
                navigate('/checkout');
            }, 1500);

        } catch (error) {
            console.error('Error saving design:', error);
            showNotification('Error saving design. Please try again.');
        }
    };

    // TODO: keep your TShirtUpload + TShirtPositioning components here (unchanged)

    return (
        <div>
            {/* header, notification, etc (unchanged) */}

            <main>
                {currentStep === 'upload' ? (
                    <TShirtUpload onContinue={handleContinueToPositioning} />
                ) : (
                    <TShirtPositioning
                        tshirtData={tshirtData}
                        onSave={handleSaveDesign}
                        onBack={handleBackToUpload}
                        user={user}
                    />
                )}
            </main>
        </div>
    );
};

export default TShirtDesignerMain;
