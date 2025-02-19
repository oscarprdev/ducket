import FooterContent from './footer-content';

export function Footer() {
  return (
    <footer
      className="relative h-[300px]"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
      <div className="relative -top-[100vh] h-[calc(100vh+300px)]">
        <div className="sticky top-[calc(100vh-300px)] h-[300px]">
          <FooterContent />
        </div>
      </div>
    </footer>
  );
}
