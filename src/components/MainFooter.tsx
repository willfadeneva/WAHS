export default function MainFooter() {
  return (
    <footer className="main-footer" id="contact">
      <div className="main-footer-inner">
        <div className="main-footer-content">
          <div className="main-footer-section">
            <h3>Contact Information</h3>
            <div className="main-footer-contact">
              <p><strong>Tel.</strong> +82 (0)2 971 – 5577</p>
              <p><strong>Fax.</strong> +82 (0)2 6455 – 2578</p>
              <p><strong>Email:</strong> <a href="mailto:wahskorea@gmail.com">wahskorea@gmail.com</a></p>
            </div>
          </div>
          
          <div className="main-footer-section">
            <h3>Address</h3>
            <address>
              C-dong 204-ho Diwoo Artville<br />
              353-10 Eungam-dong, Eunpyeong-gu<br />
              Seoul, South Korea
            </address>
          </div>
        </div>
        
        <div className="main-footer-bottom">
          <p>WAHS | 세계한류학회</p>
          <p>designed by CJ (whatsapp +818042615062)</p>
          <p>© 2026 WAHS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}