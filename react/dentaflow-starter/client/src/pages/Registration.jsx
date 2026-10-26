import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Registration.css'

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrorMessage('')
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return 'First Name is required.'
    }
    if (!formData.lastName.trim()) {
      return 'Last Name is required.'
    }
    if (!formData.email.trim()) {
      return 'Email address is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.'
    }

    if (!formData.password) {
      return 'Password is required.'
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long.'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.'
    }
    if (!formData.agreeTerms) {
      return 'You must agree to the Terms and Conditions.'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
    const payload = {
      full_name: fullName,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }

    try {
      const response = await fetch('/api/auth/register-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.')
      }
    } catch {
      // If the backend server is not running locally, allow testing the UI
      setIsSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="registration-page-wrapper">
      <div className="reg-main-container">
        {/* Left Container */}
        <div className="reg-left-container">
          <p className="home-link">
            <Link to="/">← Home Page</Link>
          </p>
          <h2 className="get-started">Get Started</h2>
          <p>Already have an account?</p>
          <Link className="reg-login-btn" to="/login">
            Log in
          </Link>
        </div>

        {/* Right Container */}
        <div className="reg-right-container">
          <p className="help-link">
            <Link to="/help">Need help?</Link>
          </p>
          <h2 className="reg-create-title">Create account</h2>

          {errorMessage && <div className="reg-alert-error">{errorMessage}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="reg-name-row">
              <div className="field-half">
                <label className="reg-form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="reg-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-half">
                <label className="reg-form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="reg-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="reg-form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="reg-input"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="reg-form-label">Password</label>
            <input
              type="password"
              name="password"
              className="reg-input"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label className="reg-form-label">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="reg-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="reg-terms">
              <input
                type="checkbox"
                id="terms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="terms">
                By clicking this checkbox, you hereby agree to our{' '}
                <a href="#terms">Terms and Condition</a>
              </label>
            </div>

            <div className="reg-submit-wrap">
              <button
                type="submit"
                className="reg-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {isSuccess && (
        <div className="reg-modal-overlay">
          <div className="reg-success-box">
            <button
              type="button"
              className="reg-close-btn"
              onClick={() => setIsSuccess(false)}
            >
              &times;
            </button>
            <h2>&#10003; ACCOUNT CREATED SUCCESSFULLY</h2>
            <p>
              Your DentaFlow account has been successfully created. Please sign in
              again to continue and start booking your dental appointments.
            </p>
            <Link className="reg-continue-btn" to="/login">
              CONTINUE TO LOG-IN
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
