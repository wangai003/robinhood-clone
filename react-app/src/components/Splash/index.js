import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { demo } from '../../store/session';
import { isDemoMode } from '../../config/demo';
import DemoInstructions from '../DemoInstructions';
import './Splash.css';

const Splash = ({ user }) => {
  const dispatch = useDispatch();

  if (user) return <Redirect to='/' />;

  const handleDemoLogin = async () => {
    await dispatch(demo());
  };

  return (
    <div className='splash main'>
      <nav>
        <div className='navbar'>
          <div className='home'>
            <Link className='logo' to='/'>
              <span className='logoText'>AZIX</span>
              <img className='logoImg' src='/favicon.ico' alt='' />
            </Link>
          </div>
          <div className='auth'>
            <Link className='btn login' to='/login'>
              Log In
            </Link>
            <Link className='btn signup' to='/signup'>
              Sign Up
            </Link>
            {isDemoMode() && (
              <button className='btn demo' onClick={handleDemoLogin}>
                🔗 Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
      <header className='headerContainer'>
        <div className='header'>
          <div className='headerLeftContainer'>
            <div className='headerLeft'>
              <h1>{isDemoMode() ? 'Decentralized Stock Trading' : 'Investing for Everyone'}</h1>
              <p>
                {isDemoMode() 
                  ? 'Trade tokenized stocks on the blockchain. Stake AZIX tokens, tokenize Kenyan stocks, and earn DeFi rewards. Connect your wallet to start trading on the decentralized exchange.'
                  : 'Commission-free investing, plus the tools you need to put your money in motion. Sign up and get your first stock for free. Certain limitations and fees apply.'
                }
              </p>
              {isDemoMode() ? (
                <button className='btn signup black' onClick={handleDemoLogin}>
                  🚀 Launch AZIX
                </button>
              ) : (
                <Link className='btn signup black' to='/signup'>
                  Sign Up
                </Link>
              )}
            </div>
          </div>
          <div className='headerRightContainer'>
            <div className='headerRight'>
              <video
                autoPlay
                muted
                controlsList='nodownload nofullscreen noremoteplayback'
                loop
                playsInline
                preload='auto'
                className='headerVideo'
              >
                <source src='/static/splash_phone_vid.mp4' type='video/mp4' />
              </video>
              <img className='headerImage' src='/static/splash_phone_img.png' alt='' />
            </div>
          </div>
        </div>
      </header>
      {isDemoMode() && (
        <div className="demo-instructions-container">
          <DemoInstructions />
        </div>
      )}
    </div>
  );
};

export default Splash;
