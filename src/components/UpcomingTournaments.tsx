
import { useState } from 'react';
import TournamentCard, { TournamentProps } from './TournamentCard';

// Sample data for demonstration
const sampleTournaments: TournamentProps[] = [
  {
    id: 'tourney_001',
    title: 'Daily Custom #27',
    mode: 'Squad (4v4)',
    entryFee: 30,
    prizePool: 500,
    dateTime: '2025-06-01T19:00:00Z',
    status: 'upcoming',
    maxSlots: 25,
    bannerUrl: 'https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/ce405ad07404fecfb3196b77822aec8b.jpg'
  },
  {
    id: 'tourney_002',
    title: 'Weekend Showdown #12',
    mode: 'Squad (4v4)',
    entryFee: 50,
    prizePool: 1000,
    dateTime: '2025-06-05T20:00:00Z',
    status: 'upcoming',
    maxSlots: 25,
    bannerUrl: 'https://freefiremobile-a.akamaihd.net/common/web_event/official2.ff.garena.all/img/20228/2bc8496f63451357a571fbfa6c96f541.jpg'
  },
  {
    id: 'tourney_003',
    title: 'Elite Tournament',
    mode: 'Duo (2v2)',
    entryFee: 25,
    prizePool: 300,
    dateTime: '2025-06-03T18:30:00Z',
    status: 'upcoming',
    maxSlots: 50,
    bannerUrl: 'https://freefiremobile-a.akamaihd.net/common/web_event/official2.ff.garena.all/img/20228/273ccca592700669c1532bd04f6f257a.jpg'
  },
  {
    id: 'tourney_004',
    title: 'Pro League Season 5',
    mode: 'Squad (4v4)',
    entryFee: 100,
    prizePool: 2500,
    dateTime: '2025-06-10T21:00:00Z',
    status: 'upcoming',
    maxSlots: 25,
    bannerUrl: 'https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/202210/768671f1dc8d3c0a8f2448cf5ed6739c.jpg'
  }
];

const UpcomingTournaments = () => {
  const [tournaments] = useState<TournamentProps[]>(sampleTournaments);

  return (
    <div className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">UPCOMING TOURNAMENTS</h2>
        <div className="w-20 h-1 bg-gaming-orange mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} {...tournament} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTournaments;
