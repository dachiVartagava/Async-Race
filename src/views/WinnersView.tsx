import React, { useState, useEffect } from 'react';
import { CarIcon } from '../components/CarIcon';
import { getWinnersApi } from '../api/carApi';

export const WinnersView: React.FC = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const limit = 10; // Strictly 10 winners per page as per requirements
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch winners whenever page or sorting changes
  useEffect(() => {
    const fetchWinners = async () => {
      const data = await getWinnersApi(currentPage, limit, sortField, sortOrder);
      setWinners(data.winners);
      setTotalCount(data.totalCount);
    };
    fetchWinners();
  }, [currentPage, sortField, sortOrder]);

  // Handle click on table headers for sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="view-container" style={{ padding: '20px', color: '#fff' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#ffcc00' }}>
        🏆 Winners Leaderboard (Total: {totalCount} champions)
      </h2>
      
      {winners.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>No races completed yet. Go to Garage and click RACE!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#222', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Rank</th>
              <th style={{ padding: '12px' }}>Car Icon</th>
              <th style={{ padding: '12px' }}>Car Name</th>
              <th 
                style={{ padding: '12px', cursor: 'pointer', color: sortField === 'wins' ? '#ffcc00' : '#fff' }}
                onClick={() => handleSort('wins')}
              >
                Number of Wins {sortField === 'wins' ? (sortOrder === 'ASC' ? '▲' : '▼') : '↕'}
              </th>
              <th 
                style={{ padding: '12px', cursor: 'pointer', color: sortField === 'time' ? '#ffcc00' : '#fff' }}
                onClick={() => handleSort('time')}
              >
                Best Time {sortField === 'time' ? (sortOrder === 'ASC' ? '▲' : '▼') : '↕'}
              </th>
            </tr>
          </thead>
          <tbody>
            {winners.map((result, index) => {
              const globalRank = (currentPage - 1) * limit + index + 1;
              return (
                <tr key={result.id} style={{ borderBottom: '1px solid #333', background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>
                    {globalRank === 1 ? ' 1st' : globalRank === 2 ? ' 2nd' : globalRank === 3 ? ' 3rd' : `${globalRank}th`}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ width: '50px', display: 'inline-block' }}><CarIcon color={result.color} /></div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{result.name}</td>
                  <td style={{ padding: '12px', fontSize: '1.1rem', color: '#ffcc00', fontWeight: 'bold' }}>{result.wins}</td>
                  <td style={{ padding: '12px', color: '#00ffcc' }}>{result.time}s</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>◀ PREV</button>
          <span style={{ alignSelf: 'center', color: '#aaa' }}>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>NEXT ▶</button>
        </div>
      )}
    </div>
  );
};