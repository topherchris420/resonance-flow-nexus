import { Link } from "react-router-dom";
import StudioHeader from "@/components/studio/StudioHeader";
import "@/studio.css";
export default function NotFound() {
  return (
    <div className="sentinel-app">
      <StudioHeader />
      <main className="not-found">
        <p className="eyebrow">404 / A SMALL DETOUR</p>
        <h1>Find your way back.</h1>
        <p>This page is not here, but your next quiet moment is.</p>
        <Link to="/session" className="primary-action">
          Return to the studio
        </Link>
      </main>
    </div>
  );
}
