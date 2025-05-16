import { Link } from 'react-router-dom';
import logo from '../../assets/images/react.svg';

function Logo() {
  return (
    <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-200">
      <img
        src={logo} 
        alt="Logo"
        className="h-10 w-10"
      />
    </Link>
  );
}

export default Logo;