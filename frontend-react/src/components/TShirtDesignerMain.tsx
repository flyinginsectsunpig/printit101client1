import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TShirtUpload from './TShirtUpload';
import TShirtPositioning from './TShirtPositioning';
import Header from './Header';
import Auth from './Auth';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const TShirtDesignerMain: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [currentStep, setCurrentStep] = useState<'upload' | 'positioning'>('upload');
    const [tshirtData, setTshirtData] = useState<any>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    const showNotification = (message: string, type: 'success' | 'error' = 'success'): void => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Helper function to safely parse JSON responses
    const safeJsonParse = async (response: Response) => {
        try {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.log('Non-JSON response:', text);
                return { success: true, message: text };
            }

            const text = await response.text();
            if (!text.trim()) {
                console.log('Empty response body');
                return { success: true, message: 'Empty response' };
            }

            return JSON.parse(text);
        } catch (error) {
            console.error('JSON parse error:', error);
            const text = await response.text();
            return { success: false, error: 'Invalid JSON response', rawResponse: text };
        }
    };

    // Helper function to make API calls with proper error handling
    const makeApiCall = async (url: string, options: RequestInit, fallbackData?: any) => {
        try {
            console.log(`Making API call to: ${url}`);
            const response = await fetch(url, options);

            console.log(`Response status: ${response.status}`);
            console.log(`Response ok: ${response.ok}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await safeJsonParse(response);
            console.log('API response data:', data);
            return data;
        } catch (error) {
            console.error(`API call failed for ${url}:`, error);
            if (fallbackData) {
                console.log('Using fallback data:', fallbackData);
                return fallbackData;
            }
            throw error;
        }
    };

    const handleContinueToPositioning = (data: any) => {
        // Ensure all product details are included
        const completeData = {
            uploadedImage: data.uploadedImage,
            uploadedFileName: data.uploadedFileName,
            color: data.selectedColor,
            size: data.selectedSize,
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            price: data.price
        };
        setTshirtData(completeData);
        setCurrentStep('positioning');
    };

    const handleBackToUpload = () => {
        setCurrentStep('upload');
    };

    const handleSaveDesign = async (designData: any) => {
        try {
            console.log('Saving design with data:', designData);

            // Upload image and get file path
            const formData = new FormData();
            const response = await fetch(designData.uploadedImage);
            const blob = await response.blob();
            const file = new File([blob], designData.uploadedFileName, { type: blob.type });
            formData.append('file', file);

            const uploadResponse = await fetch(`${API_BASE}/file/upload`, {
                method: 'POST',
                body: formData,
            });

            let filePath;
            if (uploadResponse.ok) {
                const contentType = uploadResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const uploadData = await uploadResponse.json();
                    filePath = uploadData.filePath || uploadData.path || designData.uploadedImage;
                } else {
                    filePath = await uploadResponse.text() || designData.uploadedImage;
                }
            } else {
                console.warn('Image upload failed, using fallback path');
                filePath = designData.uploadedImage; // Fallback
            }

            // Create design
            const design = await makeApiCall(
                `${API_BASE}/design/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ filePath: filePath })
                },
                { designId: Date.now(), filePath: filePath }
            );

            // Create position
            const position = await makeApiCall(
                `${API_BASE}/position/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ x: designData.position.x, y: designData.position.y })
                },
                { positionId: Date.now(), ...designData.position }
            );

            // Create rotation
            const rotation = await makeApiCall(
                `${API_BASE}/rotation/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ angle: designData.rotation })
                },
                { rotationId: Date.now() + 1, angle: designData.rotation }
            );

            // Create scale
            const scale = await makeApiCall(
                `${API_BASE}/scale/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ value: designData.scale })
                },
                { scaleId: Date.now() + 2, value: designData.scale }
            );

            // Create placement data
            const placement = await makeApiCall(
                `${API_BASE}/placement-data/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ position: position, rotation: rotation, scale: scale })
                },
                { placementDataId: Date.now() + 3, position, rotation, scale }
            );

            // Create t-shirt
            const tshirtCreateData = {
                designId: design.designId,
                placementDataId: placement.placementDataId,
                name: designData.name,
                description: designData.description || "Custom designed t-shirt",
                price: designData.price || 29.99,
                color: designData.color,
                size: designData.size
            };

            const tshirtResult = await makeApiCall(
                `${API_BASE}/tshirt/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify(tshirtCreateData)
                },
                { tshirtId: Date.now() + 4, ...tshirtCreateData }
            );

            console.log('T-shirt creation result:', tshirtResult);

            // Create cart item from design data
            const cartItem = {
                productId: tshirtResult.tshirtId || tshirtResult.productId || Date.now(), // Use created tshirt ID or fallback
                name: designData.name || "Custom T-Shirt",
                price: Number(designData.price) || 29.99, // Use the price from design data
                quantity: Number(designData.quantity) || 1, // Use the quantity from design data
                size: designData.size || "M",
                color: designData.color || "white",
                image: designData.uploadedImage // Use the uploaded image for preview in cart
            };

            // Add to cart
            addToCart(cartItem);

            showNotification('Design saved and added to cart!', 'success');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Error saving design:', error);
            showNotification('Error saving design. Please try again.', 'error');
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {notification && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 50,
                    padding: '1rem 1.5rem', borderRadius: '0.5rem',
                    color: notification.type === 'success' ? '#065f46' : '#991b1b',
                    backgroundColor: notification.type === 'success' ? '#d1fae5' : '#fee2e2',
                    border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fca5a3'}`,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    {notification.message}
                </div>
            )}

            {!user ? (
                <Auth onAuthSuccess={(userData) => {
                    // This callback is now less critical as auth is managed in App.tsx
                    // but can be used for initial user state setup if needed.
                    console.log("Auth success in DesignerMain (likely redundant)");
                }} />
            ) : (
                <>
                    <Header
                        page="designer"
                        onButtonClick={() => navigate('/')}
                        onProfileClick={() => navigate('/profile')}
                    />
                    <main>
                        {currentStep === 'upload' ? (
                            <TShirtUpload onContinue={handleContinueToPositioning} />
                        ) : (
                            <TShirtPositioning
                                tshirtData={tshirtData}
                                onSave={handleSaveDesign}
                                onBack={handleBackToUpload}
                                user={user} // Pass user down if needed by positioning component
                            />
                        )}
                    </main>
                </>
            )}
        </div>
    );
};

export default TShirtDesignerMain;
