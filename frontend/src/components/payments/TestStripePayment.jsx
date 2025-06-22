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
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const TestPaymentForm = ({ amount, jobId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [testCards, setTestCards] = useState({});

  useEffect(() => {
    const fetchTestCards = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/api/payments/test-cards/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTestCards(data);
      } catch (error) {
        console.error('Błąd pobierania testowych kart:', error);
      }
    };

    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/api/payments/create-test-payment-intent/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
          onError(data.error || 'Błąd inicjalizacji testowej płatności');
        }
      } catch (error) {
        onError('Błąd sieciowy podczas inicjalizacji płatności');
      }
    };

    fetchTestCards();
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
        onError(result.error.message || 'Testowa płatność nie powiodła się');
      } else {
        onSuccess({
          ...result.paymentIntent,
          test_mode: true,
          message: 'Testowa płatność zakończona pomyślnie!'
        });
      }
    } catch (error) {
      onError('Błąd przetwarzania testowej płatności');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" gutterBottom>
          Tryb testowy
        </Typography>
        <Typography variant="body2">
          To jest tylko demonstracja płatności. Żadne prawdziwe pieniądze nie będą pobrane!
          Użyj testowych numerów kart podanych poniżej.
        </Typography>
      </Alert>

      <Typography variant="h6" gutterBottom>
        Testowa płatność: {amount} PLN
      </Typography>

      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Testowe numery kart</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ '& > div': { mb: 1 } }}>
            <Typography variant="body2">
              <strong>Pomyślna płatność:</strong> 4242 4242 4242 4242
            </Typography>
            <Typography variant="body2">
              <strong>Odrzucona płatność:</strong> 4000 0000 0000 0002
            </Typography>
            <Typography variant="body2">
              <strong>Mastercard:</strong> 5555 5555 5555 4444
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Data ważności: dowolna przyszła data (np. 12/25)<br/>
              CVC: dowolny 3-cyfrowy kod (np. 123)
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ 
          border: '1px solid #ccc', 
          borderRadius: 1, 
          p: 2, 
          mb: 3,
          backgroundColor: '#fafafa'
        }}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={!stripe || loading || !clientSecret}
          startIcon={loading && <CircularProgress size={20} />}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Przetwarzanie testowej płatności...' : `Testuj płatność ${amount} PLN`}
        </Button>
      </form>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Po płatności możesz sprawdzić wyniki w Stripe Dashboard w trybie testowym
        </Typography>
      </Alert>
    </Paper>
  );
};

const TestStripePayment = ({ amount, jobId, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <TestPaymentForm 
        amount={amount} 
        jobId={jobId}
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

export default TestStripePayment;