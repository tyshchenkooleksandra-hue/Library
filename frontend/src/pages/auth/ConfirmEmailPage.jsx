import { useEffect } from 'react';

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom';

function ConfirmEmailPage({ setUser }) {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {

    const confirmEmail = async () => {

      const email =
        searchParams.get('email');

      const token =
        searchParams.get('token');

      try {

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/confirm-email?email=${email}&token=${token}`
        );

        if (!response.ok) {
          throw new Error(
            'Email confirmation failed.'
          );
        }

        navigate('/subscription');

      } catch (error) {

        console.error(error);
      }
    };

    confirmEmail();

  }, [navigate, searchParams]);

  return (
    <div className="auth-page">

      <h2>Confirming email...</h2>

    </div>
  );
}

export default ConfirmEmailPage;
