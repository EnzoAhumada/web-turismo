import Header from '../Header';
import Footer from '../Footer';
import SearchBar from '../../ui/SearchBar';
import LoadingState from '../../ui/LoadingState';
import EmptyState from '../../ui/EmptyState';
import FeedbackBanner from '../../ui/FeedbackBanner';
import './CatalogLayout.css';

export default function CatalogLayout({
  title,
  subtitle,
  searchPlaceholder,
  onSearch,
  toolbar,
  count,
  countNoun = 'resultado',
  loading,
  loadingMessage,
  error,
  isEmpty,
  emptyIcon = 'search',
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  children,
}) {
  const countText = `${count} ${count === 1 ? countNoun : `${countNoun}s`}`;

  return (
    <>
      <Header />
      <main className="page-wrapper">
        <section className="catalog-head">
          <div className="container catalog-head__inner">
            <div className="catalog-head__copy">
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} />
          </div>
        </section>

        <div className="container page-content">
          <div className="catalog-toolbar">
            <div className="catalog-toolbar__filters">{toolbar}</div>
            {!loading && count != null && (
              <p className="catalog-toolbar__count">{countText}</p>
            )}
          </div>

          <FeedbackBanner type="error" message={error} />

          {loading ? (
            <LoadingState message={loadingMessage} />
          ) : isEmpty ? (
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              actionLabel={emptyActionLabel}
              onAction={onEmptyAction}
            />
          ) : (
            <div className="catalog-grid">{children}</div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
