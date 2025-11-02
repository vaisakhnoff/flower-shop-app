import { Link } from "react-router-dom";
import './header.css';

export default function Header(){
    return (
        <header className="site-header">
      <Link to="/">
         Flower Shop
         </Link>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/favorites">Favorites</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </header>
    )
};

