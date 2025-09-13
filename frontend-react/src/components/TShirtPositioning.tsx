import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plus, Minus, Save, Shirt, RotateCcw, ArrowLeft as BackArrow, AlertCircle } from 'lucide-react';

interface DesignPosition {
    x: number;
    y: number;
}

interface Color {
    name: string;
    value: string;
    hex: string;
}

interface TShirtData {
    uploadedImage: string;
    uploadedFileName: string;
    selectedColor: string;
    selectedSize: string;
    name: string;
    description: string;
    quantity: number;
}

interface TShirtPositioningProps {
    tshirtData: TShirtData;
    onSave: (data: {
        tshirtData: TShirtData;
        position: DesignPosition;
        scale: number;
        rotation: number;
    }) => void;
    onBack: () => void;
    user: any;
}

const TShirtPositioning: React.FC<TShirtPositioningProps> = ({ tshirtData, onSave, onBack, user }) => {
    const [designPosition, setDesignPosition] = useState<DesignPosition>({ x: 0, y: 0 });
    const [designScale, setDesignScale] = useState<number>(1);
    const [designRotation, setDesignRotation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>('');

    const colors: Color[] = [
        { name: 'White', value: 'white', hex: '#ffffff' },
        { name: 'Black', value: 'black', hex: '#000000' },
        { name: 'Navy', value: 'navy', hex: '#1e40af' },
        { name: 'Red', value: 'red', hex: '#dc2626' },
        { name: 'Green', value: 'green', hex: '#16a34a' },
        { name: 'Purple', value: 'purple', hex: '#9333ea' },
        { name: 'Orange', value: 'orange', hex: '#ea580c' },
        { name: 'Pink', value: 'pink', hex: '#ec4899' }
    ];

    const showNotification = (message: string): void => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const getCurrentColorHex = (): string => {
        const color = colors.find(c => c.value === tshirtData.selectedColor);
        return color ? color.hex : '#ffffff';
    };

    const adjustDesignPosition = (direction: string): void => {
        const step = 15;
        setDesignPosition(prev => {
            let newPosition = { ...prev };
            switch(direction) {
                case 'up':
                    newPosition.y = Math.max(prev.y - step, -100);
                    break;
                case 'down':
                    newPosition.y = Math.min(prev.y + step, 100);
                    break;
                case 'left':
                    newPosition.x = Math.max(prev.x - step, -100);
                    break;
                case 'right':
                    newPosition.x = Math.min(prev.x + step, 100);
                    break;
                default:
                    return prev;
            }
            return newPosition;
        });
    };

    const adjustDesignScale = (increase: boolean): void => {
        setDesignScale(prev => {
            const newScale = increase ? prev + 0.15 : prev - 0.15;
            return Math.max(0.3, Math.min(2.5, newScale));
        });
    };

    const adjustDesignRotation = (clockwise: boolean): void => {
        setDesignRotation(prev => {
            const newRotation = clockwise ? prev + 15 : prev - 15;
            return ((newRotation % 360) + 360) % 360; // Keep between 0-359
        });
    };

    const resetDesign = (): void => {
        setDesignPosition({ x: 0, y: 0 });
        setDesignScale(1);
        setDesignRotation(0);
        showNotification('Design position, scale, and rotation reset');
    };

    const handleSave = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await onSave({
                tshirtData,
                position: designPosition,
                scale: designScale,
                rotation: designRotation
            });
        } catch (error) {
            console.error('Error saving design:', error);
            showNotification('Error saving design');
        } finally {
            setIsLoading(false);
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
                            Position Your Design
                        </span>
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        color: '#6b7280'
                    }}>
                        Welcome, {user?.firstName || 'User'}!
                    </div>
                </div>
            </header>

            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
                    gap: '2rem'
                }}>
                    {/* Left Column - Controls */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '2rem',
                        border: '1px solid #f3f4f6'
                    }}>
                        {/* Product Info */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem'
                            }}>Product Information</h3>
                            <div style={{
                                background: '#f9fafb',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                            }}>
                                <p style={{ margin: '0 0 0.5rem 0' }}>
                                    <strong>Name:</strong> {tshirtData.name}
                                </p>
                                <p style={{ margin: '0 0 0.5rem 0' }}>
                                    <strong>Color:</strong> <span style={{ textTransform: 'capitalize' }}>{tshirtData.selectedColor}</span>
                                </p>
                                <p style={{ margin: '0 0 0.5rem 0' }}>
                                    <strong>Size:</strong> {tshirtData.selectedSize}
                                </p>
                                <p style={{ margin: 0 }}>
                                    <strong>Quantity:</strong> {tshirtData.quantity}
                                </p>
                                {tshirtData.description && (
                                    <p style={{ margin: '0.5rem 0 0 0' }}>
                                        <strong>Description:</strong> {tshirtData.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Position Controls */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem'
                            }}>Position Controls</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.5rem'
                            }}>
                                <div></div>
                                <button
                                    onClick={() => adjustDesignPosition('up')}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ArrowUp style={{ height: '1rem', width: '1rem' }} />
                                </button>
                                <div></div>
                                <button
                                    onClick={() => adjustDesignPosition('left')}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
                                </button>
                                <div style={{
                                    padding: '0.5rem 0.75rem',
                                    background: '#f3f4f6',
                                    borderRadius: '0.75rem',
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {designPosition.x},{designPosition.y}
                                </div>
                                <button
                                    onClick={() => adjustDesignPosition('right')}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ArrowRight style={{ height: '1rem', width: '1rem' }} />
                                </button>
                                <div></div>
                                <button
                                    onClick={() => adjustDesignPosition('down')}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to bottom, #3b82f6, #2563eb)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ArrowDown style={{ height: '1rem', width: '1rem' }} />
                                </button>
                            </div>
                        </div>

                        {/* Scale Controls */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem'
                            }}>Scale: {(designScale * 100).toFixed(0)}%</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.75rem'
                            }}>
                                <button
                                    onClick={() => adjustDesignScale(true)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to right, #059669, #047857)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Plus style={{ height: '1rem', width: '1rem' }} />
                                    <span>Larger</span>
                                </button>
                                <button
                                    onClick={() => adjustDesignScale(false)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to right, #ea580c, #c2410c)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Minus style={{ height: '1rem', width: '1rem' }} />
                                    <span>Smaller</span>
                                </button>
                            </div>
                        </div>

                        {/* Rotation Controls */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem'
                            }}>Rotation: {designRotation}°</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.75rem'
                            }}>
                                <button
                                    onClick={() => adjustDesignRotation(false)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <RotateCcw style={{ height: '1rem', width: '1rem' }} />
                                    <span>Left</span>
                                </button>
                                <button
                                    onClick={() => adjustDesignRotation(true)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'linear-gradient(to right, #7c3aed, #6d28d9)',
                                        color: 'white',
                                        borderRadius: '0.75rem',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <RotateCcw style={{ height: '1rem', width: '1rem', transform: 'scaleX(-1)' }} />
                                    <span>Right</span>
                                </button>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                onClick={resetDesign}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: '#f9fafb',
                                    color: '#374151',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Reset Position, Scale & Rotation
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            flexDirection: window.innerWidth >= 640 ? 'row' : 'column'
                        }}>
                            <button
                                onClick={onBack}
                                style={{
                                    flex: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem 1.5rem',
                                    border: '2px solid #93c5fd',
                                    color: '#1d4ed8',
                                    borderRadius: '0.75rem',
                                    transition: 'all 0.2s',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                <BackArrow style={{ height: '1.25rem', width: '1.25rem' }} />
                                <span>Back</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                style={{
                                    flex: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '1rem 1.5rem',
                                    background: isLoading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)',
                                    color: 'white',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Save style={{ height: '1.25rem', width: '1.25rem' }} />
                                <span>{isLoading ? 'Saving...' : 'Save & Finish'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '1rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        padding: '2rem',
                        border: '1px solid #f3f4f6',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: '2rem'
                        }}>Live Preview</h3>

                        {/* T-Shirt Preview */}
                        <div style={{ position: 'relative', marginBottom: '2rem' }}>
                            <div style={{
                                width: '320px',
                                height: '400px',
                                borderRadius: '1rem',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                transition: 'all 0.5s',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '4px solid #e5e7eb'
                            }}>
                                {/* T-Shirt Shape */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '0',
                                    opacity: 0.95,
                                    clipPath: 'polygon(25% 20%, 25% 18%, 22% 15%, 28% 12%, 35% 10%, 40% 8%, 45% 8%, 55% 8%, 60% 8%, 65% 10%, 72% 12%, 78% 15%, 75% 18%, 75% 20%, 80% 25%, 80% 35%, 78% 33%, 78% 92%, 76% 96%, 24% 96%, 22% 92%, 22% 33%, 20% 35%, 20% 25%)',
                                    backgroundColor: getCurrentColorHex()
                                }} />

                                {/* Design Image */}
                                <div style={{
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s',
                                    zIndex: 10,
                                    width: '140px',
                                    height: '140px',
                                    left: `${50 + designPosition.x/6}%`,
                                    top: `${40 + designPosition.y/6}%`,
                                    transform: `translate(-50%, -50%) scale(${designScale}) rotate(${designRotation}deg)`
                                }}>
                                    <img
                                        src={tshirtData.uploadedImage}
                                        alt="Design preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                            border: '2px solid rgba(255, 255, 255, 0.5)'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Current Settings Summary */}
                        <div style={{
                            background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb',
                            width: '100%'
                        }}>
                            <h4 style={{
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '1rem',
                                fontSize: '1.125rem'
                            }}>Current Settings:</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem',
                                fontSize: '0.875rem'
                            }}>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Position:</span>
                                    <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                        X: {designPosition.x}, Y: {designPosition.y}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Scale:</span>
                                    <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                        {(designScale * 100).toFixed(0)}%
                                    </p>
                                </div>
                                <div style={{ gridColumn: '1 / 3' }}>
                                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Rotation:</span>
                                    <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                        {designRotation}°
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TShirtPositioning;