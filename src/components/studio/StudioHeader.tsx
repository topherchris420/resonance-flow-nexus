import { Link } from "react-router-dom";
import { ArrowUpRight, AudioLines } from "lucide-react";
export default function StudioHeader({ studio = false }: { studio?: boolean }) {
  return (
    <header className="sentinel-header">
      <Link
        to="/"
        className="sentinel-brand"
        aria-label="Project Sentinel home"
      >
        <span className="brand-mark">
          <AudioLines size={22} />
        </span>
        <span>
          SENTINEL<small>A SPACE TO RESONATE</small>
        </span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to="/session" aria-current={studio ? "page" : undefined}>
          {studio ? "Your studio" : "Open studio"}
          <ArrowUpRight size={15} />
        </Link>
        <Link to="/srv" className="secondary-nav" aria-label="Imagination lab">
          <span className="nav-label-full">Imagination lab</span>
          <span className="nav-label-short">Lab</span>
          <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
