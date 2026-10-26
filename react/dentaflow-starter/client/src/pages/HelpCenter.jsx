import { useState } from 'react'
import '../css/Help-center.css'

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

export default function HelpCenter() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const isMatch = (card) =>
    q === '' ||
    card.title.toLowerCase().includes(q) ||
    card.text.toLowerCase().includes(q)

  const noResults = q !== '' && helpCards.every((card) => !isMatch(card))

  return (
    <div className="help-center-page">
      <h2 className="help-title">Need some help?</h2>

      <div className="search-container">
        <input
          id="help-search"
          type="text"
          placeholder="Type to search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <p className={`no-results${noResults ? ' show' : ''}`}>No results found.</p>

      <div className="help-cards-grid">
        {helpCards.map((card) => (
          <div
            key={card.title}
            className={`help-card${isMatch(card) ? '' : ' hidden'}`}
          >
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
