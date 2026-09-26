import Link from "next/link";

export function SiteHeader({ tripTitle }: { tripTitle?: string }) {
  return (
    <header className="site-header">
      <div className="site-header-inner page-wrap">
        <Link href="/" className="site-brand" aria-label="여행의 조각들 홈">
          <span className="site-brand-mark" aria-hidden="true">✳</span>
          <span>여행의 조각들</span>
        </Link>
        <nav className="site-nav" aria-label="주 메뉴">
          <Link href="/">여행 목록</Link>
          {tripTitle && <Link href="#trip-topics" className="site-nav-trip">{tripTitle} 가이드 <span aria-hidden="true">↗</span></Link>}
          <Link href="/admin">기록 관리</Link>
        </nav>
      </div>
    </header>
  );
}
