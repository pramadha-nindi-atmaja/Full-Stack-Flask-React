import { useState, useEffect } from "react";

const ContactForm = ({ existingContact = {}, updateCallback }) => {
  const [firstName, setFirstName] = useState(existingContact.firstName || "");
  const [lastName, setLastName] = useState(existingContact.lastName || "");
  const [email, setEmail] = useState(existingContact.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updating = Boolean(existingContact && existingContact.id);

  // Sync form values when editing contact changes
  useEffect(() => {
    setFirstName(existingContact.firstName || "");
    setLastName(existingContact.lastName || "");
    setEmail(existingContact.email || "");
  }, [existingContact]);

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const data = { firstName, lastName, email };
    const url = `http://127.0.0.1:5000/${
      updating ? `update_contact/${existingContact.id}` : "create_contact"
    }`;

    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      setLoading(true);
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Something went wrong.");
      } else {
        updateCallback();
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="contact-form">
      <h2>{updating ? "Edit Contact" : "Create New Contact"}</h2>

      {error && <p className="error-message">{error}</p>}

      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : updating ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default ContactForm;
