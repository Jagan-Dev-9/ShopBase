import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../contexts/AuthContext';

const PayNowButton = ({ 
    productName, 
    amount, 
    className = '', 
    disabled = false,
    type = 'product' // 'product' or 'cart'
}) => {
    const { loading, error, handleProductPayment, handleCartPayment, setError } = usePayment();
    const { isAuthenticated } = useAuth();

    const handlePayment = async () => {
        if (!isAuthenticated) {
            alert('Please login to make a payment');
            return;
        }

        setError(null);
        
        try {
            if (type === 'cart') {
                await handleCartPayment();
            } else {
                await handleProductPayment(productName, amount);
            }
        } catch (err) {
            console.error('Payment failed:', err);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handlePayment}
                disabled={disabled || loading || !isAuthenticated}
                className={`w-full py-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white rounded-2xl hover:from-green-600 hover:via-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl font-bold text-lg relative overflow-hidden group ${className}`}
            >
                <span className="relative z-10">
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Processing...</span>
                        </div>
                    ) : type === 'cart' ? (
                        'Proceed to Checkout'
                    ) : (
                        `Pay $${amount}`
                    )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            {error && (
                <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-red-500 text-sm">⚠️</span>
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                </div>
            )}
            
            {!isAuthenticated && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Please login to make a payment
                </p>
            )}
        </div>
    );
};

export default PayNowButton;
