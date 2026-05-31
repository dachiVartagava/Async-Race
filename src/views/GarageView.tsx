import React, { useEffect } from 'react';
import { CarIcon } from '../components/CarIcon';
import { useDispatch, useSelector } from 'react-redux';

// საჭირო იმპორტები API და Store-იდან
import { getCars } from '../api/carApi';
import { setCarsData, nextPage, prevPage } from '../store/carSlice';
import { type RootState } from '../store';

export const GarageView: React.FC = () => {
  const dispatch = useDispatch();
  
  // მონაცემები მოგვაქვს მხოლოდ Redux-იდან
  const { cars, currentPage, totalCount } = useSelector((state: RootState) => state.cars);
  const totalPages = Math.ceil(totalCount / 7);

  // სერვერიდან მონაცემების წამოღება გვერდის მიხედვით
  useEffect(() => {
    const fetchGarageCars = async () => {
      const data = await getCars(currentPage); 
      dispatch(setCarsData(data));
    };

    fetchGarageCars();
  }, [currentPage, dispatch]);

  return (
    <div className="view-container">
      {/* სათაური პაგინაციის ინფორმაციით */}
      <h2 style={{ color: '#fff', paddingLeft: '20px' }}>
        Garage Page #{currentPage} of {totalPages} (Total: {totalCount} cars)
      </h2>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {cars.map((car) => (
          <li 
            key={car.id}
            style={{
              marginBottom: '20px',
              padding: '0.25rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {/* შენი ორიგინალური ღილაკების ბლოკები */}
            <div className='abbtn'>
              <button>SELECT</button>
              <button>REMOVE</button>
            </div>
            
            <div className="abbtn">
              <button>A</button>
              <button>b</button>
            </div>
            
            {/* მანქანის ვექტორული ხატულა დინამიური ფერით */}
            <div className="car-icon-wrapper">
              <CarIcon color={car.color}/>
            </div>
            
            {/* მანქანის სახელი */}
            <div className="car-info">
              <strong style={{ fontSize: '0.89rem', color: '#fff', fontWeight: 'normal' }}>
                {car.name}
              </strong>
            </div>
            
            {/* შენი ორიგინალური გზის (ტრეკის) ბლოკი */}
            <div className="dashroad">
              <p>Start</p>
              <p>Finish</p>
            </div>
            
          </li>
        ))}
      </ul>
      
      {/* 🏁 პაგინაციის მართვის ღილაკები, რომლებიც სიის ბოლოში ჩაჯდა */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
        <button 
          disabled={currentPage === 1}
          onClick={() => dispatch(prevPage())}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          ◀ PREV
        </button>
        
        <button 
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => dispatch(nextPage())}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          NEXT ▶
        </button>
      </div>
      
    </div>
  );
};