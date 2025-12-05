import React from 'react';
import api from '../services/api.js';

const RazorpayButton = ({ amount, eventTitle }) => {
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load.');
            return;
        }
        try {
            const response = await api.post('/payment/create-order', { amount: amount });
            const orderData = response.data;
            const options = {
                key: orderData.key, 
                amount: orderData.amount * 100, 
                currency: orderData.currency,
                name: "GatherLocal",
                description: `Ticket for ${eventTitle}`,
                order_id: orderData.orderId,
                handler: function (response) {
                    alert(`Payment Successful! Ref: ${response.razorpay_payment_id}`);
                },
                theme: { color: "#6366F1" } // Indigo-500
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Could not start payment.");
        }
    };

    return (
        <button onClick={handlePayment} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-200">
            Book Ticket — ₹{amount}
        </button>
    );
};
export default RazorpayButton;
