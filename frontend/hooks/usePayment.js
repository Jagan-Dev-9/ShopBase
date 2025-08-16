import { useState } from 'react';
import { getApiUrl, apiConfig } from '../utils/apiConfig';
import stripePromise from '../lib/stripe';

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCheckoutSession = async (productName, amount) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                throw new Error('Please login to make a payment');
            }

            const response = await fetch(getApiUrl(apiConfig.endpoints.createCheckoutSession), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_name: productName,
                    amount: amount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createCartCheckoutSession = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                throw new Error('Please login to make a payment');
            }

            const response = await fetch(getApiUrl(apiConfig.endpoints.createCartCheckoutSession), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const redirectToCheckout = async (sessionId) => {
        try {
            const stripe = await stripePromise;
            
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (error) {
                setError(error.message);
                throw new Error(error.message);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleProductPayment = async (productName, amount) => {
        try {
            const { session_id } = await createCheckoutSession(productName, amount);
            await redirectToCheckout(session_id);
        } catch (err) {
            console.error('Payment error:', err);
        }
    };

    const handleCartPayment = async () => {
        try {
            const { session_id } = await createCartCheckoutSession();
            await redirectToCheckout(session_id);
        } catch (err) {
            console.error('Cart payment error:', err);
        }
    };

    return {
        loading,
        error,
        createCheckoutSession,
        createCartCheckoutSession,
        redirectToCheckout,
        handleProductPayment,
        handleCartPayment,
        setError, // To clear errors manually
    };
};
