import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Local TCG Marketplace</h1>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>What is Local TCG Marketplace?</h2>
        <p style={styles.text}>
          Local TCG Marketplace is a platform that helps Trading Card Game players instantly find
          and pick up individual cards (singles) from nearby stores or community sellers. Whether
          you're building a deck for an upcoming event or completing your collection, our
          geo-search technology makes it easy to find exactly what you need, close to home.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Key Features</h2>
        <ul style={styles.featureList}>
          <li style={styles.feature}>
            <strong>🔍 Smart Search:</strong> Search for specific cards by name, set, condition,
            and price range
          </li>
          <li style={styles.feature}>
            <strong>📍 Geo-Location:</strong> Find sellers within your desired radius using
            location-based search
          </li>
          <li style={styles.feature}>
            <strong>🏪 POS Integration:</strong> Seamless integration with popular shop management
            systems (Square, Shopify, Crystal Commerce, TCGPlayer)
          </li>
          <li style={styles.feature}>
            <strong>📊 Real-time Inventory:</strong> Automated inventory sync ensures accurate
            stock availability
          </li>
          <li style={styles.feature}>
            <strong>🃏 Singles-Only Enforcement:</strong> Focused exclusively on individual card
            sales for efficient deck building
          </li>
          <li style={styles.feature}>
            <strong>🗺️ Interactive Maps:</strong> Visualize seller locations and plan your pickup
            route
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>For Sellers</h2>
        <p style={styles.text}>
          Are you a local game store or community seller? Join our marketplace to reach more
          customers in your area. Our platform integrates with your existing POS system, making it
          easy to list your inventory and manage sales.
        </p>
        <div style={styles.callout}>
          <p>
            <strong>Supported POS Systems:</strong>
          </p>
          <ul>
            <li>Square</li>
            <li>Shopify</li>
            <li>Crystal Commerce</li>
            <li>Binding Edge</li>
            <li>TCGPlayer</li>
            <li>Custom integrations available</li>
          </ul>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Technology Stack</h2>
        <p style={styles.text}>
          Built with modern, reliable technologies:
        </p>
        <ul style={styles.techList}>
          <li>TypeScript for type-safe development</li>
          <li>React for the frontend interface</li>
          <li>Node.js and Express for the backend API</li>
          <li>SQLite for local-first data storage</li>
          <li>Leaflet for interactive mapping</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subtitle}>Get Started</h2>
        <p style={styles.text}>
          Ready to find your next card? Head to the{' '}
          <a href="/" style={styles.link}>
            Search page
          </a>{' '}
          to start exploring local inventory. Enable location services for the best experience!
        </p>
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px 40px',
  },
  title: {
    fontSize: '36px',
    marginBottom: '30px',
    color: '#333',
  },
  section: {
    marginBottom: '40px',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '15px',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
  },
  feature: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '12px',
    paddingLeft: '10px',
  },
  techList: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#555',
    paddingLeft: '30px',
  },
  callout: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    marginTop: '15px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default AboutPage;
