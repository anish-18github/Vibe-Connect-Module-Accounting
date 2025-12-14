import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Settings,
  Search,
  Bell,
  PlusSquare,
  CheckCircle,
  ChevronLeft,
} from 'react-feather';
import './header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split('/').filter(Boolean);

  const formatLabel = (part: string) =>
    part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Build cumulative paths for each segment: ["sales","sales-orders"] → ["/sales","/sales/sales-orders"]
  const segments = pathParts.map((part, index) => {
    const to = '/' + pathParts.slice(0, index + 1).join('/');
    return { part, to };
  });

  return (
    <div>
      <header className="header">
        <img src="/profile.jpg" alt="" className="profile" />
        <h2>Vibe Connect</h2>

        <nav>
          <Link to="/search">
            <Search />
          </Link>
          <Link to="/new-tab">
            <PlusSquare />
          </Link>
          <Link to="/recent">
            <RefreshCw />
          </Link>
          <Link to="/approval">
            <CheckCircle />
          </Link>
          <Link to="/notification">
            <Bell />
          </Link>
          <Link to="/setting">
            <Settings />
          </Link>
        </nav>
      </header>

      <div className="breadcrumb mt-3 fw-normal">
        {/* Root dashboard link */}
        <Link to="/" className="breadcrumb-link">
          Dashboard
        </Link>

        {segments.map((seg, index) => {
          const label = formatLabel(seg.part);
          const isLast = index === segments.length - 1;

          // Parent path for "one step back"
          const parentPath = index > 0 ? '/' + pathParts.slice(0, index).join('/') : '/';

          return (
            <div key={seg.to} className="breadcrumb-item-flex">
              <ChevronLeft size={20} />

              {isLast ? (
                // LAST item: go ONE LEVEL UP when clicked
                <button
                  type="button"
                  className="breadcrumb-link btn-reset"
                  onClick={() => navigate(-1)}
                >
                  {label}
                </button>
              ) : (
                // INTERMEDIATE items: real links to their exact route
                <Link to={seg.to} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Header;
