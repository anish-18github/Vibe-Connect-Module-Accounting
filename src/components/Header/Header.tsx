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
import { getBreadcrumbLabel } from '../../utils/getBreadcrumbLabel';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { customerName?: string };



  const pathParts = location.pathname.split('/').filter(Boolean);

  // const isId = (value: string) => /^\d+$/.test(value);


  // const formatLabel = (part: string) =>
  //   part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Build cumulative paths for each segment: ["sales","sales-orders"] → ["/sales","/sales/sales-orders"]
  // const segments = pathParts.map((part, index) => {
  //   const to = '/' + pathParts.slice(0, index + 1).join('/');
  //   return { part, to };
  // });

  const crumbs = pathParts.map((_, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    return {
      path,
      label: getBreadcrumbLabel(path, state),
    };
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

      {/* <div className="breadcrumb mt-3 fw-normal">
        <Link to="/" className="breadcrumb-link">
          Dashboard
        </Link>

        {segments.map((seg, index) => {
          const label =
            isId(seg.part) && state?.customerName
              ? state.customerName
              : formatLabel(seg.part);


          const isLast = index === segments.length - 1;

          return (
            <div key={seg.to} className="breadcrumb-item-flex">
              <ChevronLeft size={20} />

              {isLast ? (
                <button
                  type="button"
                  className="breadcrumb-link btn-reset"
                  onClick={() => navigate(-1)}
                >
                  {label}
                </button>
              ) : (
                <Link to={seg.to} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div> */}

      <div className="breadcrumb mt-3 fw-normal">
        <Link to="/" className="breadcrumb-link">
          Dashboard
        </Link>

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <div key={crumb.path} className="breadcrumb-item-flex">
              <ChevronLeft size={20} />

              {isLast ? (
                <button
                  type="button"
                  className="breadcrumb-link btn-reset"
                  onClick={() => navigate(-1)}
                >
                  {crumb.label}
                </button>
              ) : (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
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
