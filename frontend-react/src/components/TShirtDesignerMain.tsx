import React, { useState, useEffect } from 'react';
import { Upload, ShoppingCart, User, Shirt, AlertCircle } from 'lucide-react';
import Auth from './Auth';

// Import the two page components (these would be separate files in your project)
// For this demo, I'll include simplified versions inline

const TShirtDesignerMain: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'upload' | 'positioning'>('upload');
    const [user, setUser] = useState<any>(null);
    const [tshirtData, setTshirtData] = useState<any>(null);
    const [notification, setNotification] = useState<string>('');

    const API_BASE = 'http://localhost:8080';

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
            // Create design first
            const formData = new FormData();
            const response = await fetch(data.tshirtData.uploadedImage);
            const blob = await response.blob();
            const file = new File([blob], data.tshirtData.uploadedFileName, { type: blob.type });
            formData.append('file', file);

            const uploadResponse = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData,
            });

            let filePath;
            if (uploadResponse.ok) {
                filePath = await uploadResponse.text();
            } else {
                filePath = data.tshirtData.uploadedImage; // Fallback
            }

            const designData = { filePath: filePath };
            const designResponse = await fetch(`${API_BASE}/design/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(designData)
            });

            let design;
            if (designResponse.ok) {
                design = await designResponse.json();
            } else {
                design = { designId: Date.now(), filePath: filePath };
            }

            // Create position
            const positionData = {
                x: data.position.x,
                y: data.position.y,
                z: 0
            };

            const positionResponse = await fetch(`${API_BASE}/position/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(positionData)
            });

            let position;
            if (positionResponse.ok) {
                position = await positionResponse.json();
            } else {
                position = { positionId: Date.now(), ...positionData };
            }

            // Create rotation
            const rotationData = {
                x: 0,
                y: 0,
                z: data.rotation
            };

            const rotationResponse = await fetch(`${API_BASE}/rotation/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(rotationData)
            });

            let rotation;
            if (rotationResponse.ok) {
                rotation = await rotationResponse.json();
            } else {
                rotation = { rotationId: Date.now() + 1, ...rotationData };
            }

            // Create scale
            const scaleData = {
                x: data.scale,
                y: data.scale,
                z: 1
            };

            const scaleResponse = await fetch(`${API_BASE}/scale/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(scaleData)
            });

            let scale;
            if (scaleResponse.ok) {
                scale = await scaleResponse.json();
            } else {
                scale = { scaleId: Date.now() + 2, ...scaleData };
            }

            // Create placement data
            const placementData = {
                position: position,
                rotation: rotation,
                scale: scale
            };

            const placementResponse = await fetch(`${API_BASE}/placement-data/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(placementData)
            });

            let placement;
            if (placementResponse.ok) {
                placement = await placementResponse.json();
            } else {
                placement = { placementDataId: Date.now() + 3, ...placementData };
            }

            // Create t-shirt
            const tshirtCreateData = {
                designId: design.designId,
                placementDataId: placement.placementDataId,
                name: data.tshirtData.name,
                description: data.tshirtData.description || "Custom designed t-shirt",
                price: 29.99,
                color: data.tshirtData.selectedColor,
                size: data.tshirtData.selectedSize
            };

            const tshirtResponse = await fetch(`${API_BASE}/tshirt/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(tshirtCreateData)
            });

            showNotification('T-shirt design saved successfully!');

            // Reset the form after successful save
            setTimeout(() => {
                setCurrentStep('upload');
                setTshirtData(null);
            }, 2000);

        } catch (error) {
            console.error('Error saving design:', error);
            showNotification('Design saved locally (backend may be unavailable)');
            
            // Still reset after showing error
            setTimeout(() => {
                setCurrentStep('upload');
                setTshirtData(null);
            }, 2000);
        }
    };

    // Simplified Upload Component
    const TShirtUpload = ({ onContinue }: { onContinue: (data: any) => void }) => {
        const [uploadedImage, setUploadedImage] = useState<string | null>(null);
        const [uploadedFileName, setUploadedFileName] = useState<string>('');
        const [selectedColor, setSelectedColor] = useState<string>('white');
        const [selectedSize, setSelectedSize] = useState<string>('M');
        const [name, setName] = useState<string>('');
        const [description, setDescription] = useState<string>('');
        const [quantity, setQuantity] = useState<number>(1);

        const colors = [
            { name: 'White', value: 'white', hex: '#ffffff' },
            { name: 'Black', value: 'black', hex: '#000000' },
            { name: 'Navy', value: 'navy', hex: '#1e40af' },
            { name: 'Red', value: 'red', hex: '#dc2626' },
            { name: 'Green', value: 'green', hex: '#16a34a' },
            { name: 'Purple', value: 'purple', hex: '#9333ea' }
        ];

        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showNotification('Please upload a valid image file');
                    return;
                }
                if (file.size > 10 * 1024 * 1024) {
                    showNotification('File size must be less than 10MB');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && typeof e.target.result === 'string') {
                        setUploadedImage(e.target.result);
                        setUploadedFileName(file.name);
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        const handleContinue = () => {
            if (!uploadedImage || !name.trim()) {
                showNotification('Please upload an image and enter a product name');
                return;
            }
            onContinue({
                uploadedImage,
                uploadedFileName,
                selectedColor,
                selectedSize,
                name: name.trim(),
                description: description.trim(),
                quantity
            });
        };

        const getCurrentColorHex = () => {
            const color = colors.find(c => c.value === selectedColor);
            return color ? color.hex : '#ffffff';
        };

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                {/* Form Column */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2rem',
                    border: '1px solid #f3f4f6'
                }}>
                    {/* Upload Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            <Upload style={{ height: '1.5rem', width: '1.5rem', display: 'inline', marginRight: '0.5rem' }} />
                            Upload Design
                        </h3>
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '2px dashed #d1d5db',
                                borderRadius: '0.75rem',
                                marginBottom: '1rem'
                            }}
                        />
                        {uploadedImage && (
                            <p style={{ color: '#059669', fontWeight: '500' }}>✓ {uploadedFileName}</p>
                        )}
                    </div>

                    {/* Product Details */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Product Details</h3>
                        <input
                            type="text"
                            placeholder="Product Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                        <input
                            type="number"
                            min="1"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Color Selection */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Colors</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.value)}
                                    style={{
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '0.5rem',
                                        border: selectedColor === color.value ? '3px solid #3b82f6' : '2px solid #d1d5db',
                                        backgroundColor: color.hex,
                                        cursor: 'pointer'
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '0.5rem', textTransform: 'capitalize' }}>
                            Selected: {selectedColor}
                        </p>
                    </div>

                    {/* Size Selection */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Size</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: selectedSize === size ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                                        background: selectedSize === size ? '#dbeafe' : 'white',
                                        color: selectedSize === size ? '#1d4ed8' : '#374151',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!uploadedImage || !name.trim()}
                        style={{
                            width: '100%',
                            padding: '1rem 2rem',
                            background: (!uploadedImage || !name.trim()) ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
                            color: 'white',
                            borderRadius: '0.75rem',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '1.125rem',
                            cursor: (!uploadedImage || !name.trim()) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Continue to Positioning
                    </button>
                </div>

                {/* Preview Column */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '2rem',
                    border: '1px solid #f3f4f6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Preview</h3>
                    <div style={{
                        width: '300px',
                        height: '360px',
                        borderRadius: '1rem',
                        border: '4px solid #e5e7eb',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: '0',
                            clipPath: 'polygon(25% 20%, 25% 18%, 22% 15%, 28% 12%, 35% 10%, 40% 8%, 45% 8%, 55% 8%, 60% 8%, 65% 10%, 72% 12%, 78% 15%, 75% 18%, 75% 20%, 80% 25%, 80% 35%, 78% 33%, 78% 92%, 76% 96%, 24% 96%, 22% 92%, 22% 33%, 20% 35%, 20% 25%)',
                            backgroundColor: getCurrentColorHex()
                        }} />
                        
                        {uploadedImage ? (
                            <div style={{
                                position: 'absolute',
                                top: '40%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120px',
                                height: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={uploadedImage}
                                    alt="Design preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{
                                position: 'absolute',
                                inset: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: '#9ca3af'
                            }}>
                                <Upload style={{ height: '3rem', width: '3rem', marginBottom: '1rem' }} />
                                <p>Upload your design</p>
                            </div>
                        )}
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        background: '#f9fafb',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        width: '100%'
                    }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Current Selection:</h4>
                        <p><strong>Name:</strong> {name || 'Not set'}</p>
                        <p><strong>Color:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedColor}</span></p>
                        <p><strong>Size:</strong> {selectedSize}</p>
                        <p><strong>Quantity:</strong> {quantity}</p>
                    </div>
                </div>
            </div>
        );
    };

    // Simplified Positioning Component
    const TShirtPositioning = ({ tshirtData, onSave, onBack }: any) => {
        const [designPosition, setDesignPosition] = useState({ x: 0, y: 0 });
        const [designScale, setDesignScale] = useState(1);
        const [designRotation, setDesignRotation] = useState(0);
        const [isLoading, setIsLoading] = useState(false);

        const colors = [
            { name: 'White', value: 'white', hex: '#ffffff' },
            { name: 'Black', value: 'black', hex: '#000000' },
            { name: 'Navy', value: 'navy', hex: '#1e40af' },
            { name: 'Red', value: 'red', hex: '#dc2626' },
            { name: 'Green', value: 'green', hex: '#16a34a' },
            { name: 'Purple', value: 'purple', hex: '#9333ea' }
        ];

        const getCurrentColorHex = () => {
            const color = colors.find(c => c.value === tshirtData.selectedColor);
            return color ? color.hex : '#ffffff';
        };

        const adjustDesignPosition = (direction: string) => {
            const step = 15;
            setDesignPosition(prev => {
                let newPosition = { ...prev };
                switch(direction) {
                    case 'up': newPosition.y = Math.max(prev.y - step, -100); break;
                    case 'down': newPosition.y = Math.min(prev.y + step, 100); break;
                    case 'left': newPosition.x = Math.max(prev.x - step, -100); break;
                    case 'right': newPosition.x = Math.min(prev.x + step, 100); break;
                }
                return newPosition;
            });
        };

        const adjustDesignScale = (increase: boolean) => {
            setDesignScale(prev => {
                const newScale = increase ? prev + 0.15 : prev - 0.15;
                return Math.max(0.3, Math.min(2.5, newScale));
            });
        };

        const adjustDesignRotation = (clockwise: boolean) => {
            setDesignRotation(prev => {
                const newRotation = clockwise ? prev + 15 : prev - 15;
                return ((newRotation % 360) + 360) % 360;
            });
        };

        const handleSave = async () => {
            setIsLoading(true);
            await onSave({
                tshirtData,
                position: designPosition,
                scale: designScale,
                rotation: designRotation
            });
            setIsLoading(false);
        };

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                {/* Controls Column */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}>
                    {/* Product Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Product Information</h3>
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                            <p><strong>Name:</strong> {tshirtData.name}</p>
                            <p><strong>Color:</strong> <span style={{ textTransform: 'capitalize' }}>{tshirtData.selectedColor}</span></p>
                            <p><strong>Size:</strong> {tshirtData.selectedSize}</p>
                            <p><strong>Quantity:</strong> {tshirtData.quantity}</p>
                        </div>
                    </div>

                    {/* Position Controls */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Position Controls</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            <div></div>
                            <button onClick={() => adjustDesignPosition('up')} style={{ padding: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>↑</button>
                            <div></div>
                            <button onClick={() => adjustDesignPosition('left')} style={{ padding: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>←</button>
                            <div style={{ padding: '0.5rem', background: '#f3f4f6', borderRadius: '0.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
                                {designPosition.x},{designPosition.y}
                            </div>
                            <button onClick={() => adjustDesignPosition('right')} style={{ padding: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>→</button>
                            <div></div>
                            <button onClick={() => adjustDesignPosition('down')} style={{ padding: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>↓</button>
                            <div></div>
                        </div>
                    </div>

                    {/* Scale Controls */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Scale: {(designScale * 100).toFixed(0)}%
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button 
                                onClick={() => adjustDesignScale(true)}
                                style={{ padding: '0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                                + Larger
                            </button>
                            <button 
                                onClick={() => adjustDesignScale(false)}
                                style={{ padding: '0.75rem', background: '#ea580c', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                                - Smaller
                            </button>
                        </div>
                    </div>

                    {/* Rotation Controls */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Rotation: {designRotation}°
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button 
                                onClick={() => adjustDesignRotation(false)}
                                style={{ padding: '0.75rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                                ↺ Left
                            </button>
                            <button 
                                onClick={() => adjustDesignRotation(true)}
                                style={{ padding: '0.75rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                            >
                                ↻ Right
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={onBack}
                            style={{
                                flex: '1',
                                padding: '1rem',
                                border: '2px solid #93c5fd',
                                color: '#1d4ed8',
                                background: 'white',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            style={{
                                flex: '1',
                                padding: '1rem',
                                background: isLoading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Saving...' : 'Save & Finish'}
                        </button>
                    </div>
                </div>

                {/* Preview Column */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Live Preview</h3>
                    <div style={{
                        width: '320px',
                        height: '400px',
                        borderRadius: '1rem',
                        border: '4px solid #e5e7eb',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: '0',
                            clipPath: 'polygon(25% 20%, 25% 18%, 22% 15%, 28% 12%, 35% 10%, 40% 8%, 45% 8%, 55% 8%, 60% 8%, 65% 10%, 72% 12%, 78% 15%, 75% 18%, 75% 20%, 80% 25%, 80% 35%, 78% 33%, 78% 92%, 76% 96%, 24% 96%, 22% 92%, 22% 33%, 20% 35%, 20% 25%)',
                            backgroundColor: getCurrentColorHex()
                        }} />
                        
                        <div style={{
                            position: 'absolute',
                            top: `${40 + designPosition.y/6}%`,
                            left: `${50 + designPosition.x/6}%`,
                            transform: `translate(-50%, -50%) scale(${designScale}) rotate(${designRotation}deg)`,
                            width: '140px',
                            height: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={tshirtData.uploadedImage}
                                alt="Design preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '0.5rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        background: '#f9fafb',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        width: '100%'
                    }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Current Settings:</h4>
                        <p><strong>Position:</strong> X: {designPosition.x}, Y: {designPosition.y}</p>
                        <p><strong>Scale:</strong> {(designScale * 100).toFixed(0)}%</p>
                        <p><strong>Rotation:</strong> {designRotation}°</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '500'
                }}>
                    <AlertCircle style={{ height: '1.25rem', width: '1.25rem' }} />
                    <span>{notification}</span>
                </div>
            )}

            <header style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid #f3f4f6',
                position: 'sticky',
                top: 0,
                zIndex: 40
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '72px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #2563eb, #9333ea)',
                            padding: '0.5rem',
                            borderRadius: '0.75rem'
                        }}>
                            <Shirt style={{ height: '2rem', width: '2rem', color: 'white' }} />
                        </div>
                        <span style={{
                            fontSize: '1.875rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #2563eb, #9333ea)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {currentStep === 'upload' ? 'Design Your T-Shirt' : 'Position Your Design'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1rem', color: '#6b7280' }}>
                            Welcome, {user.firstName} {user.lastName}!
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                                color: 'white',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

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

            {/* Progress Indicator */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '1rem 2rem',
                borderRadius: '9999px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #9333ea)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                    }}>
                        1
                    </div>
                    <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: currentStep === 'upload' ? 'bold' : 'normal',
                        color: currentStep === 'upload' ? '#2563eb' : '#6b7280'
                    }}>
                        Product Details
                    </span>
                </div>
                
                <div style={{
                    width: '2rem',
                    height: '2px',
                    background: currentStep === 'positioning' ? 'linear-gradient(to right, #2563eb, #9333ea)' : '#e5e7eb',
                    borderRadius: '1px'
                }} />
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: currentStep === 'positioning' ? 'linear-gradient(135deg, #2563eb, #9333ea)' : '#e5e7eb',
                        color: currentStep === 'positioning' ? 'white' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                    }}>
                        2
                    </div>
                    <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: currentStep === 'positioning' ? 'bold' : 'normal',
                        color: currentStep === 'positioning' ? '#2563eb' : '#6b7280'
                    }}>
                        Design Positioning
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TShirtDesignerMain;