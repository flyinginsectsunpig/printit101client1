import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import TShirtUpload from "./TShirtUpload";
import TShirtPositioning from "./TShirtPositioning";

const TShirtDesignerMain: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'upload' | 'positioning'>('upload');
    const [tshirtData, setTshirtData] = useState<any>(null);

    const API_BASE = 'http://localhost:8080';

    const { user } = useAuth();
    const { addToCart } = useCart();

    const showNotification = (message: string): void => {
        console.log('Notification:', message);
        // You can implement a toast/notification system here if needed
    };

    // No need for auth check - route is protected in App.tsx
    // User will always be available when this component renders

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
        // This part should ideally not be reached if App.tsx handles routing correctly
        // but as a fallback, we can render Auth or redirect
        return <div>Loading user or redirecting...</div>;
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
            showNotification('Saving your design to the database...');

            // --- upload image ---
            let filePath = '';
            try {
                const formData = new FormData();
                const response = await fetch(data.tshirtData.uploadedImage);
                const blob = await response.blob();
                const file = new File([blob], data.tshirtData.uploadedFileName || 'design.png', { type: blob.type });
                formData.append('file', file);

                const uploadResponse = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
                if (!uploadResponse.ok) {
                    throw new Error(`Upload failed with status ${uploadResponse.status}: ${await uploadResponse.text()}`);
                }

                const contentType = uploadResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const uploadData = await uploadResponse.json();
                    filePath = uploadData.filePath || uploadData.path;
                } else {
                    filePath = await uploadResponse.text();
                }

                if (!filePath || filePath.startsWith('data:')) {
                    throw new Error('Invalid file path returned from upload');
                }

                console.log('Image uploaded successfully:', filePath);
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                throw new Error(`Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}. Please ensure the backend upload endpoint is working.`);
            }

            // --- design ---
            const designResponse = await fetch(`${API_BASE}/design/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && user.token && { 'Authorization': `Bearer ${user.token}` })
                },
                body: JSON.stringify({ filePath }),
            });

            if (!designResponse.ok) {
                throw new Error(`Design creation failed: ${designResponse.status} ${designResponse.statusText}`);
            }

            const design = await designResponse.json();
            console.log('Design created:', design);

            // --- position ---
            const positionResponse = await fetch(`${API_BASE}/position/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && user.token && { 'Authorization': `Bearer ${user.token}` })
                },
                body: JSON.stringify({ x: data.position.x, y: data.position.y }),
            });

            if (!positionResponse.ok) {
                throw new Error(`Position creation failed: ${positionResponse.status}`);
            }

            const position = await positionResponse.json();
            console.log('Position created:', position);

            // --- rotation ---
            const rotationResponse = await fetch(`${API_BASE}/rotation/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && user.token && { 'Authorization': `Bearer ${user.token}` })
                },
                body: JSON.stringify({ angle: data.rotation }),
            });

            if (!rotationResponse.ok) {
                throw new Error(`Rotation creation failed: ${rotationResponse.status}`);
            }

            const rotation = await rotationResponse.json();
            console.log('Rotation created:', rotation);

            // --- scale ---
            const scaleResponse = await fetch(`${API_BASE}/scale/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && user.token && { 'Authorization': `Bearer ${user.token}` })
                },
                body: JSON.stringify({ value: data.scale }),
            });

            if (!scaleResponse.ok) {
                throw new Error(`Scale creation failed: ${scaleResponse.status}`);
            }

            const scale = await scaleResponse.json();
            console.log('Scale created:', scale);

            // --- placement ---
            const placementResponse = await fetch(`${API_BASE}/placement-data/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && user.token && { 'Authorization': `Bearer ${user.token}` })
                },
                body: JSON.stringify({ position, rotation, scale }),
            });

            if (!placementResponse.ok) {
                throw new Error(`Placement creation failed: ${placementResponse.status}`);
            }

            const placement = await placementResponse.json();
            console.log('Placement created:', placement);

            // --- tshirt ---
            const tshirtCreateData = {
                designId: design.designId,
                placementDataId: placement.placementDataId,
                name: data.tshirtData.name,
                description: data.tshirtData.description || 'Custom designed t-shirt',
                price: 299.99,
                color: data.tshirtData.selectedColor,
                size: data.tshirtData.selectedSize,
                quantity: data.tshirtData.quantity,
            };

            const tshirtResponse = await fetch(`${API_BASE}/tshirt/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && user.token && { 'Authorization': `Bearer ${user.token}` })
                },
                body: JSON.stringify(tshirtCreateData),
            });

            if (!tshirtResponse.ok) {
                const errorText = await tshirtResponse.text();
                throw new Error(`T-shirt creation failed: ${tshirtResponse.status} - ${errorText}`);
            }

            const tshirtResult = await tshirtResponse.json();
            console.log('T-shirt created successfully:', tshirtResult);

            // Only add to cart if everything succeeded
            addToCart({
                id: tshirtResult.tshirtId,
                name: tshirtResult.name,
                price: tshirtResult.price,
                quantity: data.tshirtData.quantity,
                image: data.tshirtData.uploadedImage
            });

            showNotification('T-shirt saved to database and added to cart!');

            setTimeout(() => {
                setCurrentStep('upload');
                setTshirtData(null);
                const cartButton = document.getElementById("cart-toggle");
                if (cartButton) {
                    cartButton.click();
                }
            }, 1500);

        } catch (error) {
            console.error('Error saving design:', error);
            showNotification(`Error: ${error instanceof Error ? error.message : 'Failed to save design. Please check that the backend is running.'}`);
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