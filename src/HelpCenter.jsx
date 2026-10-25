import { useState } from 'react'
import '../css/help-center-page.css'
import '../css/footer.css'

const helpCards = [
  {
    title: 'Frequently asked questions',
    text: 'Find quick answers to common questions about using DentaFlow. Learn how to create an account, book or manage an appointment, choose a dental service, and update your profile information.',
  },
  {
    title: 'Guides and Resources',
    text: 'Explore simple guides to help you use DentaFlow. Get step-by-step information on scheduling appointments, viewing appointment details, managing your account, and learning about the dental services available.',
  },
  {
    title: 'Support',
    text: 'Need additional help? Contact the DentaFlow support team for assistance with your account, appointments, or other concerns while using the website. You may also reach us at hello@dentaflow.com.',
  },
]

function HelpCenter() {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase()
  const isMatch = (card) =>
    q === '' ||
    card.title.toLowerCase().includes(q) ||
    card.text.toLowerCase().includes(q)
  const noResults = q !== '' && helpCards.every((card) => !isMatch(card))

  return (
    <>
      <img
        src="/dentaflow_logo.png"
        alt="DentaFlow Logo"
        style={{
          position: 'absolute',
          top: 0,
          left: '40px',
          width: '70px',
          height: '70px',
          objectFit: 'contain',
          borderRadius: '50%',
          zIndex: 10,
        }}
      />
      <h1
        style={{
          position: 'absolute',
          top: '20px',
          left: '115px',
          fontSize: '29px',
          lineHeight: 1,
          color: 'var(--blue)',
          fontWeight: 700,
          zIndex: 10,
        }}
      >
        DentaFlow
      </h1>
      <nav>
        <h2>
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/about-us">About Us</a>
          <a href="/help-center">Help Center</a>
          <a href="/login">Profile</a>
        </h2>
      </nav>
      <div className="page">
        <h2 className="page-title">Need some help?</h2>
        <p style={{ textAlign: 'center' }}>
          <input
            id="help-search"
            type="text"
            placeholder="Type to search"
            size="40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>
        <p className={`no-results${noResults ? ' show' : ''}`}>No results found.</p>
        <br />
        <br />
        <table className="page-table" width="100%" cellPadding="20">
          <tbody>
            <tr>
              {helpCards.map((card) => (
                <td
                  key={card.title}
                  className={`help-card${isMatch(card) ? '' : ' hidden'}`}
                  width="33%"
                  valign="top"
                >
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <footer className="dentaflow-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-brand-header">
                <img
                  src="/dentaflow_logo.png"
                  alt="DentaFlow Logo"
                  className="footer-logo"
                />
                <h2>DentaFlow</h2>
              </div>
              <p>
                Modern dental care that fits your schedule. Book, manage, and
                track your appointments with ease.
              </p>
            </div>
            <div className="footer-column">
              <h3>Services</h3>
              <ul>
                <li><a href="#">General Checkup</a></li>
                <li><a href="#">Teeth Whitening</a></li>
                <li><a href="#">Orthodontics</a></li>
                <li><a href="#">Implants</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><a href="/about-us">About Us</a></li>
                <li><a href="#">Our Team</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact</h3>
              <ul>
                <li><a href="mailto:hello@dentaflow.com">hello@dentaflow.com</a></li>
                <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                <li><p>Mon – Sat, 8AM – 6PM</p></li>
                <li><p>3 city locations</p></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 DentaFlow. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default HelpCenter
