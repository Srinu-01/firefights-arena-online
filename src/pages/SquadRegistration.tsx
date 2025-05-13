
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import RegistrationWizard from '@/components/registration/RegistrationWizard';

const SquadRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournamentId] = useState(id || 'tourney_001');

  return (
    <Layout>
      <Helmet>
        <title>Register Squad | Free Fire Arena</title>
        <meta name="description" content="Register your team for Free Fire tournaments" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">REGISTER YOUR SQUAD</h1>
        <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
        
        <div className="gaming-card p-4 md:p-6 max-w-3xl mx-auto">
          <RegistrationWizard tournamentId={tournamentId} />
        </div>
      </div>
    </Layout>
  );
};

export default SquadRegistration;
