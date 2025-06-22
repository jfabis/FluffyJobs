import React, { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount, jobId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Utwórz Payment Intent przy załadowaniu komponentu
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/api/payments/create-payment-intent/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer 
          },
          body: JSON.stringify({ 
            amount: amount,
            job_id: jobId 
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.client_secret);
        } else {
          onError(data.error || 'Failed to initialize payment');
        }
      } catch (error) {
        onError('Network error during payment initialization');
      }
    };

    if (amount) {
      createPaymentIntent();
    }
  }, [amount, jobId, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) return;
    
    setLoading(true);
    
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });
      
      if (result.error) {
        onError(result.error.message || 'Payment failed');
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (error) {
      onError('Payment processing error');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Płatność: {amount} PLN
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ 
          border: '1px solid #ccc', 
          borderRadius: 1, 
          p: 2, 
          mb: 3,
          backgroundColor: '#fafafa'
        }}>
          <CardElement options={cardStyle} />
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!stripe || loading || !clientSecret}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Przetwarzanie...' : Zapłać  PLN}
        </Button>
      </form>
    </Paper>
  );
};

const StripePayment = ({ amount, jobId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        amount={amount} 
        jobId={jobId}
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default StripePayment;
