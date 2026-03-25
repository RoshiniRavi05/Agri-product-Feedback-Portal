import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BannariLanding = () => {
    const navigate = useNavigate();

    return (
        <div style={{ margin: 0, padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <iframe
                src="https://www.bannarianfu.com/testimonials"
                title="Bannari Amman Website"
                style={{
                    flexGrow: 1,
                    width: '100%',
                    border: 'none',
                    margin: 0,
                    padding: 0
                }}
            />
            <div style={{
                backgroundColor: '#2e7d32',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
                zIndex: 10
            }}>
                <button
                    onClick={() => navigate('/portal')}
                    style={{
                        backgroundColor: '#fff',
                        color: '#2e7d32',
                        border: 'none',
                        padding: '15px 30px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        borderRadius: '30px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, boxShadow 0.2s',
                    }}
                    onMouseOver={e => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={e => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                >
                    Continue to Agri Feedback Portal ➔
                </button>
            </div>
        </div>
    );
};

export default BannariLanding;
