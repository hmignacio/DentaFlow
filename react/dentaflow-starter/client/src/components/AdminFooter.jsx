
export default function AdminFooter() {
  return (
    <footer className="dentaflow-footer">
      <div className="footer-container">
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DentaFlow. All rights reserved.</p>

          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
